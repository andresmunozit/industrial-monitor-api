test.todo('Implement validateQuery test suite');

const mongoose = require('mongoose');
const app = require('../../src/app');
const request = require('supertest');
const { validateQuery, ALLOWED_FILTER_QUERY_OPERATORS } = require('../../src/middleware/validateQuery');

describe('For a set of allowed fields, and default parameters', () => {

    app.get('/test1', validateQuery(['param1', 'param2'], [...ALLOWED_FILTER_QUERY_OPERATORS, '$testValidOperator']), (req, res) => {
        res.json(req.validatedQuery);
    });

    // filter
    test('Should return status 400 and a body message if not allowed parameters are queried in the filter', async () => {
        const response = await request(app)
            .get('/test1?filter[param1]=param1&filter[param3]=param3')
            .send()
            .expect(400);
        expect(response.body.msg)
            .toBe('Not allowed field(s): param3. "filter" parameter validation.')
    });

    test('Should return status 200 if allowed parameters are queried in the filter', async () => {
        const response = await request(app)
            .get('/test1?filter[param2]=param2&filter[param1]=param1')
            .send()
            .expect(200);
        expect(response.body.filter).toEqual({
            param2: 'param2',
            param1: 'param1',
        });
    });

    test('Should return status 400 and a body message if wrong query operators are sent', async () => {
        const response = await request(app)
            .get('/test1?filter[param2][$test1]=test1&filter[param2][test2]=test2&filter[param1][$test3]=test3&filter[param1][$gte]=15')
            .send()
            .expect(400);
        expect(response.body.msg)
            .toBe('Not allowed operator(s): $test1, test2, $test3. "filter" parameter validation.');
    });

    test('Should return status 200 if allowed query operators are sent for filter', async () => {
        const response = await request(app)
            .get('/test1?filter[param2][$eq]=test1&filter[param2][$in]=test2&filter[param1][$testValidOperator]=test3&filter[param1][$gte]=15')
            .send()
            .expect(200);
        expect(response.body.filter).toEqual({
            param2: {
                $eq: 'test1',
                $in: 'test2'
            },
            param1: {
                $testValidOperator: 'test3',
                $gte: '15'
            },
        });
    });

    // sort
    test('Should return status 400 and a body message if a not allowed param is sent in a sort query', async () => {
        const response = await request(app)
            .get('/test1?filter[param2][$eq]=test1&filter[param2][$in]=test2&filter[param1][$testValidOperator]=test3&filter[param1][$gte]=15&sort[param3]=1&sort[param1]=-1&sort[param5]')
            .send()
            .expect(400);
        expect(response.body.msg).toBe('Not allowed field(s): param3, param5. "sort" parameter validation.')
    });

    test('Should return status 400 and a message body when not numeric values are used in sort', async () => {
        const response = await request(app)
            .get('/test1?filter[param2][$eq]=test1&filter[param2][$in]=test2&filter[param1][$testValidOperator]=test3&filter[param1][$gte]=15&sort[param1]=1&sort[param2]=test')
            .send()
            .expect(400);
        expect(response.body.msg).toBe('Sort can be equals to -1, 0 or 1. Instead "test" was received for field "param2". "sort" parameter validation.');
    });

    test('Should return status 400 and a message body when numbers different from -1, 0 or 1 are used in sort', async () => {
        const response = await request(app)
            .get('/test1?filter[param2][$eq]=test1&filter[param2][$in]=test2&filter[param1][$testValidOperator]=test3&filter[param1][$gte]=15&sort[param1]=22&sort[param2]=-3')
            .send()
            .expect(400);
        expect(response.body.msg).toBe('Sort can be equals to -1, 0 or 1. Instead "22" was received for field "param1". "sort" parameter validation.');
    });

    test('Should return status 200 when allowed parameters are sorted', async () => {
        const response = await request(app)
            .get('/test1?filter[param2][$eq]=test1&filter[param2][$in]=test2&filter[param1][$testValidOperator]=test3&filter[param1][$gte]=15&sort[param1]=-1&sort[param2]=1')
            .send()
            .expect(200);
        expect(response.body.sort).toEqual({
            param1: -1,
            param2: 1
        });
    });

    // limit
    test('Should return status 400 when limit is not a number', async () => {
        const response = await request(app)
            .get('/test1?filter[param2][$eq]=test1&filter[param2][$in]=test2&filter[param1][$testValidOperator]=test3&filter[param1][$gte]=15&sort[param1]=-1&sort[param2]=1&limit=test')
            .send()
            .expect(400);
        expect(response.body.msg).toBe('"limit" must be a positive integer, "test" received instead. "limit" parameter validation.');
    });

    test('Should return status 400 and a body message if limit is our of the allowed range (0 - 100 by default)', async () => {
        const response = await request(app)
            .get('/test1?filter[param2][$eq]=test1&filter[param2][$in]=test2&filter[param1][$testValidOperator]=test3&filter[param1][$gte]=15&sort[param1]=-1&sort[param2]=1&limit=120')
            .send()
            .expect(400);
        expect(response.body.msg).toBe('"limit" must be an integer between 0 and 100, "120" received instead. "limit" parameter validation.');
    });

    test('Should return status 200 if the limit parameter is correct', async () => {
        const response = await request(app)
            .get('/test1?filter[param2][$eq]=test1&filter[param2][$in]=test2&filter[param1][$testValidOperator]=test3&filter[param1][$gte]=15&sort[param1]=-1&sort[param2]=1&limit=85')
            .send()
            .expect(200);
        expect(response.body.limit).toBe(85);
    });

    test('Should return status 400 and a body message if limit parameter is sent more than once', async () => {
        const response = await request(app)
            .get('/test1?filter[param2][$eq]=test1&filter[param2][$in]=test2&filter[param1][$testValidOperator]=test3&filter[param1][$gte]=15&sort[param1]=-1&sort[param2]=1&limit=85&limit=55&limit=test')
            .send()
            .expect(400);
        expect(response.body.msg).toBe('A single value is supported for "limit" parameter, instead "85, 55, test" were provided. "limit" parameter validation.');
    });

    // skip
    test('Should return status 200 and skip parameter set to zero if no skip parameter is provided', async () => {
        const response = await request(app)
            .get('/test1?filter[param2][$eq]=test1&filter[param2][$in]=test2&filter[param1][$testValidOperator]=test3&filter[param1][$gte]=15&sort[param1]=-1&sort[param2]=1&limit=85')
            .send()
            .expect(200);
        expect(response.body.skip).toBe(0);
    });

    test('Should return status 400 and a message body if more than one skip value is provided', async () => {
        const response = await request(app)
            .get('/test1?filter[param2][$eq]=test1&filter[param2][$in]=test2&filter[param1][$testValidOperator]=test3&filter[param1][$gte]=15&sort[param1]=-1&sort[param2]=1&limit=85&skip=20&skip=30')
            .send()
            .expect(400);
        expect(response.body.msg)
            .toBe('A single value is supported for "skip" parameter, instead "20, 30" were provided. "skip" parameter validation.');
    });

    test('Should return status 400 and a message body if skip is not an integer', async () => {
        const response = await request(app)
            .get('/test1?filter[param2][$eq]=test1&filter[param2][$in]=test2&filter[param1][$testValidOperator]=test3&filter[param1][$gte]=15&sort[param1]=-1&sort[param2]=1&limit=85&skip=test')
            .send()
            .expect(400);
        expect(response.body.msg)
            .toBe('"skip" must be a positive integer, "test" value was received instead. "skip" parameter validation.');
    });

    test('Should return status 400 and a message body if skip is out of range (0 - 2^31)', async () => {
        const response1 = await request(app)
            .get(`/test1?filter[param2][$eq]=test1&filter[param2][$in]=test2&filter[param1][$testValidOperator]=test3&filter[param1][$gte]=15&sort[param1]=-1&sort[param2]=1&limit=85&skip=${Math.pow(2, 32)}`)
            .send()
            .expect(400);
        expect(response1.body.msg)
            .toBe(`"skip" must be an integer between 0 and 2^31, "${Math.pow(2, 32)}" value was received instead. "skip" parameter validation.`);

        const response2 = await request(app)
            .get(`/test1?filter[param2][$eq]=test1&filter[param2][$in]=test2&filter[param1][$testValidOperator]=test3&filter[param1][$gte]=15&sort[param1]=-1&sort[param2]=1&limit=85&skip=-3`)
            .send()
            .expect(400);
        expect(response2.body.msg)
            .toBe(`"skip" must be an integer between 0 and 2^31, "-3" value was received instead. "skip" parameter validation.`);
    });

    test('Should return status 200 and if a correct skip parameter is provided', async () => {
        const response = await request(app)
            .get(`/test1?filter[param2][$eq]=test1&filter[param2][$in]=test2&filter[param1][$testValidOperator]=test3&filter[param1][$gte]=15&sort[param1]=-1&sort[param2]=1&limit=85&skip=100`)
            .send()
            .expect(200);
        expect(response.body.skip).toBe(100);
    });

    // All validatedQuery
    test('Should return status 200 and if all the query parameters are correct', async () => {
        const response = await request(app)
            .get(`/test1?filter[param2][$eq]=test1&filter[param2][$in]=test2&filter[param1][$testValidOperator]=test3&filter[param1][$gte]=15&sort[param1]=-1&sort[param2]=1&limit=85&skip=300`)
            .send()
            .expect(200);
        expect(response.body).toEqual({
            filter: {
                param2: {
                    $eq: 'test1',
                    $in: 'test2'
                },
                param1: {
                    $testValidOperator: 'test3',
                    $gte: '15'
                },
            },
            sort: {
                param1: -1,
                param2: 1,
            },
            limit: 85,
            skip: 300,
        });
    });
});

afterAll(() => {
    return mongoose.connection.close();
});
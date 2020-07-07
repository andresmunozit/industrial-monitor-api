test.todo('Implement validateQuery test suite');

const mongoose = require('mongoose');
const app = require('../../src/app');
const request = require('supertest');
const { validateQuery, ALLOWED_FILTER_QUERY_OPERATORS } = require('../../src/middleware/validateQuery');

describe('For a set of allowed fields, and default parameters', () => {

    app.get('/test1', validateQuery(['param1', 'param2'], [...ALLOWED_FILTER_QUERY_OPERATORS, '$testValidOperator']), (req, res) => {
        res.json('ok');
    });

    test('Should return status 400 and a body message if not allowed parameters are queried in the filter', async () => {
        const response = await request(app)
            .get('/test1?filter[param1]=param1&filter[param3]=param3')
            .send()
            .expect(400);
        expect(response.body.msg)
            .toBe('Not allowed field(s): param3. "filter" parameter validation.')
    });

    test('Should return 200 if allowed parameters are queried in the filter', async () => {
        const response = await request(app)
            .get('/test1?filter[param2]=param2,filter[param1]=param1')
            .send()
            .expect(200);
    });

    test('Should return 400 and a body message if wrong query operators are sent', async () => {
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
    });

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
    });

    test('Should return status 400 when limit is not a number', async () => {
        const response = await request(app)
            .get('/test1?filter[param2][$eq]=test1&filter[param2][$in]=test2&filter[param1][$testValidOperator]=test3&filter[param1][$gte]=15&sort[param1]=-1&sort[param2]=1&limit=test')
            .send()
            .expect(400);
        expect(response.body.msg).toBe('"limit" must be a positive integer, "test" received instead. "limit" parameter validation.');
    });

    test.todo('Test duplicated parameters');
});

afterAll(() => {
    return mongoose.connection.close();
});
const app = require('../../src/app');
const mongoose = require('mongoose');
const request = require('supertest');
const allowedQueryParams = require('../../src/middleware/allowedQueryParams');
const { param } = require('../../src/routers/api');

describe('When allowed query params is used into a route', () => {

    app.get('/test1', allowedQueryParams('param1', 'param2'), (req, res) => {
        const resObject = {};
        res.json('ok');
    });

    test('Should return 400 and a message body if a query parameter is not allowed', async () => {
        const response = await request(app)
            .get('/test1?param3=param3&param4=param4&param1=param1')
            .send()
            .expect(400);
        expect(response.body.msg).toBe('Illegal query parameter(s): param3, param4.');
    });

    test('Should return status 200 if the params are correct', async () => {
        const response = await request(app)
            .get('/test1?param1=param1&param2=param2')
            .send()
            .expect(200)
        expect(response.body).toBe('ok');
    });

});

test('Should throw an error when no arguments are passed into the route', () => {
    expect(() => {
        app.get('/test2', allowedQueryParams(), (req, res) => {
            res.json('ok');
        });
    }).toThrow('You must provide at least one allowed parameter');
});

afterAll(() => {
    return mongoose.connection.close();
});
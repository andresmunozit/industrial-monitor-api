const allowedBodyParams = require('../../src/middleware/allowedBodyParams');
const app = require('../../src/app');
const request = require('supertest');
const mongoose = require('mongoose');

test('Should allow the specified parameters', async () => {
    app.get('/testAllowedBodyParams1', allowedBodyParams('param1', 'param2', 'param3'), (req, res) => {
        res.json('ok');
    });

    const response = await request(app)
        .get('/testAllowedBodyParams1')
        .send({param1: 'value1', param2: 'value2'})
        .expect(200);

    expect(response.body).toBe('ok');
});

test('Should return status 400 and a body message if not allowed parameters are sent in the body', async () => {
    app.get('/testAllowedBodyParams2', allowedBodyParams('param1', 'param2'), (req, res) =>{
        res.json(ok);
    });

    const response = await request(app)
        .get('/testAllowedBodyParams2')
        .send({param3: 'value3', param4: 'value4'})
        .expect(400);

    expect(response.body.msg).toBe('Illegal body parameter(s): param3, param4');
});

test('Should throw an error when no parameters are defined', () => {
    try{
        allowedBodyParams();
    } catch(e){
        expect(e).toBe('You must provide at least one allowed parameter');
    };
});

test('Should throw an error if any parameter contains spaces', () => {
    try{
        allowedBodyParams('parameter one', 'parameter2');
    } catch(e){
        expect(e).toBe('Allowed body parameters cannot contain spaces');
    };
});

test('Should throw an error if any parameter contains special characters', () => {
    try{
        allowedBodyParams('te$tParameter');
    } catch(e){
        expect(e).toBe('Allowed body parameters cannot contain special characters');
    };
});

afterAll(() => {
    return mongoose.connection.close();
});
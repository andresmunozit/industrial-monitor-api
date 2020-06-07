const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

test('Should return a message', async () => {
    const response = await request(app)
        .get('/')
        .send()
        .expect(200);

    expect(response.body).toBe('App running...');
});

afterAll(() => {
    return mongoose.connection.close();
});
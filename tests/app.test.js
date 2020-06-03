const request = require('supertest');
const app = require('../src/app');

test('Should return a message', async () => {
    const response = await request(app)
        .get('/')
        .send()
        .expect(200);

    expect(response.body).toBe('App running...');
});
const request = require('supertest');
const app = require('../../src/app');
const checkId = require('../../src/middleware/checkId');
const mongoose = require('mongoose');

test('Should return status 404 if a wrong id format is sent into the id parameter', async () => {
    app.get('/checkIdTest1/:id', checkId, (req, res) => {
        res.json('ok');
    });

    const wrongId  = '1234567890asdfghjk';
    const response = await request(app)
        .get(`/checkIdTest1/${wrongId}`)
        .send()
        .expect(404);
});

test('Should call to next, and return status 200 if a correct format id is specified', async () => {
    app.get('/checkIdTest2/:id', checkId, (req, res) => {
        res.json('ok');
    });

    const correctId = new mongoose.Types.ObjectId();

    const response = await request(app)
        .get(`/checkIdTest2/${correctId}`)
        .send()
        .expect(200);

    expect(response.body).toBe('ok');
});

afterAll(() => {
    return mongoose.connection.close();
});
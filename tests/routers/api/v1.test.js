const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../src/app');
const User = require('../../../src/models/user');
const { userTwo, setupDatabase } = require('../../fixtures/db');

beforeEach( setupDatabase );

// Login tests
test('Should authenticate a user', async () => {
    const user = userTwo;
    const response = await request(app)
        .post('/api/v1/login')
        .send({
            email: user.email,
            password: user.password
        })
        .expect(200);

    const userDB = await User.findById(user._id);
        
    expect(response.body.user._id).toBe(user._id.toString());
    expect(response.body.token).toBe(userDB.tokens[0].token);
});

test('Should not authenticate a user with wrong username', async () => {
    const user = userTwo;
    const response = await request(app)
        .post('/api/v1/login')
        .send({
            email: 'wrong@email.com',
            password: user.password
        })
        .expect(403);

    expect(response.body.msg).toBe('Wrong credentials');
});

test('Should not authenticate a user with wrong password', async () => {
    const user = userTwo;
    const response = await request(app)
        .post('/api/v1/login')
        .send({
            email: user.email,
            password: 'wrong password'
        })
        .expect(403);

    expect(response.body.msg).toBe('Wrong credentials');
});

// Logout tests
test('Should logout a logged in user', async () => {
    const user = userTwo;

    const loginResponse = await request(app)
        .post('/api/v1/login')
        .send({
            email: user.email,
            password: user.password
        })
        .expect(200);

    const token = loginResponse.body.token;
    const userDBBeforeLogout = await User.findById(user._id);
    expect(userDBBeforeLogout.validToken(token)).toBe(true);

    const logoutResponse = await request(app)
        .get('/api/v1/logout')
        .set('Authorization', 'Bearer ' + token)
        .send()
        .expect(200);

    const userDBAfterLogout = await User.findById(user._id);
    expect(userDBAfterLogout.validToken(token)).toBe(false);
});

test('Should receive "Not authorized" after logout', async () => {
    const user = userTwo;
    const loginResponse = await request(app)
        .post('/api/v1/login')
        .send({
            email: user.email,
            password: user.password
        })
        .expect(200);
    const token = loginResponse.body.token;    

    const logoutResponse = await request(app)
        .get('/api/v1/logout')
        .set('Authorization', 'Bearer ' + token)
        .send()
        .expect(200);

    const notAuthorizedResponse = await request(app)
        .get('/api/v1/logout')
        .set('Authorization', 'Bearer ' + token)
        .send()
        .expect(403);
    expect(notAuthorizedResponse.body.msg).toBe('Not authorized');
});

afterAll(() => {
    return mongoose.connection.close();
});
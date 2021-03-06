const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const faker = require('faker');
const User = require('../../src/models/user');
const auth = require('../../src/middleware/auth');
const { mockUsers } = require('../fixtures/database');

const TEST_AUTH_ROUTE = '/testAuth';

beforeAll( () => { // Create auth route
    app.get(TEST_AUTH_ROUTE, auth, (req, res) => {
        res.json({user: req.user, token: req.token});
    });
});

describe('Once a user is logged in and has an active token', () => {
    test('Should return a user and a token when the auth token is right', async () => {
        const { users } = await mockUsers({});
        const testUser = users[0];
        
        const user = await User.findById(testUser._id);
        const token = user.tokens[0].token;
        const res = await request(app)
            .get(TEST_AUTH_ROUTE)
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(200);
        expect(res.body.user._id).toBe(testUser._id.toString());
        expect(res.body.token).toBe(token);
    });

    test('Should return 403 when a wrong token is used', async () => {
        const randomToken = faker.random.alphaNumeric(120);
        const res = await request(app)
            .get(TEST_AUTH_ROUTE)
            .set('Authorization', `Bearer ${randomToken}`)
            .send()
            .expect(403)
    });
});

afterAll(() => {
    return mongoose.connection.close();
});
const request = require('supertest');
const mongoose = require('mongoose');
const faker = require('faker');
const User = require('../../../src/models/user');
const app = require('../../../src/app');
const { mockUsers } = require('../../fixtures/database');

const LOGIN_ROUTE = '/api/v1/login';
const LOGOUT_ROUTE = '/api/v1/logout';

describe('For existent users', () => {
    test('Should authenticate a user', async () => {
        const {users} = await mockUsers({login: false});
        const testUser = users[0];
        const {email, password} = testUser;
        
        const res = await request(app)
            .post(LOGIN_ROUTE)
            .send({email, password})
            .expect(200)

        const {user, token} = res.body;

        expect(user._id).toBe(testUser._id.toString());
        
        const testDbUser = await User.findById(testUser._id);
        expect(token).toBe(testDbUser.tokens[0].token);
    });

    test('Should not authenticate a user with wrong credentials', async () => {
        const {users} = await mockUsers({login: false});
        const {email, password} = users[0];

        const res1 = await request(app)
            .post(LOGIN_ROUTE)
            .send({
                emai: faker.random.word() + email,
                password
            })
            .expect(403);

        expect(res1.body.msg).toBe('Wrong credentials');

        const res2 = await request(app)
        .post(LOGIN_ROUTE)
        .send({
            email,
            password: faker.random.word() + password
        })
        .expect(403);

        expect(res2.body.msg).toBe('Wrong credentials');

        const res3 = await request(app)
        .post(LOGIN_ROUTE)
        .send({
            email: faker.random.word() + email,
            password: faker.random.word() + password
        })
        .expect(403);

        expect(res3.body.msg).toBe('Wrong credentials');
    })

});

describe('Once a user have logged in', () => {
    test('Should be able to logout once', async () => {
        const {users} = await mockUsers({login: false})
        const {email, password} = users[0];
        
        const loginRes = await request(app)
            .post(LOGIN_ROUTE)
            .send({email, password})
            .expect(200)
        
        const {token} = loginRes.body;

        await request(app)
            .get(LOGOUT_ROUTE)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        const logoutAgainRes = await request(app)
            .get(LOGOUT_ROUTE)
            .set('Authorization', `Bearer ${token}`)
            .expect(403)

        expect(logoutAgainRes.body.msg).toBe('Not authorized');
    });
});

afterAll(() => {
    return mongoose.connection.close();
});
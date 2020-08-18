const app = require('../../src/app');
const request = require('supertest');
const auth = require('../../src/middleware/auth');
const allowedRoles = require('../../src/middleware/allowedRoles');
const User = require('../../src/models/user');
const { mockUsers } = require('../fixtures/database');
const mongoose = require('mongoose');

const TEST_ADMIN_ROUTE = '/testAdminRoute';
const TEST_USER_ROUTE = '/testUserRoute';
const TEST_USER_ADMIN_ROUTE = '/testUserAdminRoute';

beforeAll(() => {
    app.get(TEST_ADMIN_ROUTE, auth, allowedRoles(User.ROLE.ADMIN), (req, res) => {
        res.json();
    });
    app.get(TEST_USER_ROUTE, auth, allowedRoles(User.ROLE.USER), (req, res) => {
        res.json();
    });
    app.get(TEST_USER_ADMIN_ROUTE, auth, allowedRoles(User.ROLE.USER, User.ROLE.ADMIN), (req, res) => {
        res.json();
    });
});

describe('Once a user has logged in and has an active token', () => {
    test('Should authorize admin only', async () => {
        const { users: admins } = await mockUsers({role: User.ROLE.ADMIN});
        const { users } = await mockUsers({clean: false});
        const testAdmin = admins[0];
        const testUser = users[0];
        
        const resAdmin = await request(app)
            .get(TEST_ADMIN_ROUTE)
            .set('Authorization', `Bearer ${testAdmin.token}`)
            .send()
            .expect(200);

        const resUser = await request(app)
            .get(TEST_ADMIN_ROUTE)
            .set('Authorization', `Bearer ${testUser.token}`)
            .send()
            .expect(403);
        expect(resUser.body.msg).toBe('Not authorized');
    });

    test('Should authorize user only', async () => {
        const { users: admins } = await mockUsers({role: User.ROLE.ADMIN});
        const { users } = await mockUsers({clean: false});
        const testAdmin = admins[0];
        const testUser = users[0];
        
        const resAdmin = await request(app)
            .get(TEST_USER_ROUTE)
            .set('Authorization', `Bearer ${testAdmin.token}`)
            .send()
            .expect(403);
        expect(resAdmin.body.msg).toBe('Not authorized');

        const resUser = await request(app)
            .get(TEST_USER_ROUTE)
            .set('Authorization', `Bearer ${testUser.token}`)
            .send()
            .expect(200);
    });

    test('Should authorize admin and user', async () => {
        const { users: admins } = await mockUsers({role: User.ROLE.ADMIN});
        const { users } = await mockUsers({clean: false});
        const testAdmin = admins[0];
        const testUser = users[0];
        
        const resAdmin = await request(app)
            .get(TEST_USER_ADMIN_ROUTE)
            .set('Authorization', `Bearer ${testAdmin.token}`)
            .send()
            .expect(200);

        const resUser = await request(app)
            .get(TEST_USER_ADMIN_ROUTE)
            .set('Authorization', `Bearer ${testUser.token}`)
            .send()
            .expect(200);
    });
});

afterAll(() => {
    return mongoose.connection.close();
});
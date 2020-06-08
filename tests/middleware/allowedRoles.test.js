const app = require('../../src/app');
const request = require('supertest');
const auth = require('../../src/middleware/auth');
const allowedRoles = require('../../src/middleware/allowedRoles');
const User = require('../../src/models/user');
const { userTwo, userThree, setupDatabase } = require('../fixtures/db');
const mongoose = require('mongoose');

beforeEach(setupDatabase);

test('Should authorize "admin" only', async () => {
    app.use('/testAdminRoute', auth);
    app.use('/testAdminRoute', allowedRoles(
        User.ROLE.ADMIN
    ));

    app.get('/testAdminRoute', (req, res) => {
        res.json({msg: 'Only admin is authorized'});
    });

    const user = await User.findById(userTwo._id);
    const userToken = await user.createToken();

    const admin = await User.findById(userThree._id);
    const adminToken = await admin.createToken();

    const adminResponse = await request(app)
        .get('/testAdminRoute')
        .set('Authorization', 'Bearer ' + adminToken)
        .send()
        .expect(200)
    expect(adminResponse.body.msg).toBe('Only admin is authorized');

    const userResponse = await request(app)
        .get('/testAdminRoute')
        .set('Authorization', 'Bearer ' + userToken)
        .send()
        .expect(403)
    expect(userResponse.body.msg).toBe('Not authorized');
});

test('Should authorize "user" only', async () => {

    app.get('/testUserRoute', auth, allowedRoles(User.ROLE.USER), (req, res) => {
        res.json({msg: 'Only user is authorized'});
    });

    const user = await User.findById(userTwo._id);
    const userToken = await user.createToken();

    const admin = await User.findById(userThree._id);
    const adminToken = await admin.createToken();

    const adminResponse = await request(app)
        .get('/testUserRoute')
        .set('Authorization', 'Bearer ' + adminToken)
        .send()
        .expect(403)
    expect(adminResponse.body.msg).toBe('Not authorized');

    const userResponse = await request(app)
        .get('/testUserRoute')
        .set('Authorization', 'Bearer ' + userToken)
        .send()
        .expect(200)
    expect(userResponse.body.msg).toBe('Only user is authorized');
});

test('Should authorize "admin" and "user"', async () => {

    app.get('/testAdminAndUserRoute', auth, allowedRoles(User.ROLE.USER, User.ROLE.ADMIN), (req, res) => {
        res.json({msg: 'Admin and user are authorized'});
    });

    const user = await User.findById(userTwo._id);
    const userToken = await user.createToken();

    const admin = await User.findById(userThree._id);
    const adminToken = await admin.createToken();

    const adminResponse = await request(app)
        .get('/testAdminAndUserRoute')
        .set('Authorization', 'Bearer ' + adminToken)
        .send()
        .expect(200)
    expect(adminResponse.body.msg).toBe('Admin and user are authorized');

    const userResponse = await request(app)
        .get('/testAdminAndUserRoute')
        .set('Authorization', 'Bearer ' + userToken)
        .send()
        .expect(200)
    expect(userResponse.body.msg).toBe('Admin and user are authorized');
});

afterAll(() => {
    return mongoose.connection.close();
});
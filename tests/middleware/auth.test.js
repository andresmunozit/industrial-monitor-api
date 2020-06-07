const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/user');
const auth = require('../../src/middleware/auth');
const { userTwo, setupDatabase } = require('../fixtures/db');

beforeEach( setupDatabase );

beforeEach( () => {
    app.get('/testAuth', auth, (req, res) => {
        res.json({user: req.user, token: req.token});
    });
});

beforeEach( async () => {
    const user = await User.findById(userTwo._id);
    await user.createToken();
});

test('Should return a user and a token when the token is right', async () => {
    const user = await User.findById(userTwo._id);
    const token = user.tokens[0].token; 

    const authResponse = await request(app)
        .get('/testAuth')
        .set('Authorization', 'Bearer ' + token)
        .send()
        .expect(200);

    expect(authResponse.body.user._id).toBe(userTwo._id.toString());
    expect(authResponse.body.token).toBe(token);

});

test('Should return 403 with a wrong token', async () => {
    const user = await User.findById(userTwo._id);
    const token = user.tokens[0].token; 
    
    const authResponse = await request(app)
        .get('/testAuth')
        .set('Authorization', 'Bearer wrong token')
        .send()
        .expect(403);

    expect(authResponse.body.msg).toBe('Not authorized');

});

test('Should return 403 with no Authorization header', async () => {
    const user = await User.findById(userTwo._id);
    const token = user.tokens[0].token; 
    
    const authResponse = await request(app)
        .get('/testAuth')
        .send()
        .expect(403);

    expect(authResponse.body.msg).toBe('Not authorized');
});

test('Should return 403 if Authorization header is not a Bearer token', async () => {
    const user = await User.findById(userTwo._id);
    const token = user.tokens[0].token; 
    
    const authResponse = await request(app)
        .get('/testAuth')
        .set('Authorization', 'No Bearer...')
        .send()
        .expect(403);

    expect(authResponse.body.msg).toBe('Not authorized');
});

afterAll(() => {
    return mongoose.connection.close();
});

// const loginResponse = await request(app)
//     .post('/api/v1/login')
//     .send({
//         email: userTwo.email,
//         password: userTwo.password
//     })
//     .expect(200);

// const token = loginResponse.body.token;
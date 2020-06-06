require('../../src/db/mongoose'); 
const mongoose = require('mongoose');

const User = require('../../src/models/user');
const bcrypt = require('bcryptjs');
const {userOne, userTwo, setupDatabase} = require('../fixtures/db');

beforeEach(setupDatabase);

test('Should encrypt the password before save a user', async () => {
    const user = new User(userOne);

    await user.save();
    const dbUser = await User.findById(userOne._id);

    const comparation = await bcrypt.compare(userOne.password, dbUser.password);
    expect(comparation).toBe(true);
});

test('Should return a user using the right credentials', async () => {
    const user = await User.getUserByCredentials(userTwo.email, userTwo.password);
    expect(user._id).toEqual(userTwo._id);
});

test('Should return null whith wrong credentials', async () => {
    const user = await User.getUserByCredentials(userTwo.email, 'wrong password');
    expect(user).toBe(null);
});

test('Should emit a token', async () => {
    const user = await new User(userOne).save();
    const token = await user.createToken();

    const dbUser = await User.findById(userOne._id);
    expect(token).toBe(dbUser.tokens[0].token);
});

test.todo('Should verify the email address');

afterAll(() => {
    return mongoose.connection.close();
});
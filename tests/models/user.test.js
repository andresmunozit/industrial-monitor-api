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

test('Should create a token', async () => {
    const user = await new User(userOne).save();
    const token = await user.createToken();

    const dbUser = await User.findById(userOne._id);
    expect(token).toBe(dbUser.tokens[0].token);
});

test('Should verify the email address', async () =>{
    userOne.email = 'wrong email';
    try{
        const user = await new User(userOne).save();
    } catch (error){
        expect(error.message).toBe('User validation failed: email: wrong email is not a valid email');
    };
});

test('Should verify if a token is in the tokens array', async () => {
    const user = await User.findById(userTwo._id);
    const token = await user.createToken();

    expect(user.validToken(token)).toBe(true);
    expect(user.validToken('wrong token')).toBe(false);
    expect(user.validToken('')).toBe(false);
});

test('Should delete a token from user tokens', async () => {
    const user = await User.findById(userTwo._id);
    const token1 = await user.createToken();
    const token2 = await user.createToken();
    const token3 = await user.createToken();
    const token4 = await user.createToken();
    expect(user.tokens.length).toBe(4);

    expect(user.validToken(token3)).toBe(true);

    await user.deleteToken(token3);
    expect(user.validToken(token3)).toBe(false);
    expect(user.tokens.length).toBe(3);
});

test('Should throw an error if a deletion of a non-existent token is attempted', async () => {
    const user = await User.findById(userTwo._id);
    const token = await user.createToken();
    try{
        await user.deleteToken('wrong token');
    }catch(error){
        expect(error).toBe('Token doesn\'t exist');
    };
});

test('Test length validations', async () => {

    const newUser = {
        email: 'test@example.com',
        name: 'test',
        lastname: 'test',
        role: 'user',
        password: '1234567',  
    };

    const newUser1 = Object.create(newUser);
    newUser1.email = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.com';
    const user1 = new User(newUser1);
    try{
        const savedUser = await user1.save();
        expext(savedUser).toBe(undefined);
    } catch (e){
        expect(e.errors.email.properties.message).toBe('The email is too long');
    };

    const newUser2 = Object.create(newUser);
    newUser2.name = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const user2 = new User(newUser2);
    try{
        const savedUser = await user2.save();
        expext(savedUser).toBe(undefined);
    } catch (e){
        expect(e.errors.name.properties.message).toBe('"name" is too long');
    };

    const newUser3 = Object.create(newUser);
    newUser3.lastname = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
    const user3 = new User(newUser3);
    try{
        const savedUser = await user3.save();
        expext(savedUser).toBe(undefined);
    } catch (e){
        expect(e.errors.lastname.properties.message).toBe('"lastname" is too long');
    };
});

afterAll(() => {
    return mongoose.connection.close();
});
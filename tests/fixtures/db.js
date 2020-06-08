const mongoose = require('mongoose');
const User = require('../../src/models/user');

// Test user objects
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    email: 'noam@chomsky.com',
    name: 'Noam', 
    lastname: 'Chomsky',
    password: 'ABCD-1234',
    role: 'admin'
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    email: 'carl@sagan.com',
    name: 'Carl', 
    lastname: 'Sagan',
    password: 'ABCD-1234',
    role: User.ROLE.USER
};

const userThreeId = new mongoose.Types.ObjectId();
const userThree = {
    _id: userThreeId,
    email: 'peter@thiel.com',
    name: 'Peter', 
    lastname: 'Thiel',
    password: 'ABCD-1234',
    role: User.ROLE.ADMIN
};

const setupDatabase = async () => {
    await User.deleteMany();
    await new User(userTwo).save();
    await new User(userThree).save();
};

module.exports = { 
    setupDatabase,
    userOne,
    userTwo,
    userThree,
};
const mongoose = require('mongoose');
const faker = require('faker');

const User = require('../../src/models/user');

const NUM_ADMINS = 2;
const NUM_USERS = 2;
const PASSWORD = 'ABCD-1234';

// Array of admins
const admins = [];
for(let i = 0; i < NUM_ADMINS - 1; i++){
    admins[i] = {
        _id: new mongoose.Types.ObjectId(),
        email: faker.internet.email(),
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
        password: PASSWORD,
        role: User.ROLE.ADMIN
    }
};

// Array of users
const users = [];
for(let i = 0; i < NUM_USERS - 1; i++){
    users[i] = {
        _id: new mongoose.Types.ObjectId(),
        email: faker.internet.email(),
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
        password: PASSWORD,
        role: User.ROLE.USER
    }
};

const configDatabase = async () => {
    await User.deleteMany();
    const dbAdminsPromises = admins.map( admin => {
        console.log(admin);
        return new User(admin).save();
    });
    
    const dbUsersPromises = users.map( user => {
        return new User(user).save();
    });

    await Promise.all(dbAdminsPromises);
    await Promise.all(dbUsersPromises);
};

module.exports = {
    configDatabase,
    admins,
    users,
};
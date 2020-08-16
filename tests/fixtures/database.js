const mongoose = require('mongoose');
const faker = require('faker');

const User = require('../../src/models/user');
const PASSWORD = 'ABCD-1234' 

const mockUsers = async ({role = User.ROLE.USER, password = PASSWORD, count = 1, persist = true, login = true, clean = true}) => {
    const users = [];
    let dbUsers = [];
    const result = {};

    if(clean){
        await User.deleteMany();
    };

    for(let i = 0; i < count; i++){
        users[i] = {
            _id: new mongoose.Types.ObjectId(),
            email: faker.internet.email(),
            name: faker.name.firstName(),
            lastname: faker.name.lastName(),
            password,
            role,
        }
    };
    result.users = users;

    if(persist) {
        const dbUsersPromises = users.map( user => {
            return new User(user).save();
        });
        dbUsers = await Promise.all(dbUsersPromises);
        result.dbUsers = dbUsers;
    };

    if(persist && login) {
        const tokenPromises = dbUsers.map( dbUser => {
            return dbUser.createToken();
        });
        const tokens = await Promise.all(tokenPromises);
        users.forEach( (user, i ) => {
            user.token = tokens[i];
        });
    };

    return result;
};

module.exports = {
    mockUsers
};
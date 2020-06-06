const mongoose = require('mongoose');
const chalk = require('chalk');
require('./mongoose');
const User = require('../models/user')

// Admin user
const seedAdmin = {
    email: 'admin@example.com',
    name: 'admin',
    lastname: 'admin',
    password: 'example',
    role: 'admin',
};

const admin = new User(seedAdmin);
admin.save()
    .then( res => {
        console.log(seedAdmin);
        mongoose.connection.close();
    })
    .catch( err => {
        console.log(chalk.red(err.toString()));
        mongoose.connection.close();
    });


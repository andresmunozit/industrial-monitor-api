const randomize = require('randomatic');

const generatePassword = ( config = '*', length = 16 ) => {
    return randomize(config, length);
};

module.exports = generatePassword;
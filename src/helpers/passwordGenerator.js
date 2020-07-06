const randomize = require('randomatic');

const generatePassword = ( config = '*', length = 16 ) => {
    if( !['a','A', '0', '!', '*'].includes(config)) throw 'Invalid config string. Only "a" (lowercase), "A" (uppercase), "0" (numeric), "!" (special) and "*" (all above) are allowed characters';
    if( !Number(length) && Number(length) !== 0 ) throw 'Length parameter must be a number';
    if( length < 1 || length > 32 ) throw 'Password length parameter must be greater than 0 and less than 33';
    return randomize(config, length);
};

module.exports = generatePassword;
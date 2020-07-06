const generatePassword = require('../../src/helpers/passwordGenerator');

test('Should generate a password with lenght of 16 using default parameters', () => {
    expect(generatePassword().length).toBe(16);
});

test('Should be correctly parsed to JSON string if a JSON character is included', () => {
    let generatedPassword = generatePassword();
    while(!generatedPassword.match(/\"|\[|\]|\{|\}|\:/)){
        generatedPassword = generatePassword();
    };
    const json = JSON.stringify({generatedPassword});
});

test('Should throw an error if the password length is less than 1 od longer than 32 characters', () => {
    try{
        generatePassword('*', 0);
    } catch (e){
        expect(e).toBe("Password length parameter must be greater than 0 and less than 33");
    };

    try{
        generatePassword('*', 33);
    } catch (e){
        expect(e).toBe("Password length parameter must be greater than 0 and less than 33");
    };
});

test('Should throw an error if the config parameter is not one of the allowed strings', () => {
    try{
        generatePassword('x', 18);
    } catch (e) {
        expect(e).toBe('Invalid config string. Only "a" (lowercase), "A" (uppercase), "0" (numeric), "!" (special) and "*" (all above) are allowed characters');
    };
});

test('Should throw an error if the length parameter is not a number', () => {
    try{
        generatePassword('*','345t2');
    } catch (e){
        expect(e).toBe('Length parameter must be a number');
    };
});
const emailTemplates = require('../../../src/helpers/email/emailTemplates')

const testEmail = 'test@example.com';
const testName = 'Name';
const testPassword = 'Password';

test('Should throw an error if the required parameters are not specified', () => {
    try{ 
        emailTemplates.welcome();
    } catch(e){
        expect(e).toBe(`"email", "name" and "temporaryPassword" arguments are required`);
    };

    try{ 
        emailTemplates.welcome('', 'test', 'test');
    } catch(e){
        expect(e).toBe(`"email", "name" and "temporaryPassword" arguments are required`)
    };
});

test('Should return a welcome message object', () => {
    const welcome = emailTemplates.welcome(testEmail, testName, testPassword);
    expect(welcome.to).toBe(testEmail);
    expect(welcome.text).toBe(`Hello ${testName}\n\nAn account has been created for you to access to the application. A temporary password has been generated, you need to change this password in order to access to the application.\n\nTemporary password: ${testPassword}\n\nYou can login to the application in the following link:\n\n${process.env.FRONTEND_URL}/login`)
});

test('Should return a reset password message object', () => {
    const resetPassword = emailTemplates.resetPassword(testEmail, testName, testPassword);
    expect(resetPassword.to).toBe(testEmail);
    expect(resetPassword.text).toBe(`Hello ${testName}\n\nAn administrator has reset your password. A temporary password has been generated, you need to change this password in order to access to the application.\n\nTemporary password: ${testPassword}\n\nYou can login to the application in the following link:\n\n${process.env.FRONTEND_URL}/login`)
});
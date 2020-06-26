const welcome = (email, name, temporaryPassword) => {
    if(!email || !name || !temporaryPassword) throw `"email", "name" and "temporaryPassword" arguments are required`;
    return {
        to: email,
        from: process.env.EMAIL_SENDER_ADDRESS,
        subject: 'Industrial Monitor API - Welcome!',
        text: `Hello ${name}\n\nAn account has been created for you to access to the application. A temporary password has been generated, you need to change this password in order to access to the application.\n\nTemporary password: ${temporaryPassword}\n\nYou can login to the application in the following link:\n\n${process.env.FRONTEND_URL}/login`,
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
};

const resetPassword = (email, name, temporaryPassword) => {
    if(!email || !name || !temporaryPassword) throw `"email", "name" and "temporaryPassword" arguments are required`;
    return {
        to: email,
        from: process.env.EMAIL_SENDER_ADDRESS,
        subject: 'Industrial Monitor API - Your password has been reset',
        text: `Hello ${name}\n\nAn administrator has reset your password. A temporary password has been generated, you need to change this password in order to access to the application.\n\nTemporary password: ${temporaryPassword}\n\nYou can login to the application in the following link:\n\n${process.env.FRONTEND_URL}/login`,
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
};

module.exports = { welcome, resetPassword };
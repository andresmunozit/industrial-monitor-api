const welcome = (email, name, temporaryPassword) => {
    return {
        to: email,
        from: process.env.EMAIL_SENDER_ADDRESS,
        subject: 'Welcome to Industrial Monitor API',
        text: `Hello ${name}\n\nAn account has been created for you to access to the application. A temporary password has been generated, you need to change this password in order to access to the application.\n\nTemporary password: ${temporaryPassword}\n\nYou can login to the application in the following link:\n\n${process.env.FRONTEND_URL}/login`,
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
};

module.exports = { welcome };
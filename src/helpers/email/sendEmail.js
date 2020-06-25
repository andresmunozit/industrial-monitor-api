const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = message => {
    sgMail.send(message);
};

module.exports = sendEmail;
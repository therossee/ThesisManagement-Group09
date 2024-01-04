const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.TM_SMTP_SERVICE_NAME,
    host: process.env.TM_SMTP_HOST,
    port: process.env.TM_SMTP_PORT,
    secure: process.env.TM_SMTP_SECURE === 'true',
    auth: {
        user: process.env.TM_SMTP_USERNAME,
        pass: process.env.TM_SMTP_PASSWORD
    }
});

async function sendEmail(to, subject, text, html) {
    return transporter.sendMail(
        { from: { name: 'Polito - Thesis', address: process.env.TM_SMTP_USERNAME }, to, subject, text, html },
        (err, info) => {
            if (err) {
                console.log('Error while sending email:', err);
                return;
            }

            console.log('Email successfully sent:', info.response);
        }
    );
}

module.exports = {
    sendEmail
};

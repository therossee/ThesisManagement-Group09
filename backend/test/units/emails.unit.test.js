require('jest');
require('../integration_config');
const nodemailer = require('nodemailer');
const { sendEmail } = require('../../src/services/emails');

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

jest.mock('nodemailer', () => {
    return {
        createTransport: jest.fn(() => {
            return {
                sendMail: jest.fn((email, callback) => {
                    if (email.to === '') {
                        callback(new Error('Invalid email'));
                        return;
                    }
                    if (email.to === 's318952@studenti.polito.it') {
                        callback(null, { response: 'OK' });
                    }
                })
            };
        })
    };
});

describe('sendEmail', () => {
    test('should not send email successfully', async () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const to = '';
        const subject = 'Test email';
        const text = 'This is a test email';
        const html = '<p>This is a test email</p>';

        await sendEmail(to, subject, text, html);

        expect(transporter.sendMail).toHaveBeenCalledTimes(0);
        expect(logSpy).toHaveBeenCalled();
    });

    test('should send email succesfully', async () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const to = 's318952@studenti.polito.it';
        const subject = 'Test email';
        const text = 'This is a test email';
        const html = '<p>This is a test email</p>';

        await sendEmail(to, subject, text, html);

        expect(logSpy).toHaveBeenCalled();
    });
});

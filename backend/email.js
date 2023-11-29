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

/**
 * Email the student to notify him/her that the status of his/her application has changed.
 *
 * @param {string} studentEmail
 * @param {ThesisProposalRow} thesis
 * @param {string} newStatus
 * @param {string} [reason]
 *
 * @return {Promise<unknown>}
 */
async function sendEmailApplicationStatusChange(studentEmail, thesis, newStatus, reason) {
    return _sendEmail(
        studentEmail,
        `Application status changed - ${thesis.title}`,
        `Hi,
        
        The status of your application for the thesis "${thesis.title}" has changed!
        New status: ${newStatus.toUpperCase()} ${reason ? `(${reason})` : ''}
        
        This is an automated message, please do not reply.`,
        `<p>Hi,</p>
        <p> The status of your application for the thesis "${thesis.title}" has changed!</p>
        <p>New status: <b>${newStatus.toUpperCase()}</b> ${reason ? `(${reason})` : ''}</p>
        <br />
        <p><i>This is an automated message, please do not reply.</i></p>`
    );
}

module.exports = {
    sendEmailApplicationStatusChange
};

async function _sendEmail(to, subject, text, html) {
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

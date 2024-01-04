const usersDao = require("../dao/users_dao");
const thesisDao = require("../dao/thesis_dao");
const { sendEmail } = require("./emails");

class NotificationService {
    /**
     * Notify the student that the status of his/her application has changed.
     *
     * @param {string} studentId
     * @param {string} proposalId
     * @param {string} status
     * @param {string} [reason]
     */
    static async emitThesisApplicationStatusChange(studentId, proposalId, status, reason) {
        const student = await usersDao.getStudentById(studentId);
        if (!student) {
            console.error(`Student with id "${studentId}" not found, cannot notify application status change.`);
            return;
        }

        const thesis = await thesisDao.getThesisProposalById(proposalId);
        if (!thesis) {
            console.error(`Thesis proposal with id "${proposalId}" not found, cannot notify application status change.`);
            return;
        }

        await sendEmail(
            student.email,
            `Application status changed - ${thesis.title}`,
            `Hi,
        
            The status of your application for the thesis "${thesis.title}" has changed!
            New status: ${status.toUpperCase()} ${reason ? `(${reason})` : ''}
            
            This is an automated message, please do not reply.`,
                `<p>Hi,</p>
            <p> The status of your application for the thesis "${thesis.title}" has changed!</p>
            <p>New status: <b>${status.toUpperCase()}</b> ${reason ? `(${reason})` : ''}</p>
            <br />
            <p><i>This is an automated message, please do not reply.</i></p>`
        ).catch( e => console.error(`Failed to send email to student "${studentId}"`, e) );
    }
}

module.exports = NotificationService;

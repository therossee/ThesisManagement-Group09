const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/localizedFormat'));
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

        const stringifyReason = reason ? `(${reason})` : '';

        await sendEmail(
            student.email,
            `Application status changed - ${thesis.title}`,
            "Hi,\n" +
            `The status of your application for the thesis "${thesis.title}" has changed!\n` +
            `New status: ${status.toUpperCase()} ${stringifyReason}\n` +
            "\n" +
            "This is an automated message, please do not reply.",
                `<p>Hi,</p>
            <p> The status of your application for the thesis "${thesis.title}" has changed!</p>
            <p>New status: <b>${status.toUpperCase()}</b> ${reason ? `(${reason})` : ''}</p>
            <br />
            <p><i>This is an automated message, please do not reply.</i></p>`
        ).catch( e => console.error(`Failed to send email to student "${studentId}"`, e) );
    }

    /**
     * Notify the supervisor that a student has applied for his/her thesis proposal.
     *
     * @param {number} applicationId
     * @param {string} studentId
     * @param {string} proposalId
     */
    static async emitNewApplicationCreated(applicationId, studentId, proposalId) {
        const application = await thesisDao.getThesisApplicationById(applicationId);
        if (!application) {
            console.error(`Application with id "${applicationId}" not found, cannot notify new application.`);
            return;
        }
        const createdAt = dayjs(application.creation_date).format('lll');

        const student = await usersDao.getStudentById(studentId);
        if (!student) {
            console.error(`Student with id "${studentId}" not found, cannot notify new application.`);
            return;
        }

        const thesis = await thesisDao.getThesisProposalById(proposalId);
        if (!thesis) {
            console.error(`Thesis proposal with id "${proposalId}" not found, cannot notify new application.`);
            return;
        }

        const supervisor = await usersDao.getTeacherById(thesis.supervisor_id);
        if (!supervisor) {
            console.error(`Supervisor with id "${thesis.supervisor.id}" not found, cannot notify new application.`);
            return;
        }

        await sendEmail(
            supervisor.email,
            `New Application - ${thesis.title}`,
            "Hi,\n" +
            `A new student has applied for your thesis "${thesis.title}" the ${createdAt}!\n` +
            `Student: ${student.name} ${student.surname} [${student.id}]\n` +
            "\n" +
            "This is an automated message, please do not reply.",
                `<p>Hi,</p>
            <p> A new student has applied for your thesis "${thesis.title}" the ${createdAt}!</p>
            <p>Student: <b>${student.name} ${student.surname}</b> [${student.id}]</p>
            <br />
            <p><i>This is an automated message, please do not reply.</i></p>`
        ).catch( e => console.error(`Failed to send email to supervisor "${supervisor.id}"`, e) );
    }
}

module.exports = NotificationService;

const thesisDao = require("../dao/thesis_dao");
const NotificationService = require("../services/NotificationService");
const usersDao = require("../dao/users_dao");
const path = require("path");
const fs = require("fs");
const { APPLICATION_STATUS } = require("../enums");

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getApplicationsForTeacherThesisProposal(req, res, next) {
    try {
        const teacherId = req.user.id;
        const proposal_id = req.params.proposal_id;
        const applications = await thesisDao.listApplicationsForTeacherThesisProposal(proposal_id, teacherId);
        res.json(applications);
    } catch (e) {
        next(e);
    }
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function acceptAnApplicationOnThesis(req, res, next) {
    try {
        const { proposal_id } = req.params;
        const { student_id } = req.body;

        if (!student_id) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const thesis = await thesisDao.getThesisProposalById(proposal_id);
        if (!thesis) {
            return res.status(404).json({ message: `Thesis proposal with id ${proposal_id} not found, cannot accept this application.` })
        }


        const status = APPLICATION_STATUS.ACCEPTED;
        const success = await thesisDao.updateApplicationStatus(student_id, proposal_id, status);
        if (!success) {
            return res.status(404).json({ message: `No application with the status "waiting for approval" found for this proposal.` });
        }
        NotificationService.emitThesisApplicationStatusChange(student_id, proposal_id, status);

        const applicationsCancelled = await thesisDao.cancelOtherApplications(student_id, proposal_id);
        setImmediate(() => {
            const reason = 'Another student has been accepted for this thesis proposal.';
            for (const application of applicationsCancelled) {
                NotificationService.emitThesisApplicationStatusChange(application.student_id, application.proposal_id, application.status, reason);
            }
        });

        res.status(200).json({ message: 'Thesis accepted and others rejected successfully' });

    } catch (error) {
        next(error);
    }
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function rejectAnApplicationOnThesis(req, res, next) {
    try {
        const { proposal_id } = req.params;
        const { student_id } = req.body;

        if (!student_id) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const thesis = await thesisDao.getThesisProposalById(proposal_id);
        if (!thesis) {
            return res.status(404).json({ message: `Thesis proposal with id ${proposal_id} not found, cannot reject this application.` })
        }

        const status = APPLICATION_STATUS.REJECTED;
        const success = await thesisDao.updateApplicationStatus(student_id, proposal_id, status);
        if (!success) {
            return res.status(404).json({ message: `No application with the status "waiting for approval" found for this proposal.` });
        }
        NotificationService.emitThesisApplicationStatusChange(student_id, proposal_id, status);

        res.status(200).json({ message: 'Thesis successfully rejected' });
    } catch (error) {
        next(error);
    }
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getApplicationUploads(req, res, next) {
    try {
        const application_id = req.params.app_id;
        const student_id = req.params.stud_id;

        const student = await usersDao.getStudentById(student_id);
        if (!student){
            return res.status(404).json({ message: `Student with id ${student_id} not found.` });
        }

        const application = await thesisDao.getApplicationById(application_id);
        if (!application || application.student_id !== student_id){
            return res.status(404).json({ message: `Application with id ${application_id} not found.` });
        }

        const dir = path.join(__dirname, '..', '..', 'uploads', student_id, application_id);

        if (fs.existsSync(dir)) {
            const files = await fs.promises.readdir(dir);
            if (files.length > 0) {
                res.sendFile(path.join(dir, files[0]));
            } else {
                res.status(200).json({});
            }
        } else {
            res.status(200).json({});
        }
    } catch(error) {
        next(error);
    }
}

module.exports = {
    getApplicationsForTeacherThesisProposal,
    acceptAnApplicationOnThesis,
    rejectAnApplicationOnThesis,
    getApplicationUploads
};

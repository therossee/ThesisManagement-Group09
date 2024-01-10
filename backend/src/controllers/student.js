const formidable = require("formidable");
const thesisDao = require("../dao/thesis_dao");
const usersDao = require("../dao/users_dao");
const NotificationService = require("../services/NotificationService");
const AdvancedDate = require("../models/AdvancedDate");
const schemas = require("../schemas/thesis-start-request");

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getStudentCareer(req, res, next) {
    try {
        const studentId = req.params.id;
        const student = await usersDao.getStudentById(studentId);
        if (!student) {
            return res.status(404).json({ message: `Student with id ${studentId} not found.` });
        }
        const career = await usersDao.getStudentCareer(studentId);
        res.json(career);
    } catch (e) {
        next(e);
    }
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getStudentActiveApplication(req, res, next) {
    try {
        const studentId = req.user.id;
        const studentApplications = await thesisDao.getStudentActiveApplication(studentId);
        res.json(studentApplications);
    } catch (e) {
        next(e);
    }
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function applyForProposal(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        const student_id = req.user.id;
        const thesis_proposal_id = fields.thesis_proposal_id[0];
        const upload = (files.file) ? files.file[0] : undefined;

        try {
            const applicationId = await thesisDao.applyForProposal(thesis_proposal_id, student_id, upload);

            await NotificationService.emitNewApplicationCreated(applicationId, student_id, thesis_proposal_id);

            res.status(201).json({
                application_id: applicationId,
                thesis_proposal_id: thesis_proposal_id,
                student_id: student_id,
                status: 'waiting for approval'
            });
        } catch (error) {
            next(error);
        }
    });
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getStudentApplicationDecision(req, res, next) {
    try {
        const studentId = req.user.id;
        const applications = await thesisDao.listApplicationsDecisionsFromStudent(studentId);
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
async function newThesisStartRequest(req, res, next) {
    try {
        const studentId = req.user.id;
        
        const thesisRequest = await schemas.APIThesisStartRequestSchema.parseAsync(req.body);

        const thesis_start_request_id = await thesisDao.createThesisStartRequest(studentId, thesisRequest.title, thesisRequest.description, thesisRequest.supervisor_id, thesisRequest.internal_co_supervisors_ids, thesisRequest.application_id, thesisRequest.proposal_id )

        res.status(201).json({
            thesis_start_request_id: thesis_start_request_id,
            student_id: studentId,
            application_id: thesisRequest.application_id,
            proposal_id: thesisRequest.proposal_id,
            title: thesisRequest.title,
            description: thesisRequest.description,
            supervisor_id: thesisRequest.supervisor_id,
            internal_co_supervisors_ids: thesisRequest.internal_co_supervisors_ids,
            status: 'waiting for approval'
        });
        
    } catch (error) {
        next(error);
    }
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getStudentActiveThesisStartRequests(req, res, next) {  
    try {
        const studentId = req.user.id;
        const studentThesisStartRequests = await thesisDao.getStudentActiveThesisStartRequests(studentId);
        res.json(studentThesisStartRequests);
    } catch (e) {
        next(e);
    }
}

module.exports = {
    getStudentCareer,
    getStudentActiveApplication,
    applyForProposal,
    getStudentApplicationDecision,
    newThesisStartRequest,
    getStudentActiveThesisStartRequests
};

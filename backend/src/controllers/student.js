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

        const thesisStartRequest = {
            id: thesis_start_request_id,
            student_id: studentId,
            application_id: thesisRequest.application_id,
            proposal_id: thesisRequest.proposal_id,
            title: thesisRequest.title,
            description: thesisRequest.description,
            supervisor_id: thesisRequest.supervisor_id,
            co_supervisors: thesisRequest.internal_co_supervisors_ids,
            status: 'waiting for approval'
        }
        res.status(201).send(await _populateThesisStartRequest(thesisStartRequest));
        
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
        const studentThesisStartRequest = await thesisDao.getStudentActiveThesisStartRequests(studentId);
        if(!studentThesisStartRequest) {
            res.status(200).json();
        }
        res.status(200).send(await _populateThesisStartRequest(studentThesisStartRequest));
    } catch (e) {
        next(e);
    }
}

/**
 * Serialize and populate a thesis start request object in order to have all the data needed by the API
 *
 * @param {ThesisStartRequestRow} thesisStartRequestData
 * @return {Promise<object>}
 * @private
 */
async function _populateThesisStartRequest(thesisStartRequestData) {
    const coSupervisorsPromises = thesisStartRequestData.co_supervisors.map(async (id) => {
        return await usersDao.getTeacherById(id);
    });

    const coSupervisors = await Promise.all(coSupervisorsPromises);

    return {
        id: thesisStartRequestData.id,
        proposal_id: thesisStartRequestData.proposal_id,
        application_id: thesisStartRequestData.application_id,
        student: await usersDao.getStudentById(thesisStartRequestData.student_id),
        supervisor: await usersDao.getTeacherById(thesisStartRequestData.supervisor_id),
        co_supervisors: coSupervisors,
        title: thesisStartRequestData.title,
        description: thesisStartRequestData.description,
        status: thesisStartRequestData.status,
        creation_date: thesisStartRequestData.creation_date,
        approval_date: thesisStartRequestData.approval_date,
    };
}

/**
 * @typedef {Object} ThesisStartRequestRow
 *
 * @property {string} id
 * @property {string} proposal_id
 * @property {string} application_id
 * @property {string} student_id
 * @property {string} supervisor_id
 * @property {Array<string>} coSupervisors
 * @property {string} title
 * @property {string} description
 * @property {string} creation_date
 * @property {string} approval_date
 * @property {string} status
 * 
 */

module.exports = {
    getStudentCareer,
    getStudentActiveApplication,
    applyForProposal,
    getStudentApplicationDecision,
    newThesisStartRequest,
    getStudentActiveThesisStartRequests
};

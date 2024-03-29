const formidable = require("formidable");
const thesisStartRequestDao = require("../dao/thesis_start_request_dao");
const thesisApplicationDao = require("../dao/thesis_application_dao");
const usersDao = require("../dao/users_dao");
const NotificationService = require("../services/NotificationService");
const schemas = require("../schemas/thesis-start-request");
const utils = require("./utils");

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
        const studentApplications = await thesisApplicationDao.getStudentActiveApplication(studentId);
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
            const applicationId = await thesisApplicationDao.applyForProposal(thesis_proposal_id, student_id, upload);

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
        const applications = await thesisApplicationDao.listApplicationsDecisionsFromStudent(studentId);
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

        if(thesisRequest.internal_co_supervisors_ids.includes(thesisRequest.supervisor_id)) {
            res.status(400).json({message: "Supervisor cannot be also co-supervisor"});
        }

        const thesis_start_request_id = await thesisStartRequestDao.createThesisStartRequest(studentId, thesisRequest.title, thesisRequest.description, thesisRequest.supervisor_id, thesisRequest.internal_co_supervisors_ids, thesisRequest.application_id, thesisRequest.proposal_id )

        const thesisStartRequest = await thesisStartRequestDao.getThesisStartRequestById(thesis_start_request_id);

        res.status(201).send(await utils.populateThesisStartRequest(thesisStartRequest));

    } catch (error) {
        next(error);
    }
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getStudentLastThesisStartRequest(req, res, next) {
    try {
        const studentId = req.user.id;
        const studentLastThesisStartRequest = await thesisStartRequestDao.getStudentLastThesisStartRequest(studentId);
        if (!studentLastThesisStartRequest) {
            res.status(200).json({});
        }
        res.status(200).send(await utils.populateThesisStartRequest(studentLastThesisStartRequest));
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
    getStudentLastThesisStartRequest
};

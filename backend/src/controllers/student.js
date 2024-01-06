const formidable = require("formidable");
const thesisDao = require("../dao/thesis_dao");
const usersDao = require("../dao/users_dao");
const NotificationService = require("../services/NotificationService");
const AdvancedDate = require("../models/AdvancedDate");

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
    try{
        const studentId = req.user.id;
        const { application_id, proposal_id, title, description, supervisor_id, internal_co_supervisors_ids } = req.body;

        // Check if all required fields are present
        if ( !title || !description || !supervisor_id ) {
            return res.status(400).json({ error: 'Missing required fields'});
        }

        // Check if the student exists
        const student = await usersDao.getStudentById(studentId);
        if (!student) {
            return res.status(404).json({ error: `Student with id ${studentId} not found.` });
        }

        // Check if the application exists
        if(application_id){
            const application = await thesisDao.getApplicationById(application_id);
            if (!application) {
                return res.status(404).json({ error: `Application with id ${application_id} not found.` });
            }
        }

        // Check if the proposal exists and is valid
        if(proposal_id){
            const proposal = await thesisDao.getThesisProposalById(proposal_id);
            if (!proposal) {
                return res.status(404).json({ error: `Thesis proposal with id ${proposal_id} not found.` });
            }

            if(proposal.is_archived==1){
                return res.status(400).json({ error: `Thesis proposal with id ${proposal_id} is archived.` });
            }

            const currentDate = new AdvancedDate();
            const expiration = new AdvancedDate(proposal.expiration);
            const creationDate = new AdvancedDate(proposal.creation_date);

            if(expiration.isBefore(currentDate)){
                return res.status(400).json({ error: `Thesis proposal with id ${proposal_id} is expired.` });
            }

            if(currentDate.isBefore(creationDate)){
                return res.status(400).json({ error: `Thesis proposal with id ${proposal_id} is not yet available.` });
            }
            
        }

        // Check if the supervisor exists
        const supervisor = await usersDao.getTeacherById(supervisor_id);
        if (!supervisor) {
            return res.status(404).json({ error: `Supervisor with id ${supervisor_id} not found.` });
        }

        // Check if the internal co-supervisors exist
        for (const id of internal_co_supervisors_ids) {
            const internal_co_supervisor = await usersDao.getTeacherById(id);
            if (!internal_co_supervisor) {
                return res.status(404).json({ error: `Internal co-supervisor with id ${id} not found.` });
            }
        }

        await thesisDao.createThesisStartRequest(studentId, application_id, proposal_id, title, description, supervisor_id, internal_co_supervisors_ids)
             .then(thesis_start_request_id => {
                res.status(201).json({
                    thesis_start_request_id: thesis_start_request_id,
                    student_id: studentId,
                    application_id: application_id,
                    proposal_id: proposal_id,
                    title: title,
                    description: description,
                    supervisor_id: supervisor_id,
                    internal_co_supervisors_ids: internal_co_supervisors_ids,
                    status: 'waiting for approval'
                });
             })
             .catch(error => {
                console.error(error);
                res.status(500).json(`Failed to create thesis start request. ${error.message || error}`);
             });
       
    } catch (e) {
        next(e);
    }
}


module.exports = {
    getStudentCareer,
    getStudentActiveApplication,
    applyForProposal,
    getStudentApplicationDecision,
    newThesisStartRequest
};

const { USER_ROLES } = require("../enums");
const thesisProposalDao = require("../dao/thesis_proposal_dao");
const thesisApplicationDao = require("../dao/thesis_application_dao");
const usersDao = require("../dao/users_dao");
const schemas = require("../schemas");
const AppError = require("../errors/AppError");
const AdvancedDate = require("../models/AdvancedDate");
const {APPLICATION_STATUS} = require("../enums/application");
const NotificationService = require("../services/NotificationService");
const NoThesisProposalError = require("../errors/NoThesisProposalError");
const listApplicationsForTeacherThesisProposal = require("../dao/thesis_application_dao").listApplicationsForTeacherThesisProposal;

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function listThesisProposals(req, res, next) {
    try {
        if (req.user.roles.includes(USER_ROLES.STUDENT)) {
            const studentId = req.user.id;
            const proposals = await thesisProposalDao.listThesisProposalsFromStudent(studentId);
            const cds = await usersDao.getStudentDegree(studentId);
            const proposalsPopulated = await Promise.all(
                proposals.map(async proposal => {
                    return await _populateProposal(proposal, cds);
                })
            );

            // Not used right now, but it's here for potential future use
            const metadata = {
                index: 0,
                count: proposals.length,
                total: proposals.length,
                currentPage: 1
            };
            res.json({ $metadata: metadata, items: proposalsPopulated });
        } else if (req.user.roles.includes(USER_ROLES.TEACHER)) {
            const thesisProposals = await thesisProposalDao.listThesisProposalsTeacher(req.user.id);
            const proposalsPopulated = await Promise.all(
                thesisProposals.map(async proposal => {
                    const cds = await thesisProposalDao.getThesisProposalCds(proposal.proposal_id);
                    return await _populateProposal(proposal, cds);
                })
            );

            // Not used right now, but it's here for potential future use
            const metadata = {
                index: 0,
                count: thesisProposals.length,
                total: thesisProposals.length,
                currentPage: 1
            };
            res.json({ $metadata: metadata, items: proposalsPopulated });
        } else {
            // Handle unauthorized case if neither student nor teacher
            res.status(403).json('Unauthorized');
        }
    } catch (e) {
        next(e);
    }
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function createThesisProposal(req, res, next) {
    try {
        const supervisor_id = req.user.id;
        const { title, internal_co_supervisors_id, external_co_supervisors_id, type, description, required_knowledge, notes, level, cds, keywords } = req.body;
        let expiration = req.body.expiration;

        if (!title || !type || !description || !expiration || !level || !cds || !keywords) {
            return res.status(400).json('Missing required fields.');
        }

        expiration = expiration + 'T23:59:59.999Z';

        // Set to store all grous
        const unique_groups = new Set();

        // Get supervisor's group and add it to the array
        const supervisor_group = await usersDao.getGroup(supervisor_id);
        unique_groups.add(supervisor_group);

        // Check if there are co-supervisors and if yes, retrieve their cod_group
        if (internal_co_supervisors_id.length > 0) {
            for (const internal_co_supervisor of internal_co_supervisors_id) {
                const co_supervisor_group = await usersDao.getGroup(internal_co_supervisor);
                unique_groups.add(co_supervisor_group);
            }
        }

        const proposal_details = { title, supervisor_id, type, description, required_knowledge, notes, expiration, level };
        const additional_details = { internal_co_supervisors_id, external_co_supervisors_id, unique_groups, keywords, cds };

        await thesisProposalDao.createThesisProposal(proposal_details, additional_details)
            .then((thesisProposalId) => {
                res.status(201).json(
                    {
                        id: thesisProposalId,
                        title: title,
                        supervisor_id: supervisor_id,
                        internal_co_supervisors_id: internal_co_supervisors_id,
                        external_co_supervisors_id: external_co_supervisors_id,
                        type: type,
                        groups: [...unique_groups],
                        description: description,
                        required_knowledge: required_knowledge,
                        notes: notes,
                        expiration: expiration,
                        level: level,
                        cds: cds,
                        keywords: keywords
                    });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json(`Failed to create thesis proposal. ${error.message || error}`);
            });
    } catch(e) {
        next(e)
    }
}

/**
 *
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getThesisProposalById(req, res, next) {
    try {
        if (req.user.roles.includes(USER_ROLES.STUDENT)) {
            const studentId = req.user.id;
            const proposalId = req.params.id;

            const proposal = await thesisProposalDao.getThesisProposal(proposalId, studentId);
            const studentDegree = await usersDao.getStudentDegree(studentId);
            if (!proposal) {
                return res.status(404).json({ message: `Thesis proposal with id ${proposalId} not found.` });
            }

            res.json(await _populateProposal(proposal, studentDegree));
        }
        else if (req.user.roles.includes(USER_ROLES.TEACHER)) {
            const teacherId = req.user.id;
            const proposalId = req.params.id;

            const proposal = await thesisProposalDao.getThesisProposalTeacher(proposalId, teacherId);
            const cds = await thesisProposalDao.getThesisProposalCds(proposalId);
            if (!proposal) {
                return res.status(404).json({ message: `Thesis proposal with id ${proposalId} not found.` });
            }

            res.json(await _populateProposal(proposal, cds));
        }
        else {
            // Handle unauthorized case if neither student nor teacher
            res.status(403).json('Unauthorized');
        }
    } catch (e) {
        next(e);
    }
}

/**
 *
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function updateThesisProposalById(req, res, next) {
    try {
        const supervisor_id = req.user.id;
        const proposal_id = req.params.id;

        const applications = await thesisApplicationDao.listApplicationsForTeacherThesisProposal(proposal_id, supervisor_id);
        if (applications.some(application => application.status === APPLICATION_STATUS.ACCEPTED)) {
            return res.status(403).json({ message: 'Cannot edit a proposal with accepted applications.' });
        }

        const thesis = schemas.APIThesisProposalSchema.parse(req.body);

        // Set to store all grous
        const unique_groups = new Set();
        await usersDao.getGroup(supervisor_id).then(group => unique_groups.add(group));
        await Promise.all(
            thesis.internal_co_supervisors_id.map(async id => {
                return usersDao.getGroup(id).then(group => unique_groups.add(group));
            })
        );
        thesis.groups = [...unique_groups];

        const id = await thesisProposalDao.updateThesisProposal(proposal_id, supervisor_id, thesis);
        if (!id) {
            throw new NoThesisProposalError(proposal_id);
        }

        const proposal = thesisProposalDao.getThesisProposalById(proposal_id);
        if (!proposal) {
            throw new NoThesisProposalError(proposal_id);
        }
        const cds = await thesisProposalDao.getThesisProposalCds(proposal_id);

        res.status(200).send(await _populateProposal(proposal, cds));
    } catch (e) {
        next(e);
    }
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function deleteThesisProposalById(req, res, next) {
    try {
        const teacherId = req.user.id;
        const proposalId = req.params.id;

        await thesisProposalDao.deleteThesisProposalById(proposalId, teacherId)
            .then(applicationsCancelled => {
                setImmediate(() => {
                    const reason = 'The thesis proposal has been removed from the website.';
                    for (const application of applicationsCancelled) {
                        NotificationService.emitThesisApplicationStatusChange(application.student_id, application.proposal_id, application.status, reason);
                    }
                });

                return res.status(204).send();
            })
            .catch(error => {
                if (error instanceof AppError) {
                    return error.sendHttpResponse(res);
                } else {
                    throw error;
                }
            });
    } catch (e) {
        next(e);
    }
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function archiveThesisProposalById(req, res, next) {
    try {
        const teacherId = req.user.id;
        const proposalId = req.params.id;

        await thesisProposalDao.archiveThesisProposalById(proposalId, teacherId)
            .then(applicationsArchived => {
                setImmediate(() => {
                    const reason = 'The thesis proposal has been archived from the website.';
                    for (const application of applicationsArchived) {
                        NotificationService.emitThesisApplicationStatusChange(application.student_id, application.proposal_id, application.status, reason);
                    }
                });

                return res.status(204).send();
            })
            .catch(error => {
                if (error instanceof AppError) {
                    return error.sendHttpResponse(res);
                } else {
                    throw error;
                }
            });
    } catch (e) {
        next(e);
    }
}

/**
 *
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function unarchiveThesisProposalById(req, res, next) {
    try {
        const teacherId = req.user.id;
        const proposalId = Number(req.params.id);
        if (isNaN(proposalId)) {
            throw new NoThesisProposalError(req.params.id);
        }

        const { expiration } = schemas.APIUnarchiveThesisProposalSchema.parse(req.query);

        const proposal = await thesisProposalDao.unarchiveThesisProposalById(proposalId, teacherId, expiration);
        const cds = await thesisProposalDao.getThesisProposalCds(proposalId);

        res.status(200).json( await _populateProposal(proposal, cds) );
    } catch (e) {
        next(e);
    }
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function listArchivedThesisProposals(req, res, next) {
    try {
        const thesisProposals = await thesisProposalDao.listArchivedThesisProposalsTeacher(req.user.id);
        const proposalsPopulated = await Promise.all(
            thesisProposals.map(async proposal => {
                const cds = await thesisProposalDao.getThesisProposalCds(proposal.proposal_id);
                return await _populateProposal(proposal, cds);
            })
        );

        // Not used right now, but it's here for potential future use
        const metadata = {
            index: 0,
            count: thesisProposals.length,
            total: thesisProposals.length,
            currentPage: 1
        };
        res.json({ $metadata: metadata, items: proposalsPopulated });
        
    } catch (e) {
        console.log(e)
        next(e);
    }
}

module.exports = {
    listThesisProposals,
    createThesisProposal,
    getThesisProposalById,
    updateThesisProposalById,
    deleteThesisProposalById,
    archiveThesisProposalById,
    unarchiveThesisProposalById,
    listArchivedThesisProposals
};



/**
 * Serialize and populate a proposal object in order to have all the data needed by the API
 *
 * @param {ThesisProposalRow} proposalData
 * @return {Promise<object>}
 * @private
 */
async function _populateProposal(proposalData, cds) {
    return {
        id: proposalData.proposal_id,
        title: proposalData.title,
        status: await _getProposalStatus(proposalData),
        supervisor: await thesisProposalDao.getSupervisorOfProposal(proposalData.proposal_id)
            .then(_serializeTeacher),
        coSupervisors: {
            internal: await thesisProposalDao.getInternalCoSupervisorsOfProposal(proposalData.proposal_id)
                .then(supervisors => {
                    return supervisors.map(supervisor => _serializeTeacher(supervisor));
                }),
            external: await thesisProposalDao.getExternalCoSupervisorsOfProposal(proposalData.proposal_id)
        },
        type: proposalData.type,
        description: proposalData.description,
        requiredKnowledge: proposalData.required_knowledge,
        notes: proposalData.notes,
        creation_date: proposalData.creation_date,
        expiration: proposalData.expiration,
        level: proposalData.level,
        cds: cds,
        keywords: await thesisProposalDao.getKeywordsOfProposal(proposalData.proposal_id),
        groups: await thesisProposalDao.getProposalGroups(proposalData.proposal_id),
    };
}

/**
 * Return the status of a proposal
 *
 * @param proposalData
 * @return {Promise<string>}
 * @private
 */
async function _getProposalStatus(proposalData) {
    const now = new AdvancedDate();
    const expirationDate = new AdvancedDate(proposalData.expiration);

    // Check if the proposal has already beed assigned
    const applications = await listApplicationsForTeacherThesisProposal(proposalData.proposal_id, proposalData.supervisor_id);
    if (applications.some(application => application.status === APPLICATION_STATUS.ACCEPTED)) {
        return 'ASSIGNED';
    }

    if(proposalData.is_archived==1){
        return 'ARCHIVED';
    }

    if (expirationDate.isBefore(now)) {
        return 'EXPIRED';
    }

    return 'ACTIVE';
}

/**
 * Serialize a teacher object to a more compact format for the API
 *
 * @param {TeacherRow} teacher
 * @return {{id: string, name: string, surname: string, email: string, codGroup: string, codDepartment: string}}
 * @private
 */
function _serializeTeacher(teacher) {
    return {
        id: teacher.id,
        name: teacher.name,
        surname: teacher.surname,
        email: teacher.email,
        codGroup: teacher.cod_group,
        codDepartment: teacher.cod_department
    };
}

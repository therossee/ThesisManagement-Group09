const utilsDao = require("../dao/utils_dao");
const usersDao = require("../dao/users_dao");

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function listTeachers(req, res, next) {
    try {
        const excludedTeacherId = req.user.id;
        const teacherList = await utilsDao.getTeacherListExcept(excludedTeacherId);

        res.json({ teachers: teacherList });
    } catch (error) {
        next(error);
    }
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function listExternalCoSupervisors(req, res, next) {
    try {
        const externalCoSupervisorList = await utilsDao.getExternalCoSupervisorList();

        res.json({ externalCoSupervisors: externalCoSupervisorList });
    } catch (error) {
        next(error)
    }
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function listKeywords(req, res, next) {
    try {
        const keywords = await utilsDao.getAllKeywords();
        res.json({ keywords });
    } catch (error) {
        next(error);
    }
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function listDegrees(req, res, next) {
    try {
        const degrees = await utilsDao.getDegrees();
        res.json(degrees);
    } catch (error) {
        next(error);
    }
}

/**
 * Serialize and populate a thesis start request object in order to have all the data needed by the API
 *
 * @param {ThesisStartRequestRowExtended} thesisStartRequestData
 *
 * @return {Promise<ThesisStartRequestPopulated>}
 */
async function populateThesisStartRequest(thesisStartRequestData) {
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
        changes_requested: thesisStartRequestData.changes_requested,
        creation_date: thesisStartRequestData.creation_date,
        approval_date: thesisStartRequestData.approval_date,
    };
}

module.exports = {
    listTeachers,
    listExternalCoSupervisors,
    listKeywords,
    listDegrees,
    populateThesisStartRequest
};

/**
 * @typedef {Object} ThesisStartRequestPopulated
 *
 * @property {number} id
 * @property {string | null} proposal_id
 * @property {string | null} application_id
 * @property {StudentPartialRow} student
 * @property {TeacherRow} supervisor
 * @property {TeacherRow[]} co_supervisors
 * @property {string} title
 * @property {string} description
 * @property {string} status
 * @property {string | null} changes_requested
 * @property {string} creation_date
 * @property {string | null} approval_date
 */

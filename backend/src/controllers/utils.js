const thesisDao = require("../dao/thesis_dao");

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function listTeachers(req, res, next) {
    try {
        const excludedTeacherId = req.user.id;
        const teacherList = await thesisDao.getTeacherListExcept(excludedTeacherId);

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
        const externalCoSupervisorList = await thesisDao.getExternalCoSupervisorList();

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
        const keywords = await thesisDao.getAllKeywords();
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
        const degrees = await thesisDao.getDegrees();
        res.json(degrees);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listTeachers,
    listExternalCoSupervisors,
    listKeywords,
    listDegrees
};

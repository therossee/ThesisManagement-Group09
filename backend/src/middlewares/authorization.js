const { USER_ROLES } = require("../enums");

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.status(401).json({ error: "Not authenticated" });
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function isStudent(req, res, next) {
    if (req.isAuthenticated() && req.user.roles.includes(USER_ROLES.STUDENT)) {
        return next();
    }

    return res.status(403).json('Unauthorized');
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function isTeacher(req, res, next) {
    if (req.isAuthenticated() && req.user.roles.includes(USER_ROLES.TEACHER)) {
        return next();
    }

    return res.status(403).json('Unauthorized');
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function isTester(req, res, next) {
    if (req.isAuthenticated() && req.user.roles.includes(USER_ROLES.TESTER)) {
        return next();
    }

    return res.status(403).json('Unauthorized');
}

module.exports = {
    isLoggedIn,
    isStudent,
    isTeacher,
    isTester
};

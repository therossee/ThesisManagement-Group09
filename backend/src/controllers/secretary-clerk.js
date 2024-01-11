const { USER_ROLES } = require("../enums");
const thesisDao = require("../dao/thesis_dao");
const usersDao = require("../dao/users_dao");
const schemas = require("../schemas");
const AppError = require("../errors/AppError");
const AdvancedDate = require("../models/AdvancedDate");
const {APPLICATION_STATUS} = require("../enums/application");
const NotificationService = require("../services/NotificationService");

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function listThesisStartRequests(req, res, next) {
    try {
        const thesisStartRequests = await thesisDao.listThesisStartRequests();
        res.json(thesisStartRequests);
    } catch (e) {
        next(e);
    }
}

module.exports = {
    listThesisStartRequests,
}
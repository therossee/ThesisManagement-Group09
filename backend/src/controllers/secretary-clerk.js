const { USER_ROLES } = require("../enums");
const thesisDao = require("../dao/thesis_dao");
const usersDao = require("../dao/users_dao");
const schemas = require("../schemas");
const AppError = require("../errors/AppError");
const AdvancedDate = require("../models/AdvancedDate");
const {APPLICATION_STATUS} = require("../enums/application");
const NotificationService = require("../services/NotificationService");
const utils = require("./utils");
const { util } = require("zod");

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function listThesisStartRequests(req, res, next) {
    try {
        const thesisStartRequests = await thesisDao.listThesisStartRequests();
        const requestsPopulated = await Promise.all(
            thesisStartRequests.map(async request => {
                return await utils._populateThesisStartRequest(request);
            })
        );

        res.json(requestsPopulated);
    } catch (e) {
        next(e);
    }
}

module.exports = {
    listThesisStartRequests,
}
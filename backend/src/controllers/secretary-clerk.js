const thesisStartRequestDao = require("../dao/thesis_start_request_dao");
const {THESIS_START_REQUEST_STATUS} = require("../enums/thesisStartRequest");
const utils = require("./utils");


/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function listThesisStartRequests(req, res, next) {
    try {
        const thesisStartRequests = await thesisStartRequestDao.listThesisStartRequests();
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


/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function acceptThesisStartRequest(req, res, next) {
    try {
        const requestId = req.params.request_id;
        const thesisStartRequest = await thesisStartRequestDao.getThesisStartRequestById(requestId);
        if(!thesisStartRequest) {
            res.status(404).json({ message: `Thesis start request with id ${requestId} not found.` });
        }

        if(thesisStartRequest.status !== THESIS_START_REQUEST_STATUS.WAITING_FOR_APPROVAL) {
            res.status(400).json({ message: `Thesis start request with id ${requestId} has already been accepted or rejected.` });
        }

        await thesisStartRequestDao.updateThesisStartRequestStatus(requestId, THESIS_START_REQUEST_STATUS.ACCEPTED_BY_SECRETARY)
                .then(async () => {
                    res.status(200).json({ message: "Thesis start request accepted successfully" });
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
async function rejectThesisStartRequest(req, res, next) {
    try {
        const requestId = req.params.request_id;
        const thesisStartRequest = await thesisStartRequestDao.getThesisStartRequestById(requestId);
        if(!thesisStartRequest) {
            res.status(404).json({ message: `Thesis start request with id ${requestId} not found.` });
        }
        if(thesisStartRequest.status !== THESIS_START_REQUEST_STATUS.WAITING_FOR_APPROVAL) {
            res.status(400).json({ message: `Thesis start request with id ${requestId} has already been accepted or rejected.` });
        }
        await thesisStartRequestDao.updateThesisStartRequestStatus(requestId, THESIS_START_REQUEST_STATUS.REJECTED_BY_SECRETARY)
                       .then(async () => {
                          res.status(200).json({ message: "Thesis start request rejected successfully" });
                       });
    } catch (e) {
        next(e);
    }
}

module.exports = {
    listThesisStartRequests,
    acceptThesisStartRequest,
    rejectThesisStartRequest
}
const AdvancedDate = require("../models/AdvancedDate");
const schemas = require("../schemas");

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
function getVirtualClockState(req, res, _next) {
    const json = {
        date: AdvancedDate.virtual.getVirtualDate().toISOString(),
        offset: AdvancedDate.virtual.offsetMs
    };

    res.status(200).json(json);
}

/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function updateVirtualClockState(req, res, next) {
    try {
        const { newDate } = schemas.APIVirtualClockUpdateSchema.parse(req.body);

        AdvancedDate.virtual.setNewOffset(newDate || 0);

        const json = {
            date: AdvancedDate.virtual.getVirtualDate().toISOString(),
            offset: AdvancedDate.virtual.offsetMs
        };
        res.status(200).json(json);
    } catch (e) {
        next(e);
    }
}

module.exports = {
    getVirtualClockState,
    updateVirtualClockState
};

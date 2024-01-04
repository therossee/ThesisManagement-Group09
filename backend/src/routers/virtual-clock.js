const express = require('express');
const middlewares = require('../middlewares/authorization');
const controller = require('../controllers/virtual-clock');

const router = express.Router({ mergeParams: true });

/**
 * Get the current virtual clock state (date and offset).
 */
router.get('/', controller.getVirtualClockState);
/**
 * Update the virtual clock state (offset).
 * We are only able to move forward in time!
 */
router.post('/', middlewares.isTester, controller.updateVirtualClockState);

module.exports = router;

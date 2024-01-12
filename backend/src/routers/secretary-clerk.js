const express = require('express');
const authorization = require('../middlewares/authorization');
const controller = require('../controllers/secretary-clerk');

const router = express.Router({ mergeParams: true });

/**
 * List all thesis start requests.
 * 
 */
router.get('/thesis-start-requests', authorization.isLoggedIn, authorization.isSecretaryClerk, controller.listThesisStartRequests);

/**
 * Accept a thesis start request.
 * 
 */
router.patch('/thesis-start-requests/accept/:request_id', authorization.isLoggedIn, authorization.isSecretaryClerk, controller.acceptThesisStartRequest);

/**
 * Reject a thesis start request.
 * 
 */
router.patch('/thesis-start-requests/reject/:request_id', authorization.isLoggedIn, authorization.isSecretaryClerk, controller.rejectThesisStartRequest);

module.exports = router;
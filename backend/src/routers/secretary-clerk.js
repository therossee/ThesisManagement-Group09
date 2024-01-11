const express = require('express');
const authorization = require('../middlewares/authorization');
const controller = require('../controllers/secretary-clerk');

const router = express.Router({ mergeParams: true });

/**
 * List all thesis start requests.
 * 
 */
router.get('/thesis-start-requests', authorization.isLoggedIn, authorization.isSecretaryClerk, controller.listThesisStartRequests);


module.exports = router;
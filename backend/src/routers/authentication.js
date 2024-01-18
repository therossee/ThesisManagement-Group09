const express = require('express');
const authentication = require('../middlewares/authentication');
const controller = require('../controllers/authentication');
const bodyParser = require("body-parser");

const router = express.Router({ mergeParams: true });

/**
 * Return the user information
 */
router.get('/api/user', controller.getUserInformation);

/**
 * Endpoint for initiating SAML authentication
 */
router.get("/login", authentication.authenticate, controller.initiateLogin);

/**
 * Endpoint for logging out the user
 */
router.post("/logout", controller.logout);

/**
 * Endpoint for SAML callback
 */
router.post("/sso/callback", bodyParser.urlencoded({ extended: false }), authentication.authenticate, controller.initiateLogin);


module.exports = router;

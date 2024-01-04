const express = require('express');
const authentication = require('../middlewares/authentication');
const controller = require('../controllers/authentication');
const bodyParser = require("body-parser");

const router = express.Router({ mergeParams: true });

router.get('/api/user', controller.getUserInformation);

router.get("/login", authentication.authenticate, controller.initiateLogin);

router.post("/logout", controller.logout);

router.post("/sso/callback", bodyParser.urlencoded({ extended: false }), authentication.authenticate, controller.initiateLogin);


module.exports = router;

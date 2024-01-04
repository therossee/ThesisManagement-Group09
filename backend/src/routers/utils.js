const express = require('express');
const authorization = require('../middlewares/authorization');
const controller = require('../controllers/utils');

const router = express.Router({ mergeParams: true });

router.get('/teachers', authorization.isLoggedIn, authorization.isTeacher, controller.listTeachers);

router.get('/externalCoSupervisors', authorization.isLoggedIn, authorization.isTeacher, controller.listExternalCoSupervisors);

router.get('/keywords', authorization.isLoggedIn, authorization.isTeacher, controller.listKeywords);

router.get('/degrees', authorization.isLoggedIn, authorization.isTeacher, controller.listDegrees);

module.exports = router;

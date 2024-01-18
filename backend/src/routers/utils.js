const express = require('express');
const authorization = require('../middlewares/authorization');
const controller = require('../controllers/utils');

const router = express.Router({ mergeParams: true });

/**
 * List all teachers
 */
router.get('/teachers', authorization.isLoggedIn, authorization.isTeacherOrStudent, controller.listTeachers);

/**
 * List all external co-supervisors
 */
router.get('/externalCoSupervisors', authorization.isLoggedIn, authorization.isTeacher, controller.listExternalCoSupervisors);

/**
 * List all keywords
 */
router.get('/keywords', authorization.isLoggedIn, authorization.isTeacher, controller.listKeywords);

/**
 * List all degrees
 */
router.get('/degrees', authorization.isLoggedIn, authorization.isTeacher, controller.listDegrees);


module.exports = router;

const express = require('express');
const authorization = require('../middlewares/authorization');
const controller = require('../controllers/student');

const router = express.Router({ mergeParams: true });

router.post('/applications', authorization.isLoggedIn, authorization.isStudent, controller.applyForProposal);

router.get('/active-application', authorization.isLoggedIn, authorization.isStudent, controller.getStudentActiveApplication);

router.get('/applications-decision', authorization.isLoggedIn, authorization.isStudent, controller.getStudentApplicationDecision);

// WARNING: Even if we are in the student router, this endpoint is only for TEACHERS
router.get('/:id/career', authorization.isLoggedIn, authorization.isTeacher, controller.getStudentCareer);

router.post('/thesis-start-request', authorization.isLoggedIn, authorization.isStudent, controller.newThesisStartRequest);

router.get('/active-thesis-start-requests', authorization.isLoggedIn, authorization.isStudent, controller.getStudentActiveThesisStartRequests);

module.exports = router;

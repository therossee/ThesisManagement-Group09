const express = require('express');
const authorization = require('../middlewares/authorization');
const controller = require('../controllers/student');

const router = express.Router({ mergeParams: true });

/**
 * Apply for a thesis proposal.
 */
router.post('/applications', authorization.isLoggedIn, authorization.isStudent, controller.applyForProposal);

/**
 * List active applications for the logged student.
 */
router.get('/active-application', authorization.isLoggedIn, authorization.isStudent, controller.getStudentActiveApplication);

/**
 * List applications decisions for the logged student.
 */
router.get('/applications-decision', authorization.isLoggedIn, authorization.isStudent, controller.getStudentApplicationDecision);

/**
 * List the career (exams and grades) of the student with the given id
 */
// WARNING: Even if we are in the student router, this endpoint is only for TEACHERS
router.get('/:id/career', authorization.isLoggedIn, authorization.isTeacher, controller.getStudentCareer);

/**
 * Create a new thesis start request for the logged student.
 */
router.post('/thesis-start-requests', authorization.isLoggedIn, authorization.isStudent, controller.newThesisStartRequest);

/**
 * Get the last thesis start request for the logged student.
 */
router.get('/thesis-start-requests/last', authorization.isLoggedIn, authorization.isStudent, controller.getStudentLastThesisStartRequest);


module.exports = router;

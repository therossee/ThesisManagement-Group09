const express = require('express');
const authorization = require('../middlewares/authorization');
const controller = require('../controllers/teacher');

const router = express.Router({ mergeParams: true });

/**
 * List applications for a thesis proposal for which the logged teacher is the supervisor.
 */
router.get('/applications/:proposal_id', authorization.isLoggedIn, authorization.isTeacher, controller.getApplicationsForTeacherThesisProposal);

/**
 * Accept an application for a thesis proposal.
 */
router.patch('/applications/accept/:proposal_id', authorization.isLoggedIn, authorization.isTeacher, controller.acceptAnApplicationOnThesis);

/**
 * Reject an application for a thesis proposal.
 */
router.patch('/applications/reject/:proposal_id', authorization.isLoggedIn, authorization.isTeacher, controller.rejectAnApplicationOnThesis);

/**
 * Get uploads associated to a specific student's application for a thesis for which the logged teacher is the supervisor.
 */
router.get('/uploads/:stud_id/:app_id', authorization.isLoggedIn, authorization.isTeacher, controller.getApplicationUploads);

/**
 * List students thesis start requests for which the teacher is the supervisor.
 */
router.get('/thesis-start-requests', authorization.isLoggedIn, authorization.isTeacher, controller.listThesisStartRequests);

/**
 * Review the student thesis start request with the given id for which the logged teacher is the supervisor.
 */
router.post('/thesis-start-requests/:id/review', authorization.isLoggedIn, authorization.isTeacher, controller.reviewThesisStartRequest);


module.exports = router;

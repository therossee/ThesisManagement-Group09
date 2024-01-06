const express = require('express');
const authorization = require('../middlewares/authorization');
const controller = require('../controllers/teacher');

const router = express.Router({ mergeParams: true });

router.get('/applications/:proposal_id', authorization.isLoggedIn, authorization.isTeacher, controller.getApplicationsForTeacherThesisProposal);

router.patch('/applications/accept/:proposal_id', authorization.isLoggedIn, authorization.isTeacher, controller.acceptAnApplicationOnThesis);
router.patch('/applications/reject/:proposal_id', authorization.isLoggedIn, authorization.isTeacher, controller.rejectAnApplicationOnThesis);

router.get('/uploads/:stud_id/:app_id', authorization.isLoggedIn, authorization.isTeacher, controller.getApplicationUploads);


module.exports = router;

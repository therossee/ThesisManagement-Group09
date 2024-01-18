const express = require('express');
const authorization = require('../middlewares/authorization');
const controller = require('../controllers/thesis-proposals');

const router = express.Router({ mergeParams: true });

/**
 * List thesis proposals without pagination but restricted to the current user.
 * For student, we will only show thesis proposals related to his degree and for teachers we will show only his thesis
 * proposals.
 */
router.get('/thesis-proposals', authorization.isLoggedIn, controller.listThesisProposals);

/**
 * Create a new thesis proposal.
 * Only the teacher can create a thesis proposal.
 */
router.post('/teacher/thesis_proposals', authorization.isLoggedIn, authorization.isTeacher, controller.createThesisProposal);

/**
 * List all archived thesis proposals without pagination but restricted to the current teacher.
 */
router.get('/thesis-proposals/archived', authorization.isLoggedIn, authorization.isTeacher, controller.listArchivedThesisProposals);

/**
 * Retrieve a thesis proposal by id and apply the same control as in listThesisProposals
 */
router.get('/thesis-proposals/:id', authorization.isLoggedIn, controller.getThesisProposalById);

/**
 * Update the thesis proposal properties.
 * Only the teacher can update his own thesis proposal.
 */
router.put('/thesis-proposals/:id', authorization.isLoggedIn, authorization.isTeacher, controller.updateThesisProposalById);

/**
 * Delete the thesis proposal.
 * Only the teacher can delete his own thesis proposal.
 */
router.delete('/thesis-proposals/:id', authorization.isLoggedIn, authorization.isTeacher, controller.deleteThesisProposalById);

/**
 * Give the possibility to manually un-archive a thesis proposal by its ID.
 */
router.delete('/thesis-proposals/:id/archive', authorization.isLoggedIn, authorization.isTeacher, controller.unarchiveThesisProposalById);

/**
 * Give the possibility to manually archive a thesis proposal by its ID.
 * Only the teacher can archive his own thesis proposal.
 */
router.patch('/thesis-proposals/archive/:id', authorization.isLoggedIn, authorization.isTeacher, controller.archiveThesisProposalById);


module.exports = router;

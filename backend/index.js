'use strict';

/*** Importing modules ***/
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { check, validationResult } = require('express-validator'); // validation middleware

const thesisDao = require('./thesis_dao.js');

/*** init express and setup the middlewares ***/
const app = express();
app.use(express.json());
app.use(morgan('dev'));

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true
  };
app.use(cors(corsOptions));

/*** APIs ***/

// 1. Insert a new thesis proposal
// POST api/teacher/thesis_proposals
app.post('/api/teacher/thesis_proposals',[
  check('thesisTitle').isLength({ min: 1 }),
  check('type').isLength({ min: 1 }),
  check('description').isLength({ min: 1 }),
  check('note').isLength({ min: 1 }),
  check('level').isLength({ min: 1 }),
  check('cds').isLength({ min: 1 }),
  check('expiration').isISO8601(),
  check('knowledge').isArray({ min: 1 }),
], async (req,res) =>{
  const { id } = req.user.id;
  const {thesisTitle, coSupervisors, keywords, type, description, knowledge, note, expiration, level, cds} = req.body;

  if (!thesisTitle || !keywords || !type || !description || !knowledge || !expiration || !level || !cds) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const groups = await thesisDao.getGroup(id);
  console.log("GRuppi:"+groups)
 thesisDao.createThesisProposal(thesisTitle, id, coSupervisors, keywords, type ,groups, description, knowledge, note, expiration, level, cds)
  .then((thesisProposalId)=>{
    res.status(201).json({ id: thesisProposalId });
  })
  .catch((error) => {
    console.error(error);
    res.status(500).json({ error: `Failed to create thesis proposal. ${error.message || error}` });
  });
});

//GET /api/teachers
app.get('/api/teachers', (req, res) => {
  try {
    const excludedTeacherId = req.user.id; //Ricava l'id dall'utente loggato
    const teacherList = getTeacherListExcept(excludedTeacherId);

    res.json({ teachers: teacherList });
  } catch (error) {
    console.error('Errore durante il recupero della lista degli insegnanti:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// 2. Search for thesis proposals
// GET api/student/:id/thesis_proposals?title=...&supervisor=...&co-supervisor=...&tags=...&keywords=...&type=...

// 3. Apply for a thesis proposal
// POST api/student/:id/applications

// 4. List all applications for a teacher's thesis proposals
// GET api/teacher/:id/applications

// 5. Accept an application
// PATCH api/teacher/:id/applications/:id

// 6. Reject an application
// PATCH api/teacher/:id/applications/:id

// 7. List student's application decisions
// GET api/student/:id/applications

// 8. List professor's active thesis proposala
// GET api/teacher/:id/thesis_proposals

// 9. Update a thesis proposal
// PATCH api/teacher/:id/thesis_proposals/:id

module.exports = app;

const PORT = 3000;
app.listen(PORT, () => { console.log(`Server started on http://localhost:${PORT}/`) });
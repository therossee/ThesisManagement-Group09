'use strict';

/*** Importing modules ***/
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

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
// POST api/teacher/:id/thesis_proposals
app.post('/api/teacher/thesis_proposals',[
  //check
], (req,res) =>{
  const { id } = req.user.id;
  const {thesisTitle, coSupervisors, keywords, type, description, knowledge, note, expiration, level, cds} = req.body;

  if (!thesisTitle || !keywords || !type || !description || !knowledge || !expiration || !level || !cds) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const groups = thesisDao.getGroup(id);

  thesisDao.createThesisProposal(thesisTitle, id, coSupervisors, keywords, type ,groups, description, knowledge, note, expiration, level, cds)
  .then((thesisProposalId)=>{
    res.status(201).json({ id: thesisProposalId });
  })
  .catch((error) => {
    console.error(error);
    res.status(500).json({ error: 'Failed to create thesis proposal.' });
  });
}
)

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
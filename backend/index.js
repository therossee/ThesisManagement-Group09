'use strict';

/*** Importing modules ***/
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const thesisDao = require('./thesis_dao.js');
const usersDao = require('./users_dao.js');
const degreeDao = require('./degree_dao.js');
const AdvancedDate = require("./AdvancedDate");
const schemas = require('./schemas.js');
const {ZodError} = require("zod");

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

// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await usersDao.getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect email and/or password');

  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json('Not authorized');
}

const isStudent = (req, res, next) => {
  if(req.user.id.startsWith('s')){
    return next();
  }
  return res.status(403).json('Unauthorized');
}

const isTeacher = (req, res, next) => {
  if(req.user.id.startsWith('d')){
    return next();
  }
  return res.status(403).json('Unauthorized');
}

/*** Authentication APIs ***/

// POST /api/sessions
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);

        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);
  }
  else{
    res.status(401).json('Not authenticated');
  }
});

// DELETE /api/sessions/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.status(204).end();
});


/*** APIs ***/

app.get('/api/system/virtual-clock', (req, res) => {
  const json = {
    date: AdvancedDate.virtual.getVirtualDate().toISOString(),
    offset: AdvancedDate.virtual.offsetMs
  };

  res.status(200).json(json);
});

app.post('/api/system/virtual-clock', (req, res, next) => {
  try {
    const { newDate } = schemas.APIVirtualClockUpdateSchema.parse(req.body);

    AdvancedDate.virtual.setNewOffset(newDate || 0);

    const json = {
      date: AdvancedDate.virtual.getVirtualDate().toISOString(),
      offset: AdvancedDate.virtual.offsetMs
    };
    res.status(200).json(json);
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).json({ message: 'Some properties are missing or invalid.', errors: e.issues });
    } else {
      next(e);
    }
  }
});

app.post('/api/teacher/thesis_proposals',
isLoggedIn,
isTeacher,
async (req,res) => {
  const supervisor_id  = req.user.id;
  const {title, internal_co_supervisors_id, external_co_supervisors_id, type, description, required_knowledge, notes, expiration, level, cds, keywords} = req.body;

  if (!title || !type || !description || !expiration || !level || !cds || !keywords ) {
    return res.status(400).json('Missing required fields.');
  }

  // Set to store all grous
  const unique_groups = new Set();

  // Get supervisor's group and add it to the array
  const supervisor_group = await thesisDao.getGroup(supervisor_id);
  unique_groups.add(supervisor_group);

  // Check if there are co-supervisors and if yes, retrieve their cod_group
  if (internal_co_supervisors_id.length > 0) {
    for (const internal_co_supervisor of internal_co_supervisors_id) {
      const co_supervisor_group = await thesisDao.getGroup(internal_co_supervisor);
      unique_groups.add(co_supervisor_group);
    }
  }

  thesisDao.createThesisProposal(title, supervisor_id, internal_co_supervisors_id, external_co_supervisors_id, type, unique_groups, description, required_knowledge, notes, expiration, level, cds, keywords)
  .then((thesisProposalId)=>{
    res.status(201).json(
      {
        id: thesisProposalId,
        title: title,
        supervisor_id: supervisor_id,
        internal_co_supervisors_id: internal_co_supervisors_id,
        external_co_supervisors_id:external_co_supervisors_id,
        type: type,
        groups: [...unique_groups],
        description: description,
        required_knowledge: required_knowledge,
        notes: notes,
        expiration: expiration,
        level: level,
        cds: cds,
        keywords: keywords
      });
  })
  .catch((error) => {
    console.error(error);
    res.status(500).json(`Failed to create thesis proposal. ${error.message || error}`);
  });
});

app.get('/api/teachers',
isLoggedIn,
isTeacher,
async(req, res) => {
  try {
    const excludedTeacherId = req.user.id; // logged in teacher
    const teacherList = await thesisDao.getTeacherListExcept(excludedTeacherId);

    res.json({ teachers: teacherList });
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

app.get('/api/externalCoSupervisors',
isLoggedIn,
isTeacher,
async(req, res) => {
  try {
    const externalCoSupervisorList = await thesisDao.getExternalCoSupervisorList();

    res.json({ externalCoSupervisors: externalCoSupervisorList });
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

app.get('/api/keywords',
isLoggedIn,
isTeacher,
async(req, res) => {
  try {
    const keywords = await thesisDao.getAllKeywords();
    res.json({ keywords });
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

app.get('/api/degrees',
isLoggedIn,
isTeacher,
async(req, res) => {
  try {
    const degrees = await thesisDao.getDegrees();
    res.json(degrees);
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

app.get('/api/thesis-proposals',
  isLoggedIn,
  isStudent,
  async (req, res) => {
    try {
      const studentId = req.user.id;
      const proposals = await thesisDao.listThesisProposalsFromStudent(studentId);
      const proposalsPopulated = await Promise.all(
        proposals.map(async proposal => {
          return await _populateProposal(proposal);
        })
      );

      // Not used right now, but it's here for potential future use
      const metadata = {
        index: 0,
        count: proposals.length,
        total: proposals.length,
        currentPage: 1
      };
      res.json({ $metadata: metadata, items: proposalsPopulated });
    } catch (e) {
      console.error(e);
      res.status(500).json('Internal Server Error');
    }

});

app.get('/api/thesis-proposals/:id',
  isLoggedIn,
  isStudent,
  async (req, res) => {
    try {
      const studentId = req.user.id;
      const proposalId = req.params.id;

      const proposal = await thesisDao.getThesisProposal(proposalId, studentId);
      if (!proposal) {
          return res.status(404).json({ message: `Thesis proposal with id ${proposalId} not found.` });
      }

      res.json( await _populateProposal(proposal) );
    } catch (e) {
      console.error(e);
      res.status(500).json('Internal Server Error');
    }
});

// POST api/student/applications
app.post('/api/student/applications',
isLoggedIn,
isStudent,
async(req,res) => {
    const student_id = req.user.id; // logged in student
    const {thesis_proposal_id} = req.body;
    await thesisDao.applyForProposal(thesis_proposal_id, student_id).then
    ((applicationId)=>{  
      res.status(201).json(
        { 
          thesis_proposal_id: thesis_proposal_id, 
          student_id: student_id,
          status: 'waiting for approval'
        });
    })
  .catch((error) => {
    console.error(error); 
    res.status(500).json(`Failed to apply for thesis proposal. ${error.message || error}`);
  });
});

// GET api/teacher/thesis_proposals
app.get('/api/teacher/thesis_proposals',
isLoggedIn,
isTeacher,
async (req, res) => {
  try {
    const teacherId = req.user.id;
    const thesisProposals = await thesisDao.listThesisProposalsTeacher(teacherId);

    res.json(thesisProposals);
  } catch (e) {
    console.error(e);
    res.status(500).json('Internal Server Error');
  }
});

app.get('/api/teacher/applications/:proposal_id',
isLoggedIn,
isTeacher,
async (req, res) => {
  try {
    const proposal_id=req.params.proposal_id;
    const teacherId = req.user.id;
    const applications = await thesisDao.listApplicationsForTeacherThesisProposal(proposal_id, teacherId);
    res.json(applications);
  } catch (e) {
    console.error(e);
    res.status(500).json('Internal Server Error');
  }
});

const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});

module.exports = { app, server };

/**
 * Serialize and populate a proposal object in order to have all the data needed by the API
 *
 * @param {ThesisProposalRow} proposalData
 * @return {Promise<object>}
 * @private
 */
async function _populateProposal(proposalData) {
  return {
    id: proposalData.proposal_id,
    title: proposalData.title,
    status: _getProposalStatus(proposalData),
    supervisor: await thesisDao.getSupervisorOfProposal(proposalData.proposal_id)
        .then( _serializeTeacher ),
    coSupervisors: {
      internal: await thesisDao.getInternalCoSupervisorsOfProposal(proposalData.proposal_id)
          .then( supervisors => {
            return supervisors.map( supervisor => _serializeTeacher(supervisor));
          }),
      external: await thesisDao.getExternalCoSupervisorsOfProposal(proposalData.proposal_id)
    },
    type: proposalData.type,
    description: proposalData.description,
    requiredKnowledge: proposalData.required_knowledge,
    notes: proposalData.notes,
    expiration: proposalData.expiration,
    level: proposalData.level,
    cds: await degreeDao.getDegreeFromCode(proposalData.cds)
        .then( degree => {
          if (!degree) {
            // Should never happen, but just in case
            throw new Error(`Degree with code ${proposalData.cds} not found`);
          }

          return _serializeDegree(degree);
        }),
    keywords: await thesisDao.getKeywordsOfProposal(proposalData.proposal_id),
    groups: await thesisDao.getProposalGroups(proposalData.proposal_id)
  };
}

/**
 * Return the status of a proposal
 *
 * @param proposalData
 * @return {'EXPIRED' | 'ACTIVE'}
 * @private
 */
function _getProposalStatus(proposalData) {
  const now = new AdvancedDate();
  const expirationDate = new AdvancedDate(proposalData.expiration);

  if (expirationDate.isBefore(now)) {
    return 'EXPIRED';
  }

  return 'ACTIVE';
}

/**
 * Serializes a degree object to a more compact format for the API
 *
 * @param {DegreeRow} degree
 * @return {{code: string, title: string}}
 * @private
 */
function _serializeDegree(degree) {
  return {
    code: degree.cod_degree,
    title: degree.title_degree
  };
}

/**
 * Serialize a teacher object to a more compact format for the API
 *
 * @param {TeacherRow} teacher
 * @return {{id: string, name: string, surname: string, email: string, codGroup: string, codDepartment: string}}
 * @private
 */
function _serializeTeacher(teacher) {
  return {
    id: teacher.id,
    name: teacher.name,
    surname: teacher.surname,
    email: teacher.email,
    codGroup: teacher.cod_group,
    codDepartment: teacher.cod_department
  };
}

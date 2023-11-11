'use strict';

/*** Importing modules ***/
const express = require('express');
const session = require('express-session');
const { check, validationResult } = require('express-validator'); // validation middleware
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const thesisDao = require('./thesis_dao.js');
const usersDao = require('./users_dao.js');

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

// 1. Insert a new thesis proposal
// POST api/teacher/thesis_proposals
app.post('/api/teacher/thesis_proposals',
isLoggedIn,
isTeacher,
async (req,res) => {
  const supervisor_id  = req.user.id;
  const {title, co_supervisors_id, type, description, required_knowledge, notes, expiration, level, cds, keywords} = req.body;

  if (!title || !type || !description || !expiration || !level || !cds || !keywords ) {
    return res.status(400).json('Missing required fields.');
  }

  // Array to store all grous 
  const groups = [];

  // Get supervisor's group and add it to the array
  const supervisor_group = await thesisDao.getGroup(supervisor_id);
  groups.push(supervisor_group);

  // Check if there are co-supervisors and if yes, retrieve their cod_group
  if (co_supervisors_id.length > 0) {
    for (const co_supervisor of co_supervisors_id) {
      const co_supervisor_group = await thesisDao.getGroup(co_supervisor);
      groups.push(co_supervisor_group);
    }
  }

  thesisDao.createThesisProposal(title, supervisor_id, co_supervisors_id, type, groups, description, required_knowledge, notes, expiration, level, cds, keywords)
  .then((thesisProposalId)=>{
    res.status(201).json(
      { 
        id: thesisProposalId,
        title: title,
        supervisor_id: supervisor_id,
        co_supervisors_id: co_supervisors_id,
        type: type,
        groups: groups,
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
    res.status(500).json(`Failed to create thesis proposal. ${error.message || error}`);
  });
});

// 2. Get list of teachers not logged
//GET /api/teachers
app.get('/api/teachers', (req, res) => {
  try {
    const excludedTeacherId = req.user.id; // logged in teacher
    const teacherList = getTeacherListExcept(excludedTeacherId);

    res.json({ teachers: teacherList });
  } catch (error) {
    res.status(500).json('Internal Server Error');
  }
});

// 3. Search for thesis proposals
// GET api/student/:id/thesis_proposals?title=...&supervisor=...&co-supervisor=...&tags=...&keywords=...&type=...

// 4. Apply for a thesis proposal
// POST api/student/:id/applications

// 5. List all applications for a teacher's thesis proposals
// GET api/teacher/:id/applications

// 6. Accept an application
// PATCH api/teacher/:id/applications/:id

// 7. Reject an application
// PATCH api/teacher/:id/applications/:id

// 8. List student's application decisions
// GET api/student/:id/applications

// 9. List professor's active thesis proposala
// GET api/teacher/:id/thesis_proposals

// 10. Update a thesis proposal
// PATCH api/teacher/:id/thesis_proposals/:id

const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});

module.exports = { app, server };
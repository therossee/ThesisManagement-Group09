'use strict';

/*** Importing modules ***/

const dotenv = require("dotenv");
dotenv.config({ DOTENV_KEY: process.env.TM_DOTENV_KEY });

const fs = require('fs');
const path = require('path');
const bodyParser = require("body-parser");

const passport = require('passport');
const passportSaml = require('passport-saml');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');

const thesisDao = require('./thesis_dao.js');
const usersDao = require('./users_dao.js');
const degreeDao = require('./degree_dao.js');
const AdvancedDate = require("./AdvancedDate");
const schemas = require('./schemas.js');
const { sendEmailApplicationStatusChange } = require("./email");
const AppError = require("./errors/AppError");
const { ZodError } = require("zod");

/*** init express and setup the middlewares ***/
const app = express();
app.use(morgan("dev"));
app.use(express.json());

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.static('public'));

app.use(
session({
  secret: "session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { _expires: 60000000, maxAge: 60000000 },
})
);

// Serialize user to the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Setup passport-saml strategy
passport.use(
  new passportSaml.Strategy(
  {
    path: '/sso/callback',
    entryPoint: 'https://thesis-management-09.eu.auth0.com/samlp/JbUVcU90I7wK6nuQXaVty41vHEBHC8cF',
    issuer: 'urn:thesis-management-09.eu.auth0.com',
    callbackUrl: 'http://localhost:3000/sso/callback',
    logoutUrl:
        "https://thesis-management-09.eu.auth0.com/samlp/JbUVcU90I7wK6nuQXaVty41vHEBHC8cF/logout",
    cert: fs.readFileSync(path.join(__dirname, 'thesis-management-09.pem'), 'utf8'),
    signatureAlgorithm: 'sha1',
    acceptedClockSkewMs: 5000, // 5 seconds
    disableRequestedAuthnContext: true,
    identifierFormat: null, // Use default identifier format
  },
  function(profile, done){
    profile.auth0_id = profile["http://schemas.auth0.com/user_id"];
    profile.id = profile['http://schemas.auth0.com/nickname'];
    profile.name =
      profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    done(null, profile);
  },
  )
);


app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authenticated" });
};

const isStudent = async(req, res, next) => {
  if(req.isAuthenticated()){
    const loggedUserInfo = await usersDao.getUserInfo(req.user.auth0_id);
    if(loggedUserInfo.role==='student')
      return next();
  }
  return res.status(403).json('Unauthorized');
}

const isTeacher = async(req, res, next) => {
 if(req.isAuthenticated()){
  const loggedUserInfo = await usersDao.getUserInfo(req.user.auth0_id);
  if(loggedUserInfo.role==='teacher')
    return next();
  }
  return res.status(403).json('Unauthorized');
}

// Endpoint to initiate SAML authentication
app.get(
  "/login",
  passport.authenticate("saml", { 
    failureRedirect: "/", 
    failureFlash: true 
  }),
  (req, res) => {
    res.redirect("http://localhost:5173");
  }
);

// Callback endpoint where the SAML response is received
app.post(
  "/sso/callback",
  bodyParser.urlencoded({ extended: false }),
  passport.authenticate("saml", {
    failureRedirect: "/",
    failureFlash: true,
  }),
  function (req, res) {
    res.redirect("http://localhost:5173");
  }
);

// Logout endpoint
app.post("/logout", (req, res, next) => {
  res.clearCookie("connect.sid");
  req.logout(function (err) {
    req.session.destroy(function (err) {
      res.send();
    });
  });
});

app.get('/api/user', 
async(req, res) => {
  try{
    if (req.isAuthenticated()) {
      res.status(200).json(req.user);
    } else { 
      res.status(401).json('Unauthorized');
    }
  } catch (e) { 
    console.error(e);
    res.status(500).json('Internal Server Error');
  }
});

app.get('/api/userInfo/:auth0_id', 
async(req, res) => {
	await usersDao.getUserInfo(req.params.auth0_id)
		.then((userInfo) => res.status(200).json(userInfo))
		.catch((err) => {
      console.error(err);
			res.status(503).json('error retrieving user info');
		});
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
  const loggedUserInfo = await usersDao.getUserInfo(req.user.auth0_id);
  const supervisor_id = loggedUserInfo.id;
  const {title, internal_co_supervisors_id, external_co_supervisors_id, type, description, required_knowledge, notes, level, cds, keywords} = req.body;
  let expiration = req.body.expiration;

  if (!title || !type || !description || !expiration || !level || !cds || !keywords ) {
    return res.status(400).json('Missing required fields.');
  }

  expiration = expiration + 'T23:59:59.999Z';

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
    const loggedUserInfo = await usersDao.getUserInfo(req.user.auth0_id); 
    const excludedTeacherId = loggedUserInfo.id;
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
async (req, res) => {
  try {
    const loggedUserInfo = await usersDao.getUserInfo(req.user.auth0_id);
    if (loggedUserInfo.role==='student') {
      const studentId = loggedUserInfo.id;
      const proposals = await thesisDao.listThesisProposalsFromStudent(studentId);
      const cds = await usersDao.getStudentDegree(studentId);
      const proposalsPopulated = await Promise.all(
        proposals.map(async proposal => {
          return await _populateProposal(proposal, cds);
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
    } else if (loggedUserInfo.role==='teacher') {
      const thesisProposals = await thesisDao.listThesisProposalsTeacher(loggedUserInfo.id);
      const proposalsPopulated = await Promise.all(
        thesisProposals.map(async proposal => {
          const cds = await thesisDao.getThesisProposalCds(proposal.proposal_id);
          return await _populateProposal(proposal, cds);
        })
      );

      // Not used right now, but it's here for potential future use
      const metadata = {
        index: 0,
        count: thesisProposals.length,
        total: thesisProposals.length,
        currentPage: 1
      };
      res.json({ $metadata: metadata, items: proposalsPopulated });
    } else {
      // Handle unauthorized case if neither student nor teacher
      res.status(403).json('Unauthorized');
    }
  } catch (e) {
    console.error(e);
    res.status(500).json('Internal Server Error');
  }
});

app.get('/api/thesis-proposals/:id',
isLoggedIn,
async (req, res) => {
try {
  const loggedUserInfo = await usersDao.getUserInfo(req.user.auth0_id);
  if (loggedUserInfo.role==='student') {
    const studentId = loggedUserInfo.id;
    const proposalId = req.params.id;

    const proposal = await thesisDao.getThesisProposal(proposalId, studentId);
    const studentDegree = await usersDao.getStudentDegree(studentId);
    if (!proposal) {
        return res.status(404).json({ message: `Thesis proposal with id ${proposalId} not found.` });
    }

    res.json( await _populateProposal(proposal, studentDegree) );
  }
  else if (loggedUserInfo.role==='teacher') {
    const teacherId = loggedUserInfo.id;
    const proposalId = req.params.id;

    const proposal = await thesisDao.getThesisProposalTeacher(proposalId, teacherId);
    const cds = await thesisDao.getThesisProposalCds(proposalId);
    if (!proposal) {
      return res.status(404).json({ message: `Thesis proposal with id ${proposalId} not found.` });
    }

    res.json( await _populateProposal(proposal, cds) );
  }
  else{
    // Handle unauthorized case if neither student nor teacher
    res.status(403).json('Unauthorized');
  }
} catch (e) {
  console.error(e);
  res.status(500).json('Internal Server Error');
}
});

app.put('/api/thesis-proposals/:id',
isLoggedIn,
isTeacher,
async (req, res) => {
  try {
    const loggedUserInfo = await usersDao.getUserInfo(req.user.auth0_id);
    const supervisor_id  = loggedUserInfo.id;
    const proposal_id = req.params.id;

    const applications = await thesisDao.listApplicationsForTeacherThesisProposal(proposal_id, supervisor_id);
    if (applications.some( application => application.status === 'accepted' )) {
        return res.status(403).json({ message: 'Cannot edit a proposal with accepted applications.' });
    }

    const thesis = schemas.APIThesisProposalSchema.parse(req.body);

    // Set to store all grous
    const unique_groups = new Set();
    await thesisDao.getGroup(supervisor_id).then( group => unique_groups.add(group) );
    await Promise.all(
        thesis.internal_co_supervisors_id.map(async id => {
          return thesisDao.getGroup(id).then( group => unique_groups.add(group) );
        })
    );
    thesis.groups = [...unique_groups];

    const id = await thesisDao.updateThesisProposal(proposal_id, supervisor_id, thesis);
    if (!id) {
      return res.status(404).json({ message: `Thesis proposal with id ${proposal_id} not found.` });
    }

    const proposal = await thesisDao.getThesisProposalById(proposal_id);
    if (!proposal) {
      return res.status(404).json({ message: `Thesis proposal with id ${proposal_id} not found.` });
    }
    const cds = await thesisDao.getThesisProposalCds(proposal_id);

    res.status(200).send( await _populateProposal(proposal, cds) );
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).json({ message: 'Some properties are missing or invalid.', errors: e.issues });
    } else {
      console.error(e);
      res.status(500).json('Internal Server Error');
    }
  }
}
);

app.delete('/api/thesis-proposals/:id',
isLoggedIn,
isTeacher,
  async (req, res) => {
    try {
      const loggedUserInfo = await usersDao.getUserInfo(req.user.auth0_id);
      const teacherId = loggedUserInfo.id;
      const proposalId = req.params.id;

      await thesisDao.deleteThesisProposalById(proposalId, teacherId)
          .then( applicationsCancelled => {
            setImmediate( () => {
              const reason = 'The thesis proposal has been removed from the website.';
              for (const application of applicationsCancelled) {
                _notifyApplicationStatusChange(application.student_id, application.proposal_id, application.status, reason);
              }
            });

            return res.status(204).send();
          })
          .catch( error => {
            if (error instanceof AppError) {
              return error.sendHttpResponse(res);
            } else {
              throw error;
            }
          });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

app.patch('/api/thesis-proposals/archive/:id',
  isLoggedIn,
  isTeacher,
  async (req, res) => {
    try {
      const loggedUserInfo = await usersDao.getUserInfo(req.user.auth0_id);
      const teacherId = userInfo.id;
      const proposalId = req.params.id;

      await thesisDao.archiveThesisProposalById(proposalId, teacherId)
          .then( applicationsArchived => {
            setImmediate( () => {
              const reason = 'The thesis proposal has been archived from the website.';
              for (const application of applicationsArchived) {
                _notifyApplicationStatusChange(application.student_id, application.proposal_id, application.status, reason);
              }
            });

            return res.status(204).send();
          })
          .catch( error => {
            if (error instanceof AppError) {
              return error.sendHttpResponse(res);
            } else {
              throw error;
            }
          });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

app.post('/api/student/applications',
isLoggedIn,
isStudent,
async(req,res) => {
    const loggedUserInfo = await usersDao.getUserInfo(req.user.auth0_id);
    const student_id = loggedUserInfo.id;
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
    res.status(500).json(`Failed to apply for proposal. ${error.message || error}`);
  });
});

app.get('/api/teacher/applications/:proposal_id',
isLoggedIn,
isTeacher,
async (req, res) => {
  try {
    const loggedUserInfo = await usersDao.getUserInfo(req.user.auth0_id);
    const teacherId = loggedUserInfo.id;
    const proposal_id=req.params.proposal_id;
    const applications = await thesisDao.listApplicationsForTeacherThesisProposal(proposal_id, teacherId);
    res.json(applications);
  } catch (e) {
    console.error(e);
    res.status(500).json('Internal Server Error');
  }
});

app.get('/api/student/active-application',
isLoggedIn,
isStudent,
async (req, res) => {
  try {
    const loggedUserInfo = await usersDao.getUserInfo(req.user.auth0_id);
    const studentId = loggedUserInfo.id;
    const studentApplications = await thesisDao.getStudentActiveApplication(studentId)
    res.json(studentApplications);
  } catch (e) {
    console.error(e);
    res.status(500).json('Internal Server Error');
  }
});

app.patch('/api/teacher/applications/accept/:proposal_id',
isLoggedIn,
isTeacher,
async (req, res) => {
const { proposal_id } = req.params;
const { student_id } = req.body;

    if (!student_id ) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
      const status = "accepted";
      const success = await thesisDao.updateApplicationStatus(student_id, proposal_id, status);
      if (!success) {
        return res.status(404).json({ message: `No application with the status "waiting for approval" found for this proposal.` });
      }
      setImmediate( async () => _notifyApplicationStatusChange(student_id, proposal_id, status) );

      const applicationsCancelled = await thesisDao.cancelOtherApplications(student_id, proposal_id);
      setImmediate(async () => {
        const reason = 'Another student has been accepted for this thesis proposal.';
        for (const application of applicationsCancelled) {
          _notifyApplicationStatusChange(application.student_id, application.proposal_id, application.status, reason);
        }
      });

  res.status(200).json({ message: 'Thesis accepted and others rejected successfully' });

} catch (error) {
  console.error(error);
  res.status(500).json(`Internal Server Error`);
}
})

app.patch('/api/teacher/applications/reject/:proposal_id',
isLoggedIn,
isTeacher,
async (req, res) => {
  const { proposal_id } = req.params;
  const { student_id } = req.body;

  if (!student_id ) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const status = "rejected";
    const success = await thesisDao.updateApplicationStatus(student_id, proposal_id, status);
    if (!success) {
        return res.status(404).json({ message: `No application with the status "waiting for approval" found for this proposal.` });
    }
    setImmediate( async () => _notifyApplicationStatusChange(student_id, proposal_id, status) );

    res.status(200).json({ message: 'Thesis successfully rejected' });
  } catch (error) {
    console.error(error);
    res.status(500).json(`Internal Server Error`);
  }

})

app.get('/api/student/applications-decision',
isLoggedIn,
isStudent,
async (req, res) => {
  try {
    const loggedUserInfo = await usersDao.getUserInfo(req.user.auth0_id);
    const studentId = loggedUserInfo.id;
    const applications = await thesisDao.listApplicationsDecisionsFromStudent(studentId);
    res.json(applications);
  } catch (e) {
    console.error(e);
    res.status(500).json('Internal Server Error');
  }
});

app.get('/api/student/:id/career',
isLoggedIn,
isTeacher,
async (req, res) => {
  try{
    const studentId = req.params.id;
    const student = await usersDao.getStudentById(studentId);
    if(!student){
      return res.status(404).json({ message: `Student with id ${studentId} not found.` });
    }
    const career = await usersDao.getStudentCareer(studentId);
    res.json(career);
  }catch(e){
    console.error(e);
    res.status(500).json('Internal Server Error');
  } 
})

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
async function _populateProposal(proposalData, cds) {
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
    creation_date: proposalData.creation_date,
    expiration: proposalData.expiration,
    level: proposalData.level,
    cds: cds,
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

/**
 * Notify the student that the status of his/her application has changed.
 *
 * @param {string} studentId
 * @param {string} proposalId
 * @param {string} status
 * @param {string} [reason]
 *
 * @return {Promise<void>}
 * @private
 */
async function _notifyApplicationStatusChange (studentId, proposalId, status, reason) {
  const student = await usersDao.getStudentById(studentId);
  if (!student) {
    console.error(`Student with id "${studentId}" not found, cannot notify application status change.`);
    return;
  }

  const thesis = await thesisDao.getThesisProposalById(proposalId);
  if (!thesis) {
    console.error(`Thesis proposal with id "${proposalId}" not found, cannot notify application status change.`);
    return;
  }

  sendEmailApplicationStatusChange(student.email, thesis, status, reason)
      .catch( e => console.error(`Failed to send email to student "${studentId}"`, e) );
}

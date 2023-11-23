'use strict';

/* Data Access Object (DAO) module for accessing thesis data */

const db = require('./db');
const AdvancedDate = require('./AdvancedDate');

exports.createThesisProposal = (title, supervisor_id, internal_co_supervisors_id, external_co_supervisors_id, type, groups, description, required_knowledge, notes, expiration, level, cds, keywords) => {
  return new Promise((resolve, reject) => {

    let currentDate = new AdvancedDate();
    const exp = new AdvancedDate(expiration);
    if(exp.isBefore(currentDate)){
      reject("The expiration date must be after the creation date");
    }

    currentDate = currentDate.toISOString();

    const insertThesisProposalQuery = `
      INSERT INTO thesisProposal (title, supervisor_id, type, description, required_knowledge, notes, creation_date, expiration, level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?); `;

    const insertProposalKeywordQuery = `
      INSERT INTO proposalKeyword (proposal_id, keyword)
      VALUES (?, ?); `;

    const insertInternalCoSupervisorsQuery = `
      INSERT INTO thesisInternalCoSupervisor (proposal_id, co_supervisor_id)
      VALUES (?, ?); `;

    const insertExternalCoSupervisorsQuery = `
      INSERT INTO thesisExternalCoSupervisor (proposal_id, co_supervisor_id)
      VALUES (?, ?); `;

    const insertGroupsQuery = `
      INSERT INTO proposalGroup (proposal_id, cod_group)
      VALUES (?, ?); `;

    const insertCdsQuery = `
      INSERT INTO proposalCds (proposal_id, cod_degree)
      VALUES (?, ?); `;

    // Self-called transaction
    db.transaction(() => {
      const res = db.prepare(insertThesisProposalQuery).run(title, supervisor_id, type, description, required_knowledge, notes, currentDate, expiration, level);
      const proposalId = res.lastInsertRowid;

      // Keywords insertion
      keywords.forEach(keyword => {
        db.prepare(insertProposalKeywordQuery).run(proposalId, keyword);
      });

      if (internal_co_supervisors_id.length > 0) {
        internal_co_supervisors_id.forEach(internal_co_supervisor_id => {
          db.prepare(insertInternalCoSupervisorsQuery).run(proposalId, internal_co_supervisor_id);
        });
      }

      if (external_co_supervisors_id.length > 0) {
        external_co_supervisors_id.forEach(external_co_supervisor_id => {
          db.prepare(insertExternalCoSupervisorsQuery).run(proposalId, external_co_supervisor_id);
        });
      }

      groups.forEach(group => {
        db.prepare(insertGroupsQuery).run(proposalId, group);
      });

      cds.forEach(cod_degree => {
        db.prepare(insertCdsQuery).run(proposalId, cod_degree);
      });

      resolve(proposalId)
    })()
      .catch((err) => {
        reject(err);
      });
  });
};

exports.getTeacherListExcept = (id) => {
  return new Promise((resolve) => {
    const query = `SELECT * FROM teacher WHERE id <> ?; `;
    const teachers = db.prepare(query).all(id);
    resolve(teachers);
  })
};

exports.getExternalCoSupervisorList = () => {
  return new Promise((resolve) => {
    const query = `SELECT * FROM externalCoSupervisor;`;
    const externalCoSupervisors = db.prepare(query).all();
    resolve(externalCoSupervisors);
  })
};

exports.getGroup = (teacherId) => {
  return new Promise((resolve) => {
    const getGroupQuery = `SELECT cod_group FROM teacher WHERE id=? `;
    const res = db.prepare(getGroupQuery).get(teacherId);
    resolve(res.cod_group)
  })
};

exports.getAllKeywords = () => {
  return new Promise((resolve) => {
    const getKeywords = `SELECT DISTINCT(keyword) FROM proposalKeyword`;
    const res = db.prepare(getKeywords).all();
    // Extracting the keyword property from each row
    const keywords = res.map(row => row.keyword);
    resolve(keywords)
  })
};

exports.getDegrees = () => {
  return new Promise((resolve) => {
    const getDegrees = `SELECT * FROM degree`;
    const res = db.prepare(getDegrees).all();
    resolve(res)
  })
};

/**
 * Return the proposal with the given id related to a student degree (if exists)
 *
 * @param {string} proposalId
 * @param {string} studentId
 *
 * @return {Promise<ThesisProposalRow | null>}
 */
exports.getThesisProposal = (proposalId, studentId) => {
  return new Promise((resolve) => {
    const currentDate = new AdvancedDate().toISOString();
    const query = `SELECT * FROM thesisProposal P
        JOIN proposalCds PC ON P.proposal_id = PC.proposal_id
        JOIN degree D ON PC.cod_degree = D.cod_degree
        JOIN student S ON S.cod_degree = D.cod_degree
        WHERE P.proposal_id = ? AND S.id = ? 
        AND P.expiration > ? AND P.creation_date < ?;`;

    const thesisProposal = db.prepare(query).get(proposalId, studentId, currentDate, currentDate);
    resolve(thesisProposal ?? null);
  })
};

/**
 * Return the list of thesis proposals related to a student degree
 *
 * @param {string} studentId
 * @return {Promise<ThesisProposalRow[]>}
 */
exports.listThesisProposalsFromStudent = (studentId) => {
  return new Promise((resolve) => {
    const currentDate = new AdvancedDate().toISOString();
    const query = `SELECT *
        FROM thesisProposal P
        JOIN proposalCds C ON C.proposal_id = P.proposal_id
        JOIN degree D ON C.cod_degree = D.cod_degree
        JOIN student S ON S.cod_degree = D.cod_degree
        WHERE S.id = ?
        AND NOT EXISTS (
            SELECT 1
            FROM thesisApplication A
            WHERE A.proposal_id = P.proposal_id
            AND A.status = 'accepted'
        )
        AND P.expiration > ?
        AND P.creation_date < ?;`;

    const thesisProposals = db.prepare(query).all(studentId, currentDate, currentDate);
    resolve(thesisProposals);
  })
};

/**
 * Return the list of keywords of a thesis proposal
 *
 * @param {string} proposalId
 * @return {Promise<string[]>}
 */
exports.getKeywordsOfProposal = (proposalId) => {
  return new Promise((resolve) => {
    const query = `SELECT keyword FROM proposalKeyword WHERE proposal_id = ?`;
    const data = db.prepare(query).all(proposalId);
    resolve(data.map(row => row.keyword));
  })
};

/**
 * Return the list of thesis proposals groups
 *
 * @param {string} proposalId
 * @return {Promise<string[]>}
 */
exports.getProposalGroups = (proposalId) => {
  return new Promise((resolve) => {
    const query = `SELECT cod_group FROM proposalGroup WHERE proposal_id = ?`;
    const data = db.prepare(query).all(proposalId);

    resolve(data.map(row => row.cod_group));
  })
};

/**
 * Return the list of internal co-supervisors (teachers) of a thesis proposal
 *
 * @param {string} proposalId
 *
 * @return {Promise<TeacherRow[]>}
 */
exports.getInternalCoSupervisorsOfProposal = (proposalId) => {
  return new Promise((resolve) => {
    const query = `SELECT * FROM thesisInternalCoSupervisor I JOIN teacher T ON I.co_supervisor_id = T.id WHERE I.proposal_id = ?`;
    const data = db.prepare(query).all(proposalId);
    resolve(data);
  })
};

/**
 * Return the list of external co-supervisors of a thesis proposal
 *
 * @param {string} proposalId
 * @return {Promise<ExternalCoSupervisorRow[]>}
 */
exports.getExternalCoSupervisorsOfProposal = (proposalId) => {
  return new Promise((resolve) => {
    const query = `SELECT * FROM thesisExternalCoSupervisor E JOIN externalCoSupervisor C ON E.co_supervisor_id = C.id WHERE E.proposal_id = ?`;
    const data = db.prepare(query).all(proposalId);
    resolve(data);
  })
};

/**
 * Return the supervisor of a thesis proposal
 *
 * @param {string} proposalId
 * @return {Promise<TeacherRow>}
 */
exports.getSupervisorOfProposal = (proposalId) => {
  return new Promise((resolve) => {
    const query = `SELECT T.id, T.surname, T.name, T.email, T.cod_group, T.cod_department FROM thesisProposal P JOIN teacher T ON P.supervisor_id = T.id WHERE P.proposal_id = ?`;
    const data = db.prepare(query).get(proposalId);
    resolve(data);
  })
};


/**
 * @typedef {Object} ThesisProposalRow
 *
 * @property {string} proposal_id
 * @property {string} title
 * @property {string} supervisor_id
 * @property {string} type
 * @property {string} description
 * @property {string} [required_knowledge]
 * @property {string} [notes]
 * @property {string} expiration
 * @property {string} level
 * @property {string} cds
 */

/**
 * @typedef {Object} TeacherRow
 *
 * @property {string} id
 * @property {string} surname
 * @property {string} name
 * @property {string} email
 * @property {string} cod_group
 * @property {string} cod_department
 */

/**
 * @typedef {Object} ExternalCoSupervisorRow
 *
 * @property {string} id
 * @property {string} surname
 * @property {string} name
 * @property {string} email
 */

exports.applyForProposal = (proposal_id, student_id) => {
  return new Promise((resolve, reject) => {
    const currentDate = new AdvancedDate().toISOString();

    //  Check if the proposal belong to the degree of the student
    const checkProposalDegree = `SELECT * FROM proposalCds WHERE proposal_id=? AND cod_degree=(SELECT cod_degree FROM student WHERE id=?)`;
    const proposal_correct = db.prepare(checkProposalDegree).get(proposal_id, student_id);
    if(!proposal_correct){
      reject("The proposal doesn't belong to the student degree");
    }

    // Check if the proposal is active
    const checkProposalActive = `SELECT * FROM thesisProposal P WHERE P.proposal_id=? AND P.expiration > ? AND P.creation_date < ? 
                                 AND NOT EXISTS (
                                    SELECT 1
                                    FROM thesisApplication A
                                    WHERE A.proposal_id = P.proposal_id
                                    AND A.status = 'accepted'
                                )`;
    console.log('Proposta attiva: '+checkProposalActive);
    const proposal_active = db.prepare(checkProposalActive).get(proposal_id, currentDate, currentDate);
    if(!proposal_active){
      reject("The proposal is not active");
    }
    
    const insertApplicationQuery = `
    INSERT INTO thesisApplication (proposal_id, student_id, creation_date)
    VALUES (?, ?, ?); `; // at first the application has default status 'waiting for approval'

    const res = db.prepare(insertApplicationQuery).run(proposal_id, student_id, currentDate);
    resolve(res.lastInsertRowid);
  })
}

exports.listThesisProposalsTeacher = (teacherId) => {
  return new Promise((resolve) => {
    const currentDate = new AdvancedDate().toISOString();
    const getProposals = `SELECT * FROM thesisProposal WHERE supervisor_id=? AND expiration > ? AND creation_date < ?`;
    const proposals = db.prepare(getProposals).all(teacherId, currentDate, currentDate);
    resolve(proposals)

  })
};

exports.listApplicationsForTeacherThesisProposal = (proposal_id, teacherId) => {
  return new Promise((resolve) => {
    const currentDate = new AdvancedDate().toISOString();
    const getApplications = `SELECT s.name, s.surname, ta.status, s.id
    FROM thesisApplication ta, thesisProposal tp, student s
    WHERE ta.proposal_id = tp.proposal_id AND s.id = ta.student_id AND ta.proposal_id=? AND tp.supervisor_id= ? 
    AND ta.creation_date < ? AND tp.expiration > ? AND tp.creation_date < ?`;

    const applications = db.prepare(getApplications).all(proposal_id, teacherId, currentDate, currentDate, currentDate);
    resolve(applications)

  })
};

exports.getStudentApplications = (student_id) => {
  return new Promise((resolve) => {
    const currentDate = new AdvancedDate().toISOString();
    const query = `SELECT proposal_id FROM thesisApplication WHERE student_id=? AND creation_date < ?`;
    const res = db.prepare(query).all(student_id, currentDate);
    resolve(res)
  })
};

exports.updateApplicationStatus = (studentId, proposalId, status) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE thesisApplication
      SET status = ?
      WHERE student_id = ? AND proposal_id = ?
    `
    const res = db.prepare(query).run(status, studentId, proposalId);

    const rowCount = res.changes;

    resolve(rowCount);
  })
};

exports.rejectOtherApplications = (studentId, proposalId) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE thesisApplication
      SET status = 'canceled'
      WHERE student_id <> ? AND proposal_id = ?
    `
    const res = db.prepare(query).run(studentId, proposalId);

    const rowCount = res.changes;

    resolve(rowCount);
  })
};

exports.getThesisProposalCds = (proposalId) => {
  return new Promise((resolve) => {
    const query = `SELECT d.cod_degree, d.title_degree FROM proposalCds p, degree d WHERE proposal_id = ? AND p.cod_degree = d.cod_degree`;
    const res = db.prepare(query).all(proposalId);
    console.log(res);
    resolve(res);
  })
};
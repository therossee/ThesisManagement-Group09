'use strict';

/* Data Access Object (DAO) module for accessing thesis data */

const db = require('./db');

// 1. Function to create a new thesis proposal
exports.createThesisProposal = (title, supervisor_id, internal_co_supervisors_id, external_co_supervisors_id, type, groups, description, required_knowledge, notes, expiration, level, cds, keywords) => {
    return new Promise((resolve, reject) => {
      try{
        const insertThesisProposalQuery = `
        INSERT INTO thesisProposal (title, supervisor_id, type, description, required_knowledge, notes, expiration, level, cds)
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

        // Self-called transaction
        db.transaction(() => {
          const res = db.prepare(insertThesisProposalQuery).run(title, supervisor_id, type, description, required_knowledge, notes, expiration, level, cds);
          const proposalId = res.lastInsertRowid;

          // Keywords insertion
          keywords.forEach(keyword => {
            db.prepare(insertProposalKeywordQuery).run(proposalId, keyword);
          });

          if(internal_co_supervisors_id.length > 0){
            internal_co_supervisors_id.forEach(internal_co_supervisor_id => {
              db.prepare(insertInternalCoSupervisorsQuery).run(proposalId, internal_co_supervisor_id);
            });
          }

          if(external_co_supervisors_id.length > 0){
            external_co_supervisors_id.forEach(external_co_supervisor_id => {
              db.prepare(insertExternalCoSupervisorsQuery).run(proposalId, external_co_supervisor_id);
            });
          }

          groups.forEach(group => {
            db.prepare(insertGroupsQuery).run(proposalId, group);
          });

          resolve(proposalId)
        })();
    } catch(err){
      reject(err)
    }
  })
};

// 2. Function to get list of teachers not logged
exports.getTeacherListExcept = (id) => {
  return new Promise((resolve)=>{
      const query = `SELECT * FROM teacher WHERE id <> ?; `;
      const teachers = db.prepare(query).all(id);
      resolve(teachers);
  })
};

// 3. Function to get list of external co-supervisors
exports.getExternalCoSupervisorList = () => {
  return new Promise((resolve)=>{
      const query = `SELECT * FROM externalCoSupervisor;`;
      const externalCoSupervisors = db.prepare(query).all();
      resolve(externalCoSupervisors);
  })
};

// 4. Function to retrieve the cod_group of a teacher
exports.getGroup = (teacherId) => {
  return new Promise((resolve) => {
      const getGroupQuery = `SELECT cod_group FROM teacher WHERE id=? `;
      const res = db.prepare(getGroupQuery).get(teacherId);
      resolve(res.cod_group)
  })
};

// Function to retrieve all the keywords
exports.getAllKeywords = () => {
  return new Promise((resolve) => {
      const getKeywords = `SELECT DISTINCT(keyword) FROM proposalKeyword`;
      const res = db.prepare(getKeywords).all();
      // Extracting the keyword property from each row
      const keywords = res.map(row => row.keyword);
      resolve(keywords)
  })
};

// Function to retrieve all the degrees
exports.getDegrees = () => {
  return new Promise((resolve) => {
      const getDegrees = `SELECT * FROM degree`;
      const res = db.prepare(getDegrees).all();
      // Extracting the degree property from each row
      //const keywords = res.map(row => row.keyword);
      resolve(res)
  })
};

// 5. Function to search for thesis proposals
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
        const query = `SELECT * FROM thesisProposal P
            JOIN degree D ON P.cds = D.cod_degree
            JOIN student S ON S.cod_degree = D.cod_degree
            WHERE P.proposal_id = ? AND S.id = ?`;

        const thesisProposal = db.prepare(query).get(proposalId, studentId);
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
        const query = `SELECT * FROM thesisProposal P
            JOIN degree D ON P.cds = D.cod_degree
            JOIN student S ON S.cod_degree = D.cod_degree
            WHERE S.id = ?`;

        const thesisProposals = db.prepare(query).all(studentId);
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
        resolve(data.map( row => row.keyword ));
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

        resolve(data.map( row => row.cod_group ));
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

// 6. Function to apply for a thesis proposal
exports.applyForProposal = (proposal_id, student_id) => {
  return new Promise((resolve, reject) => {
    const insertApplicationQuery = `
    INSERT INTO thesisApplication (proposal_id, student_id)
    VALUES (?, ?); `; // at first the application has default status 'waiting for approval'

    const res = db.prepare(insertApplicationQuery).run(proposal_id, student_id);
    resolve(res.lastInsertRowid);
  })
}
// 7. Function to list all applications for a teacher's thesis proposals

// 8. Function to accept an application

// 9. Function to reject an application

// 10. Function to list student's application decisions

// 11. Function to list professor's active thesis proposals

// 11. Function to update a thesis proposal
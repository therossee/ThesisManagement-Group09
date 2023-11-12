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
          
        resolve(proposalId);
    } catch(err){
      reject(err)
    }
  })
}

// 2. Function to get list of teachers not logged
exports.getTeacherListExcept = (id) => {
  return new Promise((resolve,reject)=>{
      const query = `SELECT * FROM teacher WHERE id <> ?; `;
      const teachers = db.prepare(query).all(id);
      resolve(teachers);
  })
}

// 3. Function to get list of teachers not logged
exports.getExternalCoSupervisorList = (id) => {
  return new Promise((resolve,reject)=>{
      const query = `SELECT * FROM externalCoSupervisor;`;
      const externalCoSupervisors = db.prepare(query).all();
      resolve(externalCoSupervisors);
  })
}

// 4. Function to retrieve the cod_group of a teacher
exports.getGroup = (teacherId) => {
  return new Promise((resolve, reject) => {
      const getGroupQuery = `SELECT cod_group FROM teacher WHERE id=? `;
      const res = db.prepare(getGroupQuery).get(teacherId)
      resolve(res.cod_group)
  })
}

// 5. Function to search for thesis proposals

// 6. Function to apply for a thesis proposal

// 7. Function to list all applications for a teacher's thesis proposals

// 8. Function to accept an application

// 9. Function to reject an application

// 10. Function to list student's application decisions

// 11. Function to list professor's active thesis proposals

// 11. Function to update a thesis proposal
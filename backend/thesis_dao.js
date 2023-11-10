'use strict';

/* Data Access Object (DAO) module for accessing thesis data */

const { db } = require('./db');

// 1. Function to create a new thesis proposal
exports.getGroup = (teacherId) => {
    return new Promise((resolve, reject) => {
        const getGroupQuery = `
        SELECT * FROM teacher WHERE id=?
      `;

        const res = db.prepare(getGroupQuery).run(teacherId)
        resolve(res);
    })
}

exports.createThesisProposal = (thesisTitle, id, coSupervisors, keywords, type, groups, description, knowledge, note, expiration, level, cds) => {
    return new Promise((resolve, reject) => {
        const insertThesisProposalQuery = `
        INSERT INTO thesisProposal (title, supervisor_id, type, description, required_knowledge, notes, expiration, level, cds)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

        const insertProposalKeywordQuery = `
      INSERT INTO proposalKeyword (proposal_id, keyword)
      VALUES (?, ?);
    `;

        const insertCoSupervisorsQuery = `
      INSERT INTO coSupervisor (proposal_id, co_supervisor_id)
      VALUES (?, ?);
    `;

        const insertGroupsQuery = `
      INSERT INTO proposalGroup (proposal_id, cod_group)
      VALUES (?, ?);
    `;

        const res = db.prepare(insertThesisProposalQuery).run(thesisTitle, id, type, description, knowledge, note, expiration, level, cds);
        const proposalId = res.lastInsertRowid();

        // Inserisce le keywords
        keywords.forEach(keyword => {
            db.prepare(insertProposalKeywordQuery).run(proposalId, keyword);
        });

        // Inserisce i supervisori nella tabella
        coSupervisors.forEach(supervisor => {
            db.prepare(insertCoSupervisorsQuery).run(proposalId, supervisor);
        });
        groups.forEach(group => {
            db.prepare(insertGroupsQuery).run(proposalId, group);
        });


        resolve(proposalId);
    })
}

exports.getTeacherListExcept = (id)=>{
    return new Promise((resolve,reject)=>{
        const query = `
    SELECT *
    FROM teacher
    WHERE id <> ?;
  `;

  const teachers = db.prepare(query).all(idToExclude);
  return teachers;
    })
}
// 2. Function to search for thesis proposals

// 3. Function to apply for a thesis proposal

// 4. Function to list all applications for a teacher's thesis proposals

// 5. Function to accept an application

// 6. Function to reject an application

// 7. Function to list student's application decisions

// 8. Function to list professor's active thesis proposals

// 9. Function to update a thesis proposal
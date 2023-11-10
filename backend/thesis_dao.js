'use strict';

/* Data Access Object (DAO) module for accessing thesis data */

const {db} = require('./db');

// 1. Function to create a new thesis proposal
exports.getGroup= (teacherId) =>{
    return new Promise((resolve, reject)=>{
        const getGroupQuery = `
        SELECT * FROM teacher WHERE id=?
      `;
    
      const res = db.prepare(getGroupQuery).run(teacherId)
      resolve(res);
    })
}

exports.createThesisProposal = (thesisTitle, id, coSupervisors, keywords, type, groups, description, knowledge, note, expiration, level, cds) => {
    return new Promise((resolve, reject)=>{
        const insertThesisProposalQuery = `
        INSERT INTO thesisProposal (thesisTitle, id, coSupervisors, keywords, type, groups, description, knowledge, note, expiration, level, cds)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      const insertProposalKeywordQuery = `
      INSERT INTO proposalKeyword (proposal_id, keyword)
      VALUES (?, ?);
    `;
    
      const res = db.prepare(insertThesisProposalQuery).run(thesisTitle, id, coSupervisors, keywords, type, groups, description, knowledge, note, expiration, level, cds);

      // Ottieni le keywords già presenti per la proposta
      const existingKeywords = db.prepare(`SELECT keyword FROM proposalKeyword;`).all().map(row => row.keyword);

      // Filtra solo le nuove keywords
      const newKeywords = keywords.filter(keyword => !existingKeywords.includes(keyword));

      // Inserisci solo le nuove keywords
      newKeywords.forEach(keyword => {
        db.prepare(insertProposalKeywordQuery).run(proposalId, keyword);
      });


      resolve(db.lastInsertRowid());
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
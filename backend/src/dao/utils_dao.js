'use strict';

/* Data Access Object (DAO) module for accessing utils data */

const db = require('../services/db');

/**
 * Return the list of teachers excluding the logged one
 * 
 * @param {string} id 
 * @returns {Promise<TeacherRow>}
 */
exports.getTeacherListExcept = (id) => {
    return new Promise((resolve) => {
      const query = `SELECT * FROM teacher WHERE id <> ?; `;
      const teachers = db.prepare(query).all(id);
      resolve(teachers);
    })
};
  
/**
 * Return the list of external co-supervisors
 * 
 * @returns {Promise<ExternalCoSupervisorRow>}
 */
exports.getExternalCoSupervisorList = () => {
    return new Promise((resolve) => {
      const query = `SELECT * FROM externalCoSupervisor;`;
      const externalCoSupervisors = db.prepare(query).all();
      resolve(externalCoSupervisors);
    })
};

/**
 * Return the list of keywords of the proposals
 * 
 * @returns {Promise<string[]>}
 */  
exports.getAllKeywords = () => {
    return new Promise((resolve) => {
      const getKeywords = `SELECT DISTINCT(keyword) FROM proposalKeyword`;
      const res = db.prepare(getKeywords).all();
      // Extracting the keyword property from each row
      const keywords = res.map(row => row.keyword);
      resolve(keywords)
    })
};
  
/**
 * Return the list of degrees
 * 
 * @returns {Promise<DegreeRow[]>}
 */
exports.getDegrees = () => {
    return new Promise((resolve) => {
      const getDegrees = `SELECT * FROM degree`;
      const res = db.prepare(getDegrees).all();
      resolve(res)
    })
};
  
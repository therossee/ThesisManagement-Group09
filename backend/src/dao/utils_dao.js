'use strict';

/* Data Access Object (DAO) module for accessing utils data */

const db = require('../services/db');

/**
 * Return the list of teachers excluding the logged one
 *
 * @param {string} id
 * @returns {Promise<TeacherRow>}
 */
exports.getTeacherListExcept = async (id) => {
    const query = `SELECT * FROM teacher WHERE id <> ? ORDER BY name, surname; `;

    return db.prepare(query).all(id);
};

/**
 * Return the list of external co-supervisors
 *
 * @returns {Promise<ExternalCoSupervisorRow>}
 */
exports.getExternalCoSupervisorList = async () => {
    const query = `SELECT * FROM externalCoSupervisor ORDER BY name, surname;`;

    return db.prepare(query).all();
};

/**
 * Return the list of keywords of the proposals
 *
 * @returns {Promise<string[]>}
 */
exports.getAllKeywords = async () => {
    const getKeywords = `SELECT DISTINCT(keyword) FROM proposalKeyword ORDER BY keyword;`;
    const res = db.prepare(getKeywords).all();
    // Extracting the keyword property from each row
    return res.map( row => row.keyword );
};

/**
 * Return the list of degrees
 *
 * @returns {Promise<DegreeRow[]>}
 */
exports.getDegrees = async () => {
    const getDegrees = `SELECT * FROM degree ORDER BY title_degree;`;

    return db.prepare(getDegrees).all();
};

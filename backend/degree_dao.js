'use strict';

/* Data Access Object (DAO) module for accessing users data */

const db = require('./db');

/**
 * Return the degree row with the given code
 *
 * @param {string} code
 * @return {Promise<DegreeRow | null>}
 */
exports.getDegreeFromCode = (code) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM degree WHERE cod_degree = ?';
        const degree = db.prepare(sql).get(code);
        if (degree) {
            resolve(degree);
        } else {
            resolve(null);
        }
    });
};

/**
 * @typedef {Object} DegreeRow
 *
 * @property {string} cod_degree
 * @property {string} title_degree
 */

'use strict';

/* Data Access Object (DAO) module for accessing users data */

const db = require('../services/db');

/**
 * Retrieve the degree of the student with the given id
 *
 * @param {string} id
 * @return {Promise<DegreePartialRow | null>}
 */
exports.getStudentDegree = (id) => {
    return new Promise((resolve) => {
        const sql = 'SELECT * FROM student s, degree d WHERE s.id = ? AND s.cod_degree = d.cod_degree';
        const row = db.prepare(sql).get(id);
        if (row) {
            let degree = { cod_degree: row.cod_degree, title_degree: row.title_degree };
            resolve(degree);
        } else {
            resolve(null);
        }
    });
};

/**
 * Return some data of the student with the given id
 *
 * @param {string} id
 * @return {Promise<StudentPartialRow | null>}
 */
exports.getStudentById = (id) => {
    return new Promise( resolve => {
        const sql = 'SELECT id, surname, name, email FROM student WHERE id = ?';
        const row = db.prepare(sql).get(id);
        if (!row) {
            resolve(null);
        }
        resolve({ id: row.id, surname: row.surname, name: row.name, email: row.email });
    })
};

/**
 * Return all the exams of the student with the given id
 *
 * @param {string} id
 * @return {Promise<Exams[]>}
 */
exports.getStudentCareer = (id) => {
    return new Promise((resolve) => {
        const sql = 'SELECT cod_course, title_course, cfu, grade, date FROM career WHERE id = ?';
        const rows = db.prepare(sql).all(id);
        resolve(rows);
    });
};

/**
 * Return the full teacher date associated to the given id
 *
 * @param {string} id
 * @return {Promise<TeacherRow | null>}
 */
exports.getTeacherById = (id) => {
    return new Promise( resolve => {
        const sql = 'SELECT * FROM teacher WHERE id = ?';
        const row = db.prepare(sql).get(id);
        if (!row) {
            resolve(null);
        }
        resolve(row);
    })
};

/**
 * Return the group of the teacher with the given id
 * 
 * @param {string} teacherId 
 * @returns {Promise<string>}
 */
exports.getGroup = (teacherId) => {
    return new Promise((resolve) => {
      const getGroupQuery = `SELECT cod_group FROM teacher WHERE id=? `;
      const res = db.prepare(getGroupQuery).get(teacherId);
      resolve(res.cod_group)
    })
};


/**
 * @typedef {Object} DegreePartialRow
 *
 * @property {string} cod_degree
 * @property {string} title_degree
 */

/**
 * @typedef {Object} StudentPartialRow
 *
 * @property {string} id
 * @property {string} surname
 * @property {string} name
 * @property {string} email
 */

/**
 * @typedef {Object} Exams
 *
 * @property {string} cod_course
 * @property {string} title_course
 * @property {number} cfu
 * @property {number} grade
 * @property {string} date
 */

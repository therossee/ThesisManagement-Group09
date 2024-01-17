'use strict';

/* Data Access Object (DAO) module for accessing users data */

const db = require('../services/db');

/**
 * Retrieve the degree of the student with the given id
 *
 * @param {string} id
 * @return {Promise<DegreePartialRow | null>}
 */
exports.getStudentDegree = async (id) => {
    const sql = 'SELECT * FROM student s, degree d WHERE s.id = ? AND s.cod_degree = d.cod_degree';

    const row = db.prepare(sql).get(id);
    if (row) {
        return { cod_degree: row.cod_degree, title_degree: row.title_degree };
    } else {
        return null;
    }
};

/**
 * Return some data of the student with the given id
 *
 * @param {string} id
 * @return {Promise<StudentPartialRow | null>}
 */
exports.getStudentById = async (id) => {
    const query = `SELECT id, surname, name, email FROM student WHERE id = ?;`;

    const row = db.prepare(query).get(id);
    if (row) {
        return { id: row.id, surname: row.surname, name: row.name, email: row.email };
    } else {
        return null;
    }
};

/**
 * Return all the exams of the student with the given id
 *
 * @param {string} id
 * @return {Promise<Exams[]>}
 */
exports.getStudentCareer = async (id) => {
    const query = `SELECT cod_course, title_course, cfu, grade, date FROM career WHERE id = ?;`;

    return db.prepare(query).all(id);
};

/**
 * Return the full teacher date associated to the given id
 *
 * @param {string} id
 * @return {Promise<TeacherRow | null>}
 */
exports.getTeacherById = async (id) => {
    const query = `SELECT * FROM teacher WHERE id = ?;`;

    const row = db.prepare(query).get(id);
    if (row) {
        return row;
    } else {
        return null;
    }
};

/**
 * Return the group of the teacher with the given id
 *
 * @param {string} teacherId
 * @returns {Promise<string>}
 */
exports.getGroup = async (teacherId) => {
    const query = `SELECT cod_group FROM teacher WHERE id=? `;

    const res = db.prepare(query).get(teacherId);
    return res.cod_group;
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

'use strict';

/* Data Access Object (DAO) module for accessing users data */

const db = require('./db');

// This function is used to retrieve the degree of a student
exports.getStudentDegree = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM student s, degree d WHERE id = ? AND s.cod_degree = d.cod_degree';
        const row = db.prepare(sql).get(id);
        if(!row){
            resolve(null);
        }
        else{
            let degree = { cod_degree: row.cod_degree, title_degree: row.title_degree };
            resolve(degree);
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
 * @typedef {Object} StudentPartialRow
 *
 * @property {string} id
 * @property {string} surname
 * @property {string} name
 * @property {string} email
 */

/**
 * Return all the exams of the student with the given id
 *
 * @param {string} id
 * @return {Promise<Exams[] | null>}
 */
exports.getStudentCareer = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT cod_course, title_course, cfu, grade, date FROM career WHERE id = ?';
        const rows = db.prepare(sql).all(id);
        if(!rows){
            resolve(null);
        }
        else{
            resolve(rows);
        }
    });
}

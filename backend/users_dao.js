'use strict';

/* Data Access Object (DAO) module for accessing users data */

const db = require('./db');

// This function is used at log-in time to verify username and password.
exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    let sql;
        // Check the first letter of the email
        if (password.charAt(0) === 's') {
            sql = 'SELECT * FROM student WHERE email = ?';
        } else {
            sql = 'SELECT * FROM teacher WHERE email = ?';
        }
        const row = db.prepare(sql).get(email);

        if(!row){
            resolve(false);
        }

        else{
            let user;

            if (password.charAt(0) === 's') {
                user = { id: row.id, surname: row.surname, name: row.name, gender: row.gender, nationality: row.nationality, email: row.email, cod_degree: row.cod_degree, enrollment_year: row.enrollment_year };
            }
            else{
                user = { id: row.id, surname: row.surname, name: row.name, email: row.email , cod_group: row.cod_group, cod_department: row.cod_department };
            }

            // Check the password
            if (password !== row.id.toString()) {
                resolve(false); // wrong password
            } else {
                resolve(user);
            }
        }
  });
};

// This function is used to retrieve user info
exports.getUserInfo = (auth0) => {
    return new Promise((resolve, reject) => {
        const sql_student = 'SELECT s.id, s.name, s.surname, s.email FROM student s, student_auth0 sa WHERE s.id=sa.id AND sa.id_auth0=?';
        const sql_teacher = 'SELECT t.id, t.name, t.surname, t.email FROM teacher t, teacher_auth0 ta WHERE t.id=ta.id AND ta.id_auth0=?';

        try {
            const student_info = db.prepare(sql_student).get(auth0.payload.sub);
            if (student_info) {
                resolve({...student_info, role: "student"});
                return;
            }

            const teacher_info = db.prepare(sql_teacher).get(auth0.payload.sub);
            if (teacher_info) {
                resolve({...teacher_info, role: "teacher"});
                return;
            }

            // Neither student nor teacher found
            resolve(null);
        } catch (error) {
            reject(error);
        }
    });
};

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

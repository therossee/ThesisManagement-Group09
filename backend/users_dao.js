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
}



  
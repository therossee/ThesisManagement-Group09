'use strict'

const db = require('./db');

// create a promise to create a table:
const createTables = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS student(
                studentId TEXT NOT NULL PRIMARY KEY,
                surname TEXT NOT NULL,
                name TEXT NOT NULL,
                gender TEXT NOT NULL,
                nationality TEXT NOT NULL,
                email TEXT NOT NULL,
                cod_degree TEXT NOT NULL,
                enrollment_year TEXT NOT NULL
            )`, (err) => {
                if (err){
                    reject(err);
                } else{
                    resolve();
                }
            });

            db.run(`CREATE TABLE IF NOT EXISTS teacher(
                teacherId TEXT NOT NULL PRIMARY KEY,
                sunrname TEXT NOT NULL,
                name TEXT NOT NULL, 
                email TEXT NOT NULL,
                cod_group TEXT NOT NULL,
                cod_deparment TEXT NOT NULL
            )`, (err) => {
                if (err){
                    reject(err);
                } else{
                    resolve();
                }
            });

            db.run(`CREATE TABLE IF NOT EXISTS degree(
                degreeId TEXT NOT NULL PRIMARY KEY,
                title_degree TEXT NOT NULL
            )`, (err) => {
                if (err){
                    reject(err);
                } else{
                    resolve();
                }
            });

            db.run(`CREATE TABLE IF NOT EXISTS career(
                careerID TEXT NOT NULL PRIMARY KEY,
                cod_course TEXT NOT NULL,
                title_course TEXT NOT NULL,
                cfu INTEGER NOT NULL,
                grade REAL NOT NULL,
                date TEXT NOT NULL
            )`, (err) => {
                if (err){
                    reject(err);
                } else{
                    resolve();
                }
            });
        })
    })
}

// create a promise to empty the tables:
const emptyTables = () => {
    return new Promise((resolve, reject) =>{
        db.serialize(() => {
            //delete from students
            db.run(`DELETE FROM student`, (err) => {
                if(err){
                    reject(err);
                } else{ //delete from teacher
                    db.run(`DELETE FROM teacher`, (err) => {
                        if(err){
                            reject(err);
                        } else{ //delete from degree
                            db.run(`DELETE FROM degree`, (err) => {
                                if(err){
                                    reject(err);
                                } else{ //delete from career
                                    db.run(`DELETE FROM career`, (err) => {
                                        if(err){
                                            reject(err);
                                        } else {
                                            resolve();
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    });
};

// create a promise to insert data into a table:
const insertData = () => {
    db.serialize(() => {
        const myData = ['s318771', 'Husanu', 'Diana', 'Female', 'Romanian', 's318771@studenti.polito.it', 'INGINFSW', 2022];
        const insertMyData = db.prepare(`INSERT INTO student(studentId, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES (?,?,?,?,?,?,?,?)`);
        insertMyData.run('s318771', 'Husanu', 'Diana', 'Female', 'Romanian', 's318771@studenti.polito.it', 'INGINFSW', 2022);
        insertMyData.finalize();
    });
}

(async () => {
    try{
    await createTables();
    console.log("Tables created if they were not present");

    await emptyTables();
    console.log("Tables emptied");

    await insertData();
    console.log('Tables created and data inserted successfully');
        
    db.close();
    } catch(err){
        console.error('Error', err);
    }

})();



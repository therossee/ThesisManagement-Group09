'use strict'

const db = require('./db');
const xlsx = require('xlsx');

// create a promise to create a table:
const createTables = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            
            db.run(`CREATE TABLE IF NOT EXISTS degree(
                cod_degree TEXT PRIMARY KEY,
                title_degree TEXT NOT NULL
            )`, (err) => {
                if (err){
                    reject(err);
                } else{
                    resolve();
                }
            });

            db.run(`CREATE TABLE IF NOT EXISTS student(
                id TEXT PRIMARY KEY,
                surname TEXT NOT NULL,
                name TEXT NOT NULL,
                gender TEXT NOT NULL,
                nationality TEXT NOT NULL,
                email TEXT NOT NULL,
                cod_degree TEXT NOT NULL,
                enrollment_year TEXT NOT NULL,
                FOREIGN KEY(cod_degree) REFERENCES degree(cod_degree)
            )`, (err) => {
                if (err){
                    reject(err);
                } else{
                    resolve();
                }
            });

            db.run(`CREATE TABLE IF NOT EXISTS teacher(
                id TEXT PRIMARY KEY,
                surname TEXT NOT NULL,
                name TEXT NOT NULL, 
                email TEXT NOT NULL,
                cod_group TEXT NOT NULL,
                cod_department TEXT NOT NULL
            )`, (err) => {
                if (err){
                    reject(err);
                } else{
                    resolve();
                }
            });

            db.run(`CREATE TABLE IF NOT EXISTS career(
                id TEXT NOT NULL,
                cod_course TEXT NOT NULL,
                title_course TEXT NOT NULL,
                cfu INTEGER NOT NULL,
                grade REAL NOT NULL,
                date TEXT NOT NULL,
                FOREIGN KEY(id) REFERENCES student(id)
                PRIMARY KEY(id, cod_course)
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

const insertData = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            
            const insertDataDegrees = () => {
                const filePath = 'degrees.xlsx';
                const workbook = xlsx.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
               
                const insertStatement = db.prepare(`INSERT INTO degree(cod_degree, title_degree) VALUES (?, ?)`);
                //iterate through the rows and insert data into the database
                
                const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: null });

                data.forEach((row) => {
                    console.log(row);
                    insertStatement.run(
                        row, (err) => {
                            if (err) {reject(err);}
                        }
                    )
                });
                //finalize the prepared statement
                insertStatement.finalize();                    
            }

            const insertDataStudents = () => {
                const filePath = 'students.xlsx';
                const workbook = xlsx.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
               
                const insertStatement = db.prepare(`INSERT INTO student(id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
                //iterate through the rows and insert data into the database
                
                const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: null });

                data.forEach((row) => {
                    console.log(row);
                    insertStatement.run(
                        row, (err) => {
                            if (err) {reject(err);}
                        }
                    )
                });
                //finalize the prepared statement
                insertStatement.finalize();                    
            }

            const insertDataTeachers = () => {
                const filePath = 'teachers.xlsx';
                const workbook = xlsx.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
               
                const insertStatement = db.prepare(`INSERT INTO teacher(id, surname, name, email, cod_group, cod_department) VALUES (?, ?, ?, ?, ?, ?)`);
                //iterate through the rows and insert data into the database
                
                const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: null });

                data.forEach((row) => {
                    console.log(row);
                    insertStatement.run(
                        row, (err) => {
                            if (err) {reject(err);}
                        }
                    )
                });
                //finalize the prepared statement
                insertStatement.finalize();                    
            }

            const insertDataCareers = () => {
                const filePath = 'careers.xlsx';
                const workbook = xlsx.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
               
                const insertStatement = db.prepare(`INSERT INTO career(id, cod_course, title_course, cfu, grade, date) VALUES (?, ?, ?, ?, ?, ?)`);
                //iterate through the rows and insert data into the database
                
                const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: null });

                data.forEach((row) => {
                    console.log(row);
                    insertStatement.run(
                        row, (err) => {
                            if (err) {reject(err);}
                        }
                    )
                });
                //finalize the prepared statement
                insertStatement.finalize();                    
            }

            insertDataStudents();
            insertDataTeachers();
            insertDataDegrees();
            insertDataCareers();
            resolve();
        })
        

    })


}

const populate_db = async () => {
    try{
        await createTables();
        console.log("Tables created if they were not present");

        await emptyTables();
        console.log("Tables emptied");

        await insertData();
        console.log('Tables created and data inserted successfully');
        
        db.close((err) => {
            if(err){
                console.log("Error", err);
            } else{
                console.log("Db populated");
            }
        })
    } catch(error){
        console.log('error', error);
    }

};

populate_db();



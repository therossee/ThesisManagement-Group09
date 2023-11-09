'use strict'

const db = require('./db');
const xlsx = require('xlsx');

// create a promise to create a table:
const createTables = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS student(
                id TEXT PRIMARY KEY,
                surname TEXT NOT NULL,
                name TEXT NOT NULL,
                gender TEXT NOT NULL,
                nationality TEXT NOT NULL,
                email TEXT NOT NULL,
                cod_degree TEXT NOT NULL,
                enrollment_year TEXT NOT NULL,
                FOREIGN KEY(cod_degree) REFERENCES degree(degreeId)
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

            db.run(`CREATE TABLE IF NOT EXISTS thesisProposal(
                proposal_id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                supervisor_id TEXT NOT NULL, 
                type TEXT NOT NULL,
                description TEXT NOT NULL,
                required_knowledge TEXT NOT NULL,
                notes TEXT NOT NULL,
                expiration TEXT NOT NULL,
                level TEXT NOT NULL,
                cds TEXT NOT NULL,
                FOREIGN KEY(supervisor_id) REFERENCES teacher(id)
            )`, (err) => {
                if (err){
                    reject(err);
                } else{
                    resolve();
                }            
            });
            

            db.run(`CREATE TABLE IF NOT EXISTS coSupervisor(
                proposal_id INTEGER NOT NULL,
                co_supervisor_id TEXT NOT NULL,
                FOREIGN KEY(proposal_id) REFERENCES thesisProposal(proposal_id),
                FOREIGN KEY(co_supervisor_id) REFERENCES teacher(id),
                PRIMARY KEY (proposal_id, co_supervisor_id)
            )`, (err) => {
                if (err){
                    reject(err);
                } else{
                    resolve();
                }            
            });

            db.run(`CREATE TABLE IF NOT EXISTS proposalKeyword(
                proposal_id INTEGER NOT NULL,
                keyword TEXT NOT NULL,
                FOREIGN KEY(proposal_id) REFERENCES thesisProposal(proposal_id),
                PRIMARY KEY (proposal_id, keyword)
            )`, (err) => {
                if (err){
                    reject(err);
                } else{
                    resolve();
                }            
            });

            db.run(`CREATE TABLE IF NOT EXISTS proposalGroup(
                proposal_id INTEGER NOT NULL,
                cod_group TEXT NOT NULL,
                FOREIGN KEY(proposal_id) REFERENCES thesisProposal(proposal_id),
                FOREIGN KEY(cod_group) REFERENCES teacher(cod_group),
                PRIMARY KEY (proposal_id, cod_group)
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
                                            db.run(`DELETE FROM thesisProposal`, (err) => {
                                                if(err){
                                                    reject(err);
                                                } else{ //delete from coSupervisor
                                                    db.run(`DELETE FROM coSupervisor`, (err) => {
                                                        if(err){
                                                            reject(err);
                                                        } else{ //delete from proposalKeyword
                                                            db.run(`DELETE FROM proposalKeyword`, (err) => {
                                                                if(err){
                                                                    reject(err);
                                                                } else{ //delete from proposalGroup
                                                                    db.run(`DELETE FROM proposalGroup`, (err) => {
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

            const insertDataThesisProposal = () => {
                const filePath = 'thesisProposal.xlsx';
                const workbook = xlsx.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
               
                const insertStatement = db.prepare(`INSERT INTO thesisProposal(title, supervisor_id, type, description, required_knowledge, notes, expiration, level, cds) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
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

            const insertDataProposalKeyWords = () => {
                const filePath = 'proposalKeyWords.xlsx';
                const workbook = xlsx.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
               
                const insertStatement = db.prepare(`INSERT INTO proposalKeyword(proposal_id, keyword) VALUES (?, ?)`);
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

            const insertDataCoSupervisors = () => {
                const filePath = 'cosupervisors.xlsx';
                const workbook = xlsx.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
               
                const insertStatement = db.prepare(`INSERT INTO coSupervisor(proposal_id, co_supervisor_id) VALUES (?, ?)`);
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

            const insertDataProposalGroups = () => {
                const filePath = 'proposalGroups.xlsx';
                const workbook = xlsx.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
               
                const insertStatement = db.prepare(`INSERT INTO proposalGroup(proposal_id, cod_group) VALUES (?, ?)`);
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
            insertDataThesisProposal();
            insertDataProposalKeyWords();
            insertDataCoSupervisors();
            insertDataProposalGroups();
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



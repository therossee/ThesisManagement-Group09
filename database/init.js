'use strict'

const db = require('./db');
const xlsx = require('xlsx');

// create a promise to create a table:
const createTables = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const queries = [
                `CREATE TABLE IF NOT EXISTS student (
                    id TEXT PRIMARY KEY,
                    surname TEXT NOT NULL,
                    name TEXT NOT NULL,
                    gender TEXT NOT NULL,
                    nationality TEXT NOT NULL,
                    email TEXT NOT NULL,
                    cod_degree TEXT NOT NULL,
                    enrollment_year TEXT NOT NULL,
                    FOREIGN KEY(cod_degree) REFERENCES degree(cod_degree)
                );`,
                `CREATE TABLE IF NOT EXISTS teacher (
                    id TEXT PRIMARY KEY,
                    surname TEXT NOT NULL,
                    name TEXT NOT NULL, 
                    email TEXT NOT NULL,
                    cod_group TEXT NOT NULL,
                    cod_department TEXT NOT NULL
                );`,
                `CREATE TABLE IF NOT EXISTS externalCoSupervisor (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    surname TEXT NOT NULL,
                    name TEXT NOT NULL, 
                    email TEXT NOT NULL
                );`,
                `CREATE TABLE IF NOT EXISTS degree (
                    cod_degree TEXT PRIMARY KEY,
                    title_degree TEXT NOT NULL UNIQUE
                );`,
                `CREATE TABLE IF NOT EXISTS career(
                    id TEXT NOT NULL,
                    cod_course TEXT NOT NULL,
                    title_course TEXT NOT NULL,
                    cfu INTEGER NOT NULL,
                    grade REAL NOT NULL,
                    date TEXT NOT NULL,
                    FOREIGN KEY(id) REFERENCES student(id)
                    PRIMARY KEY(id, cod_course)
                )`,
                `CREATE TABLE IF NOT EXISTS thesisProposal (
                    proposal_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    supervisor_id TEXT NOT NULL,
                    type TEXT NOT NULL,
                    description TEXT NOT NULL,
                    required_knowledge TEXT,
                    notes TEXT,
                    expiration TEXT NOT NULL,
                    level TEXT NOT NULL,
                    cds TEXT NOT NULL,
                    FOREIGN KEY(supervisor_id) REFERENCES teacher(id),
                    FOREIGN KEY(cds) REFERENCES degree(cod_degree)
                );`,
                `CREATE TABLE IF NOT EXISTS thesisInternalCoSupervisor (
                    proposal_id INTEGER NOT NULL,
                    co_supervisor_id TEXT NOT NULL,
                    FOREIGN KEY(proposal_id) REFERENCES thesisProposal(proposal_id),
                    FOREIGN KEY(co_supervisor_id) REFERENCES teacher(id),
                    PRIMARY KEY (proposal_id, co_supervisor_id)
                );`,
                `CREATE TABLE IF NOT EXISTS thesisExternalCoSupervisor (
                    proposal_id INTEGER NOT NULL,
                    co_supervisor_id TEXT NOT NULL,
                    FOREIGN KEY(proposal_id) REFERENCES thesisProposal(proposal_id),
                    FOREIGN KEY(co_supervisor_id) REFERENCES externalCoSupervisor(id),
                    PRIMARY KEY (proposal_id, co_supervisor_id)
                );`,
                `CREATE TABLE IF NOT EXISTS proposalKeyword (
                    proposal_id INTEGER NOT NULL,
                    keyword TEXT NOT NULL,
                    FOREIGN KEY(proposal_id) REFERENCES thesisProposal(proposal_id),
                    PRIMARY KEY (proposal_id, keyword)
                );`,
                `CREATE TABLE IF NOT EXISTS proposalGroup (
                    proposal_id INTEGER NOT NULL,
                    cod_group TEXT NOT NULL,
                    FOREIGN KEY(proposal_id) REFERENCES thesisProposal(proposal_id),
                    PRIMARY KEY (proposal_id, cod_group)
                );`,
                `CREATE TABLE IF NOT EXISTS thesisApplication (
                    proposal_id INTEGER NOT NULL,
                    student_id TEXT NOT NULL,
                    status TEXT DEFAULT 'waiting for approval' NOT NULL,
                    FOREIGN KEY(proposal_id) REFERENCES thesisProposal(proposal_id),
                    FOREIGN KEY(student_id) REFERENCES student(id),
                    PRIMARY KEY (proposal_id, student_id)
                );`,
            ];

            let completedQueries = 0;

            queries.forEach((query) => {
                db.run(query, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        completedQueries += 1;

                        if (completedQueries === queries.length) {
                            // Resolve the promise only when all queries are completed
                            resolve();
                        }
                    }
                });
            });
        });
    });
};


// create a promise to empty the tables:
const emptyTables = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const tableNames = ['student', 'teacher', 'externalCoSupervisor', 'degree', 'career', 'thesisProposal', 'thesisInternalCoSupervisor', 'thesisExternalCoSupervisor', 'proposalKeyword', 'proposalGroup', 'thesisApplication'];

            const deleteTable = (tableName) => {
                return new Promise((resolve, reject) => {
                    db.run(`DELETE FROM ${tableName}`, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            };

            const deleteTablePromises = tableNames.map((tableName) => {
                return deleteTable(tableName);
            });

            Promise.all(deleteTablePromises)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    });
};



const insertData = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const insertDataGeneric = (filePath, tableName, insertStatement) => {
                const workbook = xlsx.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
               
                const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: null });

                data.forEach((row) => {
                    console.log(row);
                    insertStatement.run(row, (err) => {
                        if (err) {
                            console.error(err);
                        }
                    });
                });

                insertStatement.finalize();
            };

            insertDataGeneric('students.xlsx', 'student', db.prepare(`INSERT INTO student(id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`));
            insertDataGeneric('teachers.xlsx', 'teacher', db.prepare(`INSERT INTO teacher(id, surname, name, email, cod_group, cod_department) VALUES (?, ?, ?, ?, ?, ?)`));
            insertDataGeneric('external-co-supervisors.xlsx', 'externalCoSupervisor', db.prepare(`INSERT INTO externalCoSupervisor(surname, name, email) VALUES (?, ?, ?)`));
            insertDataGeneric('degrees.xlsx', 'degree', db.prepare(`INSERT INTO degree(cod_degree, title_degree) VALUES (?, ?)`));
            insertDataGeneric('careers.xlsx', 'career', db.prepare(`INSERT INTO career(id, cod_course, title_course, cfu, grade, date) VALUES (?, ?, ?, ?, ?, ?)`));
            insertDataGeneric('thesisProposal.xlsx', 'thesisProposal', db.prepare(`INSERT INTO thesisProposal(title, supervisor_id, type, description, required_knowledge, notes, expiration, level, cds) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`));
            insertDataGeneric('proposalKeyWords.xlsx', 'proposalKeyword', db.prepare(`INSERT INTO proposalKeyword(proposal_id, keyword) VALUES (?, ?)`));
            insertDataGeneric('thesis-internal-co-supervisors.xlsx', 'thesisInternalCoSupervisor', db.prepare(`INSERT INTO thesisInternalCoSupervisor(proposal_id, co_supervisor_id) VALUES (?, ?)`));
            insertDataGeneric('thesis-external-co-supervisors.xlsx', 'thesisExternalCoSupervisor', db.prepare(`INSERT INTO thesisExternalCoSupervisor(proposal_id, co_supervisor_id) VALUES (?, ?)`));
            insertDataGeneric('proposalGroups.xlsx', 'proposalGroup', db.prepare(`INSERT INTO proposalGroup(proposal_id, cod_group) VALUES (?, ?)`));
            insertDataGeneric('thesis_applications.xlsx', 'thesisApplication', db.prepare(`INSERT INTO thesisApplication(proposal_id, student_id) VALUES (?, ?)`));

            // Resolve after all data insertions are completed
            resolve();
        });
    });
};


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




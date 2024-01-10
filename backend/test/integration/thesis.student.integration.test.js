require('jest');
// [i] This line setup the test database + load the environment variables. DON'T (RE)MOVE IT
const { resetTestDatabase, initImapClient, closeImapClient, searchEmails} = require('../integration_config');

const request = require("supertest");
const {app} = require("../../src/app");
const utils = require("../utils");
const thesisDao = require('../../src/dao/thesis_dao');
const usersDao = require('../../src/dao/users_dao');
const db = require('../../src/services/db');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const formidable = require('formidable');
const AdvancedDate = require('../../src/models/AdvancedDate');
const CronTasksService = require("../../src/services/CronTasksService");

beforeEach(() => {
    // Be sure that we are using a full clean database before each test
    resetTestDatabase();
    jest.restoreAllMocks();
    jest.clearAllMocks();
});

let agent;
beforeAll(async () => {
    await initImapClient();
    agent = await utils.getMolinattoSylvieAgent(app);
});

afterAll(async () => {
    await closeImapClient();
    resetTestDatabase();
    CronTasksService.stop();
});

describe('GET /api/thesis-proposals (student)', () => {
    test('should return the list of thesis proposals of a student', async () => {
        // Signed as a student in L-08 degree
        const response = await agent
            .get('/api/thesis-proposals')
            .set('Accept', 'application/json')
            .set('credentials', 'include')
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            $metadata: {
                index: 0,
                count: 2,
                total: 2,
                currentPage: 1
            },
            items: [
                {
                    id: 1,
                    title: "AI-GUIDED WEB CRAWLER FOR AUTOMATIC DETECTION OF MALICIOUS SITES",
                    status: 'ACTIVE',
                    supervisor: {
                        id: 'd279620',
                        name: 'Marco',
                        surname: 'Rossi',
                        email: 'd279620@polito.it',
                        codGroup: 'Group1',
                        codDepartment: 'Dep1',
                    },
                    coSupervisors: {
                        internal: [],
                        external: [
                            {
                                id: 1,
                                name: 'Alice',
                                surname: 'Amato',
                                email: 'alice.amato@email.com',
                                co_supervisor_id: "1",
                                proposal_id: 1
                            }
                        ]
                    },
                    type: 'research project',
                    description: 'This thesis focuses on developing an AI-guided web crawler for the automatic detection of malicious sites. The research aims to leverage artificial intelligence to enhance the efficiency and accuracy of web crawling in identifying and cataloging potentially harmful websites.',
                    requiredKnowledge: 'web development, cybersecurity, and machine learning',
                    notes: 'The project involves implementing machine learning algorithms for pattern recognition, collaborating with cybersecurity experts, and optimizing web crawling algorithms for real-time detection',
                    creation_date: '2023-10-10T10:45:50.121Z',
                    expiration: '2024-11-10T23:59:59.999Z',
                    level: 'LM',
                    cds: {
                        cod_degree: 'L-08',
                        title_degree: 'Ingegneria Elettronica'
                    },
                    keywords: ['AI', 'research', 'web development'],
                    groups: ['Group1']
                },
                {
                    id: 2,
                    title: 'PERFORMANCE EVALUATION OF KAFKA CLIENTS USING A REACTIVE API',
                    status: 'ACTIVE',
                    supervisor: {
                        id: 'd279620',
                        name: 'Marco',
                        surname: 'Rossi',
                        email: 'd279620@polito.it',
                        codGroup: 'Group1',
                        codDepartment: 'Dep1',
                    },
                    coSupervisors: {
                        internal: [],
                        external: [
                            {
                                id: 2,
                                name: 'Benjamin',
                                surname: 'Bianchi',
                                email: 'benjamin.bianchi@email.com',
                                co_supervisor_id: "2",
                                proposal_id: 2,
                            }
                        ]
                    },
                    type: 'research project',
                    description: 'This thesis focuses on the performance evaluation of Kafka clients using a reactive API. The research aims to assess and enhance the efficiency of Kafka clients by implementing a reactive programming approach. The study explores how a reactive API can improve responsiveness and scalability in real-time data streaming applications.',
                    requiredKnowledge: 'networking protocols, congestion control algorithms, and familiarity with QUIC',
                    notes: 'The study involves simulations, performance evaluations, and an in-depth analysis of the effectiveness of different congestion control schemes in QUIC',
                    creation_date: '2023-08-22T13:43:56.236Z',
                    expiration: '2025-12-24T23:59:59.999Z',
                    level: 'LM',
                    cds: {
                        cod_degree: 'L-08',
                        title_degree: 'Ingegneria Elettronica'
                    },
                    keywords: ['AI', 'reactive API'],
                    groups: ['Group1']
                }
            ]
        });
    });
    test('should return error 401 if not logged in', async () => {
        const response = await request(app)
            .get('/api/thesis-proposals')
            .set('Accept', 'application/json')
            .send();

        expect(response.status).toBe(401);
    });
});

describe('GET /api/thesis-proposals/:id (student)', () => {
    test('should return the thesis proposal', async () => {
        // Signed as a student in L-08 degree

        const response = await agent
            .get('/api/thesis-proposals/1')
            .set('Accept', 'application/json')
            .set('credentials', 'include')
            .send();

        expect(response.body).toEqual({
            id: 1,
            title: "AI-GUIDED WEB CRAWLER FOR AUTOMATIC DETECTION OF MALICIOUS SITES",
            status: 'ACTIVE',
            supervisor: {
                id: 'd279620',
                name: 'Marco',
                surname: 'Rossi',
                email: 'd279620@polito.it',
                codGroup: 'Group1',
                codDepartment: 'Dep1',
            },
            coSupervisors: {
                internal: [],
                external: [
                    {
                        id: 1,
                        name: 'Alice',
                        surname: 'Amato',
                        email: 'alice.amato@email.com',
                        co_supervisor_id: "1",
                        proposal_id: 1
                    }
                ]
            },
            type: 'research project',
            description: 'This thesis focuses on developing an AI-guided web crawler for the automatic detection of malicious sites. The research aims to leverage artificial intelligence to enhance the efficiency and accuracy of web crawling in identifying and cataloging potentially harmful websites.',
            requiredKnowledge: 'web development, cybersecurity, and machine learning',
            notes: 'The project involves implementing machine learning algorithms for pattern recognition, collaborating with cybersecurity experts, and optimizing web crawling algorithms for real-time detection',
            creation_date: '2023-10-10T10:45:50.121Z',
            expiration: '2024-11-10T23:59:59.999Z',
            level: 'LM',
            cds: {cod_degree: 'L-08', title_degree: 'Ingegneria Elettronica'},
            keywords: ['AI', 'research', 'web development'],
            groups: ['Group1']
        });
    });
    test('should return error 404 if no thesis match the ID', async () => {
        // Signed as a student in L-08 degree

        const response = await agent
            .get('/api/thesis-proposals/3')
            .set('Accept', 'application/json')
            .set('credentials', 'include')
            .send();

        expect(response.status).toBe(404);
    });
    test('should return error 401 if not logged in', async () => {
        const response = await request(app)
            .get('/api/thesis-proposals/1')
            .set('Accept', 'application/json')
            .send();

        expect(response.status).toBe(401);
    });
    test('should return error 500 if dao throws an error', async () => {
        jest.spyOn(thesisDao, 'getThesisProposal').mockRejectedValueOnce(new Error());

        const response = await agent
            .get('/api/thesis-proposals/1')
            .set('Accept', 'application/json')
            .set('credentials', 'include')
            .send();

        // Expecting a 500 status code
        expect(response.status).toBe(500);
    });
});

describe('POST /api/student/applications', () => {

    const uploadDir = path.join(__dirname, 'temp-uploads');

    beforeAll(() => {
        fse.ensureDirSync(uploadDir);
    });

    afterAll(async () => {
        fse.removeSync(uploadDir);
        await fse.remove('uploads');
    });

    test('should create a new application for a valid request and notify teacher', async () => {
        // Create a sample file to be uploaded
        const filePath = path.join(uploadDir, 'sample.pdf');
        fs.writeFileSync(filePath, 'This is a sample file.');

        const thesis_proposal_id = '2';

        const form = new formidable.IncomingForm();

        // Simulate file upload by adding a 'file' field to the form
        form.on('file', (field, file) => {
            form.files[field] = file;
        });

        // Simulate the fields in the form
        form.fields = {
            thesis_proposal_id: '2',
        };

        const response = await agent
            .post('/api/student/applications')
            .set('credentials', 'include')
            .field('thesis_proposal_id', thesis_proposal_id)
            .attach('file', filePath)
            .expect(201);

        expect(response.body).toEqual({
            application_id: expect.any(Number),
            thesis_proposal_id: '2',
            student_id: 's318952',
            status: 'waiting for approval',
        });

        // Wait for a moment to allow the email to be processed (adjust the timing as needed)
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const subject = 'New Application - PERFORMANCE EVALUATION OF KAFKA CLIENTS USING A REACTIVE API';
        const to = 'd279620@polito.it';
        // Search for the email (adjust criteria as needed)
        const searchResults = await searchEmails(to, subject);

        // Assert that the email has been received
        expect(searchResults.length).toBeGreaterThan(0);

    },10000);

    test('should return 401 status error for if a not logged user try to apply to a thesis proposal', async () => {
        const response = await request(app)
            .post('/api/student/applications')
            .send({thesis_proposal_id: 2});

        expect(response.status).toBe(401);
    });

    test('should reject if the student apply for a proposal of another course of study', async () => {

        const thesis_proposal_id = '3';

        const form = new formidable.IncomingForm();

        // Simulate the fields in the form
        form.fields = {
            thesis_proposal_id: '3',
        };

        const response = await agent
            .post('/api/student/applications')
            .set('credentials', 'include')
            .field('thesis_proposal_id', thesis_proposal_id);

        expect(response.status).toBe(403);
        expect(response.body).toEqual({ message: "The proposal doesn't belong to the student degree" });
    });

    test('should reject if the student apply for an archived proposal', async () => {

        db.prepare('INSERT INTO thesisProposal (proposal_id, title, supervisor_id, type, description, required_knowledge, notes, creation_date, expiration, level)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
            .run(4, 'Title', 'd279620', 'research project', 'Description', 'Required knowledge', 'Notes', '2020-10-10T10:45:50.121Z', '2022-11-10T23:59:59.999Z', 'LM');

        db.prepare('INSERT INTO proposalCds (proposal_id, cod_degree) VALUES (?, ?)')
            .run(4, 'L-08');

        const thesis_proposal_id = '4';

        const form = new formidable.IncomingForm();

        // Simulate the fields in the form
        form.fields = {
            thesis_proposal_id: '4',
        };

        const response = await agent
            .post('/api/student/applications')
            .set('credentials', 'include')
            .field('thesis_proposal_id', thesis_proposal_id);

        expect(response.status).toBe(403);
        expect(response.body).toEqual({ message: "The proposal is not active" });

    });

    test('should reject if the student has already applied for another proposal', async () => {

        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s318952', 2, new AdvancedDate().toISOString(), 'waiting for approval');


        const thesis_proposal_id = '2';

        const form = new formidable.IncomingForm();

        // Simulate the fields in the form
        form.fields = {
            thesis_proposal_id: '2',
        };

        const response = await agent
            .post('/api/student/applications')
            .set('credentials', 'include')
            .field('thesis_proposal_id', thesis_proposal_id);

        expect(response.status).toBe(403);
        expect(response.body).toEqual({ message: "The user has already applied for other proposals" });

    });

    test('should handle file writing error', async () => {
        // Create a sample file to be uploaded
        const filePath = path.join(uploadDir, 'sample.pdf');
        fs.writeFileSync(filePath, 'This is a sample file.');

        const thesis_proposal_id = '2';

        const form = new formidable.IncomingForm();

        // Simulate file upload by adding a 'file' field to the form
        form.on('file', (field, file) => {
            form.files[field] = file;
        });

        // Simulate the fields in the form
        form.fields = {
            thesis_proposal_id: '2',
        };

        // Mock the fs.mkdirSync method to throw an error when called
        jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {
            throw new Error('Simulated mkdirSync error');
        });

        const response = await agent
            .post('/api/student/applications')
            .set('credentials', 'include')
            .field('thesis_proposal_id', thesis_proposal_id)
            .attach('file', filePath);

        expect(response.status).toBe(500);
        expect(response.body).toEqual("Internal Server Error");
    });

    test('should handle error while inserting application', async () => {
        // Create a sample file to be uploaded
        const filePath = path.join(uploadDir, 'sample.pdf');
        fs.writeFileSync(filePath, 'This is a sample file.');

        const thesis_proposal_id = '2';

        const form = new formidable.IncomingForm();

        // Simulate file upload by adding a 'file' field to the form
        form.on('file', (field, file) => {
            form.files[field] = file;
        });

        // Simulate the fields in the form
        form.fields = {
            thesis_proposal_id: '2',
        };

        // Mock the database operation to throw an error when called
        jest.spyOn(db, 'prepare').mockImplementation(() => {
            throw new Error('Simulated database insertion error');
        });

        const response = await agent
            .post('/api/student/applications')
            .set('credentials', 'include')
            .field('thesis_proposal_id', thesis_proposal_id)
            .attach('file', filePath);

        expect(response.status).toBe(500);
        expect(response.body).toEqual("Internal Server Error");

    });

    test('should handle internal server error during form parsing', async () => {
        // Create a sample file to be uploaded
        const filePath = path.join(uploadDir, 'sample.pdf');
        fs.writeFileSync(filePath, 'This is a sample file.');

        const thesis_proposal_id = '2';

        // Spy on the form.parse method to mock its behavior
        const formParseSpy = jest.spyOn(formidable.IncomingForm.prototype, 'parse');

        // Simulate an error during form parsing
        formParseSpy.mockImplementation((req, callback) => {
            // Call the callback with an error
            callback(new Error('Simulated form parsing error'), {}, {});
        });

        const response = await agent
            .post('/api/student/applications')
            .set('credentials', 'include')
            .field('thesis_proposal_id', thesis_proposal_id)
            .attach('file', filePath);

        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });

    test('should handle generic errors gracefully', async () => {
        // Simulate an error in the application process
        jest.spyOn(thesisDao, 'applyForProposal').mockImplementation(() => {
            throw new Error('Simulated error');
        });

        const response = await agent
            .post('/api/student/applications')
            .set('credentials', 'include')
            .field('thesis_proposal_id', '2');

        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');

    });

    test.skip('should reject a non-PDF file', async () => {
        // Create a sample file to be uploaded
        const filePath = path.join(uploadDir, 'sample.txt');
        fs.writeFileSync(filePath, 'This is a sample file.');

        const thesis_proposal_id = '2';

        const form = new formidable.IncomingForm();

        // Simulate file upload by adding a 'file' field to the form
        form.on('file', (field, file) => {
            form.files[field] = file;
        });

        // Simulate the fields in the form
        form.fields = {
            thesis_proposal_id: '2',
        };

        const response = await agent
            .post('/api/student/applications')
            .set('credentials', 'include')
            .field('thesis_proposal_id', thesis_proposal_id)
            .attach('file', filePath);

        expect(response.status).toBe(500);
        expect(response.body).toEqual('Failed to apply for proposal. The file must be a PDF');
    });
});

describe('GET /api/student/active-application', () => {
    test('should return empty list of applications', async () => {
        // Perform the request
        const response = await agent
            .get('/api/student/active-application')
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('should return student active application in an array (one element)', async () => {
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s318952', 2, new AdvancedDate().toISOString(), 'waiting for approval');

        // Logged in as s318952

        // Perform the request
        const response = await agent
            .get('/api/student/active-application')
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{proposal_id: 2}]);
    });

    test('should return 500 if an error occurs', async () => {
        jest.spyOn(thesisDao, 'getStudentActiveApplication').mockRejectedValueOnce(new Error());

        // Perform the request
        const response = await agent
            .get('/api/student/active-application')
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(500);
    });
});

describe('GET /api/student/applications-decision', () => {
    test('should return a list of applications for the student', async () => {
        // Logged as s318952

        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s318952', 1, new AdvancedDate().toISOString(), 'rejected');
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s318952', 2, new AdvancedDate().toISOString(), 'rejected');
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s318952', 2, new AdvancedDate().toISOString(), 'waiting for approval');

        // Make the request to your API
        const response = await agent
            .get('/api/student/applications-decision')
            .set('Accept', 'application/json')
            .set('credentials', 'include')
            .send();

        // Assert the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                application_id: expect.any(Number),
                proposal_id: 1,
                title: 'AI-GUIDED WEB CRAWLER FOR AUTOMATIC DETECTION OF MALICIOUS SITES',
                level: 'LM',
                teacher_name: 'Marco',
                teacher_surname: 'Rossi',
                status: 'rejected',
                expiration: "2024-11-10T23:59:59.999Z"
            },
            {
                application_id: expect.any(Number),
                proposal_id: 2,
                title: 'PERFORMANCE EVALUATION OF KAFKA CLIENTS USING A REACTIVE API',
                level: 'LM',
                teacher_name: 'Marco',
                teacher_surname: 'Rossi',
                status: 'rejected',
                expiration: "2025-12-24T23:59:59.999Z"
            },
            {
                application_id: expect.any(Number),
                proposal_id: 2,
                title: 'PERFORMANCE EVALUATION OF KAFKA CLIENTS USING A REACTIVE API',
                level: 'LM',
                teacher_name: 'Marco',
                teacher_surname: 'Rossi',
                status: 'waiting for approval',
                expiration: "2025-12-24T23:59:59.999Z",
            }
        ]);
    });

    test('should handle errors and return 500 status', async () => {
        jest.spyOn(thesisDao, 'listApplicationsDecisionsFromStudent').mockRejectedValueOnce(new Error());

        // Make the request to your API
        const response = await agent
            .get('/api/student/applications-decision')
            .set('Accept', 'application/json')
            .set('credentials', 'include')
            .send();

        // Assert the response
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});

describe('POST /api/student/thesis-start-requests', () => {
    test('should return 400 with error message for missing required fields', async () => {
        const requestBody = {
          description: 'Description',
          internal_co_supervisors_ids: ['d370335'],
        };
    
        const response = await agent
          .post('/api/student/thesis-start-requests')
          .set('Accept', 'application/json')
          .set('credentials', 'include')
          .send(requestBody);
    
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            errors: [
                { code: "invalid_type", expected: "string", message: "Required", path: ["title"], received: "undefined" },
                { code: "invalid_type", expected: "string", message: "Required", path: ["supervisor_id"], received: "undefined" }
            ],
            message: "Some properties are missing or invalid."
        });
    });

    test('should return 404 with error message for non-existing application', async () => {
  
        const requestBody = {
          application_id: 100,
          proposal_id: 2,
          title: 'Title',
          description: 'Description',
          supervisor_id: 'd279620',
          internal_co_supervisors_ids: ['d370335'],
        };
    
        const response = await agent
          .post('/api/student/thesis-start-requests')
          .set('Accept', 'application/json')
          .set('credentials', 'include')
          .send(requestBody);
    
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          message: 'Application with id 100 not found.',
        });
    });
    
    test('should return 404 with error message for non-existing proposal', async () => {
  
        const requestBody = {
          application_id: 1,
          proposal_id: 100,
          title: 'Title',
          description: 'Description',
          supervisor_id: 'd279620',
          internal_co_supervisors_ids: ['d370335'],
        };
    
        const response = await agent
          .post('/api/student/thesis-start-requests')
          .set('Accept', 'application/json')
          .set('credentials', 'include')
          .send(requestBody);
    
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          message: 'Thesis proposal with id 100 not found.',
        });
    });

    test('should return 400 with error message for archived proposal', async () => {

        const proposal = db.prepare('INSERT INTO thesisProposal (title, supervisor_id, type, description, required_knowledge, notes, creation_date, expiration, level, is_archived)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .run('Title', 'd279620', 'research project', 'Description', 'Required knowledge', 'Notes', '2020-10-10T10:45:50.121Z', '2032-11-10T23:59:59.999Z', 'LM', 1);
        
        db.prepare('INSERT INTO proposalCds (proposal_id, cod_degree) VALUES (?, ?)')
          .run(proposal.lastInsertRowid, 'L-08');

        const application = db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
          .run('s318952', proposal.lastInsertRowid, new AdvancedDate().toISOString(), 'waiting for approval');
       
        const requestBody = {
            application_id: application.lastInsertRowid,
            proposal_id: proposal.lastInsertRowid,
            title: 'Title',
            description: 'Description',
            supervisor_id: 'd279620',
            internal_co_supervisors_ids: [],
        };
    
        const response = await agent
          .post('/api/student/thesis-start-requests')
          .set('Accept', 'application/json')
          .set('credentials', 'include')
          .send(requestBody);
    
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: `Thesis proposal with id ${proposal.lastInsertRowid} is archived.`,
        });
    });

    test('should return 400 with error message for expired proposal', async () => {

        const proposal = db.prepare('INSERT INTO thesisProposal (title, supervisor_id, type, description, required_knowledge, notes, creation_date, expiration, level, is_archived)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .run('Title', 'd279620', 'research project', 'Description', 'Required knowledge', 'Notes', '2020-10-10T10:45:50.121Z', '2022-11-10T23:59:59.999Z', 'LM', 0);
        
        db.prepare('INSERT INTO proposalCds (proposal_id, cod_degree) VALUES (?, ?)')
          .run(proposal.lastInsertRowid, 'L-08');

        const application = db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
          .run('s318952', proposal.lastInsertRowid, new AdvancedDate().toISOString(), 'waiting for approval');
       
        const requestBody = {
            application_id: application.lastInsertRowid,
            proposal_id: proposal.lastInsertRowid,
            title: 'Title',
            description: 'Description',
            supervisor_id: 'd279620',
            internal_co_supervisors_ids: [],
        };
    
        const response = await agent
          .post('/api/student/thesis-start-requests')
          .set('Accept', 'application/json')
          .set('credentials', 'include')
          .send(requestBody);
    
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: `Thesis proposal with id ${proposal.lastInsertRowid} is expired.`,
        });
    });

    test('should return 400 with error message for thesis created in the future', async () => {

        const proposal = db.prepare('INSERT INTO thesisProposal (title, supervisor_id, type, description, required_knowledge, notes, creation_date, expiration, level, is_archived)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .run('Title', 'd279620', 'research project', 'Description', 'Required knowledge', 'Notes', '2030-10-10T10:45:50.121Z', '2032-11-10T23:59:59.999Z', 'LM', 0);
        
        db.prepare('INSERT INTO proposalCds (proposal_id, cod_degree) VALUES (?, ?)')
          .run(proposal.lastInsertRowid, 'L-08');

        const application = db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
          .run('s318952', proposal.lastInsertRowid, new AdvancedDate().toISOString(), 'waiting for approval');
       
        const requestBody = {
            application_id: application.lastInsertRowid,
            proposal_id: proposal.lastInsertRowid,
            title: 'Title',
            description: 'Description',
            supervisor_id: 'd279620',
            internal_co_supervisors_ids: [],
        };
    
        const response = await agent
          .post('/api/student/thesis-start-requests')
          .set('Accept', 'application/json')
          .set('credentials', 'include')
          .send(requestBody);
    
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: `Thesis proposal with id ${proposal.lastInsertRowid} is not yet available.`,
        });
    });

    test('should return 404 with error message for non-existing supervisor', async () => {
    
        const requestBody = {
          title: 'Title',
          description: 'Description',
          supervisor_id: 'nonexistent_id',
          internal_co_supervisors_ids: ['d370335'],
        };
    
        const response = await agent
          .post('/api/student/thesis-start-requests')
          .set('Accept', 'application/json')
          .set('credentials', 'include')
          .send(requestBody);
    
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          message: 'Supervisor with id nonexistent_id not found.',
        });
    });
    
    test('should return 404 with error message for non-existing internal co-supervisor', async () => {
    
      const requestBody = {
        title: 'Title',
        description: 'Description',
        supervisor_id: 'd279620',
        internal_co_supervisors_ids: ['nonexistent_id'],
      };
  
      const response = await agent
        .post('/api/student/thesis-start-requests')
        .set('Accept', 'application/json')
        .set('credentials', 'include')
        .send(requestBody);
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'Internal co-supervisor with id nonexistent_id not found.',
      });
    });

    test('should return 500 with error message if an error occur during the creation of the thesis start request', async () => {

        jest.spyOn(thesisDao, 'createThesisStartRequest').mockRejectedValueOnce(new Error());
        
        const requestBody = {
          title: 'Title',
          description: 'Description',
          supervisor_id: 'd279620',
          internal_co_supervisors_ids: [],
        };
    
        const response = await agent
          .post('/api/student/thesis-start-requests')
          .set('Accept', 'application/json')
          .set('credentials', 'include')
          .send(requestBody);
    
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });

    test('should return 500 with error message if an error occur', async () => {

        jest.spyOn(usersDao, 'getTeacherById').mockRejectedValueOnce(new Error());
        
        const requestBody = {
          title: 'Title',
          description: 'Description',
          supervisor_id: 'd279620',
          internal_co_supervisors_ids: [],
        };
    
        const response = await agent
          .post('/api/student/thesis-start-requests')
          .set('Accept', 'application/json')
          .set('credentials', 'include')
          .send(requestBody);
    
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });

    test('should return 403 if the user has other active thesis start requests', async () => {
        const proposal = db.prepare('INSERT INTO thesisProposal (title, supervisor_id, type, description, required_knowledge, notes, creation_date, expiration, level, is_archived)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .run('Title', 'd279620', 'research project', 'Description', 'Required knowledge', 'Notes', '2020-10-10T10:45:50.121Z', '2032-11-10T23:59:59.999Z', 'LM', 0);
      
        db.prepare('INSERT INTO proposalCds (proposal_id, cod_degree) VALUES (?, ?)')
          .run(proposal.lastInsertRowid, 'L-08');
  
        const application = db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
        .run('s318952', proposal.lastInsertRowid, new AdvancedDate().toISOString(), 'waiting for approval');
   
        db.prepare('INSERT INTO thesisStartRequest (student_id, application_id, proposal_id, title, description, supervisor_id, creation_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
          .run('s318952', application.lastInsertRowid, proposal.lastInsertRowid, 'Title', 'Description', 'd279620', new AdvancedDate().toISOString(),'waiting for approval');
  
          const requestBody = {
              application_id: 2,
              proposal_id: 2,
              title: 'PERFORMANCE EVALUATION OF KAFKA CLIENTS USING A REACTIVE API',
              description: 'This thesis focuses on the performance evaluation of Kafka clients using a reactive API. The research aims to assess and enhance the efficiency of Kafka clients by implementing a reactive programming approach. The study explores how a reactive API can improve responsiveness and scalability in real-time data streaming applications.',
              supervisor_id: 'd279620',
              internal_co_supervisors_ids: [],
          };
  
          const response = await agent
              .post('/api/student/thesis-start-requests')
              .set('Accept', 'application/json')
              .set('credentials', 'include')
              .send(requestBody);
  
          expect(response.status).toBe(403);
          expect(response.body).toEqual({message: 'The student has already a thesis start request'});
  
    });

    test('should return 403 if the proposal doesn\'t belong to the degree of the student', async () => {
  
          const requestBody = {
              proposal_id: 3,
              title: 'PERFORMANCE EVALUATION OF KAFKA CLIENTS USING A REACTIVE API',
              description: 'This thesis focuses on the performance evaluation of Kafka clients using a reactive API. The research aims to assess and enhance the efficiency of Kafka clients by implementing a reactive programming approach. The study explores how a reactive API can improve responsiveness and scalability in real-time data streaming applications.',
              supervisor_id: 'd279620',
              internal_co_supervisors_ids: [],
          };
  
          const response = await agent
              .post('/api/student/thesis-start-requests')
              .set('Accept', 'application/json')
              .set('credentials', 'include')
              .send(requestBody);
  
          expect(response.status).toBe(403);
          expect(response.body).toEqual({message: 'The proposal doesn\'t belong to the student degree'});
  
    });

    test('should create a new thesis start request not related to an application', async () => {
      const requestBody = {
          title: 'Title',
          description: 'Description',
          supervisor_id: 'd279620',
          internal_co_supervisors_ids: ['d370335'],
      };

      const response = await agent
          .post('/api/student/thesis-start-requests')
          .set('Accept', 'application/json')
          .set('credentials', 'include')
          .send(requestBody);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
          {
              thesis_start_request_id: 2,
              student_id: 's318952',
              title: 'Title',
              description: 'Description',
              supervisor_id: 'd279620',
              internal_co_supervisors_ids: ['d370335'],
              status: 'waiting for approval'
          }
      );

    });

    test('should create a new thesis start request related to an application', async () => {
        
        db.prepare('INSERT INTO thesisApplication (proposal_id, student_id, creation_date, status) VALUES (?, ?, ?, ?)')
           .run( 2, 's318952', new AdvancedDate().toISOString(), 'waiting for approval');
        
        const requestBody = {
            application_id: 2,
            proposal_id: 2,
            title: 'PERFORMANCE EVALUATION OF KAFKA CLIENTS USING A REACTIVE API',
            description: 'This thesis focuses on the performance evaluation of Kafka clients using a reactive API. The research aims to assess and enhance the efficiency of Kafka clients by implementing a reactive programming approach. The study explores how a reactive API can improve responsiveness and scalability in real-time data streaming applications.',
            supervisor_id: 'd279620',
            internal_co_supervisors_ids: [],
        };

        const response = await agent
            .post('/api/student/thesis-start-requests')
            .set('Accept', 'application/json')
            .set('credentials', 'include')
            .send(requestBody);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(
            {
                thesis_start_request_id: 2,
                student_id: 's318952',
                application_id: 2,
                proposal_id: 2,
                title: 'PERFORMANCE EVALUATION OF KAFKA CLIENTS USING A REACTIVE API',
                description: 'This thesis focuses on the performance evaluation of Kafka clients using a reactive API. The research aims to assess and enhance the efficiency of Kafka clients by implementing a reactive programming approach. The study explores how a reactive API can improve responsiveness and scalability in real-time data streaming applications.',
                supervisor_id: 'd279620',
                internal_co_supervisors_ids: [],
                status: 'waiting for approval'
            }
        );

    });

});

describe('GET /api/student/thesis-start-requests/active', () => {
    test('should return no thesis start requests for the student', async () => {
        // Logged as s318952

        // Make the request to your API
        const response = await agent
            .get('/api/student/thesis-start-requests/active')
            .set('Accept', 'application/json')
            .set('credentials', 'include')
            .send();

        // Assert the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual("");
    });
    test('should return a thesis start requests for the student', async () => {
        // Logged as s318952
        const request = db.prepare('INSERT INTO thesisStartRequest (student_id, application_id, proposal_id, title, description, supervisor_id, creation_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
          .run('s318952', 1, 1, 'Title', 'Description', 'd279620','2024-01-06T18:00:00.058Z','waiting for approval');

        // Make the request to your API
        const response = await agent
            .get('/api/student/thesis-start-requests/active')
            .set('Accept', 'application/json')
            .set('credentials', 'include')
            .send();

        // Assert the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            {
                id: request.lastInsertRowid,
                student_id: 's318952',
                application_id: 1,
                proposal_id: 1,
                title: 'Title',
                description: 'Description',
                supervisor_id: 'd279620',
                creation_date: '2024-01-06T18:00:00.058Z',
                approval_date: null,
                status: 'waiting for approval'
            }
        );
    });
    test('should handle errors', async () => {
        // Logged as s318952
        jest.spyOn(thesisDao, 'getStudentActiveThesisStartRequests').mockRejectedValueOnce(new Error());

        // Make the request to your API
        const response = await agent
            .get('/api/student/thesis-start-requests/active')
            .set('Accept', 'application/json')
            .set('credentials', 'include')
            .send();

        // Assert the response
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});


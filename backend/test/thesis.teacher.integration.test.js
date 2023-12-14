require('jest');
// [i] This line setup the test database + load the environment variables. DON'T (RE)MOVE IT
const { resetTestDatabase } = require('./integration_config');

const request = require("supertest");
const { app } = require("../app");
const thesisDao = require('../thesis_dao');
const usersDao = require('../users_dao');
const db = require('../db');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const imap = require("imap");

// Mock Passport-SAML authenticate method
jest.mock('passport-saml', () => {
    const Strategy = jest.requireActual('passport-saml').Strategy;
    return {
      Strategy: class MockStrategy extends Strategy {
        authenticate(req, options) {
          const user = {
            id: 'd279620',
            name: 'Marco Rossi',
            roles: ['teacher'], 
          };
          this.success(user);
        }
      },
    };
});

beforeEach(() => {
    // Be sure that we are using a full clean database before each test
    resetTestDatabase();
    jest.restoreAllMocks();
});
beforeAll(async () => {
    agent = request.agent(app);
    await agent.get('/login');
});

describe('GET /api/teachers', () => {
    test('returns a list of teachers excluding the logged-in teacher', async () => {
        // Make the authenticated request
        const response = await agent
            .get('/api/teachers')
            .set('Accept', 'application/json')
            .set('credentials', 'include');

        expect(response.status).toBe(200);
        expect(response.body.teachers).toHaveLength(1);
        expect(response.body.teachers[0]).toEqual({
            id: 'd370335',
            surname: 'Bianchi',
            name: 'Luca',
            email: 'd370335@polito.it',
            cod_group: 'Group2',
            cod_department: 'Dep2',
        });
    });

    test('handles internal server error gracefully', async () => {
        jest.spyOn(thesisDao, 'getTeacherListExcept').mockRejectedValueOnce(new Error());

        const response = await agent
            .get('/api/teachers')
            .set('Accept', 'application/json')
            .set('credentials', 'include')
            .expect(500);

        expect(response.status).toBe(500);
        expect(response.body).toEqual("Internal Server Error");
    });
});

describe('GET /api/externalCoSupervisors', () => {
    test('returns the list of external co-supervisors', async () => {
        const response = await agent
            .get('/api/externalCoSupervisors')
            .set('Accept', 'application/json')
            .set('credentials', 'include');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            externalCoSupervisors: [
                { id: 1, surname: 'Amato', name: 'Alice', email: 'alice.amato@email.com' },
                { id: 2, surname: 'Bianchi', name: 'Benjamin', email: 'benjamin.bianchi@email.com' },
                { id: 3, surname: 'Colombo', name: 'Chiara', email: 'chiara.colombo@email.com' }
            ]
        });
    });

    test('handles internal server error gracefully', async () => {
        jest.spyOn(thesisDao, 'getExternalCoSupervisorList').mockRejectedValueOnce(new Error());

        const response = await agent
            .get('/api/externalCoSupervisors')
            .set('Accept', 'application/json')
            .set('credentials', 'include')
            .expect(500);

        expect(response.status).toBe(500);
        expect(response.body).toEqual("Internal Server Error");
    });
});

describe('POST /api/teacher/thesis_proposals', () => {
    test('should create a new thesis proposal', async () => {
        const requestBody = {
            title: 'Test Thesis',
            internal_co_supervisors_id: ['d370335'], // Rossi Marco
            external_co_supervisors_id: [1],
            type: 'Bachelor',
            description: 'Test description',
            required_knowledge: 'Test knowledge',
            notes: 'Test notes',
            expiration: '2030-12-31',
            level: 'Bachelor',
            cds: ['L-08'],
            keywords: ['test', 'keywords'],
        };

        const response = await agent
            .post('/api/teacher/thesis_proposals')
            .set('Accept', 'application/json')
            .set('credentials', 'include')
            .send(requestBody);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            id: expect.any(Number),
            supervisor_id: 'd279620', // Marco Rossi
            title: requestBody.title,
            internal_co_supervisors_id: requestBody.internal_co_supervisors_id,
            external_co_supervisors_id: requestBody.external_co_supervisors_id,
            type: requestBody.type,
            description: requestBody.description,
            required_knowledge: requestBody.required_knowledge,
            notes: requestBody.notes,
            expiration: `${requestBody.expiration}T23:59:59.999Z`,
            level: requestBody.level,
            cds: requestBody.cds,
            groups: ["Group1", "Group2"],
            keywords: requestBody.keywords
        });
    });

    test('should return error 400 if some required field is missing', async () => {
        const requestBody = {
            title: 'Test Thesis',
            internal_co_supervisors_id: ['d370335'],
            external_co_supervisors_id: [1],
            type: 'Bachelor',
            description: 'Test description',
            required_knowledge: 'Test knowledge',
            notes: 'Test notes',
            level: 'Bachelor',
            cds: 'L-08',
            keywords: ['test', 'keywords'],
        };

        const response = await agent
            .post('/api/teacher/thesis_proposals')
            .set('Accept', 'application/json')
            .set('credentials', 'include')
            .send(requestBody);

        expect(response.status).toBe(400);
        expect(response.body).toEqual("Missing required fields.");
    });

    test('should return error 401 if not logged in', async () => {
        const requestBody = {
            title: 'Test Thesis',
            internal_co_supervisors_id: ['d370335'],
            external_co_supervisors_id: [1],
            type: 'Bachelor',
            description: 'Test description',
            required_knowledge: 'Test knowledge',
            notes: 'Test notes',
            expiration: '2030-12-31',
            level: 'Bachelor',
            cds: 'L-08',
            keywords: ['test', 'keywords'],
        };

        const response = await request(app)
            .post('/api/teacher/thesis_proposals')
            .set('Accept', 'application/json')
            .send(requestBody);

        expect(response.status).toBe(401);
    });

    test('should return error 500 if an error is thrown', async () => {
        jest.spyOn(thesisDao, 'getGroup').mockRejectedValueOnce(new Error());

        const requestBody = {
            title: 'Test Thesis',
            internal_co_supervisors_id: ['d370335'],
            external_co_supervisors_id: [1],
            type: 'Bachelor',
            description: 'Test description',
            required_knowledge: 'Test knowledge',
            notes: 'Test notes',
            expiration: '2030-12-31',
            level: 'Bachelor',
            cds: 'L-08',
            keywords: ['test', 'keywords'],
        };

        const response = await agent
          .post('/api/teacher/thesis_proposals')
          .set('Accept', 'application/json')
          .set('credentials', 'include')
          .send(requestBody)
          .expect(500);

        // Expecting a 500 status code
        expect(response.status).toBe(500);
        expect(response.body).toEqual("Internal Server Error");
    });

    test('should return error 500 if an error is thrown by createThesisProposal', async () => {
        jest.spyOn(thesisDao, 'createThesisProposal').mockRejectedValueOnce(new Error());

        const requestBody = {
            title: 'Test Thesis',
            internal_co_supervisors_id: ['d370335'],
            external_co_supervisors_id: [1],
            type: 'Bachelor',
            description: 'Test description',
            required_knowledge: 'Test knowledge',
            notes: 'Test notes',
            expiration: '2030-12-31',
            level: 'Bachelor',
            cds: 'L-08',
            keywords: ['test', 'keywords'],
        };

        const response = await agent
          .post('/api/teacher/thesis_proposals')
          .set('Accept', 'application/json')
          .set('credentials', 'include')
          .send(requestBody)
          .expect(500);

        // Expecting a 500 status code
        expect(response.status).toBe(500);
        expect(response.body).toEqual("Failed to create thesis proposal. Error");
    });
});

describe('GET /api/keywords', () => {
    test('should return an array of keywords', async () => {
        // Send a request to the endpoint
        const response = await agent
            .get('/api/keywords')
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ keywords: ["AI", "web development", "research", "reactive API", "QUIC"] });
    });

    // TODO: Add tests on authentication controls

    test('should handle errors and return 500', async () => {
        jest.spyOn(thesisDao, 'getAllKeywords').mockRejectedValueOnce(new Error());

        // Send a request to the endpoint
        const response = await agent
            .get('/api/keywords')
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});

describe('GET /api/degrees', () => {
    test('should return an array of degrees', async () => {
        // Send a request to the endpoint
        const response = await agent
            .get('/api/degrees')
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { cod_degree: 'L-08', title_degree: 'Ingegneria Elettronica' },
            { cod_degree: 'LM-31', title_degree: 'Ingegneria dell\'Automazione' }
        ]);
    });

    test('should handle errors and return 500', async () => {
        jest.spyOn(thesisDao, 'getDegrees').mockRejectedValueOnce(new Error());

        // Send a request to the endpoint
        const response = await agent
                        .get('/api/degrees')
                        .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});

describe('GET /api/thesis-proposals (teacher)', () => {
    test('should return an array of thesis proposals for a teacher', async () => {
        // Signed in as Marco Rossi

        // Send a request to the endpoint
        const response = await agent
            .get('/api/thesis-proposals')
            .set('credentials', 'include')
            .send();

        // Assertions
        expect(response.status).toBe(200);

        const metadata = response.body['$metadata'];
        expect(metadata).toEqual({
            index: 0,
            count: 2,
            total: 2,
            currentPage: 1
        });
        const items = response.body['items'];
        expect(items).toHaveLength(2);
    });

    test('should handle errors and return 500', async () => {
        jest.spyOn(thesisDao, 'listThesisProposalsTeacher').mockRejectedValueOnce(new Error());

        // Send a request to the endpoint
        const response = await agent
                               .get('/api/thesis-proposals')
                               .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});

describe('GET /api/thesis-proposals/:id (teacher)', () => {
    test('should return the thesis proposal', async () => {
        const response = await agent
            .get('/api/thesis-proposals/1')
            .set('Accept', 'application/json')
            .set('credentials', 'include')
            .send();

        expect(response.status).toBe(200);
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
            cds: [{ cod_degree: 'L-08', title_degree: 'Ingegneria Elettronica'}],
            keywords: ['AI', 'research', 'web development'],
            groups: ['Group1']
        });
    });
    test('should return error 404 if no thesis match the ID', async () => {
        const response = await agent
            .get('/api/thesis-proposals/123')
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
        jest.spyOn(thesisDao, 'getThesisProposalTeacher').mockRejectedValueOnce(new Error());

        const response = await agent
            .get('/api/thesis-proposals/1')
            .set('Accept', 'application/json')
            .set('credentials', 'include')
            .send();

        // Expecting a 500 status code
        expect(response.status).toBe(500);
    });
});

describe('PUT /api/thesis-proposals/:id', () => {
    test('should update a thesis proposal successfully', async () => {
        const responseGet = await agent
            .get('/api/thesis-proposals/1')
            .set('Accept', 'application/json')
            .set('credentials', 'include')
            .send();
        expect(responseGet.status).toBe(200);

        const body = responseGet.body;
        const updatedBody = {
            title: body.title + ' updated',
            type: body.type + ' updated',
            description: body.description + ' updated',
            required_knowledge: body.requiredKnowledge + ' updated',
            notes: body.notes + ' updated',
            expiration: '2025-11-10',
            level: body.level,
            cds: ['L-08'],
            keywords: [...body.keywords, 'another keyword'],
            internal_co_supervisors_id: [],
            external_co_supervisors_id: []
        };
        const response = await agent
            .put(`/api/thesis-proposals/1`)
            .set('credentials', 'include')
            .send(updatedBody);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            title: "AI-GUIDED WEB CRAWLER FOR AUTOMATIC DETECTION OF MALICIOUS SITES updated",
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
                external: []
            },
            type: 'research project updated',
            description: 'This thesis focuses on developing an AI-guided web crawler for the automatic detection of malicious sites. The research aims to leverage artificial intelligence to enhance the efficiency and accuracy of web crawling in identifying and cataloging potentially harmful websites. updated',
            requiredKnowledge: 'web development, cybersecurity, and machine learning updated',
            notes: 'The project involves implementing machine learning algorithms for pattern recognition, collaborating with cybersecurity experts, and optimizing web crawling algorithms for real-time detection updated',
            creation_date: '2023-10-10T10:45:50.121Z',
            expiration: '2025-11-10T23:59:59.999Z',
            level: 'LM',
            cds: [{ cod_degree: 'L-08', title_degree: 'Ingegneria Elettronica'}],
            keywords: ['AI', 'another keyword', 'research', 'web development'],
            groups: ['Group1']
        });
    });

    test('should return 403 error if the proposal has accepted applications', async () => {
        // Make the request to your API
        const response = await agent
            .put(`/api/thesis-proposals/3`)
            .set('credentials', 'include')
            .send({ });

        // Assert the response
        expect(response.status).toBe(403);
        expect(response.body).toEqual({ message: 'Cannot edit a proposal with accepted applications.' });
    });

    test('should return 404 error if the proposal does not exist', async () => {
        const body = {
            title: 'Test Thesis',
            internal_co_supervisors_id: ['d279620'], // Rossi Marco
            external_co_supervisors_id: [],
            type: 'Bachelor',
            description: 'Test description',
            required_knowledge: 'Test knowledge',
            notes: 'Test notes',
            expiration: '2023-12-31',
            level: 'Bachelor',
            cds: ['L-08'],
            keywords: ['test', 'keywords'],
        };

        // Make the request to your API
        const response = await agent
            .put(`/api/thesis-proposals/32`)
            .set('credentials', 'include')
            .send(body);

        // Assert the response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: `Thesis proposal with id 32 not found.` });
    });

    test('should return error 400 if some properties are missing', async () => {
        // Mock Request body
        const mockBody = {
            title: 'TitoloTesi',
            internal_co_supervisors_id: ['d277137'],
            external_co_supervisors_id: [1],
            type: 'compilativa',
            description: 'description',
            required_knowledge: 'required knowledge',
            notes: 'notes',
            level: 'Bachelor',
            keywords: ['keyword'],
            expiration: '2025-11-10T23:59:59.999Z'
        };

        // Make the request to your API
        const response = await agent
            .put(`/api/thesis-proposals/1`)
            .set('credentials', 'include')
            .send(mockBody);

        // Assert the response
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            {
                "errors":
                [
                    {
                        "code": "invalid_type",
                        "expected": "array",
                        "message": "Required",
                        "path": ["cds"],
                        "received": "undefined"
                    }
                ],
                "message": "Some properties are missing or invalid."
            }
        );
    });

    test('should return 500 error', async () => {
        jest.spyOn(thesisDao, 'listApplicationsForTeacherThesisProposal').mockRejectedValueOnce(new Error());

        const body = {
            title: 'TitoloTesi',
            internal_co_supervisors_id: ['d277137'],
            external_co_supervisors_id: [1],
            type: 'compilativa',
            description: 'description',
            required_knowledge: 'required knowledge',
            notes: 'notes',
            level: 'Bachelor',
            cds: ['Group1'],
            keywords: ['keyword'],
            expiration: '2025-11-10T23:59:59.999Z'
        };

        // Make the request to your API
        const response = await agent
            .put(`/api/thesis-proposals/1`)
            .set('credentials', 'include')
            .send(body);

        // Assert the response
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});

describe('GET /api/teacher/applications/:proposal_id', () => {
    test('should return an empty array of applications for a teacher and proposal', async () => {
        // Send a request to the endpoint
        const response = await agent
            .get('/api/teacher/applications/1')
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('should return an array of applications for a teacher and proposal', async () => {
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s321529', 2, new Date().toISOString(), 'waiting for approval');

        // Send a request to the endpoint
        const response = await agent
            .get('/api/teacher/applications/2')
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { application_id: 2, id: 's321529', name: 'Matteo', surname: 'Ladrat', status: 'waiting for approval' }
        ]);
    });
});

describe('PATCH /api/teacher/applications/accept/:proposal_id', () => {
    test('should accept thesis and reject others', async () => {
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s321529', 2, new Date().toISOString(), 'waiting for approval');
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s318952', 2, new Date().toISOString(), 'waiting for approval');

        // Act
        const response = await agent
          .patch("/api/teacher/applications/accept/2")
          .send({ student_id: 's318952' })
          .set('credentials', 'include')
          .expect(200);

        // Assert
        expect(response.body).toEqual({ message: 'Thesis accepted and others rejected successfully' });

        // Wait for a moment to allow the email to be processed (adjust the timing as needed)
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Set up IMAP client
        const imapClient = new imap({
        user: process.env.TM_SMTP_USERNAME, 
        password: process.env.TM_SMTP_PASSWORD,
        host: "imap.ethereal.email", // IMAP server host
        port: 993, // IMAP server port
        tls: true,
        tlsOptions: { rejectUnauthorized: false }, 
        });

        // Connect to the IMAP server
        await new Promise((resolve, reject) => {
        imapClient.once("ready", resolve);
        imapClient.once("error", reject);
        imapClient.connect();
        });

        // Open the Inbox
        const openInbox = await new Promise((resolve, reject) => {
        imapClient.openBox("INBOX", true, (err, box) => {
            if (err) reject(err);
            resolve(box);
        });
        });

        const subject = 'Application status changed - PERFORMANCE EVALUATION OF KAFKA CLIENTS USING A REACTIVE API';
        // Search for the email (adjust criteria as needed)
        const searchResults = await new Promise((resolve, reject) => {
            imapClient.search(['UNSEEN', ['TO', 's318952@studenti.polito.it'], ['SUBJECT', subject]], (err, results) => {
            if (err) reject(err);
            resolve(results);
            });
        });

        // Assert that the email has been received
        expect(searchResults.length).toBeGreaterThan(0);

        // Close the IMAP connection
        imapClient.end();

    },10000);
    test('should return 400 error if is missing student_id', async () => {
        // Act
        const response = await agent
            .patch("/api/teacher/applications/accept/2")
            .set('credentials', 'include');

        // Assert
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Missing required fields.' });
    });
    test('should return 404 error if no application has been found', async () => {
        // Act
        const response = await agent
            .patch("/api/teacher/applications/accept/2")
            .set('credentials', 'include')
            .send({ student_id: 's4' });

        // Assert
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
    });
    test('should handle errors and return status 500', async () => {
        jest.spyOn(thesisDao, 'updateApplicationStatus').mockRejectedValueOnce(new Error());

        // Arrange
        const proposalId = '1';
        const studentId = 's293605';

        // Act
        const response = await agent
          .patch(`/api/teacher/applications/accept/${proposalId}`)
          .set('credentials', 'include')
          .send({ student_id: studentId });

        // Assert
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});

describe('PATCH /api/teacher/applications/reject/:proposal_id', () => {
    test('should reject thesis', async () => {
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s321529', 2, new Date().toISOString(), 'waiting for approval');
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s318952', 2, new Date().toISOString(), 'waiting for approval');

        // Act
        const response = await agent
            .patch("/api/teacher/applications/reject/2")
            .send({ student_id: 's321529' })
            .set('credentials', 'include')
            .expect(200);

        // Assert
        expect(response.body).toEqual({ message: 'Thesis successfully rejected' });

        // Wait for a moment to allow the email to be processed (adjust the timing as needed)
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Set up IMAP client
        const imapClient = new imap({
        user: process.env.TM_SMTP_USERNAME, 
        password: process.env.TM_SMTP_PASSWORD,
        host: "imap.ethereal.email", // IMAP server host
        port: 993, // IMAP server port
        tls: true,
        tlsOptions: { rejectUnauthorized: false }, 
        });

        // Connect to the IMAP server
        await new Promise((resolve, reject) => {
        imapClient.once("ready", resolve);
        imapClient.once("error", reject);
        imapClient.connect();
        });

        // Open the Inbox
        const openInbox = await new Promise((resolve, reject) => {
        imapClient.openBox("INBOX", true, (err, box) => {
            if (err) reject(err);
            resolve(box);
        });
        });

        const subject = 'Application status changed - PERFORMANCE EVALUATION OF KAFKA CLIENTS USING A REACTIVE API';
        // Search for the email (adjust criteria as needed)
        const searchResults = await new Promise((resolve, reject) => {
            imapClient.search(['UNSEEN', ['TO', '321529@studenti.polito.it'], ['SUBJECT', subject]], (err, results) => {
            if (err) reject(err);
            resolve(results);
            });
        });

        // Assert that the email has been received
        expect(searchResults.length).toBeGreaterThan(0);

        // Close the IMAP connection
        imapClient.end()
    },10000);
    test('should return 400 error if is missing student_id', async () => {
        // Act
        const response = await agent
            .patch("/api/teacher/applications/reject/2")
            .set('credentials', 'include');

        // Assert
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Missing required fields.' });
    });
    test('should return 404 error if no application has been found', async () => {
        // Act
        const response = await agent
            .patch("/api/teacher/applications/reject/234567")
            .set('credentials', 'include')
            .send({ student_id: 's321529' });

        // Assert
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
    });
    test('should handle errors and return status 500', async () => {
        jest.spyOn(thesisDao, 'updateApplicationStatus').mockRejectedValueOnce(new Error());

        // Arrange
        const proposalId = '1';
        const studentId = 's293605';

        // Act
        const response = await agent
            .patch(`/api/teacher/applications/reject/${proposalId}`)
            .set('credentials', 'include')
            .send({ student_id: studentId });

        // Assert
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});

describe('GET /api/student/:id/career', () => {
    test('should return the student\'s career', async () => {
        // Act
        const response = await agent
            .get('/api/student/s318952/career')
            .set('credentials', 'include');

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                cod_course: 'COURSE_CODE_1',
                title_course: 'Course Title 1',
                cfu: 5,
                grade: 30,
                date: '2023-01-01'
            },
            {
                cod_course: 'COURSE_CODE_2',
                title_course: 'Course Title 2',
                cfu: 4,
                grade: 25,
                date: '2023-02-01'
            },
            {
                cod_course: 'COURSE_CODE_3',
                title_course: 'Course Title 3',
                cfu: 3,
                grade: 27,
                date: '2023-03-01'
            }
        ]);
    });
    test('should return ampty array if the student don\'t have exams', async () => {
        // Act
        const response = await agent
            .get('/api/student/s320213/career')
            .set('credentials', 'include');

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
    test('should return 404 if the student don\'t exist', async () => {
        // Act
        const response = await agent
            .get('/api/student/s12345/career')
            .set('credentials', 'include');

        // Assert
        expect(response.status).toBe(404);
    });
    test('should return 500 if internal server error happens', async () => {
        
        jest.spyOn(usersDao, 'getStudentById').mockRejectedValueOnce(new Error());
        const response = await agent
            .get('/api/student/s318952/career')
            .set('credentials', 'include');

        // Assert
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});

describe('DELETE /api/thesis-proposals/:id', () => {
    test('should delete a thesis proposal and notify application status change', async () => {
        const id = 1;

        // Make a request to the endpoint
        const response = await agent
            .delete(`/api/thesis-proposals/${id}`)
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(204);
    });
    test('should delete a thesis proposal and cancel pending applications', async () => {
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s318952', 2, new Date().toISOString(), 'waiting for approval');
        
        const id = 1;

        // Make a request to the endpoint
        const response = await agent
            .delete(`/api/thesis-proposals/${id}`)
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(204);

         // Wait for a moment to allow the email to be processed (adjust the timing as needed)
         await new Promise((resolve) => setTimeout(resolve, 5000));

         // Set up IMAP client
         const imapClient = new imap({
         user: process.env.TM_SMTP_USERNAME, 
         password: process.env.TM_SMTP_PASSWORD,
         host: "imap.ethereal.email", // IMAP server host
         port: 993, // IMAP server port
         tls: true,
         tlsOptions: { rejectUnauthorized: false }, 
         });
 
         // Connect to the IMAP server
         await new Promise((resolve, reject) => {
         imapClient.once("ready", resolve);
         imapClient.once("error", reject);
         imapClient.connect();
         });
 
         // Open the Inbox
         const openInbox = await new Promise((resolve, reject) => {
         imapClient.openBox("INBOX", true, (err, box) => {
             if (err) reject(err);
             resolve(box);
         });
         });
 
         const subject = 'Application status changed - PERFORMANCE EVALUATION OF KAFKA CLIENTS USING A REACTIVE API';
         // Search for the email (adjust criteria as needed)
         const searchResults = await new Promise((resolve, reject) => {
             imapClient.search(['UNSEEN', ['TO', 's318952@studenti.polito.it'], ['SUBJECT', subject]], (err, results) => {
             if (err) reject(err);
             resolve(results);
             });
         });
 
         // Assert that the email has been received
         expect(searchResults.length).toBeGreaterThan(0);
 
         // Close the IMAP connection
         imapClient.end();
 
    },10000);
    test('should refuse to delete a thesis proposal with accepted application', async () => {
        const id = 3;

        // Make a request to the endpoint
        const response = await agent
            .delete(`/api/thesis-proposals/${id}`)
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(403);
        expect(response.body).toEqual({ message: 'Some applications has been accepted and, therefore, you can\'t delete this thesis' });
    });
    test('should handle errors and return the appropriate response', async () => {
        const id = 'nonExistingProposalId';

        // Make a request to the endpoint
        const response = await agent
            .delete(`/api/thesis-proposals/${id}`)
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: `No thesis proposal with id ${id} found` });
    });
    test('should handle unexpected errors and return 500 Internal Server Error', async () => {
        jest.spyOn(thesisDao, 'deleteThesisProposalById').mockRejectedValueOnce(new Error());

        // Make a request to the endpoint
        const response = await agent
            .delete('/api/thesis-proposals/unexpectedErrorId')
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal Server Error' });
    });
});

describe('PATCH /api/thesis-proposals/archive/:id', () => {
    test('should archive a thesis proposal', async () => {
        const id = 1;

        // Make a request to the endpoint
        const response = await agent
            .patch(`/api/thesis-proposals/archive/${id}`)
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(204);
    });
    test('should not archive a thesis proposal that has applications approved', async () => {
        const id = 3;

        // Make a request to the endpoint
        const response = await agent
            .patch(`/api/thesis-proposals/archive/${id}`)
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(403);
        expect(response.body).toEqual({ message: 'Some applications has been accepted and, therefore, you can\'t archive this thesis'});
    });
    test('should not archive a inexistent thesis proposal', async () => {
        const id = 4;

        // Make a request to the endpoint
        const response = await agent
            .patch(`/api/thesis-proposals/archive/${id}`)
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'No thesis proposal with id 4 found'});
    });
    test('should not archive a thesis proposal created in the future', async () => {
        
        db.prepare('INSERT INTO thesisProposal (proposal_id, title, supervisor_id, type, description, required_knowledge, notes, creation_date, expiration, level)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .run(4, 'Title', 'd279620', 'research project', 'Description', 'Required knowledge', 'Notes', '2030-10-10T10:45:50.121Z', '2032-11-10T23:59:59.999Z', 'LM');
        db.prepare('INSERT INTO proposalCds (proposal_id, cod_degree) VALUES (?, ?)')
        .run(4, 'L-08');

        const id = 4;

        // Make a request to the endpoint
        const response = await agent
            .patch(`/api/thesis-proposals/archive/${id}`)
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'No thesis proposal with id 4 found'});
    });
    test('should not archive a thesis proposal already expired (and archived)', async () => {
        
        db.prepare('INSERT INTO thesisProposal (proposal_id, title, supervisor_id, type, description, required_knowledge, notes, creation_date, expiration, level)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .run(4, 'Title', 'd279620', 'research project', 'Description', 'Required knowledge', 'Notes', '2020-10-10T10:45:50.121Z', '2022-11-10T23:59:59.999Z', 'LM');
        db.prepare('INSERT INTO proposalCds (proposal_id, cod_degree) VALUES (?, ?)')
        .run(4, 'L-08');

        const id = 4;

        // Make a request to the endpoint
        const response = await agent
            .patch(`/api/thesis-proposals/archive/${id}`)
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(403);
        expect(response.body).toEqual({ message: 'You can\'t archive a thesis already expired'});
    });
    test('should not archive a thesis proposal if you are not the supervisor', async () => {
        
        db.prepare('INSERT INTO thesisProposal (proposal_id, title, supervisor_id, type, description, required_knowledge, notes, creation_date, expiration, level)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .run(4, 'Title', 'd370335', 'research project', 'Description', 'Required knowledge', 'Notes', '2022-10-10T10:45:50.121Z', '2025-11-10T23:59:59.999Z', 'LM');
        db.prepare('INSERT INTO proposalCds (proposal_id, cod_degree) VALUES (?, ?)')
        .run(4, 'L-08');

        const id = 4;

        // Make a request to the endpoint
        const response = await agent
            .patch(`/api/thesis-proposals/archive/${id}`)
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(403);
        expect(response.body).toEqual({ message: 'You are not the supervisor of this thesis'});
    });
    test('should handle errors and return the appropriate response', async () => {
        const id = 'nonExistingProposalId';

        // Make a request to the endpoint
        const response = await agent
            .patch(`/api/thesis-proposals/archive/${id}`)
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: `No thesis proposal with id ${id} found` });
    });
    test('should handle unexpected errors and return 500 Internal Server Error', async () => {
        jest.spyOn(thesisDao, 'archiveThesisProposalById').mockRejectedValueOnce(new Error());

        // Make a request to the endpoint
        const response = await agent
            .patch('/api/thesis-proposals/archive/unexpectedErrorId')
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal Server Error' });
    });
});

describe('GET /api/teacher/uploads/:stud_id/:app_id', () => {
    afterAll(async () => {
        // Use fs-extra's remove method to delete the directory and its contents
        await fse.remove('uploads');
    });
    
    test('returns 404 for non-existing student', async () => {
      const nonExistingStudentId = 10000;
      const nonExistingApplicationId = 10000;
  
      // Make the request
      const response = await agent
        .get(`/api/teacher/uploads/${nonExistingStudentId}/${nonExistingApplicationId}`)
        .set('credentials', 'include')
        .expect(404);
  
      // Assert the response
      expect(response.body).toEqual({message : 'Student with id 10000 not found.'});
    });

    test('returns 404 for non-existing application', async () => {
        const nonExistingStudentId = 's318952';
        const nonExistingApplicationId = 10000;
    
        // Make the request
        const response = await agent
          .get(`/api/teacher/uploads/${nonExistingStudentId}/${nonExistingApplicationId}`)
          .set('credentials', 'include')
          .expect(404);
    
        // Assert the response
        expect(response.body).toEqual({message : 'Application with id 10000 not found.'});
    });

    test('handle unexpected errors and return status 500', async () => {
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
        .run('s318952', 2, new Date().toISOString(), 'waiting for approval');

        const nonExistingStudentId = 's318952';
        const nonExistingApplicationId = 2;

        jest.spyOn(usersDao, 'getStudentById').mockRejectedValueOnce(new Error());
        // Make the request
        const response = await agent
          .get(`/api/teacher/uploads/${nonExistingStudentId}/${nonExistingApplicationId}`)
          .set('credentials', 'include')
          .expect(500);
    
        // Assert the response
        expect(response.body).toEqual('Internal Server Error');
    });

    test('should return an empty JSON object if directory doesn\'t exist', async () => {
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
        .run('s318952', 2, new Date().toISOString(), 'waiting for approval');

        const studentId = 's318952'; 
        const applicationId = 2; 
    
        // Make the request
        const response = await agent
          .get(`/api/teacher/uploads/${studentId}/${applicationId}`)
          .set('credentials', 'include')
          .expect(200);
    
        expect(response.body).toEqual({});
    });

    test('should return an empty JSON object if directory exists but is empty', async () => {
        
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
        .run('s318952', 2, new Date().toISOString(), 'waiting for approval');
        
        const studentId = 's318952';
        const applicationId = 2;
        const dir = path.join(__dirname, '../uploads', studentId, applicationId.toString());
    
        // Create the directory without any files
        fs.mkdirSync(dir, { recursive: true });
    
        const response = await agent
          .get(`/api/teacher/uploads/${studentId}/${applicationId}`)
          .expect(200);
    
        expect(response.body).toEqual({});
    });

    test('should return the first file if directory exists and contains files', async () => {
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
        .run('s318952', 2, new Date().toISOString(), 'waiting for approval');

         // Create a directory with a sample PDF file
        const dir = path.join(__dirname, '../uploads', 's318952', '2');
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'sample.pdf'), Buffer.alloc(0));

        const studentId = 's318952'; 
        const applicationId = 2; 
    
        // Make the request
        const response = await agent
          .get(`/api/teacher/uploads/${studentId}/${applicationId}`)
          .set('credentials', 'include')
          .expect(200);
    
        expect(response.header['content-type']).toEqual('application/pdf');
    });
});

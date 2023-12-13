require('jest');
// [i] This line setup the test database + load the environment variables. DON'T (RE)MOVE IT
const { resetTestDatabase } = require('./integration_config');

const request = require("supertest");
const { app } = require("../app");
const thesisDao = require('../thesis_dao');
const db = require('../db');

// Mock Passport-SAML authenticate method
jest.mock('passport-saml', () => {
    const Strategy = jest.requireActual('passport-saml').Strategy;
    return {
      Strategy: class MockStrategy extends Strategy {
        authenticate(req, options) {
          const user = {
            id: 's318952',
            name: 'Sylvie Molinatto',
            roles: ['student'], 
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
            cds: { cod_degree: 'L-08', title_degree: 'Ingegneria Elettronica'},
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
    test('applies for a thesis proposal and returns 201', async () => {
        
        const body = { thesis_proposal_id: 2 };

        const response = await agent
            .post('/api/student/applications')
            .set('credentials', 'include')
            .send(body);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            thesis_proposal_id: body.thesis_proposal_id,
            student_id: 's318952',
            status: 'waiting for approval',
        });
    });
    test('applies for a thesis proposal not logged', async () => {
        const response = await request(app)
            .post('/api/student/applications')
            .send({ thesis_proposal_id: 2 });

        expect(response.status).toBe(401);
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
            .run('s318952', 2, new Date().toISOString(), 'waiting for approval');

        // Logged in as s318952

        // Perform the request
        const response = await agent
            .get('/api/student/active-application')
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ proposal_id: 2 }]);
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
            .run('s318952', 1, new Date().toISOString(), 'rejected');
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s318952', 2, new Date().toISOString(), 'rejected');
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s318952', 2, new Date().toISOString(), 'waiting for approval');

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
                application_id: 2,
                proposal_id: 1,
                title: 'AI-GUIDED WEB CRAWLER FOR AUTOMATIC DETECTION OF MALICIOUS SITES',
                level: 'LM',
                teacher_name: 'Marco',
                teacher_surname: 'Rossi',
                status: 'rejected',
                expiration: "2024-11-10T23:59:59.999Z"
            },
            {
                application_id: 3,
                proposal_id: 2,
                title: 'PERFORMANCE EVALUATION OF KAFKA CLIENTS USING A REACTIVE API',
                level: 'LM',
                teacher_name: 'Marco',
                teacher_surname: 'Rossi',
                status: 'rejected',
                expiration: "2025-12-24T23:59:59.999Z"
            },
            {
                application_id: 4,
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


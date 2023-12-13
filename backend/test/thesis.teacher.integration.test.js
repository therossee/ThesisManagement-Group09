require('jest');
// [i] This line setup the test database + load the environment variables. DON'T (RE)MOVE IT
const { resetTestDatabase } = require('./integration_config');

const request = require("supertest");
const { app } = require("../app");
const utils = require("./utils");
const thesisDao = require('../thesis_dao');
const db = require('../db');

beforeEach(() => {
    // Be sure that we are using a full clean database before each test
    resetTestDatabase();
    jest.restoreAllMocks();
});
let agent;
beforeAll(async () => {
    agent = await utils.getMarcoRossiAgent(app);
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
            { id: 's321529', name: 'Matteo', surname: 'Ladrat', status: 'waiting for approval' }
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
          .send({ student_id: 's321529' })
          .set('credentials', 'include')
          .expect(200);

        // Assert
        expect(response.body).toEqual({ message: 'Thesis accepted and others rejected successfully' });
    });
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
    });
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
        expect(response.body).toEqual({ message: `No thesis proposal with id ${id} found to delete` });
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

require('jest');
// [i] This line setup the test database + load the environment variables. DON'T (RE)MOVE IT
const { resetTestDatabase } = require('./integration_config');

const request = require("supertest");
const { app } = require("../app");
const thesisDao = require('../thesis_dao');

const teacherAccessToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imt4VHlraUVwT05RRnYxZG4tc2JXVSJ9.eyJpc3MiOiJodHRwczovL3RoZXNpcy1tYW5hZ2VtZW50LTA5LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NTY0ZjgzYTAyMmY2YjIwODNiNmI4YzkiLCJhdWQiOlsiaHR0cHM6Ly90aGVzaXMtbWFuYWdlbWVudC0wOS5ldS5hdXRoMC5jb20vYXBpL3YyLyIsImh0dHBzOi8vdGhlc2lzLW1hbmFnZW1lbnQtMDkuZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTcwMTI4MzE1MywiZXhwIjoxNzAxMzY5NTUzLCJhenAiOiJvNUkxUU5UQUJ3Ylg2ZzF4YzJseG90YTlhWlFFc092QSIsInNjb3BlIjoib3BlbmlkIHJlYWQ6Y3VycmVudF91c2VyIHVwZGF0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEifQ.MWkwMZZMKPyu1Xxzx-YxE9wSzZuYMaNrph04FZEaNyO3AX32Ovjnx5T9Y1-S_xUv2QPWMWsZJuWuycRDZOQRzhRplU9-S4aforzSZPDHMqWzASRqSGfyAfxKc-RX36zd6TPRxLpFcd5IrlkkJ_VxsjbuNXW1Lt1M-X4XKBIWicXWtIBvVPsVyUjZRA00FnmmsX2kjutiWJ21kaIcp1rqlNvcS7RdoBR8q_wxan81SIHObMZLX45hds1nJfnjVyOzw0ZqjUFXSb00P8qiy70Un6a1VcqMtqmpaeagfOheRJ6_z311O5W3mH5vG3C2CbFJPShcPAPgTSSRRUuvEEZVwg";
const studentAccessToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imt4VHlraUVwT05RRnYxZG4tc2JXVSJ9.eyJpc3MiOiJodHRwczovL3RoZXNpcy1tYW5hZ2VtZW50LTA5LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NTYzNWQwMzZkODc3MjliNmIzZmZlODMiLCJhdWQiOlsiaHR0cHM6Ly90aGVzaXMtbWFuYWdlbWVudC0wOS5ldS5hdXRoMC5jb20vYXBpL3YyLyIsImh0dHBzOi8vdGhlc2lzLW1hbmFnZW1lbnQtMDkuZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTcwMTI4OTAyNywiZXhwIjoxNzAxMzc1NDI3LCJhenAiOiJvNUkxUU5UQUJ3Ylg2ZzF4YzJseG90YTlhWlFFc092QSIsInNjb3BlIjoib3BlbmlkIHJlYWQ6Y3VycmVudF91c2VyIHVwZGF0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEifQ.fNl9K0uZHNWOIbiWQ4VINR6HprQbxpGwXn2UNTm7Wuqgh5a7lmBr-cdMmD3D2Im1mXEyB6YS9V6L9BI0YK7Cp7AB9fsUSNb2kmM2KqMgbbEemKfONm8czAj5e34wO-uQEn5J8JEWdrV8pHPnglzNy_AMKkZH_I-EHMxJLmIRJXxPxxfge5yno7r7WQKxvaklq3w5CFv0YDd0thLlHxz5swu2Ag1SE3Md7dmxBrNShGRGuCU882mN87aewzVIH6bfEo02m92lPIj3h272IZH3uW9ow8ZkkY9GIA4DThnF8eZiaUe8caruO06ClDjM6BuiJLCE41nfZSCJQ_nKMzm17g"

beforeEach(() => {
    // Be sure that we are using a full clean database before each test
    resetTestDatabase();

    jest.restoreAllMocks();
});

describe('GET /api/teachers', () => {
    test('returns a list of teachers excluding the logged-in teacher', async () => {
        const response = await request(app)
            .get('/api/teachers')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${teacherAccessToken}`);

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

        const response = await request(app)
            .get('/api/teachers')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${teacherAccessToken}`)
            .expect(500);

        expect(response.status).toBe(500);
        expect(response.body).toEqual("Internal Server Error");
    });
});

describe('GET /api/externalCoSupervisors', () => {
    test('returns the list of external co-supervisors', async () => {
        const response = await request(app)
            .get('/api/externalCoSupervisors')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${teacherAccessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            externalCoSupervisors: [
                { surname: 'Amato', name: 'Alice', email: 'alice.amato@email.com' },
                { surname: 'Bianchi', name: 'Benjamin', email: 'benjamin.bianchi@email.com' },
                { surname: 'Colombo', name: 'Chiara', email: 'chiara.colombo@email.com' }
            ]
        });
    });

    test('handles internal server error gracefully', async () => {
        jest.spyOn(thesisDao, 'getExternalCoSupervisorList').mockRejectedValueOnce(new Error());

        const response = await request(app)
            .get('/api/externalCoSupervisors')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${teacherAccessToken}`)
            .expect(500);

        expect(response.status).toBe(500);
        expect(response.body).toEqual("Internal Server Error");
    });
});

describe('POST /api/teacher/thesis_proposals', () => {
    test('should create a new thesis proposal', async () => {
        const requestBody = {
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

        const response = await request(app)
            .post('/api/teacher/thesis_proposals')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${teacherAccessToken}`)
            .send(requestBody);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            id: expect.any(Number),
            supervisor_id: 'd370335', // Luca Bianchi
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
            internal_co_supervisors_id: ['d2'],
            external_co_supervisors_id: ['1'],
            type: 'Bachelor',
            description: 'Test description',
            required_knowledge: 'Test knowledge',
            notes: 'Test notes',
            level: 'Bachelor',
            cds: 'Test CDS',
            keywords: ['test', 'keywords'],
        };

        const response = await request(app)
            .post('/api/teacher/thesis_proposals')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${teacherAccessToken}`)
            .send(requestBody);

        expect(response.status).toBe(400);
        expect(response.body).toEqual("Missing required fields.");
    });

    test('should return error 403 if not authorized', async () => {
        // Mock data for the request body
        const requestBody = {
            title: 'Test Thesis',
            internal_co_supervisors_id: ['d2'],
            external_co_supervisors_id: ['1'],
            type: 'Bachelor',
            description: 'Test description',
            required_knowledge: 'Test knowledge',
            notes: 'Test notes',
            level: 'Bachelor',
            cds: 'Test CDS',
            keywords: ['test', 'keywords'],
        };

        const response = await request(app)
            .post('/api/teacher/thesis_proposals')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${studentAccessToken}`)
            .send(requestBody);

        expect(response.status).toBe(403);
        expect(response.body).toEqual("Unauthorized");
    });
    test('should return error 401 if not logged in', async () => {
        const requestBody = {
            title: 'Test Thesis',
            internal_co_supervisors_id: ['d2'],
            external_co_supervisors_id: ['1'],
            type: 'Bachelor',
            description: 'Test description',
            required_knowledge: 'Test knowledge',
            notes: 'Test notes',
            level: 'Bachelor',
            cds: 'Test CDS',
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
            internal_co_supervisors_id: ['d2'],
            external_co_supervisors_id: ['1'],
            type: 'Bachelor',
            description: 'Test description',
            required_knowledge: 'Test knowledge',
            notes: 'Test notes',
            expiration: '2023-12-31',
            level: 'Bachelor',
            cds: 'Test CDS',
            keywords: ['test', 'keywords'],
        };

        const response = await request(app)
          .post('/api/teacher/thesis_proposals')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${teacherAccessToken}`)
          .send(requestBody);

        // Expecting a 500 status code
        expect(response.status).toBe(500);
    });
});

describe('GET /api/keywords', () => {
    test('should return an array of keywords', async () => {
        // Send a request to the endpoint
        const response = await request(app)
            .get('/api/keywords')
            .set('Authorization', `Bearer ${teacherAccessToken}`);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ keywords: ["AI", "web development", "research", "reactive API"] });
    });

    // TODO: Add tests on authentication controls

    test('should handle errors and return 500', async () => {
        jest.spyOn(thesisDao, 'getAllKeywords').mockRejectedValueOnce(new Error());

        // Send a request to the endpoint
        const response = await request(app)
            .get('/api/keywords')
            .set('Authorization', `Bearer ${teacherAccessToken}`);

        // Assertions
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});

describe('GET /api/degrees', () => {
    test('should return an array of degrees', async () => {
        // Send a request to the endpoint
        const response = await request(app)
            .get('/api/degrees')
            .set('Authorization', `Bearer ${teacherAccessToken}`);

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
        const response = await request(app)
                               .get('/api/degrees')
                               .set('Authorization', `Bearer ${teacherAccessToken}`);

        // Assertions
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});

describe('GET /api/thesis-proposals (student)', () => {
    test('should return the list of thesis proposals of a student', async () => {
        // Signed as a student in L-08 degree

        const response = await request(app)
            .get('/api/thesis-proposals')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${studentAccessToken}`)
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
                    title: expect.any(String),
                    status: expect.any(String),
                    supervisor: {
                        id: expect.any(String),
                        name: expect.any(String),
                        surname: expect.any(String),
                        email: expect.any(String),
                        codGroup: expect.any(String),
                        codDepartment: expect.any(String),
                    },
                    coSupervisors: {
                        internal: [],
                        external: [
                            {
                                id: 1, surname: 'Amato', name: 'Alice', email: 'alice.amato@email.com'
                            }
                        ]
                    },
                    type: expect.any(String),
                    description: expect.any(String),
                    requiredKnowledge: expect.any(String),
                    notes: expect.any(String),
                    creation_date: expect.any(String),
                    expiration: expect.any(String),
                    level: expect.any(String),
                    cds: {
                        code: 'L-08',
                        title: 'Ingegneria Elettronica'
                    },
                    keywords: ['AI', 'web development', 'research'],
                    groups: ['Group1']
                },
                {
                    id: 2,
                    title: expect.any(String),
                    status: expect.any(String),
                    supervisor: {
                        id: expect.any(String),
                        name: expect.any(String),
                        surname: expect.any(String),
                        email: expect.any(String),
                        codGroup: expect.any(String),
                        codDepartment: expect.any(String),
                    },
                    coSupervisors: {
                        internal: [],
                        external: [
                            {
                                id: 1, surname: 'Amato', name: 'Alice', email: 'alice.amato@email.com'
                            }
                        ]
                    },
                    type: expect.any(String),
                    description: expect.any(String),
                    requiredKnowledge: expect.any(String),
                    notes: expect.any(String),
                    creation_date: expect.any(String),
                    expiration: expect.any(String),
                    level: expect.any(String),
                    cds: {
                        code: 'L-08',
                        title: 'Ingegneria Elettronica'
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

describe('GET /api/thesis-proposals/:id (teacher)', () => {
    test('should return the thesis proposal', async () => {
        const response = await request(app)
            .get('/api/thesis-proposals/1')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${teacherAccessToken}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            status: 'ACTIVE',
            title: expect.any(String),
            type: expect.any(String),
            description: expect.any(String),
            expiration: expect.any(String),
            level: expect.any(String),
            requiredKnowledge: expect.any(String),
            notes: expect.any(String),
            cds: [{ code: 'L-08', title: 'Ingegneria Elettronica' }],
            supervisor: {
                id: expect.any(String),
                surname: expect.any(String),
                name: expect.any(String),
                email: expect.any(String),
                cod_group: expect.any(String),
                cod_department: expect.any(String)
            },
            coSupervisors: {
                internal: [],
                external: [{ id: expect.any(String), surname: expect.any(String), name: expect.any(String), email: expect.any(String) }]
            },
            keywords: [
                'AI',
                'web development',
                'research',
            ]
        });
    });
    test('should return error 404 if no thesis match the ID', async () => {
        const response = await request(app)
            .get('/api/thesis-proposals/123')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${teacherAccessToken}`)
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

        const response = await request(app)
            .get('/api/thesis-proposals/1')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${teacherAccessToken}`)
            .send();

        // Expecting a 500 status code
        expect(response.status).toBe(500);
    });
});

describe('GET /api/thesis-proposals/:id (student)', () => {
    test('should return the thesis proposal', async () => {
        // Signed as a student in L-08 degree

        const response = await request(app)
            .get('/api/thesis-proposals/1')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${studentAccessToken}`)
            .send();

        expect(response.body).toEqual({
            id: 1,
            status: 'ACTIVE',
            title: expect.any(String),
            type: expect.any(String),
            description: expect.any(String),
            expiration: expect.any(String),
            level: expect.any(String),
            requiredKnowledge: expect.any(String),
            notes: expect.any(String),
            cds: { code: 'L-08', title: 'Ingegneria Elettronica' },
            supervisor: {
                id: expect.any(String),
                surname: expect.any(String),
                name: expect.any(String),
                email: expect.any(String),
                cod_group: expect.any(String),
                cod_department: expect.any(String)
            },
            coSupervisors: {
                internal: [],
                external: [{ id: expect.any(String), surname: expect.any(String), name: expect.any(String), email: expect.any(String) }]
            },
            keywords: [
                'AI',
                'web development',
                'research',
            ]
        });
    });
    test('should return error 404 if no thesis match the ID', async () => {
        // Signed as a student in L-08 degree

        const response = await request(app)
            .get('/api/thesis-proposals/3')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${studentAccessToken}`)
            .send();

        expect(response.status).toBe(404);
    });
    test('should return error 403 if not authorized', async () => {
        const response = await request(app)
            .get('/api/thesis-proposals/1')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${studentAccessToken}`)
            .send();

        expect(response.status).toBe(403);
        expect(response.body).toEqual("Unauthorized");
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

        const response = await request(app)
            .get('/api/thesis-proposals/1')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${studentAccessToken}`)
            .send();

        // Expecting a 500 status code
        expect(response.status).toBe(500);
    });
});

describe('GET /api/thesis-proposals (teacher)', () => {
    test('should return an array of thesis proposals for a teacher', async () => {
        // Signed in as Marco Rossi

        // Send a request to the endpoint
        const response = await request(app)
            .get('/api/thesis-proposals')
            .set('Authorization', `Bearer ${teacherAccessToken}`)
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
        expect(items).toHaveLength(3);
    });

    test('should handle errors and return 500', async () => {
        jest.spyOn(thesisDao, 'listThesisProposalsTeacher').mockRejectedValueOnce(new Error());

        // Send a request to the endpoint
        const response = await request(app)
                               .get('/api/thesis-proposals')
                               .set('Authorization', `Bearer ${teacherAccessToken}`);

        // Assertions
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});

describe('PUT /api/thesis-proposals/:id', () => {
    test('should update a thesis proposal successfully', async () => {
        const responseGet = await request(app)
            .get('/api/thesis-proposals/1')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${teacherAccessToken}`)
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
            level: body.level + ' updated',
            cds: ['L-08'],
            keywords: [...body.keywords, 'another keyword'],
            internal_co_supervisors_id: [],
            external_co_supervisors_id: []
        };
        const response = await request(app)
            .put(`/api/thesis-proposals/1`)
            .set('Authorization', `Bearer ${teacherAccessToken}`)
            .send(updatedBody);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            title: updatedBody.title,
            supervisor: {
                id: expect.any(String),
                surname: expect.any(String),
                name: expect.any(String),
                email: expect.any(String),
                cod_group: expect.any(String),
                cod_department: expect.any(String)
            },
            type: updatedBody.type,
            description: updatedBody.description,
            requiredKnowledge: updatedBody.required_knowledge,
            notes: updatedBody.notes,
            expiration: `${updatedBody.expiration}T23:59:59.999Z`,
            level: updatedBody.level,
            cds: [{ code: 'L-08', title: 'Ingegneria Elettronica' }],
            keywords: updatedBody.keywords,
            coSupervisors: {
                internal: [],
                external: []
            }
        });
    });

    test('should return 403 error if the proposal has accepted applications', async () => {
        // Make the request to your API
        const response = await request(app)
            .put(`/api/thesis-proposals/3`)
            .set('Authorization', `Bearer ${teacherAccessToken}`)
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
        const response = await request(app)
            .put(`/api/thesis-proposals/32`)
            .set('Authorization', `Bearer ${teacherAccessToken}`)
            .send(body);

        // Assert the response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: `Thesis proposal with id 1 not found.` });
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
        const response = await request(app)
            .put(`/api/thesis-proposals/1`)
            .set('Authorization', `Bearer ${teacherAccessToken}`)
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
        const response = await request(app)
            .put(`/api/thesis-proposals/1`)
            .set('Authorization', `Bearer ${teacherAccessToken}`)
            .send(body);

        // Assert the response
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});

describe('POST /api/student/applications', () => {
    test('applies for a thesis proposal and returns 201', async () => {
        // Logged as s321529 (no current application)
        const body = { thesis_proposal_id: 2 };

        const response = await request(app)
            .post('/api/student/applications')
            .set('Authorization', `Bearer ${studentAccessToken}`)
            .send(body);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            thesis_proposal_id: body.thesis_proposal_id,
            student_id: 's321529',
            status: 'waiting for approval',
        });
    });
    test('applies for a thesis proposal not logged as a student', async () => {
        const response = await request(app)
            .post('/api/student/applications')
            .send(body);

        expect(response.status).toBe(401);
    });
});

describe('GET /api/teacher/applications/:proposal_id', () => {
    test('should return an empty array of applications for a teacher and proposal', async () => {
        // Logged in as d370335 (Luca Bianchi)

        // Send a request to the endpoint
        const response = await request(app)
            .get('/api/teacher/applications/1')
            .set('Authorization', `Bearer ${teacherAccessToken}`);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('should return an array of applications for a teacher and proposal', async () => {
        // Logged in as d279620

        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s321529', 2, new Date().toISOString(), 'waiting for approval');

        // Send a request to the endpoint
        const response = await request(app)
            .get('/api/teacher/applications/2')
            .set('Authorization', `Bearer ${teacherAccessToken}`);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { student_id: 's321529', proposal_id: 2, status: 'waiting for approval' }
        ]);
    });
});

describe('GET /api/student/active-application', () => {
    test('should return empty list of applications', async () => {
        // Logged in as s321529

        // Perform the request
        const response = await request(app)
            .get('/api/student/active-application')
            .set('Authorization', `Bearer ${studentAccessToken}`);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('should return student active application in an array (one element)', async () => {
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s321529', 2, new Date().toISOString(), 'waiting for approval');

        // Logged in as s321529

        // Perform the request
        const response = await request(app)
            .get('/api/student/active-application')
            .set('Authorization', `Bearer ${studentAccessToken}`);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ proposal_id: 2 }]);
    });

    test('should return 500 if an error occurs', async () => {
        jest.spyOn(thesisDao, 'getStudentActiveApplication').mockRejectedValueOnce(new Error());

        // Perform the request
        const response = await request(app)
                               .get('/api/student/active-application')
                               .set('Authorization', `Bearer ${studentAccessToken}`);

        // Assertions
        expect(response.status).toBe(500);
    });
});

describe('PATCH /api/teacher/applications/accept/:proposal_id', () => {
    test('should accept thesis and reject others', async () => {
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s321529', 2, new Date().toISOString(), 'waiting for approval');
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s318952', 2, new Date().toISOString(), 'waiting for approval');

        // Act
        const response = await request(app)
          .patch("/api/teacher/applications/accept/2")
          .send({ student_id: 's321529' })
          .set('Authorization', `Bearer ${teacherAccessToken}`)
          .expect(200);

        // Assert
        expect(response.body).toEqual({ message: 'Thesis accepted and others rejected successfully' });
    });

    test('should return 400 error if is missing student_id', async () => {
        // Act
        const response = await request(app)
            .patch("/api/teacher/applications/accept/2")
            .set('Authorization', `Bearer ${teacherAccessToken}`);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Missing required fields.' });
    });
    test('should return 404 error if no application has been found', async () => {
        // Act
        const response = await request(app)
            .patch("/api/teacher/applications/accept/2")
            .set('Authorization', `Bearer ${teacherAccessToken}`)
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
        const response = await request(app)
          .patch(`/api/teacher/applications/accept/${proposalId}`)
          .set('Authorization', `Bearer ${teacherAccessToken}`)
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
        const response = await request(app)
            .patch("/api/teacher/applications/reject/2")
            .send({ student_id: 's321529' })
            .set('Authorization', `Bearer ${teacherAccessToken}`)
            .expect(200);

        // Assert
        expect(response.body).toEqual({ message: 'Thesis successfully rejected' });
    });

    test('should return 400 error if is missing student_id', async () => {
        // Act
        const response = await request(app)
            .patch("/api/teacher/applications/reject/2")
            .set('Authorization', `Bearer ${teacherAccessToken}`);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Missing required fields.' });
    });
    test('should return 404 error if no application has been found', async () => {
        // Act
        const response = await request(app)
            .patch("/api/teacher/applications/reject/234567")
            .set('Authorization', `Bearer ${teacherAccessToken}`)
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
        const response = await request(app)
            .patch(`/api/teacher/applications/reject/${proposalId}`)
            .set('Authorization', `Bearer ${teacherAccessToken}`)
            .send({ student_id: studentId });

        // Assert
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});

describe('GET /api/student/applications-decision', () => {
    test('should return a list of applications for the student', async () => {
        // Logged as s321529

        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s321529', 1, new Date().toISOString(), 'rejected');
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s321529', 2, new Date().toISOString(), 'rejected');
        db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
            .run('s321529', 2, new Date().toISOString(), 'waiting for approval');

        // Make the request to your API
        const response = await request(app)
            .get('/api/student/applications-decision')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${studentAccessToken}`)
            .send();

        // Assert the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                application_id: expect.any(Number),
                proposal_id: 1,
                title: expect.any(String),
                level: expect.any(String),
                teacher_name: expect.any(String),
                surname: expect.any(String),
                status: 'rejected'
            },
            {
                application_id: expect.any(Number),
                proposal_id: 2,
                title: expect.any(String),
                level: expect.any(String),
                teacher_name: expect.any(String),
                surname: expect.any(String),
                status: 'rejected'
            },
            {
                application_id: expect.any(Number),
                proposal_id: 2,
                title: expect.any(String),
                level: expect.any(String),
                teacher_name: expect.any(String),
                surname: expect.any(String),
                status: 'waiting for approval'
            }
        ]);
    });

    test('should handle errors and return 500 status', async () => {
        jest.spyOn(thesisDao, 'listApplicationsDecisionsFromStudent').mockRejectedValueOnce(new Error());

        // Make the request to your API
        const response = await request(app)
            .get('/api/student/applications-decision')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${studentAccessToken}`    )
            .send();

        // Assert the response
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});

describe('DELETE /api/thesis-proposals/:id', () => {
    test('should delete a thesis proposal and notify application status change', async () => {
        const id = 1;

        // Make a request to the endpoint
        const response = await request(app)
            .delete(`/api/thesis-proposals/${id}`)
            .set('Authorization', `Bearer ${teacherAccessToken}`);

        // Assertions
        expect(response.status).toBe(204);
    });

    test('should refuse to delete a thesis proposal with accepted application', async () => {
        const id = 3;

        // Make a request to the endpoint
        const response = await request(app)
            .delete(`/api/thesis-proposals/${id}`)
            .set('Authorization', `Bearer ${teacherAccessToken}`);

        // Assertions
        expect(response.status).toBe(403);
        expect(response.body).toEqual({ message: 'Some applications has been accepted and, therefore, you can\'t delete this thesis' });
    });

    test('should handle errors and return the appropriate response', async () => {
        const id = 'nonExistingProposalId';

        // Make a request to the endpoint
        const response = await request(app)
            .delete(`/api/thesis-proposals/${id}`)
            .set('Authorization', `Bearer ${teacherAccessToken}`);

        // Assertions
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: `No thesis proposal with id ${id} found to delete` });
    });

    test('should handle unexpected errors and return 500 Internal Server Error', async () => {
        jest.spyOn(thesisDao, 'deleteThesisProposalById').mockRejectedValueOnce(new Error());

        // Make a request to the endpoint
        const response = await request(app)
            .delete('/api/thesis-proposals/unexpectedErrorId')
            .set('Authorization', `Bearer ${teacherAccessToken}`);

        // Assertions
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal Server Error' });
    });
});

require('jest');
request = require("supertest");
const service = require("../thesis_dao");
const degreeService = require("../degree_dao");
const usersService = require("../users_dao");
const schemas = require("../schemas");
const {app, server} = require("../index");
const { serialize } = require('../db');
const AdvancedDate = require('../AdvancedDate');

// Mocking the getTeacherListExcept function
jest.mock('../thesis_dao', () => ({
    getTeacherListExcept: jest.fn(),
    getExternalCoSupervisorList: jest.fn(),
    getGroup: jest.fn(),
    createThesisProposal: jest.fn(),
    listThesisProposalsFromStudent: jest.fn(),
    getKeywordsOfProposal: jest.fn(),
    getInternalCoSupervisorsOfProposal: jest.fn(),
    getExternalCoSupervisorsOfProposal: jest.fn(),
    getSupervisorOfProposal: jest.fn(),
    getProposalGroups: jest.fn(),
    getThesisProposal: jest.fn(),
    getThesisProposalById: jest.fn(),
    getAllKeywords: jest.fn(),
    getDegrees: jest.fn(),
    listThesisProposalsTeacher: jest.fn(),
    listApplicationsForTeacherThesisProposal: jest.fn(),
    applyForProposal: jest.fn(),
    getStudentActiveApplication: jest.fn(),
    updateApplicationStatus: jest.fn(),
    rejectOtherApplications: jest.fn(),
    getThesisProposalCds: jest.fn(),
    getThesisProposalTeacher: jest.fn(),
    listApplicationsDecisionsFromStudent: jest.fn(),
    updateThesisProposal: jest.fn(),
}));

jest.mock('../users_dao', () => ({
    getUser: jest.fn(),
    getStudentDegree: jest.fn(),
}));

jest.mock('../degree_dao', () => ({
    getDegreeFromCode: jest.fn(),
}));

afterAll((done) => {
    jest.resetAllMocks();
    server.close(done);
});

describe('GET /api/teachers', () => {
    test('returns a list of teachers excluding the logged-in teacher', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        service.getTeacherListExcept.mockResolvedValue([
            { id: 'd2', name: 'Teacher2' },
            { id: 'd3', name: 'Teacher3' },
        ]);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        const response = await request(app)
            .get('/api/teachers')
            .set('Accept', 'application/json')
            .set('Cookie', cookies);

        // Verify that the response contains the expected data
        expect(response.body.teachers).toEqual([
            { id: 'd2', name: 'Teacher2' },
            { id: 'd3', name: 'Teacher3' },
        ]);

        // Verify that getTeacherListExcept was called with the correct arguments
        expect(service.getTeacherListExcept).toHaveBeenCalledWith(mockUser.id);
    });

    test('handles internal server error gracefully', async () => {

        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        service.getTeacherListExcept.mockRejectedValue(new Error('Mocked error during getTeacherListExcept'));

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        const response = await request(app)
            .get('/api/teachers')
            .set('Accept', 'application/json')
            .set('Cookie', cookies)
            .expect(500);


    expect(response.status).toBe(500);
    expect(response.body).toEqual("Internal Server Error");
    });
});

describe('GET /api/externalCoSupervisors', () => {
    test('returns the list of external co-supervisors', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        service.getExternalCoSupervisorList.mockResolvedValue([
            { id: '1', name: 'ExternalCoSupervisor1' },
            { id: '2', name: 'ExternalCoSupervisor2' },
        ]);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        const response = await request(app)
            .get('/api/externalCoSupervisors')
            .set('Accept', 'application/json')
            .set('Cookie', cookies);

        // Verify that the response contains the expected data
        expect(response.body.externalCoSupervisors).toEqual([
            { id: '1', name: 'ExternalCoSupervisor1' },
            { id: '2', name: 'ExternalCoSupervisor2' },
        ]);
    });

    test('handles internal server error gracefully', async () => {

        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        service.getExternalCoSupervisorList.mockRejectedValue(new Error('Mocked error during getTeacherListExcept'));

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        const response = await request(app)
            .get('/api/externalCoSupervisors')
            .set('Accept', 'application/json')
            .set('Cookie', cookies)
            .expect(500);


    expect(response.status).toBe(500);
    expect(response.body).toEqual("Internal Server Error");
    });
});

describe('POST /api/teacher/thesis_proposals', () => {
    test('should create a new thesis proposal', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        // Mock data for the request body
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

        service.getGroup.mockResolvedValueOnce({ cod_group: 'Group1' });
        service.getGroup.mockResolvedValueOnce({ cod_group: 'Group2' });

        // Mock the createThesisProposal function
        require('../thesis_dao').createThesisProposal.mockResolvedValue('mockedThesisProposalId');

        const response = await request(app)
            .post('/api/teacher/thesis_proposals')
            .set('Accept', 'application/json')
            .set('Cookie', cookies)
            .send(requestBody);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            id: 'mockedThesisProposalId',
            supervisor_id: 'd1',
            title: 'Test Thesis',
            internal_co_supervisors_id: ['d2'],
            external_co_supervisors_id: ['1'],
            type: 'Bachelor',
            description: 'Test description',
            required_knowledge: 'Test knowledge',
            notes: 'Test notes',
            expiration: '2023-12-31T23:59:59.999Z',
            level: 'Bachelor',
            cds: 'Test CDS',
            groups: [
                { cod_group: 'Group1' },
                { cod_group: 'Group2' },
            ],
            keywords: ['test', 'keywords'],
        });
    });
    test('should create a new thesis proposal', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        // Mock data for the request body
        const requestBody = {
            title: 'Test Thesis',
            internal_co_supervisors_id: [],
            external_co_supervisors_id: [],
            type: 'Bachelor',
            description: 'Test description',
            required_knowledge: 'Test knowledge',
            notes: 'Test notes',
            expiration: '2023-12-31',
            level: 'Bachelor',
            cds: 'Test CDS',
            keywords: ['test', 'keywords'],
        };

        service.getGroup.mockResolvedValueOnce({ cod_group: 'Group1' });

        // Mock the createThesisProposal function
        require('../thesis_dao').createThesisProposal.mockResolvedValue('mockedThesisProposalId');

        const response = await request(app)
            .post('/api/teacher/thesis_proposals')
            .set('Accept', 'application/json')
            .set('Cookie', loginResponse.headers['set-cookie'])
            .send(requestBody);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            id: 'mockedThesisProposalId',
            supervisor_id: 'd1',
            title: 'Test Thesis',
            internal_co_supervisors_id: [],
            external_co_supervisors_id: [],
            type: 'Bachelor',
            description: 'Test description',
            required_knowledge: 'Test knowledge',
            notes: 'Test notes',
            expiration: '2023-12-31T23:59:59.999Z',
            level: 'Bachelor',
            cds: 'Test CDS',
            groups: [
                { cod_group: 'Group1' },
            ],
            keywords: ['test', 'keywords'],
        });
    });
    test('should return error 400 if some required field is missing', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

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

        service.getGroup.mockResolvedValueOnce({ cod_group: 'Group1' });
        service.getGroup.mockResolvedValueOnce({ cod_group: 'Group2' });

        // Mock the createThesisProposal function
        require('../thesis_dao').createThesisProposal.mockResolvedValue('mockedThesisProposalId');

        const response = await request(app)
            .post('/api/teacher/thesis_proposals')
            .set('Accept', 'application/json')
            .set('Cookie', cookies)
            .send(requestBody);

        expect(response.status).toBe(400);
        expect(response.body).toEqual("Missing required fields.");
    });
    test('should return error 403 if not authorized', async () => {
        const mockUser = {
            id: 's1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

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

        service.getGroup.mockResolvedValueOnce({ cod_group: 'Group1' });
        service.getGroup.mockResolvedValueOnce({ cod_group: 'Group2' });

        // Mock the createThesisProposal function
        require('../thesis_dao').createThesisProposal.mockResolvedValue('mockedThesisProposalId');

        const response = await request(app)
            .post('/api/teacher/thesis_proposals')
            .set('Accept', 'application/json')
            .set('Cookie', cookies)
            .send(requestBody);

        expect(response.status).toBe(403);
        expect(response.body).toEqual("Unauthorized");
    });
    test('should return error 401 if not logged in', async () => {

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

        service.getGroup.mockResolvedValueOnce({ cod_group: 'Group1' });
        service.getGroup.mockResolvedValueOnce({ cod_group: 'Group2' });

        // Mock the createThesisProposal function
        require('../thesis_dao').createThesisProposal.mockResolvedValue('mockedThesisProposalId');


        const response = await request(app)
            .post('/api/teacher/thesis_proposals')
            .set('Accept', 'application/json')
            .send(requestBody);

        expect(response.status).toBe(401);
        expect(response.body).toEqual("Not authorized");
    });
    test('should return error 500 if createThesisProposal throws an error', async () => {
        const mockUser = {
        id: 'd1',
        surname: 'R',
        name: 'M',
        email: 'r.m@email.com',
        cod_group: 'Group1',
        cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
        .post('/api/sessions')
        .send({ username: 'r.m@email.com', password: 'd1' })
        .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        // Mock data for the request body
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

        service.getGroup.mockResolvedValueOnce({ cod_group: 'Group1' });
        service.getGroup.mockResolvedValueOnce({ cod_group: 'Group2' });

        // Mock the createThesisProposal function to throw an error
        require('../thesis_dao').createThesisProposal.mockRejectedValue(new Error('Mocked error during thesis proposal creation'));

        const response = await request(app)
          .post('/api/teacher/thesis_proposals')
          .set('Accept', 'application/json')
          .set('Cookie', cookies)
          .send(requestBody);

        // Expecting a 500 status code
        expect(response.status).toBe(500);

    });
});

describe('GET /api/keywords', () => {
    test('should return an array of keywords', async () => {

        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];

        // Mock the response from thesisDao.getAllKeywords
        const mockKeywords = ['Keyword1', 'Keyword2'];
        service.getAllKeywords.mockResolvedValue(mockKeywords);

        // Send a request to the endpoint
        const response = await request(app)
                               .get('/api/keywords')
                               .set('Cookie', cookies);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ keywords: mockKeywords });
        expect(service.getAllKeywords).toHaveBeenCalled();
    });

    test('should handle errors and return 500', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];

        // Mock an error in thesisDao.getAllKeywords
        const mockError = new Error('Mocked error during getAllKeywords');
        service.getAllKeywords.mockRejectedValueOnce(mockError);

        // Send a request to the endpoint
        const response = await request(app)
                               .get('/api/keywords')
                               .set('Cookie', cookies);

        // Assertions
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
        expect(service.getAllKeywords).toHaveBeenCalled();
    });
});

describe('GET /api/degrees', () => {
    test('should return an array of degrees', async () => {

        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];

        // Mock the response from thesisDao.getAllKeywords
        const mockDegrees = [{ cod_degree: 'L-01', title_degree: 'Ingegneria Informatica' }, { cod_degree: 'L-02', title_degree: 'Ingegneria Elettronica' }];
        service.getDegrees.mockResolvedValue(mockDegrees);

        // Send a request to the endpoint
        const response = await request(app)
                               .get('/api/degrees')
                               .set('Cookie', cookies);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockDegrees);
        expect(service.getDegrees).toHaveBeenCalled();
    });

    test('should handle errors and return 500', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];

        // Mock an error in thesisDao.getAllKeywords
        const mockError = new Error('Mocked error during getDegrees');
        service.getDegrees.mockRejectedValueOnce(mockError);

        // Send a request to the endpoint
        const response = await request(app)
                               .get('/api/degrees')
                               .set('Cookie', cookies);

        // Assertions
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
        expect(service.getDegrees).toHaveBeenCalled();
    });
});

describe('GET /api/thesis-proposals (student)', () => {
    test('should return the list of thesis proposals of a student', async () => {
        const mockUser = {
            id: 's1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 's1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        /**
         * @type {ThesisProposalRow[]}
         */
        const mockThesisProposal = [
            {
                proposal_id: '1',
                title: 'Test Thesis',
                description: 'Test description',
                expiration: '2021-12-31',
                level: 'Bachelor',
                cds: 'mockCode',
                supervisor_id: 'd1',
                type: 'Bachelor',
                required_knowledge: 'Test knowledge',
                notes: 'Test notes'
            }
        ];
        service.listThesisProposalsFromStudent.mockResolvedValue(mockThesisProposal);
        usersService.getStudentDegree.mockResolvedValue({ cod_degree: 'mockCode', title_degree: 'mockTitle' });
        const supervisorMocked = {
            id: mockThesisProposal[0].supervisor_id,
            surname: 'R',
            name: 'M',
            email: 'd1@polito.com'
        };
        service.getSupervisorOfProposal.mockResolvedValue(supervisorMocked);

        service.getInternalCoSupervisorsOfProposal.mockResolvedValue([]);

        const externalCoSupervisorsMocked = [
            {
                id: '1',
                name: 'ExternalCoSupervisor1',
                email: 'extern@polito.com'
            }
        ];
        service.getExternalCoSupervisorsOfProposal.mockResolvedValue(externalCoSupervisorsMocked);

        const keywordsMocked = [
            "keyword1",
            "keyword2"
        ];
        service.getKeywordsOfProposal.mockResolvedValue(keywordsMocked);

        const mockDegree = {
            cod_degree: mockThesisProposal[0].cds,
            title_degree: 'Ingegneria Informatica',
        };
        degreeService.getDegreeFromCode.mockResolvedValue(mockDegree);

        const response = await request(app)
            .get('/api/thesis-proposals')
            .set('Accept', 'application/json')
            .set('Cookie', cookies)
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            $metadata: {
                index: 0,
                count: mockThesisProposal.length,
                total: mockThesisProposal.length,
                currentPage: 1
            },
            items: [
                {
                    id: '1',
                    status: 'EXPIRED',
                    title: 'Test Thesis',
                    description: 'Test description',
                    expiration: '2021-12-31',
                    level: 'Bachelor',
                    cds: {
                        cod_degree: 'mockCode',
                        title_degree: 'mockTitle'
                    },
                    supervisor: supervisorMocked,
                    coSupervisors: {
                        internal: [],
                        external: externalCoSupervisorsMocked
                    },
                    type: 'Bachelor',
                    requiredKnowledge: 'Test knowledge',
                    notes: 'Test notes',
                    keywords: keywordsMocked
                }
            ]
        });
    });
    test('should return the list of thesis proposals of a student and set status as ACTIVE', async () => {
        const mockUser = {
            id: 's1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 's1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        /**
         * @type {ThesisProposalRow[]}
         */
        const mockThesisProposal = [
            {
                proposal_id: '1',
                title: 'Test Thesis',
                description: 'Test description',
                expiration: '2051-12-31',
                level: 'Bachelor',
                cds: 'mockCode',
                supervisor_id: 'd1',
                type: 'Bachelor',
                required_knowledge: 'Test knowledge',
                notes: 'Test notes'
            }
        ];
        service.listThesisProposalsFromStudent.mockResolvedValue(mockThesisProposal);
        usersService.getStudentDegree.mockResolvedValue({ cod_degree: 'mockCode', title_degree: 'mockTitle' });
        const supervisorMocked = {
            id: mockThesisProposal[0].supervisor_id,
            surname: 'R',
            name: 'M',
            email: 'd1@polito.com'
        };
        service.getSupervisorOfProposal.mockResolvedValue(supervisorMocked);

        service.getInternalCoSupervisorsOfProposal.mockResolvedValue([]);

        const externalCoSupervisorsMocked = [
            {
                id: '1',
                name: 'ExternalCoSupervisor1',
                email: 'extern@polito.com'
            }
        ];
        service.getExternalCoSupervisorsOfProposal.mockResolvedValue(externalCoSupervisorsMocked);

        const keywordsMocked = [
            "keyword1",
            "keyword2"
        ];
        service.getKeywordsOfProposal.mockResolvedValue(keywordsMocked);

        const mockGroups = [
            'Group1',
            'Group2'
        ];
        service.getProposalGroups.mockResolvedValueOnce(mockGroups);

        const mockDegree = {
            cod_degree: mockThesisProposal[0].cds,
            title_degree: 'mockTitle',
        };
        degreeService.getDegreeFromCode.mockResolvedValue(mockDegree);

        const response = await request(app)
            .get('/api/thesis-proposals')
            .set('Accept', 'application/json')
            .set('Cookie', cookies)
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            $metadata: {
                index: 0,
                count: mockThesisProposal.length,
                total: mockThesisProposal.length,
                currentPage: 1
            },
            items: [
                {
                    id: '1',
                    status: 'ACTIVE',
                    title: 'Test Thesis',
                    description: 'Test description',
                    expiration: '2051-12-31',
                    level: 'Bachelor',
                    cds: {
                        cod_degree: mockThesisProposal[0].cds,
                        title_degree: mockDegree.title_degree
                    },
                    supervisor: supervisorMocked,
                    coSupervisors: {
                        internal: [],
                        external: externalCoSupervisorsMocked
                    },
                    type: 'Bachelor',
                    requiredKnowledge: 'Test knowledge',
                    notes: 'Test notes',
                    keywords: keywordsMocked,
                    groups: mockGroups
                }
            ]
        });
    });
    test('should return error 403 if not authorized', async () => {
        const mockUser = {
            id: 'm1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        const response = await request(app)
            .get('/api/thesis-proposals')
            .set('Accept', 'application/json')
            .set('Cookie', loginResponse.headers['set-cookie'])
            .send();

        expect(response.status).toBe(403);
        expect(response.body).toEqual("Unauthorized");
    });
    test('should return error 401 if not logged in', async () => {
        const response = await request(app)
            .get('/api/thesis-proposals')
            .set('Accept', 'application/json')
            .send();

        expect(response.status).toBe(401);
        expect(response.body).toEqual("Not authorized");
    });
    test('should return error 500 if dao throws an error', async () => {
        const mockUser = {
            id: 's1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 's1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        service.listThesisProposalsFromStudent.mockRejectedValue(new Error());

        const response = await request(app)
            .get('/api/thesis-proposals')
            .set('Accept', 'application/json')
            .set('Cookie', cookies)
            .send();

        // Expecting a 500 status code
        expect(response.status).toBe(500);
    });
});

describe('GET /api/thesis-proposals/:id (teacher)', () => {
    test('should return the thesis proposal', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'd1@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'd1@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        /**
         * @type {ThesisProposalRow}
         */
        const mockThesisProposal = {
            proposal_id: '1',
            title: 'Test Thesis',
            description: 'Test description',
            expiration: '2021-12-31',
            level: 'Bachelor',
            cds: ['C1', 'C2'],
            supervisor_id: 'd1',
            type: 'Bachelor',
            required_knowledge: 'Test knowledge',
            notes: 'Test notes'
        };
        service.getThesisProposalTeacher.mockResolvedValue(mockThesisProposal);
        service.getThesisProposalCds.mockResolvedValue([{ cod_degree: 'mockCode1', title_degree: 'mockTitle1' }, { cod_degree: 'mockCode2', title_degree: 'mockTitle2' }]);

        const supervisorMocked = {
            id: mockThesisProposal.supervisor_id,
            surname: 'R',
            name: 'M',
            email: 'd1@email.com'
        };
        service.getSupervisorOfProposal.mockResolvedValue(supervisorMocked);

        service.getInternalCoSupervisorsOfProposal.mockResolvedValue([]);

        const externalCoSupervisorsMocked = [
            {
                id: '1',
                name: 'ExternalCoSupervisor1',
                email: 'extern@email.com'
            }
        ];
        service.getExternalCoSupervisorsOfProposal.mockResolvedValue(externalCoSupervisorsMocked);

        const keywordsMocked = [
            "keyword1",
            "keyword2"
        ];
        service.getKeywordsOfProposal.mockResolvedValue(keywordsMocked);

        const response = await request(app)
            .get('/api/thesis-proposals/' + mockThesisProposal.proposal_id)
            .set('Accept', 'application/json')
            .set('Cookie', cookies)
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: '1',
            status: 'EXPIRED',
            title: 'Test Thesis',
            description: 'Test description',
            expiration: '2021-12-31',
            level: 'Bachelor',
            cds: [
                {
                    cod_degree: 'mockCode1',
                    title_degree: 'mockTitle1'
                },
                {
                    cod_degree: 'mockCode2',
                    title_degree: 'mockTitle2' }
            ],
            supervisor: supervisorMocked,
            coSupervisors: {
                internal: [],
                external: externalCoSupervisorsMocked
            },
            type: 'Bachelor',
            requiredKnowledge: 'Test knowledge',
            notes: 'Test notes',
            keywords: keywordsMocked
        });

        expect(service.getThesisProposalTeacher).toHaveBeenCalledWith(mockThesisProposal.proposal_id, mockUser.id);
    });
    test('should return error 404 if no thesis match the ID', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'd1@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'd1@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        service.getThesisProposalTeacher.mockResolvedValue(null);

        const response = await request(app)
            .get('/api/thesis-proposals/123')
            .set('Accept', 'application/json')
            .set('Cookie', cookies)
            .send();

        expect(response.status).toBe(404);
    });
    test('should return error 403 if not authorized', async () => {
        const mockUser = {
            id: 't1',
            surname: 'R',
            name: 'M',
            email: 't1@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 't1@email.com', password: 't1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        const response = await request(app)
            .get('/api/thesis-proposals/1')
            .set('Accept', 'application/json')
            .set('Cookie', loginResponse.headers['set-cookie'])
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
        expect(response.body).toEqual("Not authorized");
    });
    test('should return error 500 if dao throws an error', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'd1@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'd1@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        service.getThesisProposalTeacher.mockRejectedValue(new Error());

        const response = await request(app)
            .get('/api/thesis-proposals/1')
            .set('Accept', 'application/json')
            .set('Cookie', cookies)
            .send();

        // Expecting a 500 status code
        expect(response.status).toBe(500);
    });
});

describe('GET /api/thesis-proposals/:id (student)', () => {
    test('should return the thesis proposal', async () => {
        const mockUser = {
            id: 's1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 's1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        /**
         * @type {ThesisProposalRow}
         */
        const mockThesisProposal = {
            proposal_id: '1',
            title: 'Test Thesis',
            description: 'Test description',
            expiration: '2021-12-31',
            level: 'Bachelor',
            cds: 'mockCode',
            supervisor_id: 'd1',
            type: 'Bachelor',
            required_knowledge: 'Test knowledge',
            notes: 'Test notes'
        };
        service.getThesisProposal.mockResolvedValue(mockThesisProposal);
        usersService.getStudentDegree.mockResolvedValue({ cod_degree: 'mockCode', title_degree: 'mockTitle' });

        const supervisorMocked = {
            id: mockThesisProposal.supervisor_id,
            surname: 'R',
            name: 'M',
            email: 'd1@polito.com'
        };
        service.getSupervisorOfProposal.mockResolvedValue(supervisorMocked);

        service.getInternalCoSupervisorsOfProposal.mockResolvedValue([]);

        const externalCoSupervisorsMocked = [
            {
                id: '1',
                name: 'ExternalCoSupervisor1',
                email: 'extern@polito.com'
            }
        ];
        service.getExternalCoSupervisorsOfProposal.mockResolvedValue(externalCoSupervisorsMocked);

        const keywordsMocked = [
            "keyword1",
            "keyword2"
        ];
        service.getKeywordsOfProposal.mockResolvedValue(keywordsMocked);

        const mockDegree = {
            cod_degree: mockThesisProposal.cds,
            title_degree: 'mockTitle',
        };
        degreeService.getDegreeFromCode.mockResolvedValue(mockDegree);

        const response = await request(app)
            .get('/api/thesis-proposals/' + mockThesisProposal.proposal_id)
            .set('Accept', 'application/json')
            .set('Cookie', cookies)
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: '1',
            status: 'EXPIRED',
            title: 'Test Thesis',
            description: 'Test description',
            expiration: '2021-12-31',
            level: 'Bachelor',
            cds: {
                cod_degree: mockThesisProposal.cds,
                title_degree: mockDegree.title_degree
            },
            supervisor: supervisorMocked,
            coSupervisors: {
                internal: [],
                external: externalCoSupervisorsMocked
            },
            type: 'Bachelor',
            requiredKnowledge: 'Test knowledge',
            notes: 'Test notes',
            keywords: keywordsMocked
        });

        expect(service.getThesisProposal).toHaveBeenCalledWith(mockThesisProposal.proposal_id, mockUser.id);
    });
    test('should return error 404 if no thesis match the ID', async () => {
        const mockUser = {
            id: 's1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 's1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        service.getThesisProposal.mockResolvedValue(null);

        const response = await request(app)
            .get('/api/thesis-proposals/123')
            .set('Accept', 'application/json')
            .set('Cookie', cookies)
            .send();

        expect(response.status).toBe(404);
    });
    test('should return error 403 if not authorized', async () => {
        const mockUser = {
            id: 'n1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'n1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        const response = await request(app)
            .get('/api/thesis-proposals/1')
            .set('Accept', 'application/json')
            .set('Cookie', loginResponse.headers['set-cookie'])
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
        expect(response.body).toEqual("Not authorized");
    });
    test('should return error 500 if dao throws an error', async () => {
        const mockUser = {
            id: 's1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 's1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        service.getThesisProposal.mockRejectedValue(new Error());

        const response = await request(app)
            .get('/api/thesis-proposals/1')
            .set('Accept', 'application/json')
            .set('Cookie', cookies)
            .send();

        // Expecting a 500 status code
        expect(response.status).toBe(500);
    });
});

describe('GET /api/thesis-proposals (teacher)', () => {
    test('should return an array of thesis proposals for a teacher', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        const mockThesisProposal = [
            {
                proposal_id: '1',
                title: 'Test Thesis',
                description: 'Test description',
                expiration: '2021-12-31',
                level: 'Bachelor',
                cds: 'mockCode',
                supervisor_id: 'd1',
                type: 'Bachelor',
                required_knowledge: 'Test knowledge',
                notes: 'Test notes'
            }
        ];

        // Mock the function call
        service.listThesisProposalsTeacher.mockResolvedValueOnce(mockThesisProposal);
        service.getThesisProposalCds.mockResolvedValue([{ cod_degree: 'mockCode', title_degree: 'mockTitle' }]);

        const supervisorMocked = {
            id: mockThesisProposal[0].supervisor_id,
            surname: 'R',
            name: 'M',
            email: 'd1@polito.com'
        };
        service.getSupervisorOfProposal.mockResolvedValue(supervisorMocked);

        service.getInternalCoSupervisorsOfProposal.mockResolvedValue([]);

        const externalCoSupervisorsMocked = [
            {
                id: '1',
                name: 'ExternalCoSupervisor1',
                email: 'extern@polito.com'
            }
        ];
        service.getExternalCoSupervisorsOfProposal.mockResolvedValue(externalCoSupervisorsMocked);

        const keywordsMocked = [
            "keyword1",
            "keyword2"
        ];
        service.getKeywordsOfProposal.mockResolvedValue(keywordsMocked);

        const mockDegree = {
            cod_degree: mockThesisProposal[0].cds,
            title_degree: 'Ingegneria Informatica',
        };
        degreeService.getDegreeFromCode.mockResolvedValue(mockDegree);

        // Send a request to the endpoint
        const response = await request(app)
                               .get('/api/thesis-proposals')
                               .set('Cookie', cookies)
                               .send();

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            $metadata: {
                index: 0,
                count: mockThesisProposal.length,
                total: mockThesisProposal.length,
                currentPage: 1
            },
            items: [
                {
                    id: '1',
                    status: 'EXPIRED',
                    title: 'Test Thesis',
                    description: 'Test description',
                    expiration: '2021-12-31',
                    level: 'Bachelor',
                    cds: [{
                        cod_degree: 'mockCode',
                        title_degree: 'mockTitle'
                    }],
                    supervisor: supervisorMocked,
                    coSupervisors: {
                        internal: [],
                        external: externalCoSupervisorsMocked
                    },
                    type: 'Bachelor',
                    requiredKnowledge: 'Test knowledge',
                    notes: 'Test notes',
                    keywords: keywordsMocked
                }
            ]
        });
        expect(service.listThesisProposalsTeacher).toHaveBeenCalledWith('d1');
    });
    test('should handle errors and return 500', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];

        // Mock an error in thesisDao.getAllKeywords
        const mockError = new Error('Mocked error during getAllKeywords');
        service.listThesisProposalsTeacher.mockRejectedValueOnce(mockError);

        // Send a request to the endpoint
        const response = await request(app)
                               .get('/api/thesis-proposals')
                               .set('Cookie', cookies);

        // Assertions
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
        expect(service.listThesisProposalsTeacher).toHaveBeenCalled();
    });
});

describe('PUT /api/thesis-proposals/:id', () => {
    test('should update a thesis proposal successfully', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'd1@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'd1@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

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
            cds: ['Group1'],
            keywords: ['keyword'],
            expiration: '2025-11-10T23:59:59.999Z'
        }

        const creationDate = new AdvancedDate().toISOString();

        const mockedThesisProposal = {
            proposal_id: 1,
            title: "TitoloTesi",
            type: "compilativa",
            description: "description",
            required_knowledge: "required knowledge",
            notes: "notes",
            level: "Bachelor",
            creation_date: creationDate,
            expiration: "2025-11-10T23:59:59.999Z",
        }

        // Mock the thesis DAO methods
        service.listApplicationsForTeacherThesisProposal.mockResolvedValue([]);
        service.getGroup.mockResolvedValueOnce({ cod_group: 'Group1' });
        service.getGroup.mockResolvedValueOnce({ cod_group: 'Group1'});
        service.updateThesisProposal.mockResolvedValue(1);
        service.getThesisProposalById.mockResolvedValue(mockedThesisProposal);
        service.getThesisProposalCds.mockResolvedValue([{ cod_degree: 'mockCode', title_degree: 'mockTitle' }]);

        // _populateProposal
        service.getSupervisorOfProposal.mockResolvedValue(
            {
                id: 'd1',
                surname: 'R',
                name: 'M',
                email: 'd1@email.com',
                cod_group: 'Group1',
                cod_department: 'Dep1',
            }
        );
        service.getInternalCoSupervisorsOfProposal.mockResolvedValue([
            {
                id: "d277137",
                name: "Davide",
                surname: "Colombo",
                email: "colombo.davide@email.com",
                codGroup: "Group1",
                codDepartment: "Dep3"
            }
        ]);
        service.getExternalCoSupervisorsOfProposal.mockResolvedValue([
            {
                "proposal_id": 1,
                "co_supervisor_id": "1.0",
                "id": 1,
                "surname": "Amato",
                "name": "Alice",
                "email": "alice.amato@email.com"
            }
        ]);
        service.getKeywordsOfProposal.mockResolvedValue(["keyword"]);
        service.getProposalGroups.mockResolvedValue(["Group1"]);

        // Make the request to your API
        const response = await request(app)
            .put(`/api/thesis-proposals/1`)
            .set('Cookie', cookies) // Add authorization header if needed
            .send(mockBody);

        const mockUpdatedThesisProposal =
        {
            "id": 1,
            "title": "TitoloTesi",
            "status": "ACTIVE",
            "supervisor": {
                "id": 'd1',
                "surname": 'R',
                "name": 'M',
                "email": 'd1@email.com',
                "codGroup": 'Group1',
                "codDepartment": 'Dep1',
            },
            "coSupervisors": {
              "internal": [
                {
                  "id": "d277137",
                  "name": "Davide",
                  "surname": "Colombo",
                  "email": "colombo.davide@email.com",
                }
              ],
              "external": [
                {
                  "proposal_id": 1,
                  "co_supervisor_id": "1.0",
                  "id": 1,
                  "surname": "Amato",
                  "name": "Alice",
                  "email": "alice.amato@email.com"
                }
              ]
            },
            "type": "compilativa",
            "description": "description",
            "requiredKnowledge": "required knowledge",
            "notes": "notes",
            "creation_date": creationDate,
            "expiration": "2025-11-10T23:59:59.999Z",
            "level": "Bachelor",
            "keywords": [
              "keyword"
            ],
            "groups": [
              "Group1"
            ],
            "cds":[
                {
                    "cod_degree": "mockCode",
                    "title_degree": "mockTitle"
                }
            ]
        }
        // Assert the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUpdatedThesisProposal);
    });

    test('should return 403 error if the proposal has accetted applications', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'd1@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'd1@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

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
            cds: ['Group1'],
            keywords: ['keyword'],
            expiration: '2025-11-10T23:59:59.999Z'
        }

        const creationDate = new AdvancedDate().toISOString();

        // Mock the thesis DAO methods
        service.listApplicationsForTeacherThesisProposal.mockResolvedValue([
            {
                name: 'name',
                surname: 'surname',
                status: 'accepted',
                id: 's1',
            }
        ]);

         // Make the request to your API
         const response = await request(app)
         .put(`/api/thesis-proposals/1`)
         .set('Cookie', cookies) // Add authorization header if needed
         .send(mockBody);

        // Assert the response
        expect(response.status).toBe(403);
        expect(response.body).toEqual({ message: 'Cannot edit a proposal with accepted applications.' });
    });

    test('should return 404 error if the proposal does not exist', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'd1@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'd1@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

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
            cds: ['Group1'],
            keywords: ['keyword'],
            expiration: '2025-11-10T23:59:59.999Z'
        }

        const creationDate = new AdvancedDate().toISOString();

        const mockedThesisProposal = {
            proposal_id: 1,
            title: "TitoloTesi",
            type: "compilativa",
            description: "description",
            required_knowledge: "required knowledge",
            notes: "notes",
            level: "Bachelor",
            creation_date: creationDate,
            expiration: "2025-11-10T23:59:59.999Z",
        }

        // Mock the thesis DAO methods
        service.listApplicationsForTeacherThesisProposal.mockResolvedValue([]);
        service.getGroup.mockResolvedValueOnce({ cod_group: 'Group1' });
        service.getGroup.mockResolvedValueOnce({ cod_group: 'Group1'});
        service.updateThesisProposal.mockResolvedValue();

        // Make the request to your API
        const response = await request(app)
            .put(`/api/thesis-proposals/1`)
            .set('Cookie', cookies) // Add authorization header if needed
            .send(mockBody);

        // Assert the response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: `Thesis proposal with id 1 not found.` });
    });

    test('should return 404 error if the proposal cannot be retrieved', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'd1@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'd1@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

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
            cds: ['Group1'],
            keywords: ['keyword'],
            expiration: '2025-11-10T23:59:59.999Z'
        }

        const creationDate = new AdvancedDate().toISOString();

        // Mock the thesis DAO methods
        service.listApplicationsForTeacherThesisProposal.mockResolvedValue([]);
        service.getGroup.mockResolvedValueOnce({ cod_group: 'Group1' });
        service.getGroup.mockResolvedValueOnce({ cod_group: 'Group1'});
        service.updateThesisProposal.mockResolvedValue(1);
        service.getThesisProposalById.mockResolvedValue();

        // Make the request to your API
        const response = await request(app)
            .put(`/api/thesis-proposals/1`)
            .set('Cookie', cookies) // Add authorization header if needed
            .send(mockBody);

        // Assert the response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: `Thesis proposal with id 1 not found.` });
    });

    test('should return error 400 if some properties are missing', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'd1@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'd1@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

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
        }

        const creationDate = new AdvancedDate().toISOString();

        const mockedThesisProposal = {
            proposal_id: 1,
            title: "TitoloTesi",
            type: "compilativa",
            description: "description",
            required_knowledge: "required knowledge",
            notes: "notes",
            level: "Bachelor",
            creation_date: creationDate,
            expiration: "2025-11-10T23:59:59.999Z",
        }

        // Mock the thesis DAO methods
        service.listApplicationsForTeacherThesisProposal.mockResolvedValue([]);

        // Make the request to your API
        const response = await request(app)
            .put(`/api/thesis-proposals/1`)
            .set('Cookie', cookies) // Add authorization header if needed
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
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'd1@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'd1@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

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
            cds: ['Group1'],
            keywords: ['keyword'],
            expiration: '2025-11-10T23:59:59.999Z'
        }

        const creationDate = new AdvancedDate().toISOString();

        const mockedThesisProposal = {
            proposal_id: 1,
            title: "TitoloTesi",
            type: "compilativa",
            description: "description",
            required_knowledge: "required knowledge",
            notes: "notes",
            level: "Bachelor",
            creation_date: creationDate,
            expiration: "2025-11-10T23:59:59.999Z",
        }

        // Mock the thesis DAO methods
        service.listApplicationsForTeacherThesisProposal.mockRejectedValue(new Error('Database Error'));

        // Make the request to your API
        const response = await request(app)
            .put(`/api/thesis-proposals/1`)
            .set('Cookie', cookies) // Add authorization header if needed
            .send(mockBody);

        // Assert the response
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});

describe('POST /api/student/applications', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    test('applies for a thesis proposal and returns 201', async () => {
        const mockUser = {
            id: 's1',
            surname: 'R',
            name: 'M',
            gender: 'MALE',
            nationality: 'Italian',
            email: 'r.m@email.com',
            cod_degree: 'L-31',
            enrollment_year: '2018',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 's1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        const mockRequestBody = {
            thesis_proposal_id: 1,
        };

        const mockApplicationId = 1;

        service.applyForProposal.mockResolvedValueOnce(mockApplicationId);

        const response = await request(app)
            .post('/api/student/applications')
            .set('Cookie', loginResponse.headers['set-cookie'])
            .send(mockRequestBody);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            thesis_proposal_id: mockRequestBody.thesis_proposal_id,
            student_id: mockUser.id,
            status: 'waiting for approval',
        });

        expect(service.applyForProposal).toHaveBeenCalledWith(
            mockRequestBody.thesis_proposal_id,
            mockUser.id
        );
    });
    test('applies for a thesis proposal not logged as a student', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            gender: 'MALE',
            nationality: 'Italian',
            email: 'r.m@email.com',
            cod_degree: 'L-31',
            enrollment_year: '2018',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);
        const mockRequestBody = {
            thesis_proposal_id: 1,
        };

        const mockApplicationId = 1;

        service.applyForProposal.mockResolvedValueOnce(mockApplicationId);

        const response = await request(app)
            .post('/api/student/applications')
            .set('Cookie', loginResponse.headers['set-cookie'])
            .send(mockRequestBody);

        expect(response.status).toBe(403);
        expect(response.body).toEqual('Unauthorized');
    });
    test('handles errors and returns 500 status', async () => {
        const mockUser = {
            id: 's1',
            surname: 'R',
            name: 'M',
            gender: 'MALE',
            nationality: 'Italian',
            email: 'r.m@email.com',
            cod_degree: 'L-31',
            enrollment_year: '2018',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 's1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        const mockRequestBody = {
            thesis_proposal_id: 1,
        };

        const mockError = new Error('Mocked error during application');

        service.applyForProposal.mockRejectedValueOnce(mockError);


        const response = await request(app)
            .post('/api/student/applications')
            .set('Cookie', loginResponse.headers['set-cookie'])
            .send(mockRequestBody);

        expect(response.status).toBe(500);
        expect(response.body).toEqual(`Failed to apply for proposal. ${mockError.message || mockError}`);
        expect(service.applyForProposal).toHaveBeenCalledWith(
            mockRequestBody.thesis_proposal_id,
            mockUser.id
        );
    });
});

describe('GET /api/teacher/applications/:proposal_id', () => {
    test('should return an array of applications for a teacher and proposal', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];

        // Mock the response from thesisDao.listThesisApplicationsForTeacherThesisProposal
        const mockApplications = [
            { status: 'Approved', name: 'M', surname: 'R', student_id: 's1' },
            { status: 'Pending', name: 'W', surname: 'X', student_id: 's2' }
        ];

        // Mock the function call
        service.listApplicationsForTeacherThesisProposal.mockResolvedValueOnce(mockApplications);

        // Send a request to the endpoint
        const response = await request(app)
                               .get('/api/teacher/applications/1')
                               .set('Cookie', cookies);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockApplications);
    });
    test('should handle errors and return 500', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];

        // Mock an error in thesisDao.getAllKeywords
        const mockError = new Error('Mocked error during getAllKeywords');
        service.listApplicationsForTeacherThesisProposal.mockRejectedValueOnce(mockError);

        // Send a request to the endpoint
        const response = await request(app)
                               .get('/api/teacher/applications/1')
                               .set('Cookie', cookies);

        // Assertions
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
        expect(service.listApplicationsForTeacherThesisProposal).toHaveBeenCalled();
    });
});

describe('GET /api/student/active-application', () => {
    test('should return student active application', async () => {
        const mockUser = {
            id: 's1',
            surname: 'R',
            name: 'M',
            gender: 'MALE',
            nationality: 'Italian',
            email: 'r.m@email.com',
            cod_degree: 'L-31',
            enrollment_year: '2018',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 's1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];

        const expectedApplication = [{proposal_id: 1}]
        service.getStudentActiveApplication.mockResolvedValueOnce(expectedApplication);
        // Perform the request
        const response = await request(app)
                               .get('/api/student/active-application')
                               .set('Cookie', cookies);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedApplication);
    });

    test('should return 500 if an error occurs', async () => {

        const mockUser = {
            id: 's1',
            surname: 'R',
            name: 'M',
            gender: 'MALE',
            nationality: 'Italian',
            email: 'r.m@email.com',
            cod_degree: 'L-31',
            enrollment_year: '2018',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 's1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];

        const mockError = new Error('Mocked error during getStudentApplications');
        service.getStudentActiveApplication.mockRejectedValueOnce(mockError);

        // Perform the request
        const response = await request(app)
                               .get('/api/student/active-application')
                               .set('Cookie', cookies);

        // Assertions
        expect(response.status).toBe(500);
    });
});

describe('PATCH /api/teacher/applications/accept/:proposal_id', () => {

    afterEach(() => {
      jest.restoreAllMocks();
    });
    test('should accept thesis and reject others', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];

        // Arrange
        const proposalId = '1';
        const studentId = 's293605';

        // Mock thesisDao functions
        service.updateApplicationStatus.mockResolvedValue(1); // Mock the row count
        service.rejectOtherApplications.mockResolvedValue(2); // Mock the row count

        // Act
        const response = await request(app)
          .patch(`/api/teacher/applications/accept/${proposalId}`)
          .send({ student_id: studentId })
          .set('Cookie', cookies)
          .expect(200);

        // Assert
        expect(response.body).toEqual({ message: 'Thesis accepted and others rejected successfully' });
    });
    test('should return 400 error if is missing student_id', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];

        // Arrange
        const proposalId = '1';
        const studentId = 's293605';

        // Mock thesisDao functions
        service.updateApplicationStatus.mockResolvedValue(1); // Mock the row count
        service.rejectOtherApplications.mockResolvedValue(2); // Mock the row count

        // Act
        const response = await request(app)
          .patch(`/api/teacher/applications/accept/${proposalId}`)
          .set('Cookie', cookies)

        // Assert
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Missing required fields.' });
    });
    test('should handle errors and return status 500', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];

        // Arrange
        const proposalId = '1';
        const studentId = 's293605';

        // Mock thesisDao functions
        const mockError = new Error('Internal Server Error');
        service.updateApplicationStatus.mockRejectedValue(mockError); // Mock the row count
        service.rejectOtherApplications.mockResolvedValue(2); // Mock the row count

        // Act
        const response = await request(app)
          .patch(`/api/teacher/applications/accept/${proposalId}`)
          .set('Cookie', cookies)
          .send({ student_id: studentId })

        // Assert
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});

describe('PATCH /api/teacher/applications/reject/:proposal_id', () => {
    test('should reject thesis', async () => {
      const mockUser = {
          id: 'd1',
          surname: 'R',
          name: 'M',
          email: 'r.m@email.com',
          cod_group: 'Group1',
          cod_department: 'Dep1',
      };

      usersService.getUser.mockResolvedValue(mockUser);

      const loginResponse = await request(app)
          .post('/api/sessions')
          .send({ username: 'r.m@email.com', password: 'd1' })
          .set('Accept', 'application/json');

      const cookies = loginResponse.headers['set-cookie'];

      // Arrange
      const proposalId = '1';
      const studentId = 's293605';

      // Mock thesisDao function
      service.updateApplicationStatus.mockResolvedValue(1); // Mock the row count

      // Act
      const response = await request(app)
        .patch(`/api/teacher/applications/reject/${proposalId}`)
        .send({ student_id: studentId })
        .set('Cookie', cookies)
        .expect(200);

      // Assert
      expect(response.body).toEqual({ message: 'Thesis successfully rejected' });
    });
    test('should return 400 error if is missing student_id', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];

        // Arrange
        const proposalId = '1';
        const studentId = 's293605';

        // Mock thesisDao functions
        service.updateApplicationStatus.mockResolvedValue(1); // Mock the row count
        service.rejectOtherApplications.mockResolvedValue(2); // Mock the row count

        // Act
        const response = await request(app)
          .patch(`/api/teacher/applications/reject/${proposalId}`)
          .set('Cookie', cookies)

        // Assert
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Missing required fields.' });
    });
    test('should handle errors and return status 500', async () => {
        const mockUser = {
            id: 'd1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };

        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 'd1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];

        // Arrange
        const proposalId = '1';
        const studentId = 's293605';

        // Mock thesisDao functions
        const mockError = new Error('Internal Server Error');
        service.updateApplicationStatus.mockRejectedValue(mockError); // Mock the row count
        service.rejectOtherApplications.mockResolvedValue(2); // Mock the row count

        // Act
        const response = await request(app)
          .patch(`/api/teacher/applications/reject/${proposalId}`)
          .set('Cookie', cookies)
          .send({ student_id: studentId })

        // Assert
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});

describe('GET /api/student/applications-decision', () => {
    test('should return a list of applications for the student', async () => {

        const mockUser = {
            id: 's1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 's1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        // Mock the response data that you expect from your database
        const mockApplications = [
            {
                application_id: 10,
                proposal_id: 1,
                title: 'Sample Proposal',
                level: 'Master',
                teacher_name: 'John',
                teacher_surname: 'Doe',
                status: 'Accepted',
                expiration: '2023-12-01T23:59:59.999Z',
            },
            // Add more mock data as needed
        ];

        service.listApplicationsDecisionsFromStudent.mockResolvedValue(mockApplications);

        // Make the request to your API
        const response = await request(app)
            .get('/api/student/applications-decision')
            .set('Accept', 'application/json')
            .set('Cookie', cookies)
            .send();

        // Assert the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockApplications);
    });

    test('should handle errors and return 500 status', async () => {

        const mockUser = {
            id: 's1',
            surname: 'R',
            name: 'M',
            email: 'r.m@email.com',
            cod_group: 'Group1',
            cod_department: 'Dep1',
        };
        usersService.getUser.mockResolvedValue(mockUser);

        const loginResponse = await request(app)
            .post('/api/sessions')
            .send({ username: 'r.m@email.com', password: 's1' })
            .set('Accept', 'application/json');

        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(loginResponse.status).toBe(201);

        service.listApplicationsDecisionsFromStudent.mockRejectedValueOnce(new Error('Database error'));

        // Make the request to your API
        const response = await request(app)
            .get('/api/student/applications-decision')
            .set('Accept', 'application/json')
            .set('Cookie', cookies)
            .send();

        // Assert the response
        expect(response.status).toBe(500);
        expect(response.body).toEqual('Internal Server Error');
    });
});

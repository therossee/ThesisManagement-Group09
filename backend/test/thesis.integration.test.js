require('jest');
request = require("supertest");
const service = require("../thesis_dao");
const degreeService = require("../degree_dao");
const usersService = require("../users_dao");
const {app, server} = require("../index");

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
    getAllKeywords: jest.fn()
}));

jest.mock('../users_dao', () => ({
    getUser: jest.fn(),
}));

jest.mock('../degree_dao', () => ({
    getDegreeFromCode: jest.fn(),
}));

afterAll((done) => {
    jest.resetAllMocks();
    server.close(done);
});

// TEST GET api/teachers
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
      expect(response.text).toEqual("\"Internal Server Error\"");
    });
});

// TEST GET api/externalCoSupervisors
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
      expect(response.text).toEqual("\"Internal Server Error\"");
    });
});

// TEST POST api/teacher/thesis_proposals
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
            expiration: '2023-12-31',
            level: 'Bachelor',
            cds: 'Test CDS',
            groups: [
                { cod_group: 'Group1' },
                { cod_group: 'Group2' },
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
        expect(response.text).toEqual("\"Missing required fields.\"");
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
        expect(response.text).toEqual("\"Unauthorized\"");
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
        expect(response.text).toEqual("\"Not authorized\"");
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

// TEST GET api/keywords
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

describe('GET /api/thesis_proposals', () => {
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
                cds: 'Test CDS',
                supervisor_id: 'd1',
                type: 'Bachelor',
                required_knowledge: 'Test knowledge',
                notes: 'Test notes'
            }
        ];
        service.listThesisProposalsFromStudent.mockResolvedValue(mockThesisProposal);

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
                        code: mockThesisProposal[0].cds,
                        title: mockDegree.title_degree
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
                cds: 'Test CDS',
                supervisor_id: 'd1',
                type: 'Bachelor',
                required_knowledge: 'Test knowledge',
                notes: 'Test notes'
            }
        ];
        service.listThesisProposalsFromStudent.mockResolvedValue(mockThesisProposal);

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
                    status: 'ACTIVE',
                    title: 'Test Thesis',
                    description: 'Test description',
                    expiration: '2051-12-31',
                    level: 'Bachelor',
                    cds: {
                        code: mockThesisProposal[0].cds,
                        title: mockDegree.title_degree
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

        const response = await request(app)
            .get('/api/thesis-proposals')
            .set('Accept', 'application/json')
            .set('Cookie', loginResponse.headers['set-cookie'])
            .send();

        expect(response.status).toBe(403);
        expect(response.text).toEqual("\"Unauthorized\"");
    });
    test('should return error 401 if not logged in', async () => {
        const response = await request(app)
            .get('/api/thesis-proposals')
            .set('Accept', 'application/json')
            .send();

        expect(response.status).toBe(401);
        expect(response.text).toEqual("\"Not authorized\"");
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

describe('GET /api/thesis_proposals/:id', () => {
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
            cds: 'Test CDS',
            supervisor_id: 'd1',
            type: 'Bachelor',
            required_knowledge: 'Test knowledge',
            notes: 'Test notes'
        };
        service.getThesisProposal.mockResolvedValue(mockThesisProposal);

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
            title_degree: 'Ingegneria Informatica',
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
                code: mockThesisProposal.cds,
                title: mockDegree.title_degree
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

        const response = await request(app)
            .get('/api/thesis-proposals/1')
            .set('Accept', 'application/json')
            .set('Cookie', loginResponse.headers['set-cookie'])
            .send();

        expect(response.status).toBe(403);
        expect(response.text).toEqual("\"Unauthorized\"");
    });
    test('should return error 401 if not logged in', async () => {
        const response = await request(app)
            .get('/api/thesis-proposals/1')
            .set('Accept', 'application/json')
            .send();

        expect(response.status).toBe(401);
        expect(response.text).toEqual("\"Not authorized\"");
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

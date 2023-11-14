require('jest');
request = require("supertest");
const service = require("../thesis_dao");
const usersService = require("../users_dao");
const {app, server} = require("../index");
  
// Mocking the getTeacherListExcept function
jest.mock('../thesis_dao', () => ({
    getTeacherListExcept: jest.fn(),
    getExternalCoSupervisorList: jest.fn(),
    getGroup: jest.fn(),
    createThesisProposal: jest.fn(),
    applyForProposal: jest.fn(),
}));

jest.mock('../users_dao', () => ({
    getUser: jest.fn(),
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
            .set('Cookie', loginResponse.headers['set-cookie']);

        // Verify that the response contains the expected data
        expect(response.body.teachers).toEqual([
            { id: 'd2', name: 'Teacher2' },
            { id: 'd3', name: 'Teacher3' },
        ]);

        // Verify that getTeacherListExcept was called with the correct arguments
        expect(service.getTeacherListExcept).toHaveBeenCalledWith(mockUser.id);
    });
    test('handles internal server error', async () => {
    
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
            .set('Cookie', loginResponse.headers['set-cookie'])
            .expect(500);

    
    expect(response.status).toBe(500);
    expect(response.body).toEqual("Internal Server Error");
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
            .set('Cookie', loginResponse.headers['set-cookie']);

        // Verify that the response contains the expected data
        expect(response.body.externalCoSupervisors).toEqual([
            { id: '1', name: 'ExternalCoSupervisor1' },
            { id: '2', name: 'ExternalCoSupervisor2' },
        ]);
    });
    test('handles internal server error', async () => {
    
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
            .set('Cookie', loginResponse.headers['set-cookie'])
            .expect(500);

    
    expect(response.status).toBe(500);
    expect(response.body).toEqual("Internal Server Error");
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
            .set('Cookie', loginResponse.headers['set-cookie'])
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
            expiration: '2023-12-31',
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
            .set('Cookie', loginResponse.headers['set-cookie'])
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
            .set('Cookie', loginResponse.headers['set-cookie'])
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
        .set('Cookie', loginResponse.headers['set-cookie'])
        .send(requestBody);
    
        // Expecting a 500 status code
        expect(response.status).toBe(500);
    
    });
});

// TEST GET api/thesis_proposals

// TEST POST api/student/applications
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
        expect(response.body).toEqual(`Failed to apply for thesis proposal. ${mockError.message || mockError}`);
        expect(service.applyForProposal).toHaveBeenCalledWith(
            mockRequestBody.thesis_proposal_id,
            mockUser.id
        );
    });
});

// TEST GET api/teacher/:id/applications

// TEST PATCH api/teacher/:id/applications/:id

// TEST PATCH api/teacher/:id/applications/:id

// TEST GET api/student/:id/applications

// TEST GET api/teacher/:id/thesis_proposals

// TEST PATCH api/teacher/:id/thesis_proposals/:id


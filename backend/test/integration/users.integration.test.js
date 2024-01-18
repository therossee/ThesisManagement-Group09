require('jest');
// [i] This line setup the test database + load the environment variables. DON'T (RE)MOVE IT
const {resetTestDatabase} = require('../integration_config');

const request = require("supertest");
const {app} = require("../../src/app");
const utils = require("../utils");
const CronTasksService = require("../../src/services/CronTasksService");

beforeEach(() => {
    // Be sure that we are using a full clean database before each test
    resetTestDatabase();
});

let agent;
beforeAll(async () => {
    agent = await utils.getMolinattoSylvieAgent(app);
});

afterAll(async () => {
    CronTasksService.stop();
    resetTestDatabase();
});

describe('GET /users', () => {
    test('should return user information with valid authentication', async () => {
        // Make a request to the endpoint
        const response = await agent
            .get('/api/user')
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual({id: 's318952', name: 'Sylvie Molinatto', roles: ['student']});
    });

    test('should return 401 error with invalid authentication', async () => {
        // Make a request to the endpoint
        const response = await request(app)
            .get('/api/user')
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(401);
        expect(response.body).toBe('Unauthorized');
    });
});

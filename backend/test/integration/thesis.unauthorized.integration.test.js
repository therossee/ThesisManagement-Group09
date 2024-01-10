require('jest');
// [i] This line setup the test database + load the environment variables. DON'T (RE)MOVE IT
const {resetTestDatabase, closeImapClient} = require('../integration_config');

const {app} = require("../../src/app");
const utils = require("../utils");
const CronTasksService = require("../../src/services/CronTasksService");

beforeEach(() => {
    // Be sure that we are using a full clean database before each test
    resetTestDatabase();
    jest.restoreAllMocks();
});
let agent;
beforeAll(async () => {
    agent = await utils.getMolinattoSylvieAgent(app, false);
});

afterAll(async () => {
    CronTasksService.stop();
});

describe('Unauthorized user', () => {

    test('GET /api/thesis-proposals', async () => {
        const response = await agent.get('/api/thesis-proposals');
        expect(response.statusCode).toBe(403);
    });
    test('GET /api/thesis-proposals/:id', async () => {
        const response = await agent.get('/api/thesis-proposals/:id');
        expect(response.statusCode).toBe(403);
    });
    test('GET /api/teachers', async () => {
        const response = await agent.get('/api/teachers');
        expect(response.statusCode).toBe(403);
    });
    test('GET /api/student/active-application', async () => {
        const response = await agent.get('/api/student/active-application');
        expect(response.statusCode).toBe(403);
    });
    test('POST /api/system/virtual-clock', async () => {
        const response = await agent.post('/api/system/virtual-clock');
        expect(response.statusCode).toBe(403);
    })

});

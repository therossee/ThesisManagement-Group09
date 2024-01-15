require('jest');
// [i] This line setup the test database + load the environment variables. DON'T (RE)MOVE IT
const { initImapClient, closeImapClient, resetTestDatabase} = require('../integration_config');
const request = require("supertest");
const {app} = require("../../src/app");
const utils = require("../utils");
const CronTasksService = require("../../src/services/CronTasksService");

let agent;
beforeAll(async () => {
    resetTestDatabase();
    await initImapClient();
    agent = await utils.getFakeAgent(app);
});

afterAll(async () => {
    await closeImapClient();
    resetTestDatabase();
    CronTasksService.stop();
});

describe("isStudent", () => {
    test('should return 403 if try to access to a route reserved to students without being a student', async () => {
       
        const response = await agent
            .get('/api/student/thesis-start-requests/last')
            .set('Accept', 'application/json')
            .set('credentials', 'include');
        
        expect(response.status).toBe(403);
        expect(response.body).toBe("Unauthorized");
    });
});

describe("isTeacher", () => {
    test('should return 403 if try to access to a route reserved to teachers without being a teacher', async () => {
        const response = await agent
            .get('/api/teacher/applications/1')
            .set('Accept', 'application/json')
            .set('credentials', 'include');
        
        expect(response.status).toBe(403);
        expect(response.body).toBe("Unauthorized");
    });
});

describe("isTester", () => {
    test('should return 403 if try to access to a route reserved to testers without being a tester', async () => {
        const response = await agent
            .post('/api/system/virtual-clock')
            .set('Accept', 'application/json')
            .set('credentials', 'include');
        
        expect(response.status).toBe(403);
        expect(response.body).toBe("Unauthorized");
    });
});

describe("isSecretaryClerk", () => {
    test('should return 403 if try to access to a route reserved to secretary clerk without being a secreteray clerk', async () => {
        const response = await agent
            .get('/api/secretary-clerk/thesis-start-requests')
            .set('Accept', 'application/json')
            .set('credentials', 'include');
        
        expect(response.status).toBe(403);
        expect(response.body).toBe("Unauthorized");
    });
})

describe("isTeacherOrStudent", () => {
    test('should return 403 if try to access to a route reserved to teachers or students without being a teacher or a student', async () => {
        const response = await agent
            .get('/api/student/thesis-start-requests/last')
            .set('Accept', 'application/json')
            .set('credentials', 'include');
        
        expect(response.status).toBe(403);
        expect(response.body).toBe("Unauthorized");
    });
});
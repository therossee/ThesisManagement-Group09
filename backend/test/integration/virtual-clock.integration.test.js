require('jest');
// [i] This line setup the test database + load the environment variables. DON'T (RE)MOVE IT
const { resetTestDatabase } = require('../integration_config');

const dayjs = require('dayjs');
const request = require("supertest");
const db = require("../../src/services/db");
const { app } = require("../../src/app");
const utils = require("../utils");
const AdvancedDate = require("../../src/models/AdvancedDate");
const { APPLICATION_STATUS } = require("../../src/enums/application");
const CronTasksService = require("../../src/services/CronTasksService");

let testerAgent, nonTesterAgent;
beforeAll(async () => {
    [testerAgent, nonTesterAgent] = await Promise.all([
        utils.getMarcoRossiAgent(app),
        utils.getMolinattoSylvieAgent(app),
    ]);
});

afterAll(() => {
    CronTasksService.stop();
});

describe('[INTEGRATION] Virtual Clock APIs', () => {
    beforeEach(() => {
        // Be sure that we are using a full clean database before each test
        resetTestDatabase();
    });

    describe('GET - /api/system/virtual-clock', () => {
        test('should return the current virtual time', async () => {
            const res = await request(app)
                .get('/api/system/virtual-clock')
                .send();

            expect(res.status).toBe(200);

            // [i] The values are from the initialisation of the database, so we know what to expect
            const body = res.body;
            expect(body).toHaveProperty('date');
            expect(body.offset).toBe(0);
        });

        test('should return the updated virtual time', async () => {
            const newOffset = 50_000;
            AdvancedDate.virtual.setNewOffset(newOffset);

            const res = await request(app)
                .get('/api/system/virtual-clock')
                .send();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('date');
            expect(res.body.offset).toBeAnIntegerCloseTo(newOffset, 100);
        });
    });

    describe('POST - /api/system/virtual-clock', () => {
        test('should update the virtual clock', async () => {
            const newOffset = 50_000;
            const date = dayjs().add(newOffset, 'ms').toISOString();

            const res = await testerAgent.post('/api/system/virtual-clock')
                .set('Content-Type', 'application/json')
                .set('credentials', 'include')
                .send({newDate: date});

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('date');
            expect(res.body.offset).toBeAnIntegerCloseTo(newOffset, 100);
        });

        test('should update the virtual clock without newDate', async () => {
            const newOffset = 0;
            const date = dayjs().add(newOffset, 'ms').toISOString();

            const res = await testerAgent.post('/api/system/virtual-clock')
                .set('Content-Type', 'application/json')
                .set('credentials', 'include')
                .send();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('date');
            expect(res.body.offset).toBeAnIntegerCloseTo(newOffset, 100);
        });

        test('should update the virtual clock and cancel all waiting applications', async () => {
            db.prepare('INSERT INTO thesisApplication (student_id, proposal_id, creation_date, status) VALUES (?, ?, ?, ?)')
                .run('s321529', 1, new Date().toISOString(), 'waiting for approval');

            const query = db.prepare('SELECT * FROM thesisApplication');
            const applicationsBefore = query.all();

            // Set a high offset to be sure that all the thesis will expire
            const newOffset = 50_000_000_000;
            const date = dayjs().add(newOffset, 'ms').toISOString();

            const res = await testerAgent.post('/api/system/virtual-clock')
                .set('Content-Type', 'application/json')
                .set('credentials', 'include')
                .send({newDate: date});

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('date');
            expect(res.body.offset).toBeAnIntegerCloseTo(newOffset, 100);

            // Now check that all the waiting applications have been cancelled
            const applications = query.all();
            for (const application of applications) {
                const before = applicationsBefore.find( a => a.id === application.id );

                if (application.status === APPLICATION_STATUS.CANCELLED) {
                    if (before.status === APPLICATION_STATUS.WAITING_FOR_APPROVAL) {
                        expect(application.status).toBe(APPLICATION_STATUS.CANCELLED);
                    } else {
                        expect(application.status).toBe(before.status);
                    }
                } else {
                    expect(application.status).toBe(before.status);
                }
            }
        });

        test('should refuse to set the virtual clock in the past', async () => {
            /** Prepare the test */
            const offsetInFuture = 100_000;
            AdvancedDate.virtual.setNewOffset(offsetInFuture);

            /** Perform the test */
            const offsetInVirtualPast = offsetInFuture - 2000;
            const date = dayjs().add(offsetInVirtualPast, 'ms').toISOString();

            const res = await testerAgent.post('/api/system/virtual-clock')
                .set('Content-Type', 'application/json')
                .set('credentials', 'include')
                .send({newDate: date});

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
        });

        test('should return 400 if the newDate property isn\'t a string', async () => {
            const res = await testerAgent.post('/api/system/virtual-clock')
                .set('Content-Type', 'application/json')
                .set('credentials', 'include')
                .send({newDate: 1000});

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 400 if the newDate property isn\'t a valid date', async () => {
            const res = await testerAgent.post('/api/system/virtual-clock')
                .set('Content-Type', 'application/json')
                .set('credentials', 'include')
                .send({newDate: 'invalid date'});

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 403 if the user is not a tester', async () => {
            const res = await nonTesterAgent.post('/api/system/virtual-clock')
                .set('Content-Type', 'application/json')
                .set('credentials', 'include')
                .send({newDate: 'invalid date'});

            expect(res.status).toBe(403);
            expect(res.body).toEqual('Unauthorized');
        });
    });
});


require('jest');
// [i] This line setup the test database + load the environment variables. DON'T (RE)MOVE IT
const { resetTestDatabase } = require('./integration_config');

const dayjs = require('dayjs');
const request = require("supertest");
const { app } = require("../app");
const AdvancedDate = require("../AdvancedDate");

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
            const newOffset = 1000;
            AdvancedDate.virtual.setNewOffset(newOffset);

            const res = await request(app)
                .get('/api/system/virtual-clock')
                .send();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('date');
            expect(res.body.offset).toBeAnIntegerCloseTo(newOffset, 30);
        });
    });

    describe('POST - /api/system/virtual-clock', () => {
        // TODO: Add tests on authentication (tester vs non-tester)

        test('should update the virtual time', async () => {
            const newOffset = 1000;
            const date = dayjs().add(newOffset, 'ms').toISOString();

            const res = await request(app)
                .post('/api/system/virtual-clock')
                .send({ newDate: date });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('date');
            expect(res.body.offset).toBeAnIntegerCloseTo(newOffset, 30);
        });

        test('should refuse to set the virtual clock in the past', async () => {
            /** Prepare the test */
            const offsetInFuture = 100_000;
            AdvancedDate.virtual.setNewOffset(offsetInFuture);

            /** Perform the test */
            const offsetInVirtualPast = offsetInFuture - 2000;
            const date = dayjs().add(offsetInVirtualPast, 'ms').toISOString();

            const res = await request(app)
                .post('/api/system/virtual-clock')
                .send({ newDate: date });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
        });

        test('should return 400 if the newDate property isn\'t a string', async () => {
            const res = await request(app).post('/api/system/virtual-clock').send({ newDate: 1000 });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 400 if the newDate property isn\'t a valid date', async () => {
            const res = await request(app).post('/api/system/virtual-clock').send({ newDate: 'invalid date' });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('errors');
        });
    });
});

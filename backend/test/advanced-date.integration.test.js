require('jest');

const dayjs = require('dayjs');
const {app, server} = require("../index");
const AdvancedDate = require("../AdvancedDate");
const request = require("supertest");

describe('Integration of AdvancedDate class in APIs', () => {
    let initialOffset;

    beforeAll((done) => {
        initialOffset = AdvancedDate.virtual.offsetMs;
        server.close(done);
    });
    afterEach(() => {
        AdvancedDate.virtual.setNewOffset(initialOffset);
    });

    describe('GET - /api/system/virtual-clock', () => {
        test('should return the current virtual time', async () => {
            const res = await request(app).get('/api/system/virtual-clock');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('date');
            expect(res.body.offset).toBe(initialOffset);
        });

        test('should return the updated virtual time', async () => {
            const newOffset = initialOffset + 1000;
            AdvancedDate.virtual.setNewOffset(newOffset);

            const res = await request(app).get('/api/system/virtual-clock').send();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('date');
            // Check offset with a tolerance of 50 milliseconds
            expect(res.body.offset).toBeGreaterThanOrEqual(newOffset - 50);
            expect(res.body.offset).toBeLessThanOrEqual(newOffset);
        });
    });

    describe('POST - /api/system/virtual-clock', () => {
        test('should update the virtual time', async () => {
            const newOffset = initialOffset + 1000;
            const date = dayjs().add(newOffset, 'ms').toISOString();

            const res = await request(app).post('/api/system/virtual-clock').send({ newDate: date });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('date');
            // Check offset with a tolerance of 50 milliseconds
            expect(res.body.offset).toBeGreaterThanOrEqual(newOffset - 50);
            expect(res.body.offset).toBeLessThanOrEqual(newOffset);
        });

        test('should reset the virtual time', async () => {
            AdvancedDate.virtual.setNewOffset(1000);
            const res = await request(app).post('/api/system/virtual-clock').send();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('date');
            expect(res.body.offset).toBe(0);
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

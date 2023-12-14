require('jest');

const db = require('../../db');
const configuration = require('../../configuration_dao');

jest.mock('../../db', () => ({
    prepare: jest.fn(),
    get: jest.fn(),
    run: jest.fn()
}));

describe('Configuration DAO', () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });
    beforeEach(() => {
        db.prepare.mockReturnThis();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe('getIntegerValue', () => {
        test('should return the value from the database', () => {
            const key = 'key';
            const value = '123';
            const expected = 123;
            db.prepare().get.mockReturnValueOnce({ value });

            const result = configuration.getIntegerValue(key);

            expect(result).toBe(expected);
            expect(db.prepare).toHaveBeenCalledWith(expect.any(String));
            expect(db.prepare().get).toHaveBeenCalledWith(key);
        });

        test('should return null if the key is not found', async () => {
            const key = 'key';
            db.prepare().get.mockReturnValueOnce(undefined);

            const result = await configuration.getIntegerValue(key);

            expect(result).toBeNull();
            expect(db.prepare).toHaveBeenCalledWith(expect.any(String));
            expect(db.prepare().get).toHaveBeenCalledWith(key);
        });
    });

    describe('setValue', () => {
        test('should insert the value into the database', () => {
            const key = 'key';
            const value = 'value';
            const sql = 'INSERT OR REPLACE INTO configuration (value, key) VALUES (?, ?)';

            configuration.setValue(key, value);

            expect(db.prepare).toHaveBeenCalledWith(sql);
            expect(db.prepare().run).toHaveBeenCalledWith(value, key);
        });
    });
});

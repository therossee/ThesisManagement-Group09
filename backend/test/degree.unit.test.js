require('jest');

const db = require('../db');
const degree = require('../degree_dao');

jest.mock('../db', () => ({
    prepare: jest.fn().mockReturnThis(),
    run: jest.fn().mockReturnValue({ lastInsertRowid: 1 }),
    all: jest.fn(),
    get: jest.fn(),
    transaction: jest.fn().mockImplementation(callback => callback()),
}));

describe('Degree DAO', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('getDegreeFromCode', () => {
        test('should return the degree row with the given code', async () => {
            const code = 'L-31';
            const expected = {
                cod_degree: code,
                title_degree: 'Ingegneria Informatica',
            };
            db.prepare().get.mockReturnValue(expected);

            const actual = await degree.getDegreeFromCode(code);
            expect(actual).toEqual(expected);
            expect(db.prepare).toHaveBeenCalledWith(expect.any(String));
            expect(db.prepare().get).toHaveBeenCalledTimes(1);
            expect(db.prepare().get).toHaveBeenCalledWith(code);
        });

        test('should return null if the degree does not exist', async () => {
            const code = 'L-31';
            db.prepare().get.mockReturnValue(undefined);

            const actual = await degree.getDegreeFromCode(code);
            expect(actual).toBeNull();
            expect(db.prepare).toHaveBeenCalledWith(expect.any(String));
            expect(db.prepare().get).toHaveBeenCalledTimes(1);
            expect(db.prepare().get).toHaveBeenCalledWith(code);
        });
    });
});

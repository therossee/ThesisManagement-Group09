require('jest');

const db = require('../../src/services/db');
const users = require('../../src/dao/users_dao');
const { USER_ROLES } = require('../../src/enums/user');


// Mocking the database
jest.mock('../../src/services/db', () => ({
    prepare: jest.fn().mockReturnThis(),
    get: jest.fn(),
    all: jest.fn(),
}));

describe('getStudentDegree', () => {
    test('returns student degree for a valid student ID', async () => {
        // Mock the necessary data for a valid student ID
        const validStudentId = 'Mock id';
        const mockDegree = {
            cod_degree: 'Mock cod_degree',
            title_degree: 'Mock title_degree',
        };
        db.prepare().get.mockReturnValueOnce(mockDegree);
        // Call the function and assert the result
        const result = await users.getStudentDegree(validStudentId);
        expect(result).toEqual(mockDegree);
    });

    // Test case for an invalid student ID
    test('returns null for an invalid student ID', async () => {
        // Mock the necessary data for an invalid student ID
        const invalidStudentId = 'Invalid id';

        // Call the function and assert the result
        const result = await users.getStudentDegree(invalidStudentId);
        expect(result).toBeNull();
    });
});

describe('getStudentById', () => {
    test('returns student info for a valid student ID', async () => {
        const validStudentId = 's1';
        const studentData = {
            id: 's1',
            surname: 'StudentSurname',
            name: 'StudentName',
            email: 'student@example.com',
        };

        // Mock the db.prepare.get function to return student info
        db.prepare().get.mockReturnValueOnce(studentData);

        // Call the function and assert the result
        const result = await users.getStudentById(validStudentId);

        // Check if the db.prepare.get function was called with the correct arguments
        expect(db.prepare().get).toHaveBeenCalledWith(validStudentId);

        // Check if the function resolves with the expected student info
        expect(result).toEqual(studentData);
    });

    test('returns null for an invalid student ID', async () => {

        const invalidStudentId = '1'/* invalid student ID */;

        // Mock the db.prepare.get function to return null
        db.prepare().get.mockReturnValueOnce(null);

        // Call the function and assert the result
        const result = await users.getStudentById(invalidStudentId);

        // Check if the db.prepare.get function was called with the correct arguments
        expect(db.prepare().get).toHaveBeenCalledWith(invalidStudentId);

        // Check if the function resolves with null
        expect(result).toBeNull();
    });
});

describe('getStudentCareer', () => {
    test('returns career information for a valid student ID with data', async () => {
        const validStudentId = 's12345';
        const careerData = [
            {cod_course: '1', title_course: 'Course1', cfu: 6, grade: 30, date: '2022-01-01'},
            {cod_course: '2', title_course: 'Course2', cfu: 6, grade: 28, date: '2022-02-01'},
        ];

        db.prepare().all.mockReturnValueOnce(careerData);

        const result = await users.getStudentCareer(validStudentId);

        expect(db.prepare().all).toHaveBeenCalledWith(validStudentId);
        expect(result).toEqual(careerData);
    });

    test('returns empty array for a valid student ID with no career data', async () => {

        const validStudentId = 's12345';

        db.prepare().all.mockReturnValueOnce([]);

        const result = await users.getStudentCareer(validStudentId);

        // Check if the db.prepare.all function was called with the correct arguments
        expect(db.prepare().all).toHaveBeenCalledWith(validStudentId);

        // Check if the function resolves with null
        expect(result).toEqual([]);
    });

    test('returns null for an invalid student ID', async () => {
        const invalidStudentId = 'd1';

        const result = await users.getStudentCareer(invalidStudentId);

        expect(db.prepare().all).toHaveBeenCalledWith(invalidStudentId);

        expect(result).toBeUndefined();
    });

});

describe('getTeacherById', () => {
    test('returns teacher info for a valid teacher ID', async () => {
        const validTeacherId = 't1';
        const teacherData = {
            id: 't1',
            surname: 'TeacherSurname',
            name: 'TeacherName',
            email: 't1@polito.it',
            cod_group: 'Group1',
            cod_department: 'Department1',
        };

        // Mock the db.prepare.get function to return teacher info
        db.prepare().get.mockReturnValueOnce(teacherData);

        // Call the function and assert the result
        const result = await users.getTeacherById(validTeacherId);

        // Check if the db.prepare.get function was called with the correct arguments
        expect(db.prepare().get).toHaveBeenCalledWith(validTeacherId);

        // Check if the function resolves with the expected student info
        expect(result).toEqual(teacherData);
      
    });

    test('returns null for an invalid teacher ID', async () => {

        const invalidTeacherId = '1'/* invalid teacher ID */;

        // Mock the db.prepare.get function to return null
        db.prepare().get.mockReturnValueOnce(null);

        // Call the function and assert the result
        const result = await users.getTeacherById(invalidTeacherId);

        // Check if the db.prepare.get function was called with the correct arguments
        expect(db.prepare().get).toHaveBeenCalledWith(invalidTeacherId);

        // Check if the function resolves with null
        expect(result).toBeNull();
    });
});

describe('getGroup', () => {

    test('returns the cod_group for a given teacher ID', async () => {
        const teacherId = 1;
        const expectedCodGroup = 'Group1';

        // Mock the database query result
        db.prepare().get.mockReturnValue({cod_group: expectedCodGroup});

        const result = await users.getGroup(teacherId);

        expect(result).toBe(expectedCodGroup);
        expect(db.prepare().get).toHaveBeenCalledWith(teacherId);
    });
    test('handles errors and rejects the promise if the database query fails', async () => {
        const teacherId = 1;

        // Mock the database query to throw an error
        db.prepare().get.mockImplementation(() => {
            throw new Error('Database query failed');
        });

        await expect(users.getGroup(teacherId)).rejects.toThrow('Database query failed');
        expect(db.prepare().get).toHaveBeenCalledWith(teacherId);
    });
});
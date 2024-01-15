require('jest');

/**
 * This file contains unit tests for the thesis_dao.js file. We are focusing on utility functions related to thesis
 * but not on the actual CRUD operations on the thesis_proposal table.
 *
 * For e.g., we are testing methods to get groups, keywords, etc.
 */

const db = require('../../src/services/db');
const utils = require('../../src/dao/utils_dao');
const thesisProposal = require('../../src/dao/thesis_proposal_dao');

// Mocking the database
jest.mock('../../src/services/db', () => ({
    prepare: jest.fn().mockReturnThis(),
    run: jest.fn().mockReturnValue({lastInsertRowid: 1}),
    all: jest.fn(),
    get: jest.fn(),
    transaction: jest.fn().mockImplementation(callback => callback),
}));

jest.mock('../../src/dao/configuration_dao', () => ({
    getIntegerValue: jest.fn().mockReturnValue(0),
    setValue: jest.fn(),
    KEYS: {
        VIRTUAL_OFFSET_MS: 'virtual_clock_offset'
    }
}));

afterEach(() => {
    jest.restoreAllMocks(); // Restore original functionality after all tests
    jest.clearAllMocks();
});


describe('getTeacherListExcept', () => {
    test('returns a list of teachers excluding the specified ID', async () => {
        const excludedTeacherId = 'd3';
        const mockTeacherData = [
            {id: 'd1', name: 'Teacher1'},
            {id: 'd2', name: 'Teacher2'},
        ];

        // Mock the database query result
        db.prepare().all.mockReturnValue(mockTeacherData);

        const result = await utils.getTeacherListExcept(excludedTeacherId);

        expect(result).toEqual(mockTeacherData.filter(teacher => teacher.id !== excludedTeacherId));
        expect(db.prepare().all).toHaveBeenCalledWith(excludedTeacherId);
    });
    test('handles errors and rejects the promise if the database query fails', async () => {
        const excludedTeacherId = 2;

        // Mock the database query to throw an error
        db.prepare().all.mockImplementation(() => {
            throw new Error('Database query failed');
        });

        await expect(utils.getTeacherListExcept(excludedTeacherId)).rejects.toThrow('Database query failed');
        expect(db.prepare().all).toHaveBeenCalledWith(excludedTeacherId);
    });
});

describe('getExternalCoSupervisors', () => {

    test('returns the list of external co-supervisors', async () => {

        const mockExternalCoSupervisorData = [
            {id: '1', name: 'ExternalCoSupervisor1'},
            {id: '2', name: 'ExternalCoSupervisor2'},
        ];

        // Mock the database query result
        db.prepare().all.mockReturnValue(mockExternalCoSupervisorData);

        const result = await utils.getExternalCoSupervisorList();

        expect(result).toEqual(mockExternalCoSupervisorData);
    });
    test('handles errors and rejects the promise if the database query fails', async () => {

        // Mock the database query to throw an error
        db.prepare().all.mockImplementation(() => {
            throw new Error('Database query failed');
        });

        await expect(utils.getExternalCoSupervisorList()).rejects.toThrow('Database query failed');
    });
});

describe('getAllKeywords', () => {

    test('should return an array of keywords', async () => {
        // Mock the response from the database
        const mockKeywords = [
            {keyword: 'Keyword1'},
            {keyword: 'Keyword2'},
        ];

        // Mock the SQLite database query
        db.prepare.mockReturnValueOnce({all: jest.fn(() => mockKeywords)});

        // Call the function
        const result = await utils.getAllKeywords();

        // Assertions
        expect(result).toEqual(['Keyword1', 'Keyword2']);
        expect(db.prepare).toHaveBeenCalledWith('SELECT DISTINCT(keyword) FROM proposalKeyword');
    });
});

describe('getDegrees', () => {

    test('should return an array of keywords', async () => {
        // Mock the response from the database
        const mockKeywords = [
            {cod_degree: 'L-01'},
            {title_degree: 'Mock Degree Title'},
        ];

        // Mock the SQLite database query
        db.prepare.mockReturnValueOnce({all: jest.fn(() => mockKeywords)});

        // Call the function
        const result = await utils.getDegrees();

        // Assertions
        expect(result).toEqual(mockKeywords);
        expect(db.prepare).toHaveBeenCalledWith('SELECT * FROM degree');
    });
});

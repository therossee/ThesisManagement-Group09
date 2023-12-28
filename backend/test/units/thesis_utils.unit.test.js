require('jest');

/**
 * This file contains unit tests for the thesis_dao.js file. We are focusing on utility functions related to thesis
 * but not on the actual CRUD operations on the thesis_proposal table.
 *
 * For e.g., we are testing methods to get groups, keywords, etc.
 */

const db = require('../../db');
const thesis = require('../../thesis_dao');

// Mocking the database
jest.mock('../../db', () => ({
    prepare: jest.fn().mockReturnThis(),
    run: jest.fn().mockReturnValue({lastInsertRowid: 1}),
    all: jest.fn(),
    get: jest.fn(),
    transaction: jest.fn().mockImplementation(callback => callback),
}));

jest.mock('../../configuration_dao', () => ({
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

        const result = await thesis.getTeacherListExcept(excludedTeacherId);

        expect(result).toEqual(mockTeacherData.filter(teacher => teacher.id !== excludedTeacherId));
        expect(db.prepare().all).toHaveBeenCalledWith(excludedTeacherId);
    });
    test('handles errors and rejects the promise if the database query fails', async () => {
        const excludedTeacherId = 2;

        // Mock the database query to throw an error
        db.prepare().all.mockImplementation(() => {
            throw new Error('Database query failed');
        });

        await expect(thesis.getTeacherListExcept(excludedTeacherId)).rejects.toThrow('Database query failed');
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

        const result = await thesis.getExternalCoSupervisorList();

        expect(result).toEqual(mockExternalCoSupervisorData);
    });
    test('handles errors and rejects the promise if the database query fails', async () => {

        // Mock the database query to throw an error
        db.prepare().all.mockImplementation(() => {
            throw new Error('Database query failed');
        });

        await expect(thesis.getExternalCoSupervisorList()).rejects.toThrow('Database query failed');
    });
});

describe('getGroup', () => {

    test('returns the cod_group for a given teacher ID', async () => {
        const teacherId = 1;
        const expectedCodGroup = 'Group1';

        // Mock the database query result
        db.prepare().get.mockReturnValue({cod_group: expectedCodGroup});

        const result = await thesis.getGroup(teacherId);

        expect(result).toBe(expectedCodGroup);
        expect(db.prepare().get).toHaveBeenCalledWith(teacherId);
    });
    test('handles errors and rejects the promise if the database query fails', async () => {
        const teacherId = 1;

        // Mock the database query to throw an error
        db.prepare().get.mockImplementation(() => {
            throw new Error('Database query failed');
        });

        await expect(thesis.getGroup(teacherId)).rejects.toThrow('Database query failed');
        expect(db.prepare().get).toHaveBeenCalledWith(teacherId);
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
        const result = await thesis.getAllKeywords();

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
        const result = await thesis.getDegrees();

        // Assertions
        expect(result).toEqual(mockKeywords);
        expect(db.prepare).toHaveBeenCalledWith('SELECT * FROM degree');
    });
});


describe('getKeywordsOfProposal', () => {

    test('should return the result of the db query', async () => {
        const proposalId = "1";
        const mockedData = [
            {
                proposal_id: proposalId,
                keyword: "Keyword1"
            },
            {
                proposal_id: proposalId,
                keyword: "Keyword2"
            }
        ];
        const expectedResult = mockedData.map(row => row.keyword);

        db.prepare().all.mockReturnValue(mockedData);

        const result = await thesis.getKeywordsOfProposal(proposalId);

        expect(result).toEqual(expectedResult);
        expect(db.prepare().all).toHaveBeenCalledWith(proposalId);
    });

    test('should return an empty list', async () => {
        const proposalId = "1";
        const mockedData = [];
        const expectedResult = mockedData.map(row => row.keyword);

        db.prepare().all.mockReturnValue(mockedData);

        const result = await thesis.getKeywordsOfProposal(proposalId);

        expect(result).toEqual(expectedResult);
        expect(db.prepare().all).toHaveBeenCalledWith(proposalId);
    });
});

describe('getInternalCoSupervisorsOfProposal', () => {

    test('should return the result of the db query', async () => {
        const proposalId = "1";
        const mockedData = {
            id: "1",
            surname: "MockedSurname",
            name: "MockedName",
            email: "mocked@gmail.com",
            cod_group: "Group1",
            cod_department: "Dep1",
            proposal_id: proposalId,
            co_supervisor_id: "1"
        };

        db.prepare().all.mockReturnValue(mockedData);

        const result = await thesis.getInternalCoSupervisorsOfProposal(proposalId);

        expect(result).toEqual(mockedData);
        expect(db.prepare().all).toHaveBeenCalledWith(proposalId);
    });
});

describe('getExternalCoSupervisorsOfProposal', () => {

    test('should return the result of the db query', async () => {
        const proposalId = "1";
        const mockedData = {
            id: "1",
            surname: "MockedSurname",
            name: "MockedName",
            email: "mocked@gmail.com",
            proposal_id: proposalId,
            co_supervisor_id: "1"
        };

        db.prepare().all.mockReturnValue(mockedData);

        const result = await thesis.getExternalCoSupervisorsOfProposal(proposalId);

        expect(result).toEqual(mockedData);
        expect(db.prepare().all).toHaveBeenCalledWith(proposalId);
    });
});

describe('getSupervisorOfProposal', () => {

    test('should return the result of the db query', async () => {
        const proposalId = "1";
        const mockedData = {
            id: "1",
            surname: "MockedSurname",
            name: "MockedName",
            email: "mocked@gmail.com",
            cod_group: "Group1",
            cod_department: "Dep1"
        };

        db.prepare().get.mockReturnValue(mockedData);

        const result = await thesis.getSupervisorOfProposal(proposalId);

        expect(result).toEqual(mockedData);
        expect(db.prepare().get).toHaveBeenCalledWith(proposalId);
    });
});

describe('getProposalGroups', () => {

    test('should return the result of the db query', async () => {
        const proposalId = "1";
        const mockedData = [
            {
                proposal_id: proposalId,
                cod_group: "Group1"
            },
            {
                proposal_id: proposalId,
                cod_group: "Group2"
            }
        ];
        const expectedResult = mockedData.map(row => row.cod_group);

        db.prepare().all.mockReturnValue(mockedData);

        const result = await thesis.getProposalGroups(proposalId);

        expect(result).toEqual(expectedResult);
        expect(db.prepare().all).toHaveBeenCalledWith(proposalId);
    })
});

describe('getThesisProposalCds', () => {

    test('should return thesis proposal cds', async () => {
        const proposalId = 1;
        const expectedQuery = `SELECT d.cod_degree, d.title_degree FROM proposalCds p, degree d WHERE proposal_id = ? AND p.cod_degree = d.cod_degree`;
        const expectedResult = [{cds: 'TestCds'}];

        db.prepare().all.mockReturnValueOnce(expectedResult);

        const result = await thesis.getThesisProposalCds(proposalId);

        expect(result).toEqual(expectedResult);
        expect(db.prepare).toHaveBeenCalledWith(expectedQuery);
    });

    test('should handle an empty result set', async () => {
        // Arrange
        const proposalId = 2;

        // Mock the all function to return an empty array
        db.prepare().all.mockReturnValueOnce([]);

        // Act
        const result = await thesis.getThesisProposalCds(proposalId);

        // Assert
        expect(result).toEqual([]);
    });

});

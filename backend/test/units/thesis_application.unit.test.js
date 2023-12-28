require('jest');

/**
 * Tests on the whole thesis application management
 */

const db = require('../../db');
const thesis = require('../../thesis_dao');
const fs = require('fs');

// Mocking the database
jest.mock('../../db', () => ({
    prepare: jest.fn().mockReturnThis(),
    run: jest.fn(),
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

jest.mock('fs');
jest.mock('path');

afterEach(() => {
    jest.restoreAllMocks(); // Restore original functionality after all tests
    jest.clearAllMocks();
});


describe('applyForProposal', () => {
    test('applies for a proposal without a file and resolves with applicationId', async () => {
        // Mock data
        const proposal_id = 1;
        const student_id = '1';

        db.prepare().get.mockReturnValueOnce({proposal_id: 1, cod_degree: 'L-01'});
        db.prepare().get.mockReturnValueOnce({
            proposal_id: '1',
            title: 'Test Proposal',
            supervisor_id: 1,
            type: 'Test Type',
            description: 'Test Description',
            required_knowledge: 'Test Knowledge',
            notes: 'Test Notes',
            creation_date: '2020-10-21',
            expiration: '2023-12-31',
            level: 'Test Level'
        });
        db.prepare().get.mockReturnValueOnce();
        db.prepare().run.mockReturnValue({lastInsertRowid: 1});

        const applicationId = await thesis.applyForProposal(proposal_id, student_id);

        expect(applicationId).toBe(1);
    });
    test('applies for a proposal with a file and resolves with an applicationId', async () => {

        // Mock data
        const proposal_id = 1;
        const student_id = "1";

        db.prepare().get.mockReturnValueOnce({proposal_id: 1, cod_degree: 'L-01'});
        db.prepare().get.mockReturnValueOnce({
            proposal_id: '1',
            title: 'Test Proposal',
            supervisor_id: 1,
            type: 'Test Type',
            description: 'Test Description',
            required_knowledge: 'Test Knowledge',
            notes: 'Test Notes',
            creation_date: '2020-10-21',
            expiration: '2023-12-31',
            level: 'Test Level'
        });
        db.prepare().get.mockReturnValueOnce();
        db.prepare().run.mockReturnValueOnce({lastInsertRowid: 1});

        // Mock the file-related functions
        const file = {
            mimetype: 'application/pdf',
            originalFilename: 'mocked-file.pdf',
            filepath: '/path/to/mocked-file.pdf',
        };
        fs.existsSync.mockReturnValue(true); // Simulate file existence
        fs.mkdirSync.mockReturnValue(null);
        fs.writeFileSync.mockImplementation(() => {
        });

        // Call the function
        const result = await thesis.applyForProposal(proposal_id, student_id, file);

        // Assertions
        expect(result).toBe(1);

        // Verify that the correct database methods were called with the expected arguments
        expect(db.prepare().get).toHaveBeenCalledTimes(3);
        expect(db.prepare().get).toHaveBeenCalledWith(proposal_id, student_id);
        expect(db.prepare().get).toHaveBeenCalledWith(proposal_id, expect.any(String), expect.any(String));
        expect(db.prepare().get).toHaveBeenCalledWith(student_id);
        expect(db.prepare().run).toHaveBeenCalledWith(proposal_id, student_id, expect.any(String));
    });
    test('applies for a proposal with a wrong format file', async () => {

        // Mock data
        const proposal_id = 1;
        const student_id = "1";

        db.prepare().get.mockReturnValueOnce({proposal_id: 1, cod_degree: 'L-01'});
        db.prepare().get.mockReturnValueOnce({
            proposal_id: '1',
            title: 'Test Proposal',
            supervisor_id: 1,
            type: 'Test Type',
            description: 'Test Description',
            required_knowledge: 'Test Knowledge',
            notes: 'Test Notes',
            creation_date: '2020-10-21',
            expiration: '2023-12-31',
            level: 'Test Level'
        });
        db.prepare().get.mockReturnValueOnce();
        db.prepare().run.mockReturnValueOnce({lastInsertRowid: 1});

        // Mock the file-related functions
        const file = {
            mimetype: 'application/json',
            originalFilename: 'mocked-file.pdf',
            filepath: '/path/to/mocked-file.pdf',
        };
        fs.existsSync.mockReturnValue(true); // Simulate file existence
        fs.mkdirSync.mockReturnValue(null);
        fs.writeFileSync.mockImplementation(() => {
        });

        // Call the function
        await expect(thesis.applyForProposal(proposal_id, student_id, file)).rejects.toEqual(new Error('The file must be a PDF'));

    });
    test('handle properly file errors', async () => {

        // Mock data
        const proposal_id = 1;
        const student_id = "1";

        db.prepare().get.mockReturnValueOnce({proposal_id: 1, cod_degree: 'L-01'});
        db.prepare().get.mockReturnValueOnce({
            proposal_id: '1',
            title: 'Test Proposal',
            supervisor_id: 1,
            type: 'Test Type',
            description: 'Test Description',
            required_knowledge: 'Test Knowledge',
            notes: 'Test Notes',
            creation_date: '2020-10-21',
            expiration: '2023-12-31',
            level: 'Test Level'
        });
        db.prepare().get.mockReturnValueOnce();
        db.prepare().run.mockReturnValueOnce({lastInsertRowid: 1});

        // Mock the file-related functions
        const file = {
            mimetype: 'application/pdf',
            originalFilename: 'mocked-file.pdf',
            filepath: '/path/to/mocked-file.pdf',
        };
        fs.existsSync.mockReturnValue(true); // Simulate file existence
        fs.mkdirSync.mockReturnValue(null);
        fs.writeFileSync.mockImplementation(() => {
            throw new Error();
        });

        // Call the function
        await expect(thesis.applyForProposal(proposal_id, student_id, file)).rejects.toEqual(new Error('Error'));

    });
    test('handle properly db errors', async () => {

        // Mock data
        const proposal_id = 1;
        const student_id = "1";

        db.prepare().get.mockReturnValueOnce({proposal_id: 1, cod_degree: 'L-01'});
        db.prepare().get.mockReturnValueOnce({
            proposal_id: '1',
            title: 'Test Proposal',
            supervisor_id: 1,
            type: 'Test Type',
            description: 'Test Description',
            required_knowledge: 'Test Knowledge',
            notes: 'Test Notes',
            creation_date: '2020-10-21',
            expiration: '2023-12-31',
            level: 'Test Level'
        });
        db.prepare().get.mockReturnValueOnce();
        db.prepare().run.mockReturnValueOnce();
        db.prepare().run.mockImplementation(() => {
            throw new Error();
        });

        // Mock the file-related functions
        const file = {
            mimetype: 'application/pdf',
            originalFilename: 'mocked-file.pdf',
            filepath: '/path/to/mocked-file.pdf',
        };
        fs.existsSync.mockReturnValue(true); // Simulate file existence
        fs.mkdirSync.mockReturnValue(null);
        fs.writeFileSync.mockImplementation(() => {
        });

        // Call the function
        await expect(thesis.applyForProposal(proposal_id, student_id, file)).rejects.toEqual(new Error());

    });
    test('applies for a proposal not belonging to his cds', async () => {
        // Mock data
        const proposal_id = 1;
        const student_id = '1';

        db.prepare().get.mockReturnValueOnce();

        await expect(thesis.applyForProposal(proposal_id, student_id)).rejects.toEqual(new Error("The proposal doesn't belong to the student degree"));
    });
    test('applies for a proposal not active', async () => {
        // Mock data
        const proposal_id = 1;
        const student_id = '1';

        db.prepare().get.mockReturnValueOnce({proposal_id: 1, cod_degree: 'L-01'});
        db.prepare().get.mockReturnValueOnce();

        await expect(thesis.applyForProposal(proposal_id, student_id)).rejects.toEqual(new Error("The proposal is not active"));

    });
    test('applies for a proposal while he has already applied for another', async () => {
        // Mock data
        const proposal_id = 1;
        const student_id = '1';

        db.prepare().get.mockReturnValueOnce({proposal_id: 1, cod_degree: 'L-01'});
        db.prepare().get.mockReturnValueOnce({
            proposal_id: '1',
            title: 'Test Proposal',
            supervisor_id: 1,
            type: 'Test Type',
            description: 'Test Description',
            required_knowledge: 'Test Knowledge',
            notes: 'Test Notes',
            creation_date: '2020-10-21',
            expiration: '2023-12-31',
            level: 'Test Level'
        });
        db.prepare().get.mockReturnValueOnce({proposal_id: 1, cod_degree: 'L-01', status: 'waiting for approval'});

        await expect(thesis.applyForProposal(proposal_id, student_id)).rejects.toEqual(new Error("The user has already applied for other proposals"));
    });
});

describe('listApplicationsForTeacherThesisProposal', () => {

    test('should return an array of thesis applications for a teacher and proposal', async () => {
        // Mock the response from the database
        const mockApplications = [
            {status: 'Approved', name: 'M', surname: 'R', student_id: 's1'},
            {status: 'Pending', name: 'W', surname: 'X', student_id: 's2'}
        ];

        // Mock the SQLite database query
        db.prepare.mockClear().mockReturnValueOnce({all: jest.fn(() => mockApplications)});

        // Call the function
        const result = await thesis.listApplicationsForTeacherThesisProposal(1, 'd1');
        const expectedQuery = `SELECT s.name, s.surname, ta.status, s.id, ta.id AS application_id
    FROM thesisApplication ta, thesisProposal tp, student s
    WHERE ta.proposal_id = tp.proposal_id 
      AND s.id = ta.student_id
      AND ta.proposal_id=?
      AND tp.supervisor_id= ? 
      AND ta.creation_date < ?
      AND tp.expiration > ?
      AND tp.creation_date < ?
      AND tp.is_archived = 0
      AND tp.is_deleted = 0;`;
        // Assertions
        expect(result).toEqual(mockApplications);
        expect(db.prepare).toHaveBeenCalledWith(expectedQuery);
    });
});

describe('getStudentActiveApplication', () => {

    test('should retrieve active application of a student', async () => {

        const student_id = 1;
        const expectedResult = [{proposal_id: 1}];

        // Mock the all function to return a mock result
        db.prepare().all.mockReturnValueOnce(expectedResult);

        // Act
        const result = await thesis.getStudentActiveApplication(student_id);
        const expectedQuery = `SELECT proposal_id FROM thesisApplication WHERE student_id=? AND creation_date < ? AND ( status='waiting for approval' OR status='accepted')`;

        // Assert
        expect(result).toEqual(expectedResult);
        expect(db.prepare).toHaveBeenCalledWith(expectedQuery);
    });

    test('should handle an empty result set', async () => {
        // Arrange
        const student_id = 2;

        // Mock the all function to return an empty array
        db.prepare().all.mockReturnValueOnce([]);

        // Act
        const result = await thesis.getStudentActiveApplication(student_id);

        // Assert
        expect(result).toEqual([]);
    });

});

describe('updateApplicationStatus', () => {

    test('should update the application status and return true since row count is greater than 1', async () => {
        // Arrange
        const studentId = 1;
        const proposalId = 1;
        const status = 'accepted';
        const expectedRowCount = 1;

        // Mock the run function to return a mock result
        db.prepare().run.mockReturnValueOnce({changes: expectedRowCount});

        // Act
        const result = await thesis.updateApplicationStatus(studentId, proposalId, status);

        // Assert
        expect(result).toEqual(true);
    });
    test('should not update the application status and return false since row count changes is equal to 0', async () => {
        // Arrange
        const studentId = 1;
        const proposalId = 1;
        const status = 'accepted';
        const expectedRowCount = 0;

        // Mock the run function to return a mock result
        db.prepare().run.mockReturnValueOnce({changes: expectedRowCount});

        // Act
        const result = await thesis.updateApplicationStatus(studentId, proposalId, status);

        // Assert
        expect(result).toEqual(false);
    });

    test('should handle errors and reject with an error message', async () => {
        // Arrange
        const studentId = 2;
        const proposalId = 2;
        const status = 'accepted';

        // Mock the run function to throw an error
        db.prepare().run.mockImplementationOnce(() => {
            throw new Error('Some error');
        });

        // Act and Assert
        await expect(thesis.updateApplicationStatus(studentId, proposalId, status)).rejects.toThrow('Some error');
    });
});

describe('cancelOtherApplications', () => {

    test('should reject other applications and return the row count', async () => {
        // Arrange
        const studentId = "1";
        const proposalId = "1";
        const rowUpdated = [
            {proposal_id: proposalId, student_id: 's1', status: 'cancelled', id: 1},
            {proposal_id: proposalId, student_id: 's2', status: 'cancelled', id: 2},
        ];

        // Mock the run function to return a mock result
        db.prepare().all.mockReturnValueOnce([
            {proposal_id: proposalId, student_id: 's1', status: 'cancelled', id: 1},
            {proposal_id: proposalId, student_id: 's2', status: 'cancelled', id: 2},
        ]);

        // Act
        const result = await thesis.cancelOtherApplications(studentId, proposalId);

        // Assert
        expect(result).toEqual(rowUpdated);
    });

    test('should handle errors and reject with an error message', async () => {
        // Arrange
        const studentId = "2";
        const proposalId = "2";

        // Mock the run function to throw an error
        db.prepare().all.mockImplementationOnce(() => {
            throw new Error('Some error');
        });

        // Act and Assert
        await expect(thesis.cancelOtherApplications(studentId, proposalId)).rejects.toThrow('Some error');
    });
});

describe('listApplicationsDecisionsFromStudent', () => {

    test('should return the list of applications given the studentId', async () => {
        const studentId = "1";
        const expectedResult = [{
            application_id: 1,
            proposal_id: 1,
            title: "Title test",
            level: "Test level",
            teacher_name: "MockTeacherName",
            teacher_surname: "MockTeacherSurname",
            status: "Test status",
            expiration: "2023-11-29"
        }];
        const expectedQuery = `SELECT ta.id AS "application_id", ta.proposal_id, tp.title,  tp.level, t.name AS "teacher_name" , t.surname AS "teacher_surname" ,ta.status, tp.expiration
    FROM thesisApplication ta, thesisProposal tp, teacher t
    WHERE ta.proposal_id = tp.proposal_id AND ta.student_id = ? AND t.id = tp.supervisor_id AND ta.creation_date < ?`;

        db.prepare().all.mockReturnValueOnce(expectedResult);

        const result = await thesis.listApplicationsDecisionsFromStudent(studentId);

        expect(result).toEqual(expectedResult);
        expect(db.prepare).toHaveBeenCalledWith(expectedQuery);
    });

});

describe('getApplicationById', () => {

    test('should return the application with given the id', async () => {
        const applicationId = 1;
        const expectedResult =
            {
                "id": 1,
                "proposal_id": 1,
                "student_id": 's12345',
                "status": "accepted",
                "creation_date": "2020-10-21T21:37:01.176Z",
            };

        db.prepare().get.mockReturnValue(expectedResult);

        const result = await thesis.getApplicationById(applicationId);
        const expectedQuery = `SELECT * FROM thesisApplication WHERE id = ?`;

        expect(result).toEqual(expectedResult);
        expect(db.prepare).toHaveBeenCalledWith(expectedQuery);
    });
});

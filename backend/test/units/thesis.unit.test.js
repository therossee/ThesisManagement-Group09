require('jest');

/**
 * This file contains unit tests for the thesis_dao.js file. We are focusing on the functions that perform CRUD
 * operations on the thesis_proposal table (create, update, get, ...).
 */

const AdvancedDate = require('../../src/models/AdvancedDate');
const db = require('../../src/services/db');
const thesis = require('../../src/dao/thesis_dao');
const UnauthorizedActionError = require("../../src/errors/UnauthorizedActionError");
const NoThesisProposalError = require("../../src/errors/NoThesisProposalError");
const {APPLICATION_STATUS} = require("../../src/enums/application");

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

describe('createThesisProposal', () => {

    test('create a thesis proposal with cosupervisors', async () => {
        const proposalData = {
            title: 'Test Proposal',
            supervisor_id: 1,
            internal_co_supervisors_id: ['d1', 'd2', 'd3'],
            external_co_supervisors_id: [1, 2],
            type: 'Test Type',
            groups: ['Group1', 'Group2'],
            description: 'Test Description',
            required_knowledge: 'Test Knowledge',
            notes: 'Test Notes',
            expiration: '2025-12-31',
            level: 'Test Level',
            cds: ['Test CDS1', 'Test CDS2'],
            keywords: ['Keyword1', 'Keyword2'],
        };

        const proposal_details = {
            title: proposalData.title,
            supervisor_id: proposalData.supervisor_id,
            type: proposalData.type,
            description: proposalData.description,
            required_knowledge: proposalData.required_knowledge,
            notes: proposalData.notes,
            expiration: proposalData.expiration,
            level: proposalData.level
        };

        const additional_details = {
            internal_co_supervisors_id: proposalData.internal_co_supervisors_id,
            external_co_supervisors_id: proposalData.external_co_supervisors_id,
            unique_groups: proposalData.groups,
            keywords: proposalData.keywords,
            cds: proposalData.cds,
        };

        const proposalId = await thesis.createThesisProposal(proposalData, additional_details);

        expect(proposalId).toBe(1); // Assuming your mock database always returns proposalId 1
        expect(db.prepare).toHaveBeenCalledTimes(12); // 12 queries
    });
    test('create a thesis proposal without cosupervisors', async () => {
        const proposalData = {
            title: 'Test Proposal',
            supervisor_id: 1,
            internal_co_supervisors_id: [],
            external_co_supervisors_id: [],
            type: 'Test Type',
            groups: ['Group1'],
            description: 'Test Description',
            required_knowledge: 'Test Knowledge',
            notes: 'Test Notes',
            expiration: '2025-12-31',
            level: 'Test Level',
            cds: ['Test CDS1', 'Test CDS2'],
            keywords: ['Keyword1', 'Keyword2'],
        };

        const proposal_details = {
            title: proposalData.title,
            supervisor_id: proposalData.supervisor_id,
            type: proposalData.type,
            description: proposalData.description,
            required_knowledge: proposalData.required_knowledge,
            notes: proposalData.notes,
            expiration: proposalData.expiration,
            level: proposalData.level
        };

        const additional_details = {
            internal_co_supervisors_id: proposalData.internal_co_supervisors_id,
            external_co_supervisors_id: proposalData.external_co_supervisors_id,
            unique_groups: proposalData.groups,
            keywords: proposalData.keywords,
            cds: proposalData.cds,
        };

        const proposalId = await thesis.createThesisProposal(proposalData, additional_details);

        expect(proposalId).toBe(1); // Assuming your mock database always returns proposalId 1
        expect(db.prepare).toHaveBeenCalledTimes(6);
    });
    test('create a thesis proposal with passed expiration date', async () => {
        const proposalData = {
            title: 'Test Proposal',
            supervisor_id: 1,
            internal_co_supervisors_id: [],
            external_co_supervisors_id: [],
            type: 'Test Type',
            groups: ['Group1'],
            description: 'Test Description',
            required_knowledge: 'Test Knowledge',
            notes: 'Test Notes',
            expiration: '2020-12-31',
            level: 'Test Level',
            cds: ['Test CDS1', 'Test CDS2'],
            keywords: ['Keyword1', 'Keyword2'],
        };

        const proposal_details = {
            title: proposalData.title,
            supervisor_id: proposalData.supervisor_id,
            type: proposalData.type,
            description: proposalData.description,
            required_knowledge: proposalData.required_knowledge,
            notes: proposalData.notes,
            expiration: proposalData.expiration,
            level: proposalData.level
        };

        const additional_details = {
            internal_co_supervisors_id: proposalData.internal_co_supervisors_id,
            external_co_supervisors_id: proposalData.external_co_supervisors_id,
            unique_groups: proposalData.groups,
            keywords: proposalData.keywords,
            cds: proposalData.cds,
        };

        // Adding "await" before the thesis.createThesisProposal
        await expect(
            thesis.createThesisProposal(proposal_details, additional_details)
        ).rejects.toEqual(new Error("The expiration date must be after the creation date"));
    });
});

describe('updateThesisProposal', () => {

    test('updates the thesis proposal with valid data', async () => {
        const proposalId = 1;
        const supervisorId = 'd1';
        const thesisData = {
            title: 'Test Proposal',
            type: 'Test Type',
            description: 'Test Description',
            required_knowledge: '',
            notes: '',
            expiration: '2023-12-31T23:59:59.999Z', // Updated expiration date
            level: 'Updated Level',
            keywords: ['Keyword1', 'Keyword2'],
            internal_co_supervisors_id: ['InternalCoSupervisor1', 'InternalCoSupervisor2'],
            external_co_supervisors_id: ['ExternalCoSupervisor1', 'ExternalCoSupervisor2'],
            groups: ['Group1', 'Group2'],
            cds: ['CDS1', 'CDS2'],
        };

        // Call the function and assert the result
        const result = await thesis.updateThesisProposal(proposalId, supervisorId, thesisData);
        expect(result).toEqual(proposalId); // Assuming that the function resolves with the proposal_id on success
        expect(db.prepare).toHaveBeenCalledTimes(16); // 16 queries
    });

    test('updates the thesis proposal without changing anything', async () => {

        const proposalId = 1;
        const supervisorId = 'd1';
        const thesisData = {
            title: 'Updated Title',
            type: 'Updated Type',
            description: 'Updated Description',
            required_knowledge: 'Updated Knowledge',
            notes: 'Updated Notes',
            expiration: '2027-12-31',
            level: 'Test Level'
        };
        db.prepare().run.mockReturnValueOnce({changes: 0});
        // Call the function and assert the result
        const result = await thesis.updateThesisProposal(proposalId, supervisorId, thesisData);
        expect(result).toBeNull();
    });
});

describe('getThesisProposal', () => {

    test('should return a thesis proposal when it exists for the given proposalId and studentId', async () => {
        // Arrange
        const proposalId = 1;
        const studentId = "1";
        const expectedResult =
            {
                "id": 1,
                "title": "Test Proposal",
                "status": "ACTIVE",
                "supervisor": {
                    "id": "1",
                    "name": "mockSupervisorName",
                    "surname": "mockSupervisorSurname",
                },
                "cosupervisors": {
                    "internal": [
                        {
                            "id": "1",
                            "name": "internalCoSupervisorName",
                            "surname": "internalCoSupervisorSurname"
                        }
                    ],
                    "external": [
                        {
                            "id": 2,
                            "name": "externalCoSupervisorName",
                            "surname": "externalCoSupervisorSurname"
                        }
                    ]
                },
                "type": "Test Type",
                "description": "Test Description",
                "expiration": "2023-12-31",
                "level": "Test Level",
            };

        // Mock the get function to return a mock result
        db.prepare().get.mockReturnValueOnce(undefined).mockReturnValueOnce(expectedResult);

        // Act
        const result = await thesis.getThesisProposal(proposalId, studentId);

        // Assert
        expect(result).toEqual(expectedResult);
    });

    test('should return null when the thesis proposal does not exist for the given proposalId and studentId', async () => {
        // Arrange
        const proposalId = 2;
        const studentId = "2";

        // Mock the get function to return undefined (indicating no thesis proposal)
        db.prepare().get.mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);

        // Act
        const result = await thesis.getThesisProposal(proposalId, studentId);

        // Assert
        expect(result).toBeNull();
    });

    test('should return null when the proposal is already assigned', async () => {
        // Arrange
        const proposalId = 1;
        const studentId = "1";

        // Mock the get function to return a mock result
        db.prepare().get.mockReturnValueOnce({
            proposalId: 1,
            student_id: "1",
            status: 'accepted'
        });

        // Act
        const result = await thesis.getThesisProposal(proposalId, studentId);

        // Assert
        expect(result).toEqual(null);
    });

});

describe('listThesisProposalsFromStudent', () => {

    test('should return the result of the db query', async () => {
        const studentId = "1";
        const currentDate = new AdvancedDate().toISOString();
        const mockedData = [
            {
                id: "1",
                title: 'Test Proposal',
                supervisor_id: 1,
                type: 'Test Type',
                description: 'Test Description',
                required_knowledge: 'Test Knowledge',
                notes: 'Test Notes',
                expiration: '2023-12-31',
                level: 'Test Level'
            }
        ];

        db.prepare().all.mockClear().mockReturnValue(mockedData);

        const result = await thesis.listThesisProposalsFromStudent(studentId, currentDate, currentDate);

        expect(result).toEqual(mockedData);
        expect(db.prepare().all).toHaveBeenCalledWith(
            studentId,
            APPLICATION_STATUS.ACCEPTED,
            expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
            expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/));
    });

    test('should return an empty list', async () => {
        const studentId = "1";
        const currentDate = new AdvancedDate().toISOString();
        const mockedData = [];

        db.prepare().all.mockClear().mockReturnValue(mockedData);

        const result = await thesis.listThesisProposalsFromStudent(studentId, currentDate, currentDate);

        expect(result).toEqual(mockedData);
        //expect(db.prepare().all).toHaveBeenCalledWith(studentId, currentDate, currentDate);

        expect(db.prepare().all.mock.calls[0][0]).toBe(studentId);
    });
});

describe('listThesisProposalsTeacher', () => {

    test('should return an array of thesis proposals for a teacher', async () => {
        const teacherId = "1";
        // Mock the response from the database
        const mockProposals = [
            {proposal_id: 1, title: 'Proposal1'},
            {proposal_id: 2, title: 'Proposal2'},
        ];
        const currentDate = new AdvancedDate().toISOString();
        const expectedQuery = `SELECT * 
      FROM thesisProposal P
      WHERE P.supervisor_id=?
        AND NOT EXISTS (
          SELECT 1
          FROM thesisApplication A
          WHERE A.proposal_id = P.proposal_id
            AND A.status = ?
        )
        AND P.expiration > ?
        AND creation_date < ?
        AND is_archived = 0
        AND is_deleted = 0;`;
        // Mock the SQLite database query
        db.prepare.mockClear().mockReturnValueOnce({all: jest.fn(() => mockProposals)});

        // Call the function
        const result = await thesis.listThesisProposalsTeacher(teacherId, currentDate, currentDate);
        // Assertions
        expect(result).toEqual(mockProposals);
        expect(db.prepare).toHaveBeenCalledWith(expectedQuery);
    });
    test('should return an empty list', async () => {
        const studentId = "1";
        const mockedData = [];

        db.prepare().all.mockReturnValue(mockedData);

        const result = await thesis.listThesisProposalsFromStudent(studentId);

        expect(result).toEqual(mockedData);
        // expect(db.prepare().all).toHaveBeenCalledWith(studentId);

        expect(db.prepare().all.mock.calls[0][0]).toBe(studentId);
    });
});

describe('getThesisProposalById', () => {

    test('should return the thesis proposal given the id', async () => {
        const proposalId = 1;
        const expectedResult =
            {
                "id": 1,
                "title": "Test Proposal",
                "status": "ACTIVE",
                "supervisor": {
                    "id": "1",
                    "name": "mockSupervisorName",
                    "surname": "mockSupervisorSurname",
                },
                "cosupervisors": {
                    "internal": [
                        {
                            "id": "1",
                            "name": "internalCoSupervisorName",
                            "surname": "internalCoSupervisorSurname"
                        }
                    ],
                    "external": [
                        {
                            "id": 2,
                            "name": "externalCoSupervisorName",
                            "surname": "externalCoSupervisorSurname"
                        }
                    ]
                },
                "type": "Test Type",
                "description": "Test Description",
                "expiration": "2023-12-31",
                "level": "Test Level",
            };

        db.prepare().get.mockReturnValue(expectedResult);

        const result = await thesis.getThesisProposalById(proposalId);
        const expectedQuery = `SELECT * FROM thesisProposal P
        JOIN proposalCds PC ON P.proposal_id = PC.proposal_id
        JOIN degree D ON PC.cod_degree = D.cod_degree
        WHERE P.proposal_id = ? AND is_deleted = 0;`;

        expect(result).toEqual(expectedResult);
        expect(db.prepare).toHaveBeenCalledWith(expectedQuery);
    });
});

describe('getThesisProposalTeacher', () => {

    test('should return teacher given thesisProposalId and teacherId', async () => {
        const proposalId = 1;
        const teacherId = "d1";
        const expectedResult = {
            id: "d1",
            surname: "SurnameMock",
            name: "NameMock",
            email: "emailMock",
            codGroup: "G1",
            cod_department: "dep1"
        };

        db.prepare().get.mockReturnValueOnce(undefined).mockReturnValueOnce(expectedResult);

        const result = await thesis.getThesisProposalTeacher(proposalId, teacherId);

        expect(result).toEqual(expectedResult);
    });

    test('should return null when the proposal is already assigned', async () => {
        const proposalId = 2;
        const teacheId = "d2";

        db.prepare().get.mockReturnValueOnce({
            proposalId: 2,
            teacheId: "d2",
            status: 'accepted'
        });

        const result = await thesis.getThesisProposalTeacher(proposalId, teacheId);

        expect(result).toEqual(null);
    })
});

describe('deleteThesisProposalById', () => {

    test('should reject the deletion if database indicate that an application has been accepted', async () => {
        const proposalId = 1;
        const supervisorId = "d1";

        db.prepare().get.mockReturnValueOnce({proposal_id: 1, status: 'accepted'});
        jest.clearAllMocks();

        await expect(thesis.deleteThesisProposalById(proposalId, supervisorId)).rejects.toThrow(UnauthorizedActionError);
        expect(db.prepare).toHaveBeenCalledTimes(1);
    });

    test('should reject the deletion if the delete query returns 0 rows and no thesis is found with the ID provided', async () => {
        const proposalId = 1;
        const supervisorId = "d1";

        db.prepare().get.mockReturnValueOnce(undefined);
        db.prepare().run.mockReturnValueOnce({changes: 0});
        db.prepare().get.mockReturnValueOnce(undefined);
        jest.clearAllMocks();

        await expect(thesis.deleteThesisProposalById(proposalId, supervisorId)).rejects.toThrow(NoThesisProposalError);
        expect(db.prepare).toHaveBeenCalledTimes(3);
    });

    test('should reject the deletion if the delete query returns 0 rows and the thesis found has a creation date in the future', async () => {
        const proposalId = 1;
        const supervisorId = "d1";

        db.prepare().get.mockReturnValueOnce(undefined);
        db.prepare().run.mockReturnValueOnce({changes: 0});
        db.prepare().get.mockReturnValueOnce({
            proposal_id: proposalId,
            creation_date: new Date(2332452985000).toISOString()
        });
        jest.clearAllMocks();

        await expect(thesis.deleteThesisProposalById(proposalId, supervisorId)).rejects.toThrow(NoThesisProposalError);
        expect(db.prepare).toHaveBeenCalledTimes(3);
    });

    test('should reject deletion if thesis is expired', async () => {
        const proposalId = 1;
        const supervisorId = "d1";

        db.prepare().get.mockReturnValueOnce(undefined);
        db.prepare().run.mockReturnValueOnce({changes: 0});
        db.prepare().get.mockReturnValueOnce({
            proposal_id: proposalId,
            creation_date: new Date().toISOString(),
            expiration: new Date(1701300985000).toISOString()
        });
        jest.clearAllMocks();

        await expect(thesis.deleteThesisProposalById(proposalId, supervisorId)).rejects.toThrow(UnauthorizedActionError);
        expect(db.prepare).toHaveBeenCalledTimes(3);
    });

    test('should reject deletion if thesis is not owned by the supervisor', async () => {
        const proposalId = 1;
        const supervisorId = "d1";

        db.prepare().get.mockReturnValueOnce(undefined);
        db.prepare().run.mockReturnValueOnce({changes: 0});
        db.prepare().get.mockReturnValueOnce({
            proposal_id: proposalId,
            creation_date: new Date().toISOString(),
            expiration: new Date(2332452985000).toISOString(),
            supervisor_id: "d2"
        });
        jest.clearAllMocks();

        await expect(thesis.deleteThesisProposalById(proposalId, supervisorId)).rejects.toThrow(UnauthorizedActionError);
        expect(db.prepare).toHaveBeenCalledTimes(3);
    });

    test('should delete the thesis proposal and return the list of applications cancelled', async () => {
        const proposalId = 1;
        const supervisorId = "d1";

        const mockedApplications = [
            {proposal_id: proposalId, student_id: 's1', status: 'cancelled', id: 1},
            {proposal_id: proposalId, student_id: 's2', status: 'cancelled', id: 2},
        ];

        db.prepare().get.mockReturnValueOnce(undefined);
        db.prepare().run.mockReturnValueOnce({changes: 1});

        db.prepare().all.mockReturnValueOnce(mockedApplications);
        jest.clearAllMocks();

        const res = await thesis.deleteThesisProposalById(proposalId, supervisorId);
        expect(res).toEqual(mockedApplications);
        expect(db.prepare).toHaveBeenCalledTimes(3);
    });
});

describe('archiveThesisProposalById', () => {
    test('archives a thesis proposal without accepted applications', async () => {
        const proposalId = 1;
        const supervisorId = 'd1';

        db.prepare().get.mockReturnValueOnce(null); // No accepted applications
        db.prepare().run.mockReturnValueOnce({changes: 1}); // Successful archiving

        const result = await thesis.archiveThesisProposalById(proposalId, supervisorId);

        expect(db.prepare().get).toHaveBeenCalledWith(proposalId, APPLICATION_STATUS.ACCEPTED);
        expect(db.prepare().run).toHaveBeenCalledWith(
            proposalId,
            supervisorId,
            expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
            expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        );

        expect(result).toEqual([]);
    });

    test('rejects with UnauthorizedActionError for a thesis with accepted applications', async () => {
        const proposalId = 1;
        const supervisorId = 'd1';

        db.prepare().get.mockReturnValueOnce({});

        await expect(thesis.archiveThesisProposalById(proposalId, supervisorId)).rejects.toThrow(UnauthorizedActionError);

        expect(db.prepare().get).toHaveBeenCalledWith(proposalId, APPLICATION_STATUS.ACCEPTED);
    });

    test('rejects with the appropriate error for an unsuccessful archiving (inexistent thesis)', async () => {

        const proposalId = 1;
        const supervisorId = 'd1';


        db.prepare().get.mockReturnValueOnce(null);
        db.prepare().run.mockReturnValueOnce({changes: 0});

        db.prepare().get.mockReturnValueOnce(null); // No thesis proposal with the given id

        await expect(thesis.archiveThesisProposalById(proposalId, supervisorId)).rejects.toThrow(NoThesisProposalError); // No thesis proposal with the given id
        expect(db.prepare().get).toHaveBeenCalledWith(proposalId);
        expect(db.prepare().run).toHaveBeenCalledWith(
            proposalId,
            supervisorId,
            expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
            expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        );
        expect(db.prepare().get).toHaveBeenCalledWith(proposalId);
    });

    test('rejects with the appropriate error for an unsuccessful archiving (thesis not already created)', async () => {

        const proposalId = 1;
        const supervisorId = 'd1';


        db.prepare().get.mockReturnValueOnce(null);
        db.prepare().run.mockReturnValueOnce({changes: 0});

        db.prepare().get.mockReturnValueOnce({creation_date: '2030-11-10T23:59:59.999Z'});

        await expect(thesis.archiveThesisProposalById(proposalId, supervisorId)).rejects.toThrow(NoThesisProposalError); // No thesis proposal with the given id
        expect(db.prepare().get).toHaveBeenCalledWith(proposalId);
        expect(db.prepare().run).toHaveBeenCalledWith(
            proposalId,
            supervisorId,
            expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
            expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        );
        expect(db.prepare().get).toHaveBeenCalledWith(proposalId);
    });

    test('rejects with the appropriate error for an unsuccessful archiving (expired thesis)', async () => {

        const proposalId = 1;
        const supervisorId = 'd1';


        db.prepare().get.mockReturnValueOnce(null);
        db.prepare().run.mockReturnValueOnce({changes: 0});

        db.prepare().get.mockReturnValueOnce({expiration: '2020-11-10T23:59:59.999Z'}); // Expired thesis

        await expect(thesis.archiveThesisProposalById(proposalId, supervisorId)).rejects.toThrow(new UnauthorizedActionError('You can\'t archive a thesis already expired'));
        expect(db.prepare().get).toHaveBeenCalledWith(proposalId);
        expect(db.prepare().run).toHaveBeenCalledWith(
            proposalId,
            supervisorId,
            expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
            expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        );
        expect(db.prepare().get).toHaveBeenCalledWith(proposalId);
    });

    test('rejects with the appropriate error for an unsuccessful archiving (supervisor not owner of the proposal)', async () => {

        const proposalId = 1;
        const supervisorId = 'd1';


        db.prepare().get.mockReturnValueOnce(null);
        db.prepare().run.mockReturnValueOnce({changes: 0});

        db.prepare().get.mockReturnValueOnce({
            expiration: '2030-11-10T23:59:59.999Z',
            creation_date: '2020-11-10T23:59:59.999Z'
        }); // No thesis proposal with the given id

        await expect(thesis.archiveThesisProposalById(proposalId, supervisorId)).rejects.toThrow(new UnauthorizedActionError('You are not the supervisor of this thesis')); // No thesis proposal with the given id
        expect(db.prepare().get).toHaveBeenCalledWith(proposalId);
        expect(db.prepare().run).toHaveBeenCalledWith(
            proposalId,
            supervisorId,
            expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
            expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        );
        expect(db.prepare().get).toHaveBeenCalledWith(proposalId);
    });
});

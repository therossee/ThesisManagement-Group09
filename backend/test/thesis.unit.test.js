require('jest');

const db = require('../db');
const thesis = require('../thesis_dao');

// Mocking the database
jest.mock('../db', () => ({
  prepare: jest.fn().mockReturnThis(),
  run: jest.fn().mockReturnValue({ lastInsertRowid: 1 }),
  all: jest.fn(),
  get: jest.fn(),
  transaction: jest.fn().mockImplementation(callback => callback()),
}));

describe('createThesisProposal', () => {
  beforeEach(() => {
    // Reset the mock before each test
    db.prepare.mockClear();
  });
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

    const proposalId = await thesis.createThesisProposal(
      proposalData.title,
      proposalData.supervisor_id,
      proposalData.internal_co_supervisors_id,
      proposalData.external_co_supervisors_id,
      proposalData.type,
      proposalData.groups,
      proposalData.description,
      proposalData.required_knowledge,
      proposalData.notes,
      proposalData.expiration,
      proposalData.level,
      proposalData.cds,
      proposalData.keywords
    );

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

    const proposalId = await thesis.createThesisProposal(
      proposalData.title,
      proposalData.supervisor_id,
      proposalData.internal_co_supervisors_id,
      proposalData.external_co_supervisors_id,
      proposalData.type,
      proposalData.groups,
      proposalData.description,
      proposalData.required_knowledge,
      proposalData.notes,
      proposalData.expiration,
      proposalData.level,
      proposalData.cds,
      proposalData.keywords
    );

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
  
    // Adding "await" before the thesis.createThesisProposal
    await expect(
      thesis.createThesisProposal(
        proposalData.title,
        proposalData.supervisor_id,
        proposalData.internal_co_supervisors_id,
        proposalData.external_co_supervisors_id,
        proposalData.type,
        proposalData.groups,
        proposalData.description,
        proposalData.required_knowledge,
        proposalData.notes,
        proposalData.expiration,
        proposalData.level,
        proposalData.cds,
        proposalData.keywords
      )
    ).rejects.toEqual("The expiration date must be after the creation date");
  });
});

// 2. Test Function to get list of teachers not logged
describe('getTeacherListExcept', () => {
    let mockDb;

    beforeAll(() => {
      mockDb = require('../db');
    });

    afterAll(() => {
      jest.restoreAllMocks(); // Restore original functionality after all tests
    });
    test('returns a list of teachers excluding the specified ID', async () => {
        const excludedTeacherId = 'd3';
        const mockTeacherData = [
          { id: 'd1', name: 'Teacher1' },
          { id: 'd2', name: 'Teacher2' },
        ];

        // Mock the database query result
        mockDb.prepare().all.mockReturnValue(mockTeacherData);

        const result = await thesis.getTeacherListExcept(excludedTeacherId);

        expect(result).toEqual(mockTeacherData.filter(teacher => teacher.id !== excludedTeacherId));
        expect(mockDb.prepare().all).toHaveBeenCalledWith(excludedTeacherId);
      });
    test('handles errors and rejects the promise if the database query fails', async () => {
      const excludedTeacherId = 2;

      // Mock the database query to throw an error
      mockDb.prepare().all.mockImplementation(() => {
        throw new Error('Database query failed');
      });

      await expect(thesis.getTeacherListExcept(excludedTeacherId)).rejects.toThrow('Database query failed');
      expect(mockDb.prepare().all).toHaveBeenCalledWith(excludedTeacherId);
    });
});

describe('getExternalCoSupervisors', () => {
  let mockDb;

  beforeAll(() => {
    mockDb = require('../db');
  });

  afterAll(() => {
    jest.restoreAllMocks(); // Restore original functionality after all tests
  });
  test('returns the list of external co-supervisors', async () => {

      const mockExternalCoSupervisorData = [
        { id: '1', name: 'ExternalCoSupervisor1' },
        { id: '2', name: 'ExternalCoSupervisor2' },
      ];

      // Mock the database query result
      mockDb.prepare().all.mockReturnValue(mockExternalCoSupervisorData);

      const result = await thesis.getExternalCoSupervisorList();

      expect(result).toEqual(mockExternalCoSupervisorData);
    });
  test('handles errors and rejects the promise if the database query fails', async () => {

    // Mock the database query to throw an error
    mockDb.prepare().all.mockImplementation(() => {
      throw new Error('Database query failed');
    });

    await expect(thesis.getExternalCoSupervisorList()).rejects.toThrow('Database query failed');
  });
});

// 3. Test function to retrieve the cod_group of a teacher
describe('getGroup', () => {
    let mockDb;

    beforeAll(() => {
      mockDb = require('../db');
    });

    afterAll(() => {
      jest.restoreAllMocks(); // Restore original functionality after all tests
    });

    test('returns the cod_group for a given teacher ID', async () => {
      const teacherId = 1;
      const expectedCodGroup = 'Group1';

      // Mock the database query result
      mockDb.prepare().get.mockReturnValue({ cod_group: expectedCodGroup });

      const result = await thesis.getGroup(teacherId);

      expect(result).toBe(expectedCodGroup);
      expect(mockDb.prepare().get).toHaveBeenCalledWith(teacherId);
    });
    test('handles errors and rejects the promise if the database query fails', async () => {
      const teacherId = 1;

      // Mock the database query to throw an error
      mockDb.prepare().get.mockImplementation(() => {
        throw new Error('Database query failed');
      });

      await expect(thesis.getGroup(teacherId)).rejects.toThrow('Database query failed');
      expect(mockDb.prepare().get).toHaveBeenCalledWith(teacherId);
    });
});

describe('getAllKeywords', () => {
  test('should return an array of keywords', async () => {
    // Mock the response from the database
    const mockKeywords = [
      { keyword: 'Keyword1' },
      { keyword: 'Keyword2' },
    ];

    // Mock the SQLite database query
    db.prepare.mockReturnValueOnce({ all: jest.fn(() => mockKeywords) });

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
      { cod_degree: 'L-01' },
      { title_degree: 'Mock Degree Title' },
    ];

    // Mock the SQLite database query
    db.prepare.mockReturnValueOnce({ all: jest.fn(() => mockKeywords) });

    // Call the function
    const result = await thesis.getDegrees();

    // Assertions
    expect(result).toEqual(mockKeywords);
    expect(db.prepare).toHaveBeenCalledWith('SELECT * FROM degree');
  });
});

describe('getThesisProposal', () => {
  // Restore mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return a thesis proposal when it exists for the given proposalId and studentId', async () => {
    // Arrange
    const proposalId = 1;
    const studentId = 1;
    const expectedResult = 
    {
      "id": 1,
      "title": "Test Proposal",
      "status": "ACTIVE",
      "supervisor": {
        "id":1,
        "name": "mockSupervisorName",
        "surname": "mockSupervisorSurname",
      },
      "cosupervisors":{
        "internal": [
          {
            "id":"s12345",
            "name":"internalCoSupervisorName",
            "surname":"internalCoSupervisorSurname"
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
    jest.spyOn(require('../db').prepare(), 'get').mockReturnValueOnce(expectedResult);

    // Act
    const result = await thesis.getThesisProposal(proposalId, studentId);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  test('should return null when the thesis proposal does not exist for the given proposalId and studentId', async () => {
    // Arrange
    const proposalId = 2;
    const studentId = 2;

    // Mock the get function to return undefined (indicating no thesis proposal)
    jest.spyOn(require('../db').prepare(), 'get').mockReturnValueOnce(undefined);

    // Act
    const result = await thesis.getThesisProposal(proposalId, studentId);

    // Assert
    expect(result).toBeNull();
  });
});

describe('listThesisProposalsFromStudent', () => {
  afterEach(() => {
      jest.restoreAllMocks()
  });

  test('should return the result of the db query', async () => {
      const studentId = "1";
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
              level: 'Test Level',
              cds: 'Test CDS'
          }
      ];

      db.prepare().all.mockReturnValue(mockedData);

      const result = await thesis.listThesisProposalsFromStudent(studentId);

      expect(result).toEqual(mockedData);
      expect(db.prepare().all).toHaveBeenCalledWith(studentId);
  });

  test('should return an empty list', async () => {
      const studentId = "1";
      const mockedData = [];

      db.prepare().all.mockReturnValue(mockedData);

      const result = await thesis.listThesisProposalsFromStudent(studentId);

      expect(result).toEqual(mockedData);
      expect(db.prepare().all).toHaveBeenCalledWith(studentId);
  });
});

describe('getKeywordsOfProposal', () => {
  afterEach(() => {
      jest.restoreAllMocks()
  });

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
      const expectedResult = mockedData.map( row => row.keyword );

      db.prepare().all.mockReturnValue(mockedData);

      const result = await thesis.getKeywordsOfProposal(proposalId);

      expect(result).toEqual(expectedResult);
      expect(db.prepare().all).toHaveBeenCalledWith(proposalId);
  });

  test('should return an empty list', async () => {
      const proposalId = "1";
      const mockedData = [];
      const expectedResult = mockedData.map( row => row.keyword );

      db.prepare().all.mockReturnValue(mockedData);

      const result = await thesis.getKeywordsOfProposal(proposalId);

      expect(result).toEqual(expectedResult);
      expect(db.prepare().all).toHaveBeenCalledWith(proposalId);
  });
});

describe('getInternalCoSupervisorsOfProposal', () => {
  afterEach(() => {
      jest.restoreAllMocks()
  });

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
  afterEach(() => {
      jest.restoreAllMocks()
  });

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
  afterEach(() => {
      jest.restoreAllMocks()
  });

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
  afterEach(() => {
      jest.restoreAllMocks()
  });

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
      const expectedResult = mockedData.map( row => row.cod_group );

      db.prepare().all.mockReturnValue(mockedData);

      const result = await thesis.getProposalGroups(proposalId);

      expect(result).toEqual(expectedResult);
      expect(db.prepare().all).toHaveBeenCalledWith(proposalId);
  })
});

describe('applyForProposal', () => {
  test('applies for a proposal and resolves with applicationId', async () => {
      // Mock data
      const proposal_id = 1;
      const student_id = 's12345';

      // Call the function
      const applicationId = await thesis.applyForProposal(proposal_id, student_id);

      // Check if the function resolves with the expected applicationId
      expect(applicationId).toBe(1); // Assuming your mock database always returns applicationId 1
  });
});

describe('listThesisProposalsTeacher', () => {
  test('should return an array of thesis proposals for a teacher', async () => {
    // Mock the response from the database
    const mockProposals = [
      { proposal_id: 1, title: 'Proposal1' },
      { proposal_id: 2, title: 'Proposal2' },
    ];

    // Mock the SQLite database query
    db.prepare.mockReturnValueOnce({ all: jest.fn(() => mockProposals) });

    // Call the function
    const result = await thesis.listThesisProposalsTeacher('teacher1');

    // Assertions
    expect(result).toEqual(mockProposals);
    expect(db.prepare).toHaveBeenCalledWith('SELECT * FROM thesisProposal WHERE supervisor_id=?');
  });
  test('should return null when the thesis proposal does not exist for the given proposalId and studentId', async () => {
    // Arrange
    const proposalId = 2;
    const studentId = 2;

    // Mock the get function to return undefined (indicating no thesis proposal)
    jest.spyOn(require('../db').prepare(), 'get').mockReturnValueOnce(undefined);

    // Act
    const result = await thesis.getThesisProposal(proposalId, studentId);

    // Assert
    expect(result).toBeNull();
  });
});

describe('listApplicationsForTeacherThesisProposal', () => {
  test('should return an array of thesis applications for a teacher and proposal', async () => {
    // Mock the response from the database
    const mockApplications = [
      { application_id: 1, status: 'Approved' },
      { application_id: 2, status: 'Pending' },
    ];

    // Mock the SQLite database query
    db.prepare.mockReturnValueOnce({ all: jest.fn(() => mockApplications) });

    // Call the function
    const result = await thesis.listApplicationsForTeacherThesisProposal(1, 'd1');

    // Assertions
    expect(result).toEqual(mockApplications);
    expect(db.prepare).toHaveBeenCalledWith(`SELECT s.name, s.surname, ta.status, s.id
    FROM thesisApplication ta, thesisProposal tp, student s
    WHERE ta.proposal_id = tp.proposal_id AND s.id = ta.student_id AND ta.proposal_id=? AND tp.supervisor_id= ?`);
  });
});

describe('getStudentApplications', () => {
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should retrieve applications of a student', async () => {
    
    const student_id = 1;
    const expectedResult = [ { proposal_id: 1 }, { proposal_id: 2 } ];

    // Mock the all function to return a mock result
    jest.spyOn(require('../db').prepare(), 'all').mockReturnValueOnce(expectedResult);

    // Act
    const result = await thesis.getStudentApplications(student_id);

    // Assert
    expect(result).toEqual(expectedResult);
    expect(db.prepare).toHaveBeenCalledWith('SELECT proposal_id FROM thesisApplication WHERE student_id=?');
  });

  test('should handle an empty result set', async () => {
    // Arrange
    const student_id = 2;

    // Mock the all function to return an empty array
    jest.spyOn(require('../db').prepare(), 'all').mockReturnValueOnce([]);

    // Act
    const result = await thesis.getStudentApplications(student_id);

    // Assert
    expect(result).toEqual([]);
  });

});

describe('updateApplicationStatus', () => {
  // Restore mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should update the application status and return the row count', async () => {
    // Arrange
    const studentId = 1;
    const proposalId = 1;
    const status = 'accepted';
    const expectedRowCount = 1;

    // Mock the run function to return a mock result
    jest.spyOn(require('../db').prepare(), 'run').mockReturnValueOnce({ changes: expectedRowCount });

    // Act
    const result = await thesis.updateApplicationStatus(studentId, proposalId, status);

    // Assert
    expect(result).toEqual(expectedRowCount);
  });

  test('should handle errors and reject with an error message', async () => {
    // Arrange
    const studentId = 2;
    const proposalId = 2;
    const status = 'accepted';

    // Mock the run function to throw an error
    jest.spyOn(require('../db').prepare(), 'run').mockImplementationOnce(() => {
      throw new Error('Some error');
    });

    // Act and Assert
    await expect(thesis.updateApplicationStatus(studentId, proposalId, status)).rejects.toThrow('Some error');
  });
});

describe('rejectOtherApplications', () => {
  // Restore mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should reject other applications and return the row count', async () => {
    // Arrange
    const studentId = 1;
    const proposalId = 1;
    const expectedRowCount = 2;

    // Mock the run function to return a mock result
    jest.spyOn(require('../db').prepare(), 'run').mockReturnValueOnce({ changes: expectedRowCount });

    // Act
    const result = await thesis.rejectOtherApplications(studentId, proposalId);

    // Assert
    expect(result).toEqual(expectedRowCount);
  });

  test('should handle errors and reject with an error message', async () => {
    // Arrange
    const studentId = 2;
    const proposalId = 2;

    // Mock the run function to throw an error
    jest.spyOn(require('../db').prepare(), 'run').mockImplementationOnce(() => {
      throw new Error('Some error');
    });

    // Act and Assert
    await expect(thesis.rejectOtherApplications(studentId, proposalId)).rejects.toThrow('Some error');
  });
});
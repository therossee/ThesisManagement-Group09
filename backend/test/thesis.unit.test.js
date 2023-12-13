require('jest');

const AdvancedDate = require('../AdvancedDate');
const db = require('../db');
const thesis = require('../thesis_dao');
const UnauthorizedActionError = require("../errors/UnauthorizedActionError");
const NoThesisProposalError = require("../errors/NoThesisProposalError");
const fs = require('fs');

// Mocking the database
jest.mock('../db', () => ({
  prepare: jest.fn().mockReturnThis(),
  run: jest.fn().mockReturnValue({ lastInsertRowid: 1 }),
  all: jest.fn(),
  get: jest.fn(),
  transaction: jest.fn().mockImplementation(callback => callback),
}));

jest.mock('../configuration_dao', () => ({
    getIntegerValue: jest.fn().mockReturnValue(0),
    setValue: jest.fn(),
    KEYS: {
        VIRTUAL_OFFSET_MS: 'virtual_clock_offset'
    }
}));

jest.mock('fs');
jest.mock('path');

afterAll(() => {
  jest.restoreAllMocks(); // Restore original functionality after all tests
  jest.clearAllMocks();
});

describe('createThesisProposal', () => {
  beforeEach(() => {
    // Reset the mock before each test
    db.prepare.mockClear();
  });
  afterEach(() => {
    jest.restoreAllMocks()
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

    const proposal_details = { 
      title: proposalData.title, 
      supervisor_id: proposalData.supervisor_id, 
      type: proposalData.type,
      description: proposalData.description,
      required_knowledge: proposalData.required_knowledge,
      notes: proposalData.notes,
      expiration: proposalData.expiration,
      level: proposalData.level
    }

    const additional_details = {
      internal_co_supervisors_id: proposalData.internal_co_supervisors_id,
      external_co_supervisors_id: proposalData.external_co_supervisors_id,
      unique_groups: proposalData.groups,
      keywords: proposalData.keywords,
      cds: proposalData.cds,
    }

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
    }

    const additional_details = {
      internal_co_supervisors_id: proposalData.internal_co_supervisors_id,
      external_co_supervisors_id: proposalData.external_co_supervisors_id,
      unique_groups: proposalData.groups,
      keywords: proposalData.keywords,
      cds: proposalData.cds,
    }

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
    }

    const additional_details = {
      internal_co_supervisors_id: proposalData.internal_co_supervisors_id,
      external_co_supervisors_id: proposalData.external_co_supervisors_id,
      unique_groups: proposalData.groups,
      keywords: proposalData.keywords,
      cds: proposalData.cds,
    }

    // Adding "await" before the thesis.createThesisProposal
    await expect(
      thesis.createThesisProposal(proposal_details, additional_details)
    ).rejects.toEqual(new Error("The expiration date must be after the creation date"));
  });
});

describe('updateThesisProposal', () => {

  let proposal_id;
  beforeEach(async () => {
    const sql_teacher = `INSERT INTO teacher (id, name, surname, email, cod_group, cod_department) VALUES (?, ?, ?, ?, ?, ?)`;
    const sql_proposal = `INSERT INTO thesisProposal (title, supervisor_id, type, description, required_knowledge, notes, expiration, level, creation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const sql_keyword = `INSERT INTO proposalKeyword (proposal_id, keyword) VALUES (?, ?)`;
    db.prepare(sql_teacher).run('d1', 'supervisorName', 'supervisorSurname', 'supervisorEmail', 'Group1', 'Dep1');
    proposal_id = db.prepare(sql_proposal).run('Test Proposal', 'd1', 'Test Type', 'Test Description', 'Test Knowledge', 'Test Notes', '2025-12-31T23:59:59.999Z', 'Test Level', '2020-10-21T10:10:10.001Z');
    db.prepare(sql_keyword).run(proposal_id, 'Keyword');
  });
  afterEach(async() => {
    const sql_proposal = `DELETE FROM thesisProposal WHERE proposal_id = ?`;
    const sql_teacher = `DELETE FROM teacher WHERE id = ?`;
    const sql_keyword = `DELETE FROM proposalKeyword WHERE proposal_id = ? AND keyword = ?`;
    db.prepare(sql_proposal).run(proposal_id);
    db.prepare(sql_teacher).run('d1');
    db.prepare(sql_keyword).run(proposal_id, 'Keyword');
    jest.restoreAllMocks()
  });

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
    expect(db.prepare).toHaveBeenCalledTimes(19); // 19 queries
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
    db.prepare().run.mockReturnValueOnce({ changes: 0 });
    // Call the function and assert the result
    const result = await thesis.updateThesisProposal(proposalId, supervisorId, thesisData);
    expect(result).toBeNull();
  });
});

describe('getTeacherListExcept', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  });
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
  afterEach(() => {
    jest.restoreAllMocks()
  });
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

describe('getGroup', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  });
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
  afterEach(() => {
    jest.restoreAllMocks()
  });
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
  afterEach(() => {
    jest.restoreAllMocks()
  });
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
    const studentId = "1";
    const expectedResult =
    {
      "id": 1,
      "title": "Test Proposal",
      "status": "ACTIVE",
      "supervisor": {
        "id":"1",
        "name": "mockSupervisorName",
        "surname": "mockSupervisorSurname",
      },
      "cosupervisors":{
        "internal": [
          {
            "id": "1",
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
    jest.spyOn(require('../db').prepare(), 'get').mockReturnValueOnce(undefined).mockReturnValueOnce(expectedResult);

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
    jest.spyOn(require('../db').prepare(), 'get').mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);

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
    jest.spyOn(require('../db').prepare(), 'get').mockReturnValueOnce({proposalId: 1, student_id:"1", status: 'accepted'});

    // Act
    const result = await thesis.getThesisProposal(proposalId, studentId);

    // Assert
    expect(result).toEqual(null);
  });

});

describe('listThesisProposalsFromStudent', () => {
  beforeEach(() => {
    // Reset the mock before each test
    db.prepare.mockClear();
  });
  afterEach(() => {
      jest.restoreAllMocks()
  });

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
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test('applies for a proposal without a file and resolves with applicationId', async () => {
      // Mock data
      const proposal_id = 1;
      const student_id = '1';

      db.prepare().get.mockReturnValueOnce({ proposal_id: 1, cod_degree: 'L-01'});
      db.prepare().get.mockReturnValueOnce({ proposal_id: '1', title: 'Test Proposal', supervisor_id: 1, type: 'Test Type', description: 'Test Description', required_knowledge: 'Test Knowledge', notes: 'Test Notes', creation_date:'2020-10-21', expiration: '2023-12-31', level: 'Test Level' });
      db.prepare().get.mockReturnValueOnce();
      db.prepare().run.mockReturnValueOnce({ lastInsertRowid: 1 });


      const applicationId = await thesis.applyForProposal(proposal_id, student_id);

      expect(applicationId).toBe(1);
  });
  test('applies for a proposal with a file and resolves with an applicationId', async () => {
    
    // Mock data
    const proposal_id = 1;
    const student_id = "1";

    db.prepare().get.mockReturnValueOnce({ proposal_id: 1, cod_degree: 'L-01'});
    db.prepare().get.mockReturnValueOnce({ proposal_id: '1', title: 'Test Proposal', supervisor_id: 1, type: 'Test Type', description: 'Test Description', required_knowledge: 'Test Knowledge', notes: 'Test Notes', creation_date:'2020-10-21', expiration: '2023-12-31', level: 'Test Level' });
    db.prepare().get.mockReturnValueOnce();
    db.prepare().run.mockReturnValueOnce({ lastInsertRowid: 1 });

    // Mock the file-related functions
    const file = {
      mimetype: 'application/pdf',
      originalFilename: 'mocked-file.pdf',
      filepath: '/path/to/mocked-file.pdf',
    };
    fs.existsSync.mockReturnValue(true); // Simulate file existence
    fs.mkdirSync.mockReturnValue(null);
    fs.writeFileSync.mockImplementation(() => {});

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

    db.prepare().get.mockReturnValueOnce({ proposal_id: 1, cod_degree: 'L-01'});
    db.prepare().get.mockReturnValueOnce({ proposal_id: '1', title: 'Test Proposal', supervisor_id: 1, type: 'Test Type', description: 'Test Description', required_knowledge: 'Test Knowledge', notes: 'Test Notes', creation_date:'2020-10-21', expiration: '2023-12-31', level: 'Test Level' });
    db.prepare().get.mockReturnValueOnce();
    db.prepare().run.mockReturnValueOnce({ lastInsertRowid: 1 });

    // Mock the file-related functions
    const file = {
      mimetype: 'application/json',
      originalFilename: 'mocked-file.pdf',
      filepath: '/path/to/mocked-file.pdf',
    };
    fs.existsSync.mockReturnValue(true); // Simulate file existence
    fs.mkdirSync.mockReturnValue(null);
    fs.writeFileSync.mockImplementation(() => {});

    // Call the function
    await expect(thesis.applyForProposal(proposal_id, student_id, file)).rejects.toEqual(new Error('The file must be a PDF'));

  });
  test('handle properly file errors', async () => {
    
    // Mock data
    const proposal_id = 1;
    const student_id = "1";

    db.prepare().get.mockReturnValueOnce({ proposal_id: 1, cod_degree: 'L-01'});
    db.prepare().get.mockReturnValueOnce({ proposal_id: '1', title: 'Test Proposal', supervisor_id: 1, type: 'Test Type', description: 'Test Description', required_knowledge: 'Test Knowledge', notes: 'Test Notes', creation_date:'2020-10-21', expiration: '2023-12-31', level: 'Test Level' });
    db.prepare().get.mockReturnValueOnce();
    db.prepare().run.mockReturnValueOnce({ lastInsertRowid: 1 });

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

    db.prepare().get.mockReturnValueOnce({ proposal_id: 1, cod_degree: 'L-01'});
    db.prepare().get.mockReturnValueOnce({ proposal_id: '1', title: 'Test Proposal', supervisor_id: 1, type: 'Test Type', description: 'Test Description', required_knowledge: 'Test Knowledge', notes: 'Test Notes', creation_date:'2020-10-21', expiration: '2023-12-31', level: 'Test Level' });
    db.prepare().get.mockReturnValueOnce();
    db.prepare().run.mockReturnValueOnce();
    db.prepare().run.mockImplementation(() => { throw new Error();});

    // Mock the file-related functions
    const file = {
      mimetype: 'application/pdf',
      originalFilename: 'mocked-file.pdf',
      filepath: '/path/to/mocked-file.pdf',
    };
    fs.existsSync.mockReturnValue(true); // Simulate file existence
    fs.mkdirSync.mockReturnValue(null);
    fs.writeFileSync.mockImplementation(() => {});

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

    db.prepare().get.mockReturnValueOnce({ proposal_id: 1, cod_degree: 'L-01'});
    db.prepare().get.mockReturnValueOnce();

    await expect(thesis.applyForProposal(proposal_id, student_id)).rejects.toEqual(new Error("The proposal is not active"));;
  });
  test('applies for a proposal while he has already applied for another', async () => {
    // Mock data
    const proposal_id = 1;
    const student_id = '1';

    db.prepare().get.mockReturnValueOnce({ proposal_id: 1, cod_degree: 'L-01'});
    db.prepare().get.mockReturnValueOnce({ proposal_id: '1', title: 'Test Proposal', supervisor_id: 1, type: 'Test Type', description: 'Test Description', required_knowledge: 'Test Knowledge', notes: 'Test Notes', creation_date:'2020-10-21', expiration: '2023-12-31', level: 'Test Level' });
    db.prepare().get.mockReturnValueOnce({ proposal_id: 1, cod_degree: 'L-01', status: 'waiting for approval'});

    await expect(thesis.applyForProposal(proposal_id, student_id)).rejects.toEqual(new Error("The user has already applied for other proposals"));
  });
});

describe('listThesisProposalsTeacher', () => {
  beforeEach(() => {
    // Reset the mock before each test
    db.prepare.mockClear();
  });
  afterEach(() => {
    jest.restoreAllMocks()
  });

  test('should return an array of thesis proposals for a teacher', async () => {
    const teacherId = "1";
    // Mock the response from the database
    const mockProposals = [
      { proposal_id: 1, title: 'Proposal1' },
      { proposal_id: 2, title: 'Proposal2' },
    ];
    const currentDate = new AdvancedDate().toISOString();
    const expectedQuery = `SELECT * 
      FROM thesisProposal P
      WHERE P.supervisor_id=?
        AND NOT EXISTS (
          SELECT 1
          FROM thesisApplication A
          WHERE A.proposal_id = P.proposal_id
            AND A.status = 'accepted'
        )
        AND P.expiration > ?
        AND creation_date < ?
        AND is_archived = 0
        AND is_deleted = 0;`;
    // Mock the SQLite database query
    db.prepare.mockClear().mockReturnValueOnce({ all: jest.fn(() => mockProposals) });

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

describe('listApplicationsForTeacherThesisProposal', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  });
  test('should return an array of thesis applications for a teacher and proposal', async () => {
    // Mock the response from the database
      const mockApplications = [
          { status: 'Approved', name: 'M', surname: 'R', student_id: 's1' },
          { status: 'Pending', name: 'W', surname: 'X', student_id: 's2' }
      ];

    // Mock the SQLite database query
    db.prepare.mockClear().mockReturnValueOnce({ all: jest.fn(() => mockApplications) });

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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should retrieve active application of a student', async () => {

    const student_id = 1;
    const expectedResult = [ { proposal_id: 1 } ];

    // Mock the all function to return a mock result
    jest.spyOn(require('../db').prepare(), 'all').mockReturnValueOnce(expectedResult);

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
    jest.spyOn(require('../db').prepare(), 'all').mockReturnValueOnce([]);

    // Act
    const result = await thesis.getStudentActiveApplication(student_id);

    // Assert
    expect(result).toEqual([]);
  });

});

describe('updateApplicationStatus', () => {
  // Restore mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

    test('should update the application status and return true since row count is greater than 1', async () => {
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
        expect(result).toEqual(true);
    });
    test('should not update the application status and return false since row count changes is equal to 0', async () => {
        // Arrange
        const studentId = 1;
        const proposalId = 1;
        const status = 'accepted';
        const expectedRowCount = 0;

        // Mock the run function to return a mock result
        jest.spyOn(require('../db').prepare(), 'run').mockReturnValueOnce({ changes: expectedRowCount });

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
    jest.spyOn(require('../db').prepare(), 'run').mockImplementationOnce(() => {
      throw new Error('Some error');
    });

    // Act and Assert
    await expect(thesis.updateApplicationStatus(studentId, proposalId, status)).rejects.toThrow('Some error');
  });
});

describe('cancelOtherApplications', () => {
  // Restore mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should reject other applications and return the row count', async () => {
    // Arrange
    const studentId = "1";
    const proposalId = "1";
    const rowUpdated = [
        { proposal_id: proposalId, student_id: 's1', status: 'cancelled', id: 1 },
        { proposal_id: proposalId, student_id: 's2', status: 'cancelled', id: 2 },
    ];

    // Mock the run function to return a mock result
    jest.spyOn(require('../db').prepare(), 'all').mockReturnValueOnce([
        { proposal_id: proposalId, student_id: 's1', status: 'cancelled', id: 1 },
        { proposal_id: proposalId, student_id: 's2', status: 'cancelled', id: 2 },
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
    jest.spyOn(require('../db').prepare(), 'all').mockImplementationOnce(() => {
      throw new Error('Some error');
    });

    // Act and Assert
    await expect(thesis.cancelOtherApplications(studentId, proposalId)).rejects.toThrow('Some error');
  });
});

describe('getThesisProposalCds', () => {
    // Restore mocks after each test
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should return thesis proposal cds', async () => {
      const proposalId = 1;
      const expectedQuery = `SELECT d.cod_degree, d.title_degree FROM proposalCds p, degree d WHERE proposal_id = ? AND p.cod_degree = d.cod_degree`;
      const expectedResult = [{cds: 'TestCds'}];

      jest.spyOn(require('../db').prepare(), 'all').mockReturnValueOnce(expectedResult);

      result = await thesis.getThesisProposalCds(proposalId);

      expect(result).toEqual(expectedResult);
      expect(db.prepare).toHaveBeenCalledWith(expectedQuery);
    })

    test('should handle an empty result set', async () => {
      // Arrange
      const proposalId = 2;

      // Mock the all function to return an empty array
      jest.spyOn(require('../db').prepare(), 'all').mockReturnValueOnce([]);

      // Act
      const result = await thesis.getThesisProposalCds(proposalId);

      // Assert
      expect(result).toEqual([]);
    });

});

describe('getThesisProposalById', () => {

  afterEach(() => {
    jest.restoreAllMocks()
  });

  test('should return the thesis proposal given the id', async () => {
    const proposalId = 1;
    const expectedResult =
    {
      "id": 1,
      "title": "Test Proposal",
      "status": "ACTIVE",
      "supervisor": {
        "id":"1",
        "name": "mockSupervisorName",
        "surname": "mockSupervisorSurname",
      },
      "cosupervisors":{
        "internal": [
          {
            "id": "1",
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

    jest.spyOn(require('../db').prepare(), 'get').mockReturnValue(expectedResult);

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
  afterEach(() => {
    jest.restoreAllMocks()
  });

  test('should return teacher given thesisProposalId and teacherId', async () => {
    const proposalId = 1;
    const teacherId = "d1";
    const expectedResult = {
      id: "d1",
      surname : "SurnameMock",
      name : "NameMock",
      email : "emailMock",
      codGroup : "G1",
      cod_department : "dep1"
    }

    jest.spyOn(require('../db').prepare(), 'get').mockReturnValueOnce(undefined).mockReturnValueOnce(expectedResult);

    const result = await thesis.getThesisProposalTeacher(proposalId, teacherId);

    expect(result).toEqual(expectedResult);
  });

  test('should return null when the proposal is already assigned', async () => {
    const proposalId = 2;
    const teacheId = "d2";

    jest.spyOn(require('../db').prepare(), 'get').mockReturnValueOnce({proposalId: 2, teacheId: "d2", status: 'accepted'});

    const result = await thesis.getThesisProposalTeacher(proposalId, teacheId);

    expect(result).toEqual(null);
  })
});

describe('listApplicationsDecisionsFromStudent', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  });

  test('should return the list of applications given the studentId', async () => {
    const studentId = "1";
    const expectedResult = [{
      application_id : 1,
      proposal_id : 1,
      title : "Title test",
      level : "Test level",
      teacher_name : "MockTeacherName",
      teacher_surname : "MockTeacherSurname",
      status : "Test status",
      expiration : "2023-11-29"
    }];
    const expectedQuery = `SELECT ta.id AS "application_id", ta.proposal_id, tp.title,  tp.level, t.name AS "teacher_name" , t.surname AS "teacher_surname" ,ta.status, tp.expiration
    FROM thesisApplication ta, thesisProposal tp, teacher t
    WHERE ta.proposal_id = tp.proposal_id AND ta.student_id = ? AND t.id = tp.supervisor_id AND ta.creation_date < ?`;

    jest.spyOn(require('../db').prepare(), 'all').mockReturnValueOnce(expectedResult);

    result = await thesis.listApplicationsDecisionsFromStudent(studentId);

    expect(result).toEqual(expectedResult);
    expect(db.prepare).toHaveBeenCalledWith(expectedQuery);
  });

});

describe('deleteThesisProposalById', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test('should reject the deletion if database indicate that an application has been accepted', async () => {
        const proposalId = 1;
        const supervisorId = "d1";

        db.prepare().get.mockReturnValueOnce({ proposal_id: 1, status: 'accepted' });
        jest.clearAllMocks();

        await expect(thesis.deleteThesisProposalById(proposalId, supervisorId)).rejects.toThrow(UnauthorizedActionError);
        expect(db.prepare).toHaveBeenCalledTimes(1);
    });

    test('should reject the deletion if the delete query returns 0 rows and no thesis is found with the ID provided', async () => {
        const proposalId = 1;
        const supervisorId = "d1";

        db.prepare().get.mockReturnValueOnce(undefined);
        db.prepare().run.mockReturnValueOnce({ changes: 0 });
        db.prepare().get.mockReturnValueOnce(undefined);
        jest.clearAllMocks();

        await expect(thesis.deleteThesisProposalById(proposalId, supervisorId)).rejects.toThrow(NoThesisProposalError);
        expect(db.prepare).toHaveBeenCalledTimes(3);
    });

    test('should reject the deletion if the delete query returns 0 rows and the thesis found has a creation date in the future', async () => {
        const proposalId = 1;
        const supervisorId = "d1";

        db.prepare().get.mockReturnValueOnce(undefined);
        db.prepare().run.mockReturnValueOnce({ changes: 0 });
        db.prepare().get.mockReturnValueOnce({ proposal_id: proposalId, creation_date: new Date(2332452985000).toISOString() });
        jest.clearAllMocks();

        await expect(thesis.deleteThesisProposalById(proposalId, supervisorId)).rejects.toThrow(NoThesisProposalError);
        expect(db.prepare).toHaveBeenCalledTimes(3);
    });

    test('should reject deletion if thesis is expired', async () => {
        const proposalId = 1;
        const supervisorId = "d1";

        db.prepare().get.mockReturnValueOnce(undefined);
        db.prepare().run.mockReturnValueOnce({ changes: 0 });
        db.prepare().get.mockReturnValueOnce({ proposal_id: proposalId, creation_date: new Date().toISOString(), expiration: new Date(1701300985000).toISOString() });
        jest.clearAllMocks();

        await expect(thesis.deleteThesisProposalById(proposalId, supervisorId)).rejects.toThrow(UnauthorizedActionError);
        expect(db.prepare).toHaveBeenCalledTimes(3);
    });

    test('should reject deletion if thesis is not owned by the supervisor', async () => {
        const proposalId = 1;
        const supervisorId = "d1";

        db.prepare().get.mockReturnValueOnce(undefined);
        db.prepare().run.mockReturnValueOnce({ changes: 0 });
        db.prepare().get.mockReturnValueOnce({ proposal_id: proposalId, creation_date: new Date().toISOString(), expiration: new Date(2332452985000).toISOString(), supervisor_id: "d2" });
        jest.clearAllMocks();

        await expect(thesis.deleteThesisProposalById(proposalId, supervisorId)).rejects.toThrow(UnauthorizedActionError);
        expect(db.prepare).toHaveBeenCalledTimes(3);
    });

    test('should delete the thesis proposal and return the list of applications cancelled', async () => {
        const proposalId = 1;
        const supervisorId = "d1";

        const mockedApplications = [
            { proposal_id: proposalId, student_id: 's1', status: 'cancelled', id: 1 },
            { proposal_id: proposalId, student_id: 's2', status: 'cancelled', id: 2 },
        ];

        db.prepare().get.mockReturnValueOnce(undefined);
        db.prepare().run.mockReturnValueOnce({ changes: 1 });

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
    db.prepare().run.mockReturnValueOnce({ changes: 1 }); // Successful archiving

    const result = await thesis.archiveThesisProposalById(proposalId, supervisorId);
    
    expect(db.prepare().get).toHaveBeenCalledWith(proposalId);
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

    expect(db.prepare().get).toHaveBeenCalledWith(proposalId);
  });

  test('rejects with the appropriate error for an unsuccessful archiving (inexistent thesis)', async () => {
   
    const proposalId = 1;
    const supervisorId = 'd1';
    

    db.prepare().get.mockReturnValueOnce(null);
    db.prepare().run.mockReturnValueOnce({ changes: 0 });

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
    db.prepare().run.mockReturnValueOnce({ changes: 0 });

    db.prepare().get.mockReturnValueOnce({ creation_date: '2030-11-10T23:59:59.999Z'}); 

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
    db.prepare().run.mockReturnValueOnce({ changes: 0 });

    db.prepare().get.mockReturnValueOnce({ expiration: '2020-11-10T23:59:59.999Z'}); // Expired thesis

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
    db.prepare().run.mockReturnValueOnce({ changes: 0 });

    db.prepare().get.mockReturnValueOnce({ expiration: '2030-11-10T23:59:59.999Z', creation_date: '2020-11-10T23:59:59.999Z'}); // No thesis proposal with the given id

    await expect(thesis.archiveThesisProposalById(proposalId, supervisorId)).rejects.toThrow(new UnauthorizedActionError('You are not the supervisor of this thesis') ); // No thesis proposal with the given id
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

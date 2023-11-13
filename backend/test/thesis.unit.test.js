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

// 1. Test function to create a new thesis proposal
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
      expiration: '2023-12-31',
      level: 'Test Level',
      cds: 'Test CDS',
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
    expect(db.prepare).toHaveBeenCalledTimes(10); // 10 queries
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
      expiration: '2023-12-31',
      level: 'Test Level',
      cds: 'Test CDS',
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
    expect(db.prepare).toHaveBeenCalledTimes(4); 
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

// 3. Test Function to get list of external co-supervisors
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

// 4. Test function to search for thesis proposals

// 5. Test function to apply for a thesis proposal
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

// 6. Test function to list all applications for a teacher's thesis proposals

// 7. Test function to accept an application

// 8. Test function to reject an application

// 9. Test function to list student's application decisions

// 10. Test function to list professor's active thesis proposals

// 11. Test function to update a thesis proposal
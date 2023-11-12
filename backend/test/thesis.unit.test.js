require('jest');

const db = require('../db');
const thesis = require('../thesis_dao');

// Mocking the database
jest.mock('../db', () => ({
  prepare: jest.fn().mockReturnThis(),
  run: jest.fn().mockReturnValue({ lastInsertRowid: 1 }),
  all: jest.fn(),
  get: jest.fn(),
}));

// 1. Test function to create a new thesis proposal
describe('createThesisProposal', () => {
  test('create a thesis proposal', async () => {
    const proposalData = {
      title: 'Test Proposal',
      supervisor_id: 1,
      internal_co_supervisors_id: [2, 3],
      external_co_supervisors_id: [4, 5],
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
    test.skip('returns a list of teachers excluding the specified ID', async () => {
        const excludedTeacherId = 3;
        const mockTeacherData = [
          { id: 1, name: 'Teacher1' },
          { id: 2, name: 'Teacher2' },
          { id: 3, name: 'Teacher3' },
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

// 6. Test function to list all applications for a teacher's thesis proposals

// 7. Test function to accept an application

// 8. Test function to reject an application

// 9. Test function to list student's application decisions

// 10. Test function to list professor's active thesis proposals

// 11. Test function to update a thesis proposal
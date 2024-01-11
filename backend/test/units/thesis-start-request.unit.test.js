require('jest');

/**
 * Tests on the whole thesis start request management
 */

const db = require('../../src/services/db');
const thesis = require('../../src/dao/thesis_dao');
const {THESIS_START_REQUEST_STATUS} = require("../../src/enums/thesisStartRequest");
const UnauthorizedActionError = require('../../src/errors/UnauthorizedActionError');

// Mocking the database
jest.mock('../../src/services/db', () => ({
    prepare: jest.fn().mockReturnThis(),
    get: jest.fn(),
    run: jest.fn(),
    all: jest.fn(),
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

describe('createThesisStartRequest', () => {
    test('handles unauthorized action error if student already has a request', async () => {
      
      db.prepare().get.mockReturnValueOnce({ proposal_id: 3, cod_degree: 'LM-31'}); 
      
      // Assertions for rejected promise with UnauthorizedActionError
      await expect(
        thesis.createThesisStartRequest(
            's320213',
            1,
            3,
            'title',
            'description',
            'd279620',
            ['']
        )
      ).rejects.toThrowError(new UnauthorizedActionError('The student has already a thesis start request'));
  
      // Assertions for database interactions
      expect(db.transaction).not.toHaveBeenCalled();
    });

    test('handles unauthorized action error if proposal doesn\'t belong to the same cds of the student', async () => {
      
        db.prepare().get.mockReturnValueOnce(); 
        db.prepare().get.mockReturnValueOnce();
        
        // Assertions for rejected promise with UnauthorizedActionError
        await expect(
          thesis.createThesisStartRequest(
              's320213',
              1,
              3,
              'title',
              'description',
              'd279620',
              ['']
          )
        ).rejects.toThrowError(new UnauthorizedActionError('The proposal doesn\'t belong to the student degree'));
    
        // Assertions for database interactions
        expect(db.transaction).not.toHaveBeenCalled();
    });

    test('creates a thesis start request not related to an application', async () => {
      
        db.prepare().get.mockReturnValueOnce(); 
        db.prepare().run.mockReturnValueOnce({lastInsertRowid: 1});
        db.prepare().run.mockReturnValueOnce({});
        
        const requestId = await thesis.createThesisStartRequest(
          's318952',
          'title',
          'description',
          'd279620',
          ['']
        );
    
        expect(requestId).toBe(1);
        expect(db.transaction).toHaveBeenCalled(); 
    
    });

    test('creates a thesis start request with all parameters', async () => {
      
        db.prepare().get.mockReturnValueOnce(); 
        db.prepare().get.mockReturnValueOnce({ proposal_id: 2, cod_degree: 'LM-31'}); 
        db.prepare().run.mockReturnValueOnce({lastInsertRowid: 1});
        db.prepare().run.mockReturnValueOnce({});
  
        const requestId = await thesis.createThesisStartRequest(
          's318952',
          1,
          2,
          'title',
          'description',
          'd279620',
          ['d370335']
        );
    
        expect(requestId).toBe(1); 
        expect(db.transaction).toHaveBeenCalled();
    });  
});

describe('getStudentActiveThesisStartRequests', () => {

  test('returns active thesis start requests for the student', async () => {
   
    db.prepare().get.mockReturnValueOnce(
      { 
        id: 1, 
        title: 'Title 1', 
        student_id: 's318952',
        title: 'Title 1',
        description: 'Description 1', 
        supervisor_id: 'd279620',
        creation_date: '2021-01-01T00:00:00.000Z',
        approval_date: null,
        status: THESIS_START_REQUEST_STATUS.WAITING_FOR_APPROVAL 
      }
    ); 

    db.prepare().all.mockReturnValueOnce([{ cosupervisor_id: 'd370335' }]);

    const studentId = 's318952';
    const result = await thesis.getStudentActiveThesisStartRequests(studentId);

    const expectedQuery = `SELECT * FROM thesisStartRequest WHERE student_id=? AND creation_date < ? AND ( status=? OR status=? OR status=?)`;
    expect(db.prepare).toHaveBeenCalledWith(expectedQuery);
   
    expect(result).toEqual(
      { 
        id: 1, 
        title: 'Title 1', 
        student_id: 's318952',
        title: 'Title 1',
        description: 'Description 1', 
        supervisor_id: 'd279620',
        co_supervisors: ['d370335'],
        creation_date: '2021-01-01T00:00:00.000Z',
        approval_date: null,
        status: THESIS_START_REQUEST_STATUS.WAITING_FOR_APPROVAL 
      }
    );
  });

});


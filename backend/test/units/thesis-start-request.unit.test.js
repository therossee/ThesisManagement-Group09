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
      
      db.prepare().get.mockReturnValueOnce({ proposal_id: '3', cod_degree: 'LM-31'}); 
      
      // Assertions for rejected promise with UnauthorizedActionError
      await expect(
        thesis.createThesisStartRequest(
            's320213',
            '1',
            '3',
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
              '1',
              '3',
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
          '',
          '',
          'title',
          'description',
          'd279620',
          ['']
        );
    
        expect(requestId).toBe(1); 
    
    });

    test('creates a thesis start request with all parameters', async () => {
      
        db.prepare().get.mockReturnValueOnce(); 
        db.prepare().get.mockReturnValueOnce({ proposal_id: '2', cod_degree: 'LM-31'}); 
        db.prepare().run.mockReturnValueOnce({lastInsertRowid: 1});
        db.prepare().run.mockReturnValueOnce({});
  
        const requestId = await thesis.createThesisStartRequest(
          's318952',
          '1',
          '2',
          'title',
          'description',
          'd279620',
          ['d370335']
        );
    
        expect(requestId).toBe(1); // Replace with the expected result based on your implementation 
    });  
  });


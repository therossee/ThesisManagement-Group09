require('jest');

const db = require('../db');
const users = require('../users_dao');

// Mocking the database
jest.mock('../db', () => ({
  prepare: jest.fn().mockReturnThis(),
  get: jest.fn(),
}));

describe('getStudentDegree', () => {
 test('returns student degree for a valid student ID', async () => {
   // Mock the necessary data for a valid student ID
   const validStudentId = 'Mock id';
   const mockDegree = {
     cod_degree: 'Mock cod_degree',
     title_degree: 'Mock title_degree',
   };
   db.prepare().get.mockReturnValueOnce(mockDegree);
   // Call the function and assert the result
   const result = await users.getStudentDegree(validStudentId);
   expect(result).toEqual(mockDegree); 
 });

 // Test case for an invalid student ID
 test('returns null for an invalid student ID', async () => {
   // Mock the necessary data for an invalid student ID
   const invalidStudentId = 'Invalid id';

   // Call the function and assert the result
   const result = await users.getStudentDegree(invalidStudentId);
   expect(result).toBeNull();
 });
});

describe('getStudentById', () => {
  test('returns student info for a valid student ID', async () => {
    const validStudentId = 's1';
    const studentData = {
      id: 's1',
      surname: 'StudentSurname',
      name: 'StudentName',
      email: 'student@example.com',
    };

    // Mock the db.prepare.get function to return student info
    db.prepare().get.mockReturnValueOnce(studentData);

    // Call the function and assert the result
    const result = await users.getStudentById(validStudentId);

    // Check if the db.prepare.get function was called with the correct arguments
    expect(db.prepare().get).toHaveBeenCalledWith(validStudentId);

    // Check if the function resolves with the expected student info
    expect(result).toEqual(studentData);
  });

  test('returns null for an invalid student ID', async () => {
    
    const invalidStudentId ='1'/* invalid student ID */;

    // Mock the db.prepare.get function to return null
    db.prepare().get.mockReturnValueOnce(null);

    // Call the function and assert the result
    const result = await users.getStudentById(invalidStudentId);

    // Check if the db.prepare.get function was called with the correct arguments
    expect(db.prepare().get).toHaveBeenCalledWith(invalidStudentId);

    // Check if the function resolves with null
    expect(result).toBeNull();
  });
});

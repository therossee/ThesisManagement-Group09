require('jest');

const db = require('../db');
const users = require('../users_dao');

describe('getUser function', () => {
    test('should return student data if the email and password are correct', async () => {
      const mockRow = {
        id: 's294301',
        surname: 'Rossi',
        name: 'Abbondanzio',
        gender: 'Male',
        nationality: 'Italian',
        email: 'rossi.abbondanzio@email.com',
        cod_degree: 'L-07',
        enrollment_year: '2020',
      };
  
      const result = await users.getUser('rossi.abbondanzio@email.com', 's294301');
  
      expect(result).toEqual(mockRow);
    });
    test('should return teacher data if the email and password are correct', async () => {
        const mockRow = {
          id: 'd279620',
          surname: 'Rossi',
          name: 'Marco',
          email: 'rossi.marco@email.com',
          cod_group: 'Group1',
          cod_department: 'Dep1',
        };
  
        const result = await users.getUser('rossi.marco@email.com', 'd279620');
    
        expect(result).toEqual(mockRow);
    });
    test('should return false if the email does not exist in the database', async () => {
  
      const result = await users.getUser('mock@example.com', '1');
  
      expect(result).toBe(false);
    });
    test('should return false if the password is incorrect', async () => {
        const mockRow = {
          id: 'd279620',
          surname: 'Rossi',
          name: 'Marco',
          email: 'rossi.marco@email.com',
          cod_group: 'Group1',
          cod_department: 'Dep1',
        };
    
        // Provide an incorrect password (different from the user's ID)
        const result = await users.getUser('rossi.marco@email.com', 'incorrect_password');
    
        expect(result).toBe(false);
    });   
  });
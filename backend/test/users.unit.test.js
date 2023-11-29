require('jest');

const db = require('../db');
const users = require('../users_dao');

describe('getUser function', () => {
        beforeEach(() => {
            db.prepare('INSERT INTO degree (cod_degree, title_degree) VALUES (?, ?)').run('L-01', 'Mock Degree Name');
            db.prepare('INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
              .run('s1', 'mockStudentSurname', 'mockStudentName', 'MALE', 'Italian', 'mockStudentEmail@email.com', 'L-01', 2020);
            db.prepare('INSERT INTO teacher (id, surname, name, email, cod_group, cod_department) VALUES (?, ?, ?, ?, ?, ?)')
              .run('d1', 'mockTeacherSurname', 'mockTeacherName', 'mockTeacherEmail@email.com', 'Group1', 'Dep1');

        });
        afterEach(() => {
             // Delete data from the student table
            db.prepare('DELETE FROM student WHERE id = ?').run('s1');
             // Delete data from the degree table
            db.prepare('DELETE FROM degree WHERE cod_degree = ?').run('L-01');
             // Delete data from the teacher table
            db.prepare('DELETE FROM teacher WHERE id = ?').run('d1');
        });
    test('should return student data if the email and password are correct', async () => {

      const result = await users.getUser('mockStudentEmail@email.com', 's1');

      expect(result).toEqual({
        id: 's1',
        surname: 'mockStudentSurname',
        name: 'mockStudentName',
        gender: 'MALE',
        nationality: 'Italian',
        email: 'mockStudentEmail@email.com',
        cod_degree: 'L-01',
        enrollment_year: 2020,
      });
    });
    test('should return teacher data if the email and password are correct', async () => {
      const result = await users.getUser('mockTeacherEmail@email.com', 'd1');

      expect(result).toEqual({
        id: 'd1',
        surname: 'mockTeacherSurname',
        name: 'mockTeacherName',
        email: 'mockTeacherEmail@email.com',
        cod_group: 'Group1',
        cod_department: 'Dep1',
      });
    });
    test('should return false if the email does not exist in the database', async () => {

      const result = await users.getUser('mock@example.com', '1');

      expect(result).toBe(false);
    });
    test('should return false if the password is incorrect', async () => {
        // Provide an incorrect password (different from the user's ID)
        const result = await users.getUser('mockStudentEmail@email.com', 's0');

        expect(result).toBe(false);
    });
  });

  describe('getStudentDegree', () => {

    // Before each test, initialize the database
    beforeEach(async () => {
      const query_degree = 'INSERT INTO degree(cod_degree, title_degree) VALUES (?, ?)';
      const query_student = 'INSERT INTO student(id, name, surname, email, gender, nationality, cod_degree, enrollment_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      db.prepare(query_degree).run('L-01', 'Mock Degree Name');
      db.prepare(query_student).run('Mock id', 'Mock name', 'Mock surname', 'Mock email', 'Mock gender', 'Mock nationality', 'L-01', 2020 );
    });
  
    afterEach(() => {
      // Delete data from the student table
      db.prepare('DELETE FROM student WHERE id = ?').run('Mock id');
      // Delete data from the degree table
      db.prepare('DELETE FROM degree WHERE cod_degree = ?').run('L-01');
    });
  
    test('returns student degree for a valid student ID', async () => {
      // Mock the necessary data for a valid student ID
      const validStudentId = 'Mock id';
  
      // Call the function and assert the result
      const result = await users.getStudentDegree(validStudentId);
      expect(result).toEqual({
        cod_degree: 'L-01',
        title_degree: 'Mock Degree Name',
      }); 
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
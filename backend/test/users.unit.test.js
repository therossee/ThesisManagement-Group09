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
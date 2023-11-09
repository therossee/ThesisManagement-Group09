require('jest');
const db = require('../db');

describe('[DATABASE] Check database access using SQLite3', () => {
    test('should open the database without errors', () => {
        expect(db).toBeDefined();
      });
    test('should return the list of students', async () => {
        const rows = await db.prepare('SELECT * FROM student').all();

        expect(rows.length).toBeGreaterThan(0);
        for (const row of rows) {
            expect(row).toHaveProperty('studentId');
            expect(row).toHaveProperty('surname');
            expect(row).toHaveProperty('name');
            expect(row).toHaveProperty('gender');
            expect(row).toHaveProperty('nationality');
            expect(row).toHaveProperty('email');
            expect(row).toHaveProperty('cod_degree');
            expect(row).toHaveProperty('enrollment_year');
            
        }
    });

    test('should return the list of teachers', async () => {
        const rows = await db.prepare('SELECT * FROM teacher').all();

        expect(rows.length).toBe(0);
        
    });
});
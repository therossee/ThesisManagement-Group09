require('jest');
// [i] This line setup the test database + load the environment variables. DON'T (RE)MOVE IT
const {resetTestDatabase} = require('../integration_config');
const db = require('../../src/services/db');


describe('[DATABASE] Check database access using SQLite3', () => {
    beforeEach(() => {
        // Be sure that we are using a full clean database before each test
        resetTestDatabase();
    });

    test('should open the database without errors', () => {
        expect(db).toBeDefined();
    });
    test('should return the list of students', async () => {
        const rows = await db.prepare('SELECT * FROM student').all();

        expect(rows.length).toBeGreaterThan(0);

        for (const row of rows) {
            expect(row).toHaveProperty('id');
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

        expect(rows.length).toBeGreaterThan(0);

        for (const row of rows) {
            expect(row).toHaveProperty('id');
            expect(row).toHaveProperty('surname');
            expect(row).toHaveProperty('name');
            expect(row).toHaveProperty('email');
            expect(row).toHaveProperty('cod_group');
            expect(row).toHaveProperty('cod_department');
        }

    });
    test('should log verbose output when TM_VERBOSE_SQLITE is set to true', () => {
        // Mock console.log to spy on its calls
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
        // Set TM_VERBOSE_SQLITE to true
        process.env.TM_VERBOSE_SQLITE = 'true';
    
        // Re-import the module to apply the updated TM_VERBOSE_SQLITE
        const newDb = require('../../src/services/db');

        newDb.prepare('SELECT * FROM student').all();
    
        // Assertions
        expect(consoleLogSpy).toHaveBeenCalled();
        // Add any specific assertions for the console.log output
    
        // Restore the original implementation of console.log
        consoleLogSpy.mockRestore();
    });
});


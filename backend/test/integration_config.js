// Setup environment for integration tests
if (!process.env.TM_DOTENV_KEY?.endsWith('ci')) {
    process.env.TM_DOTENV_KEY = process.env.TM_DOTENV_KEY_CI;
}
const dotenv = require("dotenv");
dotenv.config({ DOTENV_KEY: process.env.TM_DOTENV_KEY });

/** Import modules */
const fs = require('fs');
const db = require('../db');
const path = require("path");

/** Reset test database */
function resetTestDatabase() {
    const sqlFilePath = path.join(__dirname, '../../database/scripts/init_test.sql');
    const initTestDBSql = fs.readFileSync(sqlFilePath).toString();
    db.exec(initTestDBSql);
}
resetTestDatabase();

/** Extend Jest */

/**
 * Check if the received value is an integer close to the expected value.
 *
 * @param {number} received
 * @param {number} expected
 * @param {number} delta
 *
 * @return {{pass: boolean, message: () => string}}
 */
function toBeAnIntegerCloseTo(received, expected, delta) {
    const pass = Number.isInteger(received) && Math.abs(received - expected) <= delta;
    if (pass) {
        return {
            message: () => `expected ${received} not to be an integer close to ${expected} (with a tolerance of ${delta})`,
            pass: true,
        };
    } else {
        return {
            message: () => `expected ${received} to be an integer close to ${expected} (with a tolerance of ${delta})`,
            pass: false,
        };
    }
}
expect.extend({ toBeAnIntegerCloseTo });

module.exports = {
    resetTestDatabase
};

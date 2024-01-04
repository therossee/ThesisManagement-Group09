// Setup environment for integration tests
if (!process.env.TM_DOTENV_KEY?.endsWith('ci')) {
    process.env.TM_DOTENV_KEY = process.env.TM_DOTENV_KEY_CI;
}
const dotenv = require("dotenv");
dotenv.config({DOTENV_KEY: process.env.TM_DOTENV_KEY});

/** Import modules */
const fs = require('fs');
const db = require('../src/services/db');
const path = require("path");
const imap = require("imap");

/** Reset test database */
function resetTestDatabase() {
    const sqlFilePath = path.join(__dirname, '../../database/scripts/init_test.sql');
    const initTestDBSql = fs.readFileSync(sqlFilePath).toString();
    db.exec(initTestDBSql);
}
resetTestDatabase();


/** IMAP client */
const imapClient = new imap({
    user: process.env.TM_SMTP_USERNAME,
    password: process.env.TM_SMTP_PASSWORD,
    host: "imap.ethereal.email", // IMAP server host
    port: 993, // IMAP server port
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
});
let imapClientIsReady = false;

async function initImapClient() {
    return new Promise((resolve, reject) => {
        imapClient.once("ready", resolve);
        imapClient.once("error", reject);

        imapClient.connect();
    }).then( r => {
        imapClientIsReady = true;
        return r;
    });
}
async function closeImapClient() {
    return new Promise((resolve, reject) => {
        imapClient.once("close", resolve);
        imapClient.once("error", reject);

        imapClient.end();
    }).then( r => {
        imapClientIsReady = false;
        return r;
    });
}

/**
 * Open INBOX mailbox
 *
 * @return {Promise<import("imap").Box>}
 */
async function openInbox() {
    if (!imapClientIsReady) {
        throw new Error('IMAP client is not ready, please call initImapClient() first');
    }

    return new Promise((resolve, reject) => {
        imapClient.openBox("INBOX", true, (err, box) => {
            if (err) {
                reject(err);
            } else {
                resolve(box);
            }
        });
    });
}

/**
 * Search emails inside the INBOX mailbox
 *
 * @param {string} dest - Destination email address (TO) of the emails to search
 * @param {string} subject - Email subject (SUBJECT) of the emails to search
 *
 * @return {Promise<unknown>}
 */
async function searchEmails(dest, subject) {
    await openInbox();

    return new Promise((resolve, reject) => {
        imapClient.search(['UNSEEN', ['TO', dest], ['SUBJECT', subject]], (err, uids) => {
            if (err) {
                reject(err);
            } else {
                resolve(uids);
            }
        });
    });
}


/** SAML Passport mock */
jest.mock('passport-saml', () => {
    const Strategy = jest.requireActual('passport-saml').Strategy;
    return {
        Strategy: class MockStrategy extends Strategy {
            authenticate(req, _options) {
                if (!req.headers['x-user-id'] || !req.headers['x-user-name']) {
                    console.info('Intercept Passport-SAML authentication but refuse it');
                    this.fail('Missing mock authentication headers');
                }

                const user = {
                    id: req.headers['x-user-id'],
                    name: req.headers['x-user-name'],
                    roles: req.headers['x-user-roles']?.split(',') ?? [],
                };

                console.info('Mocking Passport-SAML authentication with user:', user);

                this.success(user);
            }
        },
    };
});


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

expect.extend({toBeAnIntegerCloseTo});

module.exports = {
    resetTestDatabase,
    searchEmails,
    initImapClient,
    closeImapClient
};

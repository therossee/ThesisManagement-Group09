'use strict';
const db = require('../services/db');

/* Data Access Object (DAO) module for accessing configuration data */

/**
 * Return the value of the configuration key as a number
 *
 * @param {string} key
 * @return {number|null}
 */
exports.getIntegerValue = (key) => {
    const sql = 'SELECT value FROM configuration WHERE key = ?';

    const res = db.prepare(sql).get(key);
    if (res) {
        return parseInt(res.value);
    } else {
        return null;
    }
};

/**
 * Upsert the value of the configuration key
 *
 * @param {string} key
 * @param {string} value
 */
exports.setValue = (key, value) => {
    const sql = 'INSERT OR REPLACE INTO configuration (value, key) VALUES (?, ?)';

    db.prepare(sql).run(value, key);
};

exports.KEYS = {
    VIRTUAL_OFFSET_MS: 'virtual_clock_offset'
};

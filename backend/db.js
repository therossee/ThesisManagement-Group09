'use strict';

/** DB access module **/

const sqlite = require('sqlite3');

// open the database
exports.db = new sqlite.Database('../database/database.sqlite', (err) => {
  if (err) throw err;
});

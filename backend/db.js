const betterSqlite3 = require('better-sqlite3');
const path = require("path");

const PATH_DB = path.join(__dirname, process.env.TM_DATABASE_PATH);
const options = {
    fileMustExist: true,
    verbose: (...args) => {
        if (process.env.TM_VERBOSE_SQLITE !== 'true') {
            return;
        }

        console.log(...args);
    }
};

const db = betterSqlite3(PATH_DB, options);

module.exports = db;

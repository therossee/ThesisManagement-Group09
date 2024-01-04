const user = require('./user');
const application = require('./application');

module.exports = {
    ...user,
    ...application
};

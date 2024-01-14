const user = require('./user');
const application = require('./application');
const startRequest = require('./thesisStartRequest');

module.exports = {
    ...user,
    ...application,
    ...startRequest
};

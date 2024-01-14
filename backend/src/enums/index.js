const user = require('./user');
const application = require('./application');
const thesisStartRequest = require('./thesisStartRequest');

module.exports = {
    ...user,
    ...application,
    ...thesisStartRequest,
};

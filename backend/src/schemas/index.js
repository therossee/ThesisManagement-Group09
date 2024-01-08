const schemasVirtualClock = require('./virtual-clock');
const schemasThesisProposal = require('./thesis-proposal');
const schemasThesisStartRequest = require('./thesis-start-request');

module.exports = {
    ...schemasVirtualClock,
    ...schemasThesisProposal,
    ...schemasThesisStartRequest
};

const schemasVirtualClock = require('./virtual-clock');
const schemasThesisProposal = require('./thesis-proposal');

module.exports = {
    ...schemasVirtualClock,
    ...schemasThesisProposal
};

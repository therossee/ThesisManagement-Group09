const AppError = require('./AppError');

class NoThesisProposalError extends AppError {
    /**
     * @param {number | string} id
     */
    constructor(id) {
        super(`No thesis proposal with id ${id} found`, 404);
    }
}

module.exports = NoThesisProposalError;

const AppError = require('./AppError');

class NoThesisStartRequestError extends AppError {
    /**
     * @param {number | string} id
     */
    constructor(id) {
        super(`No thesis start request with id ${id} found or you are not authorized to access it.`, 404);
    }
}

module.exports = NoThesisStartRequestError;

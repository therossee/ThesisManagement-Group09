const AppError = require('./AppError');

class UnauthorizedActionError extends AppError {
    /**
     * @param {string} message
     */
    constructor(message) {
        super(message, 403);
    }
}

module.exports = UnauthorizedActionError;

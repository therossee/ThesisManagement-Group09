const AppError = require('./AppError');

class InvalidActionError extends AppError {
    constructor(msg) {
        super(msg, 400);
    }
}

module.exports = InvalidActionError;

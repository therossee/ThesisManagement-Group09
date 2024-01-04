const AppError = require('./AppError');

class InvalidNewVirtualOffsetError extends AppError {
    constructor() {
        super("The offset provided is invalid since it's in the past of the current virtual date", 400);
    }
}

module.exports = InvalidNewVirtualOffsetError;

class AppError extends Error {
    /**
     * @param {string} message
     * @param {number} httpStatus
     */
    constructor(message, httpStatus) {
        super(message);

        Object.defineProperty(this, 'httpStatus', { value: httpStatus });
    }

    /**
     * @param {import('express').Response} res
     */
    sendHttpResponse(res) {
        return res.status(this.httpStatus).send( this.toJSON() );
    }

    /**
     * Format the error in a simple JSON object
     *
     * @return {object}
     */
    toJSON() {
        return {
            message: this.message
        };
    }
}

module.exports = AppError;

const { ZodError } = require("zod");
const AppError = require("../errors/AppError");

function errorHandler(err, req, res, _next) {
    if (res.headersSent) {
        return;
    }

    switch (true) {
        case err instanceof AppError:
            err.sendHttpResponse(res);
            break;
        case err instanceof ZodError:
            res.status(400).json({ message: 'Some properties are missing or invalid.', errors: err.issues });
            break;
        default:
            console.error(err);
            res.status(500).json('Internal Server Error');
    }
}

module.exports = {
    errorHandler
};

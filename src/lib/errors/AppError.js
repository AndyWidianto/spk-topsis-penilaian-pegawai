
export class AppError extends Error {

    constructor(message, statusCode, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.details = details;
        Error.captureStackTrace(this, this.constructor)
    }
}
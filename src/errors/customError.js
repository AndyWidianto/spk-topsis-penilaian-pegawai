
export default class CustomError extends Error {

    constructor(message, code) {
        super(message);
        this.statusCode = code;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
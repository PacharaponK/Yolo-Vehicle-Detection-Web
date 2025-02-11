"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message = "Internal Server Error", status = 500) {
        super(message);
        this.status = status;
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;

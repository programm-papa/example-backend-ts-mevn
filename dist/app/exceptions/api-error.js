"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(status, errorType, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
        this.errorType = errorType;
    }
    static BadRequest(status, errorType, message, errors = []) {
        return new ApiError(status, errorType, message, errors);
    }
}
exports.default = ApiError;

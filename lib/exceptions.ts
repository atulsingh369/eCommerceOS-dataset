export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly code: string;

    constructor(message: string, statusCode: number, code: string = "UNKNOWN_ERROR", isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}

export class APIError extends AppError {
    constructor(message: string, statusCode = 500, code = "API_ERROR") {
        super(message, statusCode, code);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404, "NOT_FOUND");
    }
}

export class ValidationError extends AppError {
    constructor(message = "Validation failed") {
        super(message, 400, "VALIDATION_ERROR");
    }
}

export class DatabaseError extends AppError {
    constructor(message: string, public readonly originalError?: any) {
        super(message, 500, "DATABASE_ERROR");
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401, "UNAUTHORIZED");
    }
}

import { AppError, NotFoundError, ValidationError, DatabaseError, UnauthorizedError } from "@/lib/exceptions";

describe("Error Classes", () => {
    it("AppError sets properties correctly", () => {
        const error = new AppError("test message", 418, "TEAPOT_ERROR");
        expect(error.message).toBe("test message");
        expect(error.statusCode).toBe(418);
        expect(error.code).toBe("TEAPOT_ERROR");
        expect(error.isOperational).toBe(true);
    });

    it("NotFoundError defaults", () => {
        const error = new NotFoundError();
        expect(error.statusCode).toBe(404);
        expect(error.code).toBe("NOT_FOUND");
    });

    it("ValidationError defaults", () => {
        const error = new ValidationError();
        expect(error.statusCode).toBe(400);
        expect(error.code).toBe("VALIDATION_ERROR");
    });

    it("DatabaseError defaults", () => {
        const error = new DatabaseError("Database error occurred");
        expect(error.statusCode).toBe(500);
        expect(error.code).toBe("DATABASE_ERROR");
    });

    it("UnauthorizedError defaults", () => {
        const error = new UnauthorizedError();
        expect(error.statusCode).toBe(401);
        expect(error.code).toBe("UNAUTHORIZED");
    });
});

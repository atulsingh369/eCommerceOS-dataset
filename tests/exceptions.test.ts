import { AppError, APIError, NotFoundError } from "@/lib/exceptions";

describe("Exception Classes", () => {
    it("AppError sets properties correctly", () => {
        const error = new AppError("Test Error", 418, "TEST_ERROR", false);
        expect(error.message).toBe("Test Error");
        expect(error.statusCode).toBe(418);
        expect(error.code).toBe("TEST_ERROR");
        expect(error.isOperational).toBe(false);
        expect(error).toBeInstanceOf(Error);
    });

    it("APIError defaults to 500", () => {
        const error = new APIError("Broke");
        expect(error.statusCode).toBe(500);
        expect(error).toBeInstanceOf(AppError);
    });

    it("NotFoundError sets 404", () => {
        const error = new NotFoundError();
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("Resource not found");
    });
});

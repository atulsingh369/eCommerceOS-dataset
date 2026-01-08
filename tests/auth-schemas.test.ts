import { LoginSchema, RegisterSchema, ResetPasswordSchema } from "../lib/validations/auth";

describe("Auth Schemas", () => {
    describe("LoginSchema", () => {
        it("validates correct input", () => {
            const result = LoginSchema.safeParse({
                email: "test@example.com",
                password: "password123"
            });
            expect(result.success).toBe(true);
        });

        it("fails on invalid email", () => {
            const result = LoginSchema.safeParse({
                email: "invalid-email",
                password: "password123"
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe("Please enter a valid email address");
            }
        });

        it("fails on empty password", () => {
            const result = LoginSchema.safeParse({
                email: "test@example.com",
                password: ""
            });
            expect(result.success).toBe(false);
        });
    });

    describe("RegisterSchema", () => {
        it("validates correct input", () => {
            const result = RegisterSchema.safeParse({
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                password: "password123"
            });
            expect(result.success).toBe(true);
        });

        it("fails on short password", () => {
            const result = RegisterSchema.safeParse({
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                password: "123"
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain("must be at least 6 characters");
            }
        });

        it("fails on short name", () => {
            const result = RegisterSchema.safeParse({
                firstName: "J",
                lastName: "Doe",
                email: "john@example.com",
                password: "password123"
            });
            expect(result.success).toBe(false);
        });
    });

    describe("ResetPasswordSchema", () => {
        it("validates correct email", () => {
            const result = ResetPasswordSchema.safeParse({
                email: "test@example.com"
            });
            expect(result.success).toBe(true);
        });
    });
});

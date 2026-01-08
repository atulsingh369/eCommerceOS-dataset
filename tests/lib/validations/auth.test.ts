import { LoginSchema, RegisterSchema } from "@/lib/validations/auth";

describe("Auth Validation Schemas", () => {
    describe("LoginSchema", () => {
        it("validates valid login data", () => {
            const result = LoginSchema.safeParse({
                email: "test@example.com",
                password: "password123"
            });
            expect(result.success).toBe(true);
        });

        it("requires email and password", () => {
            const result = LoginSchema.safeParse({});
            expect(result.success).toBe(false);
        });
    });

    describe("RegisterSchema", () => {
        it("validates valid registration data", () => {
            const result = RegisterSchema.safeParse({
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                password: "password123"
            });
            expect(result.success).toBe(true);
        });

        it("enforces name checks", () => {
            const result = RegisterSchema.safeParse({
                firstName: "J", // too short
                lastName: "Doe",
                email: "john@example.com",
                password: "password123"
            });
            expect(result.success).toBe(false);
        });
    });
});

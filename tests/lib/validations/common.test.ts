import { emailSchema, phoneSchema, pincodeSchema, passwordSchema, nameSchema, requiredString } from "@/lib/validations/common";

describe("Common Validation Schemas", () => {
    describe("emailSchema", () => {
        it("validates correct emails", () => {
            expect(emailSchema.safeParse("test@example.com").success).toBe(true);
        });

        it("rejects invalid emails", () => {
            expect(emailSchema.safeParse("invalid-email").success).toBe(false);
        });
    });

    describe("passwordSchema", () => {
        it("validates passwords > min length", () => {
            // Assuming min length is 6 based on constants
            expect(passwordSchema.safeParse("123456").success).toBe(true);
        });

        it("rejects short passwords", () => {
            expect(passwordSchema.safeParse("123").success).toBe(false);
        });
    });

    describe("phoneSchema", () => {
        it("validates 10 digit numbers", () => {
            expect(phoneSchema.safeParse("1234567890").success).toBe(true);
        });

        it("rejects non-numeric characters", () => {
            expect(phoneSchema.safeParse("12345abcde").success).toBe(false);
        });

        it("rejects wrong length", () => {
            expect(phoneSchema.safeParse("123").success).toBe(false);
        });
    });

    describe("pincodeSchema", () => {
        it("validates 6 digit numbers", () => {
            expect(pincodeSchema.safeParse("123456").success).toBe(true);
        });

        it("rejects wrong length", () => {
            expect(pincodeSchema.safeParse("1234").success).toBe(false);
        });
    });
});

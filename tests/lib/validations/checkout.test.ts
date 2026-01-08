import { checkoutSchema } from "@/lib/validations/checkout";

describe("Checkout Validation", () => {
    const validData = {
        displayName: "John Doe",
        email: "john@example.com",
        line1: "123 Main St",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        phoneNumber: "9876543210"
    };

    it("should validate a correct checkout payload", () => {
        const result = checkoutSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it("should fail if required fields are missing", () => {
        const result = checkoutSchema.safeParse({});
        expect(result.success).toBe(false);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            expect(errors.displayName).toBeDefined();
            expect(errors.email).toBeDefined();
            expect(errors.line1).toBeDefined();
            expect(errors.city).toBeDefined();
            expect(errors.state).toBeDefined();
            expect(errors.pincode).toBeDefined();
            expect(errors.phoneNumber).toBeDefined();
        }
    });

    it("should fail invalid email", () => {
        const result = checkoutSchema.safeParse({ ...validData, email: "invalid-email" });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.flatten().fieldErrors.email).toBeDefined();
        }
    });

    it("should fail invalid indian phone number (not 10 digits)", () => {
        const result = checkoutSchema.safeParse({ ...validData, phoneNumber: "123" });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.flatten().fieldErrors.phoneNumber).toBeDefined();
        }
    });

    it("should fail invalid indian phone number (starts with 0-5 implies not standard mobile usually, but regex might just check digits)", () => {
        // Our current regex in common.ts is /^\d{10}$/ so it just checks for 10 digits.
        // Let's test non-digits
        const result = checkoutSchema.safeParse({ ...validData, phoneNumber: "abcdefghij" });
        expect(result.success).toBe(false);
    });

    it("should fail invalid pincode (not 6 digits)", () => {
        const result = checkoutSchema.safeParse({ ...validData, pincode: "123" });
        expect(result.success).toBe(false);
    });

    it("should fail empty strings for required fields", () => {
        const result = checkoutSchema.safeParse({ ...validData, city: "" });
        expect(result.success).toBe(false);
    });
});

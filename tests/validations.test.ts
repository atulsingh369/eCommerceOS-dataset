import { checkoutSchema } from "@/lib/validations/checkout";
import { profileSchema } from "@/lib/validations/profile";
import { searchParamsSchema } from "@/lib/validations/chat";

describe("Validations", () => {
    describe("Checkout Schema", () => {
        it("validates correct checkout data", () => {
            const valid = {
                displayName: "John Doe",
                email: "john@example.com",
                line1: "123 St",
                city: "NY",
                state: "NY",
                pincode: "123456",
                phoneNumber: "1234567890"
            };
            const result = checkoutSchema.safeParse(valid);
            expect(result.success).toBe(true);
        });

        it("fails on invalid pincode", () => {
            const invalid = {
                displayName: "John",
                email: "john@example.com",
                line1: "123 St",
                city: "NY",
                state: "NY",
                pincode: "123", // Too short
                phoneNumber: "1234567890"
            };
            const result = checkoutSchema.safeParse(invalid);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toContain("pincode");
            }
        });
    });

    describe("Profile Schema", () => {
        it("validates partial updates", () => {
            const valid = {
                displayName: "Jane Doe",
                // Optional fields omitted
            };
            const result = profileSchema.safeParse(valid);
            expect(result.success).toBe(true);
        });

        it("fails on invalid phone number", () => {
            const invalid = {
                displayName: "Jane",
                phoneNumber: "123"
            };
            const result = profileSchema.safeParse(invalid);
            expect(result.success).toBe(false);
        });
    });

    describe("Chat Schema", () => {
        it("validates search query", () => {
            const valid = { query: "laptop" };
            expect(searchParamsSchema.safeParse(valid).success).toBe(true);
        });
    });
});

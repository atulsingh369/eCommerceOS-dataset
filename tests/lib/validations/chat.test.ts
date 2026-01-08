import { searchParamsSchema, compareProductsParamsSchema } from "@/lib/validations/chat";

describe("Chat Validation", () => {
    describe("searchParamsSchema", () => {
        it("should validate valid query", () => {
            const result = searchParamsSchema.safeParse({ query: "laptop" });
            expect(result.success).toBe(true);
        });

        it("should fail if query is missing", () => {
            const result = searchParamsSchema.safeParse({});
            expect(result.success).toBe(false);
        });

        it("should fail if query is not a string", () => {
            const result = searchParamsSchema.safeParse({ query: 123 });
            expect(result.success).toBe(false);
        });
    });

    describe("compareProductsParamsSchema", () => {
        const validProduct = {
            id: "1",
            name: "Test Product",
            price: 100,
            rating: 4.5,
            reviews: 10
        };

        it("should validate valid products array", () => {
            const result = compareProductsParamsSchema.safeParse({
                products: [validProduct]
            });
            expect(result.success).toBe(true);
        });

        it("should validate empty products array", () => {
            const result = compareProductsParamsSchema.safeParse({
                products: []
            });
            expect(result.success).toBe(true);
        });

        it("should fail if product is missing required fields", () => {
            const result = compareProductsParamsSchema.safeParse({
                products: [{ id: "1" }] // missing name, price etc
            });
            expect(result.success).toBe(false);
        });

        it("should fail if products is not an array", () => {
            const result = compareProductsParamsSchema.safeParse({
                products: "not-an-array"
            });
            expect(result.success).toBe(false);
        });
    });
});

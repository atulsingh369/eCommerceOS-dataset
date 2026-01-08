import { formatPrice, formatDate, truncate, slugify, calculatePercentage } from "@/lib/utils";

describe("Utils", () => {
    describe("formatPrice", () => {
        it("formats standard prices", () => {
            expect(formatPrice(100)).toBe("₹100.00");
            expect(formatPrice(100.5)).toBe("₹100.50");
        });

        it("handles zero", () => {
            expect(formatPrice(0)).toBe("₹0.00");
        });

        it("handles undefined/null/NaN", () => {
            expect(formatPrice(undefined)).toBe("₹0.00");
            expect(formatPrice(null)).toBe("₹0.00");
            expect(formatPrice(NaN)).toBe("₹0.00");
        });
    });

    describe("formatDate", () => {
        it("formats Date objects", () => {
            const d = new Date("2023-01-01");
            expect(formatDate(d)).toBe("January 1, 2023");
        });

        it("formats strings", () => {
            expect(formatDate("2023-01-01")).toBe("January 1, 2023");
        });

        it("handles invalid dates", () => {
            expect(formatDate("invalid")).toBe("");
        });

        it("handles null/undefined", () => {
            expect(formatDate(null)).toBe("");
            expect(formatDate(undefined)).toBe("");
        });
    });

    describe("truncate", () => {
        it("truncates long strings", () => {
            expect(truncate("hello world", 5)).toBe("hello...");
        });

        it("returns short strings as is", () => {
            expect(truncate("hello", 10)).toBe("hello");
        });

        it("handles null/undefined", () => {
            expect(truncate(null, 5)).toBe("");
        });
    });

    describe("slugify", () => {
        it("slugifies simple strings", () => {
            expect(slugify("Hello World")).toBe("hello-world");
        });

        it("removes special characters", () => {
            expect(slugify("Hello @ World!")).toBe("hello-world");
        });
    });

    describe("calculatePercentage", () => {
        it("calculates percentage", () => {
            expect(calculatePercentage(50, 200)).toBe(25);
        });

        it("handles divide by zero", () => {
            expect(calculatePercentage(50, 0)).toBe(0);
        });
    });
});

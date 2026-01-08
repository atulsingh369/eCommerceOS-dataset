import { calculateCartTotals } from "../lib/cart";
import { CartItem } from "../lib/types";

describe("calculateCartTotals", () => {
    const mockProduct = {
        id: "1",
        name: "Test Product",
        price: 100,
        description: "Test Desc",
        category: "Test Cat",
        image: "test.jpg",
        rating: 4.5,
        reviews: 10,
        images: ["test.jpg"],
        features: ["Feature 1"],
        isNew: true
    };

    it("calculates totals correctly for single item", () => {
        const items: CartItem[] = [
            { ...mockProduct, quantity: 2 }
        ];

        const result = calculateCartTotals(items);
        expect(result.subtotal).toBe(200);
        // Tax 8% of 200 = 16
        expect(result.tax).toBe(16);
        expect(result.total).toBe(216);
    });

    it("applies fixed discount correctly", () => {
        const items: CartItem[] = [
            { ...mockProduct, quantity: 1 }
        ];

        const result = calculateCartTotals(items, {
            discountDetails: { type: 'fixed', value: 10 }
        });

        // 100 - 10 = 90 taxable
        expect(result.subtotal).toBe(100);
        expect(result.discountAmount).toBe(10);
        // Tax 8% of 90 = 7.2
        expect(result.tax).toBe(7.2);
        expect(result.total).toBe(97.2);
    });

    it("handles percentage discount", () => {
        const items: CartItem[] = [
            { ...mockProduct, quantity: 1 }
        ];

        const result = calculateCartTotals(items, {
            discountDetails: { type: 'percentage', value: 20 }
        });

        // 100 - 20% = 80 taxable
        expect(result.discountAmount).toBe(20);
        expect(result.tax).toBe(6.4); // 8% of 80
        expect(result.total).toBe(86.4);
    });

    it("prevents discount exceeding subtotal", () => {
        const items: CartItem[] = [
            { ...mockProduct, quantity: 1 }
        ];

        const result = calculateCartTotals(items, {
            discountDetails: { type: 'fixed', value: 150 }
        });

        expect(result.subtotal).toBe(100);
        expect(result.discountAmount).toBe(100); // Capped at subtotal
        expect(result.total).toBe(0); // 0 tax, 0 total
    });
});

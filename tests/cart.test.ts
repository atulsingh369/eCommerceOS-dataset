import { calculateCartTotals, CartItem } from '@/lib/cart';

const mockItems: CartItem[] = [
    { id: '1', name: 'Item 1', price: 100, quantity: 2, image: '', category: 'test', description: '', reviews: 0, rating: 5, features: [], stock: 10 },
    { id: '2', name: 'Item 2', price: 50, quantity: 1, image: '', category: 'test', description: '', reviews: 0, rating: 5, features: [], stock: 10 },
];

describe('calculateCartTotals', () => {
    it('calculates subtotal correctly', () => {
        const { subtotal } = calculateCartTotals(mockItems);
        expect(subtotal).toBe(250); // 100*2 + 50*1
    });

    it('calculates tax correctly (default 8%)', () => {
        const { tax } = calculateCartTotals(mockItems);
        // 250 * 0.08 = 20
        expect(tax).toBe(20);
    });

    it('calculates total correctly', () => {
        const { total } = calculateCartTotals(mockItems);
        expect(total).toBe(270);
    });

    it('applies fixed discount correctly', () => {
        const { total, discountAmount } = calculateCartTotals(mockItems, {
            discountDetails: { type: 'fixed', value: 50 }
        });
        // Subtotal: 250
        // Discount: 50
        // Taxable: 200
        // Tax: 16
        // Total: 216
        expect(discountAmount).toBe(50);
        expect(total).toBe(216);
    });

    it('applies percentage discount correctly', () => {
        const { total, discountAmount } = calculateCartTotals(mockItems, {
            discountDetails: { type: 'percentage', value: 10 }
        });
        // Subtotal: 250
        // Discount: 25
        // Taxable: 225
        // Tax: 18
        // Total: 243
        expect(discountAmount).toBe(25);
        expect(total).toBe(243);
    });

    it('prevents discount from exceeding subtotal', () => {
        const { total, discountAmount } = calculateCartTotals(mockItems, {
            discountDetails: { type: 'fixed', value: 300 }
        });
        // Subtotal: 250
        // Discount: 250 (capped)
        // Taxable: 0
        // Tax: 0
        // Total: 0
        expect(discountAmount).toBe(250);
        expect(total).toBe(0);
    });

    it('handles empty cart', () => {
        const { total } = calculateCartTotals([]);
        expect(total).toBe(0);
    });
});

import { validateCart } from '@/lib/cart';

describe('validateCart', () => {
    it('returns valid for valid items', () => {
        const result = validateCart(mockItems);
        expect(result.valid).toBe(true);
        expect(result.warnings).toHaveLength(0);
    });

    it('warns if quantity exceeds max', () => {
        const invalidItems = [
            { ...mockItems[0], quantity: 11 }
        ];
        const result = validateCart(invalidItems);
        expect(result.valid).toBe(false);
        expect(result.warnings[0]).toContain('exceeds maximum quantity');
    });

    it('warns if quantity exceeds stock', () => {
        const outOfStockItems = [
            { ...mockItems[0], quantity: 5, stock: 3 }
        ];
        const result = validateCart(outOfStockItems);
        expect(result.valid).toBe(false);
        expect(result.warnings[0]).toContain('exceeds available stock');
    });
});

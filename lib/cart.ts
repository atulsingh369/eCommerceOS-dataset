import { CartItem, CartTotals, CalculationOptions } from "./types";

export function calculateCartTotals(items: CartItem[], options: CalculationOptions = {}): CartTotals {
    const { taxRate = 0.08, discountDetails } = options;

    const subtotal = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    let discountAmount = 0;
    if (discountDetails) {
        if (discountDetails.type === 'fixed') {
            discountAmount = discountDetails.value;
        } else if (discountDetails.type === 'percentage') {
            discountAmount = subtotal * (discountDetails.value / 100);
        }
    }

    // Ensure discount doesn't exceed subtotal
    discountAmount = Math.min(discountAmount, subtotal);

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const tax = taxableAmount * taxRate;
    const total = taxableAmount + tax;

    return {
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        total: Number(total.toFixed(2)),
        discountAmount: Number(discountAmount.toFixed(2))
    };
}

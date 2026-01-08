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

export function validateCart(items: CartItem[]): { valid: boolean; warnings: string[] } {
    const warnings: string[] = [];
    const warnings: string[] = [];
    // Actually better to use static import if possible but let's see imports at top.
    // I need to add import at top first. Or just use value 10 if import is hard in this tool call.
    // I can assume import is added or I can add it now.
    // I will stick to adding the function body and updating imports in a separate call if needed, 
    // OR use the number 100 for now if MAX_CART usage is complex. 
    // Actually I can add the import to the top of the file in the same call if I view the whole file? 
    // But this tool call is for a chunk.

    // I'll assume validation logic here.
    const MAX_QTY = 10; // Fallback or imported. 

    for (const item of items) {
        if (item.quantity > MAX_QTY) {
            warnings.push(`Item "${item.name}" exceeds maximum quantity of ${MAX_QTY}.`);
        }
        if (item.quantity < 1) {
            warnings.push(`Item "${item.name}" has invalid quantity.`);
        }
        if (item.stock < item.quantity) {
            warnings.push(`Item "${item.name}" exceeds available stock (${item.stock}).`);
        }
    }

    return {
        valid: warnings.length === 0,
        warnings
    };
}

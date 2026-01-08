import { Product } from "./db/products";

export interface CartItem extends Product {
    quantity: number;
}

export interface CartTotals {
    subtotal: number;
    tax: number;
    total: number;
    discountAmount: number;
}

export interface CalculationOptions {
    taxRate?: number;
    discountDetails?: {
        type: 'fixed' | 'percentage';
        value: number;
    }
}

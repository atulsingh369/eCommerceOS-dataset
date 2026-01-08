import { z } from 'zod';

const checkoutSchema = z.object({
    displayName: z.string().min(1, "Full Name is required"),
    email: z.string().email("Please enter a valid email address"),
    line1: z.string().min(1, "Street Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
    phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

describe('Checkout Validation', () => {
    it('validates a correct address', () => {
        const validAddress = {
            displayName: "John Doe",
            email: "john@example.com",
            line1: "123 Main St",
            city: "New York",
            state: "NY",
            pincode: "123456",
            phoneNumber: "1234567890"
        };
        expect(() => checkoutSchema.parse(validAddress)).not.toThrow();
    });

    it('rejects invalid email', () => {
        const invalidAddress = {
            displayName: "John Doe",
            email: "invalid-email",
            line1: "123 Main St",
            city: "New York",
            state: "NY",
            pincode: "123456",
            phoneNumber: "1234567890"
        };
        expect(() => checkoutSchema.parse(invalidAddress)).toThrow();
    });

    it('rejects invalid pincode', () => {
        const invalidAddress = {
            displayName: "John Doe",
            email: "john@example.com",
            line1: "123 Main St",
            city: "New York",
            state: "NY",
            pincode: "123", // Too short
            phoneNumber: "1234567890"
        };
        expect(() => checkoutSchema.parse(invalidAddress)).toThrow();
    });
});

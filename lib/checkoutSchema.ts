import { z } from "zod";

export const checkoutSchema = z.object({
    displayName: z.string().min(1, "Full Name is required"),
    email: z.string().email("Please enter a valid email address"),
    line1: z.string().min(1, "Street Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
    phoneNumber: z
        .string()
        .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});
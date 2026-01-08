import { z } from "zod";

export const profileSchema = z.object({
    displayName: z.string().min(1, "Name is required"),
    phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits").optional().or(z.literal("")),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits").optional().or(z.literal("")),
    country: z.string().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

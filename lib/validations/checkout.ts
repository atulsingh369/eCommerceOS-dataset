import { z } from "zod";
import { requiredString, emailSchema, pincodeSchema, phoneSchema } from "./common";

export const checkoutSchema = z.object({
    displayName: requiredString("Full Name"),
    email: emailSchema,
    line1: requiredString("Street Address"),
    city: requiredString("City"),
    state: requiredString("State"),
    pincode: pincodeSchema,
    phoneNumber: phoneSchema,
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

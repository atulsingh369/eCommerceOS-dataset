import { z } from "zod";
import { requiredString, optionalPhoneSchema, optionalPincodeSchema } from "./common";

export const profileSchema = z.object({
    displayName: requiredString("Name"),
    phoneNumber: optionalPhoneSchema,
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: optionalPincodeSchema,
    country: z.string().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

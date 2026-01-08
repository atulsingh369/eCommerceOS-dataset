import { z } from "zod";
import { AUTH_NAME_MIN_LENGTH, AUTH_PASSWORD_MIN_LENGTH } from "../constants";

// Common string validations
export const requiredString = (fieldName: string) =>
    z.string().min(1, { message: `${fieldName} is required` });

export const emailSchema = z.string().email("Please enter a valid email address");

export const passwordSchema = z.string()
    .min(AUTH_PASSWORD_MIN_LENGTH, `Password must be at least ${AUTH_PASSWORD_MIN_LENGTH} characters`);

export const nameSchema = (fieldName: string = "Name") =>
    z.string().min(AUTH_NAME_MIN_LENGTH, `${fieldName} must be at least ${AUTH_NAME_MIN_LENGTH} characters`);

export const phoneSchema = z.string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits");

export const pincodeSchema = z.string()
    .regex(/^\d{6}$/, "Pincode must be exactly 6 digits");

// Optional variants (allow empty string or undefined)
export const optionalPhoneSchema = z.string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .optional()
    .or(z.literal(""));

export const optionalPincodeSchema = z.string()
    .regex(/^\d{6}$/, "Pincode must be exactly 6 digits")
    .optional()
    .or(z.literal(""));

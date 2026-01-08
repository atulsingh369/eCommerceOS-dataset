import { z } from "zod";
import { AUTH_NAME_MIN_LENGTH, AUTH_PASSWORD_MIN_LENGTH } from "../constants";

export const LoginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = z.object({
    firstName: z.string().min(AUTH_NAME_MIN_LENGTH, `First name must be at least ${AUTH_NAME_MIN_LENGTH} characters`),
    lastName: z.string().min(AUTH_NAME_MIN_LENGTH, `Last name must be at least ${AUTH_NAME_MIN_LENGTH} characters`),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(AUTH_PASSWORD_MIN_LENGTH, `Password must be at least ${AUTH_PASSWORD_MIN_LENGTH} characters`),
});

export const ResetPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

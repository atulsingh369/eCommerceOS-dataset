import { z } from "zod";
import { emailSchema, nameSchema, passwordSchema } from "./common";

export const LoginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = z.object({
    firstName: nameSchema("First name"),
    lastName: nameSchema("Last name"),
    email: emailSchema,
    password: passwordSchema,
});

export const ResetPasswordSchema = z.object({
    email: emailSchema,
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

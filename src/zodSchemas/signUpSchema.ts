import { z } from 'zod'

export const usernameSchema = z
    .string()
    .min(6, { message: "username must be at least 6 characters" })
    .max(20, { message: "username must be at most 20 characters" })
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric characters and underscores")


export const signUpSchema = z.object({
    username: usernameSchema,
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().length(6, { message: "password must be at least 6 characters" }),
})
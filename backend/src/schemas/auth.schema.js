import { z } from "zod";

export const registerSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email('"email" must be a valid email address'),
  password: z.string({ required_error: "Password is required" }).min(8, '"password" must be at least 8 characters'),
  name: z.string().optional(),
  role: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email('"email" must be a valid email address'),
  password: z.string({ required_error: "Password is required" }).min(1, "Password is required"),
});

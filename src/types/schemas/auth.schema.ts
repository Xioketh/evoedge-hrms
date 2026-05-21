import { z } from 'zod';
import { Role } from '@prisma/client';

export const SignupSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  // We accept a comma-separated string and transform it into an array of strings
  departments: z.string()
    .min(2, "Please enter at least one department")
    .transform((str) => str.split(',').map(d => d.trim()).filter(Boolean)),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});


export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
import { z } from 'zod'

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters').max(120),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must have at least 6 characters').max(100),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must have at least 6 characters').max(100),
})
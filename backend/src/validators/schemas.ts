import { z } from 'zod';

const VALID_SKIN_TONES = ['porcelain', 'fair', 'light', 'light_medium', 'medium', 'olive', 'tan', 'deep', 'rich', 'ebony', 'dark'] as const;
const VALID_GENDERS = ['women', 'men'] as const;

export const analyzeSchema = z.object({
  skinTone: z.enum(VALID_SKIN_TONES, {
    errorMap: () => ({ message: `Invalid skinTone. Use: ${VALID_SKIN_TONES.join(', ')}` }),
  }),
  gender: z.enum(VALID_GENDERS, {
    errorMap: () => ({ message: `Invalid gender. Use: ${VALID_GENDERS.join(', ')}` }),
  }).default('women'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60).trim(),
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
});

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

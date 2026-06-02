'use strict';

const { z } = require('zod');

const VALID_SKIN_TONES = ['porcelain','fair','light','light_medium','medium','olive','tan','deep','rich','ebony','dark'];
const VALID_GENDERS = ['women', 'men'];

const analyzeSchema = z.object({
  skinTone: z.enum(VALID_SKIN_TONES, { errorMap: () => ({ message: `Invalid skinTone. Use: ${VALID_SKIN_TONES.join(', ')}` }) }),
  gender:   z.enum(VALID_GENDERS, { errorMap: () => ({ message: `Invalid gender. Use: ${VALID_GENDERS.join(', ')}` }) }).default('women'),
});

const registerSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters').max(60).trim(),
  email:    z.string().email('Invalid email address').toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

const loginSchema = z.object({
  email:    z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
});

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map(i => i.message);
      return res.status(400).json({ success: false, errors });
    }
    req.body = result.data;
    next();
  };
}

function validateAnalyze(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ success: false, errors: ['Image required (field: image).'] });
  }
  const result = analyzeSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map(i => i.message);
    return res.status(400).json({ success: false, errors });
  }
  req.body = { ...req.body, ...result.data };
  next();
}

module.exports = {
  validate,
  validateAnalyze,
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};

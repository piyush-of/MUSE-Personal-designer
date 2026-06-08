import { Request, Response, NextFunction } from 'express';
import { Schema } from 'zod';
import { analyzeSchema } from '../validators/schemas';

export function validate(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map(i => i.message);
      return res.status(400).json({ success: false, errors });
    }
    req.body = result.data;
    next();
  };
}

export function validateAnalyze(req: Request, res: Response, next: NextFunction) {
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

import { Router } from 'express';
import cookieParser from 'cookie-parser';
import {
  register,
  login,
  refresh,
  logout,
  me,
  verifyEmail,
  forgotPassword,
  resetPassword
} from '../controllers/authController';
import { attachUser } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/schemas';
import { authLoginLimiter, authRegisterLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(cookieParser());

router.post('/register', authRegisterLimiter, validate(registerSchema), register);
router.post('/login', authLoginLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', attachUser, me);
router.get('/verify/:token', verifyEmail);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

export default router;

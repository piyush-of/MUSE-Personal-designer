'use strict';

const router = require('express').Router();
const cookieParser = require('cookie-parser');
const {
  register, login, refresh, logout, me, verifyEmail, forgotPassword, resetPassword,
} = require('../controllers/authController');
const { attachUser } = require('../middleware/auth');
const { validate, registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../middleware/validate');
const { authLoginLimiter, authRegisterLimiter } = require('../middleware/rateLimiter');

router.use(cookieParser());

router.post('/register', authRegisterLimiter, validate(registerSchema), register);
router.post('/login',    authLoginLimiter,    validate(loginSchema),    login);
router.post('/refresh',  refresh);
router.post('/logout',   logout);
router.get('/me',        attachUser, me);
router.get('/verify/:token', verifyEmail);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

module.exports = router;

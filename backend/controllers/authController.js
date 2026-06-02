'use strict';

const crypto = require('crypto');
const validator = require('validator');
const User = require('../models/User');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
} = require('../utils/jwt');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');
const logger = require('../utils/logger');

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function issueTokens(user, res) {
  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ id: user._id });
  user.refreshTokens = [hashToken(refreshToken)];
  await user.save({ validateBeforeSave: false });
  setRefreshCookie(res, refreshToken);
  return accessToken;
}

// ── Register ──────────────────────────────────────────────────────────────────
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, error: 'An account already exists with that email.' });
    }

    const user = await User.create({
      name: validator.escape(name.trim()),
      email: email.toLowerCase().trim(),
      password,
    });

    // Send verification email if email service enabled
    const verifyToken = crypto.randomBytes(32).toString('hex');
    user.verifyToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
    user.verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await user.save({ validateBeforeSave: false });

    await sendVerificationEmail(user.email, user.name, verifyToken);

    const accessToken = await issueTokens(user, res);

    logger.info(`[AUTH] New user registered: ${user.email}`);
    res.status(201).json({ success: true, accessToken, user: user.toProfile() });
  } catch (err) {
    next(err);
  }
}

// ── Login ─────────────────────────────────────────────────────────────────────
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    if (user.isLocked()) {
      const minutesLeft = Math.ceil((user.lockedUntil - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        error: `Account temporarily locked. Try again in ${minutesLeft} minute(s).`,
      });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      await user.incLoginAttempts();
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    // Reset attempts on success
    user.loginAttempts = 0;
    user.lockedUntil = undefined;
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    const accessToken = await issueTokens(user, res);

    logger.info(`[AUTH] Login: ${user.email}`);
    res.json({ success: true, accessToken, user: user.toProfile() });
  } catch (err) {
    next(err);
  }
}

// ── Refresh Token ─────────────────────────────────────────────────────────────
async function refresh(req, res, next) {
  try {
    const token = req.cookies?.muse_refresh;
    if (!token) return res.status(401).json({ success: false, error: 'Refresh token missing.' });

    const decoded = verifyRefreshToken(token);
    if (!decoded) return res.status(401).json({ success: false, error: 'Invalid or expired refresh token.' });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, error: 'User not found.' });
    if (!user.refreshTokens.includes(hashToken(token))) {
      return res.status(401).json({ success: false, error: 'Refresh token revoked.' });
    }

    const accessToken = await issueTokens(user, res);
    res.json({ success: true, accessToken, user: user.toProfile() });
  } catch (err) {
    next(err);
  }
}

// ── Logout ────────────────────────────────────────────────────────────────────
async function logout(req, res, next) {
  try {
    const token = req.cookies?.muse_refresh;
    if (token) {
      const decoded = verifyRefreshToken(token);
      if (decoded?.id) {
        await User.findByIdAndUpdate(decoded.id, { $pull: { refreshTokens: hashToken(token) } });
      }
    }
    clearRefreshCookie(res);
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
}

// ── Me ────────────────────────────────────────────────────────────────────────
async function me(req, res) {
  if (!req.user) return res.json({ success: true, user: null });
  const user = await User.findById(req.user.id);
  res.json({ success: true, user: user ? user.toProfile() : null });
}

// ── Verify Email ──────────────────────────────────────────────────────────────
async function verifyEmail(req, res, next) {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      verifyToken: hashedToken,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, error: 'Token invalid or expired.' });

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: 'Email verified successfully.' });
  } catch (err) {
    next(err);
  }
}

// ── Forgot Password ───────────────────────────────────────────────────────────
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    // Always return 200 to prevent user enumeration
    if (!user) return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1h
    await user.save({ validateBeforeSave: false });

    await sendPasswordResetEmail(user.email, user.name, resetToken);
    res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
}

// ── Reset Password ────────────────────────────────────────────────────────────
async function resetPassword(req, res, next) {
  try {
    const { password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, error: 'Token invalid or expired.' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    user.loginAttempts = 0;
    user.lockedUntil = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully. Please log in.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, logout, me, verifyEmail, forgotPassword, resetPassword };

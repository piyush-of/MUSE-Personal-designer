'use strict';

const router = require('express').Router();
const { registerUser, createSession, clearSession, SESSION_TTL_MS } = require('../utils/authStore');
const { requireAuth } = require('../middleware/auth');

function setSessionCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieParts = [
    `muse_session=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
  ];
  if (isProd) cookieParts.push('Secure');
  res.setHeader('Set-Cookie', cookieParts.join('; '));
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', 'muse_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
}

router.post('/register', async (req, res, next) => {
  try {
    const { name = '', email = '', password = '' } = req.body || {};
    if (!name.trim() || !email.trim() || !password.trim()) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }
    if (password.trim().length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters.' });
    }
    const user = await registerUser({ name, email, password });
    const session = await createSession({ email, password });
    setSessionCookie(res, session.token);
    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email = '', password = '' } = req.body || {};
    if (!email.trim() || !password.trim()) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }
    const session = await createSession({ email, password });
    setSessionCookie(res, session.token);
    res.json({ success: true, user: session.user });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    if (req.authToken) await clearSession(req.authToken);
    clearSessionCookie(res);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = { authRouter: router };

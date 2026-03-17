'use strict';

const { getUserBySessionToken } = require('../utils/authStore');

function parseCookies(headerValue = '') {
  return headerValue.split(';').reduce((acc, entry) => {
    const [rawKey, ...rest] = entry.trim().split('=');
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

async function attachUser(req, _res, next) {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const bearer = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7).trim()
      : '';
    const token = cookies.muse_session || bearer;
    req.user = token ? await getUserBySessionToken(token) : null;
    req.authToken = token || null;
    next();
  } catch (err) {
    next(err);
  }
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }
  next();
}

module.exports = { attachUser, requireAuth, parseCookies };

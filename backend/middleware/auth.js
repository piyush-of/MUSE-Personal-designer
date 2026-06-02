'use strict';

const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');

async function attachUser(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }
    const token = authHeader.slice(7).trim();
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      req.user = null;
      return next();
    }
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    req.user = null;
    next();
  }
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required.' });
  }
  next();
}

async function checkAnalysisQuota(req, res, next) {
  try {
    if (!req.user) return next(); // unauthenticated users: quota not enforced here
    const user = await User.findById(req.user.id);
    if (!user) return next();
    if (user.plan === 'pro') return next(); // unlimited for pro
    if (user.analysesUsed >= user.analysesLimit) {
      return res.status(429).json({
        success: false,
        error: `Free tier limit reached (${user.analysesLimit} analyses/month). Upgrade to Pro for unlimited.`,
        code: 'QUOTA_EXCEEDED',
      });
    }
    req.userDoc = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { attachUser, requireAuth, requireAdmin, checkAnalysisQuota };

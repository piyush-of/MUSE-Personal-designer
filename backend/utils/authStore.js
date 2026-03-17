'use strict';

const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const STORE_PATH = path.join(__dirname, '../data/users.json');
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

let writeQueue = Promise.resolve();

async function ensureStore() {
  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, JSON.stringify({ users: [], sessions: [] }, null, 2));
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(STORE_PATH, 'utf8');
  const parsed = JSON.parse(raw || '{}');
  parsed.users = Array.isArray(parsed.users) ? parsed.users : [];
  parsed.sessions = Array.isArray(parsed.sessions) ? parsed.sessions : [];
  return parsed;
}

function writeStore(nextStore) {
  writeQueue = writeQueue.then(() =>
    fs.writeFile(STORE_PATH, JSON.stringify(nextStore, null, 2), 'utf8')
  );
  return writeQueue;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, originalHash] = String(storedHash || '').split(':');
  if (!salt || !originalHash) return false;
  const candidate = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(candidate, 'hex'));
}

function safeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || 'member',
    createdAt: user.createdAt,
  };
}

async function registerUser({ name, email, password }) {
  const store = await readStore();
  const normalizedEmail = email.trim().toLowerCase();
  if (store.users.some(user => user.email === normalizedEmail)) {
    const err = new Error('An account already exists with that email.');
    err.status = 409;
    throw err;
  }

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    role: 'member',
    createdAt: new Date().toISOString(),
  };

  store.users.push(user);
  await writeStore(store);
  return safeUser(user);
}

async function createSession({ email, password }) {
  const store = await readStore();
  const normalizedEmail = email.trim().toLowerCase();
  const user = store.users.find(entry => entry.email === normalizedEmail);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  store.sessions = store.sessions.filter(session => new Date(session.expiresAt).getTime() > Date.now());
  store.sessions.push({ token, userId: user.id, expiresAt });
  await writeStore(store);
  return { token, user: safeUser(user), expiresAt };
}

async function getUserBySessionToken(token) {
  if (!token) return null;
  const store = await readStore();
  const now = Date.now();
  const activeSessions = store.sessions.filter(session => new Date(session.expiresAt).getTime() > now);
  if (activeSessions.length !== store.sessions.length) {
    store.sessions = activeSessions;
    await writeStore(store);
  }

  const session = activeSessions.find(entry => entry.token === token);
  if (!session) return null;

  const user = store.users.find(entry => entry.id === session.userId);
  return user ? safeUser(user) : null;
}

async function clearSession(token) {
  if (!token) return;
  const store = await readStore();
  const nextSessions = store.sessions.filter(session => session.token !== token);
  if (nextSessions.length !== store.sessions.length) {
    store.sessions = nextSessions;
    await writeStore(store);
  }
}

module.exports = {
  SESSION_TTL_MS,
  registerUser,
  createSession,
  getUserBySessionToken,
  clearSession,
};

/**
 * js/shared.js - Theme, auth, startup animation, nav, toast
 */
'use strict';

const PROTECTED_PATHS = new Set(['/analyze.html', '/shopping.html', '/trends.html', '/about.html']);
const PUBLIC_AUTH_PATHS = new Set(['/auth.html']);

function initTheme() {
  const saved = localStorage.getItem('muse-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateToggleIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('muse-theme', next);
  updateToggleIcon(next);
}

function updateToggleIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀' : '☾';
}

function setActiveNav() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/';
    a.classList.toggle('active', href === path);
  });
}

function initMobileNav() {
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  if (!burger || !links) return;
  burger.addEventListener('click', () => {
    links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(links.classList.contains('open')));
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

let toastTimer;
window.showToast = function(msg, type = 'error') {
  const el = document.getElementById('toast');
  if (!el) return;
  clearTimeout(toastTimer);
  el.textContent = msg;
  el.className = `toast ${type} show`;
  toastTimer = setTimeout(() => el.classList.remove('show'), 4000);
};

function initScrollLinks() {
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.scroll);
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

async function fetchCurrentUser() {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
    if (!res.ok) return null;
    const body = await res.json();
    return body.user || null;
  } catch {
    return null;
  }
}

function redirectToAuth() {
  const next = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.href = `/auth.html?next=${next}`;
}

async function logout() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    localStorage.removeItem('muse-user');
    showToast('Signed out successfully.', 'success');
    window.location.href = '/auth.html';
  }
}

function renderAuthNav(user) {
  const host = document.getElementById('navAuth');
  if (!host) return;
  if (user) {
    host.innerHTML = `
      <span class="nav-user-badge">${user.name}</span>
      <button class="btn btn-outline btn-sm nav-auth-btn" id="logoutBtn" type="button">Logout</button>
    `;
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    return;
  }
  host.innerHTML = `<a href="/auth.html" class="btn btn-outline btn-sm nav-auth-btn">Sign In</a>`;
}

function runStartupAnimation() {
  const overlay = document.getElementById('museStartup');
  const typing = document.getElementById('museTyping');
  if (!overlay || !typing) return;

  const seen = sessionStorage.getItem('muse-startup-seen') === '1';
  if (seen) {
    overlay.remove();
    return;
  }

  document.body.classList.add('startup-lock');
  const text = 'MUSE';
  let index = 0;
  const timer = setInterval(() => {
    index += 1;
    typing.textContent = text.slice(0, index);
    if (index >= text.length) {
      clearInterval(timer);
      overlay.classList.add('is-beaming');
      setTimeout(() => overlay.classList.add('is-fading'), 850);
      setTimeout(() => {
        sessionStorage.setItem('muse-startup-seen', '1');
        document.body.classList.remove('startup-lock');
        overlay.remove();
      }, 1900);
    }
  }, 220);
}

async function initAuth() {
  const pathname = window.location.pathname;
  const user = await fetchCurrentUser();
  if (user) localStorage.setItem('muse-user', JSON.stringify(user));
  renderAuthNav(user);

  if (!user && PROTECTED_PATHS.has(pathname)) {
    redirectToAuth();
    return null;
  }

  if (user && PUBLIC_AUTH_PATHS.has(pathname)) {
    const next = new URLSearchParams(window.location.search).get('next') || '/';
    window.location.href = next;
    return user;
  }

  return user;
}

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  setActiveNav();
  initMobileNav();
  initScrollLinks();
  runStartupAnimation();

  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.addEventListener('click', toggleTheme);

  await initAuth();
});

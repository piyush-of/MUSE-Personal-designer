/**
 * js/shared.js - Theme, auth, profile menu, cart/wishlist state, startup animation, nav, toast
 */
'use strict';

const PROTECTED_PATHS = new Set(['analyze.html', 'shopping.html', 'trends.html', 'about.html', 'cart.html']);
const PUBLIC_AUTH_PATHS = new Set(['auth.html']);
const CART_EVENT = 'muse-cart-updated';
let activeUser = null;

function getPageName(pathname = window.location.pathname) {
  const normalized = String(pathname || '').replace(/\\/g, '/');
  const trimmed = normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
  return trimmed.split('/').pop() || 'index.html';
}

function pageHref(fileName) {
  return `./${fileName}`;
}

function apiHref(path) {
  return `./api/${String(path || '').replace(/^\/+/, '')}`;
}

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
  if (btn) btn.textContent = theme === 'dark' ? '\u2600' : '\u263E';
}

function setActiveNav() {
  const path = getPageName();
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = getPageName(a.getAttribute('href'));
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
    const res = await fetch(apiHref('auth/me'), { credentials: 'same-origin' });
    if (!res.ok) return null;
    const body = await res.json();
    return body.user || null;
  } catch {
    return null;
  }
}

function redirectToAuth() {
  const next = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.href = `${pageHref('auth.html')}?next=${next}`;
}

async function logout() {
  try {
    await fetch(apiHref('auth/logout'), {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    localStorage.removeItem('muse-user');
    showToast('Signed out successfully.', 'success');
    window.location.href = pageHref('auth.html');
  }
}

function getCartKey() {
  const user = activeUser || JSON.parse(localStorage.getItem('muse-user') || 'null');
  const id = user?.email || user?.name || 'guest';
  return `muse-cart:${id}`;
}

function parsePriceFloor(priceRange = '') {
  const match = String(priceRange).replace(/,/g, '').match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

function getCartItems() {
  try {
    const items = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function saveCartItems(items) {
  localStorage.setItem(getCartKey(), JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: items }));
}

function normalizeCartItem(item) {
  const id = item.id || [item.item, item.category, item.priceRange || item.price_range].filter(Boolean).join(':');
  return {
    id,
    item: item.item,
    category: item.category || '',
    priceRange: item.priceRange || item.price_range || '',
    why: item.why || '',
    styleTip: item.styleTip || item.style_tip || '',
    story: item.story || '',
    lineArtSvg: item.lineArtSvg || '',
    retailers: item.retailers || [],
    targetPrice: item.targetPrice ?? null,
    currentFloor: parsePriceFloor(item.priceRange || item.price_range || ''),
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

function addToCart(item) {
  const items = getCartItems();
  const normalized = normalizeCartItem(item);
  const existingIndex = items.findIndex(entry => entry.id === normalized.id);
  if (existingIndex >= 0) {
    items[existingIndex] = { ...items[existingIndex], ...normalized };
  } else {
    items.unshift(normalized);
  }
  saveCartItems(items);
  return normalized;
}

function removeFromCart(id) {
  saveCartItems(getCartItems().filter(item => item.id !== id));
}

function updateCartTarget(id, targetPrice) {
  const items = getCartItems().map(item => item.id === id ? { ...item, targetPrice } : item);
  saveCartItems(items);
}

function getCartAlerts() {
  return getCartItems().filter(item => item.targetPrice && item.currentFloor && item.currentFloor <= item.targetPrice);
}

function getCartCount() {
  return getCartItems().length;
}

function renderAuthNav(user) {
  const host = document.getElementById('navAuth');
  if (!host) return;

  if (user) {
    const count = getCartCount();
    host.innerHTML = `
      <div class="profile-menu" id="profileMenu">
        <button class="profile-trigger" id="profileTrigger" type="button" aria-expanded="false">
          <span class="profile-trigger__name">${user.name}</span>
          <span class="profile-trigger__badge">${count}</span>
        </button>
        <div class="profile-panel" id="profilePanel">
          <div class="profile-panel__header">
            <strong>${user.name}</strong>
            <span>${user.email || 'MUSE member'}</span>
          </div>
          <a href="${pageHref('cart.html')}" class="profile-link">Cart / Wishlist <span class="profile-link__count">${count}</span></a>
          <a href="${pageHref('shopping.html')}" class="profile-link">Continue Shopping</a>
          <button class="profile-link profile-link--button" id="logoutBtn" type="button">Logout</button>
        </div>
      </div>
    `;

    const trigger = document.getElementById('profileTrigger');
    const menu = document.getElementById('profileMenu');
    const panel = document.getElementById('profilePanel');
    const syncMenu = open => {
      menu.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', String(open));
    };

    trigger?.addEventListener('click', event => {
      event.stopPropagation();
      syncMenu(!menu.classList.contains('open'));
    });
    panel?.addEventListener('click', event => event.stopPropagation());
    document.addEventListener('click', () => syncMenu(false));
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    return;
  }

  host.innerHTML = `<a href="${pageHref('auth.html')}" class="btn btn-outline btn-sm nav-auth-btn">Sign In</a>`;
}

function refreshProfileCount() {
  const badge = document.querySelector('.profile-trigger__badge');
  const linkCount = document.querySelector('.profile-link__count');
  const count = getCartCount();
  if (badge) badge.textContent = String(count);
  if (linkCount) linkCount.textContent = String(count);
}

function showCartAlertToast() {
  const alerts = getCartAlerts();
  const alreadyShown = sessionStorage.getItem('muse-cart-alert-shown') === '1';
  if (alerts.length && !alreadyShown) {
    sessionStorage.setItem('muse-cart-alert-shown', '1');
    showToast(`${alerts.length} cart item${alerts.length > 1 ? 's are' : ' is'} now within your target price.`, 'success');
  }
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
  const pathname = getPageName();
  const user = await fetchCurrentUser();
  activeUser = user;
  if (user) localStorage.setItem('muse-user', JSON.stringify(user));
  renderAuthNav(user);
  refreshProfileCount();

  if (!user && PROTECTED_PATHS.has(pathname)) {
    redirectToAuth();
    return null;
  }

  if (user && PUBLIC_AUTH_PATHS.has(pathname)) {
    const next = new URLSearchParams(window.location.search).get('next') || pageHref('index.html');
    window.location.href = next;
    return user;
  }

  showCartAlertToast();
  return user;
}

window.MuseCart = {
  getItems: getCartItems,
  addItem(item) {
    const added = addToCart(item);
    refreshProfileCount();
    showToast(`${added.item} saved to your cart.`, 'success');
    return added;
  },
  removeItem(id) {
    removeFromCart(id);
    refreshProfileCount();
  },
  updateTarget(id, targetPrice) {
    updateCartTarget(id, targetPrice);
    refreshProfileCount();
  },
  getAlerts: getCartAlerts,
  getCount: getCartCount,
  parsePriceFloor,
};

window.addEventListener(CART_EVENT, refreshProfileCount);

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

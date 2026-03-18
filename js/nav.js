/**
 * js/nav.js - Injects shared navigation and global overlays into every page
 */
'use strict';

function pageHref(fileName) {
  return `./${fileName}`;
}

const NAV_HTML = `
<nav class="site-nav" id="siteNav">
  <a href="${pageHref('index.html')}" class="nav-logo">MU<span>S</span>E</a>
  <div class="nav-links" id="navLinks">
    <a href="${pageHref('index.html')}">Home</a>
    <a href="${pageHref('analyze.html')}">Analyse</a>
    <a href="${pageHref('shopping.html')}">Shopping</a>
    <a href="${pageHref('trends.html')}">Trends</a>
    <a href="${pageHref('about.html')}">About</a>
  </div>
  <div class="nav-right">
    <div class="nav-auth" id="navAuth"></div>
    <button class="theme-toggle" id="themeToggle" title="Toggle theme" aria-label="Toggle light/dark mode">\u263E</button>
    <button class="nav-burger" id="navBurger" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>`;

const TOAST_HTML = `<div class="toast" id="toast" role="alert"></div>`;

const STARTUP_HTML = `
<div class="muse-startup" id="museStartup" aria-hidden="true">
  <div class="muse-startup__beam"></div>
  <div class="muse-startup__halo"></div>
  <div class="muse-startup__core">
    <div class="muse-startup__typing" id="museTyping"></div>
    <div class="muse-startup__sub">fashion intelligence initializing</div>
  </div>
</div>`;

document.addEventListener('DOMContentLoaded', () => {
  document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
  document.body.insertAdjacentHTML('beforeend', TOAST_HTML);
  document.body.insertAdjacentHTML('beforeend', STARTUP_HTML);
});

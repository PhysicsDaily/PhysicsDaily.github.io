(function(){
  if (window.__headerLoaderLoaded) return; // prevent double init

  const CACHE_KEY = 'pd:header:html';
  const CACHE_TS_KEY = 'pd:header:ts';
  const CACHE_VER_KEY = 'pd:header:ver';
  const CACHE_VER = '9'; // bump to invalidate old cached markup
  const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

  const applyHeaderHtml = (html) => {
    const placeholder = document.getElementById('global-header');
    if (placeholder) {
      placeholder.outerHTML = html; // replace placeholder with header markup
    } else {
      // No placeholder found: insert at the top of the body
      document.body.insertAdjacentHTML('afterbegin', html);
    }

    // Show Home link on non-home pages only
    const isHome = location.pathname.endsWith('/') || location.pathname.endsWith('/index.html') || location.pathname === '/index.html';
    const homeLink = document.querySelector('.fixed-header .home-link');
    if (homeLink) homeLink.style.display = isHome ? 'none' : 'inline';

    // Ensure body has spacing for fixed header
    document.body.classList.add('has-fixed-header');

    // Hide any legacy inline nav to avoid duplicates
    const legacyNav = document.querySelector('nav.nav');
    if (legacyNav) {
      legacyNav.style.display = 'none';
    }

    // Re-bind sign-in button to open modal if present
    const signInBtn = document.getElementById('header-sign-in');
    if (signInBtn && window.authUI) {
      signInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.authUI.openModal();
      });
    }

    // Announce header ready so auth-navigation can wire events
    document.dispatchEvent(new CustomEvent('globalHeaderReady'));

    // Ensure mobile nav works even on pages that don't load global.js
    (function initMobileNav(){
      const navToggle = document.querySelector('.mobile-nav-toggle');
      const navLinks = document.querySelector('.nav-links');
      if (!navToggle || !navLinks) return;
      if (navToggle.dataset.navInitialized) return; // idempotent
      navToggle.dataset.navInitialized = 'true';

      navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!isExpanded));
        navLinks.classList.toggle('active');
      });

      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navToggle.setAttribute('aria-expanded', 'false');
          navLinks.classList.remove('active');
        });
      });
    })();

    // Ensure a global footer is present even if the page didn't load global.js
    (function ensureFooter(){
      try {
        if (!document.getElementById('global-footer')) {
          const ph = document.createElement('div');
          ph.id = 'global-footer';
          document.body.appendChild(ph);
        }
        const hasFooterLoader = Array.from(document.querySelectorAll('script[src]')).some(s => s.src.includes('footer-loader.js'));
        if (!hasFooterLoader) {
          const s = document.createElement('script');
          s.src = '/assets/js/footer-loader.js';
          s.async = true;
          document.head.appendChild(s);
        }
      } catch(e) { console.warn('[HeaderLoader] ensureFooter failed', e); }
    })();
  };

  const fetchAndMaybeUpdateCache = async () => {
    try {
      const resp = await fetch('/assets/partials/header.html', { cache: 'no-store' });
      if (!resp.ok) throw new Error('Failed to load header');
      const html = await resp.text();
      // Update cache for next navigation, but avoid DOM replacement now to prevent double-binding
      try {
        localStorage.setItem(CACHE_KEY, html);
        localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
        localStorage.setItem(CACHE_VER_KEY, CACHE_VER);
      } catch {}
      return html;
    } catch (e) {
      console.error('[HeaderLoader] Network fetch failed:', e);
      return null;
    }
  };

  const injectHeader = async () => {
    try {
      // Try local cache first for instant paint
      const cachedHtml = localStorage.getItem(CACHE_KEY);
      const cachedVer = localStorage.getItem(CACHE_VER_KEY);
      const cachedTs = parseInt(localStorage.getItem(CACHE_TS_KEY) || '0', 10);
      const fresh = Date.now() - cachedTs < MAX_AGE_MS;

      if (cachedHtml && cachedVer === CACHE_VER && fresh) {
        applyHeaderHtml(cachedHtml);
        window.__headerLoaderLoaded = true;
        // Refresh cache in background (don't await)
        fetchAndMaybeUpdateCache();
      } else {
        // Fetch from network and inject
        const html = await fetchAndMaybeUpdateCache();
        if (html) {
          applyHeaderHtml(html);
        } else if (cachedHtml) {
          // Fallback to any cached html even if stale/version-mismatch
          applyHeaderHtml(cachedHtml);
        }
        window.__headerLoaderLoaded = true;
      }
    } catch (e) {
      console.error('[HeaderLoader] Failed:', e);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHeader);
  } else {
    injectHeader();
  }
})();

(function(){
  if (window.__headerLoaderLoaded) return; // prevent double init

  const CACHE_KEY = 'pd:header:html';
  const CACHE_TS_KEY = 'pd:header:ts';
  const CACHE_VER_KEY = 'pd:header:ver';
  const CACHE_VER = '9'; // bump to invalidate old cached markup
  const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
  const FALLBACK_HEADER = `
<header class="fixed-header" data-header-fallback>
  <div class="container">
    <div class="header-content">
      <a class="logo" href="/">Physics Daily</a>
      <button class="mobile-nav-toggle" aria-controls="nav-links" aria-expanded="false" aria-label="Open menu" type="button">
        <span class="hamburger" aria-hidden="true"></span>
        <span class="visually-hidden">Menu</span>
      </button>
      <nav class="nav-links" id="nav-links">
        <a class="home-link" href="/" hidden>Home</a>
        <a href="/leaderboard.html">Leaderboard</a>
        <a href="/resources.html">Resources</a>
        <a href="/about.html">About</a>
        <button class="btn sign-in-btn" id="header-sign-in" type="button">Sign In</button>
      </nav>
    </div>
  </div>
</header>
`.trim();

  const replaceHeaderMarkup = (html) => {
    try {
      const placeholder = document.getElementById('global-header');
      if (placeholder) {
        placeholder.outerHTML = html;
        return document.querySelector('.fixed-header');
      }

      const fallbackNode = document.querySelector('[data-header-fallback]');
      if (fallbackNode) {
        fallbackNode.outerHTML = html;
        return document.querySelector('.fixed-header');
      }

      const existingHeader = document.querySelector('.fixed-header');
      if (existingHeader) {
        existingHeader.outerHTML = html;
        return document.querySelector('.fixed-header');
      }

      document.body.insertAdjacentHTML('afterbegin', html);
      return document.querySelector('.fixed-header');
    } catch (error) {
      console.error('[HeaderLoader] Failed to insert header markup:', error);
      return null;
    }
  };

  const applyHeaderHtml = (html, { isFallback = false } = {}) => {
    const headerRoot = replaceHeaderMarkup(html);
    if (!headerRoot) return;

    const normalizedPath = location.pathname.replace(/index\.html$/, '');
    const isHome = normalizedPath === '/' || normalizedPath === '';
    const homeLink = headerRoot.querySelector('.home-link');
    if (homeLink) {
      homeLink.hidden = isHome;
    }

    if (document.body) {
      document.body.classList.add('has-fixed-header');
    }

    const legacyNav = document.querySelector('nav.nav');
    if (legacyNav) {
      legacyNav.style.display = 'none';
    }

    const signInBtn = headerRoot.querySelector('#header-sign-in');
    if (signInBtn && !signInBtn.dataset.authBound) {
      signInBtn.dataset.authBound = 'true';
      signInBtn.addEventListener('click', (e) => {
        if (window.authUI && typeof window.authUI.openModal === 'function') {
          e.preventDefault();
          window.authUI.openModal();
        }
      });
    }

    document.dispatchEvent(new CustomEvent('globalHeaderReady', { detail: { fallback: isFallback } }));

    (function initMobileNav(root){
      const navToggle = root.querySelector('.mobile-nav-toggle');
      const navLinks = root.querySelector('.nav-links');
      if (!navToggle || !navLinks) return;
      if (navToggle.dataset.navInitialized) return;
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
    })(headerRoot);

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

    if (!isFallback) {
      window.__headerLoaderLoaded = true;
    }
  };

  const ensureFallbackHeader = () => {
    if (document.querySelector('[data-header-fallback]') || document.querySelector('.fixed-header')) return;
    applyHeaderHtml(FALLBACK_HEADER, { isFallback: true });
  };

  const fetchAndMaybeUpdateCache = async () => {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 5000) : null;
    try {
      const resp = await fetch('/assets/partials/header.html', {
        cache: 'no-store',
        signal: controller ? controller.signal : undefined
      });
      if (!resp.ok) throw new Error(`Failed to load header: ${resp.status}`);
      const html = await resp.text();
      try {
        localStorage.setItem(CACHE_KEY, html);
        localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
        localStorage.setItem(CACHE_VER_KEY, CACHE_VER);
      } catch {}
      return html;
    } catch (e) {
      if (e && e.name === 'AbortError') {
        console.warn('[HeaderLoader] Network fetch aborted (timeout)');
      } else {
        console.error('[HeaderLoader] Network fetch failed:', e);
      }
      return null;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  };

  const injectHeader = async () => {
    try {
      const cachedHtml = localStorage.getItem(CACHE_KEY);
      const cachedVer = localStorage.getItem(CACHE_VER_KEY);
      const cachedTs = parseInt(localStorage.getItem(CACHE_TS_KEY) || '0', 10);
      const fresh = Date.now() - cachedTs < MAX_AGE_MS;

      if (cachedHtml && cachedVer === CACHE_VER && fresh) {
        applyHeaderHtml(cachedHtml);
        fetchAndMaybeUpdateCache();
        return;
      }

      ensureFallbackHeader();

      const html = await fetchAndMaybeUpdateCache();
      if (html) {
        applyHeaderHtml(html);
      } else if (cachedHtml) {
        applyHeaderHtml(cachedHtml);
      } else {
        window.__headerLoaderLoaded = true;
      }
    } catch (e) {
      console.error('[HeaderLoader] Failed:', e);
      if (!window.__headerLoaderLoaded) {
        window.__headerLoaderLoaded = true;
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHeader);
  } else {
    injectHeader();
  }
})();

(function(){
  if (window.__headerLoaderLoaded) return; // prevent double init

  const CACHE_KEY = 'pd:header:html';
  const CACHE_TS_KEY = 'pd:header:ts';
  const CACHE_VER_KEY = 'pd:header:ver';
  const CACHE_VER = '7'; // bump to invalidate old cached markup
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

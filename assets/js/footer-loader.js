(function(){
  if (window.__footerLoaderLoaded) return;

  const CACHE_KEY = 'pd:footer:html';
  const CACHE_TS_KEY = 'pd:footer:ts';
  const CACHE_VER_KEY = 'pd:footer:ver';
  const CACHE_VER = '2';
  const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

  const applyFooterHtml = (html) => {
    const placeholder = document.getElementById('global-footer');
    if (placeholder) {
      placeholder.outerHTML = html;
    } else {
      document.body.insertAdjacentHTML('beforeend', html);
    }

    // Mark the newest footer as global and hide any legacy duplicates
    try {
      const footers = Array.from(document.querySelectorAll('footer.footer'));
      if (footers.length > 1) {
        const globalFooter = footers[footers.length - 1];
        globalFooter.setAttribute('data-global-footer', '1');
        footers.slice(0, -1).forEach(f => {
          if (!f.hasAttribute('data-global-footer')) {
            f.style.display = 'none';
          }
        });
      }
    } catch {}
  };

  const fetchAndMaybeUpdateCache = async () => {
    try {
      const resp = await fetch('/assets/partials/footer.html', { cache: 'no-store' });
      if (!resp.ok) throw new Error('Failed to load footer');
      const html = await resp.text();
      try {
        localStorage.setItem(CACHE_KEY, html);
        localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
        localStorage.setItem(CACHE_VER_KEY, CACHE_VER);
      } catch {}
      return html;
    } catch (e) {
      console.error('[FooterLoader] Network fetch failed:', e);
      return null;
    }
  };

  const injectFooter = async () => {
    try {
      const cachedHtml = localStorage.getItem(CACHE_KEY);
      const cachedVer = localStorage.getItem(CACHE_VER_KEY);
      const cachedTs = parseInt(localStorage.getItem(CACHE_TS_KEY) || '0', 10);
      const fresh = Date.now() - cachedTs < MAX_AGE_MS;

      if (cachedHtml && cachedVer === CACHE_VER && fresh) {
        applyFooterHtml(cachedHtml);
        window.__footerLoaderLoaded = true;
        fetchAndMaybeUpdateCache();
      } else {
        const html = await fetchAndMaybeUpdateCache();
        if (html) applyFooterHtml(html);
        else if (cachedHtml) applyFooterHtml(cachedHtml);
        window.__footerLoaderLoaded = true;
      }
    } catch (e) {
      console.error('[FooterLoader] Failed:', e);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }
})();

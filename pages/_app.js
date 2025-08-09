import '../styles/globals.css';
import Script from 'next/script'; // Import the Script component
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const GA_TRACKING_ID = 'G-XN081SR2KP';
  const GOOGLE_ADS_CLIENT_ID = 'ca-pub-4062746224225625';
  const router = useRouter();

  // Re-typeset MathJax on route changes
  useEffect(() => {
    const typeset = async () => {
      if (typeof window === 'undefined' || !window.MathJax || !window.MathJax.typesetPromise) return;
      try {
        await window.MathJax.typesetPromise();
      } catch (e) {
        // no-op
      }
    };
    typeset();
  }, [router.asPath]);

  return (
    <>
      {/* --- MathJax global configuration (must load before MathJax library) --- */}
      <Script
        id="mathjax-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.MathJax = {
              loader: { load: ['[tex]/noerrors', '[tex]/noundefined'] },
              tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']],
                processEscapes: true,
                packages: {'[+]': ['noerrors', 'noundefined']}
              },
              options: {
                skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
              },
              startup: {
                typeset: true,
                ready: () => {
                  MathJax.startup.defaultReady();
                  // Initial typeset once MathJax is ready
                  MathJax.typesetPromise && MathJax.typesetPromise();
                }
              }
            };
          `,
        }}
      />
      {/* --- Google Analytics Script --- */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `,
        }}
      />
      
      {/* --- Google AdSense Script --- */}
      <Script
        id="google-ads"
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADS_CLIENT_ID}`}
        crossOrigin="anonymous"
      />

      {/* --- MathJax Script for LaTeX Rendering (v3 tex-chtml) --- */}
      <Script
        strategy="afterInteractive"
        src="https://polyfill.io/v3/polyfill.min.js?features=es6"
      />
      <Script
        id="mathjax"
        strategy="afterInteractive"
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
      />

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

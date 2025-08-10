import '../styles/globals.css';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  const GA_TRACKING_ID = 'G-XN081SR2KP';
  const GOOGLE_ADS_CLIENT_ID = 'ca-pub-4062746224225625';

  return (
    <>
  {/* --- MathJax (must load before any page uses MathJax) --- */}
  <Script src="/mathjax-config.js" strategy="beforeInteractive" />
  <Script id="MathJax-script" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" strategy="beforeInteractive" />
      {/* --- Google Analytics Script (Lazy Loaded) --- */}
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `,
        }}
      />
      
  {/* --- Google AdSense Script (Lazy Loaded) --- */}
      <Script
        id="google-ads"
        strategy="lazyOnload"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADS_CLIENT_ID}`}
        crossOrigin="anonymous"
      />

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

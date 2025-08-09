import '../styles/globals.css';
import Script from 'next/script'; // Import the Script component

function MyApp({ Component, pageProps }) {
  const GA_TRACKING_ID = 'G-XN081SR2KP';
  const GOOGLE_ADS_CLIENT_ID = 'ca-pub-4062746224225625';

  return (
    <>
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

      {/* --- MathJax Script for LaTeX Rendering --- */}
      <Script
        strategy="afterInteractive"
        src="https://polyfill.io/v3/polyfill.min.js?features=es6"
      />
      <Script
        id="mathjax"
        strategy="afterInteractive"
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
      />

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

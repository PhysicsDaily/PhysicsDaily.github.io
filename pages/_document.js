import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/*
          This is where we link the Google Fonts your site uses.
          In the original HTML, this was in the <head> of every file.
          Now, we define it in this single location.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/*
          You can also add other global meta tags here if needed,
          like meta descriptions or verification tags.
        */}
      </Head>
      <body>
        {/* Main is where Next.js will render the actual page content. */}
        <Main />
        {/* NextScript is for scripts Next.js needs to run the application. */}
        <NextScript />
      </body>
    </Html>
  );
}

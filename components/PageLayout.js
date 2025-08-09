// components/PageLayout.js
import Head from 'next/head';
import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';

export default function PageLayout({ 
  title, 
  description, 
  breadcrumbItems = [], 
  children 
}) {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />

      {breadcrumbItems.length > 0 && (
        <div className="breadcrumb">
          <div className="container">
            {breadcrumbItems.map((item, index) => (
              <span key={index}>
                {item.href ? (
                  <Link href={item.href}>{item.label}</Link>
                ) : (
                  <span>{item.label}</span>
                )}
                {index < breadcrumbItems.length - 1 && (
                  <span className="separator">›</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {children}

      <Footer />
    </div>
  );
}
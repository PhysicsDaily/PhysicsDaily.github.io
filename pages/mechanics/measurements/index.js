// pages/mechanics/measurements/index.js
import Head from 'next/head';
import { useEffect } from 'react';

export default function MeasurementsPage() {
  useEffect(() => {
    // Load MathJax dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    script.id = 'MathJax-script';
    
    // Configure MathJax before loading
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
      }
    };
    
    document.head.appendChild(script);
    
    // Scroll to top functionality
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const handleScroll = () => {
      const scrollButton = document.querySelector('.scroll-to-top');
      if (scrollButton) {
        scrollButton.style.display = window.pageYOffset > 300 ? 'block' : 'none';
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      const existingScript = document.getElementById('MathJax-script');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>Chapter 1: Measurement in Physics - Physics Daily</title>
        <meta name="description" content="Master the fundamentals of measurement in physics: units, significant figures, dimensional analysis, and error analysis. Perfect for students preparing for competitive exams." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XN081SR2KP"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XN081SR2KP');
            `,
          }}
        />
        
        <style jsx>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }
          
          .page-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem 0;
            text-align: center;
          }
          
          .page-header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
          }
          
          .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
          }
          
          .page-nav {
            background: #fff;
            padding: 1rem 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
          }
          
          .nav-links {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 1rem;
            font-size: 0.9rem;
          }
          
          .nav-links a {
            color: #667eea;
            text-decoration: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            transition: background-color 0.3s;
          }
          
          .nav-links a:hover {
            background-color: #667eea;
            color: white;
          }
          
          .section {
            background: white;
            margin: 2rem 0;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          
          h2 {
            color: #667eea;
            font-size: 1.8rem;
            margin-bottom: 1rem;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 0.5rem;
          }
          
          h3 {
            color: #495057;
            font-size: 1.4rem;
            margin: 1.5rem 0 1rem 0;
          }
          
          h4 {
            color: #6c757d;
            font-size: 1.1rem;
            margin: 1rem 0 0.5rem 0;
          }
          
          .beginner-note {
            background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
            border-left: 4px solid #2196f3;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 5px;
          }
          
          .intermediate-note {
            background: linear-gradient(135deg, #fff3e0, #fce4ec);
            border-left: 4px solid #ff9800;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 5px;
          }
          
          .advanced-note {
            background: linear-gradient(135deg, #e8f5e8, #f1f8e9);
            border-left: 4px solid #4caf50;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 5px;
          }
          
          .example-box {
            background: #fff8e1;
            border: 1px solid #ffcc02;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 5px;
          }
          
          .formula-box {
            background: #f5f5f5;
            border: 1px solid #ddd;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 5px;
            text-align: center;
          }
          
          .key-point {
            background: #e8f5e8;
            border-left: 4px solid #4caf50;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 5px;
          }
          
          .warning-box {
            background: #ffebee;
            border-left: 4px solid #f44336;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 5px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
            font-size: 0.9rem;
          }
          
          th, td {
            border: 1px solid #ddd;
            padding: 0.75rem;
            text-align: left;
          }
          
          th {
            background-color: #667eea;
            color: white;
          }
          
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          
          .breadcrumb {
            background: #e9ecef;
            padding: 0.5rem 0;
            font-size: 0.9rem;
          }
          
          .breadcrumb a {
            color: #667eea;
            text-decoration: none;
          }
          
          .separator {
            margin: 0 0.5rem;
            color: #6c757d;
          }
          
          .scroll-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            display: none;
            font-size: 1.2rem;
            z-index: 1000;
          }
          
          @media (max-width: 768px) {
            .page-header h1 {
              font-size: 2rem;
            }
            
            .nav-links {
              flex-direction: column;
              gap: 0.5rem;
            }
            
            .section {
              padding: 1rem;
            }
            
            table {
              font-size: 0.8rem;
            }
          }
        `}</style>
      </Head>

      <div className="breadcrumb">
        <div className="container">
          <a href="/">Home</a>
          <span className="separator">›</span>
          <a href="/mechanics/foundations">Classical Mechanics</a>
          <span className="separator">›</span>
          <span>📏 Measurement</span>
        </div>
      </div>

      <header className="page-header">
        <div className="container">
          <h1>📏 Chapter 1: Measurement in Physics</h1>
          <p className="subtitle">Foundation of Scientific Physics - From Basics to Advanced Problem Solving</p>
        </div>
      </header>

      <nav className="page-nav">
        <div className="container">
          <div className="nav-links">
            <a href="#introduction">Introduction</a>
            <a href="#physical-quantities">Physical Quantities</a>
            <a href="#si-units">SI Units</a>
            <a href="#dimensional-analysis">Dimensional Analysis</a>
            <a href="#significant-figures">Significant Figures</a>
            <a href="#errors">Errors & Uncertainty</a>
            <a href="#instruments">Instruments</a>
            <a href="#greek-alphabet">Greek Alphabet</a>
            <a href="#practice">Practice</a>
          </div>
        </div>
      </nav>

      <main>
        <div className="container">
          
          {/* Introduction */}
          <section id="introduction" className="section">
            <h2>🌟 Introduction: Why Measurement Matters</h2>
            
            <div className="beginner-note">
              <h4>🔰 For Beginners:</h4>
              <p>Imagine trying to cook without measuring ingredients, or building a house without measuring dimensions. Physics is similar - we need precise measurements to understand how the universe works!</p>
            </div>
            
            <p><strong>Physics is fundamentally an experimental science.</strong> Every law, theory, and principle comes from careful observation and measurement. Consider these amazing examples:</p>
            
            <ul>
              <li>🛰️ GPS satellites need Einstein&apos;s relativity corrections to be accurate within meters</li>
              <li>🌊 LIGO detected gravitational waves by measuring changes smaller than 1/10,000th of a proton&apos;s width</li>
              <li>⚛️ Quantum mechanics emerged from precise measurements of blackbody radiation</li>
              <li>🌍 Climate science relies on temperature measurements accurate to 0.01°C</li>
            </ul>
            
            <div className="key-point">
              <h4>🎯 What You&apos;ll Master in This Chapter</h4>
              <ul>
                <li><strong>Physical Quantities:</strong> Understand what makes something measurable</li>
                <li><strong>SI Units:</strong> Master the international standard system</li>
                <li><strong>Dimensional Analysis:</strong> Use dimensions to check and derive equations</li>
                <li><strong>Significant Figures:</strong> Express precision correctly</li>
                <li><strong>Error Analysis:</strong> Quantify and minimize uncertainty</li>
                <li><strong>Instruments:</strong> Use measuring tools effectively</li>
                <li><strong>Problem Solving:</strong> Apply measurement concepts to solve problems</li>
              </ul>
            </div>
            
            <div className="intermediate-note">
              <h4>💡 Measurement Principles for Success:</h4>
              <ol>
                <li><strong>Precision:</strong> How close repeated measurements are to each other</li>
                <li><strong>Accuracy:</strong> How close measurements are to the true value</li>
                <li><strong>Resolution:</strong> The smallest change an instrument can detect</li>
                <li><strong>Reproducibility:</strong> Getting the same result in different conditions</li>
              </ol>
            </div>
          </section>

          {/* Physical Quantities */}
          <section id="physical-quantities" className="section">
            <h2>1.1 Physical Quantities and Their Classification</h2>
            
            <h3>What is a Physical Quantity?</h3>
            <p>A <strong>physical quantity</strong> is anything that can be measured numerically and expressed with appropriate units. It has two parts:</p>
            <ul>
              <li><strong>Numerical value</strong> (magnitude)</li>
              <li><strong>Unit</strong> (what we&apos;re measuring in)</li>
            </ul>
            
            <div className="example-box">
              <h4>📝 Examples of Physical Quantities</h4>
              <ul>
                <li><strong>Length:</strong> 5.2 meters</li>
                <li><strong>Time:</strong> 10.5 seconds</li>
                <li><strong>Mass:</strong> 2.3 kilograms</li>
                <li><strong>Temperature:</strong> 25°C</li>
                <li><strong>Speed:</strong> 60 km/h</li>
              </ul>
            </div>
            
            <h3>Classification by Mathematical Nature</h3>
            
            <div className="intermediate-note">
              <h4>💡 Scalar vs Vector Quantities</h4>
              <table>
                <thead>
                  <tr><th>Scalar Quantities</th><th>Vector Quantities</th></tr>
                </thead>
                <tbody>
                  <tr><td>Have magnitude only</td><td>Have both magnitude and direction</td></tr>
                  <tr><td>Add algebraically</td><td>Add vectorially</td></tr>
                  <tr><td>Examples: mass, time, speed, energy</td><td>Examples: displacement, velocity, force</td></tr>
                </tbody>
              </table>
            </div>
            
            <h3>Classification by Measurement Independence</h3>
            
            <div className="key-point">
              <h4>📏 Base vs Derived Quantities</h4>
              <p><strong>Base quantities</strong> are fundamental - they can&apos;t be expressed in terms of other quantities.</p>
              <p><strong>Derived quantities</strong> are combinations of base quantities.</p>
            </div>
            
            <h4>The Seven SI Base Quantities</h4>
            <table>
              <thead>
                <tr><th>Quantity</th><th>Symbol</th><th>SI Unit</th><th>Unit Symbol</th></tr>
              </thead>
              <tbody>
                <tr><td>Length</td><td>l, s, d, h</td><td>meter</td><td>m</td></tr>
                <tr><td>Mass</td><td>m</td><td>kilogram</td><td>kg</td></tr>
                <tr><td>Time</td><td>t</td><td>second</td><td>s</td></tr>
                <tr><td>Electric current</td><td>I</td><td>ampere</td><td>A</td></tr>
                <tr><td>Temperature</td><td>T</td><td>kelvin</td><td>K</td></tr>
                <tr><td>Amount of substance</td><td>n</td><td>mole</td><td>mol</td></tr>
                <tr><td>Luminous intensity</td><td>$I_v$</td><td>candela</td><td>cd</td></tr>
              </tbody>
            </table>
          </section>

          {/* Continue with remaining sections... */}
          <section id="si-units" className="section">
            <h2>1.2 The International System of Units (SI)</h2>
            <p>The <strong>International System of Units (SI)</strong> is the modern metric system used worldwide. It provides a consistent, precise way to measure all physical quantities.</p>
            
            <div className="beginner-note">
              <h4>🔰 Why SI is Amazing:</h4>
              <ul>
                <li><strong>Universal:</strong> Same units used by scientists worldwide</li>
                <li><strong>Decimal-based:</strong> Easy conversions using powers of 10</li>
                <li><strong>Coherent:</strong> Derived units naturally follow from base units</li>
                <li><strong>Precise:</strong> Based on fundamental constants of nature (since 2019)</li>
                <li><strong>Expandable:</strong> New units can be easily added</li>
              </ul>
            </div>
          </section>

          {/* Add more sections as needed - the pattern continues... */}
          
        </div>
      </main>

      <button 
        className="scroll-to-top" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Scroll to top"
      >
        ↑
      </button>
    </>
  );
}

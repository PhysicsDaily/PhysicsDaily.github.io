<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chapter 1: Measurement in Physics - Physics Daily</title>
    <meta name="description" content="Master the fundamentals of measurement in physics: units, significant figures, dimensional analysis, and error analysis. Perfect for students preparing for competitive exams.">
    
    <!-- MathJax Configuration -->
    <script>
        MathJax = {
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
    </script>
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XN081SR2KP"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XN081SR2KP');
    </script>
    
    <style>
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
        
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem 0;
            text-align: center;
        }
        
        h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        
        .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        nav {
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
        
        .nav-links a:hover, .nav-links a.active {
            background-color: #667eea;
            color: white;
        }
        
        main {
            padding: 2rem 0;
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
        
        .practice-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
        }
        
        .practice-card {
            background: white;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 1.5rem;
            text-align: center;
            text-decoration: none;
            color: inherit;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .practice-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        
        .icon {
            font-size: 3rem;
            margin-bottom: 1rem;
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
        
        .breadcrumb .separator {
            margin: 0 0.5rem;
            color: #6c757d;
        }
        
        footer {
            background: #343a40;
            color: white;
            text-align: center;
            padding: 2rem 0;
            margin-top: 3rem;
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
        }
        
        @media (max-width: 768px) {
            h1 {
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
    </style>
</head>
<body>
    <div class="breadcrumb">
        <div class="container">
            <a href="/">Home</a>
            <span class="separator">›</span>
            <a href="/mechanics/foundations">Classical Mechanics</a>
            <span class="separator">›</span>
            <span>📏 Measurement</span>
        </div>
    </div>

    <header>
        <div class="container">
            <h1>📏 Chapter 1: Measurement in Physics</h1>
            <p class="subtitle">Foundation of Scientific Physics - From Basics to Advanced Problem Solving</p>
        </div>
    </header>

    <nav>
        <div class="container">
            <div class="nav-links">
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
        <div class="container">
            
            <!-- Introduction -->
            <section id="introduction" class="section">
                <h2>🌟 Introduction: Why Measurement Matters</h2>
                
                <div class="beginner-note">
                    <h4>🔰 For Beginners:</h4>
                    <p>Imagine trying to cook without measuring ingredients, or building a house without measuring dimensions. Physics is similar - we need precise measurements to understand how the universe works! Every law of physics started with careful observations and measurements.</p>
                </div>
                
                <p><strong>Physics is fundamentally an experimental science.</strong> Every law, theory, and principle comes from careful observation and measurement. Consider these amazing examples:</p>
                
                <ul>
                    <li>🛰️ GPS satellites need Einstein's relativity corrections to be accurate within meters</li>
                    <li>🌊 LIGO detected gravitational waves by measuring changes smaller than 1/10,000th of a proton's width</li>
                    <li>⚛️ Quantum mechanics emerged from precise measurements of blackbody radiation</li>
                    <li>🌍 Climate science relies on temperature measurements accurate to 0.01°C</li>
                </ul>
                
                <div class="key-point">
                    <h4>🎯 What You'll Master in This Chapter</h4>
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
                
                <div class="intermediate-note">
                    <h4>💡 Measurement Principles for Success:</h4>
                    <ol>
                        <li><strong>Precision:</strong> How close repeated measurements are to each other</li>
                        <li><strong>Accuracy:</strong> How close measurements are to the true value</li>
                        <li><strong>Resolution:</strong> The smallest change an instrument can detect</li>
                        <li><strong>Reproducibility:</strong> Getting the same result in different conditions</li>
                    </ol>
                </div>
            </section>

            <!-- Physical Quantities -->
            <section id="physical-quantities" class="section">
                <h2>1.1 Physical Quantities and Their Classification</h2>
                
                <h3>What is a Physical Quantity?</h3>
                <p>A <strong>physical quantity</strong> is anything that can be measured numerically and expressed with appropriate units. It has two parts:</p>
                <ul>
                    <li><strong>Numerical value</strong> (magnitude)</li>
                    <li><strong>Unit</strong> (what we're measuring in)</li>
                </ul>
                
                <div class="example-box">
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
                
                <div class="intermediate-note">
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
                
                <div class="key-point">
                    <h4>📏 Base vs Derived Quantities</h4>
                    <p><strong>Base quantities</strong> are fundamental - they can't be expressed in terms of other quantities.</p>
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
                
                <h4>Important Derived Quantities</h4>
                <table>
                    <thead>
                        <tr><th>Quantity</th><th>Symbol</th><th>Formula</th><th>SI Unit</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Area</td><td>A</td><td>$A = l \times w$</td><td>m²</td></tr>
                        <tr><td>Volume</td><td>V</td><td>$V = l \times w \times h$</td><td>m³</td></tr>
                        <tr><td>Density</td><td>ρ</td><td>$\rho = \frac{m}{V}$</td><td>kg/m³</td></tr>
                        <tr><td>Velocity</td><td>v</td><td>$v = \frac{\Delta s}{\Delta t}$</td><td>m/s</td></tr>
                        <tr><td>Acceleration</td><td>a</td><td>$a = \frac{\Delta v}{\Delta t}$</td><td>m/s²</td></tr>
                        <tr><td>Force</td><td>F</td><td>$F = ma$</td><td>N (kg⋅m/s²)</td></tr>
                        <tr><td>Energy</td><td>E</td><td>$E = F \cdot s$</td><td>J (kg⋅m²/s²)</td></tr>
                        <tr><td>Power</td><td>P</td><td>$P = \frac{E}{t}$</td><td>W (kg⋅m²/s³)</td></tr>
                    </tbody>
                </table>
                
                <div class="example-box">
                    <h4>📝 Building Derived Quantities</h4>
                    <p><strong>Example: How is pressure derived?</strong></p>
                    <p>Pressure = Force per unit area</p>
                    <p>$P = \frac{F}{A} = \frac{\text{kg⋅m/s²}}{\text{m²}} = \text{kg/(m⋅s²)}$</p>
                    <p>This gives us the Pascal (Pa) as the unit of pressure.</p>
                </div>
            </section>

            <!-- SI Units -->
            <section id="si-units" class="section">
                <h2>1.2 The International System of Units (SI)</h2>
                
                <p>The <strong>International System of Units (SI)</strong> is the modern metric system used worldwide. It provides a consistent, precise way to measure all physical quantities.</p>
                
                <div class="beginner-note">
                    <h4>🔰 Why SI is Amazing:</h4>
                    <ul>
                        <li><strong>Universal:</strong> Same units used by scientists worldwide</li>
                        <li><strong>Decimal-based:</strong> Easy conversions using powers of 10</li>
                        <li><strong>Coherent:</strong> Derived units naturally follow from base units</li>
                        <li><strong>Precise:</strong> Based on fundamental constants of nature (since 2019)</li>
                        <li><strong>Expandable:</strong> New units can be easily added</li>
                    </ul>
                </div>
                
                <h3>How SI Units Are Now Defined (2019 Redefinition)</h3>
                <p>Since 2019, all SI units are defined using exact values of fundamental physical constants:</p>
                
                <table>
                    <thead>
                        <tr><th>Unit</th><th>Defined Using</th><th>Constant Value</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>second (s)</td><td>Cesium frequency</td><td>Δν(Cs) = 9,192,631,770 Hz (exact)</td></tr>
                        <tr><td>meter (m)</td><td>Speed of light</td><td>c = 299,792,458 m/s (exact)</td></tr>
                        <tr><td>kilogram (kg)</td><td>Planck constant</td><td>h = 6.62607015×10⁻³⁴ J⋅s (exact)</td></tr>
                        <tr><td>ampere (A)</td><td>Elementary charge</td><td>e = 1.602176634×10⁻¹⁹ C (exact)</td></tr>
                        <tr><td>kelvin (K)</td><td>Boltzmann constant</td><td>k = 1.380649×10⁻²³ J/K (exact)</td></tr>
                        <tr><td>mole (mol)</td><td>Avogadro constant</td><td>$N_A$ = 6.02214076×10²³ mol⁻¹ (exact)</td></tr>
                        <tr><td>candela (cd)</td><td>Luminous efficacy</td><td>$K_{cd}$ = 683 lm/W (exact)</td></tr>
                    </tbody>
                </table>
                
                <h3>SI Prefixes: Making Numbers Manageable</h3>
                <p>SI prefixes allow us to express very large or very small numbers conveniently:</p>
                
                <table>
                    <thead>
                        <tr><th>Prefix</th><th>Symbol</th><th>Factor</th><th>Examples</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>tera</td><td>T</td><td>10¹²</td><td>1 THz = 10¹² Hz</td></tr>
                        <tr><td>giga</td><td>G</td><td>10⁹</td><td>1 GHz = 10⁹ Hz (radio frequencies)</td></tr>
                        <tr><td>mega</td><td>M</td><td>10⁶</td><td>1 MW = 10⁶ W (power plants)</td></tr>
                        <tr><td>kilo</td><td>k</td><td>10³</td><td>1 km = 10³ m (distances)</td></tr>
                        <tr><td>centi</td><td>c</td><td>10⁻²</td><td>1 cm = 10⁻² m (everyday measurements)</td></tr>
                        <tr><td>milli</td><td>m</td><td>10⁻³</td><td>1 mm = 10⁻³ m (small distances)</td></tr>
                        <tr><td>micro</td><td>μ</td><td>10⁻⁶</td><td>1 μm = 10⁻⁶ m (cell sizes)</td></tr>
                        <tr><td>nano</td><td>n</td><td>10⁻⁹</td><td>1 nm = 10⁻⁹ m (atomic scales)</td></tr>
                        <tr><td>pico</td><td>p</td><td>10⁻¹²</td><td>1 pm = 10⁻¹² m (nuclear scales)</td></tr>
                    </tbody>
                </table>
                
                <h3>Derived Units with Special Names</h3>
                <p>Some combinations of base units are so common they get special names:</p>
                
                <table>
                    <thead>
                        <tr><th>Quantity</th><th>Unit Name</th><th>Symbol</th><th>In Base Units</th><th>Common Use</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Force</td><td>newton</td><td>N</td><td>kg⋅m⋅s⁻²</td><td>Weight, tension</td></tr>
                        <tr><td>Energy</td><td>joule</td><td>J</td><td>kg⋅m²⋅s⁻²</td><td>Work, heat, electricity</td></tr>
                        <tr><td>Power</td><td>watt</td><td>W</td><td>kg⋅m²⋅s⁻³</td><td>Engines, light bulbs</td></tr>
                        <tr><td>Pressure</td><td>pascal</td><td>Pa</td><td>kg⋅m⁻¹⋅s⁻²</td><td>Weather, fluids</td></tr>
                        <tr><td>Frequency</td><td>hertz</td><td>Hz</td><td>s⁻¹</td><td>Waves, oscillations</td></tr>
                        <tr><td>Electric charge</td><td>coulomb</td><td>C</td><td>A⋅s</td><td>Electricity</td></tr>
                        <tr><td>Voltage</td><td>volt</td><td>V</td><td>kg⋅m²⋅s⁻³⋅A⁻¹</td><td>Electrical potential</td></tr>
                    </tbody>
                </table>
                
                <div class="example-box">
                    <h4>📝 Unit Conversion Practice</h4>
                    
                    <p><strong>Example 1:</strong> Convert 5.2 km to meters</p>
                    <p>$5.2 \text{ km} = 5.2 \times 10^3 \text{ m} = 5200 \text{ m}$</p>
                    
                    <p><strong>Example 2:</strong> Convert 250 mm to meters</p>
                    <p>$250 \text{ mm} = 250 \times 10^{-3} \text{ m} = 0.25 \text{ m}$</p>
                    
                    <p><strong>Example 3:</strong> Convert 72 km/h to m/s</p>
                    <p>$72 \frac{\text{km}}{\text{h}} = 72 \times \frac{10^3 \text{ m}}{3600 \text{ s}} = 72 \times \frac{1000}{3600} = 20 \text{ m/s}$</p>
                    
                    <p><strong>Quick tip:</strong> To convert km/h to m/s, divide by 3.6!</p>
                </div>
                
                <div class="intermediate-note">
                    <h4>💡 Common Non-SI Units Still Used</h4>
                    <ul>
                        <li><strong>Time:</strong> minute (min), hour (h), day (d), year (yr)</li>
                        <li><strong>Angle:</strong> degree (°), though radian (rad) is preferred</li>
                        <li><strong>Volume:</strong> liter (L), where 1 L = 10⁻³ m³</li>
                        <li><strong>Energy:</strong> electron volt (eV), calorie (cal), kilowatt-hour (kWh)</li>
                        <li><strong>Pressure:</strong> atmosphere (atm), bar, mmHg, torr</li>
                    </ul>
                </div>
            </section>

            <!-- Dimensional Analysis -->
            <section id="dimensional-analysis" class="section">
                <h2>1.3 Dimensional Analysis: A Powerful Problem-Solving Tool</h2>
                
                <p><strong>Dimensional analysis</strong> uses the dimensions of physical quantities to check equations, derive relationships, and solve problems. It's one of the most powerful tools in physics!</p>
                
                <div class="beginner-note">
                    <h4>🔰 What Are Dimensions?</h4>
                    <p>Dimensions tell us what type of quantity we're dealing with. For example, all lengths have dimension [L], whether they're measured in meters, feet, or light-years. The square brackets [ ] indicate we're talking about dimensions, not specific units.</p>
                </div>
                
                <h3>Fundamental Dimensions</h3>
                <p>In mechanics, we primarily use three fundamental dimensions:</p>
                <ul>
                    <li><strong>[M]</strong> - Mass dimension</li>
                    <li><strong>[L]</strong> - Length dimension</li>
                    <li><strong>[T]</strong> - Time dimension</li>
                </ul>
                
                <p>For electrical quantities, we add:</p>
                <ul>
                    <li><strong>[I]</strong> - Electric current dimension</li>
                    <li><strong>[Θ]</strong> - Temperature dimension (theta)</li>
                </ul>
                
                <h3>Dimensions of Common Physical Quantities</h3>
                <table>
                    <thead>
                        <tr><th>Quantity</th><th>Symbol</th><th>Dimensions</th><th>SI Unit</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Length, displacement</td><td>l, s</td><td>[L]</td><td>m</td></tr>
                        <tr><td>Area</td><td>A</td><td>[L²]</td><td>m²</td></tr>
                        <tr><td>Volume</td><td>V</td><td>[L³]</td><td>m³</td></tr>
                        <tr><td>Time</td><td>t</td><td>[T]</td><td>s</td></tr>
                        <tr><td>Mass</td><td>m</td><td>[M]</td><td>kg</td></tr>
                        <tr><td>Velocity</td><td>v</td><td>[LT⁻¹]</td><td>m/s</td></tr>
                        <tr><td>Acceleration</td><td>a</td><td>[LT⁻²]</td><td>m/s²</td></tr>
                        <tr><td>Force</td><td>F</td><td>[MLT⁻²]</td><td>N</td></tr>
                        <tr><td>Energy</td><td>E</td><td>[ML²T⁻²]</td><td>J</td></tr>
                        <tr><td>Power</td><td>P</td><td>[ML²T⁻³]</td><td>W</td></tr>
                        <tr><td>Pressure</td><td>p</td><td>[ML⁻¹T⁻²]</td><td>Pa</td></tr>
                        <tr><td>Density</td><td>ρ</td><td>[ML⁻³]</td><td>kg/m³</td></tr>
                    </tbody>
                </table>
                
                <div class="key-point">
                    <h4>📏 The Principle of Dimensional Homogeneity</h4>
                    <p>In any correct physical equation, all terms must have the same dimensions. This is the golden rule of dimensional analysis!</p>
                </div>
                
                <h3>Applications of Dimensional Analysis</h3>
                
                <h4>1. Checking Equations</h4>
                <div class="example-box">
                    <h4>📝 Example: Check if $s = ut + \frac{1}{2}at^2$ is dimensionally correct</h4>
                    
                    <p><strong>Step 1:</strong> Find dimensions of each term</p>
                    <ul>
                        <li>$s$ (displacement): [L]</li>
                        <li>$ut$ (initial velocity × time): [LT⁻¹][T] = [L]</li>
                        <li>$\frac{1}{2}at^2$ (acceleration × time²): [LT⁻²][T²] = [L]</li>
                    </ul>
                    
                    <p><strong>Step 2:</strong> Compare dimensions</p>
                    <p>All terms have dimension [L] ✓</p>
                    
                    <p><strong>Conclusion:</strong> The equation is dimensionally consistent!</p>
                </div>
                
                <h4>2. Deriving Relationships</h4>
                <div class="example-box">
                    <h4>📝 Example: Find how the period T of a pendulum depends on length l and gravity g</h4>
                    
                    <p><strong>Step 1:</strong> Assume $T \propto l^a g^b$ where a and b are unknown powers</p>
                    
                    <p><strong>Step 2:</strong> Write in dimensional form</p>
                    <p>$[T] = [L]^a [LT^{-2}]^b = [L]^{a+b} [T]^{-2b}$</p>
                    
                    <p><strong>Step 3:</strong> Compare powers on both sides</p>
                    <p>For time: $1 = -2b \Rightarrow b = -\frac{1}{2}$</p>
                    <p>For length: $0 = a + b \Rightarrow a = \frac{1}{2}$</p>
                    
                    <p><strong>Step 4:</strong> Write the result</p>
                    <p>$T \propto l^{1/2} g^{-1/2} = \sqrt{\frac{l}{g}}$</p>
                    
                    <p><strong>Final form:</strong> $T = 2\pi\sqrt{\frac{l}{g}}$ (the 2π comes from detailed analysis)</p>
                </div>
                
                <h4>3. Converting Units</h4>
                <div class="example-box">
                    <h4>📝 Example: Convert 1 newton to dynes (CGS system)</h4>
                    
                    <p><strong>Given:</strong> 1 N = 1 kg⋅m⋅s⁻²</p>
                    <p><strong>Need:</strong> Express in grams, centimeters, seconds</p>
                    
                    <p><strong>Conversion:</strong></p>
                    <p>1 kg = 10³ g</p>
                    <p>1 m = 10² cm</p>
                    
                    <p><strong>Therefore:</strong></p>
                    <p>1 N = 1 kg⋅m⋅s⁻² = (10³ g)(10² cm)s⁻² = 10⁵ g⋅cm⋅s⁻² = 10⁵ dyne</p>
                </div>
                
                <div class="intermediate-note">
                    <h4>💡 Advanced Application: Finding Unknown Quantities</h4>
                    <p>If you know the dimensions of all quantities in a problem, you can often figure out relationships even without knowing the detailed physics!</p>
                </div>
                
                <div class="warning-box">
                    <h4>⚠️ Limitations of Dimensional Analysis</h4>
                    <ul>
                        <li>Cannot determine dimensionless constants (like 2π, ½, etc.)</li>
                        <li>Cannot handle trigonometric, exponential, or logarithmic functions</li>
                        <li>Cannot determine whether terms add or subtract</li>
                        <li>Works only for relationships involving products and powers</li>
                    </ul>
                </div>
            </section>

            <!-- Significant Figures -->
            <section id="significant-figures" class="section">
                <h2>1.4 Significant Figures: Expressing Precision Correctly</h2>
                
                <p><strong>Significant figures</strong> (sig figs) indicate the precision of a measurement. They tell us which digits in a number are reliable and meaningful.</p>
                
                <div class="beginner-note">
                    <h4>🔰 Why Significant Figures Matter:</h4>
                    <p>If you measure a length as 12.3 cm with a ruler, you're confident about the digits 1, 2, and 3. But if you wrote 12.3456789 cm, you'd be claiming impossibly high precision! Sig figs help us express uncertainty honestly.</p>
                </div>
                
                <h3>Rules for Identifying Significant Figures</h3>
                
                <div class="key-point">
                    <h4>📏 The Complete Rules:</h4>
                    <ol>
                        <li><strong>Non-zero digits</strong> are always significant
                            <br>Example: 123 has 3 sig figs</li>
                        <li><strong>Zeros between non-zero digits</strong> are significant
                            <br>Example: 1003 has 4 sig figs</li>
                        <li><strong>Leading zeros</strong> are NOT significant
                            <br>Example: 0.0045 has 2 sig figs (only 4 and 5)</li>
                        <li><strong>Trailing zeros with decimal point</strong> are significant
                            <br>Example: 12.30 has 4 sig figs</li>
                        <li><strong>Trailing zeros without decimal point</strong> are ambiguous
                            <br>Example: 1200 could have 2, 3, or 4 sig figs</li>
                        <li><strong>Scientific notation</strong> removes ambiguity
                            <br>Example: 1.20 × 10³ clearly has 3 sig figs</li>
                    </ol>
                </div>
                
                <h3>Examples of Significant Figures</h3>
                <table>
                    <thead>
                        <tr><th>Number</th><th>Significant Figures</th><th>Count</th><th>Explanation</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>123</td><td>1, 2, 3</td><td>3</td><td>All non-zero</td></tr>
                        <tr><td>0.0045</td><td>4, 5</td><td>2</td><td>Leading zeros don't count</td></tr>
                        <tr><td>0.450</td><td>4, 5, 0</td><td>3</td><td>Trailing zero after decimal counts</td></tr>
                        <tr><td>1004</td><td>1, 0, 0, 4</td><td>4</td><td>Zero between non-zeros counts</td></tr>
                        <tr><td>500</td><td>?</td><td>1, 2, or 3</td><td>Ambiguous without context</td></tr>
                        <tr><td>5.00 × 10²</td><td>5, 0, 0</td><td>3</td><td>Scientific notation clarifies</td></tr>
                        <tr><td>6.02 × 10²³</td><td>6, 0, 2</td><td>3</td><td>Avogadro's number (if measured)</td></tr>
                    </tbody>
                </table>
                
                <h3>Rules for Calculations with Significant Figures</h3>
                
                <div class="intermediate-note">
                    <h4>💡 Addition and Subtraction Rule:</h4>
                    <p>Round the result to the <strong>same decimal place</strong> as the measurement with the fewest decimal places.</p>
                    
                    <p><strong>Example:</strong></p>
                    <p>12.34 + 1.2 + 0.123 = 13.663 → <strong>13.7</strong> (1.2 has only 1 decimal place)</p>
                </div>
                
                <div class="intermediate-note">
                    <h4>💡 Multiplication and Division Rule:</h4>
                    <p>Round the result to the <strong>same number of significant figures</strong> as the measurement with the fewest sig figs.</p>
                    
                    <p><strong>Example:</strong></p>
                    <p>3.14 × 2.0 = 6.28 → <strong>6.3</strong> (2.0 has only 2 sig figs)</p>
                </div>
                
                <div class="example-box">
                    <h4>📝 Complete Calculation Example</h4>
                    
                    <p><strong>Problem:</strong> Calculate the area of a rectangle with length 12.45 m and width 3.2 m.</p>
                    
                    <p><strong>Solution:</strong></p>
                    <p>Area = length × width = 12.45 × 3.2 = 39.84 m²</p>
                    
                    <p><strong>Significant figures:</strong></p>
                    <ul>
                        <li>12.45 has 4 sig figs</li>
                        <li>3.2 has 2 sig figs</li>
                        <li>Result should have 2 sig figs</li>
                    </ul>
                    
                    <p><strong>Final answer:</strong> 40 m² or 4.0 × 10¹ m²</p>
                </div>
                
                <h3>Special Cases and Tips</h3>
                
                <div class="advanced-note">
                    <h4>🎓 Advanced Considerations:</h4>
                    <ul>
                        <li><strong>Exact numbers</strong> (like π, counted objects) have infinite sig figs</li>
                        <li><strong>Intermediate calculations:</strong> Keep extra digits, round only the final answer</li>
                        <li><strong>Rounding rules:</strong> Round 5 up if odd digit before, down if even (reduces bias)</li>
                        <li><strong>Leading coefficients:</strong> In 2.5 × 10⁻³, only count sig figs in 2.5</li>
                    </ul>
                </div>
                
                <div class="warning-box">
                    <h4>⚠️ Common Mistakes to Avoid</h4>
                    <ul>
                        <li>Don't confuse decimal places with significant figures</li>
                        <li>Don't round intermediate steps - only the final answer</li>
                        <li>Don't assume trailing zeros are significant without context</li>
                        <li>Don't forget that measured values limit precision, not calculated ones</li>
                    </ul>
                </div>
            </section>

            <!-- Errors and Uncertainty -->
            <section id="errors" class="section">
                <h2>1.5 Errors and Uncertainty in Measurements</h2>
                
                <p>No measurement is perfect! Understanding and quantifying uncertainty is crucial for good experimental physics.</p>
                
                <div class="beginner-note">
                    <h4>🔰 Understanding "Error" in Physics:</h4>
                    <p>In physics, "error" doesn't mean "mistake." It means "uncertainty" - the unavoidable limitation in how precisely we can measure something. Even the best instruments have limits!</p>
                </div>
                
                <h3>Types of Errors</h3>
                
                <div class="key-point">
                    <h4>📊 Two Main Categories:</h4>
                    <table>
                        <thead>
                            <tr><th>Random Errors</th><th>Systematic Errors</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Unpredictable variations</td><td>Consistent bias in one direction</td></tr>
                            <tr><td>Affect precision</td><td>Affect accuracy</td></tr>
                            <tr><td>Can be reduced by averaging</td><td>Must be identified and corrected</td></tr>
                            <tr><td>Example: Reading fluctuations</td><td>Example: Miscalibrated instrument</td></tr>
                        </tbody>
                    </table>
                </div>
                
                <h4>Random Errors - Examples:</h4>
                <ul>
                    <li>🎯 Human reaction time variations in stopwatch measurements</li>
                    <li>📏 Difficulty reading exact position on analog scales</li>
                    <li>🌡️ Environmental fluctuations (temperature, vibrations)</li>
                    <li>⚡ Electronic noise in instruments</li>
                </ul>
                
                <h4>Systematic Errors - Examples:</h4>
                <ul>
                    <li>⚖️ Scale that reads 2% high due to miscalibration</li>
                    <li>📐 Ruler with worn-down zero mark</li>
                    <li>🕐 Clock that runs consistently slow</li>
                    <li>👁️ Parallax error from viewing scales at an angle</li>
                </ul>
                
                <h3>Accuracy vs Precision</h3>
                
                <div class="intermediate-note">
                    <h4>💡 Target Analogy:</h4>
                    <p>Imagine throwing darts at a target:</p>
                    <ul>
                        <li><strong>Accurate & Precise:</strong> Darts clustered near bullseye</li>
                        <li><strong>Accurate but Imprecise:</strong> Darts scattered around bullseye</li>
                        <li><strong>Precise but Inaccurate:</strong> Darts clustered away from bullseye</li>
                        <li><strong>Neither:</strong> Darts scattered everywhere</li>
                    </ul>
                </div>
                
                <h3>Quantifying Uncertainty</h3>
                
                <h4>Absolute vs Relative Error</h4>
                <div class="formula-box">
                    <p><strong>Absolute Error:</strong> $\Delta x = |x_{\text{measured}} - x_{\text{true}}|$</p>
                    <p><strong>Relative Error:</strong> $\frac{\Delta x}{x_{\text{true}}} \times 100\%$</p>
                    <p><strong>Percentage Error:</strong> $\frac{\Delta x}{x_{\text{true}}} \times 100\%$</p>
                </div>
                
                <div class="example-box">
                    <h4>📝 Error Calculation Example</h4>
                    
                    <p><strong>Scenario:</strong> You measure a 100.0 g mass and get 98.5 g</p>
                    
                    <p><strong>Absolute error:</strong> $\Delta m = |98.5 - 100.0| = 1.5$ g</p>
                    
                    <p><strong>Relative error:</strong> $\frac{1.5}{100.0} = 0.015 = 1.5\%$</p>
                    
                    <p><strong>Conclusion:</strong> The measurement is off by 1.5 g or 1.5%</p>
                </div>
                
                <h3>Combining Uncertainties</h3>
                
                <p>When calculating with measured values, uncertainties combine according to specific rules:</p>
                
                <div class="advanced-note">
                    <h4>🎓 Uncertainty Propagation Rules:</h4>
                    
                    <p><strong>Addition/Subtraction:</strong> $\Delta(A \pm B) = \sqrt{(\Delta A)^2 + (\Delta B)^2}$</p>
                    
                    <p><strong>Multiplication/Division:</strong> $\frac{\Delta(AB)}{AB} = \sqrt{\left(\frac{\Delta A}{A}\right)^2 + \left(\frac{\Delta B}{B}\right)^2}$</p>
                    
                    <p><strong>Powers:</strong> If $C = A^n$, then $\frac{\Delta C}{C} = n\frac{\Delta A}{A}$</p>
                </div>
                
                <div class="example-box">
                    <h4>📝 Uncertainty Propagation Example</h4>
                    
                    <p><strong>Problem:</strong> Calculate density from mass = (15.2 ± 0.1) g and volume = (2.0 ± 0.1) cm³</p>
                    
                    <p><strong>Solution:</strong></p>
                    <p>$\rho = \frac{m}{V} = \frac{15.2}{2.0} = 7.6$ g/cm³</p>
                    
                    <p><strong>Relative uncertainties:</strong></p>
                    <p>$\frac{\Delta m}{m} = \frac{0.1}{15.2} = 0.0066$ (0.66%)</p>
                    <p>$\frac{\Delta V}{V} = \frac{0.1}{2.0} = 0.05$ (5%)</p>
                    
                    <p><strong>Combined relative uncertainty:</strong></p>
                    <p>$\frac{\Delta \rho}{\rho} = \sqrt{(0.0066)^2 + (0.05)^2} = 0.050$ (5%)</p>
                    
                    <p><strong>Absolute uncertainty:</strong> $\Delta \rho = 0.050 \times 7.6 = 0.4$ g/cm³</p>
                    
                    <p><strong>Final result:</strong> $\rho = (7.6 \pm 0.4)$ g/cm³</p>
                </div>
                
                <h3>Reducing Errors</h3>
                
                <div class="key-point">
                    <h4>🎯 Strategies for Better Measurements:</h4>
                    <ul>
                        <li><strong>Calibrate instruments</strong> regularly</li>
                        <li><strong>Take multiple readings</strong> and average them</li>
                        <li><strong>Control environmental conditions</strong></li>
                        <li><strong>Use appropriate instruments</strong> for the precision needed</li>
                        <li><strong>Eliminate parallax</strong> by reading at eye level</li>
                        <li><strong>Account for zero errors</strong> in instruments</li>
                    </ul>
                </div>
            </section>

            <!-- Instruments -->
            <section id="instruments" class="section">
                <h2>1.6 Measurement Instruments and Techniques</h2>
                
                <p>Understanding your instruments is key to making good measurements. Let's explore common physics instruments and how to use them properly.</p>
                
                <h3>Key Instrument Concepts</h3>
                
                <div class="intermediate-note">
                    <h4>💡 Important Terms:</h4>
                    <ul>
                        <li><strong>Least Count (LC):</strong> Smallest measurement an instrument can make</li>
                        <li><strong>Range:</strong> Minimum to maximum values the instrument can measure</li>
                        <li><strong>Zero Error:</strong> Non-zero reading when the true value is zero</li>
                        <li><strong>Sensitivity:</strong> How much the reading changes for a small change in the measured quantity</li>
                    </ul>
                </div>
                
                <h3>Common Physics Instruments</h3>
                
                <h4>1. Vernier Calipers</h4>
                <div class="key-point">
                    <h4>📏 Vernier Calipers Specifications:</h4>
                    <ul>
                        <li><strong>Least Count:</strong> Usually 0.1 mm or 0.02 mm</li>
                        <li><strong>Formula:</strong> LC = 1 MSD - 1 VSD</li>
                        <li><strong>Uses:</strong> External dimensions, internal dimensions, depth, height</li>
                    </ul>
                </div>
                
                <div class="example-box">
                    <h4>📝 Reading Vernier Calipers</h4>
                    <p><strong>Steps:</strong></p>
                    <ol>
                        <li>Note the main scale reading just before the zero of vernier scale</li>
                        <li>Find which vernier division aligns exactly with a main scale division</li>
                        <li>Reading = Main scale reading + (Vernier division × LC)</li>
                    </ol>
                    
                    <p><strong>Example:</strong> Main scale = 2.4 cm, 7th vernier line matches, LC = 0.01 cm</p>
                    <p>Total reading = 2.4 + (7 × 0.01) = 2.47 cm</p>
                </div>
                
                <h4>2. Screw Gauge (Micrometer)</h4>
                <div class="key-point">
                    <h4>🔧 Screw Gauge Specifications:</h4>
                    <ul>
                        <li><strong>Least Count:</strong> Usually 0.01 mm</li>
                        <li><strong>Formula:</strong> LC = Pitch / Number of circular divisions</li>
                        <li><strong>Uses:</strong> Very small thicknesses, wire diameters</li>
                    </ul>
                </div>
                
                <h4>3. Physical Balance</h4>
                <div class="key-point">
                    <h4>⚖️ Balance Features:</h4>
                    <ul>
                        <li><strong>Least Count:</strong> Usually 1 mg to 10 mg</li>
                        <li><strong>Sensitivity:</strong> How much the beam moves for small mass differences</li>
                        <li><strong>Uses:</strong> Precise mass measurements</li>
                    </ul>
                </div>
                
                <h4>4. Stopwatch</h4>
                <div class="key-point">
                    <h4>⏱️ Timing Considerations:</h4>
                    <ul>
                        <li><strong>Least Count:</strong> 0.01 s or 0.1 s</li>
                        <li><strong>Human reaction time:</strong> ±0.1 to 0.2 s uncertainty</li>
                        <li><strong>Tip:</strong> Start from a predictable event, take multiple readings</li>
                    </ul>
                </div>
                
                <h3>Zero Error and Corrections</h3>
                
                <div class="warning-box">
                    <h4>⚠️ Types of Zero Error:</h4>
                    <ul>
                        <li><strong>Positive Zero Error:</strong> Instrument reads above zero when it should be zero
                            <br>Correction: Subtract the zero reading from all measurements</li>
                        <li><strong>Negative Zero Error:</strong> Instrument reads below zero when it should be zero
                            <br>Correction: Add the absolute value of zero reading to all measurements</li>
                    </ul>
                </div>
                
                <div class="example-box">
                    <h4>📝 Zero Error Correction Example</h4>
                    
                    <p><strong>Scenario:</strong> Vernier calipers show 0.04 cm when jaws are closed</p>
                    <p><strong>Type:</strong> Positive zero error</p>
                    <p><strong>Raw measurement:</strong> 2.47 cm</p>
                    <p><strong>Corrected measurement:</strong> 2.47 - 0.04 = 2.43 cm</p>
                </div>
                
                <h3>Digital vs Analog Instruments</h3>
                
                <table>
                    <thead>
                        <tr><th>Aspect</th><th>Digital</th><th>Analog</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Reading</td><td>Direct numerical display</td><td>Scale interpretation needed</td></tr>
                        <tr><td>Precision</td><td>Limited by display digits</td><td>Limited by scale divisions</td></tr>
                        <tr><td>Parallax error</td><td>Eliminated</td><td>Possible if not read at eye level</td></tr>
                        <tr><td>Response</td><td>Can show rapid changes</td><td>Smooths out fluctuations</td></tr>
                        <tr><td>Calibration</td><td>May drift over time</td><td>More stable mechanically</td></tr>
                    </tbody>
                </table>
                
                <h3>Best Practices for Measurements</h3>
                
                <div class="advanced-note">
                    <h4>🎓 Professional Measurement Tips:</h4>
                    <ol>
                        <li><strong>Environment control:</strong> Minimize temperature, vibration, electrical interference</li>
                        <li><strong>Warm-up time:</strong> Allow electronic instruments to stabilize</li>
                        <li><strong>Repeated measurements:</strong> Take multiple readings and average</li>
                        <li><strong>Cross-checking:</strong> Use different methods when possible</li>
                        <li><strong>Documentation:</strong> Record conditions, instrument details, uncertainties</li>
                        <li><strong>Regular calibration:</strong> Check against known standards</li>
                    </ol>
                </div>
            </section>

            <!-- Greek Alphabet -->
            <section id="greek-alphabet" class="section">
                <h2>1.7 Greek Alphabet in Physics</h2>
                
                <p>Greek letters are extensively used in physics to represent various quantities. Learning them is essential for understanding physics notation.</p>
                
                <div class="beginner-note">
                    <h4>🔰 Why Greek Letters?</h4>
                    <p>Physics uses Greek letters because the Latin alphabet runs out of symbols quickly! Greek letters help distinguish between different types of quantities and are part of the international language of science.</p>
                </div>
                
                <h3>Complete Greek Alphabet with Physics Applications</h3>
                
                <table>
                    <thead>
                        <tr><th>Name</th><th>Uppercase</th><th>Lowercase</th><th>Common Physics Uses</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Alpha</td><td>Α</td><td>α</td><td>Angular acceleration, fine structure constant, alpha particles</td></tr>
                        <tr><td>Beta</td><td>Β</td><td>β</td><td>Beta particles, velocity parameter (v/c), angles</td></tr>
                        <tr><td>Gamma</td><td>Γ</td><td>γ</td><td>Lorentz factor, gamma rays, surface tension</td></tr>
                        <tr><td>Delta</td><td>Δ</td><td>δ</td><td>Change (Δ), small change (δ), uncertainty</td></tr>
                        <tr><td>Epsilon</td><td>Ε</td><td>ε</td><td>Permittivity (ε₀), strain, energy in small quantities</td></tr>
                        <tr><td>Zeta</td><td>Ζ</td><td>ζ</td><td>Damping coefficient, zeta function</td></tr>
                        <tr><td>Eta</td><td>Η</td><td>η</td><td>Efficiency (η), viscosity, refractive index</td></tr>
                        <tr><td>Theta</td><td>Θ</td><td>θ</td><td>Angles, temperature (absolute), phase</td></tr>
                        <tr><td>Iota</td><td>Ι</td><td>ι</td><td>Rarely used in physics</td></tr>
                        <tr><td>Kappa</td><td>Κ</td><td>κ</td><td>Thermal conductivity, spring constant, wave number</td></tr>
                        <tr><td>Lambda</td><td>Λ</td><td>λ</td><td>Wavelength (λ), decay constant, cosmological constant</td></tr>
                        <tr><td>Mu</td><td>Μ</td><td>μ</td><td>Coefficient of friction (μ), permeability, micro prefix</td></tr>
                        <tr><td>Nu</td><td>Ν</td><td>ν</td><td>

---
layout: default
title: "Learning Resources"
description: "Comprehensive collection of physics learning resources including textbooks, videos, lectures, and practice materials for all levels from beginner to advanced."
css: |
    <style>
        .main-content {
            background: var(--bg-secondary);
        }
        .section-title {
            font-size: clamp(1.5rem, 3vw, 2rem);
            font-weight: 600;
            margin-bottom: 2rem;
            position: relative;
            padding-left: 1rem;
        }
        .section-title:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: var(--primary-color);
            border-radius: 2px;
        }
        .resource-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }
        .resource-card {
            background: var(--card-bg);
            border-radius: var(--border-radius);
            padding: 1.5rem;
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-sm);
        }
        .resource-card h3 {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }
        .resource-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 500;
        }
        .resource-list {
            background: var(--card-bg);
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
            margin-bottom: 2rem;
        }
        .resource-list h3 {
            background: var(--bg-tertiary);
            padding: 1rem 1.5rem;
            font-size: 1.1rem;
        }
        .resource-list ul { list-style: none; }
        .resource-list li { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-color); }
        .resource-list li:last-child { border-bottom: none; }
        .highlight-box {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
            color: white;
            padding: 2rem;
            border-radius: var(--border-radius);
            margin: 2rem 0;
            text-align: center;
        }
    </style>
---

<header class="header">
    <div class="container">
        <h1>Learning Resources</h1>
        <p>Comprehensive collection of physics learning materials from beginner to advanced levels</p>
    </div>
</header>

<main class="main-content">
    <div class="container">
        <section class="section fade-in">
            <div class="highlight-box">
                <h3>📚 Key Principle for Success</h3>
                <p>For each subject, choose <strong>one reliable resource</strong> from the lists below and rely mainly on that! Cohesive resources like a great textbook can help you avoid confusion and maintain a structured learning path.</p>
            </div>
        </section>

        <section class="section fade-in">
            <h2 class="section-title">🎯 Physics Beyond</h2>
            <div class="resource-grid">
                <div class="resource-card">
                    <h3>Kevin Zhou's Physics Guides</h3>
                    <p>Comprehensive handouts and guides for advanced physics topics, written with exceptional clarity and depth.</p>
                    <a href="https://knzhou.github.io/" class="resource-link" target="_blank">
                        🌐 Visit Website
                    </a>
                </div>
            </div>
        </section>

        <section class="section fade-in">
            <h2 class="section-title">🎥 Video Resources</h2>
            <div class="resource-grid">
                 <div class="resource-card">
                    <h3>Flipping Physics</h3>
                    <p>A great website to utilize for AP Physics. Highly recommended for complete reliance. If you're confused about a unit, find that corresponding unit here!</p>
                    <a href="https://www.flippingphysics.com/" class="resource-link" target="_blank">
                        🎬 Watch Videos
                    </a>
                </div>
                </div>
        </section>

        <section class="section fade-in">
            <h2 class="section-title">📖 Textbook Recommendations</h2>
            <div class="resource-list">
                <h3>Algebra-based Physics (AP Physics 1&2)</h3>
                <ul>
                    <li><strong>Hewitt</strong> <span>- Conceptual Physics</span></li>
                    </ul>
            </div>
            </section>

        <section class="section fade-in">
            <div class="highlight-box">
                <h3>🚀 Ready to Start Learning?</h3>
                <p>Choose your level and dive into our structured physics curriculum. Remember: consistency and choosing the right resources are key to mastering physics!</p>
                <br>
                <a href="index.html" class="btn" style="background: rgba(255,255,255,0.2); border: 1px solid white;">
                    📚 Start Learning Physics
                </a>
            </div>
        </section>
    </div>
</main>

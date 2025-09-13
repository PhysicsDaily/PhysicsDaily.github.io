const __initGlobal = function() {
    // --- Ensure Global Header & Auth on all pages ---
    (function ensureGlobalHeaderAndAuth() {
        if (window.__globalHeaderEnsured) return; // idempotent guard

        const ensureCss = (hrefMatch) => !!document.querySelector(`link[rel="stylesheet"][href*="${hrefMatch}"]`);
        const addCss = (href) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        };

        const scriptAlreadyOnPage = (namePart) => Array.from(document.querySelectorAll('script[src]')).some(s => s.src.includes(namePart));
        const loadScript = (src) => new Promise((resolve, reject) => {
            if (scriptAlreadyOnPage(src)) { resolve('skipped'); return; }
            const el = document.createElement('script');
            el.src = src;
            el.async = false; // preserve order
            el.onload = () => resolve();
            el.onerror = (e) => reject(e);
            document.head.appendChild(el);
        });

        const run = async () => {
            try {
                // 1) Ensure critical CSS immediately (header + auth modal)
                if (!ensureCss('header-fixed.css')) {
                    addCss('/assets/css/header-fixed.css');
                }
                // Auth modal base styles keep the modal hidden by default
                if (!ensureCss('auth-styles.css')) {
                    addCss('/assets/css/auth-styles.css');
                }

                // 2) Ensure placeholder to minimize layout shift
                if (!document.getElementById('global-header')) {
                    const ph = document.createElement('div');
                    ph.id = 'global-header';
                    document.body.insertBefore(ph, document.body.firstChild);
                }

                // 3) Start header injection ASAP (independent of Firebase)
                const headerLoaderP = scriptAlreadyOnPage('header-loader.js')
                    ? Promise.resolve('skipped')
                    : loadScript('/assets/js/header-loader.js');

                // 4) Load Firebase compat SDKs (sequential), in parallel with header loader
                const firebaseP = (typeof window.firebase === 'undefined')
                    ? loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js')
                        .then(() => loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js'))
                        .then(() => loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js'))
                    : Promise.resolve('present');

                // 5) After Firebase, load site auth scripts in order
                const siteAuthP = firebaseP
                    .then(async () => {
                        if (typeof window.firebaseConfig === 'undefined') {
                            await loadScript('/assets/js/firebase-config.js');
                        }
                        if (typeof window.authManager === 'undefined') {
                            await loadScript('/assets/js/auth-manager.js');
                        }
                        if (typeof window.authUI === 'undefined') {
                            await loadScript('/assets/js/auth-ui.js');
                        }
                        // Progress + gamification CSS
                        if (!ensureCss('progress-tracker.css')) {
                            addCss('/assets/css/progress-tracker.css');
                        }
                        // Load progress and gamification utilities
                        if (!scriptAlreadyOnPage('progress-tracker.js')) {
                            await loadScript('/assets/js/progress-tracker.js');
                        }
                        if (!scriptAlreadyOnPage('gamification.js')) {
                            await loadScript('/assets/js/gamification.js');
                        }
                    });

                // 6) Load auth-navigation after header injected and auth scripts ready
                await Promise.all([headerLoaderP, siteAuthP]);
                if (!scriptAlreadyOnPage('auth-navigation.js')) {
                    await loadScript('/assets/js/auth-navigation.js');
                }

                // 7) Ensure footer placeholder and loader
                if (!document.getElementById('global-footer')) {
                    const fp = document.createElement('div');
                    fp.id = 'global-footer';
                    document.body.appendChild(fp);
                }
                if (!scriptAlreadyOnPage('footer-loader.js')) {
                    await loadScript('/assets/js/footer-loader.js');
                }

                window.__globalHeaderEnsured = true;
            } catch (e) {
                console.error('[Global] Failed to ensure header/auth scripts:', e);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', run);
        } else {
            run();
        }
    })();
    // --- Personalized Welcome ---
    function showPersonalizedWelcome() {
        if (typeof authManager !== 'undefined' && authManager.getCurrentUser()) {
            const user = authManager.getCurrentUser();
            const welcomeDiv = document.getElementById('personalizedWelcome');
            if (welcomeDiv) {
                const name = user.displayName || user.email.split('@')[0];
                const p = welcomeDiv.querySelector('p');
                if (p) {
                    p.innerHTML = `Welcome back, <strong>${name}</strong>! Continue your physics journey where you left off.`;
                }
                welcomeDiv.style.display = 'block';
                welcomeDiv.style.animation = 'fadeIn 0.5s ease';
            }
        }
    }
    
    // Check auth state on load
    if (typeof authManager !== 'undefined') {
        authManager.on('authStateChanged', (user) => {
            if (user) {
                showPersonalizedWelcome();
                updatePageForSignedInUser();
                // Backfill any local XP to cloud so the leaderboard reflects it
                try {
                    if (window.gamification && typeof gamification.syncXpToCloud === 'function') {
                        gamification.syncXpToCloud();
                    }
                } catch(e) { console.warn('[Global] XP sync on sign-in failed:', e); }
            } else {
                hidePersonalizedElements();
            }
        });
    }
    
    // Update page elements for signed-in users
    function updatePageForSignedInUser() {
        // Add 'signed-in' class to body for conditional styling
        document.body.classList.add('signed-in');
        
        // Update CTA buttons if needed
        const startLearningBtn = document.querySelector('a[href="#foundations"]');
        if (startLearningBtn) {
            startLearningBtn.innerHTML = '📚 Continue Learning';
        }
    }
    
    function hidePersonalizedElements() {
        document.body.classList.remove('signed-in');
        const welcomeDiv = document.getElementById('personalizedWelcome');
        if (welcomeDiv) {
            welcomeDiv.style.display = 'none';
        }
    }

    // --- Theme Toggle Functionality ---
    const lightModeBtn = document.querySelector('#light-mode-btn, #light-mode, #light-theme');
    const darkModeBtn = document.querySelector('#dark-mode-btn, #dark-mode, #dark-theme');
    const docElement = document.documentElement;

    // Function to apply the theme
    const applyTheme = (theme) => {
        docElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            if(darkModeBtn) darkModeBtn.classList.add('active');
            if(lightModeBtn) lightModeBtn.classList.remove('active');
        } else {
            if(lightModeBtn) lightModeBtn.classList.add('active');
            if(darkModeBtn) darkModeBtn.classList.remove('active');
        }
        localStorage.setItem('theme', theme);
    };

    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // Event listeners for theme buttons
    if (lightModeBtn) {
        lightModeBtn.addEventListener('click', () => {
            applyTheme('light');
        });
    }

    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            applyTheme('dark');
        });
    }

    // --- Mobile Navigation ---
    const initMobileNav = () => {
        const navToggle = document.querySelector('.mobile-nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (navToggle && navLinks) {
            // Prevent adding multiple listeners
            if (navToggle.dataset.navInitialized) return;
            navToggle.dataset.navInitialized = 'true';

            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                navLinks.classList.toggle('active');
            });

            // Close mobile menu when clicking on links
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (navLinks.classList.contains('active')) {
                        navToggle.setAttribute('aria-expanded', 'false');
                        navLinks.classList.remove('active');
                    }
                });
            });
        }
    };

    // Re-initialize mobile nav when header is ready
    document.addEventListener('globalHeaderReady', initMobileNav);
    
    // Also run on initial load in case header is not dynamic
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNav);
    } else {
        initMobileNav();
    }

    // --- Progress Tracking (Common functionality) ---
    function getChapterProgress(section = 'general') {
        const progress = {};
        const keys = Object.keys(localStorage).filter(key => key.startsWith(`${section}-chapter-`) && key.endsWith('-progress'));
        keys.forEach(key => {
            const chapterNum = key.match(/-chapter-(\d+)-/)?.[1];
            if (chapterNum) {
                progress[chapterNum] = parseInt(localStorage.getItem(key), 10) || 0;
            }
        });
        return progress;
    }

    function updateProgressDisplay() {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const chapter = bar.dataset.chapter;
            const section = bar.dataset.section || 'general';
            const progress = localStorage.getItem(`${section}-chapter-${chapter}-progress`) || 0;
            bar.style.width = `${progress}%`;
        });

        // Update statistics
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const type = stat.dataset.type;
            const section = stat.dataset.section || 'general';
            
            if (type === 'completed') {
                const completed = Object.values(getChapterProgress(section)).filter(p => p === 100).length;
                stat.textContent = completed;
            } else if (type === 'in-progress') {
                const inProgress = Object.values(getChapterProgress(section)).filter(p => p > 0 && p < 100).length;
                stat.textContent = inProgress;
            } else if (type === 'total') {
                const total = Object.keys(getChapterProgress(section)).length;
                stat.textContent = total || document.querySelectorAll('.chapter-card').length;
            }
        });
    }

    // Initialize progress display
    updateProgressDisplay();
    
    // Enhanced progress tracking with auth integration
    if (typeof authManager !== 'undefined' && authManager.getCurrentUser()) {
        // Update progress bars with cloud data
        authManager.loadUserProgress().then(() => {
            updateProgressDisplay();
        });
    }

    // --- Scroll Reveal Animation ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // --- Back-to-top Button (auto-inject if not present) ---
    let backToTop = document.querySelector('.back-to-top');
    if (!backToTop) {
        backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.title = 'Back to top';
        backToTop.innerHTML = '↑';
        document.body.appendChild(backToTop);
    }

    const toggleBackToTop = () => {
        if (window.scrollY > 300) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
    };
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// Initialize immediately if DOM is ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', __initGlobal);
} else {
    __initGlobal();
}

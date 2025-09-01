document.addEventListener('DOMContentLoaded', function() {
    // --- Theme Toggle Functionality ---
    const lightModeBtn = document.getElementById('light-mode-btn') || document.getElementById('light-mode') || document.getElementById('light-theme');
    const darkModeBtn = document.getElementById('dark-mode-btn') || document.getElementById('dark-mode') || document.getElementById('dark-theme');
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
    if(lightModeBtn) {
        lightModeBtn.addEventListener('click', () => {
            applyTheme('light');
        });
    }

    if(darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            applyTheme('dark');
        });
    }

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
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
});

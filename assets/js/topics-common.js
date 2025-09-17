// topics-common.js - Consolidated JavaScript for all physics topic pages

document.addEventListener('DOMContentLoaded', function() {
    // Theme Management - Unified approach
    const lightModeBtn = document.getElementById('light-mode');
    const darkModeBtn = document.getElementById('dark-mode');
    const themeTarget = document.documentElement; // Use documentElement for consistency

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply initial theme
    if (currentTheme === 'dark') {
        themeTarget.setAttribute('data-theme', 'dark');
        if(lightModeBtn) lightModeBtn.classList.remove('active');
        if(darkModeBtn) darkModeBtn.classList.add('active');
    } else {
        // Ensure light theme is properly applied
        themeTarget.removeAttribute('data-theme');
        if(lightModeBtn) lightModeBtn.classList.add('active');
        if(darkModeBtn) darkModeBtn.classList.remove('active');
    }

    // Light mode button handler
    if(lightModeBtn) {
        lightModeBtn.addEventListener('click', () => {
            themeTarget.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            lightModeBtn.classList.add('active');
            if(darkModeBtn) darkModeBtn.classList.remove('active');
        });
    }

    // Dark mode button handler
    if(darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            themeTarget.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            if(lightModeBtn) lightModeBtn.classList.remove('active');
            darkModeBtn.classList.add('active');
        });
    }

    // Chapter Progress Management
    function getChapterProgress() {
        const progress = {
            '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0
        };
        for (let chapter in progress) {
            const savedProgress = localStorage.getItem(`chapter-${chapter}-progress`);
            if (savedProgress !== null) {
                progress[chapter] = parseInt(savedProgress, 10);
            }
        }
        return progress;
    }

    // Update progress displays
    function updateProgress() {
        const chapterProgress = getChapterProgress();
        const completed = Object.values(chapterProgress).filter(p => p === 100).length;
        
        // Update completed chapters counter
        const completedChaptersElement = document.getElementById('completed-chapters');
        if (completedChaptersElement) {
            completedChaptersElement.textContent = completed;
        }
        
        // Update progress bars
        Object.keys(chapterProgress).forEach(chapter => {
            const progressBar = document.querySelector(`[data-chapter="${chapter}"] .progress-bar`);
            if (progressBar) {
                progressBar.style.width = `${chapterProgress[chapter]}%`;
            }
        });
    }

    // Initialize progress tracking on page load
    updateProgress();

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll Reveal Animation
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

    // Observe elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Back-to-Top Button Management
    let backToTop = document.querySelector('.back-to-top');
    if (!backToTop) {
        // Create back-to-top button if it doesn't exist
        backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.title = 'Back to top';
        backToTop.textContent = '↑';
        document.body.appendChild(backToTop);
    }

    // Toggle back-to-top button visibility
    const toggleBackToTop = () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };

    // Initialize and add scroll listener
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    
    // Handle back-to-top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Utility Functions for Global Use
    window.topicsCommon = {
        // Expose progress functions for use by other scripts
        getChapterProgress: getChapterProgress,
        updateProgress: updateProgress,
        
        // Theme management
        setTheme: function(theme) {
            if (theme === 'dark') {
                themeTarget.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                themeTarget.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            }
        },
        
        getCurrentTheme: function() {
            return localStorage.getItem('theme') || 'light';
        }
    };
});
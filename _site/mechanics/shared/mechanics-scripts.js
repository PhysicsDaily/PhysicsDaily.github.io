// mechanics/shared/mechanics-scripts.js

document.addEventListener('DOMContentLoaded', function() {
    const lightModeBtn = document.getElementById('light-mode');
    const darkModeBtn = document.getElementById('dark-mode');
    const docElement = document.documentElement;

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        docElement.setAttribute('data-theme', 'dark');
        if(lightModeBtn) lightModeBtn.classList.remove('active');
        if(darkModeBtn) darkModeBtn.classList.add('active');
    }

    if(lightModeBtn) {
        lightModeBtn.addEventListener('click', () => {
            docElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            lightModeBtn.classList.add('active');
            if(darkModeBtn) darkModeBtn.classList.remove('active');
        });
    }

    if(darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            docElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            if(lightModeBtn) lightModeBtn.classList.remove('active');
            darkModeBtn.classList.add('active');
        });
    }

    // Function to get progress from localStorage
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

    // Progress tracking
    function updateProgress() {
        const chapterProgress = getChapterProgress();
        const completed = Object.values(chapterProgress).filter(p => p === 100).length;
        
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

    // Initialize progress on page load
    updateProgress();

    // Smooth scrolling for anchor links
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

    // Scroll reveal animation
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

    // Back-to-top (shared)
    let backToTop = document.querySelector('.back-to-top');
    if (!backToTop) {
        backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.title = 'Back to top';
        backToTop.textContent = '↑';
        document.body.appendChild(backToTop);
    }
    const toggleBackToTop = () => {
        if (window.scrollY > 300) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
    };
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

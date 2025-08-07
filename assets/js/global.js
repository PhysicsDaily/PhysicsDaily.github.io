document.addEventListener('DOMContentLoaded', function() {
    // --- Theme Toggle Functionality ---
    const lightModeBtn = document.getElementById('light-mode');
    const darkModeBtn = document.getElementById('dark-mode');
    const body = document.body;

    // Function to apply the theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            if(lightModeBtn) lightModeBtn.classList.remove('active');
            if(darkModeBtn) darkModeBtn.classList.add('active');
        } else {
            body.removeAttribute('data-theme');
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

    // --- Smooth Scrolling for Anchor Links ---
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

    // --- Progress Tracking ---
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
});

// Dark mode functionality
document.addEventListener('DOMContentLoaded', function() {
    const lightModeBtn = document.getElementById('light-mode');
    const darkModeBtn = document.getElementById('dark-mode');
    const body = document.body;

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        lightModeBtn.classList.remove('active');
        darkModeBtn.classList.add('active');
    }

    lightModeBtn.addEventListener('click', () => {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        lightModeBtn.classList.add('active');
        darkModeBtn.classList.remove('active');
    });

    darkModeBtn.addEventListener('click', () => {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        lightModeBtn.classList.remove('active');
        darkModeBtn.classList.add('active');
    });

    // Progress tracking
    function updateProgress() {
        const completed = getCompletedChapters();
        document.getElementById('completed-chapters').textContent = completed;
        
        // Update progress bars
        Object.keys(chapterProgress).forEach(chapter => {
            const progressBar = document.querySelector(`[data-chapter="${chapter}"] .progress-bar`);
            if (progressBar) {
                progressBar.style.width = `${chapterProgress[chapter]}%`;
            }
        });
    }

    // Mock progress data - replace with actual tracking
    const chapterProgress = {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
        '6': 0,
        '7': 0
    };

    function getCompletedChapters() {
        return Object.values(chapterProgress).filter(progress => progress === 100).length;
    }

    // Initialize progress
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
});

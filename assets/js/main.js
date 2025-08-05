document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const lightThemeBtn = document.getElementById('light-theme') || document.getElementById('light-mode');
    const darkThemeBtn = document.getElementById('dark-theme') || document.getElementById('dark-mode');
    const docElement = document.documentElement;
    const body = document.body;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            docElement.setAttribute('data-theme', 'dark');
            if(darkThemeBtn) darkThemeBtn.classList.add('active');
            if(lightThemeBtn) lightThemeBtn.classList.remove('active');
        } else {
            docElement.removeAttribute('data-theme');
            if(lightThemeBtn) lightThemeBtn.classList.add('active');
            if(darkThemeBtn) darkThemeBtn.classList.remove('active');
        }
        localStorage.setItem('theme', theme);
    };

    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // Event listeners for theme buttons
    if(lightThemeBtn) {
        lightThemeBtn.addEventListener('click', () => {
            applyTheme('light');
        });
    }

    if(darkThemeBtn) {
        darkThemeBtn.addEventListener('click', () => {
            applyTheme('dark');
        });
    }

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

document.addEventListener('DOMContentLoaded', function() {
    // --- Theme Toggle Functionality ---
    const lightModeBtn = document.getElementById('light-mode-btn');
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const docElement = document.documentElement; // Use documentElement (<html>) for setting attribute

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
});

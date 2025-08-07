document.addEventListener('DOMContentLoaded', function() {
    const lightThemeBtn = document.getElementById('light-theme-btn');
    const darkThemeBtn = document.getElementById('dark-theme-btn');
    const docElement = document.documentElement;

    const applyTheme = (theme) => {
        docElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            darkThemeBtn.classList.add('active');
            lightThemeBtn.classList.remove('active');
        } else {
            lightThemeBtn.classList.add('active');
            darkThemeBtn.classList.remove('active');
        }
        localStorage.setItem('theme', theme);
    };

    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // Event listeners for theme buttons
    lightThemeBtn.addEventListener('click', () => {
        applyTheme('light');
    });

    darkThemeBtn.addEventListener('click', () => {
        applyTheme('dark');
    });
});

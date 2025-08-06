// Physics Daily - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const lightModeBtn = document.getElementById('light-mode');
    const darkModeBtn = document.getElementById('dark-mode');
    const body = document.body;

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        if(lightModeBtn) lightModeBtn.classList.remove('active');
        if(darkModeBtn) darkModeBtn.classList.add('active');
    }

    if(lightModeBtn) {
        lightModeBtn.addEventListener('click', () => {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            lightModeBtn.classList.add('active');
            if(darkModeBtn) darkModeBtn.classList.remove('active');
        });
    }

    if(darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            body.setAttribute('data-theme', 'dark');
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

    // Mobile menu toggle (if needed)
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu && mobileMenuBtn) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        }
    });

    // Search functionality (placeholder for future implementation)
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput && searchResults) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }
            
            searchTimeout = setTimeout(() => {
                // Implement search logic here
                performSearch(query);
            }, 300);
        });
    }

    function performSearch(query) {
        // Placeholder search function
        // This would be implemented to search through physics content
        console.log('Searching for:', query);
    }

    // Copy code functionality for code blocks
    document.querySelectorAll('.code-block').forEach(block => {
        const copyBtn = block.querySelector('.copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const code = block.querySelector('code');
                if (code) {
                    navigator.clipboard.writeText(code.textContent).then(() => {
                        copyBtn.textContent = 'Copied!';
                        setTimeout(() => {
                            copyBtn.textContent = 'Copy';
                        }, 2000);
                    });
                }
            });
        }
    });

    // Table of contents generation for long content pages
    function generateTableOfContents() {
        const toc = document.getElementById('table-of-contents');
        const headings = document.querySelectorAll('h2, h3, h4');
        
        if (toc && headings.length > 0) {
            const tocList = document.createElement('ul');
            tocList.className = 'toc-list';
            
            headings.forEach((heading, index) => {
                // Add ID to heading if it doesn't have one
                if (!heading.id) {
                    heading.id = `heading-${index}`;
                }
                
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = `#${heading.id}`;
                link.textContent = heading.textContent;
                link.className = `toc-${heading.tagName.toLowerCase()}`;
                
                listItem.appendChild(link);
                tocList.appendChild(listItem);
            });
            
            toc.appendChild(tocList);
        }
    }

    // Generate TOC if container exists
    generateTableOfContents();

    // Back to top button
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
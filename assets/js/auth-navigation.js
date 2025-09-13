/**
 * Authentication Navigation Handler
 * Updates navigation UI based on authentication state
 */

class AuthNavigationHandler {
    constructor() {
        this.initialized = false;
        this.defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdOb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM2NDc0OGIiLz4KPHBhdGggZD0iTTE2IDE2QzE4LjIwOTEgMTYgMjAgMTQuMjA5MSAyMCAxMkMyMCA5Ljc5MDg2IDE4LjIwOTEgOCAxNiA4QzEzLjc5MDkgOCAxMiA5Ljc5MDg2IDEyIDEyQzEyIDE0LjIwOTEgMTMuNzkwOSAxNiAxNiAxNloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik04IDI2QzggMjIuNjg2MyAxMS4xMzQgMjAgMTUgMjBIMTdDMjAuODY2IDIwIDI0IDIyLjY4NjMgMjQgMjZWMjhIOFYyNloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==';
        this.init();
    }

    async init() {
        if (this.initialized) return;
        
        // Wait for DOM to be ready
        const ready = () => this.setupNavigation();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', ready);
        } else {
            ready();
        }

        // Also wait for global header injection
        document.addEventListener('globalHeaderReady', () => this.setupNavigation());

        // Listen for auth state changes
        if (window.authManager) {
            window.authManager.on('authStateChanged', (user) => {
                this.updateNavigationUI(user);
            });
            
            // Check current auth state
            if (window.authManager.user) {
                this.updateNavigationUI(window.authManager.user);
            }
        }

        this.initialized = true;
    }

    setupNavigation() {
        // Get navigation elements
        this.signInBtn = document.getElementById('header-sign-in');
        this.userMenu = document.getElementById('header-user-menu');
        this.userAvatar = document.getElementById('header-user-avatar');
        this.userName = document.getElementById('header-user-name');
    this.dashboardLink = document.getElementById('header-dashboard-link'); // may not exist now
        this.profileTrigger = document.getElementById('header-profile-trigger');
        this.profileDropdown = document.getElementById('profile-dropdown');

        // Listen for profile updates (e.g., from settings page)
        document.addEventListener('userProfileUpdated', (e) => {
            const { nickname } = e.detail || {};
            if (nickname && this.userName) {
                this.userName.textContent = nickname;
            }
            const welcomeElement = document.getElementById('personalizedWelcome');
            if (welcomeElement && nickname) {
                const welcomeText = welcomeElement.querySelector('p');
                if (welcomeText) {
                    welcomeText.textContent = `Welcome back, ${nickname}! Continue your physics journey.`;
                }
                welcomeElement.style.display = 'block';
            }
        });

        // Attach dropdown handlers once
        if (this.profileTrigger && !this._dropdownBound) {
            this._dropdownBound = true;
            this.profileTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                const expanded = this.profileTrigger.getAttribute('aria-expanded') === 'true';
                this.toggleDropdown(!expanded);
            });

            // Click-away to close
            document.addEventListener('click', (e) => {
                if (!this.profileDropdown || !this.profileTrigger) return;
                const within = this.profileDropdown.contains(e.target) || this.profileTrigger.contains(e.target);
                if (!within) this.toggleDropdown(false);
            });

            // ESC to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.toggleDropdown(false);
            });

            // Wire sign out in dropdown
            const signOutBtn = document.getElementById('header-sign-out');
            if (signOutBtn) {
                signOutBtn.addEventListener('click', async () => {
                    this.toggleDropdown(false);
                    if (window.authUI && typeof window.authUI.signOut === 'function') {
                        await window.authUI.signOut();
                    } else if (window.authManager) {
                        await window.authManager.signOut();
                    }
                });
            }
        }
    }

    updateNavigationUI(user) {
        if (!this.signInBtn || !this.userMenu) {
            this.setupNavigation();
        }

        if (user) {
            // User is signed in
            if (this.signInBtn) {
                this.signInBtn.style.display = 'none';
            }
            
            if (this.userMenu) {
                this.userMenu.style.display = 'flex';
                
                // Update user avatar
                if (this.userAvatar) {
                    this.userAvatar.src = user.photoURL || this.defaultAvatar;
                    this.userAvatar.onerror = () => {
                        this.userAvatar.src = this.defaultAvatar;
                    };
                }
                
                // Update user name (prefer local nickname override)
                if (this.userName) {
                    let nickname = null;
                    try {
                        const raw = localStorage.getItem('pd:user:profile');
                        nickname = raw ? JSON.parse(raw).nickname : null;
                    } catch {}
                    this.userName.textContent = nickname || user.displayName || user.email?.split('@')[0] || 'User';
                }
            }

            // Show Dashboard link after account
            // Dashboard remains in profile dropdown; inline link optional
            if (this.dashboardLink) this.dashboardLink.style.display = 'inline';

            // Update personalized welcome message if it exists
            const welcomeElement = document.getElementById('personalizedWelcome');
            if (welcomeElement) {
                // Prefer nickname override if available
                let nickname = null;
                try {
                    const raw = localStorage.getItem('pd:user:profile');
                    nickname = raw ? JSON.parse(raw).nickname : null;
                } catch {}
                const welcomeText = welcomeElement.querySelector('p');
                if (welcomeText) {
                    welcomeText.textContent = `Welcome back, ${nickname || user.displayName || user.email?.split('@')[0]}! Continue your physics journey.`;
                }
                welcomeElement.style.display = 'block';
            }
        } else {
            // User is signed out
            if (this.signInBtn) {
                this.signInBtn.style.display = 'block';
            }
            
            if (this.userMenu) {
                this.userMenu.style.display = 'none';
            }

            if (this.dashboardLink) this.dashboardLink.style.display = 'none';

            // Hide personalized welcome
            const welcomeElement = document.getElementById('personalizedWelcome');
            if (welcomeElement) {
                welcomeElement.style.display = 'none';
            }
        }

        // Mark header as ready (remove pending) after first run
        const header = document.querySelector('.fixed-header');
        if (header && header.classList.contains('auth-pending')) {
            header.classList.remove('auth-pending');
        }
    }

    toggleDropdown(open) {
        if (!this.profileTrigger || !this.profileDropdown) return;
        this.profileTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        this.profileDropdown.classList.toggle('open', !!open);
        this.profileDropdown.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
}

// Initialize navigation handler
const authNavigationHandler = new AuthNavigationHandler();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthNavigationHandler;
}

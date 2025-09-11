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
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupNavigation());
        } else {
            this.setupNavigation();
        }

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
                
                // Update user name
                if (this.userName) {
                    this.userName.textContent = user.displayName || user.email?.split('@')[0] || 'User';
                }
            }

            // Update personalized welcome message if it exists
            const welcomeElement = document.getElementById('personalizedWelcome');
            if (welcomeElement) {
                const welcomeText = welcomeElement.querySelector('p');
                if (welcomeText) {
                    welcomeText.textContent = `Welcome back, ${user.displayName || user.email?.split('@')[0]}! Continue your physics journey.`;
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

            // Hide personalized welcome
            const welcomeElement = document.getElementById('personalizedWelcome');
            if (welcomeElement) {
                welcomeElement.style.display = 'none';
            }
        }
    }
}

// Initialize navigation handler
const authNavigationHandler = new AuthNavigationHandler();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthNavigationHandler;
}

// Authentication UI Component
// Handles all authentication UI interactions

class AuthUI {
    constructor() {
        this.modal = null;
        this.currentTab = 'signin';
        this.justSignedInInteractive = false;
        this.sawInitialAuth = false; // avoid toast on initial persisted session
        this.init();
    }

    init() {
        this.createModal();
        this.attachEventListeners();
        
        // Initialize auth manager
        window.authManager.init().then(() => {
            console.log('Auth manager initialized');
        });
    }

    createModal() {
        // Create modal HTML
        const modalHTML = `
            <div class="auth-modal" id="authModal">
                <div class="auth-container">
                    <button class="close-modal" onclick="authUI.closeModal()">×</button>
                    
                    <div class="auth-header">
                        <div class="auth-logo">🎓</div>
                        <h2 class="auth-title">Welcome to Physics Daily</h2>
                        <p class="auth-subtitle">Sign in to track your progress across all devices</p>
                    </div>
                    
                    <div class="auth-tabs">
                        <button class="auth-tab active" data-tab="signin">Sign In</button>
                        <button class="auth-tab" data-tab="signup">Sign Up</button>
                    </div>
                    
                    <!-- Sign In Form -->
                    <form class="auth-form active" id="signinForm">
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-input" id="signinEmail" required>
                            <span class="form-error" id="signinEmailError"></span>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Password</label>
                            <input type="password" class="form-input" id="signinPassword" required>
                            <span class="form-error" id="signinPasswordError"></span>
                        </div>
                        
                        <button type="submit" class="auth-button">Sign In</button>
                        
                        <div class="auth-divider">
                            <span>or continue with</span>
                        </div>
                        
                        <div class="social-auth">
                            <button type="button" class="social-button" onclick="authUI.signInWithGoogle()">
                                <svg class="social-icon" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Google
                            </button>
                        </div>
                        
                        <div class="auth-footer">
                            <a href="#" class="auth-link" onclick="authUI.showForgotPassword(); return false;">Forgot password?</a>
                        </div>
                    </form>
                    
                    <!-- Sign Up Form -->
                    <form class="auth-form" id="signupForm">
                        <div class="form-group">
                            <label class="form-label">Name</label>
                            <input type="text" class="form-input" id="signupName" required>
                            <span class="form-error" id="signupNameError"></span>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-input" id="signupEmail" required>
                            <span class="form-error" id="signupEmailError"></span>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Password</label>
                            <input type="password" class="form-input" id="signupPassword" required>
                            <span class="form-error" id="signupPasswordError"></span>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Confirm Password</label>
                            <input type="password" class="form-input" id="signupConfirmPassword" required>
                            <span class="form-error" id="signupConfirmPasswordError"></span>
                        </div>
                        
                        <button type="submit" class="auth-button">Create Account</button>
                        
                        <div class="auth-divider">
                            <span>or continue with</span>
                        </div>
                        
                        <div class="social-auth">
                            <button type="button" class="social-button" onclick="authUI.signInWithGoogle()">
                                <svg class="social-icon" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Google
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Add modal to body if it doesn't exist
        if (!document.getElementById('authModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        
        this.modal = document.getElementById('authModal');
    }

    attachEventListeners() {
        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Header sign-in button(s) binding (fallback for inline onclick)
        const headerSignInButtons = document.querySelectorAll('.sign-in-btn');
        if (headerSignInButtons && headerSignInButtons.length) {
            console.debug('[AuthUI] Binding click handler to', headerSignInButtons.length, 'sign-in button(s)');
            headerSignInButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Prevent default anchor/button behaviors if any
                    if (e) e.preventDefault();
                    this.openModal();
                });
            });
        }

        // Sign in form
        const signinForm = document.getElementById('signinForm');
        if (signinForm) {
            signinForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignIn();
            });
        }

        // Sign up form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignUp();
            });
        }

        // Auth state changes
        authManager.on('authStateChanged', (user) => {
            // First emission is usually persisted session restore — suppress toast
            if (!this.sawInitialAuth) {
                this.sawInitialAuth = true;
                return;
            }
            // Show toast only for interactive sign-ins
            if (user && this.justSignedInInteractive) {
                this.closeModal();
                this.showSuccessNotification('Successfully signed in!');
                this.justSignedInInteractive = false;
            }
        });
    }

    switchTab(tabName) {
        // Update tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.toggle('active', 
                (tabName === 'signin' && form.id === 'signinForm') ||
                (tabName === 'signup' && form.id === 'signupForm')
            );
        });

        this.currentTab = tabName;
        this.clearErrors();
    }

    async handleSignIn() {
        this.clearErrors();
        
        const email = document.getElementById('signinEmail').value;
        const password = document.getElementById('signinPassword').value;
        
        if (!this.validateEmail(email)) {
            this.showError('signinEmail', 'Please enter a valid email');
            return;
        }
        
        if (password.length < 6) {
            this.showError('signinPassword', 'Password must be at least 6 characters');
            return;
        }
        
        this.setLoading(true);
        
        const result = await authManager.signIn(email, password);
        
        this.setLoading(false);
        
        if (!result.success) {
            this.showError('signinPassword', result.error);
        } else {
            this.justSignedInInteractive = true;
        }
    }

    async handleSignUp() {
        this.clearErrors();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        // Validation
        if (name.length < 2) {
            this.showError('signupName', 'Name must be at least 2 characters');
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showError('signupEmail', 'Please enter a valid email');
            return;
        }
        
        if (password.length < 6) {
            this.showError('signupPassword', 'Password must be at least 6 characters');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showError('signupConfirmPassword', 'Passwords do not match');
            return;
        }
        
        this.setLoading(true);
        
        const result = await authManager.signUp(email, password, name);
        
        this.setLoading(false);
        
        if (!result.success) {
            this.showError('signupEmail', result.error);
        } else if (result.requiresOnboarding) {
            // Close auth modal and show onboarding
            this.closeModal();
            if (window.onboardingUI) {
                window.onboardingUI.showOnboarding(result.pendingData);
            }
        } else {
            this.showSuccessNotification('Account created! Please check your email for verification.');
        }
    }

    async signInWithGoogle() {
        this.setLoading(true);
        
        const result = await authManager.signInWithGoogle();
        
        this.setLoading(false);
        
        if (!result.success) {
            this.showError('signinEmail', result.error);
        } else if (result.requiresOnboarding) {
            // Close auth modal and show onboarding
            this.closeModal();
            if (window.onboardingUI) {
                window.onboardingUI.showOnboarding(result.pendingData);
            }
        } else {
            this.justSignedInInteractive = true;
        }
    }

    async showForgotPassword() {
        const email = prompt('Enter your email address:');
        if (!email) return;
        
        if (!this.validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        const result = await authManager.resetPassword(email);
        
        if (result.success) {
            this.showSuccessNotification('Password reset email sent! Check your inbox.');
        } else {
            alert(result.error);
        }
    }

    openModal() {
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
            this.clearErrors();
        }
    }

    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (field) {
            field.classList.add('error');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('active');
        }
    }

    clearErrors() {
        document.querySelectorAll('.form-input').forEach(input => {
            input.classList.remove('error');
        });
        
        document.querySelectorAll('.form-error').forEach(error => {
            error.textContent = '';
            error.classList.remove('active');
        });
    }

    setLoading(loading) {
        const buttons = document.querySelectorAll('.auth-button');
        buttons.forEach(button => {
            button.disabled = loading;
            if (loading) {
                button.textContent = 'Loading...';
            } else {
                button.textContent = button.closest('#signinForm') ? 'Sign In' : 'Create Account';
            }
        });
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showSuccessNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10001;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    async signOut() {
        const result = await authManager.signOut();
        if (result.success) {
            this.showSuccessNotification('Signed out successfully');
            // Redirect to home if on dashboard
            if (window.location.pathname.includes('dashboard')) {
                window.location.href = '/';
            }
        }
    }
}

// Initialize auth UI
const authUI = new AuthUI();
window.authUI = authUI;  

// Add CSS animations and minimal fail-safe visibility rules
const style = document.createElement('style');
style.textContent = `
    /* Fail-safe: ensure auth modal is hidden unless explicitly opened */
    .auth-modal { display: none !important; }
    .auth-modal.active { display: flex !important; }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

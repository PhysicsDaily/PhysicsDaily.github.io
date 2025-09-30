// User Onboarding Component
// Handles collecting required user information (name and nationality) during signup

class OnboardingUI {
    constructor() {
        this.modal = null;
        this.pendingUserData = null;
        this.countries = [
            'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
            'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Bolivia', 'Bosnia and Herzegovina', 'Brazil', 'Bulgaria',
            'Cambodia', 'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica', 'Croatia', 'Czech Republic',
            'Denmark', 'Dominican Republic', 'Ecuador', 'Egypt', 'Estonia', 'Ethiopia',
            'Finland', 'France', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Guatemala',
            'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
            'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Lebanon', 'Lithuania', 'Luxembourg',
            'Malaysia', 'Mexico', 'Morocco', 'Nepal', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway',
            'Pakistan', 'Palestine', 'Peru', 'Philippines', 'Poland', 'Portugal',
            'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland',
            'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Venezuela', 'Vietnam'
        ];
        this.init();
    }

    init() {
        this.createModal();
    }

    createModal() {
        const modalHTML = `
            <div class="onboarding-modal" id="onboardingModal">
                <div class="onboarding-container">
                    <div class="onboarding-header">
                        <div class="onboarding-logo">🌍</div>
                        <h2 class="onboarding-title">Welcome to Physics Daily!</h2>
                        <p class="onboarding-subtitle">Tell us a bit about yourself to personalize your experience</p>
                    </div>
                    
                    <form class="onboarding-form" id="onboardingForm">
                        <div class="form-group">
                            <label class="form-label">Full Name *</label>
                            <input type="text" class="form-input" id="onboardingName" placeholder="Enter your full name" required>
                            <span class="form-error" id="onboardingNameError"></span>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Nationality *</label>
                            <select class="form-input form-select" id="onboardingNationality" required>
                                <option value="">Select your nationality</option>
                                ${this.countries.map(country => `<option value="${country}">${country}</option>`).join('')}
                            </select>
                            <span class="form-error" id="onboardingNationalityError"></span>
                        </div>
                        
                        <div class="onboarding-actions">
                            <button type="submit" class="onboarding-button">Complete Setup</button>
                        </div>
                        
                        <p class="onboarding-note">
                            * Required fields. We use this information to personalize your learning experience and provide relevant content.
                        </p>
                    </form>
                </div>
            </div>
        `;
        
        // Add modal to body if it doesn't exist
        if (!document.getElementById('onboardingModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        
        this.modal = document.getElementById('onboardingModal');
        this.attachEventListeners();
    }

    attachEventListeners() {
        const form = document.getElementById('onboardingForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleOnboardingSubmit();
            });
        }

        // Add search functionality to nationality dropdown
        const nationalitySelect = document.getElementById('onboardingNationality');
        if (nationalitySelect) {
            // Convert select to searchable dropdown
            this.makeSelectSearchable(nationalitySelect);
        }
    }

    makeSelectSearchable(selectElement) {
        // Create a wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'searchable-select-wrapper';
        wrapper.style.position = 'relative';
        
        // Create input field
        const input = document.createElement('input');
        input.type = 'text';
        input.className = selectElement.className;
        input.placeholder = 'Type to search countries...';
        input.autocomplete = 'off';
        
        // Create dropdown list
        const dropdown = document.createElement('div');
        dropdown.className = 'searchable-dropdown';
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-top: none;
            border-radius: 0 0 8px 8px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        `;
        
        // Replace select with wrapper
        selectElement.parentNode.replaceChild(wrapper, selectElement);
        wrapper.appendChild(input);
        wrapper.appendChild(dropdown);
        
        let selectedValue = '';
        
        // Populate dropdown
        const updateDropdown = (filter = '') => {
            dropdown.innerHTML = '';
            const filteredCountries = this.countries.filter(country => 
                country.toLowerCase().includes(filter.toLowerCase())
            );
            
            filteredCountries.forEach(country => {
                const option = document.createElement('div');
                option.className = 'searchable-option';
                option.textContent = country;
                option.style.cssText = `
                    padding: 0.5rem;
                    cursor: pointer;
                    border-bottom: 1px solid var(--border-color);
                `;
                option.addEventListener('click', () => {
                    input.value = country;
                    selectedValue = country;
                    dropdown.style.display = 'none';
                    input.blur();
                });
                dropdown.appendChild(option);
            });
        };
        
        // Event listeners
        input.addEventListener('focus', () => {
            updateDropdown(input.value);
            dropdown.style.display = 'block';
        });
        
        input.addEventListener('input', (e) => {
            updateDropdown(e.target.value);
            dropdown.style.display = 'block';
        });
        
        input.addEventListener('blur', () => {
            setTimeout(() => {
                dropdown.style.display = 'none';
            }, 200);
        });
        
        // Store reference to get value
        wrapper.getValue = () => selectedValue;
        this.nationalityInput = wrapper;
    }

    async handleOnboardingSubmit() {
        this.clearErrors();
        
        const name = document.getElementById('onboardingName').value.trim();
        const nationality = this.nationalityInput ? this.nationalityInput.getValue() : '';
        
        // Validation
        if (name.length < 2) {
            this.showError('onboardingName', 'Please enter your full name (at least 2 characters)');
            return;
        }
        
        if (!nationality) {
            this.showError('onboardingNationality', 'Please select your nationality');
            return;
        }
        
        this.setLoading(true);
        
        try {
            // Update the pending user data with onboarding info
            const onboardingData = {
                displayName: name,
                country: nationality,
                onboardingCompleted: true,
                onboardingCompletedAt: new Date().toISOString()
            };
            
            // Complete the account creation
            const result = await this.completeAccountCreation(onboardingData);
            
            if (result.success) {
                this.closeModal();
                this.showSuccessNotification('Welcome to Physics Daily! Your account has been created successfully.');
                
                // Trigger auth state change
                if (window.authUI) {
                    window.authUI.justSignedInInteractive = true;
                }
            } else {
                this.showError('onboardingName', result.error || 'Failed to complete setup. Please try again.');
            }
        } catch (error) {
            console.error('Onboarding error:', error);
            this.showError('onboardingName', 'An error occurred. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    async completeAccountCreation(onboardingData) {
        if (!this.pendingUserData) {
            return { success: false, error: 'No pending user data found' };
        }
        
        const { email, password, tempDisplayName, isGoogleSignup } = this.pendingUserData;
        
        try {
            let result;
            
            if (isGoogleSignup) {
                // For Google signup, the user is already created, just update profile
                const user = window.authManager.getCurrentUser();
                if (user) {
                    await user.updateProfile({ 
                        displayName: onboardingData.displayName 
                    });
                    
                    // Update user document with onboarding data
                    await window.authManager.updateUserDocument(user.uid, onboardingData);
                    result = { success: true, user };
                } else {
                    result = { success: false, error: 'User not found' };
                }
            } else {
                // For email signup, create the account with onboarding data
                result = await window.authManager.signUpWithOnboarding(
                    email, 
                    password, 
                    onboardingData
                );
            }
            
            return result;
        } catch (error) {
            console.error('Error completing account creation:', error);
            return { success: false, error: error.message };
        }
    }

    // Show onboarding for new signups
    showOnboarding(userData) {
        this.pendingUserData = userData;
        this.openModal();
        
        // Pre-fill name if available
        if (userData.tempDisplayName) {
            const nameInput = document.getElementById('onboardingName');
            if (nameInput) {
                nameInput.value = userData.tempDisplayName;
            }
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
        document.querySelectorAll('.onboarding-form .form-input').forEach(input => {
            input.classList.remove('error');
        });
        
        document.querySelectorAll('.onboarding-form .form-error').forEach(error => {
            error.textContent = '';
            error.classList.remove('active');
        });
    }

    setLoading(loading) {
        const button = document.querySelector('.onboarding-button');
        if (button) {
            button.disabled = loading;
            button.textContent = loading ? 'Setting up...' : 'Complete Setup';
        }
        
        // Disable form inputs
        document.querySelectorAll('.onboarding-form .form-input').forEach(input => {
            input.disabled = loading;
        });
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
        }, 4000);
    }
}

// Initialize onboarding UI
const onboardingUI = new OnboardingUI();
window.onboardingUI = onboardingUI;

// Add onboarding styles
const onboardingStyles = document.createElement('style');
onboardingStyles.textContent = `
    .onboarding-modal {
        display: none !important;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        justify-content: center;
        align-items: center;
        padding: 1rem;
    }
    
    .onboarding-modal.active {
        display: flex !important;
    }
    
    .onboarding-container {
        background: var(--card-bg);
        border-radius: 16px;
        padding: 2rem;
        width: 100%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    
    .onboarding-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .onboarding-logo {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .onboarding-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }
    
    .onboarding-subtitle {
        color: var(--text-secondary);
        font-size: 1rem;
    }
    
    .onboarding-form .form-group {
        margin-bottom: 1.5rem;
    }
    
    .onboarding-form .form-label {
        display: block;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }
    
    .onboarding-form .form-input {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        font-size: 1rem;
        background: var(--bg-primary);
        color: var(--text-primary);
        transition: border-color 0.2s ease;
    }
    
    .onboarding-form .form-input:focus {
        outline: none;
        border-color: var(--primary-color);
    }
    
    .onboarding-form .form-input.error {
        border-color: #ef4444;
    }
    
    .onboarding-form .form-select {
        cursor: pointer;
    }
    
    .onboarding-form .form-error {
        display: block;
        color: #ef4444;
        font-size: 0.85rem;
        margin-top: 0.25rem;
        opacity: 0;
        transition: opacity 0.2s ease;
    }
    
    .onboarding-form .form-error.active {
        opacity: 1;
    }
    
    .onboarding-actions {
        margin-top: 2rem;
    }
    
    .onboarding-button {
        width: 100%;
        padding: 0.875rem 1rem;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    
    .onboarding-button:hover:not(:disabled) {
        background: var(--primary-dark);
    }
    
    .onboarding-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .onboarding-note {
        margin-top: 1rem;
        font-size: 0.85rem;
        color: var(--text-secondary);
        text-align: center;
        line-height: 1.4;
    }
    
    .searchable-dropdown .searchable-option:hover {
        background: var(--bg-tertiary);
    }
    
    .searchable-dropdown .searchable-option:last-child {
        border-bottom: none;
    }
    
    @media (max-width: 480px) {
        .onboarding-container {
            padding: 1.5rem;
            margin: 0.5rem;
        }
        
        .onboarding-title {
            font-size: 1.5rem;
        }
    }
`;
document.head.appendChild(onboardingStyles);
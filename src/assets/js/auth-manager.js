// Authentication Manager for Physics Daily
// Handles user authentication, session management, and data sync

class AuthManager {
    constructor() {
        this.user = null;
        this.db = null;
        this.auth = null;
        this.isInitialized = false;
        this.listeners = new Map();
        this.syncInterval = null;
        this.initialAuthResolved = false;
        // Admin features disabled
        this.adminEmails = [];
    }

    // Initialize Firebase
    async init() {
        if (this.isInitialized) return;
        
        try {
            // Check if Firebase is loaded
            if (typeof firebase === 'undefined') {
                console.error('Firebase SDK not loaded');
                return false;
            }

            // Initialize Firebase app
            if (!firebase.apps.length) {
                firebase.initializeApp(window.firebaseConfig);
            }

            this.auth = firebase.auth();
            this.db = firebase.firestore();

            // Make auth state persist across tabs and reloads
            try {
                await this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            } catch (e) {
                console.warn('[Auth] Failed to set persistence to LOCAL, using default:', e?.message || e);
            }

            // Helpful guidance for common OAuth domain issues during local testing
            const host = window.location.hostname;
            const likelyNeedsAllowlisting = host !== 'localhost' && host !== '127.0.0.1' && host !== '[::1]';
            console.info('[Auth] Running on host:', host, '— ensure this host is in Firebase Auth > Settings > Authorized domains.');
            if (likelyNeedsAllowlisting) {
                console.info('[Auth] If you are testing on a custom host (e.g., physicsdaily.github.io or a LAN IP), add it to the authorized domains list.');
            }
            
            // Enable offline persistence (best effort)
            try {
                await this.db.enablePersistence();
            } catch (err) {
                const msg = (err && err.message) || '';
                const code = err && err.code;
                if (code === 'failed-precondition' || code === 'unimplemented' || /already been started/i.test(msg)) {
                    console.warn('[Auth] Firestore persistence not enabled:', code || msg);
                } else {
                    console.warn('[Auth] Unexpected persistence error (continuing):', code || msg);
                }
            }

            // Set up auth state listener
            this.auth.onAuthStateChanged(async (user) => {
                this.user = user;
                if (user) {
                    await this.onUserSignIn(user);
                } else {
                    this.onUserSignOut();
                }
                this.emit('authStateChanged', user);
                if (!this.initialAuthResolved) {
                    this.initialAuthResolved = true;
                    document.body.classList.remove('auth-pending');
                    document.body.classList.add('auth-ready');
                }
            });

            this.isInitialized = true;
            return true;
        } catch (error) {
            const msg = String(error?.message || '');
            if (/persistence can no longer be enabled/i.test(msg)) {
                // Continue without persistence if this was the only problem
                console.warn('[Auth] Continuing without persistence due to startup ordering.');
                this.isInitialized = true;
                return true;
            }
            console.error('Failed to initialize Firebase:', error);
            return false;
        }
    }

    // Sign up new user (now requires onboarding)
    async signUp(email, password, displayName) {
        // Return pending state to trigger onboarding
        return { 
            success: true, 
            requiresOnboarding: true,
            pendingData: { email, password, tempDisplayName: displayName }
        };
    }

    // Complete signup with onboarding data
    async signUpWithOnboarding(email, password, onboardingData) {
        try {
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Update display name
            await user.updateProfile({ displayName: onboardingData.displayName });
            
            // Create user document in Firestore with onboarding data
            await this.createUserDocumentWithOnboarding(user, onboardingData);
            
            // Send verification email
            await user.sendEmailVerification();
            
            return { success: true, user };
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Sign in existing user
    async signIn(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Sign in with Google (now requires onboarding for new users)
    async signInWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const userCredential = await this.auth.signInWithPopup(provider);
            const user = userCredential.user;
            
            // Check if this is a new user
            if (userCredential.additionalUserInfo.isNewUser) {
                // New user needs onboarding
                return { 
                    success: true, 
                    requiresOnboarding: true,
                    pendingData: { 
                        tempDisplayName: user.displayName,
                        isGoogleSignup: true
                    }
                };
            } else {
                // Existing user, check if they have completed onboarding
                const userDoc = await this.db.collection('users').doc(user.uid).get();
                if (userDoc.exists && !userDoc.data().onboardingCompleted) {
                    // Existing user without onboarding
                    return { 
                        success: true, 
                        requiresOnboarding: true,
                        pendingData: { 
                            tempDisplayName: user.displayName,
                            isGoogleSignup: true
                        }
                    };
                }
            }
            
            return { success: true, user };
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Sign out
    async signOut() {
        try {
            await this.auth.signOut();
            return { success: true };
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Reset password
    async resetPassword(email) {
        try {
            await this.auth.sendPasswordResetEmail(email);
            return { success: true };
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Create user document in Firestore with onboarding data
    async createUserDocumentWithOnboarding(user, onboardingData) {
        const userRef = this.db.collection('users').doc(user.uid);
        
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: onboardingData.displayName,
            nationality: onboardingData.nationality,
            ageGroup: onboardingData.ageGroup,
            education: onboardingData.education,
            onboardingCompleted: true,
            onboardingCompletedAt: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL: user.photoURL || null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            xp: {
                total: 0,
                lastAwardAt: null
            },
            streak: {
                current: 0,
                longest: 0,
                lastActivityDate: null
            },
            stats: {
                totalQuizzes: 0,
                correctAnswers: 0,
                totalTime: 0,
                chaptersCompleted: 0,
                topicsStudied: []
            },
            preferences: {
                theme: localStorage.getItem('theme') || 'light',
                emailNotifications: true,
                dailyReminders: false
            }
        };
        
        await userRef.set(userData);
        
        // Clear any existing XP in localStorage to start fresh
        try {
            localStorage.removeItem('pd:gamification');
            localStorage.removeItem('pd:xp:enhanced');
            localStorage.removeItem('pd:xp:topicProgress');
        } catch {}
        
        // Migrate local progress to cloud (but not XP)
        await this.migrateLocalProgress();
    }

    // Update existing user document with onboarding data
    async updateUserDocument(uid, onboardingData) {
        const userRef = this.db.collection('users').doc(uid);
        
        const updateData = {
            displayName: onboardingData.displayName,
            nationality: onboardingData.nationality,
            ageGroup: onboardingData.ageGroup,
            education: onboardingData.education,
            onboardingCompleted: true,
            onboardingCompletedAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await userRef.update(updateData);
    }

    // Create user document in Firestore
    async createUserDocument(user) {
        const userRef = this.db.collection('users').doc(user.uid);
        const doc = await userRef.get();
        
        if (!doc.exists) {
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email.split('@')[0],
                photoURL: user.photoURL || null,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                xp: {
                    total: 0,
                    lastAwardAt: null
                },
                streak: {
                    current: 0,
                    longest: 0,
                    lastActivityDate: null
                },
                stats: {
                    totalQuizzes: 0,
                    correctAnswers: 0,
                    totalTime: 0,
                    chaptersCompleted: 0,
                    topicsStudied: []
                },
                preferences: {
                    theme: localStorage.getItem('theme') || 'light',
                    emailNotifications: true,
                    dailyReminders: false
                }
            };
            
            await userRef.set(userData);
            
            // Clear any existing XP in localStorage to start fresh
            try {
                localStorage.removeItem('pd:gamification');
                localStorage.removeItem('pd:xp:enhanced');
                localStorage.removeItem('pd:xp:topicProgress');
            } catch {}
            
            // Migrate local progress to cloud (but not XP)
            await this.migrateLocalProgress();
        } else {
            // Update last login
            await userRef.update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    }

    // Handle user sign in
    async onUserSignIn(user) {
        console.log('User signed in:', user.email);
        
        // Start syncing data
        this.startDataSync();
        
        // Update UI
        this.updateUIForSignedInUser(user);
        
        // Check and update streak
        await this.checkAndUpdateStreak();
        
        // Load user progress from cloud
        await this.loadUserProgress();
    }

    // Handle user sign out
    onUserSignOut() {
        console.log('User signed out');
        
        // Stop syncing data
        this.stopDataSync();
        
        // Update UI
        this.updateUIForSignedOutUser();
    }

    // Start periodic data sync
    startDataSync() {
        if (this.syncInterval) return;
        
        // Sync every 30 seconds
        this.syncInterval = setInterval(() => {
            this.syncUserData();
        }, 30000);
        
        // Also sync on visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.syncUserData();
            }
        });
    }

    // Stop data sync
    stopDataSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    // Sync user data to cloud
    async syncUserData() {
        if (!this.user) return;
        
        try {
            const userRef = this.db.collection('users').doc(this.user.uid);
            const progressRef = userRef.collection('progress');
            
            // Get all local progress data
            const localProgress = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.includes('chapter') || key.includes('quiz') || key.includes('progress')) {
                    localProgress[key] = localStorage.getItem(key);
                }
            }
            
            // Save to Firestore
            if (Object.keys(localProgress).length > 0) {
                await progressRef.doc('data').set({
                    progress: localProgress,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            }
        } catch (error) {
            console.error('Failed to sync data:', error);
        }
    }

    // Load user progress from cloud
    async loadUserProgress() {
        if (!this.user) return;
        
        try {
            const userRef = this.db.collection('users').doc(this.user.uid);
            const progressDoc = await userRef.collection('progress').doc('data').get();
            
            if (progressDoc.exists) {
                const data = progressDoc.data();
                const cloudProgress = data.progress || {};
                
                // Merge cloud progress with local progress
                Object.keys(cloudProgress).forEach(key => {
                    const localValue = localStorage.getItem(key);
                    const cloudValue = cloudProgress[key];
                    
                    // Use the most recent value
                    if (!localValue || cloudValue > localValue) {
                        localStorage.setItem(key, cloudValue);
                    }
                });
                
                // Update UI
                if (typeof updateProgressDisplay === 'function') {
                    updateProgressDisplay();
                }
            }
        } catch (error) {
            console.error('Failed to load progress:', error);
        }
    }

    // Migrate local progress to cloud
    async migrateLocalProgress() {
        if (!this.user) return;
        
        const localProgress = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.includes('chapter') || key.includes('quiz') || key.includes('progress')) {
                localProgress[key] = localStorage.getItem(key);
            }
        }
        
        if (Object.keys(localProgress).length > 0) {
            const userRef = this.db.collection('users').doc(this.user.uid);
            await userRef.collection('progress').doc('data').set({
                progress: localProgress,
                migratedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }
    }

    // Check and update streak
    async checkAndUpdateStreak() {
        if (!this.user) return;
        
        try {
            const userRef = this.db.collection('users').doc(this.user.uid);
            const userDoc = await userRef.get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                const streak = userData.streak || { current: 0, longest: 0, lastActivityDate: null };
                
                const today = new Date().toDateString();
                const lastActivity = streak.lastActivityDate ? new Date(streak.lastActivityDate.toDate()).toDateString() : null;
                
                if (lastActivity !== today) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    
                    if (lastActivity === yesterday.toDateString()) {
                        // Continue streak
                        streak.current++;
                        if (streak.current > streak.longest) {
                            streak.longest = streak.current;
                        }
                    } else {
                        // Reset streak
                        streak.current = 1;
                    }
                    
                    streak.lastActivityDate = firebase.firestore.Timestamp.now();
                    
                    await userRef.update({ streak });
                }
                
                return streak;
            }
        } catch (error) {
            console.error('Failed to update streak:', error);
        }
    }

    // Save quiz result
    async saveQuizResult(quizData) {
        if (!this.user) return;
        
        try {
            const userRef = this.db.collection('users').doc(this.user.uid);
            
            // Save quiz result
            await userRef.collection('quizzes').add({
                ...quizData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Update user stats
            await userRef.update({
                'stats.totalQuizzes': firebase.firestore.FieldValue.increment(1),
                'stats.correctAnswers': firebase.firestore.FieldValue.increment(quizData.correctAnswers || 0),
                'stats.totalTime': firebase.firestore.FieldValue.increment(quizData.timeSpent || 0)
            });
            
            // Update streak
            await this.checkAndUpdateStreak();
            
        } catch (error) {
            console.error('Failed to save quiz result:', error);
        }
    }

    // Get user statistics
    async getUserStats() {
        if (!this.user) return null;
        
        try {
            const userRef = this.db.collection('users').doc(this.user.uid);
            const userDoc = await userRef.get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                
                // Get quiz history
                const quizzesSnapshot = await userRef.collection('quizzes')
                    .orderBy('timestamp', 'desc')
                    .limit(50)
                    .get();
                
                const quizHistory = [];
                quizzesSnapshot.forEach(doc => {
                    quizHistory.push({ id: doc.id, ...doc.data() });
                });
                
                return {
                    ...userData.stats,
                    xp: userData.xp || { total: 0 },
                    streak: userData.streak,
                    quizHistory,
                    memberSince: userData.createdAt
                };
            }
        } catch (error) {
            console.error('Failed to get user stats:', error);
            return null;
        }
    }

    // Update UI for signed in user
    updateUIForSignedInUser(user) {
        // Show user info in header
        const userInfo = document.querySelector('.user-info');
        if (userInfo) {
            userInfo.innerHTML = `
                <div class="user-avatar">
                    ${user.photoURL ? 
                        `<img src="${user.photoURL}" alt="${user.displayName}">` : 
                        `<span>${user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}</span>`
                    }
                </div>
                <span class="user-name">${user.displayName || user.email}</span>
            `;
            userInfo.style.display = 'flex';
        }
        
        // Hide sign in button, show sign out
        const signInBtn = document.querySelector('.sign-in-btn');
        const signOutBtn = document.querySelector('.sign-out-btn');
        const dashboardBtn = document.querySelector('.dashboard-btn');
        
        if (signInBtn) signInBtn.style.display = 'none';
        if (signOutBtn) signOutBtn.style.display = 'block';
        if (dashboardBtn) dashboardBtn.style.display = 'block';
    }

    // Update UI for signed out user
    updateUIForSignedOutUser() {
        const userInfo = document.querySelector('.user-info');
        if (userInfo) {
            userInfo.style.display = 'none';
        }
        
        const signInBtn = document.querySelector('.sign-in-btn');
        const signOutBtn = document.querySelector('.sign-out-btn');
        const dashboardBtn = document.querySelector('.dashboard-btn');
        
        if (signInBtn) signInBtn.style.display = 'block';
        if (signOutBtn) signOutBtn.style.display = 'none';
        if (dashboardBtn) dashboardBtn.style.display = 'none';
    }

    // Event emitter methods
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }

    // Get error message
    getErrorMessage(error) {
        const errorMessages = {
            'auth/email-already-in-use': 'This email is already registered.',
            'auth/invalid-email': 'Invalid email address.',
            'auth/operation-not-allowed': 'Operation not allowed.',
            'auth/weak-password': 'Password should be at least 6 characters.',
            'auth/user-disabled': 'This account has been disabled.',
            'auth/user-not-found': 'No account found with this email.',
            'auth/wrong-password': 'Incorrect password.',
            'auth/popup-closed-by-user': 'Sign in was cancelled.',
            'auth/network-request-failed': 'Network error. Please check your connection.',
            'auth/unauthorized-domain': `This domain is not authorized for OAuth. Please add "${window.location.hostname}" to Firebase Console → Authentication → Settings → Authorized domains.`
        };
        
        return errorMessages[error.code] || error.message;
    }

    // Check if user is signed in
    isSignedIn() {
        return this.user !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }
    // Check if current user is admin
    isAdmin() {
        return false;
    }

    // Get admin status
    getAdminStatus() {
        return {
            isAdmin: false,
            email: this.user?.email || null
        };
    }
}

// Create global instance
window.authManager = new AuthManager();



// Firebase Configuration - Using free tier
// This configuration is for PhysicsDaily and is safe to expose
const firebaseConfig = {
    apiKey: "AIzaSyC4DpirZ_27JUmgAeFOR05TVbQQi5jg61o",
    authDomain: "physicsdaily23.firebaseapp.com",
    projectId: "physicsdaily23",
    storageBucket: "physicsdaily23.firebasestorage.app",
    messagingSenderId: "1048359981455",
    appId: "1:1048359981455:web:89641fcdb560a6f516bbfa",
    measurementId: "G-8WNW4324F7"
};

// Expose config globally for compat SDK initialization
window.firebaseConfig = firebaseConfig;

// Note: You'll need to create a Firebase project and replace these values
// Go to https://console.firebase.google.com to create a free project
// Then replace the config above with your actual Firebase config

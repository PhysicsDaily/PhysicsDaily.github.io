# Firebase Setup Instructions for Physics Daily

## Overview
This authentication system uses Firebase (completely free tier) to provide:
- User authentication (email/password and Google sign-in)
- Cross-device data synchronization
- Progress tracking and learning analytics
- Streak tracking
- Quiz results storage

## Setup Steps

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `physicsdaily-app` (or your preferred name)
4. Disable Google Analytics (optional, to keep it simple)
5. Click "Create project"

### 2. Enable Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Enable the following sign-in methods:
   - **Email/Password**: Click on it, toggle "Enable", then Save
   - **Google**: Click on it, toggle "Enable", add your app's public-facing name and support email, then Save

### 3. Create Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in production mode" (we'll add rules next)
4. Select your preferred location (choose closest to your users)
5. Click "Enable"

### 4. Set Firestore Security Rules

1. In Firestore, click on "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow users to read/write their subcollections
      match /{subcollection}/{document} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Click "Publish"

### 5. Get Your Firebase Configuration

1. Click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the "</>" (Web) icon
5. Register your app with a nickname (e.g., "Physics Daily Web")
6. Copy the Firebase configuration object

### 6. Update Your Configuration

1. Open `/assets/js/firebase-config.js`
2. Replace the placeholder configuration with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 7. Configure Authentication Settings

1. In Firebase Console, go to Authentication > Settings
2. Under "Authorized domains", add your website domain:
   - For GitHub Pages: `yourusername.github.io`
   - For local testing: `localhost` is already included
3. Save changes

### 8. Enable Offline Persistence (Optional but Recommended)

The system already has offline persistence enabled in the code. This means:
- Data is cached locally for offline access
- Changes sync automatically when online
- Works seamlessly across page refreshes

## Testing Your Setup

### Local Testing
1. Use a local server (like VS Code's Live Server extension)
2. Open your site at `http://localhost:5500` (or your server's port)
3. Click "Sign In" and create a test account

### Production Testing
1. Deploy to GitHub Pages or your hosting
2. Test sign-up, sign-in, and dashboard features
3. Verify data syncs across devices when logged in with same account

## Free Tier Limits (More than enough for most sites)

Firebase's free Spark plan includes:
- **Authentication**: 10,000 verifications/month
- **Firestore**: 
  - 1 GiB storage
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day
- **Hosting**: 10 GB storage, 360 MB/day bandwidth

## Features Implemented

### Authentication
- ✅ Email/Password sign-up and sign-in
- ✅ Google sign-in
- ✅ Password reset via email
- ✅ Email verification
- ✅ Persistent login sessions

### User Dashboard
- ✅ Personal statistics tracking
- ✅ Daily streak counter
- ✅ Quiz history and scores
- ✅ Progress tracking by chapter/topic
- ✅ Achievement badges
- ✅ Learning activity timeline

### Data Synchronization
- ✅ Automatic sync across devices
- ✅ Offline support with local caching
- ✅ Real-time updates when online
- ✅ Local progress migration to cloud

### Quiz Integration
- ✅ Automatic score saving
- ✅ Time tracking per quiz
- ✅ Chapter-wise progress tracking
- ✅ Historical performance data

## Troubleshooting

### "Firebase is not defined" Error
- Make sure Firebase scripts are loaded in your HTML before your app scripts
- Check that firebase-config.js is loaded before auth-manager.js

### Authentication Not Working
- Verify your Firebase configuration is correct
- Check that authentication methods are enabled in Firebase Console
- Ensure your domain is in the authorized domains list

### Data Not Syncing
- Check Firestore security rules
- Verify user is properly authenticated
- Look for errors in browser console
- Check Firebase Console for quota limits

## Support

For issues specific to:
- **Firebase**: [Firebase Documentation](https://firebase.google.com/docs)
- **This implementation**: Create an issue on your GitHub repository

## Next Steps

1. Customize the dashboard UI to match your design preferences
2. Add more achievement types and milestones
3. Implement email notifications for streaks (requires Firebase Functions - paid)
4. Add social features like leaderboards (optional)
5. Create admin panel for content management (optional)

## Security Notes

- Never commit API keys to public repositories (though Firebase keys are meant to be public)
- Always use security rules to protect user data
- Enable App Check for additional security (optional)
- Monitor usage in Firebase Console to detect unusual activity

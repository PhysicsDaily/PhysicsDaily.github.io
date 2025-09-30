# Account Creation and Leaderboard Fixes

## Summary
Fixed three critical issues with account creation and leaderboard functionality.

## Issues Fixed

### 1. ✅ Removed Age Group and Education Level Fields
**Problem**: Account creation form had optional fields that were unnecessary and cluttering the onboarding experience.

**Solution**:
- Removed "Age Group" dropdown field
- Removed "Education Level" dropdown field
- Simplified onboarding to only require:
  - Full Name (required)
  - Nationality (required)

**Files Modified**:
- `assets/js/onboarding.js`
  - Removed HTML for both optional fields
  - Removed data collection for ageGroup and education from form submission handler

---

### 2. ✅ Fixed Country Not Being Saved During Account Creation
**Problem**: The country selected during onboarding (nationality field) was not being saved properly to the user profile, so it didn't appear in settings.

**Solution**:
- Changed field name from `nationality` to `country` in onboarding data
- Updated Firebase user document structure to store country in two places:
  - `profile.country` - for display purposes
  - `preferences.country` - for settings page
- This ensures the country appears correctly in settings page

**Files Modified**:
- `assets/js/onboarding.js`
  - Changed `nationality: nationality` to `country: nationality` in onboarding data object
  
- `assets/js/auth-manager.js`
  - Updated `createUserDocumentWithOnboarding()` method:
    - Added `profile.country` field
    - Added `preferences.country` field
    - Removed `nationality`, `ageGroup`, and `education` fields
  - Updated `updateUserDocument()` method:
    - Changed to save `profile.country` and `preferences.country`
    - Removed `nationality`, `ageGroup`, and `education` fields

---

### 3. ✅ Fixed Deleted Accounts Appearing in Leaderboard
**Problem**: When users deleted their accounts, their XP logs remained in the database and continued to show on the leaderboard.

**Solution - Two-part fix**:

#### Part A: Mark Deleted User XP Logs
When a user deletes their account, mark all their XP logs with a `userDeleted` flag:

**Files Modified**:
- `assets/js/settings.js`
  - Enhanced delete account function to:
    1. Find all xp_logs for the user (uid match)
    2. Mark them with `userDeleted: true` flag
    3. Add `deletedAt` timestamp
    4. Then delete the user document

#### Part B: Filter Deleted Users from Leaderboard
Prevent deleted users from appearing in leaderboard rankings:

**Files Modified**:
- `assets/js/leaderboard.js`
  - Added check in XP log processing: `if (d.userDeleted) return;`
  - This skips any XP logs marked as deleted
  - Results in clean leaderboard without deleted accounts

---

## Technical Details

### Data Structure Changes

**Before** (User Document):
```javascript
{
  uid: "...",
  displayName: "...",
  nationality: "India",  // ❌ Wrong field name
  ageGroup: "18-25",     // ❌ Unnecessary
  education: "undergraduate", // ❌ Unnecessary
  preferences: {
    theme: "light"
  }
}
```

**After** (User Document):
```javascript
{
  uid: "...",
  displayName: "...",
  profile: {
    country: "India"      // ✅ Correct location
  },
  preferences: {
    theme: "light",
    country: "India"      // ✅ Also stored here for settings
  }
}
```

### XP Log Filtering

**Before**: All XP logs included in leaderboard
```javascript
snap.forEach(doc => {
  const d = doc.data();
  // Process all logs
});
```

**After**: Deleted user logs filtered out
```javascript
snap.forEach(doc => {
  const d = doc.data();
  if (d.userDeleted) return; // ✅ Skip deleted users
  // Process only active user logs
});
```

---

## Testing Checklist

Before deploying, test:

1. **Simplified Onboarding**:
   - [ ] Sign up with new account
   - [ ] Verify only Name and Nationality fields appear
   - [ ] Verify no Age Group or Education Level fields

2. **Country Saving**:
   - [ ] Sign up and select a country (e.g., "India")
   - [ ] Complete onboarding
   - [ ] Go to Settings page
   - [ ] Verify country dropdown shows "India" as selected
   - [ ] Try changing country
   - [ ] Verify new country is saved and persists

3. **Deleted Account Filtering**:
   - [ ] Create test account and earn some XP
   - [ ] Check leaderboard - verify account appears
   - [ ] Delete the test account
   - [ ] Wait a few seconds, refresh leaderboard
   - [ ] Verify deleted account no longer appears
   - [ ] Check Firebase console - verify xp_logs have `userDeleted: true`

---

## Firebase Rules Update

Ensure your Firestore security rules allow:
- Users to update their own xp_logs (for marking as deleted)
- Reading xp_logs for leaderboard queries

```javascript
match /xp_logs/{logId} {
  // Allow user to mark their own logs as deleted
  allow update: if request.auth != null && 
    request.resource.data.uid == request.auth.uid &&
    request.resource.data.userDeleted == true;
  
  // Allow reading for leaderboard
  allow read: if request.auth != null;
}
```

---

## Deployment Notes

1. **Build the site**:
   ```powershell
   npm run build
   ```

2. **Test locally**:
   ```powershell
   npm start
   ```

3. **Commit and push**:
   ```powershell
   git add .
   git commit -m "Fix: Remove unnecessary fields, save country correctly, filter deleted users from leaderboard"
   git push origin main
   ```

4. **Verify on live site**:
   - Test account creation
   - Test settings page country display
   - Test account deletion
   - Verify leaderboard filters deleted accounts

---

## Migration Notes for Existing Users

Existing users created before this fix may have:
- `nationality` field instead of `profile.country`
- `ageGroup` and `education` fields

These will continue to work, but new signups will use the new structure. Consider a one-time migration script if needed.

---

## Status: ✅ Complete

All three issues have been resolved and are ready for deployment.

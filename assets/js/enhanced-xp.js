// Enhanced XP System for Physics Daily
// Implements sophisticated XP logic with topic progression tracking

(function(){
  class EnhancedXPSystem {
    constructor() {
      this.state = this.loadState();
      this.topicProgress = this.loadTopicProgress();
      this.listeners = [];
      this.persistScheduled = null;

      // Cloud sync optimization
      this.cloudSyncScheduled = null;
      this.pendingCloudXP = [];
      this.lastCloudSync = 0;
      this.CLOUD_SYNC_DELAY = 2000; // Reduced to 2 seconds for better responsiveness
      this.userProfileCache = null; // Cache user profile to avoid repeated reads
      this.lastSyncCheck = 0;
      this.SYNC_CHECK_INTERVAL = 60000; // Check sync every 1 minute (was 5 minutes)

      // Topic definitions with question counts
      this.topics = {
        'mechanics-foundations': { name: 'Mechanics Foundations', totalQuestions: 100 },
        'mechanics-rotation': { name: 'Rotational Motion', totalQuestions: 80 },
        'mechanics-energy': { name: 'Energy & Gravitation', totalQuestions: 90 },
        'fluids-mechanics': { name: 'Fluid Mechanics', totalQuestions: 60 },
        'waves-sound': { name: 'Waves & Sound', totalQuestions: 70 },
        'thermodynamics': { name: 'Thermodynamics', totalQuestions: 85 },
        'electromagnetism-electrostatics': { name: 'Electrostatics', totalQuestions: 120 },
        'electromagnetism-current': { name: 'Current & Magnetism', totalQuestions: 110 },
        'electromagnetism-ac': { name: 'AC Circuits & Light', totalQuestions: 95 },
        'optics-geometric': { name: 'Geometric Optics', totalQuestions: 75 },
        'optics-wave': { name: 'Wave Properties of Light', totalQuestions: 85 },
        'modern-quantum': { name: 'Quantum & Atomic Physics', totalQuestions: 100 },
        'modern-nuclear': { name: 'Nuclear & Particle Physics', totalQuestions: 80 }
      };
      
      this.init();
    }

    init() {
      // Check for daily login XP
      this.checkDailyLogin();

      // Listen for auth state changes to sync XP
      if (window.authManager) {
        authManager.on('authStateChanged', (user) => {
          if (user) {
            this.loadUserProfileCache(); // Load profile once
            this.syncXpToCloud();
          } else {
            this.userProfileCache = null; // Clear cache on sign out
          }
        });
      }

      // Flush pending XP writes before page unload
      window.addEventListener('beforeunload', () => {
        this.flushPendingCloudWrites();
      });
    }

    // Cache user profile to avoid repeated Firestore reads
    async loadUserProfileCache() {
      try {
        const user = authManager?.getCurrentUser();
        if (!user) return;

        // First check localStorage
        try {
          const stored = JSON.parse(localStorage.getItem('pd:user:profile') || '{}');
          if (stored?.displayName || stored?.country) {
            this.userProfileCache = {
              nickname: stored.displayName || user.displayName || user.email?.split('@')[0] || 'User',
              country: stored.country || null
            };
            return; // Use cached data, skip Firestore read
          }
        } catch {}

        // Only read from Firestore if localStorage doesn't have profile
        if (authManager.db) {
          const userDoc = await authManager.db.collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            this.userProfileCache = {
              nickname: userData?.profile?.displayName || user.displayName || user.email?.split('@')[0] || 'User',
              country: userData?.profile?.country || userData?.preferences?.country || null
            };
          }
        }
      } catch (e) {
        console.warn('[EnhancedXP] Failed to cache user profile:', e);
      }
    }

    loadState() {
      try {
        const raw = localStorage.getItem('pd:xp:enhanced');
        if (raw) return JSON.parse(raw);
      } catch {}
      return { 
        xp: 0, 
        level: 1, 
        lastLoginDate: null,
        loginStreak: 0,
        totalDaysActive: 0,
        badges: [], 
        lastAwardAt: 0 
      };
    }

    loadTopicProgress() {
      try {
        const raw = localStorage.getItem('pd:xp:topicProgress');
        if (raw) {
          const parsed = JSON.parse(raw);
          // Convert correctAnswers arrays back to Sets
          Object.keys(parsed).forEach(topicId => {
            if (parsed[topicId].correctAnswers) {
              parsed[topicId].correctAnswers = new Set(parsed[topicId].correctAnswers);
            }
          });
          return parsed;
        }
      } catch {}
      return {};
    }

    saveState() {
      try {
        localStorage.setItem('pd:xp:enhanced', JSON.stringify(this.state));

        // Convert Sets to arrays for JSON serialization
        const serializableProgress = {};
        Object.keys(this.topicProgress).forEach(topicId => {
          serializableProgress[topicId] = {
            ...this.topicProgress[topicId],
            correctAnswers: Array.from(this.topicProgress[topicId].correctAnswers || [])
          };
        });
        localStorage.setItem('pd:xp:topicProgress', JSON.stringify(serializableProgress));
      } catch {}
    }

    schedulePersist() {
      clearTimeout(this.persistScheduled);
      this.persistScheduled = setTimeout(() => this.saveState(), 300);
    }

    // Check and award daily login XP
    checkDailyLogin() {
      const today = new Date().toDateString();
      const lastLogin = this.state.lastLoginDate;
      
      if (lastLogin !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastLogin === yesterday.toDateString()) {
          // Continue streak
          this.state.loginStreak++;
        } else if (lastLogin !== null) {
          // Streak broken, restart
          this.state.loginStreak = 1;
        } else {
          // First login ever
          this.state.loginStreak = 1;
        }
        
        this.state.lastLoginDate = today;
        this.state.totalDaysActive++;
        
        // Award daily login XP
        const dailyXP = 2;
        const streakBonus = Math.min(this.state.loginStreak * 0.5, 5); // Max 5 bonus XP
        const totalDailyXP = dailyXP + Math.floor(streakBonus);
        
        this.addXP(totalDailyXP, 'daily-login', {
          streak: this.state.loginStreak,
          bonus: Math.floor(streakBonus)
        });
        
        // Award streak badges
        if (this.state.loginStreak === 7) {
          this.addBadge('week-streak', '7-Day Login Streak! 🔥');
        } else if (this.state.loginStreak === 30) {
          this.addBadge('month-streak', '30-Day Login Streak! 🏆');
        } else if (this.state.loginStreak === 100) {
          this.addBadge('century-streak', '100-Day Login Streak! 👑');
        }
        
        this.schedulePersist();
      }
    }

    // Get topic progress percentage
    getTopicProgress(topicId) {
      if (!this.topicProgress[topicId]) {
        this.topicProgress[topicId] = {
          correctAnswers: new Set(),
          totalAttempted: 0,
          firstSolveDate: null
        };
      }
      return this.topicProgress[topicId];
    }

    // Calculate XP for quiz performance
    calculateQuizXP(topicId, results) {
      const { correct, totalQuestions, questionIds, isFirstAttempt } = results;
      const topic = this.topics[topicId];
      
      if (!topic) {
        console.warn(`Unknown topic: ${topicId}`);
        return { xp: correct * 2, breakdown: { base: correct * 2 } }; // Fallback
      }
      
      const progress = this.getTopicProgress(topicId);
      let totalXP = 0;
      const breakdown = { base: 0, firstTime: 0, mastery: 0 };
      
      // Track progress for each question
      questionIds.forEach((qId, index) => {
        if (index < correct) { // This question was answered correctly
          const wasNewQuestion = !progress.correctAnswers.has(qId);
          progress.correctAnswers.add(qId);
          
          if (wasNewQuestion) {
            progress.totalAttempted++;
          }
        }
      });
      
      // Calculate completion percentage
      const completionPercentage = (progress.correctAnswers.size / topic.totalQuestions) * 100;
      const hasHighMastery = completionPercentage >= 70;
      
      // XP calculation based on mastery level
      if (hasHighMastery) {
        // High mastery: 0.5 XP per correct answer
        const masteryXP = correct * 0.5;
        totalXP += masteryXP;
        breakdown.mastery = masteryXP;
      } else {
        // First time or low mastery: 4 XP per correct answer
        const baseXP = correct * 4;
        totalXP += baseXP;
        breakdown.firstTime = baseXP;
      }
      
      // First time solving any question in this topic bonus
      if (!progress.firstSolveDate) {
        progress.firstSolveDate = new Date().toISOString();
        const explorerBonus = 10;
        totalXP += explorerBonus;
        breakdown.explorer = explorerBonus;
        this.addBadge(`explorer-${topicId}`, `${topic.name} Explorer! 🌟`);
      }
      
      // Mastery milestone badges
      if (completionPercentage >= 50 && !this.hasBadge(`mastery-50-${topicId}`)) {
        this.addBadge(`mastery-50-${topicId}`, `${topic.name} - 50% Mastery! 🎯`);
        totalXP += 20; // Milestone bonus
        breakdown.milestone = (breakdown.milestone || 0) + 20;
      }
      
      if (completionPercentage >= 70 && !this.hasBadge(`mastery-70-${topicId}`)) {
        this.addBadge(`mastery-70-${topicId}`, `${topic.name} - 70% Mastery! 🏅`);
        totalXP += 30; // Milestone bonus
        breakdown.milestone = (breakdown.milestone || 0) + 30;
      }
      
      if (completionPercentage >= 90 && !this.hasBadge(`mastery-90-${topicId}`)) {
        this.addBadge(`mastery-90-${topicId}`, `${topic.name} - 90% Mastery! 🏆`);
        totalXP += 50; // Milestone bonus
        breakdown.milestone = (breakdown.milestone || 0) + 50;
      }
      
      // Perfect score bonus
      if (correct === totalQuestions) {
        const perfectBonus = Math.max(5, totalQuestions * 0.5);
        totalXP += perfectBonus;
        breakdown.perfect = perfectBonus;
      }
      
      // Update progress
      this.topicProgress[topicId] = progress;
      this.schedulePersist();
      
      return { 
        xp: Math.floor(totalXP), 
        breakdown,
        completionPercentage: Math.round(completionPercentage * 10) / 10,
        masteryLevel: hasHighMastery ? 'high' : 'developing'
      };
    }

    // Award XP for quiz completion
    awardQuizXP(topicId, quizResults) {
      const { correct, totalQuestions, timeSpent, percentage } = quizResults;
      
      // Generate question IDs (in real implementation, these should come from the quiz)
      const questionIds = Array.from({ length: totalQuestions }, (_, i) => `${topicId}-q${i + 1}`);
      
      const xpResult = this.calculateQuizXP(topicId, {
        correct,
        totalQuestions,
        questionIds,
        isFirstAttempt: true // This should be tracked properly
      });
      
      this.addXP(xpResult.xp, 'quiz', {
        topicId,
        ...quizResults,
        ...xpResult
      });
      
      // Show detailed breakdown to user
      this.showXPBreakdown(xpResult);
      
      return xpResult;
    }

    // Show XP breakdown to user
    showXPBreakdown(xpResult) {
      const { xp, breakdown, completionPercentage, masteryLevel } = xpResult;
      
      let message = `Earned ${xp} XP! `;
      const details = [];
      
      if (breakdown.firstTime) details.push(`${breakdown.firstTime} base XP`);
      if (breakdown.mastery) details.push(`${breakdown.mastery} mastery XP`);
      if (breakdown.explorer) details.push(`${breakdown.explorer} explorer bonus`);
      if (breakdown.milestone) details.push(`${breakdown.milestone} milestone bonus`);
      if (breakdown.perfect) details.push(`${breakdown.perfect} perfect score`);
      
      if (details.length > 0) {
        message += `(${details.join(', ')})`;
      }
      
      this.toast(message);
      
      // Show mastery progress
      if (masteryLevel === 'high') {
        this.toast(`Topic mastery: ${completionPercentage}% (High Mastery Mode)`, '🎓');
      } else {
        this.toast(`Topic progress: ${completionPercentage}%`, '📈');
      }
    }

    // Add XP with reason and metadata
    addXP(amount, reason = '', meta = {}) {
      const xpToAdd = Math.max(0, Math.floor(amount));
      this.state.xp += xpToAdd;

      // Level calculation (enhanced)
      const newLevel = this.calculateLevel(this.state.xp);
      if (newLevel > this.state.level) {
        const oldLevel = this.state.level;
        this.state.level = newLevel;
        this.addBadge(`level-${newLevel}`, `Level ${newLevel} Achieved! 🎉`);
        this.toast(`Level Up! You are now level ${newLevel}!`, '⬆️');

        // Level milestone rewards
        if (newLevel % 10 === 0) {
          this.addBadge(`milestone-${newLevel}`, `Level ${newLevel} Milestone! 💎`);
        }
      }

      this.state.lastAwardAt = Date.now();
      this.schedulePersist();
      this.emit();

      // Queue XP for batched cloud sync instead of immediate write
      if (window.authManager && authManager.isSignedIn()) {
        this.queueCloudXP(xpToAdd, reason, meta);
      }
    }

    // Queue XP for batched cloud write (Firebase optimization)
    queueCloudXP(amount, reason, meta) {
      this.pendingCloudXP.push({ amount, reason, meta, timestamp: Date.now() });

      // Schedule batched write
      if (!this.cloudSyncScheduled) {
        this.cloudSyncScheduled = setTimeout(() => {
          this.flushPendingCloudWrites();
        }, this.CLOUD_SYNC_DELAY);
      }
    }

    // Flush all pending XP writes to cloud in one batch
    async flushPendingCloudWrites() {
      if (this.pendingCloudXP.length === 0) return;

      clearTimeout(this.cloudSyncScheduled);
      this.cloudSyncScheduled = null;

      const batch = [...this.pendingCloudXP];
      this.pendingCloudXP = [];

      try {
        const db = authManager.db;
        const user = authManager.getCurrentUser();
        if (!db || !user) return;

        // Get cached profile or use defaults
        const profile = this.userProfileCache || {
          nickname: user.displayName || user.email?.split('@')[0] || 'User',
          country: null
        };

        // Calculate total XP from batch
        const totalXP = batch.reduce((sum, item) => sum + item.amount, 0);

        // Single write to update user's total XP
        await db.collection('users').doc(user.uid).set({
          xp: {
            total: firebase.firestore.FieldValue.increment(totalXP),
            lastAwardAt: firebase.firestore.FieldValue.serverTimestamp()
          },
          displayName: profile.nickname
        }, { merge: true });

        // Only log significant XP awards (reduce xp_logs writes)
        const significantAwards = batch.filter(item =>
          item.amount >= 10 ||
          item.reason === 'quiz' ||
          item.reason === 'daily-login' ||
          (item.meta && item.meta.milestone)
        );

        // Batch write significant XP logs
        if (significantAwards.length > 0) {
          const batchWrite = db.batch();

          significantAwards.forEach(item => {
            const logRef = db.collection('xp_logs').doc();
            batchWrite.set(logRef, {
              uid: user.uid,
              displayName: profile.nickname,
              country: profile.country,
              xp: item.amount,
              reason: item.reason || '',
              meta: item.meta || {},
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              clientTs: item.timestamp
            });
          });

          await batchWrite.commit();
        }

        this.lastCloudSync = Date.now();

      } catch (e) {
        console.warn('[EnhancedXP] Failed to flush XP to cloud:', e);
        // Re-queue failed writes
        this.pendingCloudXP.unshift(...batch);
      }
    }

    // Enhanced level calculation
    calculateLevel(xp) {
      // More balanced progression curve
      // Level 1: 0-99 XP
      // Level 2: 100-249 XP  
      // Level 3: 250-449 XP
      // Each level requires 50 more XP than the previous gap
      let level = 1;
      let xpNeeded = 100; // XP needed for level 2
      let remaining = xp;
      
      while (remaining >= xpNeeded) {
        remaining -= xpNeeded;
        level++;
        xpNeeded += 50; // Increase requirement by 50 each level
      }
      
      return level;
    }

    // Add badge with duplicate checking
    addBadge(id, text) {
      if (!this.hasBadge(id)) {
        this.state.badges.unshift({ id, text, earnedAt: Date.now() });
        this.toast(text, '🏅');
        
        // Keep only latest 50 badges
        this.state.badges = this.state.badges.slice(0, 50);
        this.schedulePersist();
        this.emit();
      }
    }

    // Check if user has a specific badge
    hasBadge(badgeId) {
      return this.state.badges.some(badge => badge.id === badgeId);
    }

    // Optimized sync: only sync once per session or when explicitly needed
    async syncXpToCloud() {
      try {
        // Rate limit: only sync if enough time has passed
        const now = Date.now();
        if (now - this.lastSyncCheck < this.SYNC_CHECK_INTERVAL) {
          return; // Skip sync, too soon since last check
        }
        this.lastSyncCheck = now;

        if (!(window.authManager && authManager.isSignedIn())) return;

        const db = authManager.db;
        const user = authManager.getCurrentUser();
        if (!db || !user) return;

        // Check if we need to sync (use cached value if available)
        const cachedCloudXP = parseInt(localStorage.getItem('pd:lastCloudXP') || '0', 10);
        const localXP = this.state.xp;

        // Only read from Firestore if local is significantly different
        if (Math.abs(localXP - cachedCloudXP) > 20) {
          const userRef = db.collection('users').doc(user.uid);
          const doc = await userRef.get();
          const cloudXP = doc.exists ? (doc.data()?.xp?.total || 0) : 0;

          if (localXP > cloudXP) {
            // Local has more XP, push to cloud
            const diff = localXP - cloudXP;

            // Use batched write system
            this.queueCloudXP(diff, 'sync', {
              source: 'local-backfill',
              cloudXP,
              localXP
            });

            // Immediately flush for sync operations
            await this.flushPendingCloudWrites();

            // Cache the cloud value
            localStorage.setItem('pd:lastCloudXP', localXP.toString());

            this.toast('Synced your progress to the cloud!', '☁️');
          } else if (cloudXP > localXP) {
            // Cloud has more XP, pull from cloud
            this.state.xp = cloudXP;
            this.state.level = this.calculateLevel(cloudXP);
            this.schedulePersist();
            this.emit();

            // Update cache
            localStorage.setItem('pd:lastCloudXP', cloudXP.toString());

            this.toast('Loaded your progress from the cloud!', '☁️');
          } else {
            // XP matches, just update cache
            localStorage.setItem('pd:lastCloudXP', cloudXP.toString());
          }
        }
      } catch (e) {
        console.warn('[EnhancedXP] Sync failed:', e);
      }
    }

    // Event handling
    onChange(callback) {
      this.listeners.push(callback);
    }

    emit() {
      this.listeners.forEach(cb => cb(this.getState()));
    }

    // Get current state for UI
    getState() {
      const levelInfo = this.getLevelInfo(this.state.xp);
      return {
        totalXP: this.state.xp,
        xp: this.state.xp, // Alias for compatibility
        level: this.state.level,
        loginStreak: this.state.loginStreak,
        totalDaysActive: this.state.totalDaysActive,
        badges: this.state.badges,
        lastAwardAt: this.state.lastAwardAt,
        levelInfo,
        topicProgress: this.topicProgress
      };
    }

    // Get level progression info
    getLevelInfo(xp) {
      const currentLevel = this.calculateLevel(xp);
      
      // Calculate XP for current level and next level
      let levelStartXP = 0;
      let nextLevelXP = 100;
      
      for (let i = 1; i < currentLevel; i++) {
        levelStartXP += nextLevelXP;
        nextLevelXP += 50;
      }
      
      const xpIntoLevel = xp - levelStartXP;
      const xpNeededForNext = nextLevelXP;
      
      return {
        level: currentLevel,
        xpIntoLevel,
        xpNeededForNext,
        progressPercent: (xpIntoLevel / xpNeededForNext) * 100
      };
    }

    // Toast notification system
    toast(message, icon = '✨') {
      const el = document.createElement('div');
      el.className = 'enhanced-xp-toast';
      el.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
      
      Object.assign(el.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'var(--card-bg, #1f2937)',
        color: 'var(--text-primary, #f9fafb)',
        border: '1px solid var(--border-color, #374151)',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        zIndex: '10010',
        opacity: '0',
        transform: 'translateY(-10px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        maxWidth: '300px',
        fontSize: '14px',
        fontWeight: '500'
      });
      
      document.body.appendChild(el);
      
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
      
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-10px)';
        setTimeout(() => el.remove(), 300);
      }, 4000);
    }

    // Get topic mastery summary
    getTopicMasterySummary() {
      const summary = {};
      
      Object.keys(this.topics).forEach(topicId => {
        const progress = this.getTopicProgress(topicId);
        const topic = this.topics[topicId];
        const completionPercentage = (progress.correctAnswers.size / topic.totalQuestions) * 100;
        
        summary[topicId] = {
          name: topic.name,
          completed: progress.correctAnswers.size,
          total: topic.totalQuestions,
          percentage: Math.round(completionPercentage * 10) / 10,
          masteryLevel: completionPercentage >= 70 ? 'high' : 'developing'
        };
      });
      
      return summary;
    }
  }

  // Replace the old gamification system
  window.enhancedXP = new EnhancedXPSystem();
  
  // Keep backward compatibility
  window.gamification = {
    getState: () => window.enhancedXP.getState(),
    grantXp: (amount, reason, meta) => window.enhancedXP.addXP(amount, reason, meta),
    awardForQuiz: (results) => {
      // Extract topic from current page or quiz data
      const topicId = extractTopicFromPage() || 'general';
      return window.enhancedXP.awardQuizXP(topicId, results);
    },
    syncXpToCloud: () => window.enhancedXP.syncXpToCloud(),
    onChange: (cb) => window.enhancedXP.onChange(cb)
  };

  // Helper function to extract topic ID from current page
  function extractTopicFromPage() {
    const path = window.location.pathname;
    
    if (path.includes('/mechanics/')) {
      if (path.includes('foundation') || path.includes('kinematics') || path.includes('force')) return 'mechanics-foundations';
      if (path.includes('rotation')) return 'mechanics-rotation';
      if (path.includes('energy') || path.includes('gravitation')) return 'mechanics-energy';
    }
    
    if (path.includes('/electromagnetism/')) {
      if (path.includes('electrostatic')) return 'electromagnetism-electrostatics';
      if (path.includes('current') || path.includes('magnetism')) return 'electromagnetism-current';
      if (path.includes('ac') || path.includes('maxwell')) return 'electromagnetism-ac';
    }
    
    if (path.includes('/optics/')) {
      if (path.includes('geometric')) return 'optics-geometric';
      if (path.includes('wave')) return 'optics-wave';
    }
    
    if (path.includes('/modern/')) {
      if (path.includes('quantum') || path.includes('atomic')) return 'modern-quantum';
      if (path.includes('nuclear') || path.includes('particle')) return 'modern-nuclear';
    }
    
    if (path.includes('/fluids/')) return 'fluids-mechanics';
    if (path.includes('/waves/')) return 'waves-sound';
    if (path.includes('/thermodynamics/')) return 'thermodynamics';
    
    return 'general';
  }
})();
// Dashboard functionality
class Dashboard {
    constructor() {
        this.user = null;
        this.stats = null;
        this.init();
    }

    async init() {
        if (!authManager.isInitialized) {
            await authManager.init();
        }

        authManager.on('authStateChanged', async (user) => {
            if (user) {
                this.user = user;
                await this.loadDashboard();
            } else {
                window.location.href = '/';
            }
        });

        const currentUser = authManager.getCurrentUser();
        if (currentUser) {
            this.user = currentUser;
            await this.loadDashboard();
        } else {
            setTimeout(() => {
                if (!authManager.getCurrentUser()) {
                    window.location.href = '/';
                }
            }, 2000);
        }

        this.initTabSwitching();
    }

    async loadDashboard() {
        try {
            document.getElementById('loadingContainer').style.display = 'flex';
            document.getElementById('dashboardContent').style.display = 'none';

            this.stats = await authManager.getUserStats();

            this.updateWelcomeMessage();
            this.updateStatistics();
            this.updateStreakDisplay();
            this.loadTabs();

            document.getElementById('loadingContainer').style.display = 'none';
            document.getElementById('dashboardContent').style.display = 'block';
            document.getElementById('streakDisplay').style.display = 'block';
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        }
    }

    updateWelcomeMessage() {
        const welcomeEl = document.getElementById('welcomeMessage');
        const name = this.user.displayName || this.user.email.split('@')[0];
        const hour = new Date().getHours();
        
        let greeting = 'Good evening';
        if (hour < 12) greeting = 'Good morning';
        else if (hour < 17) greeting = 'Good afternoon';
        
        welcomeEl.textContent = `${greeting}, ${name}!`;
    }

    updateStatistics() {
        if (!this.stats) return;

        const streak = this.stats.streak || { current: 0 };
        document.getElementById('streakCount').textContent = streak.current || 0;
        document.getElementById('streakNumber').textContent = streak.current || 0;
        document.getElementById('totalQuizzes').textContent = this.stats.totalQuizzes || 0;
        
        const avgScore = this.stats.totalQuizzes > 0 
            ? Math.round((this.stats.correctAnswers / (this.stats.totalQuizzes * 10)) * 100)
            : 0;
        document.getElementById('avgScore').textContent = avgScore + '%';
        
        const hours = Math.floor((this.stats.totalTime || 0) / 3600);
        document.getElementById('studyTime').textContent = hours + 'h';
    }

    updateStreakDisplay() {
        const streakDisplay = document.getElementById('streakDisplay');
        if (this.stats && this.stats.streak && this.stats.streak.current > 0) {
            streakDisplay.style.display = 'block';
        }
    }

    loadTabs() {
        this.loadOverviewTab();
        this.loadProgressTab();
        this.loadAchievementsTab();
        this.loadActivityTab();
    }

    loadOverviewTab() {
        const recommendationsGrid = document.getElementById('recommendationsGrid');
        const recommendations = this.generateRecommendations();
        
        recommendationsGrid.innerHTML = recommendations.map(rec => `
            <a href="${rec.link}" class="recommendation-card">
                <div class="recommendation-title">${rec.title}</div>
                <div class="recommendation-desc">${rec.description}</div>
            </a>
        `).join('');

        const recentActivity = document.getElementById('recentActivity');
        const activities = this.getRecentActivities();
        
        recentActivity.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-time">${activity.time}</div>
                <div class="activity-text">${activity.text}</div>
            </div>
        `).join('');
    }

    loadProgressTab() {
        const chapterProgress = document.getElementById('chapterProgress');
        const chapters = this.getChapterProgress();
        
        chapterProgress.innerHTML = chapters.map(chapter => `
            <div class="progress-item">
                <span class="progress-label">${chapter.name}</span>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${chapter.progress}%"></div>
                </div>
                <span class="progress-value">${chapter.progress}%</span>
            </div>
        `).join('');
    }

    loadAchievementsTab() {
        const achievementGrid = document.getElementById('achievementGrid');
        const achievements = this.getAchievements();
        
        achievementGrid.innerHTML = achievements.map(achievement => `
            <div class="achievement-badge ${achievement.earned ? '' : 'locked'}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
            </div>
        `).join('');
    }

    loadActivityTab() {
        const fullActivity = document.getElementById('fullActivity');
        const activities = this.getAllActivities();
        
        fullActivity.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-time">${activity.time}</div>
                <div class="activity-text">${activity.text}</div>
            </div>
        `).join('');
    }

    generateRecommendations() {
        return [
            { title: 'Continue Mechanics', description: 'Complete Chapter 3 quiz', link: '/mechanics/chapter3/mcq.html' },
            { title: 'Review Kinematics', description: 'Practice 2D motion problems', link: '/mechanics/chapter4/mcq.html' },
            { title: 'Start Thermodynamics', description: 'Learn about temperature', link: '/thermodynamics/chapter21/' }
        ];
    }

    getRecentActivities() {
        const activities = [];
        if (this.stats && this.stats.quizHistory) {
            this.stats.quizHistory.slice(0, 5).forEach(quiz => {
                activities.push({
                    time: this.formatDate(quiz.timestamp),
                    text: `Completed ${quiz.chapter || 'quiz'} - Score: ${quiz.score || 0}%`
                });
            });
        }
        return activities;
    }

    getChapterProgress() {
        const progress = [];
        const topics = ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics'];
        topics.forEach(topic => {
            const value = Math.floor(Math.random() * 100);
            progress.push({ name: topic, progress: value });
        });
        return progress;
    }

    getAchievements() {
        return [
            { icon: '🏆', name: 'First Quiz', earned: this.stats && this.stats.totalQuizzes > 0 },
            { icon: '🔥', name: '7 Day Streak', earned: this.stats && this.stats.streak && this.stats.streak.current >= 7 },
            { icon: '📚', name: '10 Quizzes', earned: this.stats && this.stats.totalQuizzes >= 10 },
            { icon: '⭐', name: 'Perfect Score', earned: false },
            { icon: '🎯', name: '90% Average', earned: false },
            { icon: '🚀', name: 'Speed Learner', earned: false }
        ];
    }

    getAllActivities() {
        const activities = [];
        if (this.stats && this.stats.quizHistory) {
            this.stats.quizHistory.forEach(quiz => {
                activities.push({
                    time: this.formatDate(quiz.timestamp),
                    text: `Completed ${quiz.chapter || 'quiz'} - Score: ${quiz.score || 0}%`
                });
            });
        }
        return activities;
    }

    formatDate(timestamp) {
        if (!timestamp) return 'Just now';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    }

    initTabSwitching() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                e.target.classList.add('active');
                document.getElementById(tabName).classList.add('active');
            });
        });
    }

    showError(message) {
        alert(message);
    }
}

// Initialize dashboard
if (window.location.pathname.includes('dashboard')) {
    new Dashboard();
}

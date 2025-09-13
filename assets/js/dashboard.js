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
            this.loadTabs();

            document.getElementById('loadingContainer').style.display = 'none';
            document.getElementById('dashboardContent').style.display = 'block';
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
        // Load stats from localStorage first
        const localStats = JSON.parse(localStorage.getItem('quizStats') || '{}');
        const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
        
        // Merge with Firebase stats if available
        const totalQuizzes = localStats.totalQuizzes || (this.stats && this.stats.totalQuizzes) || 0;
        const correctAnswers = localStats.correctAnswers || (this.stats && this.stats.correctAnswers) || 0;
        const totalQuestions = localStats.totalQuestions || (this.stats && this.stats.totalQuestions) || 0;
        
        document.getElementById('totalQuizzes').textContent = totalQuizzes;
        
        // Calculate average score properly
        const avgScore = totalQuestions > 0 
            ? Math.round((correctAnswers / totalQuestions) * 100)
            : 0;
        document.getElementById('avgScore').textContent = avgScore + '%';
        
        // Store for later use
        this.localStats = localStats;
        this.quizHistory = quizHistory;

        // Update XP/Level UI with enhanced XP system
        this.updateXpLevelUI();
    }

    updateXpLevelUI() {
        // Check if enhanced XP system is available
        if (window.enhancedXP && typeof enhancedXP.getUserData === 'function') {
            try {
                const xpData = enhancedXP.getUserData();
                if (xpData) {
                    // Update XP display
                    const xpElement = document.getElementById('xpTotal');
                    const levelElement = document.getElementById('levelLabel');
                    
                    if (xpElement) {
                        xpElement.textContent = xpData.totalXP || 0;
                    }
                    if (levelElement) {
                        levelElement.textContent = `Lv ${xpData.level || 1}`;
                    }
                }
            } catch (error) {
                console.log('[Dashboard] Enhanced XP system not available yet');
            }
        } else {
            // Fallback to basic display
            const xpElement = document.getElementById('xpTotal');
            const levelElement = document.getElementById('levelLabel');
            
            if (xpElement) {
                xpElement.textContent = '0';
            }
            if (levelElement) {
                levelElement.textContent = 'Lv 1';
            }
        }
    }

    // streak display removed

    loadTabs() {
        this.loadStatsTab();
    }    // Overview tab removed

    // progress tab removed

    loadStatsTab() {
        const container = document.getElementById('detailedStats');
        if (!container) return;
        const stats = this.computeDetailedStats();
        
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-block">
                    <h3>Total Questions</h3>
                    <p>${stats.totalQuestions}</p>
                </div>
                <div class="stat-block">
                    <h3>Correct</h3>
                    <p>${stats.correct}</p>
                </div>
                <div class="stat-block">
                    <h3>Incorrect</h3>
                    <p>${stats.incorrect}</p>
                </div>
                <div class="stat-block">
                    <h3>Unanswered</h3>
                    <p>${stats.unanswered}</p>
                </div>
                <div class="stat-block">
                    <h3>Avg Time/Question</h3>
                    <p>${stats.avgTimePerQuestion}s</p>
                </div>
                <div class="stat-block">
                    <h3>Best Score</h3>
                    <p>${stats.bestScore}%</p>
                </div>
                <div class="stat-block">
                    <h3>Last Score</h3>
                    <p>${stats.lastScore}%</p>
                </div>
                <div class="stat-block">
                    <h3>Accuracy</h3>
                    <p>${stats.accuracy}%</p>
                </div>
            </div>
            ${stats.byChapter.length ? `
            <div class="report-section">
                <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Performance by Chapter</h3>
                <div class="progress-bars">
                    ${stats.byChapter.map(c => `
                        <div class="progress-item">
                            <span class="progress-label">${c.chapter}</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" style="width: ${c.percentage}%"></div>
                            </div>
                            <span class="progress-value">${c.percentage}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>` : '<p style="text-align: center; color: var(--text-secondary); margin-top: 2rem;">Complete a quiz to see detailed statistics!</p>'}
        `;
    }

    // Activity tab removed

    // Removed Recommendations: no longer used

    getRecentActivities() {
        const activities = [];
        const quizHistory = this.quizHistory || JSON.parse(localStorage.getItem('quizHistory') || '[]');
        
        if (quizHistory.length > 0) {
            quizHistory.slice(-5).reverse().forEach(quiz => {
                const date = new Date(quiz.timestamp);
                const timeString = this.formatDate(date);
                activities.push({
                    time: timeString,
                    text: `Completed quiz - Score: ${quiz.score || 0}/${quiz.maxScore || 100} (${quiz.percentage || 0}%)`
                });
            });
        } else {
            activities.push({
                time: 'Now',
                text: 'Start your first quiz to see activity here!'
            });
        }
        return activities;
    }
    
    formatDate(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    }

    getCompletedChapters() {
        try {
            const arr = JSON.parse(localStorage.getItem('completedChapters') || '[]');
            return arr.map(n => parseInt(n, 10)).filter(n => !isNaN(n));
        } catch (e) { return []; }
    }

    getChapterProgress() {
        const completed = this.getCompletedChapters();
        // Define chapter ranges per topic
        const ranges = {
            'Mechanics': [1, 14],
            'Thermodynamics': [21, 24],
            'Electromagnetism': [25, 39],
            'Optics': [40, 45],
            'Modern Physics': [46, 52]
        };
        const progress = [];
        Object.entries(ranges).forEach(([name, [start, end]]) => {
            const total = end - start + 1;
            const count = completed.filter(n => n >= start && n <= end).length;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            progress.push({ name, progress: pct });
        });
        return progress;
    }

    // Achievements removed

    computeDetailedStats() {
        // Prefer cloud history when available
        const cloud = this.stats?.quizHistory || [];
        const local = JSON.parse(localStorage.getItem('quizHistory') || '[]');
        const history = Array.isArray(cloud) && cloud.length ? cloud : local;
        
        if (!history.length) {
            return {
                totalQuestions: 0, correct: 0, incorrect: 0, unanswered: 0,
                avgTimePerQuestion: 0, bestScore: 0, lastScore: 0, accuracy: 0, byChapter: []
            };
        }

        let totalQuestions = 0, correct = 0, incorrect = 0, unanswered = 0, totalTime = 0;
        let bestScore = 0, lastScore = 0;
        const byChapterMap = new Map();

        history.forEach((q, idx) => {
            const tq = q.totalQuestions || q.total || 0;
            const ca = q.correctAnswers || q.correct || 0;
            const perc = typeof q.percentage === 'number' ? q.percentage : 
                        (typeof q.score === 'number' ? q.score : 
                        (tq ? Math.round((ca/tq)*100) : 0));
            const ua = typeof q.unanswered === 'number' ? q.unanswered : Math.max(0, tq - ca - (q.incorrect || 0));
            const ia = typeof q.incorrect === 'number' ? q.incorrect : Math.max(0, tq - ca - ua);
            const ts = q.timeSpent || 0;

            totalQuestions += tq;
            correct += ca;
            incorrect += ia;
            unanswered += ua;
            totalTime += ts;
            bestScore = Math.max(bestScore, Math.round(perc));
            if (idx === 0) lastScore = Math.round(perc); // most recent

            const chapter = q.chapter || 'Unknown Chapter';
            const rec = byChapterMap.get(chapter) || { correct:0, total:0 };
            rec.correct += ca; 
            rec.total += tq;
            byChapterMap.set(chapter, rec);
        });

        const avgTimePerQuestion = totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0;
        const accuracy = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
        
        const byChapter = Array.from(byChapterMap.entries())
            .map(([chapter, v]) => ({
                chapter, 
                percentage: v.total ? Math.round((v.correct / v.total) * 100) : 0
            }))
            .sort((a,b) => a.chapter.localeCompare(b.chapter));

        return { 
            totalQuestions, correct, incorrect, unanswered, 
            avgTimePerQuestion, bestScore, lastScore, accuracy, byChapter 
        };
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

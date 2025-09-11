// Progress Widget - Floating tracker for user learning stats
class ProgressWidget {
    constructor() {
        this.widget = null;
        this.isExpanded = false;
        this.stats = null;
        this.init();
    }

    init() {
        // Wait for auth manager to be ready
        if (typeof authManager !== 'undefined' && authManager.isInitialized) {
            this.setupWidget();
        } else {
            setTimeout(() => this.init(), 100);
        }
    }

    setupWidget() {
        // Listen for auth state changes
        authManager.on('authStateChanged', async (user) => {
            if (user) {
                await this.loadStats();
                this.createWidget();
                this.showWidget();
            } else {
                this.hideWidget();
            }
        });

        // Check current auth state
        if (authManager.getCurrentUser()) {
            this.loadStats().then(() => {
                this.createWidget();
                this.showWidget();
            });
        }
    }

    async loadStats() {
        this.stats = await authManager.getUserStats();
        if (!this.stats) {
            this.stats = {
                totalQuizzes: 0,
                correctAnswers: 0,
                streak: { current: 0, longest: 0 },
                chaptersCompleted: 0,
                totalTime: 0
            };
        }
    }

    createWidget() {
        // Remove existing widget if any
        if (this.widget) {
            this.widget.remove();
        }

        // Create widget HTML
        const widgetHTML = `
            <div class="progress-widget ${this.isExpanded ? 'expanded' : ''}" id="progressWidget">
                <div class="widget-header" onclick="progressWidget.toggleExpand()">
                    <div class="widget-compact">
                        <span class="widget-icon">📊</span>
                        <span class="widget-streak">🔥 ${this.stats.streak?.current || 0}</span>
                        <span class="widget-score">${this.calculateAverageScore()}%</span>
                    </div>
                    <button class="widget-toggle">
                        <svg width="12" height="12" viewBox="0 0 12 12">
                            <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </button>
                </div>
                
                <div class="widget-body">
                    <div class="widget-stats-grid">
                        <div class="widget-stat">
                            <div class="stat-icon">🎯</div>
                            <div class="stat-content">
                                <div class="stat-value">${this.stats.totalQuizzes || 0}</div>
                                <div class="stat-label">Quizzes Taken</div>
                            </div>
                        </div>
                        
                        <div class="widget-stat">
                            <div class="stat-icon">✅</div>
                            <div class="stat-content">
                                <div class="stat-value">${this.stats.correctAnswers || 0}</div>
                                <div class="stat-label">Correct Answers</div>
                            </div>
                        </div>
                        
                        <div class="widget-stat">
                            <div class="stat-icon">📚</div>
                            <div class="stat-content">
                                <div class="stat-value">${this.stats.chaptersCompleted || 0}/52</div>
                                <div class="stat-label">Chapters</div>
                            </div>
                        </div>
                        
                        <div class="widget-stat">
                            <div class="stat-icon">⏱️</div>
                            <div class="stat-content">
                                <div class="stat-value">${this.formatTime(this.stats.totalTime || 0)}</div>
                                <div class="stat-label">Study Time</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="widget-progress-section">
                        <h4>Topic Progress</h4>
                        <div class="widget-progress-bars">
                            ${this.generateProgressBars()}
                        </div>
                    </div>
                    
                    <div class="widget-actions">
                        <a href="/dashboard.html" class="widget-btn primary">
                            <span>📈</span> Full Dashboard
                        </a>
                        <button class="widget-btn secondary" onclick="progressWidget.startQuickQuiz()">
                            <span>⚡</span> Quick Quiz
                        </button>
                    </div>
                    
                    <div class="widget-achievements">
                        <h4>Recent Achievements</h4>
                        <div class="achievement-list">
                            ${this.generateAchievements()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add widget to page
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
        this.widget = document.getElementById('progressWidget');

        // Add styles if not already present
        this.injectStyles();
    }

    generateProgressBars() {
        const topics = [
            { name: 'Mechanics', progress: this.getTopicProgress('mechanics'), color: '#667eea' },
            { name: 'Thermodynamics', progress: this.getTopicProgress('thermodynamics'), color: '#f093fb' },
            { name: 'Electromagnetism', progress: this.getTopicProgress('electromagnetism'), color: '#4facfe' },
            { name: 'Optics', progress: this.getTopicProgress('optics'), color: '#43e97b' },
            { name: 'Modern Physics', progress: this.getTopicProgress('modern'), color: '#ff9a9e' }
        ];

        return topics.map(topic => `
            <div class="topic-progress">
                <div class="topic-header">
                    <span class="topic-name">${topic.name}</span>
                    <span class="topic-percent">${topic.progress}%</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${topic.progress}%; background: ${topic.color};"></div>
                </div>
            </div>
        `).join('');
    }

    generateAchievements() {
        const achievements = [];
        
        if (this.stats.streak?.current >= 3) {
            achievements.push({ icon: '🔥', text: `${this.stats.streak.current} day streak!` });
        }
        if (this.stats.totalQuizzes >= 5) {
            achievements.push({ icon: '🎯', text: 'Quiz Master' });
        }
        if (this.calculateAverageScore() >= 80) {
            achievements.push({ icon: '⭐', text: 'High Achiever' });
        }
        
        if (achievements.length === 0) {
            achievements.push({ icon: '🎮', text: 'Keep learning to unlock!' });
        }

        return achievements.map(a => `
            <div class="achievement-item">
                <span class="achievement-icon">${a.icon}</span>
                <span class="achievement-text">${a.text}</span>
            </div>
        `).join('');
    }

    getTopicProgress(topic) {
        // Calculate based on local storage and stats
        const progress = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.includes(topic) && key.includes('progress')) {
                const value = parseInt(localStorage.getItem(key)) || 0;
                progress[key] = value;
            }
        }
        
        const values = Object.values(progress);
        if (values.length === 0) return 0;
        return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    }

    calculateAverageScore() {
        if (!this.stats || this.stats.totalQuizzes === 0) return 0;
        return Math.round((this.stats.correctAnswers / (this.stats.totalQuizzes * 10)) * 100);
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    toggleExpand() {
        this.isExpanded = !this.isExpanded;
        this.widget.classList.toggle('expanded');
        
        // Save preference
        localStorage.setItem('widgetExpanded', this.isExpanded);
    }

    showWidget() {
        if (this.widget) {
            this.widget.style.display = 'block';
            setTimeout(() => {
                this.widget.classList.add('visible');
            }, 100);
        }
    }

    hideWidget() {
        if (this.widget) {
            this.widget.classList.remove('visible');
            setTimeout(() => {
                this.widget.style.display = 'none';
            }, 300);
        }
    }

    startQuickQuiz() {
        // Navigate to a random quiz
        const topics = ['mechanics', 'thermodynamics', 'electromagnetism', 'optics', 'modern'];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        const randomChapter = Math.floor(Math.random() * 10) + 1;
        window.location.href = `/${randomTopic}/chapter${randomChapter}/mcq.html`;
    }

    async refresh() {
        await this.loadStats();
        if (this.widget) {
            this.createWidget();
        }
    }

    injectStyles() {
        if (document.getElementById('progress-widget-styles')) return;

        const styles = `
            <style id="progress-widget-styles">
                .progress-widget {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    background: var(--card-bg, #ffffff);
                    border: 1px solid var(--border-color, #e2e8f0);
                    border-radius: 16px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                    width: 320px;
                    transition: all 0.3s ease;
                    display: none;
                }

                .progress-widget.visible {
                    display: block;
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .widget-header {
                    padding: 1rem;
                    border-bottom: 1px solid var(--border-color, #e2e8f0);
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .widget-compact {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .widget-icon {
                    font-size: 1.5rem;
                }

                .widget-streak {
                    font-weight: 600;
                    color: #f59e0b;
                }

                .widget-score {
                    font-weight: 600;
                    color: var(--primary-color, #2563eb);
                }

                .widget-toggle {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.25rem;
                    transition: transform 0.3s;
                }

                .progress-widget.expanded .widget-toggle {
                    transform: rotate(180deg);
                }

                .widget-body {
                    display: none;
                    padding: 1rem;
                    max-height: 500px;
                    overflow-y: auto;
                }

                .progress-widget.expanded .widget-body {
                    display: block;
                }

                .widget-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .widget-stat {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    background: var(--bg-tertiary, #f8fafc);
                    border-radius: 12px;
                }

                .stat-icon {
                    font-size: 1.5rem;
                }

                .stat-content {
                    flex: 1;
                }

                .stat-value {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--text-primary, #1e293b);
                }

                .stat-label {
                    font-size: 0.75rem;
                    color: var(--text-secondary, #64748b);
                }

                .widget-progress-section {
                    margin-bottom: 1.5rem;
                }

                .widget-progress-section h4 {
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    color: var(--text-primary, #1e293b);
                }

                .topic-progress {
                    margin-bottom: 1rem;
                }

                .topic-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-size: 0.85rem;
                }

                .topic-name {
                    color: var(--text-secondary, #64748b);
                }

                .topic-percent {
                    font-weight: 600;
                    color: var(--text-primary, #1e293b);
                }

                .progress-track {
                    height: 6px;
                    background: var(--bg-tertiary, #f1f5f9);
                    border-radius: 3px;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    border-radius: 3px;
                    transition: width 0.5s ease;
                }

                .widget-actions {
                    display: flex;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .widget-btn {
                    flex: 1;
                    padding: 0.625rem;
                    border-radius: 10px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    border: none;
                }

                .widget-btn.primary {
                    background: var(--primary-color, #2563eb);
                    color: white;
                }

                .widget-btn.primary:hover {
                    background: var(--primary-dark, #1d4ed8);
                    transform: translateY(-1px);
                }

                .widget-btn.secondary {
                    background: var(--bg-tertiary, #f1f5f9);
                    color: var(--text-primary, #1e293b);
                }

                .widget-btn.secondary:hover {
                    background: var(--bg-secondary, #f8fafc);
                }

                .widget-achievements h4 {
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin-bottom: 0.75rem;
                    color: var(--text-primary, #1e293b);
                }

                .achievement-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .achievement-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem;
                    background: linear-gradient(135deg, #667eea15, #764ba215);
                    border-radius: 8px;
                    font-size: 0.875rem;
                }

                .achievement-icon {
                    font-size: 1.25rem;
                }

                @media (max-width: 768px) {
                    .progress-widget {
                        width: calc(100% - 2rem);
                        right: 1rem;
                        bottom: 1rem;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Create global instance
window.progressWidget = new ProgressWidget();

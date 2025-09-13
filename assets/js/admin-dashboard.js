// Admin Dashboard for Physics Daily
// Handles admin functionality, user management, and system statistics

class AdminDashboard {
    constructor() {
        this.users = [];
        this.stats = null;
        this.currentTab = 'overview';
        this.isAuthorized = false;
    }

    async init() {
        console.log('[Admin] Initializing admin dashboard...');
        
        // Wait for auth manager to be available with longer timeout
        let authManagerAvailable = false;
        let attempts = 0;
        
        while (!authManagerAvailable && attempts < 100) { // Wait up to 10 seconds
            if (typeof authManager !== 'undefined' && authManager.isInitialized) {
                authManagerAvailable = true;
                console.log('[Admin] Auth manager found and initialized');
            } else {
                attempts++;
                console.log(`[Admin] Waiting for auth manager... attempt ${attempts}`);
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        if (!authManagerAvailable) {
            console.warn('[Admin] Auth manager not available after timeout');
            this.showUnauthorized();
            return;
        }

        // Also listen for auth state changes
        if (authManager.on) {
            authManager.on('authStateChanged', (user) => {
                console.log('[Admin] Auth state changed:', user ? user.email : 'no user');
                setTimeout(() => this.checkAuthorization(), 100);
            });
        }

        // Initial check
        this.checkAuthorization();
    }

    checkAuthorization() {
        const user = authManager.getCurrentUser();
        console.log('[Admin] Checking authorization:', {
            user: user ? {
                email: user.email,
                displayName: user.displayName
            } : null,
            isAdmin: user ? authManager.isAdmin() : false,
            adminEmails: authManager.adminEmails
        });

        if (!user) {
            console.log('[Admin] No user found, showing unauthorized');
            this.showUnauthorized();
            return;
        }

        this.isAuthorized = authManager.isAdmin();
        console.log('[Admin] Authorization result:', this.isAuthorized);
        
        if (!this.isAuthorized) {
            this.showUnauthorized();
            return;
        }

        this.showDashboard();
        this.initializeTabs();
        this.loadData();
        
        // Set up refresh functionality
        this.setupRefreshControls();
        
        // Auto-refresh every 30 seconds when on Users tab
        this.startAutoRefresh();
    }

    showUnauthorized() {
        document.getElementById('unauthorized-message').style.display = 'block';
        document.getElementById('admin-dashboard').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('unauthorized-message').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
    }

    initializeTabs() {
        const tabs = document.querySelectorAll('.admin-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });

        this.currentTab = tabName;

        // Load tab-specific data
        if (tabName === 'users') {
            this.loadUsers();
        }
    }

    setupRefreshControls() {
        const refreshBtn = document.getElementById('refresh-users-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                console.log('[Admin] Manual refresh triggered');
                this.refreshAllData();
            });
        }
    }

    startAutoRefresh() {
        // Refresh data every 30 seconds
        setInterval(() => {
            if (this.currentTab === 'users') {
                console.log('[Admin] Auto-refreshing users data');
                this.loadUsers();
            }
            // Also refresh overview stats
            this.loadStats().then(() => this.updateOverview()).catch(console.error);
        }, 30000); // 30 seconds
    }

    async refreshAllData() {
        console.log('[Admin] Refreshing all data...');
        try {
            // Refresh stats
            await this.loadStats();
            this.updateOverview();
            
            // Refresh users if on users tab
            if (this.currentTab === 'users') {
                await this.loadUsers();
            }
            
            // Show success message
            this.showTemporaryMessage('✅ Data refreshed successfully!', 'success');
        } catch (error) {
            console.error('[Admin] Error refreshing data:', error);
            this.showTemporaryMessage('❌ Failed to refresh data', 'error');
        }
    }

    showTemporaryMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `temp-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            border-radius: 4px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    async loadData() {
        try {
            // Load system statistics
            await this.loadStats();
            
            // Load overview data
            this.updateOverview();
        } catch (error) {
            console.error('[Admin] Error loading data:', error);
            this.showError('Failed to load dashboard data: ' + error.message);
        }
    }

    async loadStats() {
        try {
            this.stats = await authManager.getSystemStats();
        } catch (error) {
            console.error('[Admin] Error loading stats:', error);
            throw error;
        }
    }

    async loadUsers() {
        const loadingEl = document.getElementById('users-loading');
        const errorEl = document.getElementById('users-error');
        const contentEl = document.getElementById('users-content');

        try {
            loadingEl.style.display = 'block';
            errorEl.style.display = 'none';
            contentEl.style.display = 'none';

            console.log('[Admin] Loading users...');
            this.users = await authManager.getAllUsers();
            console.log('[Admin] Loaded users:', this.users);
            
            this.renderUsersTable();

            loadingEl.style.display = 'none';
            contentEl.style.display = 'block';
        } catch (error) {
            console.error('[Admin] Error loading users:', error);
            loadingEl.style.display = 'none';
            
            // Show more helpful error message
            let errorMessage = 'Failed to load users: ' + error.message;
            if (error.message.includes('permission') || error.message.includes('insufficient')) {
                errorMessage = `
                    <strong>Firestore Permissions Issue</strong><br>
                    This is normal for development. To fix this:<br>
                    1. Go to <a href="https://console.firebase.google.com" target="_blank">Firebase Console</a><br>
                    2. Go to Firestore Database → Rules<br>
                    3. Temporarily change rules to allow reading:<br>
                    <code>allow read, write: if request.auth != null;</code><br><br>
                    <small>For now, you can see your own data and basic stats.</small>
                `;
            }
            
            errorEl.innerHTML = errorMessage;
            errorEl.style.display = 'block';
        }
    }

    updateOverview() {
        if (!this.stats) return;

        // Update stat cards
        document.getElementById('total-users').textContent = this.stats.totalUsers.toLocaleString();
        document.getElementById('active-today').textContent = this.stats.activeToday.toLocaleString();
        document.getElementById('active-week').textContent = this.stats.activeThisWeek.toLocaleString();
        document.getElementById('total-xp').textContent = this.stats.totalXP.toLocaleString();
        document.getElementById('average-xp').textContent = this.stats.averageXP.toLocaleString();

        // Update top users
        this.renderTopUsers();

        // Update topic popularity
        this.renderTopicPopularity();
    }

    renderTopUsers() {
        const container = document.getElementById('top-users-list');
        if (!this.stats.topUsers.length) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No user data available</p>';
            return;
        }

        const html = this.stats.topUsers.map((user, index) => `
            <div class="topic-item">
                <div>
                    <strong>#${index + 1} ${user.displayName}</strong>
                    <br>
                    <small style="color: var(--text-muted);">${user.email}</small>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 1.2rem; font-weight: 600; color: var(--primary-color);">
                        ${user.xp} XP
                    </div>
                    <div style="font-size: 0.9rem; color: var(--text-muted);">
                        Level ${user.level}
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    renderTopicPopularity() {
        const container = document.getElementById('topic-popularity');
        if (!this.stats.topicPopularity.length) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No topic data available</p>';
            return;
        }

        const maxCount = Math.max(...this.stats.topicPopularity.map(t => t.count));

        const html = this.stats.topicPopularity.map(topic => `
            <div class="topic-item">
                <div>
                    <strong>${this.formatTopicName(topic.topic)}</strong>
                    <small style="color: var(--text-muted); margin-left: 0.5rem;">${topic.count} users</small>
                </div>
                <div class="topic-bar">
                    <div class="topic-bar-fill" style="width: ${(topic.count / maxCount) * 100}%"></div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    formatTopicName(topic) {
        return topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, ' ');
    }

    renderUsersTable() {
        const tbody = document.getElementById('users-table-body');
        
        const html = this.users.map(user => `
            <tr>
                <td>
                    <strong>${user.displayName || user.email?.split('@')[0] || 'Anonymous'}</strong>
                    ${user.name || user.nationality ? 
                        `<br><small style="color: var(--text-muted);">${user.name || ''} ${user.nationality ? '• ' + user.nationality : ''}</small>` 
                        : ''
                    }
                </td>
                <td>${user.email || 'N/A'}</td>
                <td>
                    <strong>${(user.xp?.total || 0).toLocaleString()}</strong>
                </td>
                <td>
                    ${Math.floor((user.xp?.total || 0) / 100) + 1}
                </td>
                <td>
                    ${user.lastLogin ? this.formatDate(user.lastLogin) : 'Never'}
                </td>
                <td>
                    ${user.createdAt ? this.formatDate(user.createdAt) : 'Unknown'}
                </td>
                <td>
                    <div class="user-actions">
                        <button class="action-btn view" onclick="adminDashboard.viewUser('${user.id}')">
                            View
                        </button>
                        <button class="action-btn delete" onclick="adminDashboard.confirmDeleteUser('${user.id}', '${user.displayName || user.email}')">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        tbody.innerHTML = html;
    }

    formatDate(date) {
        if (!date) return 'Unknown';
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    viewUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const content = `
            <div style="line-height: 1.6;">
                <p><strong>Display Name:</strong> ${user.displayName || 'Not set'}</p>
                <p><strong>Email:</strong> ${user.email || 'Not set'}</p>
                <p><strong>Name:</strong> ${user.name || 'Not set'}</p>
                <p><strong>Nationality:</strong> ${user.nationality || 'Not set'}</p>
                <p><strong>User ID:</strong> ${user.id}</p>
                <hr>
                <h3>📊 Statistics</h3>
                <p><strong>Total XP:</strong> ${(user.xp?.total || 0).toLocaleString()}</p>
                <p><strong>Level:</strong> ${Math.floor((user.xp?.total || 0) / 100) + 1}</p>
                <p><strong>Current Streak:</strong> ${user.streak?.current || 0} days</p>
                <p><strong>Longest Streak:</strong> ${user.streak?.longest || 0} days</p>
                <p><strong>Total Quizzes:</strong> ${user.stats?.totalQuizzes || 0}</p>
                <p><strong>Correct Answers:</strong> ${user.stats?.correctAnswers || 0}</p>
                <p><strong>Chapters Completed:</strong> ${user.stats?.chaptersCompleted || 0}</p>
                <p><strong>Topics Studied:</strong> ${user.stats?.topicsStudied?.length || 0}</p>
                <hr>
                <h3>📅 Activity</h3>
                <p><strong>Joined:</strong> ${user.createdAt ? this.formatDate(user.createdAt) : 'Unknown'}</p>
                <p><strong>Last Login:</strong> ${user.lastLogin ? this.formatDate(user.lastLogin) : 'Never'}</p>
                <p><strong>Last Activity:</strong> ${user.streak?.lastActivityDate ? this.formatDate(new Date(user.streak.lastActivityDate)) : 'Unknown'}</p>
                <hr>
                <h3>⚙️ Preferences</h3>
                <p><strong>Theme:</strong> ${user.preferences?.theme || 'Default'}</p>
                <p><strong>Email Notifications:</strong> ${user.preferences?.emailNotifications ? 'Enabled' : 'Disabled'}</p>
                <p><strong>Daily Reminders:</strong> ${user.preferences?.dailyReminders ? 'Enabled' : 'Disabled'}</p>
            </div>
        `;

        document.getElementById('user-detail-content').innerHTML = content;
        document.getElementById('user-detail-modal').style.display = 'flex';
    }

    confirmDeleteUser(userId, userName) {
        if (confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            this.deleteUser(userId);
        }
    }

    async deleteUser(userId) {
        try {
            await authManager.deleteUser(userId);
            alert('User deleted successfully');
            
            // Remove from local array
            this.users = this.users.filter(u => u.id !== userId);
            this.renderUsersTable();
            
            // Reload stats
            await this.loadStats();
            this.updateOverview();
        } catch (error) {
            console.error('[Admin] Error deleting user:', error);
            alert('Failed to delete user: ' + error.message);
        }
    }

    showError(message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'error';
        errorEl.textContent = message;
        document.querySelector('.admin-container').insertBefore(errorEl, document.querySelector('.admin-header'));
        
        setTimeout(() => errorEl.remove(), 5000);
    }
}

// Global functions for modal and interactions
function closeUserDetailModal() {
    document.getElementById('user-detail-modal').style.display = 'none';
}

// Initialize admin dashboard
window.adminDashboard = new AdminDashboard();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        adminDashboard.init();
    });
} else {
    adminDashboard.init();
}
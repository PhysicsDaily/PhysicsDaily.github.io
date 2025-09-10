/**
 * Enhanced Progress Tracking with Streaks and Bookmarking
 */

class ProgressTracker {
    constructor() {
        this.initializeTracking();
        this.updateStreakDisplay();
        this.initBookmarks();
    }
    
    initializeTracking() {
        // Track daily activity
        const today = new Date().toDateString();
        const lastVisit = localStorage.getItem('lastVisitDate');
        const currentStreak = parseInt(localStorage.getItem('currentStreak') || '0');
        
        if (lastVisit !== today) {
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            
            if (lastVisit === yesterday) {
                // Continuing streak
                localStorage.setItem('currentStreak', currentStreak + 1);
            } else if (lastVisit) {
                // Streak broken
                localStorage.setItem('currentStreak', '1');
            } else {
                // First visit
                localStorage.setItem('currentStreak', '1');
            }
            
            localStorage.setItem('lastVisitDate', today);
        }
        
        // Track chapter completion
        document.querySelectorAll('.mark-complete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const chapterId = e.target.dataset.chapter;
                this.markChapterComplete(chapterId);
            });
        });
    }
    
    markChapterComplete(chapterId) {
        const completedChapters = JSON.parse(localStorage.getItem('completedChapters') || '[]');
        
        if (!completedChapters.includes(chapterId)) {
            completedChapters.push(chapterId);
            localStorage.setItem('completedChapters', JSON.stringify(completedChapters));
            
            // Update UI
            const btn = document.querySelector(`[data-chapter="${chapterId}"]`);
            if (btn) {
                btn.textContent = '✓ Completed';
                btn.disabled = true;
                btn.classList.add('completed');
            }
            
            // Show achievement notification
            this.showAchievement('Chapter Complete!', `You've completed Chapter ${chapterId}`);
        }
    }
    
    updateStreakDisplay() {
        const streakElement = document.getElementById('streak-display');
        if (streakElement) {
            const currentStreak = localStorage.getItem('currentStreak') || '0';
            streakElement.innerHTML = `
                <div class="streak-container">
                    <span class="streak-icon">🔥</span>
                    <span class="streak-number">${currentStreak}</span>
                    <span class="streak-label">day streak</span>
                </div>
            `;
        }
    }
    
    initBookmarks() {
        // Add bookmark buttons to sections
        document.querySelectorAll('.bookmarkable').forEach(section => {
            const bookmarkBtn = document.createElement('button');
            bookmarkBtn.className = 'bookmark-btn';
            bookmarkBtn.innerHTML = '🔖';
            bookmarkBtn.title = 'Bookmark this section';
            
            bookmarkBtn.addEventListener('click', () => {
                this.toggleBookmark(section);
            });
            
            section.appendChild(bookmarkBtn);
            
            // Check if already bookmarked
            const sectionId = section.id || section.dataset.sectionId;
            if (this.isBookmarked(sectionId)) {
                bookmarkBtn.classList.add('bookmarked');
            }
        });
        
        // Add bookmarks menu
        this.createBookmarksMenu();
    }
    
    toggleBookmark(section) {
        const sectionId = section.id || section.dataset.sectionId;
        const title = section.querySelector('h1, h2, h3')?.textContent || 'Untitled Section';
        const url = window.location.href.split('#')[0] + '#' + sectionId;
        
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        const existingIndex = bookmarks.findIndex(b => b.id === sectionId);
        
        if (existingIndex > -1) {
            // Remove bookmark
            bookmarks.splice(existingIndex, 1);
            section.querySelector('.bookmark-btn').classList.remove('bookmarked');
        } else {
            // Add bookmark
            bookmarks.push({
                id: sectionId,
                title: title,
                url: url,
                timestamp: Date.now()
            });
            section.querySelector('.bookmark-btn').classList.add('bookmarked');
        }
        
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        this.updateBookmarksMenu();
    }
    
    isBookmarked(sectionId) {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        return bookmarks.some(b => b.id === sectionId);
    }
    
    createBookmarksMenu() {
        const menu = document.createElement('div');
        menu.id = 'bookmarks-menu';
        menu.className = 'bookmarks-menu';
        menu.innerHTML = `
            <button class="bookmarks-toggle" title="View Bookmarks">
                <span class="bookmark-icon">📚</span>
                <span class="bookmark-count">0</span>
            </button>
            <div class="bookmarks-dropdown">
                <h3>Your Bookmarks</h3>
                <div class="bookmarks-list"></div>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        const toggle = menu.querySelector('.bookmarks-toggle');
        const dropdown = menu.querySelector('.bookmarks-dropdown');
        
        toggle.addEventListener('click', () => {
            dropdown.classList.toggle('show');
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
        
        this.updateBookmarksMenu();
    }
    
    updateBookmarksMenu() {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        const list = document.querySelector('.bookmarks-list');
        const count = document.querySelector('.bookmark-count');
        
        count.textContent = bookmarks.length;
        
        if (bookmarks.length === 0) {
            list.innerHTML = '<p class="no-bookmarks">No bookmarks yet</p>';
        } else {
            list.innerHTML = bookmarks.map(bookmark => `
                <div class="bookmark-item">
                    <a href="${bookmark.url}">${bookmark.title}</a>
                    <button class="remove-bookmark" data-id="${bookmark.id}">×</button>
                </div>
            `).join('');
            
            // Add remove handlers
            list.querySelectorAll('.remove-bookmark').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const id = e.target.dataset.id;
                    this.removeBookmark(id);
                });
            });
        }
    }
    
    removeBookmark(id) {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        const filtered = bookmarks.filter(b => b.id !== id);
        localStorage.setItem('bookmarks', JSON.stringify(filtered));
        
        // Update UI
        const section = document.getElementById(id) || document.querySelector(`[data-section-id="${id}"]`);
        if (section) {
            const btn = section.querySelector('.bookmark-btn');
            if (btn) btn.classList.remove('bookmarked');
        }
        
        this.updateBookmarksMenu();
    }
    
    showAchievement(title, message) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-text">
                    <h4>${title}</h4>
                    <p>${message}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    getProgressStats() {
        const completedChapters = JSON.parse(localStorage.getItem('completedChapters') || '[]');
        const currentStreak = parseInt(localStorage.getItem('currentStreak') || '0');
        const totalChapters = 52; // Total chapters in the course
        
        return {
            completed: completedChapters.length,
            total: totalChapters,
            percentage: Math.round((completedChapters.length / totalChapters) * 100),
            streak: currentStreak
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.progressTracker = new ProgressTracker();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressTracker;
}

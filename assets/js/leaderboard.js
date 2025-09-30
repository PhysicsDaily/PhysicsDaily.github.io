// Leaderboard Page Logic: Daily / Weekly / Monthly XP rankings
(function(){
  class LeaderboardPage {
    constructor() {
      this.currentRange = 'daily';
      this.isLoading = false;
      this.rankings = { daily: [], weekly: [], monthly: [] };
      this.user = null;
      this.db = null;
      this.selfXp = { daily: 0, weekly: 0, monthly: 0 };
      this.cacheTTLms = 180000; // 3 minutes
      this.debouncedReloadId = null;
      this.autoRefreshInterval = null;
      this.lastFetchTime = {};
      this.isRefreshing = false;
      this.init();
    }

    async init() {
      // Wire tab buttons
      const dailyBtn = document.getElementById('tab-daily');
      const weeklyBtn = document.getElementById('tab-weekly');
      const monthlyBtn = document.getElementById('tab-monthly');
      dailyBtn?.addEventListener('click', () => this.switchRange('daily'));
      weeklyBtn?.addEventListener('click', () => this.switchRange('weekly'));
      monthlyBtn?.addEventListener('click', () => this.switchRange('monthly'));

      // Wire manual refresh button
      const refreshBtn = document.getElementById('lb-refresh');
      refreshBtn?.addEventListener('click', () => this.manualRefresh());

      // Ensure Firebase/Auth ready
      await this.ensureFirebaseReady();

      // Listen for sign-in changes
      if (window.authManager) {
        authManager.on('authStateChanged', (user) => {
          this.user = user;
          this.highlightSelf();
        });
        this.user = authManager.getCurrentUser();
      }

      // Initial load
      await this.loadAndRenderAll();

      // Smart auto-refresh: faster when active, slower when idle
      this.startAutoRefresh();

      // Pause refresh when tab is hidden to save resources
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stopAutoRefresh();
        } else {
          this.startAutoRefresh();
          // Refresh immediately when coming back if data is stale
          const lastFetch = this.lastFetchTime[this.currentRange] || 0;
          if (Date.now() - lastFetch > this.cacheTTLms) {
            this.loadAndRender(this.currentRange, false);
          }
        }
      });

      // Optimistic UI update when XP is awarded (no extra reads)
      window.addEventListener('xp:awarded', (e) => this.onXpAwarded(e?.detail?.amount || 0));
    }

    async ensureFirebaseReady() {
      // global.js will lazy-load Firebase + auth scripts; wait until available
      const wait = (pred, timeout = 15000) => new Promise((resolve, reject) => {
        const start = Date.now();
        const id = setInterval(() => {
          if (pred()) { clearInterval(id); resolve(true); }
          if (Date.now() - start > timeout) { clearInterval(id); reject(new Error('Timeout waiting for Firebase')); }
        }, 100);
      });

      // Wait for firebase SDK
      try {
        await wait(() => typeof firebase !== 'undefined' && !!firebase.firestore);
      } catch (e) { console.error('[Leaderboard] Firebase SDK not available', e); }

      // Initialize auth
      if (window.authManager && !authManager.isInitialized) {
        try { await authManager.init(); } catch {}
      }

      this.db = (window.authManager && authManager.db) || (firebase && firebase.firestore && firebase.firestore());
    }

    getRangeStart(range) {
      const now = new Date();
      switch (range) {
        case 'daily':
          // Start of today (midnight)
          return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        case 'weekly':
          // Week resets on Mondays AND at start of each month
          // This ensures weeks are always within a single month
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
          const day = now.getDay();
          const diff = day === 0 ? -6 : 1 - day; // Days back to Monday
          const mondayStart = new Date(now);
          mondayStart.setDate(now.getDate() + diff);
          mondayStart.setHours(0, 0, 0, 0);
          
          // Use the more recent date: either Monday or start of month
          return mondayStart > monthStart ? mondayStart : monthStart;
        case 'monthly':
          // Start of current month
          return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        default:
          return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      }
    }

    getRangeStartMs(range) {
      return this.getRangeStart(range).getTime();
    }

    startAutoRefresh() {
      this.stopAutoRefresh();
      // Refresh every 2 minutes when viewing leaderboard
      this.autoRefreshInterval = setInterval(() => {
        if (!this.isRefreshing && !document.hidden) {
          this.loadAndRender(this.currentRange, true);
        }
      }, 120000); // 2 minutes
    }

    stopAutoRefresh() {
      if (this.autoRefreshInterval) {
        clearInterval(this.autoRefreshInterval);
        this.autoRefreshInterval = null;
      }
    }

    async loadAndRenderAll() {
      await this.loadAndRender('daily');
      await this.loadAndRender('weekly');
      await this.loadAndRender('monthly');
      this.switchRange('daily');
    }

    async loadAndRender(range, silent = false) {
      try {
        if (!this.db) await this.ensureFirebaseReady();
        if (!this.db) return;

        this.isLoading = true;
        this.isRefreshing = true;
        if (!silent) this.setLoading(true);

        // Try cache first to avoid reads
        const cached = this.readCache(range);
        if (cached && !silent) {
          this.rankings[range] = cached.data;
          this.render(range);
          this.isLoading = false;
          if (!silent) this.setLoading(false);
        }

        // Prefer clientTs for instant visibility of new logs, fallback to server timestamp
        const startMs = this.getRangeStartMs(range);
        let snap = null;
        try {
          const q1 = this.db.collection('xp_logs')
            .where('clientTs', '>=', startMs)
            .orderBy('clientTs', 'desc')
            .limit(2000);
          const snap1 = await q1.get();
          // Also fetch server timestamp-based results to include older logs without clientTs
          const startDate = new Date(startMs);
          const startTs = firebase.firestore.Timestamp.fromDate(startDate);
          const q2 = this.db.collection('xp_logs')
            .where('timestamp', '>=', startTs)
            .orderBy('timestamp', 'desc')
            .limit(2000);
          const snap2 = await q2.get();
          // Merge docs: use a map to dedupe by id
          const seen = new Set();
          const docs = [];
          snap1.forEach(d => { if (!seen.has(d.id)) { seen.add(d.id); docs.push(d); } });
          snap2.forEach(d => { if (!seen.has(d.id)) { seen.add(d.id); docs.push(d); } });
          snap = { forEach: (cb) => docs.forEach(cb) };
        } catch (e1) {
          // Fallback to server timestamp
          try {
            const startDate = new Date(startMs);
            const startTs = firebase.firestore.Timestamp.fromDate(startDate);
            const q2 = this.db.collection('xp_logs')
              .where('timestamp', '>=', startTs)
              .orderBy('timestamp', 'desc')
              .limit(2000);
            snap = await q2.get();
          } catch (e2) {
            console.error('[Leaderboard] query failed', e1, e2);
            this.setError('Could not load leaderboard (permissions or indexing). See console.');
            this.isLoading = false;
            this.isRefreshing = false;
            this.setLoading(false);
            return;
          }
        }
        
        this.lastFetchTime[range] = Date.now();
        const byUser = new Map();

        snap.forEach(doc => {
          const d = doc.data() || {};
          const uid = d.uid || 'unknown';
          if (uid === 'unknown') return; // Skip invalid entries
          
          const xp = Number(d.xp) || 0;
          if (xp <= 0) return; // Skip zero XP logs
          
          if (!byUser.has(uid)) {
            byUser.set(uid, {
              uid,
              displayName: d.displayName || 'Anonymous',
              country: d.country || null,
              xp: 0
            });
          }
          byUser.get(uid).xp += xp;
        });

        console.log(`[Leaderboard] ${range}: Aggregated ${byUser.size} users from ${snap.size || 0} logs`);

        // Build ranking array (avoid per-user Firestore lookups to save reads)
        const results = Array.from(byUser.values());

        // If no activity in this period, fallback to all-time from users.xp.total
        if (!results.length) {
          try {
            const usersSnap = await this.db.collection('users')
              .orderBy('xp.total', 'desc')
              .limit(100)
              .get();
            usersSnap.forEach(doc => {
              const u = doc.data() || {};
              const total = (u.xp && typeof u.xp.total === 'number') ? u.xp.total : 0;
              if (total > 0) {
                results.push({
                  uid: doc.id,
                  displayName: (u.profile?.nickname) || u.displayName || 'Anonymous',
                  country: (u.profile?.country) || u.preferences?.country || null,
                  xp: total
                });
              }
            });
            // Mark subtitle to reflect fallback
            const subtitle = document.getElementById('leaderboardSubtitle');
            if (subtitle) subtitle.textContent = (range === 'daily' ? 'No daily activity – showing all-time' : range === 'weekly' ? 'No weekly activity – showing all-time' : 'No monthly activity – showing all-time');
          } catch (e) {
            console.warn('[Leaderboard] all-time fallback failed', e);
          }
        }

        // Sort and keep top 100
        results.sort((a, b) => b.xp - a.xp);
        const top = results.slice(0, 100).map((r, idx) => ({ ...r, rank: idx + 1 }));
        this.rankings[range] = top;

        // Cache latest
        this.writeCache(range, top);

        // If rendering current tab
        if (this.currentRange === range || !silent) {
          this.render(range);
        }
        this.isLoading = false;
        this.isRefreshing = false;
        if (!silent) this.setLoading(false);
        this.clearError();
      } catch (e) {
        console.error('[Leaderboard] load failed', e);
        this.isLoading = false;
        this.isRefreshing = false;
        this.setLoading(false);
        this.setError('Failed to load leaderboard. Check your Firestore rules for xp_logs.');
      }
    }

    switchRange(range) {
      if (this.currentRange === range) return;
      this.currentRange = range;
      document.querySelectorAll('.lb-tab').forEach(b => b.classList.remove('active'));
      document.getElementById(`tab-${range}`)?.classList.add('active');
      this.render(range);
    }

    async manualRefresh() {
      const btn = document.getElementById('lb-refresh');
      if (!btn || this.isRefreshing) return;
      
      btn.classList.add('refreshing');
      btn.disabled = true;
      
      // Clear cache to force fresh data
      delete this.cache[this.currentRange];
      await this.loadAndRender(this.currentRange, false);
      
      setTimeout(() => {
        btn.classList.remove('refreshing');
        btn.disabled = false;
      }, 1000);
    }

    setLoading(isLoading) {
      const loader = document.getElementById('leaderboardLoading');
      if (loader) loader.style.display = isLoading ? 'flex' : 'none';
    }

    setError(msg) {
      const el = document.getElementById('leaderboardError');
      if (el) { el.style.display = 'block'; el.textContent = msg; }
    }

    clearError() {
      const el = document.getElementById('leaderboardError');
      if (el) { el.style.display = 'none'; }
    }

    isoToFlag(iso) {
      if (!iso || typeof iso !== 'string' || iso.length !== 2) return '🌐';
      try {
        const codePoints = iso.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
      } catch (e) {
        console.warn('[Leaderboard] Flag conversion failed for:', iso, e);
        return '🌐';
      }
    }

    highlightSelf() {
      const uid = this.user?.uid;
      const rows = document.querySelectorAll('#leaderboardTableBody tr');
      rows.forEach(row => {
        const rowUid = row.getAttribute('data-uid');
        if (uid && rowUid === uid) row.classList.add('me'); else row.classList.remove('me');
      });
    }

    render(range) {
      const data = this.rankings[range] || [];
      const tbody = document.getElementById('leaderboardTableBody');
      const empty = document.getElementById('leaderboardEmpty');
      const subtitle = document.getElementById('leaderboardSubtitle');
      if (subtitle) {
        if (range === 'daily') {
          subtitle.textContent = 'Today';
        } else if (range === 'weekly') {
          const start = this.getRangeStart('weekly');
          const isMonthStart = start.getDate() === 1;
          subtitle.textContent = isMonthStart ? 'This week (resets at month start)' : 'This week';
        } else {
          subtitle.textContent = 'This month';
        }
      }
      if (!tbody) return;

      if (!data.length) {
        tbody.innerHTML = '';
        if (empty) empty.style.display = 'block';
      } else {
        if (empty) empty.style.display = 'none';
        tbody.innerHTML = data.map(r => `
          <tr data-uid="${r.uid}">
            <td class="rank">
              <div class="rank-medal ${r.rank === 1 ? 'rank-1' : r.rank === 2 ? 'rank-2' : r.rank === 3 ? 'rank-3' : 'rank-other'}">
                ${r.rank}
              </div>
            </td>
            <td class="name">
              <div class="name-cell">
                <span class="flag">${this.isoToFlag(r.country || '')}</span>
                <span class="text">${this.escapeHtml(r.displayName || 'Anonymous')}</span>
              </div>
            </td>
            <td class="country">${r.country || 'N/A'}</td>
            <td class="xp">${Number(r.xp) || 0}</td>
          </tr>
        `).join('');
      }

      this.highlightSelf();
      this.updateSelfAndRankUI(range);
    }

    escapeHtml(str) {
      return String(str).replace(/[&<>"]+/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[s]));
    }

    // --- Optimistic update handler ---
    onXpAwarded(amount) {
      if (!amount || !this.user) return;
      ['daily', 'weekly', 'monthly'].forEach(range => {
        // Increment self XP cache
        this.selfXp[range] = (this.selfXp[range] || 0) + amount;
        // Try to find self in rankings and update, else create entry with minimal fields
        const list = this.rankings[range] || [];
        const idx = list.findIndex(r => r.uid === this.user.uid);
        if (idx >= 0) {
          list[idx].xp += amount;
        } else {
          list.push({ uid: this.user.uid, displayName: this.user.displayName || this.user.email, country: null, xp: amount, rank: list.length + 1 });
        }
        // Resort and re-rank
        list.sort((a,b) => b.xp - a.xp);
        list.forEach((r,i) => r.rank = i+1);
        this.rankings[range] = list.slice(0, 100);
        // Cache updated list to keep UI fast
        this.writeCache(range, this.rankings[range]);
      });
      // Re-render current tab immediately
      this.render(this.currentRange);
      // Debounced network refresh after 20s to reconcile with server
      clearTimeout(this.debouncedReloadId);
      this.debouncedReloadId = setTimeout(() => this.loadAndRender(this.currentRange, true), 20000);
    }

    updateSelfAndRankUI(range) {
      const uid = this.user?.uid;
      const list = this.rankings[range] || [];
      const me = uid ? list.find(r => r.uid === uid) : null;
      const selfXpEl = document.getElementById('lbSelfXp');
      const rankEl = document.getElementById('lbRankValue');
      const pointer = document.getElementById('lbRankPointer');
      const resetEl = document.getElementById('lbResetInfo');

      const selfXp = me ? me.xp : 0;
      if (selfXpEl) selfXpEl.textContent = String(selfXp);
      if (rankEl) rankEl.textContent = me ? `Rank: ${me.rank}` : 'Rank: —';

      // Rank bar pointer position (0% worst, 100% best)
      const count = list.length || 1;
      const rank = me ? me.rank : count;
      const pos = count > 1 ? ((count - rank) / (count - 1)) * 100 : 0;
      if (pointer) pointer.style.left = `${Math.max(0, Math.min(100, pos))}%`;

      // Reset timer info with proper calculations
      if (resetEl) {
        const now = new Date();
        let resetTime;
        let resetLabel = '';
        
        if (range === 'daily') {
          // Next midnight
          resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
          resetLabel = 'Daily reset';
        } else if (range === 'weekly') {
          // Next Monday OR next month (whichever comes first)
          const d = now.getDay();
          const daysToAdd = d === 0 ? 1 : 8 - d;
          const nextMonday = new Date(now);
          nextMonday.setDate(now.getDate() + daysToAdd);
          nextMonday.setHours(0,0,0,0);
          
          const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
          
          // Use whichever comes first
          resetTime = nextMonday < nextMonth ? nextMonday : nextMonth;
          resetLabel = nextMonday < nextMonth ? 'Weekly reset (Monday)' : 'Weekly reset (new month)';
        } else {
          // Next month
          resetTime = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
          resetLabel = 'Monthly reset';
        }
        
        const diff = resetTime - now;
        const days = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        
        if (days > 0) {
          resetEl.textContent = `${resetLabel} in ${days}d ${h}h`;
        } else {
          resetEl.textContent = `${resetLabel} in ${h}h ${m}m`;
        }
      }
    }

    // --- Simple cache helpers ---
    readCache(range) {
      try {
        const raw = localStorage.getItem(`pd:lb:cache:${range}`);
        if (!raw) return null;
        const obj = JSON.parse(raw);
        if (!obj || !obj.ts || !obj.data) return null;
        if (Date.now() - obj.ts > this.cacheTTLms) return null;
        return obj;
      } catch { return null; }
    }

    writeCache(range, data) {
      try {
        localStorage.setItem(`pd:lb:cache:${range}` , JSON.stringify({ ts: Date.now(), data }));
      } catch {}
    }
  }

  function init() {
    if (document.getElementById('leaderboardApp')) {
      window.leaderboardPage = new LeaderboardPage();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();

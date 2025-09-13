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
      this.cacheTTLms = 180000; // 3 minutes to keep reads low
      this.debouncedReloadId = null;
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

      // Periodic refresh (throttled to 5 minutes)
      setInterval(() => this.loadAndRender(this.currentRange, true), 300_000);

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
      const now = Date.now();
      switch (range) {
        case 'daily':
          return new Date(now - 24 * 60 * 60 * 1000);
        case 'weekly':
          return new Date(now - 7 * 24 * 60 * 60 * 1000);
        case 'monthly':
          {
            const d = new Date();
            return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0); // start of current month
          }
        default:
          return new Date(now - 24 * 60 * 60 * 1000);
      }
    }

    getRangeStartMs(range) {
      const now = Date.now();
      switch (range) {
        case 'daily':
          return now - 24 * 60 * 60 * 1000;
        case 'weekly':
          return now - 7 * 24 * 60 * 60 * 1000;
        case 'monthly':
          return this.getRangeStart('monthly').getTime();
        default:
          return now - 24 * 60 * 60 * 1000;
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
        if (!silent) this.setLoading(true);

        // Try cache first to avoid reads
        const cached = this.readCache(range);
        if (cached) {
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
            this.setLoading(false);
            return;
          }
        }
        const byUser = new Map();

        snap.forEach(doc => {
          const d = doc.data() || {};
          const uid = d.uid || 'unknown';
          const xp = Number(d.xp) || 0;
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
        if (!silent) this.setLoading(false);
        this.clearError();
      } catch (e) {
        console.error('[Leaderboard] load failed', e);
        this.isLoading = false;
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
      if (!iso) return '';
      try {
        return iso.replace(/./g, c => String.fromCodePoint(127397 + c.toUpperCase().charCodeAt()));
      } catch { return iso; }
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
        subtitle.textContent = range === 'daily' ? 'Last 24 hours' : range === 'weekly' ? 'Last 7 days' : 'This month to date';
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
            <td class="country">${r.country || ''}</td>
            <td class="xp">${r.xp}</td>
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

      // Monthly reset info
      if (resetEl) {
        if (range === 'monthly') {
          const now = new Date();
          const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          const days = Math.max(0, Math.ceil((next - now) / (1000*60*60*24)));
          resetEl.textContent = `Monthly leaderboard resets in ${days} day${days===1?'':'s'}`;
        } else if (range === 'weekly') {
          // Optional friendly info for weekly
          resetEl.textContent = 'Weekly: last 7 days';
        } else {
          resetEl.textContent = 'Daily: last 24 hours';
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

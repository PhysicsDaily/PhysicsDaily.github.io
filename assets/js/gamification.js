(function(){
  class Gamification {
    constructor() {
      this.state = this.loadState();
      this.listeners = [];
      this.persistScheduled = null;
    }

    loadState() {
      try {
        const raw = localStorage.getItem('pd:gamification');
        if (raw) return JSON.parse(raw);
      } catch {}
      return { xp: 0, level: 1, coins: 0, badges: [], lastAwardAt: 0 };
    }

    saveState() {
      try {
        localStorage.setItem('pd:gamification', JSON.stringify(this.state));
      } catch {}
    }

    schedulePersist() {
      clearTimeout(this.persistScheduled);
      this.persistScheduled = setTimeout(() => this.saveState(), 300);
    }

    onChange(cb){ this.listeners.push(cb); }
    emit(){ this.listeners.forEach(cb => cb(this.state)); }

    getLevelForXp(xp){
      // Simple curve: level up every 250 XP initially, +50 XP per level
      let lvl = 1, need = 250, remaining = xp;
      while (remaining >= need) { remaining -= need; lvl++; need += 50; }
      return { level: lvl, nextLevelXp: need, intoLevelXp: remaining };
    }

    addXp(amount, reason=''){ 
      this.state.xp += Math.max(0, Math.floor(amount));
      const { level } = this.getLevelForXp(this.state.xp);
      if (level > this.state.level) {
        this.state.level = level;
        this.addBadge('level-up-'+level, `Level ${level} reached!`);
        this.toast(`Level up! You are now level ${level}.`);
      }
      this.state.lastAwardAt = Date.now();
      this.schedulePersist();
      this.emit();
    }

    addCoins(amount){
      this.state.coins += Math.max(0, Math.floor(amount));
      this.schedulePersist();
      this.emit();
    }

    addBadge(id, text){
      if (!this.state.badges.find(b => b.id === id)) {
        this.state.badges.unshift({ id, text, at: Date.now() });
        this.toast(text, '🏅');
        // keep latest 20
        this.state.badges = this.state.badges.slice(0, 20);
        this.schedulePersist();
        this.emit();
      }
    }

    awardForQuiz({ totalQuestions, correct, incorrect, unanswered, percentage, timeSpent }){
      const baseXp = correct * 10; // 10 XP per correct
      const speedBonus = Math.max(0, Math.round((totalQuestions * 60 - timeSpent) / 30)); // small bonus
      const scoreBonus = Math.round(percentage); // up to +100
      const xp = baseXp + Math.floor(scoreBonus/5) + Math.floor(speedBonus/2);
      this.addXp(xp, 'quiz');
      this.addCoins(correct); // 1 coin per correct
      if (percentage >= 90) this.addBadge('ace-'+Date.now(), 'Quiz Ace: 90%+');
      if (correct === totalQuestions) this.addBadge('perfect-'+Date.now(), 'Perfect Score!');

      // Streak-based bonus via authManager if available
      if (window.authManager && authManager.isSignedIn()) {
        // No-op here; streaks are already updated in authManager.saveQuizResult()
      }
    }

    toast(message, icon='✨'){
      const el = document.createElement('div');
      el.className = 'gm-toast';
      el.innerHTML = `<span class="gm-icon">${icon}</span><span>${message}</span>`;
      Object.assign(el.style, {
        position: 'fixed', top: '20px', right: '20px',
        background: 'var(--card-bg, #111827)', color: 'var(--text-primary, #fff)',
        border: '1px solid var(--border-color, #334155)', padding: '10px 14px',
        borderRadius: '10px', display: 'flex', gap: '8px', alignItems: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,.2)', zIndex: 10010, opacity: 0,
        transition: 'opacity .25s ease, transform .25s ease', transform: 'translateY(-10px)'
      });
      document.body.appendChild(el);
      requestAnimationFrame(() => { el.style.opacity = 1; el.style.transform = 'translateY(0)'; });
      setTimeout(() => { el.style.opacity = 0; el.style.transform = 'translateY(-10px)'; setTimeout(() => el.remove(), 250); }, 3000);
    }

    // For widgets to consume
    getState(){ return { ...this.state, progress: this.getLevelForXp(this.state.xp) }; }
  }

  window.gamification = new Gamification();
})();

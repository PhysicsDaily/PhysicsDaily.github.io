/**
 * Active Learning Components
 * Provides concept checks, reveal solutions, and interactive learning elements
 */

class ActiveLearning {
    constructor() {
        this.initConceptChecks();
        this.initRevealSolutions();
        this.initTabComponents();
    }
    
    // Concept Check Components
    initConceptChecks() {
        document.querySelectorAll('.concept-check').forEach(check => {
            const questionData = JSON.parse(check.dataset.question || '{}');
            this.renderConceptCheck(check, questionData);
        });
    }
    
    renderConceptCheck(container, data) {
        const { question, options, correct, explanation } = data;
        
        const checkHtml = `
            <div class="concept-check-box">
                <div class="concept-check-header">
                    <span class="concept-check-icon">🤔</span>
                    <span class="concept-check-title">Quick Check</span>
                </div>
                <div class="concept-check-question">${question}</div>
                <div class="concept-check-options">
                    ${options.map((opt, i) => `
                        <label class="concept-option">
                            <input type="radio" name="concept-${container.id}" value="${i}">
                            <span>${opt}</span>
                        </label>
                    `).join('')}
                </div>
                <button class="check-answer-btn">Check Answer</button>
                <div class="concept-feedback" style="display: none;">
                    <div class="feedback-content"></div>
                    <div class="explanation">${explanation}</div>
                </div>
            </div>
        `;
        
        container.innerHTML = checkHtml;
        
        // Add event listener
        const checkBtn = container.querySelector('.check-answer-btn');
        checkBtn.addEventListener('click', () => {
            const selected = container.querySelector('input[type="radio"]:checked');
            const feedback = container.querySelector('.concept-feedback');
            const feedbackContent = container.querySelector('.feedback-content');
            
            if (!selected) {
                alert('Please select an answer');
                return;
            }
            
            const isCorrect = parseInt(selected.value) === correct;
            feedback.style.display = 'block';
            feedbackContent.innerHTML = isCorrect 
                ? '<span class="correct">✓ Correct!</span>'
                : '<span class="incorrect">✗ Not quite right.</span>';
            feedbackContent.className = isCorrect ? 'feedback-content correct' : 'feedback-content incorrect';
            
            // Save to localStorage
            const checkId = container.id || 'check-' + Date.now();
            localStorage.setItem(`concept-check-${checkId}`, JSON.stringify({
                answered: true,
                correct: isCorrect,
                timestamp: Date.now()
            }));
        });
    }
    
    // Reveal Solution Components
    initRevealSolutions() {
        document.querySelectorAll('.reveal-solution').forEach(container => {
            const solution = container.querySelector('.solution-content');
            const btn = container.querySelector('.reveal-btn') || this.createRevealButton();
            
            if (!container.querySelector('.reveal-btn')) {
                container.insertBefore(btn, solution);
            }
            
            btn.addEventListener('click', () => {
                const isVisible = solution.style.display === 'block';
                solution.style.display = isVisible ? 'none' : 'block';
                btn.textContent = isVisible ? 'Show Solution' : 'Hide Solution';
                
                // Track interaction
                const problemId = container.dataset.problemId || 'problem-' + Date.now();
                localStorage.setItem(`solution-viewed-${problemId}`, 'true');
            });
        });
    }
    
    createRevealButton() {
        const btn = document.createElement('button');
        btn.className = 'reveal-btn';
        btn.textContent = 'Show Solution';
        return btn;
    }
    
    // Tab Components
    initTabComponents() {
        document.querySelectorAll('.content-tabs').forEach(tabContainer => {
            const buttons = tabContainer.querySelectorAll('.tab-button');
            const panels = tabContainer.querySelectorAll('.tab-panel');
            
            buttons.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    // Remove active class from all
                    buttons.forEach(b => b.classList.remove('active'));
                    panels.forEach(p => p.classList.remove('active'));
                    
                    // Add active class to clicked
                    btn.classList.add('active');
                    panels[index].classList.add('active');
                    
                    // Save preference
                    const tabId = tabContainer.dataset.tabId || 'tabs-' + Date.now();
                    localStorage.setItem(`active-tab-${tabId}`, index);
                });
            });
            
            // Restore last active tab
            const tabId = tabContainer.dataset.tabId;
            if (tabId) {
                const lastActive = localStorage.getItem(`active-tab-${tabId}`);
                if (lastActive !== null && buttons[lastActive]) {
                    buttons[lastActive].click();
                }
            }
        });
    }
    
    // Progress Tracking
    trackProgress(type, id, data) {
        const key = `learning-progress-${type}-${id}`;
        const existing = JSON.parse(localStorage.getItem(key) || '{}');
        const updated = { ...existing, ...data, lastUpdated: Date.now() };
        localStorage.setItem(key, JSON.stringify(updated));
    }
    
    getProgress(type, id) {
        const key = `learning-progress-${type}-${id}`;
        return JSON.parse(localStorage.getItem(key) || '{}');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.activeLearning = new ActiveLearning();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ActiveLearning;
}

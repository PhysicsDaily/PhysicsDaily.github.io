/**
 * Generic Quiz Module for Physics Daily
 * Handles quiz logic, timer, question navigation, and results
 */

class QuizManager {
    constructor(quizConfig) {
        this.quizData = [];
        this.activeQuizData = [];
        this.userAnswers = [];
        this.questionStatus = [];
        this.currentQuestionIndex = 0;
        this.timerInterval = null;
        this.startTime = null;
        this.endTime = null;
        
        // Configuration
        this.config = {
            dataUrl: quizConfig.dataUrl || '',
            maxQuestions: quizConfig.maxQuestions || 50,
            defaultTime: quizConfig.defaultTime || 60,
            positiveMarks: quizConfig.positiveMarks || 4,
            negativeMarks: quizConfig.negativeMarks || 1,
            ...quizConfig
        };
        
        this.dataLoaded = false;
        this.initializeElements();
        this.setupFallbackElements();
        this.loadQuizData();
        this.initializeAuth();
    }
    
    initializeElements() {
        // Get DOM elements
        this.elements = {
            instructionsContainer: document.getElementById('instructions-container'),
            quizInterface: document.getElementById('quiz-interface'),
            timerDisplay: document.getElementById('timer-display'),
            timerInput: document.getElementById('timer-input'),
            // Some pages use #question-count (new), others use #question-count-select (legacy)
            questionCountSelect: document.getElementById('question-count'),
            startBtn: document.getElementById('start-test-btn'),
            questionHeader: document.getElementById('question-header'),
            questionContent: document.getElementById('question-content'),
            optionsList: document.getElementById('options-list'),
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn'),
            // Some pages use #review-btn (new), others #mark-review-btn (legacy)
            reviewBtn: document.getElementById('review-btn'),
            paletteContainer: document.getElementById('question-palette'),
            submitBtn: document.getElementById('submit-test-btn'),
            resultsContainer: document.getElementById('results-container'),
            resultsSummary: document.getElementById('results-summary'),
            detailedResults: document.getElementById('detailed-results')
        };
    }
    
    async initializeAuth() {
        // Initialize auth manager if available
        if (typeof authManager !== 'undefined' && !authManager.isInitialized) {
            await authManager.init();
        }
    }
    
    setupFallbackElements() {
        // Fallback IDs for legacy pages
        if (!this.elements.questionCountSelect) {
            this.elements.questionCountSelect = document.getElementById('question-count-select');
        }
        if (!this.elements.reviewBtn) {
            this.elements.reviewBtn = document.getElementById('mark-review-btn');
        }

        this.bindEvents();
    }
    
    bindEvents() {
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => this.startTest());
        }
        
        if (this.elements.prevBtn) {
            this.elements.prevBtn.addEventListener('click', () => this.handlePrevious());
        }
        
        if (this.elements.nextBtn) {
            this.elements.nextBtn.addEventListener('click', () => this.handleNext());
        }
        
        if (this.elements.reviewBtn) {
            this.elements.reviewBtn.addEventListener('click', () => this.toggleReview());
        }
        
        if (this.elements.submitBtn) {
            this.elements.submitBtn.addEventListener('click', () => this.submitTest());
        }
    }
    
    async loadQuizData() {
        try {
            if (this.config.dataUrl) {
                const response = await fetch(this.config.dataUrl);
                this.quizData = await response.json();
            } else if (this.config.data) {
                this.quizData = this.config.data;
            }
            this.dataLoaded = Array.isArray(this.quizData) && this.quizData.length > 0;
            // Enable start button only when data is ready
            if (this.elements.startBtn) {
                this.elements.startBtn.disabled = !this.dataLoaded;
                if (!this.dataLoaded) {
                    this.elements.startBtn.textContent = 'Loading questions…';
                } else {
                    this.elements.startBtn.textContent = 'Start Test';
                }
            }
            
            // Set up question count options
            if (this.elements.questionCountSelect) {
                const maxQuestions = Math.min(this.quizData.length, this.config.maxQuestions);
                this.elements.questionCountSelect.innerHTML = '';
                for (let i = 10; i <= maxQuestions; i += 10) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    this.elements.questionCountSelect.appendChild(option);
                }
                // Add the max if it's not a multiple of 10
                if (maxQuestions % 10 !== 0) {
                    const option = document.createElement('option');
                    option.value = maxQuestions;
                    option.textContent = maxQuestions;
                    this.elements.questionCountSelect.appendChild(option);
                }
            }
        } catch (error) {
            console.error('Error loading quiz data:', error);
            alert('Error loading quiz questions. Please refresh the page and try again.');
        }
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    startTest() {
        // Guard: ensure data is loaded
        if (!this.dataLoaded || !Array.isArray(this.quizData) || this.quizData.length === 0) {
            alert('Questions are still loading. Please wait a moment and try again.');
            return;
        }
        // Get selected question count
        const selectedCount = parseInt(this.elements.questionCountSelect?.value) || 20;
        const numQuestions = Math.min(selectedCount, this.quizData.length);
        
        // Randomly select questions
        const shuffled = [...this.quizData].sort(() => 0.5 - Math.random());
        this.activeQuizData = shuffled.slice(0, numQuestions);
        
        // Initialize arrays
        this.userAnswers = new Array(numQuestions).fill(null);
        this.questionStatus = new Array(numQuestions).fill('not-visited');
        this.currentQuestionIndex = 0;
        this.startTime = new Date();
        
        // Hide instructions, show quiz
        if (this.elements.instructionsContainer) {
            this.elements.instructionsContainer.style.display = 'none';
        }
        if (this.elements.quizInterface) {
            this.elements.quizInterface.style.display = 'block';
        }
        
        // Start timer
        const timerMinutes = parseInt(this.elements.timerInput?.value) || this.config.defaultTime;
        this.startTimer(timerMinutes * 60);
        
        // Create question palette
    this.createQuestionPalette();
        
        // Display first question
        this.renderQuestion();
        this.renderPalette();
    }
    
    startTimer(duration) {
        let timer = duration;
        this.timerInterval = setInterval(() => {
            const hours = Math.floor(timer / 3600);
            const minutes = Math.floor((timer % 3600) / 60);
            const seconds = timer % 60;
            
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            this.elements.timerDisplay.textContent = timeString;
            
            if (--timer < 0) {
                clearInterval(this.timerInterval);
                alert("Time's up!");
                this.submitTest();
            }
        }, 1000);
    }
    
    renderQuestion() {
        const question = this.activeQuizData[this.currentQuestionIndex];
        
        // Update question header
        this.elements.questionHeader.innerHTML = `
            <span class="question-number">Question ${this.currentQuestionIndex + 1}</span>
            <div class="marks">
                <span class="mark-tag positive">+${this.config.positiveMarks}</span>
                <span class="mark-tag negative">-${this.config.negativeMarks}</span>
            </div>
        `;
        
        // Update question content
        this.elements.questionContent.innerHTML = `<p>${question.question}</p>`;
        
        // Update options
        this.elements.optionsList.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionId = `q${this.currentQuestionIndex}-opt${index}`;
            const isChecked = this.userAnswers[this.currentQuestionIndex] === option;
            
            const listItem = document.createElement('li');
            listItem.className = 'option-item';
            listItem.innerHTML = `
                <label for="${optionId}">
                    <input type="radio" name="question${this.currentQuestionIndex}" id="${optionId}" value="${option}" ${isChecked ? 'checked' : ''}>
                    <span>${option}</span>
                </label>
            `;
            this.elements.optionsList.appendChild(listItem);
        });
        
        // Add event listeners for options
        this.elements.optionsList.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.userAnswers[this.currentQuestionIndex] = e.target.value;
                if (this.questionStatus[this.currentQuestionIndex] === 'review' || 
                    this.questionStatus[this.currentQuestionIndex] === 'answered-review') {
                    this.questionStatus[this.currentQuestionIndex] = 'answered-review';
                } else {
                    this.questionStatus[this.currentQuestionIndex] = 'answered';
                }
                this.renderPalette();
            });
        });
        
        // Update navigation buttons
        this.elements.prevBtn.disabled = this.currentQuestionIndex === 0;
        this.elements.nextBtn.textContent = (this.currentQuestionIndex === this.activeQuizData.length - 1) ? 'Submit Test' : 'Save & Next';
        
        // Mark as visited if not already
        if (this.questionStatus[this.currentQuestionIndex] === 'not-visited') {
            this.questionStatus[this.currentQuestionIndex] = 'visited';
            this.renderPalette();
        }
    }
    
    renderPalette() {
        this.elements.paletteContainer.innerHTML = '';
        this.activeQuizData.forEach((_, index) => {
            const btn = document.createElement('button');
            btn.textContent = index + 1;
            btn.className = 'palette-btn';
            
            if (index === this.currentQuestionIndex) {
                btn.classList.add('current');
            }
            
            const status = this.questionStatus[index];
            if (status === 'answered' || status === 'answered-review') {
                btn.classList.add('answered');
            }
            if (status === 'review' || status === 'answered-review') {
                btn.classList.add('review');
            }
            
            btn.addEventListener('click', () => this.jumpToQuestion(index));
            this.elements.paletteContainer.appendChild(btn);
        });
    }

    /**
     * Initial palette setup (legacy compatibility)
     * Some earlier pages expect createQuestionPalette() to exist.
     * Keep it as a thin wrapper around renderPalette() so calls are safe.
     */
    createQuestionPalette() {
        if (!this.elements || !this.elements.paletteContainer) return;
        this.renderPalette();
    }
    
    jumpToQuestion(index) {
        this.currentQuestionIndex = index;
        this.renderQuestion();
    }
    
    handlePrevious() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderQuestion();
        }
    }
    
    handleNext() {
        if (this.currentQuestionIndex === this.activeQuizData.length - 1) {
            this.submitTest();
        } else {
            this.currentQuestionIndex++;
            this.renderQuestion();
        }
    }
    
    toggleReview() {
        const currentStatus = this.questionStatus[this.currentQuestionIndex];
        if (currentStatus === 'review' || currentStatus === 'answered-review') {
            this.questionStatus[this.currentQuestionIndex] = 
                this.userAnswers[this.currentQuestionIndex] ? 'answered' : 'visited';
        } else {
            this.questionStatus[this.currentQuestionIndex] = 
                this.userAnswers[this.currentQuestionIndex] ? 'answered-review' : 'review';
        }
        this.renderPalette();
    }
    
    submitTest() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Calculate results
        let correct = 0;
        let incorrect = 0;
        let unanswered = 0;
        
        const results = this.activeQuizData.map((question, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer === question.answer;
            
            if (userAnswer === null) {
                unanswered++;
                return { question, userAnswer: 'Not Answered', isCorrect: false, points: 0 };
            } else if (isCorrect) {
                correct++;
                return { question, userAnswer, isCorrect: true, points: this.config.positiveMarks };
            } else {
                incorrect++;
                return { question, userAnswer, isCorrect: false, points: -this.config.negativeMarks };
            }
        });
        
        const totalPoints = correct * this.config.positiveMarks - incorrect * this.config.negativeMarks;
        const percentage = ((correct / this.activeQuizData.length) * 100).toFixed(1);
        
        // Show results
        this.displayResults({
            correct,
            incorrect,
            unanswered,
            totalPoints,
            percentage,
            maxPoints: this.activeQuizData.length * this.config.positiveMarks,
            results
        });

        // Award enhanced XP rewards
        try {
            if (window.enhancedXP && typeof window.enhancedXP.awardQuizXP === 'function') {
                // Extract topic from dataUrl: '/path/to/topic-quiz.json' -> 'topic'
                let topic = 'general';
                if (this.config.dataUrl) {
                    const match = this.config.dataUrl.match(/\/([^\/]+)-quiz\.json$/);
                    if (match) {
                        topic = match[1];
                    }
                }
                
                window.enhancedXP.awardQuizXP({
                    topic,
                    totalQuestions: this.activeQuizData.length,
                    correctAnswers: correct,
                    totalTime: Math.floor((new Date() - this.startTime) / 1000),
                    percentage: parseFloat(percentage)
                });
            }
        } catch (e) { console.warn('Enhanced XP award failed:', e); }
    }
    
    async displayResults(resultData) {
        this.endTime = new Date();
        const timeSpent = Math.floor((this.endTime - this.startTime) / 1000);
        
        this.elements.quizInterface.style.display = 'none';
        this.elements.resultsContainer.style.display = 'block';
        
        // Save quiz result if user is authenticated
        if (typeof authManager !== 'undefined' && authManager.isSignedIn()) {
            // Extract chapter info from URL path
            const path = window.location.pathname;
            let chapter = 'Practice Quiz';
            
            // Try numbered chapters first: /chapter3/, /chapter25/, etc.
            const numberedChapter = path.match(/chapter(\d+)/);
            if (numberedChapter) {
                chapter = `Chapter ${numberedChapter[1]}`;
            } else {
                // Try named chapters: /measurements/, /kinematics/, etc.
                const namedChapter = path.match(/\/([^\/]+)\/mcq\.html$/);
                if (namedChapter) {
                    const name = namedChapter[1];
                    // Capitalize first letter
                    chapter = name.charAt(0).toUpperCase() + name.slice(1);
                }
            }
            
            await authManager.saveQuizResult({
                chapter: chapter,
                topic: this.config.topic || 'Physics',
                totalQuestions: this.activeQuizData.length,
                correctAnswers: resultData.correct,
                score: parseFloat(resultData.percentage),
                timeSpent: timeSpent,
                timestamp: new Date()
            });
        }
        
        // Summary
        this.elements.resultsSummary.innerHTML = `
            <div class="result-summary">
                <h2>Quiz Results</h2>
                <div class="score-overview">
                    <div class="score-item correct">
                        <span class="score-number">${resultData.correct}</span>
                        <span class="score-label">Correct</span>
                    </div>
                    <div class="score-item incorrect">
                        <span class="score-number">${resultData.incorrect}</span>
                        <span class="score-label">Incorrect</span>
                    </div>
                    <div class="score-item unanswered">
                        <span class="score-number">${resultData.unanswered}</span>
                        <span class="score-label">Unanswered</span>
                    </div>
                </div>
                <div class="final-score">
                    <div class="score-display">
                        <span class="points">${resultData.totalPoints}/${resultData.maxPoints}</span>
                        <span class="percentage">${resultData.percentage}%</span>
                    </div>
                </div>
                <div class="result-actions" style="margin-top:1rem; display:flex; gap:.75rem; justify-content:center;">
                    <button id="retry-incorrect-btn" class="btn btn-secondary">Retry Incorrect</button>
                    <button id="retake-btn" class="btn">Retake Full Quiz</button>
                </div>
            </div>
        `;
        
        // Detailed results
        let detailedHTML = '<div class="detailed-results"><h3>Question-wise Analysis</h3>';
        resultData.results.forEach((result, index) => {
            const statusClass = result.isCorrect ? 'correct' : (result.userAnswer === 'Not Answered' ? 'unanswered' : 'incorrect');
            detailedHTML += `
                <div class="result-item ${statusClass}">
                    <div class="result-header">
                        <span class="question-num">Q${index + 1}</span>
                        <span class="result-status">${result.isCorrect ? 'Correct' : (result.userAnswer === 'Not Answered' ? 'Not Answered' : 'Incorrect')}</span>
                        <span class="points">${result.points > 0 ? '+' : ''}${result.points}</span>
                    </div>
                    <div class="question-text">${result.question.question}</div>
                    <div class="answer-info">
                        <div class="user-answer">Your answer: <strong>${result.userAnswer}</strong></div>
                        <div class="correct-answer">Correct answer: <strong>${result.question.answer}</strong></div>
                        ${result.question.solution ? `<div class="solution"><strong>Solution:</strong> ${result.question.solution}</div>` : ''}
                    </div>
                </div>
            `;
        });
        detailedHTML += '</div>';
        
        this.elements.detailedResults.innerHTML = detailedHTML;

        // Hook up actions
        const retryBtn = document.getElementById('retry-incorrect-btn');
        if (retryBtn) retryBtn.addEventListener('click', () => this.retryIncorrect(resultData.results));
        const retakeBtn = document.getElementById('retake-btn');
        if (retakeBtn) retakeBtn.addEventListener('click', () => window.location.reload());
    }

    retryIncorrect(results) {
        const incorrectQs = results
            .map((r, idx) => ({ r, idx }))
            .filter(x => !x.r.isCorrect && x.r.userAnswer !== 'Not Answered')
            .map(x => this.activeQuizData[x.idx]);

        if (!incorrectQs.length) {
            alert('Great job! No incorrect questions to retry.');
            return;
        }

        // Reset with only incorrect questions
        this.activeQuizData = incorrectQs;
        this.userAnswers = new Array(incorrectQs.length).fill(null);
        this.questionStatus = new Array(incorrectQs.length).fill('not-visited');
        this.currentQuestionIndex = 0;
        this.startTime = new Date();

        // Update UI
        this.elements.resultsContainer.style.display = 'none';
        this.elements.quizInterface.style.display = 'block';
        this.createQuestionPalette();
        this.renderQuestion();
        this.renderPalette();
        this.startTimer((parseInt(this.elements.timerInput?.value) || this.config.defaultTime) * 60);
    }
    
    resetQuiz() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.userAnswers = [];
        this.questionStatus = [];
        this.currentQuestionIndex = 0;
        
        this.elements.instructionsContainer.style.display = 'block';
        this.elements.quizInterface.style.display = 'none';
        this.elements.resultsContainer.style.display = 'none';
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuizManager;
}

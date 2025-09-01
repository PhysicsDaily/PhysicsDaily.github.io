/**
 * MCQ Question Loader and Quiz Engine
 * Loads questions from JSON files and provides quiz functionality
 */

class MCQQuizEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.quizData = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.timeRemaining = 0;
        this.timer = null;
        this.quizStarted = false;
        this.quizCompleted = false;
    }

    /**
     * Load quiz data from JSON file
     * @param {string} jsonFilePath - Path to the JSON file containing quiz questions
     */
    async loadQuiz(jsonFilePath) {
        try {
            const response = await fetch(jsonFilePath);
            if (!response.ok) {
                throw new Error(`Failed to load quiz: ${response.status}`);
            }
            this.quizData = await response.json();
            this.initializeUserAnswers();
            this.renderInstructions();
        } catch (error) {
            console.error('Error loading quiz:', error);
            this.renderError('Failed to load quiz. Please try again later.');
        }
    }

    /**
     * Initialize user answers array
     */
    initializeUserAnswers() {
        this.userAnswers = new Array(this.quizData.questions.length).fill(null);
        this.timeRemaining = this.quizData.quiz.timeLimit;
    }

    /**
     * Render quiz instructions
     */
    renderInstructions() {
        const { chapter, quiz } = this.quizData;
        
        this.container.innerHTML = `
            <div class="quiz-instructions">
                <div class="quiz-header">
                    <h1>${chapter.title} - Assessment Quiz</h1>
                    <p class="quiz-description">${chapter.description}</p>
                </div>
                
                <div class="quiz-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Questions:</strong> ${this.quizData.questions.length}
                        </div>
                        <div class="info-item">
                            <strong>Time Limit:</strong> ${Math.floor(quiz.timeLimit / 60)} minutes
                        </div>
                        <div class="info-item">
                            <strong>Passing Score:</strong> ${quiz.passingScore}%
                        </div>
                        <div class="info-item">
                            <strong>Total Points:</strong> ${this.getTotalPoints()}
                        </div>
                    </div>
                </div>

                <div class="instructions">
                    <h3>📋 Instructions</h3>
                    <ul>
                        ${quiz.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                    </ul>
                </div>

                <div class="start-quiz-section">
                    <button id="start-quiz-btn" class="btn btn-primary btn-large">
                        🚀 Start Quiz
                    </button>
                </div>
            </div>
        `;

        document.getElementById('start-quiz-btn').addEventListener('click', () => {
            this.startQuiz();
        });
    }

    /**
     * Start the quiz
     */
    startQuiz() {
        this.quizStarted = true;
        this.startTimer();
        this.renderQuestion();
    }

    /**
     * Start the quiz timer
     */
    startTimer() {
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.submitQuiz(true); // Auto-submit when time runs out
            }
        }, 1000);
    }

    /**
     * Update timer display
     */
    updateTimerDisplay() {
        const timerElement = document.getElementById('quiz-timer');
        if (timerElement) {
            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Add warning class when time is running low
            if (this.timeRemaining <= 300) { // 5 minutes
                timerElement.classList.add('timer-warning');
            }
            if (this.timeRemaining <= 60) { // 1 minute
                timerElement.classList.add('timer-critical');
            }
        }
    }

    /**
     * Render current question
     */
    renderQuestion() {
        const question = this.quizData.questions[this.currentQuestionIndex];
        const progress = ((this.currentQuestionIndex + 1) / this.quizData.questions.length) * 100;

        this.container.innerHTML = `
            <div class="quiz-interface">
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-text">
                        Question ${this.currentQuestionIndex + 1} of ${this.quizData.questions.length}
                    </div>
                    <div class="quiz-timer-container">
                        ⏱️ <span id="quiz-timer">${Math.floor(this.timeRemaining / 60).toString().padStart(2, '0')}:${(this.timeRemaining % 60).toString().padStart(2, '0')}</span>
                    </div>
                </div>

                <div class="question-container">
                    <div class="question-header">
                        <span class="difficulty-badge difficulty-${question.difficulty}">${question.difficulty}</span>
                        <span class="points-badge">${question.points} points</span>
                    </div>
                    
                    <div class="question-text">
                        <h2>${question.question}</h2>
                    </div>

                    <div class="options-container">
                        ${question.options.map((option, index) => `
                            <label class="option-label ${this.userAnswers[this.currentQuestionIndex] === index ? 'selected' : ''}">
                                <input type="radio" name="question-${question.id}" value="${index}" 
                                       ${this.userAnswers[this.currentQuestionIndex] === index ? 'checked' : ''}>
                                <span class="option-text">${String.fromCharCode(65 + index)}. ${option}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="quiz-navigation">
                    <button id="prev-btn" class="btn btn-secondary" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
                        ← Previous
                    </button>
                    
                    <div class="question-indicator">
                        ${this.quizData.questions.map((_, index) => `
                            <span class="indicator-dot ${index === this.currentQuestionIndex ? 'current' : ''} 
                                         ${this.userAnswers[index] !== null ? 'answered' : ''}"
                                  data-question="${index}">
                                ${index + 1}
                            </span>
                        `).join('')}
                    </div>

                    ${this.currentQuestionIndex === this.quizData.questions.length - 1 ? 
                        '<button id="finish-btn" class="btn btn-success">🏁 Finish Quiz</button>' :
                        '<button id="next-btn" class="btn btn-primary">Next →</button>'
                    }
                </div>
            </div>
        `;

        this.attachQuestionEventListeners();
    }

    /**
     * Attach event listeners for the current question
     */
    attachQuestionEventListeners() {
        // Handle option selection
        const optionInputs = this.container.querySelectorAll('input[type="radio"]');
        optionInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.userAnswers[this.currentQuestionIndex] = parseInt(e.target.value);
                this.updateOptionSelection();
                this.updateQuestionIndicator();
            });
        });

        // Navigation buttons
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const finishBtn = document.getElementById('finish-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousQuestion());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        if (finishBtn) {
            finishBtn.addEventListener('click', () => this.confirmSubmit());
        }

        // Question indicator navigation
        const indicators = this.container.querySelectorAll('.indicator-dot');
        indicators.forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const questionIndex = parseInt(e.target.dataset.question);
                this.currentQuestionIndex = questionIndex;
                this.renderQuestion();
            });
        });
    }

    /**
     * Update option selection visual state
     */
    updateOptionSelection() {
        const labels = this.container.querySelectorAll('.option-label');
        labels.forEach((label, index) => {
            if (this.userAnswers[this.currentQuestionIndex] === index) {
                label.classList.add('selected');
            } else {
                label.classList.remove('selected');
            }
        });
    }

    /**
     * Update question indicator
     */
    updateQuestionIndicator() {
        const indicators = this.container.querySelectorAll('.indicator-dot');
        indicators.forEach((indicator, index) => {
            if (this.userAnswers[index] !== null) {
                indicator.classList.add('answered');
            }
        });
    }

    /**
     * Navigate to previous question
     */
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderQuestion();
        }
    }

    /**
     * Navigate to next question
     */
    nextQuestion() {
        if (this.currentQuestionIndex < this.quizData.questions.length - 1) {
            this.currentQuestionIndex++;
            this.renderQuestion();
        }
    }

    /**
     * Confirm quiz submission
     */
    confirmSubmit() {
        const unanswered = this.userAnswers.filter(answer => answer === null).length;
        let message = 'Are you sure you want to submit your quiz?';
        
        if (unanswered > 0) {
            message += `\n\nYou have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}.`;
        }

        if (confirm(message)) {
            this.submitQuiz();
        }
    }

    /**
     * Submit the quiz and show results
     */
    submitQuiz(timeUp = false) {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.quizCompleted = true;
        const results = this.calculateResults();
        this.renderResults(results, timeUp);
    }

    /**
     * Calculate quiz results
     */
    calculateResults() {
        let correctAnswers = 0;
        let totalPoints = 0;
        let earnedPoints = 0;
        
        const questionResults = this.quizData.questions.map((question, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer === question.correct;
            
            if (isCorrect) {
                correctAnswers++;
                earnedPoints += question.points;
            }
            
            totalPoints += question.points;
            
            return {
                question,
                userAnswer,
                isCorrect,
                pointsEarned: isCorrect ? question.points : 0
            };
        });

        const percentage = Math.round((earnedPoints / totalPoints) * 100);
        const passed = percentage >= this.quizData.quiz.passingScore;

        return {
            correctAnswers,
            totalQuestions: this.quizData.questions.length,
            earnedPoints,
            totalPoints,
            percentage,
            passed,
            questionResults
        };
    }

    /**
     * Render quiz results
     */
    renderResults(results, timeUp = false) {
        const { earnedPoints, totalPoints, percentage, passed, correctAnswers, totalQuestions } = results;
        
        this.container.innerHTML = `
            <div class="quiz-results">
                <div class="results-header">
                    <h1>Quiz Complete!</h1>
                    ${timeUp ? '<p class="time-up-notice">⏰ Time\'s up! Your quiz has been automatically submitted.</p>' : ''}
                </div>

                <div class="score-summary">
                    <div class="score-circle ${passed ? 'passed' : 'failed'}">
                        <div class="score-percentage">${percentage}%</div>
                        <div class="score-status">${passed ? 'PASSED' : 'FAILED'}</div>
                    </div>
                    
                    <div class="score-details">
                        <div class="detail-item">
                            <span class="label">Questions Correct:</span>
                            <span class="value">${correctAnswers} / ${totalQuestions}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Points Earned:</span>
                            <span class="value">${earnedPoints} / ${totalPoints}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Required to Pass:</span>
                            <span class="value">${this.quizData.quiz.passingScore}%</span>
                        </div>
                    </div>
                </div>

                <div class="results-actions">
                    <button id="review-answers-btn" class="btn btn-primary">
                        📋 Review Answers
                    </button>
                    <button id="retake-quiz-btn" class="btn btn-secondary">
                        🔄 Retake Quiz
                    </button>
                    <a href="index.html" class="btn btn-outline">
                        ← Back to Chapter
                    </a>
                </div>
            </div>
        `;

        // Attach event listeners for results actions
        document.getElementById('review-answers-btn').addEventListener('click', () => {
            this.showDetailedResults(results);
        });

        document.getElementById('retake-quiz-btn').addEventListener('click', () => {
            this.resetQuiz();
        });
    }

    /**
     * Show detailed results with explanations
     */
    showDetailedResults(results) {
        const { questionResults } = results;
        
        this.container.innerHTML = `
            <div class="detailed-results">
                <div class="results-header">
                    <h1>Answer Review</h1>
                    <button id="back-to-summary-btn" class="btn btn-secondary">← Back to Summary</button>
                </div>

                <div class="questions-review">
                    ${questionResults.map((result, index) => `
                        <div class="question-review ${result.isCorrect ? 'correct' : 'incorrect'}">
                            <div class="question-header">
                                <span class="question-number">Question ${index + 1}</span>
                                <span class="result-indicator ${result.isCorrect ? 'correct' : 'incorrect'}">
                                    ${result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                </span>
                                <span class="points">${result.pointsEarned}/${result.question.points} points</span>
                            </div>
                            
                            <div class="question-text">${result.question.question}</div>
                            
                            <div class="options-review">
                                ${result.question.options.map((option, optionIndex) => `
                                    <div class="option-item ${optionIndex === result.question.correct ? 'correct-answer' : ''} 
                                                ${result.userAnswer === optionIndex ? 'user-answer' : ''}">
                                        <span class="option-letter">${String.fromCharCode(65 + optionIndex)}.</span>
                                        <span class="option-text">${option}</span>
                                        ${optionIndex === result.question.correct ? '<span class="indicator">✓</span>' : ''}
                                        ${result.userAnswer === optionIndex && !result.isCorrect ? '<span class="indicator user">Your answer</span>' : ''}
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div class="explanation">
                                <strong>Explanation:</strong> ${result.question.explanation}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.getElementById('back-to-summary-btn').addEventListener('click', () => {
            this.renderResults(results);
        });
    }

    /**
     * Reset quiz to initial state
     */
    resetQuiz() {
        this.currentQuestionIndex = 0;
        this.quizStarted = false;
        this.quizCompleted = false;
        this.initializeUserAnswers();
        
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.renderInstructions();
    }

    /**
     * Get total points for all questions
     */
    getTotalPoints() {
        return this.quizData.questions.reduce((total, question) => total + question.points, 0);
    }

    /**
     * Render error message
     */
    renderError(message) {
        this.container.innerHTML = `
            <div class="error-container">
                <div class="error-icon">⚠️</div>
                <h2>Error Loading Quiz</h2>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn btn-primary">Try Again</button>
            </div>
        `;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MCQQuizEngine;
}

// Make available globally for direct script inclusion
window.MCQQuizEngine = MCQQuizEngine;
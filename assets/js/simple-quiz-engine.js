/**
 * Simple MCQ Quiz Engine - matches the exact design from the requirements
 * Loads questions from JSON files and provides clean quiz functionality
 */

class SimpleQuizEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.quizData = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.markedForReview = new Set();
        this.timeRemaining = 3600; // Default 60 minutes
        this.timer = null;
        this.quizStarted = false;
        this.totalQuestions = 0;
        this.selectedQuestions = [];
    }

    /**
     * Load quiz data from JSON file
     */
    async loadQuiz(jsonFilePath) {
        try {
            const response = await fetch(jsonFilePath);
            if (!response.ok) {
                throw new Error(`Failed to load quiz: ${response.status}`);
            }
            this.quizData = await response.json();
            this.totalQuestions = this.quizData.questions.length;
            this.renderInstructions();
        } catch (error) {
            console.error('Error loading quiz:', error);
            this.renderError('Failed to load quiz. Please try again later.');
        }
    }

    /**
     * Render quiz instructions with configuration options
     */
    renderInstructions() {
        const { chapter } = this.quizData;
        
        this.container.innerHTML = `
            <div class="quiz-instructions-container">
                <div class="quiz-header">
                    <h1>${chapter.title}: Assessment Quiz</h1>
                    <p class="quiz-subtitle">${chapter.description}</p>
                </div>
                
                <div class="instructions-section">
                    <h3>📋 Instructions</h3>
                    <div class="instructions-content">
                        <p>This test contains up to <strong>100 multiple-choice questions</strong>.</p>
                        <p>Each correct answer awards <strong>+4 marks</strong>.</p>
                        <p>Each incorrect answer results in a penalty of <strong>-1 mark</strong>.</p>
                        <p>Unanswered questions receive <strong>0 marks</strong>.</p>
                        <p>Use the question palette to navigate between questions.</p>
                    </div>
                </div>

                <div class="quiz-configuration">
                    <div class="config-row">
                        <label for="question-count">Number of Questions:</label>
                        <select id="question-count">
                            <option value="${this.totalQuestions}">${this.totalQuestions} (Full Chapter)</option>
                            <option value="50">50 Questions</option>
                            <option value="25">25 Questions</option>
                            <option value="10">10 Questions</option>
                        </select>
                    </div>
                    
                    <div class="config-row">
                        <label for="timer-minutes">Set Timer (minutes):</label>
                        <input type="number" id="timer-minutes" value="60" min="10" max="180">
                    </div>
                </div>

                <div class="start-section">
                    <button id="start-test-btn" class="btn btn-primary btn-large">
                        Start Test
                    </button>
                </div>
            </div>
        `;

        // Add event listener for start button
        document.getElementById('start-test-btn').addEventListener('click', () => {
            this.startQuiz();
        });
    }

    /**
     * Start the quiz with selected configuration
     */
    startQuiz() {
        const questionCount = parseInt(document.getElementById('question-count').value);
        const timerMinutes = parseInt(document.getElementById('timer-minutes').value);
        
        // Set up quiz parameters
        this.timeRemaining = timerMinutes * 60;
        this.selectedQuestions = this.selectQuestions(questionCount);
        this.userAnswers = new Array(this.selectedQuestions.length).fill(null);
        this.currentQuestionIndex = 0;
        this.quizStarted = true;
        
        this.startTimer();
        this.renderQuizInterface();
    }

    /**
     * Select questions for the quiz
     */
    selectQuestions(count) {
        if (count >= this.totalQuestions) {
            return this.quizData.questions;
        }
        
        // Shuffle and select questions
        const shuffled = [...this.quizData.questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    /**
     * Start the quiz timer
     */
    startTimer() {
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.submitQuiz(true);
            }
        }, 1000);
    }

    /**
     * Update timer display
     */
    updateTimerDisplay() {
        const timerElement = document.getElementById('quiz-timer');
        if (timerElement) {
            const hours = Math.floor(this.timeRemaining / 3600);
            const minutes = Math.floor((this.timeRemaining % 3600) / 60);
            const seconds = this.timeRemaining % 60;
            
            let timeStr;
            if (hours > 0) {
                timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            
            timerElement.textContent = timeStr;
            
            // Add warning classes
            if (this.timeRemaining <= 300) { // 5 minutes
                timerElement.classList.add('timer-warning');
            }
            if (this.timeRemaining <= 60) { // 1 minute
                timerElement.classList.add('timer-critical');
            }
        }
    }

    /**
     * Render the main quiz interface
     */
    renderQuizInterface() {
        this.container.innerHTML = `
            <div class="quiz-main-interface">
                <div class="quiz-content">
                    <div class="question-section">
                        <div class="timer-section">
                            <h3>Time Remaining</h3>
                            <div class="timer-display" id="quiz-timer">--:--</div>
                        </div>
                        
                        <div class="question-content" id="question-content">
                            <!-- Question will be loaded here -->
                        </div>
                        
                        <div class="question-navigation">
                            <button id="prev-btn" class="btn btn-secondary">Previous</button>
                            <button id="mark-review-btn" class="btn btn-outline">Mark for Review</button>
                            <button id="next-btn" class="btn btn-primary">Save & Next</button>
                        </div>
                    </div>
                    
                    <div class="question-palette-section">
                        <h3>Question Palette</h3>
                        <div class="question-palette" id="question-palette">
                            <!-- Palette will be generated here -->
                        </div>
                        <button id="submit-test-btn" class="btn btn-success btn-large">Submit Test</button>
                    </div>
                </div>
            </div>
        `;

        this.generateQuestionPalette();
        this.renderCurrentQuestion();
        this.updateTimerDisplay();
        this.attachEventListeners();
    }

    /**
     * Generate question palette
     */
    generateQuestionPalette() {
        const palette = document.getElementById('question-palette');
        palette.innerHTML = '';
        
        this.selectedQuestions.forEach((_, index) => {
            const btn = document.createElement('button');
            btn.textContent = index + 1;
            btn.className = 'palette-btn';
            btn.dataset.questionIndex = index;
            
            // Set status classes
            if (index === this.currentQuestionIndex) {
                btn.classList.add('current');
            }
            if (this.userAnswers[index] !== null) {
                btn.classList.add('answered');
            }
            if (this.markedForReview.has(index)) {
                btn.classList.add('marked');
            }
            
            btn.addEventListener('click', () => {
                this.goToQuestion(index);
            });
            
            palette.appendChild(btn);
        });
    }

    /**
     * Render current question
     */
    renderCurrentQuestion() {
        const question = this.selectedQuestions[this.currentQuestionIndex];
        const questionContent = document.getElementById('question-content');
        
        questionContent.innerHTML = `
            <div class="question-header">
                <h2>Question ${this.currentQuestionIndex + 1}</h2>
                <div class="question-stats">
                    <span class="correct-count">+${this.getCorrectCount()}</span>
                    <span class="incorrect-count">-${this.getIncorrectCount()}</span>
                </div>
            </div>
            
            <div class="question-text">
                <p>${this.currentQuestionIndex + 1}. ${question.question}</p>
            </div>
            
            <div class="options-container">
                ${question.options.map((option, index) => `
                    <label class="option-label ${this.userAnswers[this.currentQuestionIndex] === index ? 'selected' : ''}">
                        <input type="radio" name="current-question" value="${index}" 
                               ${this.userAnswers[this.currentQuestionIndex] === index ? 'checked' : ''}>
                        <span class="option-text">${String.fromCharCode(65 + index)}. ${option}</span>
                    </label>
                `).join('')}
            </div>
        `;
        
        // Add event listeners for options
        questionContent.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.saveAnswer(parseInt(e.target.value));
            });
        });
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }

    /**
     * Save answer for current question
     */
    saveAnswer(optionIndex) {
        this.userAnswers[this.currentQuestionIndex] = optionIndex;
        this.generateQuestionPalette(); // Update palette to show answered status
        this.renderCurrentQuestion(); // Update stats
    }

    /**
     * Mark/unmark question for review
     */
    toggleMarkForReview() {
        const index = this.currentQuestionIndex;
        if (this.markedForReview.has(index)) {
            this.markedForReview.delete(index);
        } else {
            this.markedForReview.add(index);
        }
        this.generateQuestionPalette();
    }

    /**
     * Navigate to specific question
     */
    goToQuestion(index) {
        this.currentQuestionIndex = index;
        this.renderCurrentQuestion();
        this.generateQuestionPalette();
    }

    /**
     * Go to next question
     */
    nextQuestion() {
        if (this.currentQuestionIndex < this.selectedQuestions.length - 1) {
            this.currentQuestionIndex++;
            this.renderCurrentQuestion();
            this.generateQuestionPalette();
        }
    }

    /**
     * Go to previous question
     */
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderCurrentQuestion();
            this.generateQuestionPalette();
        }
    }

    /**
     * Update navigation button states
     */
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const markBtn = document.getElementById('mark-review-btn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentQuestionIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.textContent = this.currentQuestionIndex === this.selectedQuestions.length - 1 ? 'Save' : 'Save & Next';
        }
        
        if (markBtn) {
            markBtn.textContent = this.markedForReview.has(this.currentQuestionIndex) ? 'Unmark Review' : 'Mark for Review';
        }
    }

    /**
     * Get count of correct answers
     */
    getCorrectCount() {
        let count = 0;
        this.userAnswers.forEach((answer, index) => {
            if (answer !== null) {
                const question = this.selectedQuestions[index];
                const correctIndex = question.options.indexOf(question.answer);
                if (answer === correctIndex) {
                    count++;
                }
            }
        });
        return count;
    }

    /**
     * Get count of incorrect answers
     */
    getIncorrectCount() {
        let count = 0;
        this.userAnswers.forEach((answer, index) => {
            if (answer !== null) {
                const question = this.selectedQuestions[index];
                const correctIndex = question.options.indexOf(question.answer);
                if (answer !== correctIndex) {
                    count++;
                }
            }
        });
        return count;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const markBtn = document.getElementById('mark-review-btn');
        const submitBtn = document.getElementById('submit-test-btn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousQuestion());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        if (markBtn) {
            markBtn.addEventListener('click', () => this.toggleMarkForReview());
        }
        
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitQuiz(false));
        }
    }

    /**
     * Submit quiz and show results
     */
    submitQuiz(autoSubmit = false) {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.quizStarted = false;
        this.showResults(autoSubmit);
    }

    /**
     * Show quiz results
     */
    showResults(autoSubmit = false) {
        const correctCount = this.getCorrectCount();
        const incorrectCount = this.getIncorrectCount();
        const unansweredCount = this.selectedQuestions.length - (correctCount + incorrectCount);
        const totalMarks = (correctCount * 4) - (incorrectCount * 1);
        const maxMarks = this.selectedQuestions.length * 4;
        const percentage = Math.round((correctCount / this.selectedQuestions.length) * 100);
        
        this.container.innerHTML = `
            <div class="quiz-results">
                <div class="results-header">
                    <h1>🎯 Quiz Results</h1>
                    ${autoSubmit ? '<p class="auto-submit-notice">Quiz was automatically submitted due to time expiry.</p>' : ''}
                </div>
                
                <div class="results-summary">
                    <div class="score-card">
                        <div class="score-main">
                            <span class="score-value">${percentage}%</span>
                            <span class="score-label">Score</span>
                        </div>
                        <div class="score-details">
                            <p>Marks: ${totalMarks} / ${maxMarks}</p>
                            <p class="result-status ${percentage >= 70 ? 'pass' : 'fail'}">
                                ${percentage >= 70 ? '✅ PASS' : '❌ FAIL'}
                            </p>
                        </div>
                    </div>
                    
                    <div class="results-breakdown">
                        <div class="breakdown-item correct">
                            <span class="count">${correctCount}</span>
                            <span class="label">Correct</span>
                        </div>
                        <div class="breakdown-item incorrect">
                            <span class="count">${incorrectCount}</span>
                            <span class="label">Incorrect</span>
                        </div>
                        <div class="breakdown-item unanswered">
                            <span class="count">${unansweredCount}</span>
                            <span class="label">Unanswered</span>
                        </div>
                    </div>
                </div>
                
                <div class="results-actions">
                    <button id="view-solutions-btn" class="btn btn-primary">View Solutions</button>
                    <button id="retake-quiz-btn" class="btn btn-secondary">Retake Quiz</button>
                    <a href="index.html" class="btn btn-outline">Back to Chapter</a>
                </div>
                
                <div id="solutions-container" class="solutions-container" style="display: none;">
                    ${this.generateSolutions()}
                </div>
            </div>
        `;
        
        // Add event listeners for results actions
        document.getElementById('view-solutions-btn')?.addEventListener('click', () => {
            document.getElementById('solutions-container').style.display = 'block';
            document.getElementById('view-solutions-btn').style.display = 'none';
        });
        
        document.getElementById('retake-quiz-btn')?.addEventListener('click', () => {
            this.resetQuiz();
            this.renderInstructions();
        });
    }

    /**
     * Generate solutions display
     */
    generateSolutions() {
        return this.selectedQuestions.map((question, index) => {
            const userAnswer = this.userAnswers[index];
            const correctIndex = question.options.indexOf(question.answer);
            const isCorrect = userAnswer === correctIndex;
            const isAnswered = userAnswer !== null;
            
            return `
                <div class="solution-item ${isAnswered ? (isCorrect ? 'correct' : 'incorrect') : 'unanswered'}">
                    <div class="solution-header">
                        <h3>Question ${index + 1}</h3>
                        <span class="solution-status">
                            ${isAnswered ? (isCorrect ? '✅ Correct' : '❌ Incorrect') : '⚪ Unanswered'}
                        </span>
                    </div>
                    <p class="solution-question">${question.question}</p>
                    <div class="solution-answers">
                        ${isAnswered ? `<p><strong>Your Answer:</strong> ${String.fromCharCode(65 + userAnswer)}. ${question.options[userAnswer]}</p>` : '<p><strong>Your Answer:</strong> Not answered</p>'}
                        <p><strong>Correct Answer:</strong> ${String.fromCharCode(65 + correctIndex)}. ${question.answer}</p>
                        <p class="solution-explanation"><strong>Explanation:</strong> ${question.solution}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Reset quiz state
     */
    resetQuiz() {
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.markedForReview.clear();
        this.quizStarted = false;
        this.selectedQuestions = [];
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    /**
     * Render error message
     */
    renderError(message) {
        this.container.innerHTML = `
            <div class="quiz-error">
                <h2>❌ Error</h2>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn btn-primary">Try Again</button>
            </div>
        `;
    }
}
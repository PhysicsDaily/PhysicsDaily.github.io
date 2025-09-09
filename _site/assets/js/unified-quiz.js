/**
 * Unified Quiz System for Physics Daily
 * A single, consistent quiz engine for all topics
 */

class UnifiedQuizManager {
    constructor() {
        this.quizData = window.quizData || [];
        this.currentQuizData = [];
        this.userAnswers = [];
        this.currentQuestionIndex = 0;
        this.quizMode = 'practice';
        this.isQuizActive = false;
        this.startTime = null;
        this.endTime = null;
        
        this.initializeElements();
        this.attachEventListeners();
    }
    
    initializeElements() {
        // Controls
        this.numQuestionsSelect = document.getElementById('numQuestions');
        this.quizModeSelect = document.getElementById('quizMode');
        this.startButton = document.getElementById('startQuiz');
        this.resetButton = document.getElementById('resetQuiz');
        
        // Progress
        this.progressContainer = document.querySelector('.progress-container');
        this.progressFill = document.querySelector('.progress-fill');
        this.currentQuestionSpan = document.getElementById('currentQuestion');
        this.totalQuestionsSpan = document.getElementById('totalQuestions');
        
        // Quiz Content
        this.quizContent = document.getElementById('quizContent');
        this.questionText = document.getElementById('questionText');
        this.optionsContainer = document.getElementById('optionsContainer');
        this.feedbackContainer = document.getElementById('feedbackContainer');
        
        // Navigation
        this.prevButton = document.getElementById('prevQuestion');
        this.submitAnswerButton = document.getElementById('submitAnswer');
        this.nextButton = document.getElementById('nextQuestion');
        this.showResultsButton = document.getElementById('showResults');
        
        // Results
        this.resultsSection = document.getElementById('resultsSection');
        this.scorePercentage = document.getElementById('scorePercentage');
        this.correctAnswersSpan = document.getElementById('correctAnswers');
        this.totalAnsweredSpan = document.getElementById('totalAnswered');
        this.scoreMessage = document.getElementById('scoreMessage');
        this.questionReview = document.getElementById('questionReview');
    }
    
    attachEventListeners() {
        this.startButton.addEventListener('click', () => this.startQuiz());
        this.resetButton.addEventListener('click', () => this.resetQuiz());
        this.prevButton.addEventListener('click', () => this.navigateQuestion(-1));
        this.nextButton.addEventListener('click', () => this.navigateQuestion(1));
        this.submitAnswerButton.addEventListener('click', () => this.submitAnswer());
        this.showResultsButton.addEventListener('click', () => this.showResults());
        
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isQuizActive) return;
            
            if (e.key === 'ArrowLeft' && !this.prevButton.disabled) {
                this.navigateQuestion(-1);
            } else if (e.key === 'ArrowRight' && !this.nextButton.disabled) {
                this.navigateQuestion(1);
            } else if (e.key === 'Enter') {
                this.submitAnswer();
            }
        });
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    startQuiz() {
        const numQuestions = this.numQuestionsSelect.value;
        const totalQuestions = this.quizData.length;
        
        // Determine how many questions to use
        let questionsToUse = totalQuestions;
        if (numQuestions !== 'all') {
            questionsToUse = Math.min(parseInt(numQuestions), totalQuestions);
        }
        
        // Shuffle and select questions
        this.currentQuizData = this.shuffleArray(this.quizData).slice(0, questionsToUse);
        this.userAnswers = new Array(questionsToUse).fill(null);
        this.currentQuestionIndex = 0;
        this.quizMode = this.quizModeSelect.value;
        this.isQuizActive = true;
        this.startTime = Date.now();
        
        // Update UI
        this.startButton.style.display = 'none';
        this.resetButton.style.display = 'inline-block';
        this.progressContainer.style.display = 'block';
        this.quizContent.style.display = 'block';
        this.resultsSection.style.display = 'none';
        
        // Hide mode and question selectors
        this.numQuestionsSelect.disabled = true;
        this.quizModeSelect.disabled = true;
        
        this.totalQuestionsSpan.textContent = questionsToUse;
        
        this.displayQuestion();
    }
    
    resetQuiz() {
        this.currentQuizData = [];
        this.userAnswers = [];
        this.currentQuestionIndex = 0;
        this.isQuizActive = false;
        
        // Reset UI
        this.startButton.style.display = 'inline-block';
        this.resetButton.style.display = 'none';
        this.progressContainer.style.display = 'none';
        this.quizContent.style.display = 'none';
        this.resultsSection.style.display = 'none';
        this.feedbackContainer.style.display = 'none';
        
        // Enable selectors
        this.numQuestionsSelect.disabled = false;
        this.quizModeSelect.disabled = false;
    }
    
    displayQuestion() {
        const question = this.currentQuizData[this.currentQuestionIndex];
        const questionNum = this.currentQuestionIndex + 1;
        
        // Update progress
        this.currentQuestionSpan.textContent = questionNum;
        const progress = (questionNum / this.currentQuizData.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Display question
        this.questionText.innerHTML = `Question ${questionNum}: ${question.question}`;
        
        // Shuffle options for display
        const shuffledOptions = this.shuffleArray([...question.options]);
        
        // Display options
        this.optionsContainer.innerHTML = '';
        shuffledOptions.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.innerHTML = `
                <label>
                    <input type="radio" name="answer" value="${option}" 
                           ${this.userAnswers[this.currentQuestionIndex] === option ? 'checked' : ''}>
                    <span>${option}</span>
                </label>
            `;
            this.optionsContainer.appendChild(optionDiv);
        });
        
        // Update navigation buttons
        this.prevButton.disabled = this.currentQuestionIndex === 0;
        this.nextButton.disabled = this.currentQuestionIndex === this.currentQuizData.length - 1;
        
        // Show/hide appropriate buttons
        if (this.currentQuestionIndex === this.currentQuizData.length - 1) {
            this.showResultsButton.style.display = 'inline-block';
        } else {
            this.showResultsButton.style.display = 'none';
        }
        
        // If in practice mode and answer was already submitted, show feedback
        if (this.quizMode === 'practice' && this.userAnswers[this.currentQuestionIndex]) {
            this.showFeedback();
        } else {
            this.feedbackContainer.style.display = 'none';
            this.submitAnswerButton.disabled = false;
        }
    }
    
    submitAnswer() {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        
        if (!selectedOption) {
            alert('Please select an answer before submitting.');
            return;
        }
        
        const answer = selectedOption.value;
        this.userAnswers[this.currentQuestionIndex] = answer;
        
        if (this.quizMode === 'practice') {
            this.showFeedback();
        }
        
        // Auto-advance to next question after a short delay
        if (this.currentQuestionIndex < this.currentQuizData.length - 1) {
            setTimeout(() => this.navigateQuestion(1), this.quizMode === 'practice' ? 1500 : 500);
        }
    }
    
    showFeedback() {
        const question = this.currentQuizData[this.currentQuestionIndex];
        const userAnswer = this.userAnswers[this.currentQuestionIndex];
        const isCorrect = userAnswer === question.answer;
        
        this.feedbackContainer.innerHTML = `
            <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
                <strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong>
                ${!isCorrect ? `<p>The correct answer is: <strong>${question.answer}</strong></p>` : ''}
                <p class="solution"><strong>Explanation:</strong> ${question.solution}</p>
            </div>
        `;
        this.feedbackContainer.style.display = 'block';
        this.submitAnswerButton.disabled = true;
        
        // Disable radio buttons after submission
        document.querySelectorAll('input[name="answer"]').forEach(input => {
            input.disabled = true;
        });
    }
    
    navigateQuestion(direction) {
        const newIndex = this.currentQuestionIndex + direction;
        
        if (newIndex >= 0 && newIndex < this.currentQuizData.length) {
            this.currentQuestionIndex = newIndex;
            this.displayQuestion();
        }
    }
    
    showResults() {
        this.endTime = Date.now();
        const timeTaken = Math.floor((this.endTime - this.startTime) / 1000);
        
        let correctCount = 0;
        let answeredCount = 0;
        
        this.currentQuizData.forEach((question, index) => {
            if (this.userAnswers[index] !== null) {
                answeredCount++;
                if (this.userAnswers[index] === question.answer) {
                    correctCount++;
                }
            }
        });
        
        const percentage = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
        
        // Update results display
        this.scorePercentage.textContent = `${percentage}%`;
        this.correctAnswersSpan.textContent = correctCount;
        this.totalAnsweredSpan.textContent = answeredCount;
        
        // Generate score message
        let message = '';
        if (percentage >= 90) {
            message = 'Excellent work! You have mastered this topic!';
        } else if (percentage >= 70) {
            message = 'Good job! Keep practicing to improve further.';
        } else if (percentage >= 50) {
            message = 'You\'re on the right track. Review the concepts and try again.';
        } else {
            message = 'Keep studying! Review the material and practice more.';
        }
        this.scoreMessage.textContent = message;
        
        // Generate detailed review
        this.generateReview();
        
        // Show results section
        this.quizContent.style.display = 'none';
        this.resultsSection.style.display = 'block';
        this.isQuizActive = false;
    }
    
    generateReview() {
        let reviewHTML = '';
        
        this.currentQuizData.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer === question.answer;
            const status = userAnswer === null ? 'unanswered' : (isCorrect ? 'correct' : 'incorrect');
            
            reviewHTML += `
                <div class="review-item ${status}">
                    <h4>Question ${index + 1}</h4>
                    <p class="question-text">${question.question}</p>
                    <div class="answer-info">
                        ${userAnswer !== null ? 
                            `<p>Your answer: <span class="${isCorrect ? 'correct-answer' : 'wrong-answer'}">${userAnswer}</span></p>` : 
                            '<p>Not answered</p>'}
                        ${!isCorrect ? `<p>Correct answer: <span class="correct-answer">${question.answer}</span></p>` : ''}
                    </div>
                    <div class="solution-box">
                        <strong>Explanation:</strong> ${question.solution}
                    </div>
                </div>
            `;
        });
        
        this.questionReview.innerHTML = reviewHTML;
    }
}

// Initialize the quiz manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const quizManager = new UnifiedQuizManager();
    
    // Store instance globally for debugging
    window.quizManager = quizManager;
});

document.addEventListener('DOMContentLoaded', () => {
    // Resolve quiz data: prefer global quizData; else parse from embedded JSON script.
    let resolvedQuizData = (typeof quizData !== 'undefined') ? quizData : null;
    if (!resolvedQuizData) {
        const dataScript = document.getElementById('quiz-data');
        if (dataScript) {
            try { resolvedQuizData = JSON.parse(dataScript.textContent); } catch (e) { console.error('Failed to parse embedded quiz data JSON', e); }
        }
    }
    if (!resolvedQuizData) {
        console.error("Quiz data is not loaded. Make sure to include a question data file or embed JSON with id 'quiz-data'.");
        return;
    }

    // Quiz State
    let currentQuestionIndex = 0;
    let userAnswers = new Array(resolvedQuizData.length).fill(null);
    let questionStatus = new Array(resolvedQuizData.length).fill('not-visited');
    let timerInterval;

    // DOM Elements
    const instructionsContainer = document.getElementById('instructions-container');
    const quizInterface = document.getElementById('quiz-interface');
    const startBtn = document.getElementById('start-test-btn');
    const timerInput = document.getElementById('timer-input');
    const timerDisplay = document.getElementById('timer-display');
    const questionCountInput = document.getElementById('question-count-input');
    const questionHeaderEl = document.getElementById('question-header');
    const questionContentEl = document.getElementById('question-content');
    const optionsListEl = document.getElementById('options-list');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const markReviewBtn = document.getElementById('mark-review-btn');
    const paletteContainer = document.getElementById('question-palette');
    const submitBtn = document.getElementById('submit-test-btn');
    const resultsContainer = document.getElementById('results-container');
    const resultsSummaryEl = document.getElementById('results-summary');
    const detailedResultsEl = document.getElementById('detailed-results');

    function startTimer(duration) {
        let timer = duration * 60;
        timerInterval = setInterval(() => {
            let hours = Math.floor(timer / 3600);
            let minutes = Math.floor((timer % 3600) / 60);
            let seconds = timer % 60;

            hours = hours < 10 ? "0" + hours : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;

            if (--timer < 0) {
                clearInterval(timerInterval);
                alert("Time's up!");
                submitTest();
            }
        }, 1000);
    }

    function startTest() {
        const duration = parseInt(timerInput.value, 10);
        if (isNaN(duration) || duration <= 0) {
            alert("Please enter a valid time in minutes.");
            return;
        }
        // Determine how many questions to use
        let desiredCount = resolvedQuizData.length;
        if (questionCountInput) {
            const n = parseInt(questionCountInput.value, 10);
            if (!isNaN(n) && n > 0) {
                desiredCount = Math.min(Math.max(1, n), resolvedQuizData.length);
            }
        }
        // Choose first N by default; if you want randomness, shuffle deterministically later
        if (desiredCount < resolvedQuizData.length) {
            resolvedQuizData = resolvedQuizData.slice(0, desiredCount);
        }
        // Reset state arrays to selected length
        currentQuestionIndex = 0;
        userAnswers = new Array(resolvedQuizData.length).fill(null);
        questionStatus = new Array(resolvedQuizData.length).fill('not-visited');
        instructionsContainer.style.display = 'none';
        quizInterface.style.display = 'block';
        startTimer(duration);
        renderQuestion();
        renderPalette();
    }
    
    function renderQuestion() {
    const currentQuestion = resolvedQuizData[currentQuestionIndex];
        
        questionHeaderEl.innerHTML = `
            <span class="question-number">Question ${currentQuestionIndex + 1}</span>
            <div class="marks">
                <span class="mark-tag positive">+4</span>
                <span class="mark-tag negative">-1</span>
            </div>
        `;
        questionContentEl.innerHTML = `<p>${currentQuestion.question}</p>`;
        
        optionsListEl.innerHTML = '';
        currentQuestion.options.forEach((option, index) => {
            const optionId = `q${currentQuestionIndex}-opt${index}`;
            const isChecked = userAnswers[currentQuestionIndex] === option;
            optionsListEl.innerHTML += `
                <li class="option-item">
                    <label for="${optionId}">
                        <input type="radio" name="question${currentQuestionIndex}" id="${optionId}" value="${option}" ${isChecked ? 'checked' : ''}>
                        <span>${option}</span>
                    </label>
                </li>
            `;
        });

        optionsListEl.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', (e) => {
                userAnswers[currentQuestionIndex] = e.target.value;
                if (questionStatus[currentQuestionIndex] !== 'review' && questionStatus[currentQuestionIndex] !== 'answered-review') {
                    questionStatus[currentQuestionIndex] = 'answered';
                }
                renderPalette();
            });
        });

        prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.textContent = (currentQuestionIndex === resolvedQuizData.length - 1) ? 'Submit Test' : 'Save & Next';
    }
    
    function renderPalette() {
        paletteContainer.innerHTML = '';
    resolvedQuizData.forEach((_, index) => {
            const btn = document.createElement('button');
            btn.textContent = index + 1;
            btn.classList.add('palette-btn');
            if (index === currentQuestionIndex) btn.classList.add('current');
            
            const status = questionStatus[index];
            if (status === 'answered') btn.classList.add('answered');
            if (status === 'review') btn.classList.add('review');
            if (status === 'answered-review') btn.classList.add('answered', 'review');

            btn.addEventListener('click', () => jumpToQuestion(index));
            paletteContainer.appendChild(btn);
        });
    }
    
    function handleNext() {
         if (currentQuestionIndex === resolvedQuizData.length - 1) {
            if (confirm('Are you sure you want to submit the test?')) {
                submitTest();
            }
        } else {
            currentQuestionIndex++;
            renderQuestion();
            renderPalette();
        }
    }
    
    function handlePrev() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
            renderPalette();
        }
    }
    
    function handleMarkReview() {
        const currentStatus = questionStatus[currentQuestionIndex];
        if (currentStatus === 'review' || currentStatus === 'answered-review') {
            questionStatus[currentQuestionIndex] = userAnswers[currentQuestionIndex] ? 'answered' : 'not-visited';
        } else {
            questionStatus[currentQuestionIndex] = userAnswers[currentQuestionIndex] ? 'answered-review' : 'review';
        }
        renderPalette();
    if (currentQuestionIndex < resolvedQuizData.length - 1) handleNext();
    }

    function jumpToQuestion(index) {
        currentQuestionIndex = index;
        renderQuestion();
        renderPalette();
    }

    function submitTest() {
        clearInterval(timerInterval);
        let score = 0;
        let correct = 0;
        let incorrect = 0;
        let unanswered = 0;

    resolvedQuizData.forEach((q, index) => {
            if (userAnswers[index] === null) {
                unanswered++;
            } else if (userAnswers[index] === q.answer) {
                score += 4;
                correct++;
            } else {
                score -= 1;
                incorrect++;
            }
        });
        
        quizInterface.style.display = 'none';
        resultsContainer.style.display = 'block';

        resultsSummaryEl.innerHTML = `
            <h2>Final Score: ${score} / ${resolvedQuizData.length * 4}</h2>
            <p><strong>Correct Answers:</strong> ${correct}</p>
            <p><strong>Incorrect Answers:</strong> ${incorrect}</p>
            <p><strong>Unanswered:</strong> ${unanswered}</p>
        `;

        detailedResultsEl.innerHTML = '<h3>Detailed Analysis</h3>';
    resolvedQuizData.forEach((q, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === q.answer;
            
            if (userAnswer === null || !isCorrect) {
                const resultClass = userAnswer === null ? '' : 'incorrect-answer';
                detailedResultsEl.innerHTML += `
                    <div class="result-question">
                        <p><strong>Q${index + 1}:</strong> ${q.question}</p>
                        <p>Your Answer: <span class="${resultClass}">${userAnswer || 'Not Answered'}</span></p>
                        <p>Correct Answer: <span class="correct-answer">${q.answer}</span></p>
                        <div class="solution"><strong>Solution:</strong> ${q.solution}</div>
                    </div>
                `;
            }
        });
    }
    
    // Event Listeners
    startBtn.addEventListener('click', startTest);
    nextBtn.addEventListener('click', handleNext);
    prevBtn.addEventListener('click', handlePrev);
    markReviewBtn.addEventListener('click', handleMarkReview);
    submitBtn.addEventListener('click', () => {
         if (confirm('Are you sure you want to submit the test?')) {
            submitTest();
        }
    });
});

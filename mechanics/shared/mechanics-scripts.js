// Dark mode functionality
document.addEventListener('DOMContentLoaded', function() {
    const lightModeBtn = document.getElementById('light-mode');
    const darkModeBtn = document.getElementById('dark-mode');
    const body = document.body;

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        lightModeBtn.classList.remove('active');
        darkModeBtn.classList.add('active');
    }

    lightModeBtn.addEventListener('click', () => {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        lightModeBtn.classList.add('active');
        darkModeBtn.classList.remove('active');
    });

    darkModeBtn.addEventListener('click', () => {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        lightModeBtn.classList.remove('active');
        darkModeBtn.classList.add('active');
    });

    // Progress tracking
    function updateProgress() {
        const completed = getCompletedChapters();
        const completedElement = document.getElementById('completed-chapters');
        if (completedElement) {
            completedElement.textContent = completed;
        }
        
        // Update progress bars
        Object.keys(chapterProgress).forEach(chapter => {
            const progressBar = document.querySelector(`[data-chapter="${chapter}"] .progress-bar`);
            if (progressBar) {
                progressBar.style.width = `${chapterProgress[chapter]}%`;
            }
        });
    }

    // Mock progress data - replace with actual tracking
    const chapterProgress = {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
        '6': 0,
        '7': 0
    };

    function getCompletedChapters() {
        return Object.values(chapterProgress).filter(progress => progress === 100).length;
    }

    // Initialize progress
    updateProgress();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll reveal animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Load saved progress
    const savedProgress = localStorage.getItem('chapterProgress');
    if (savedProgress) {
        Object.assign(chapterProgress, JSON.parse(savedProgress));
        updateProgress();
    }

    // Initialize quiz if elements exist
    if (document.getElementById('quizContainer')) {
        initializeQuiz();
    }
});

// Interactive Quiz Functionality - Global scope
const quizData = [
    {
        question: "Which of the following is a fundamental SI unit?",
        options: ["Newton", "Joule", "Watt", "Kilogram"],
        correct: 3,
        explanation: "The kilogram is one of the seven SI base units. Newton, Joule, and Watt are derived units."
    },
    {
        question: "The principle of homogeneity states that:",
        options: [
            "All physical quantities must have the same units",
            "An equation must be dimensionally consistent",
            "The universe is uniform and homogeneous",
            "Derived units are homogeneous with fundamental units"
        ],
        correct: 1,
        explanation: "The principle of homogeneity requires that both sides of any valid physical equation have the same dimensions."
    },
    {
        question: "The dimension of force (F = ma) is:",
        options: ["MLT⁻²", "ML²T⁻²", "ML⁻¹T⁻²", "M⁻¹L³T⁻²"],
        correct: 0,
        explanation: "Force = mass × acceleration = [M][LT⁻²] = MLT⁻²"
    },
    {
        question: "A light-year is a unit of:",
        options: ["Time", "Mass", "Distance", "Energy"],
        correct: 2,
        explanation: "A light-year is the distance that light travels in one year, making it a unit of length/distance."
    },
    {
        question: "Which measurement has exactly 3 significant figures?",
        options: ["0.00450", "1050", "1.050 × 10³", "45.0"],
        correct: 3,
        explanation: "45.0 has exactly 3 significant figures due to the decimal point making the trailing zero significant."
    },
    {
        question: "In dimensional analysis, [ML²T⁻²] represents the dimension of:",
        options: ["Force", "Energy", "Power", "Momentum"],
        correct: 1,
        explanation: "Energy has dimensions of [ML²T⁻²]. Force is [MLT⁻²], Power is [ML²T⁻³], and Momentum is [MLT⁻¹]."
    },
    {
        question: "The current definition of the kilogram is based on:",
        options: ["A platinum-iridium prototype", "Planck's constant", "The mass of a carbon-12 atom", "Avogadro's number"],
        correct: 1,
        explanation: "Since 2019, the kilogram is defined using Planck's constant, making it fundamentally based on quantum mechanics."
    },
    {
        question: "When adding measurements 15.67 + 0.943 - 12.2, the result should have:",
        options: ["1 decimal place", "2 decimal places", "3 decimal places", "4 significant figures"],
        correct: 0,
        explanation: "The result is limited by 12.2, which has only 1 decimal place. The answer is 4.4."
    },
    {
        question: "Order of magnitude estimation is useful for:",
        options: ["Precise calculations only", "Quick sanity checks", "Legal measurements", "Scientific constants"],
        correct: 1,
        explanation: "Order of magnitude estimation helps physicists make quick approximations and verify if detailed calculations are reasonable."
    },
    {
        question: "The SI prefix 'micro' (μ) represents:",
        options: ["10⁻⁶", "10⁻⁹", "10⁻³", "10⁻¹²"],
        correct: 0,
        explanation: "The prefix 'micro' (μ) represents 10⁻⁶. Nano is 10⁻⁹, milli is 10⁻³, and pico is 10⁻¹²."
    }
];

let currentQuizState = {
    answers: new Array(quizData.length).fill(null),
    score: 0,
    submitted: false
};

function initializeQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    const totalQuestions = document.getElementById('totalQuestions');
    
    if (!quizContainer) return;
    
    totalQuestions.textContent = quizData.length;
    
    // Clear container
    quizContainer.innerHTML = '';
    
    // Generate quiz questions
    quizData.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question';
        questionDiv.innerHTML = `
            <h4>Question ${index + 1}: ${question.question}</h4>
            <div class="quiz-options">
                ${question.options.map((option, optionIndex) => `
                    <label class="quiz-option" data-question="${index}" data-option="${optionIndex}">
                        <input type="radio" name="question${index}" value="${optionIndex}">
                        <span>${option}</span>
                    </label>
                `).join('')}
            </div>
            <div class="quiz-explanation" id="explanation${index}" style="display: none;">
                <p><strong>Explanation:</strong> ${question.explanation}</p>
            </div>
        `;
        quizContainer.appendChild(questionDiv);
    });

    // Add event listeners for option selection
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', handleOptionClick);
    });

    // Reset quiz state
    currentQuizState = {
        answers: new Array(quizData.length).fill(null),
        score: 0,
        submitted: false
    };

    updateQuizProgress();
    document.getElementById('submitQuiz').style.display = 'none';
    document.getElementById('quizResults').style.display = 'none';
}

function handleOptionClick(event) {
    if (currentQuizState.submitted) return;

    const questionIndex = parseInt(event.currentTarget.dataset.question);
    const optionIndex = parseInt(event.currentTarget.dataset.option);
    
    // Update state
    currentQuizState.answers[questionIndex] = optionIndex;
    
    // Update UI
    const questionDiv = event.currentTarget.closest('.quiz-question');
    questionDiv.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Check radio button
    const radio = event.currentTarget.querySelector('input[type="radio"]');
    radio.checked = true;

    updateQuizProgress();
    
    // Show submit button if all questions answered
    const allAnswered = currentQuizState.answers.every(answer => answer !== null);
    if (allAnswered) {
        document.getElementById('submitQuiz').style.display = 'inline-block';
    }
}

function updateQuizProgress() {
    const answeredCount = currentQuizState.answers.filter(answer => answer !== null).length;
    const progressPercent = (answeredCount / quizData.length) * 100;
    
    document.getElementById('progressFill').style.width = `${progressPercent}%`;
    document.getElementById('currentScore').textContent = answeredCount;
    
    // Update mastery level based on progress
    const masteryLevel = document.getElementById('masteryLevel');
    if (answeredCount === 0) {
        masteryLevel.textContent = 'Not Started';
        masteryLevel.className = 'mastery-level';
    } else if (answeredCount < quizData.length) {
        masteryLevel.textContent = 'In Progress';
        masteryLevel.className = 'mastery-level';
    } else {
        masteryLevel.textContent = 'Ready to Submit';
        masteryLevel.className = 'mastery-level';
    }
}

function submitQuiz() {
    if (currentQuizState.submitted) return;
    
    currentQuizState.submitted = true;
    let correctAnswers = 0;

    // Calculate score and show explanations
    quizData.forEach((question, index) => {
        const userAnswer = currentQuizState.answers[index];
        const isCorrect = userAnswer === question.correct;
        
        if (isCorrect) correctAnswers++;

        // Update question display
        const questionDiv = document.querySelector(`[data-question="${index}"]`).closest('.quiz-question');
        const options = questionDiv.querySelectorAll('.quiz-option');
        const explanation = document.getElementById(`explanation${index}`);
        
        options.forEach((option, optionIndex) => {
            option.style.pointerEvents = 'none';
            
            if (optionIndex === question.correct) {
                option.classList.add('correct');
            } else if (optionIndex === userAnswer && userAnswer !== question.correct) {
                option.classList.add('incorrect');
            }
        });
        
        explanation.style.display = 'block';
    });

    currentQuizState.score = correctAnswers;
    showQuizResults(correctAnswers);
}

function showQuizResults(score) {
    const percentage = Math.round((score / quizData.length) * 100);
    
    // Determine mastery level
    let masteryLevel, masteryClass, recommendations;
    
    if (percentage >= 90) {
        masteryLevel = 'Expert';
        masteryClass = 'expert';
        recommendations = 'Excellent! You have mastered the fundamentals of measurement. Consider exploring advanced topics in physics.';
    } else if (percentage >= 75) {
        masteryLevel = 'Advanced';
        masteryClass = 'advanced';
        recommendations = 'Great work! You have a solid understanding. Review the questions you missed and practice more problems.';
    } else if (percentage >= 60) {
        masteryLevel = 'Intermediate';
        masteryClass = 'intermediate';
        recommendations = 'Good progress! Focus on reviewing significant figures and dimensional analysis concepts.';
    } else {
        masteryLevel = 'Beginner';
        masteryClass = 'beginner';
        recommendations = 'Keep studying! Review the chapter content and practice more problems before retaking the quiz.';
    }

    // Update results display
    document.getElementById('finalScore').textContent = `${score}/${quizData.length} (${percentage}%)`;
    
    const masteryBadge = document.getElementById('masteryBadge');
    masteryBadge.textContent = `${masteryLevel} Level`;
    masteryBadge.className = `mastery-badge ${masteryClass}`;
    
    // Performance breakdown
    const breakdown = document.getElementById('performanceBreakdown');
    breakdown.innerHTML = `
        <h4>📊 Performance Breakdown</h4>
        <p><strong>Correct answers:</strong> ${score}/${quizData.length}</p>
        <p><strong>Accuracy:</strong> ${percentage}%</p>
        <p><strong>Mastery level:</strong> ${masteryLevel}</p>
    `;
    
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = `
        <h4>📚 Recommendations</h4>
        <p>${recommendations}</p>
    `;
    
    // Update progress tracking
    updateChapterProgress(1, percentage);
    
    // Show results
    document.getElementById('quizResults').style.display = 'block';
    document.getElementById('submitQuiz').style.display = 'none';
    
    // Scroll to results
    document.getElementById('quizResults').scrollIntoView({ behavior: 'smooth' });
}

function updateChapterProgress(chapterNumber, percentage) {
    // Get current progress data
    const savedProgress = localStorage.getItem('chapterProgress');
    const chapterProgress = savedProgress ? JSON.parse(savedProgress) : {};
    
    chapterProgress[chapterNumber] = percentage;
    localStorage.setItem('chapterProgress', JSON.stringify(chapterProgress));
    
    // Update any progress displays
    const progressElement = document.querySelector(`[data-chapter="${chapterNumber}"] .progress-bar`);
    if (progressElement) {
        progressElement.style.width = `${percentage}%`;
    }
}

function resetQuiz() {
    initializeQuiz();
    document.getElementById('quizResults').style.display = 'none';
}

// Event listeners for quiz controls
document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('submitQuiz');
    const resetButton = document.getElementById('resetQuiz');
    const retakeButton = document.getElementById('retakeQuiz');
    
    if (submitButton) {
        submitButton.addEventListener('click', submitQuiz);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetQuiz);
    }
    
    if (retakeButton) {
        retakeButton.addEventListener('click', resetQuiz);
    }
});

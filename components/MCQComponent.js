// components/MCQComponent.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from '../styles/MCQ.module.css';
import useMathJax from '../hooks/useMathJax';

export default function MCQComponent({ 
  questions = [], 
  timeLimit = 900, // 15 minutes default
  showReview = true,
  onQuizComplete = null 
}) {
  // New state for quiz selection
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [numQuestions, setNumQuestions] = useState(25);
  const [allQuestions] = useState(questions); // Store original questions
  
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [questionStatus, setQuestionStatus] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [customTimeLimit, setCustomTimeLimit] = useState(15); // Default 15 minutes
  
  useMathJax([selectedQuestions, currentQuestionIndex, isFinished]);
  
  // Initialize arrays when quiz starts
  useEffect(() => {
    if (selectedQuestions.length > 0) {
      setUserAnswers(new Array(selectedQuestions.length).fill(null));
      setQuestionStatus(new Array(selectedQuestions.length).fill('not-visited'));
    }
  }, [selectedQuestions]);
  
  // Shuffle and select random questions
  const selectRandomQuestions = (allQuestions, count) => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, allQuestions.length));
  };
  
  // Format time for display (HH:MM:SS)
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Submit the test and calculate results
  const submitTest = useCallback(() => {
    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    
    selectedQuestions.forEach((q, index) => {
      if (userAnswers[index] === null) {
        unanswered++;
      } else if (userAnswers[index] === q.answer) {
        score += 4; // +4 for correct answer
        correct++;
      } else {
        score -= 1; // -1 for incorrect answer
        incorrect++;
      }
    });
    
    setIsFinished(true);
    
    if (onQuizComplete) {
      onQuizComplete({
        score,
        totalQuestions: selectedQuestions.length,
        correct,
        incorrect,
        unanswered,
        userAnswers
      });
    }
  }, [selectedQuestions, userAnswers, onQuizComplete]);

  // Start the quiz with custom time limit
  const startQuiz = () => {
    const duration = parseInt(customTimeLimit, 10);
    if (isNaN(duration) || duration <= 0) {
      alert("Please enter a valid time in minutes.");
      return;
    }
    
    // Select random questions based on user choice
    const randomQuestions = selectRandomQuestions(allQuestions, numQuestions);
    setSelectedQuestions(randomQuestions);
    
    setShowInstructions(false);
    setTimeLeft(duration * 60);
    setCurrentQuestionIndex(0);
    
    // Will be set by useEffect when selectedQuestions updates
  };
  
  // Timer effect
  useEffect(() => {
    if (showInstructions || isFinished || selectedQuestions.length === 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          submitTest();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [showInstructions, isFinished, selectedQuestions.length, submitTest]);
  
  // Handle option selection
  const handleAnswerSelect = (option) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = option;
    setUserAnswers(newAnswers);
    
    // Update status based on current state
    const newStatus = [...questionStatus];
    const currentState = questionStatus[currentQuestionIndex];
    
    if (currentState === 'review') {
      // If marked for review, make it answered-review
      newStatus[currentQuestionIndex] = 'answered-review';
    } else if (currentState === 'answered-review') {
      // Keep it as answered-review
      newStatus[currentQuestionIndex] = 'answered-review';
    } else {
      // Normal answered state
      newStatus[currentQuestionIndex] = 'answered';
    }
    
    setQuestionStatus(newStatus);
  };
  
  // Handle next question
  const handleNext = () => {
    if (currentQuestionIndex === selectedQuestions.length - 1) {
      if (confirm('Are you sure you want to submit the test?')) {
        submitTest();
      }
    } else {
      // Update current question marker
      const newStatus = [...questionStatus];
      if (newStatus[currentQuestionIndex] === 'current') {
        newStatus[currentQuestionIndex] = 'not-visited';
      }
      newStatus[currentQuestionIndex + 1] = 'current';
      setQuestionStatus(newStatus);
      
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Handle previous question
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      // Update current question marker
      const newStatus = [...questionStatus];
      if (newStatus[currentQuestionIndex] === 'current') {
        newStatus[currentQuestionIndex] = 'not-visited';
      }
      newStatus[currentQuestionIndex - 1] = 'current';
      setQuestionStatus(newStatus);
      
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Handle mark for review - FIXED: Don't move to next question
  const handleMarkReview = () => {
    const currentStatus = questionStatus[currentQuestionIndex];
    const newStatus = [...questionStatus];
    const hasAnswer = userAnswers[currentQuestionIndex] !== null;
    
    if (currentStatus === 'review' || currentStatus === 'answered-review') {
      // Unmark for review
      newStatus[currentQuestionIndex] = hasAnswer ? 'answered' : 'not-visited';
    } else {
      // Mark for review
      newStatus[currentQuestionIndex] = hasAnswer ? 'answered-review' : 'review';
    }
    
    setQuestionStatus(newStatus);
    // Removed the automatic move to next question
  };
  
  // Jump to a specific question from the palette
  const jumpToQuestion = (index) => {
    // Update current question marker
    const newStatus = [...questionStatus];
    if (newStatus[currentQuestionIndex] === 'current') {
      newStatus[currentQuestionIndex] = 'not-visited';
    }
    newStatus[index] = 'current';
    setQuestionStatus(newStatus);
    
    setCurrentQuestionIndex(index);
  };
  
  // Reset the quiz to start again
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuestionStatus([]);
    setSelectedQuestions([]);
    setIsFinished(false);
    setShowInstructions(true);
    setTimeLeft(timeLimit);
  };
  
  // Calculate score percentage and grade
  const getScorePercentage = () => {
    let score = 0;
    selectedQuestions.forEach((q, index) => {
      if (userAnswers[index] === q.answer) score += 4;
      else if (userAnswers[index] !== null) score -= 1;
    });
    const maxScore = selectedQuestions.length * 4;
    return Math.round((score / maxScore) * 100);
  };
  
  const getScoreGrade = () => {
    const percentage = getScorePercentage();
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Good';
    if (percentage >= 70) return 'Average';
    if (percentage >= 60) return 'Below Average';
    return 'Poor';
  };
  
  // Error state
  if (!questions || questions.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <h3>No questions available</h3>
        <p>Please check back later or contact support.</p>
      </div>
    );
  }
  
  // Instructions screen
  if (showInstructions) {
    return (
      <div className={styles.instructionsContainer} id="instructions-container">
        <h2>Measurement and Units Assessment Quiz</h2>
        <p>This quiz will test your understanding of physical quantities, units, dimensions and measurement techniques.</p>
        
        <ul>
          <li><strong>Total questions:</strong> {numQuestions}</li>
          <li><strong>Marking scheme:</strong> +4 for correct answer, -1 for incorrect answer, 0 for not answered</li>
          <li><strong>Question types:</strong> Multiple choice questions</li>
        </ul>
        
        <div className={styles.quizSetup}>
          <div className={styles.setupItem}>
            <label htmlFor="question-count-select">Number of questions:</label>
            <select 
              id="question-count-select"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className={styles.setupSelect}
            >
              <option value={10}>10 Questions</option>
              <option value={25}>25 Questions</option>
              <option value={40}>40 Questions</option>
              <option value={50}>50 Questions</option>
              <option value={75}>75 Questions</option>
              <option value={100}>100 Questions</option>
            </select>
          </div>
          
          <div className={styles.setupItem}>
            <label htmlFor="timer-input">Set time limit (minutes):</label>
            <input 
              type="number" 
              id="timer-input" 
              min="1" 
              max="180" 
              value={customTimeLimit} 
              onChange={(e) => setCustomTimeLimit(e.target.value)}
            />
          </div>
          
          <button 
            id="start-test-btn" 
            className="btn btn-primary" 
            onClick={startQuiz}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }
  
  // Results screen
  if (isFinished) {
    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    
    selectedQuestions.forEach((q, index) => {
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
    
    const percentage = getScorePercentage();
    const grade = getScoreGrade();
    const maxScore = selectedQuestions.length * 4;
    
    return (
      <div className={styles.resultsContainer} id="results-container">
        <div className={styles.resultsSummary} id="results-summary">
          <div className={styles.celebrationHeader}>
            <h2>Quiz Completed! 🎉</h2>
            {percentage >= 70 && <div className={styles.confetti}>🎊</div>}
          </div>
          
          <div className={styles.scoreDisplay}>
            <div className={styles.scoreCard}>
              <div className={styles.mainScore}>
                <span className={styles.scoreNumber}>{score}</span>
                <span className={styles.scoreTotal}>/ {maxScore}</span>
              </div>
              <div className={styles.scorePercentage}>{percentage}%</div>
              <div className={`${styles.scoreGrade} ${styles[grade.toLowerCase().replace(' ', '')]}`}>
                {grade}
              </div>
            </div>
          </div>
          
          <div className={styles.performanceMetrics}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>✅</div>
              <div className={styles.metricValue}>{correct}</div>
              <div className={styles.metricLabel}>Correct</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>❌</div>
              <div className={styles.metricValue}>{incorrect}</div>
              <div className={styles.metricLabel}>Incorrect</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>⏸️</div>
              <div className={styles.metricValue}>{unanswered}</div>
              <div className={styles.metricLabel}>Skipped</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>📊</div>
              <div className={styles.metricValue}>{Math.round((correct/selectedQuestions.length)*100)}%</div>
              <div className={styles.metricLabel}>Accuracy</div>
            </div>
          </div>
          
          <div className={styles.actionButtons}>
            <button onClick={resetQuiz} className={styles.retakeButton}>
              🔄 Retake Quiz
            </button>
          </div>
        </div>

        {/* Only show detailed review for poor performance */}
        {showReview && percentage < 70 && (
          <div className={styles.detailedResults} id="detailed-results">
            <div className={styles.analysisHeader}>
              <h3>📋 Questions to Review</h3>
              <div className={styles.analysisStats}>
                <span className={styles.statBadge}>
                  {selectedQuestions.filter((_, i) => userAnswers[i] === null || userAnswers[i] !== selectedQuestions[i].answer).length} questions need attention
                </span>
              </div>
            </div>
            
            <div className={styles.reviewList}>
              {selectedQuestions.map((question, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === question.answer;
                const isUnanswered = userAnswer === null;
                
                // Only show incorrect or unanswered questions in detailed analysis
                if (isUnanswered || !isCorrect) {
                  return (
                    <div key={index} className={styles.reviewItem}>
                      <div className={styles.reviewQuestion}>
                        <span className={styles.questionBadge}>Q{index + 1}</span>
                        <div className={styles.questionText}>
                          <div dangerouslySetInnerHTML={{ __html: question.question }} />
                        </div>
                      </div>
                      
                      <div className={styles.reviewAnswer}>
                        <div className={`${styles.answerStatus} ${isUnanswered ? styles.unanswered : styles.incorrect}`}>
                          <div className={styles.statusIcon}>
                            {isUnanswered ? '⏸️' : '❌'}
                          </div>
                          <div className={styles.statusText}>
                            {isUnanswered ? 'Not Answered' : 'Incorrect Answer'}
                          </div>
                        </div>
                        
                        <div className={styles.answerBreakdown}>
                          {!isUnanswered && (
                            <div className={styles.answerDetail}>
                              <strong>Your Answer:</strong> 
                              <span className={styles.userAnswer} dangerouslySetInnerHTML={{ __html: userAnswer }} />
                            </div>
                          )}
                          
                          <div className={styles.answerDetail}>
                            <strong>Correct Answer:</strong> 
                            <span className={styles.correctAnswer} dangerouslySetInnerHTML={{ __html: question.answer }} />
                          </div>
                          
                          {question.solution && (
                            <div className={styles.explanationSection}>
                              <div className={styles.explanationHeader}>
                                <strong>💡 Explanation:</strong>
                              </div>
                              <div className={styles.explanationContent} dangerouslySetInnerHTML={{ __html: question.solution }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* Smart Navigation Section - Always show after quiz completion */}
        <div className={styles.smartNavigation}>
          <div className={styles.navigationHeader}>
            <h3>🎯 What's Next?</h3>
            <p className={styles.recommendationText}>
              {percentage < 60 
                ? "Don't worry! Let's strengthen your foundation with some practice problems."
                : percentage < 80
                ? "Good job! Ready to move forward and tackle new challenges."
                : "Excellent work! You're ready for the next chapter."
              }
            </p>
          </div>
          
          <div className={styles.navigationCards}>
            {percentage < 70 ? (
              // Poor performance - recommend practice (Easy → Medium → Hard progression)
              <>
                <Link href="/mechanics/measurements/numerical" className={styles.navCard}>
                  <div className={styles.navIcon}>🧮</div>
                  <h4>Practice Numerical Problems</h4>
                  <p>Start with easy problems and work your way up to harder challenges</p>
                  <span className={styles.navBadge}>Recommended</span>
                </Link>
                <Link href="/mechanics/measurements/conceptual" className={styles.navCard}>
                  <div className={styles.navIcon}>🤔</div>
                  <h4>Review Conceptual Questions</h4>
                  <p>Understand the theory before tackling complex problems</p>
                </Link>
              </>
            ) : (
              // Good performance - move to next chapter
              <>
                <Link href="/mechanics/foundations" className={styles.navCard}>
                  <div className={styles.navIcon}>🚀</div>
                  <h4>Next Chapter: Foundations</h4>
                  <p>Continue your journey with the fundamentals of classical mechanics</p>
                  <span className={styles.navBadge}>Next</span>
                </Link>
                <Link href="/mechanics/measurements/numerical" className={styles.navCard}>
                  <div className={styles.navIcon}>💪</div>
                  <h4>Extra Practice</h4>
                  <p>Challenge yourself with additional numerical problems</p>
                </Link>
              </>
            )}

            <Link href="/mechanics/measurements" className={styles.navCard}>
              <div className={styles.navIcon}>📖</div>
              <h4>Review Theory</h4>
              <p>Go back to the main chapter for a comprehensive review</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Quiz interface
  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const progress = selectedQuestions.length > 0 ? ((currentQuestionIndex + 1) / selectedQuestions.length) * 100 : 0;
  
  return (
    <div className={styles.testContainer}>
      <div className={styles.testMain} id="quiz-interface">
        <div className={styles.quizHeader}>
          <div className={styles.progressSection}>
            <div className={styles.progressText}>
              Question {currentQuestionIndex + 1} of {selectedQuestions.length}
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
          <div className={`${styles.timer} ${timeLeft < 60 ? styles.timerWarning : ''}`} id="timer-display">
            <span className={styles.timerIcon}>⏱️</span>
            <span className={styles.timerText}>Time Left: {formatTime(timeLeft)}</span>
          </div>
        </div>
        
        <div className={styles.questionHeader} id="question-header">
          <span className={styles.questionNumber}>Question {currentQuestionIndex + 1}</span>
          <div className={styles.marks}>
            <span className={`${styles.markTag} ${styles.positive}`}>+4</span>
            <span className={`${styles.markTag} ${styles.negative}`}>-1</span>
          </div>
        </div>
        <div className={styles.contentScroll}>
          <div className={styles.questionContent} id="question-content">
            <div dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
          </div>
          
          <div className={styles.optionsList} id="options-list">
            {currentQuestion.options && currentQuestion.options.map((option, index) => (
              <div key={index} className={styles.optionItem}>
                <label htmlFor={`q${currentQuestionIndex}-opt${index}`}>
                  <input 
                    type="radio" 
                    id={`q${currentQuestionIndex}-opt${index}`} 
                    name={`question${currentQuestionIndex}`} 
                    value={option}
                    checked={userAnswers[currentQuestionIndex] === option}
                    onChange={() => handleAnswerSelect(option)}
                  />
                  <span dangerouslySetInnerHTML={{ __html: option }} />
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.quizNavigation}>
          <button 
            type="button" 
            id="prev-btn" 
            onClick={handlePrev} 
            disabled={currentQuestionIndex === 0}
            className={`${styles.navButton} ${currentQuestionIndex === 0 ? styles.disabled : ''}`}
          >
            Previous
          </button>
          
          <button 
            type="button" 
            id="mark-review-btn"
            onClick={handleMarkReview}
            className={`${styles.reviewButton} ${
              questionStatus[currentQuestionIndex] === 'review' || 
              questionStatus[currentQuestionIndex] === 'answered-review' 
                ? styles.active : ''
            }`}
          >
            {questionStatus[currentQuestionIndex] === 'review' || 
             questionStatus[currentQuestionIndex] === 'answered-review'
              ? 'Unmark for Review'
              : 'Mark for Review'
            }
          </button>
          
          <button 
            type="button" 
            id="next-btn"
            onClick={() => {
              if (currentQuestionIndex < selectedQuestions.length - 1) {
                handleNext();
              } else {
                if (confirm('Are you sure you want to submit the test?')) {
                  submitTest();
                }
              }
            }}
            className={styles.nextButton}
          >
            {currentQuestionIndex < selectedQuestions.length - 1 ? 'Save & Next' : 'Submit Test'}
          </button>
        </div>
      </div>
      
      <div className={styles.testSidebar}>
        <div className={styles.sidebarHeader}>Question Palette</div>
        <div className={styles.questionPalette} id="question-palette">
          {selectedQuestions.map((_, index) => {
            let buttonClasses = styles.paletteBtn;
            
            if (index === currentQuestionIndex) {
              buttonClasses += ` ${styles.current}`;
            }
            
            if (questionStatus[index] === 'answered') {
              buttonClasses += ` ${styles.answered}`;
            }
            
            if (questionStatus[index] === 'review') {
              buttonClasses += ` ${styles.review}`;
            }
            
            if (questionStatus[index] === 'answered-review') {
              buttonClasses += ` ${styles.answered} ${styles.review}`;
            }
            
            return (
              <button 
                key={index}
                className={buttonClasses}
                onClick={() => jumpToQuestion(index)}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        
        <div className={styles.sidebarActions}>
          <button 
            type="button" 
            id="submit-test-btn" 
            className={styles.submitButton}
            onClick={() => {
              if (confirm('Are you sure you want to submit the test?')) {
                submitTest();
              }
            }}
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
}

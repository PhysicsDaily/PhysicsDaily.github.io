// components/MCQComponent.js
import { useState, useEffect, useCallback } from 'react';
import styles from '../styles/MCQ.module.css';

export default function MCQComponent({ 
  questions = [], 
  timeLimit = 900, // 15 minutes default
  showReview = true,
  onQuizComplete = null 
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizStartTime] = useState(new Date());

  const finishQuiz = useCallback(() => {
    const endTime = new Date();
    const timeTaken = Math.floor((endTime - quizStartTime) / 1000);
    
    setIsFinished(true);
    
    if (onQuizComplete) {
      onQuizComplete({
        score,
        totalQuestions: questions.length,
        timeTaken,
        userAnswers
      });
    }
  }, [score, questions.length, quizStartTime, userAnswers, onQuizComplete]);

  useEffect(() => {
    if (isFinished || questions.length === 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isFinished, questions.length, finishQuiz]);

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  const handleNextQuestion = () => {
    if (!questions[currentQuestionIndex]) return;
    
    const isCorrect = selectedAnswer === questions[currentQuestionIndex].answer;
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }

    const newAnswer = {
      questionIndex: currentQuestionIndex,
      question: questions[currentQuestionIndex].question,
      selected: selectedAnswer,
      correct: questions[currentQuestionIndex].answer,
      isCorrect: isCorrect,
      explanation: questions[currentQuestionIndex].explanation || null
    };

    setUserAnswers(prevAnswers => [...prevAnswers, newAnswer]);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
    setTimeLeft(timeLimit);
    setUserAnswers([]);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScorePercentage = () => {
    return Math.round((score / questions.length) * 100);
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

  // Results screen
  if (isFinished) {
    const percentage = getScorePercentage();
    const grade = getScoreGrade();
    
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.resultsHeader}>
          <h2>Quiz Completed! 🎉</h2>
          <div className={styles.scoreDisplay}>
            <div className={styles.mainScore}>
              <span className={styles.scoreNumber}>{score}</span>
              <span className={styles.scoreTotal}>/ {questions.length}</span>
            </div>
            <div className={styles.scorePercentage}>{percentage}%</div>
            <div className={`${styles.scoreGrade} ${styles[grade.toLowerCase().replace(' ', '')]}`}>
              {grade}
            </div>
          </div>
        </div>

        <div className={styles.resultsActions}>
          <button onClick={resetQuiz} className={styles.retakeButton}>
            Retake Quiz
          </button>
        </div>

        {showReview && userAnswers.length > 0 && (
          <div className={styles.reviewSection}>
            <h3>Review Your Answers</h3>
            <div className={styles.reviewList}>
              {userAnswers.map((answer, index) => (
                <div key={index} className={styles.reviewItem}>
                  <div className={styles.reviewQuestion}>
                    <span className={styles.questionNumber}>Q{index + 1}</span>
                    <span className={styles.questionText}>{answer.question}</span>
                  </div>
                  <div className={styles.reviewAnswer}>
                    <div className={`${styles.answerStatus} ${answer.isCorrect ? styles.correct : styles.incorrect}`}>
                      <span className={styles.statusIcon}>
                        {answer.isCorrect ? '✓' : '✗'}
                      </span>
                      <span className={styles.statusText}>
                        {answer.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <div className={styles.answerDetails}>
                      <p><strong>Your answer:</strong> {answer.selected || 'No answer selected'}</p>
                      {!answer.isCorrect && (
                        <p><strong>Correct answer:</strong> {answer.correct}</p>
                      )}
                      {answer.explanation && (
                        <p className={styles.explanation}><strong>Explanation:</strong> {answer.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Quiz interface
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className={styles.quizInterface}>
      <div className={styles.quizHeader}>
        <div className={styles.progressSection}>
          <div className={styles.progressText}>
            Question {currentQuestionIndex + 1} of {questions.length}
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
        <div className={`${styles.timer} ${timeLeft < 60 ? styles.timerWarning : ''}`}>
          <span className={styles.timerIcon}>⏱️</span>
          <span className={styles.timerText}>Time Left: {formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className={styles.questionContainer}>
        <h3 className={styles.questionText}>{currentQuestion.question}</h3>
      </div>

      <div className={styles.optionsContainer}>
        {currentQuestion.options && currentQuestion.options.map((option, index) => (
          <button
            key={index}
            type="button"
            className={`${styles.optionButton} ${selectedAnswer === option ? styles.selected : ''}`}
            onClick={() => handleAnswerSelect(option)}
            aria-pressed={selectedAnswer === option}
          >
            <span className={styles.optionLetter}>{String.fromCharCode(65 + index)}</span>
            <span className={styles.optionText}>{option}</span>
          </button>
        ))}
      </div>

      <div className={styles.navigationContainer}>
        <button
          type="button"
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          className={`${styles.nextButton} ${!selectedAnswer ? styles.disabled : ''}`}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          <span className={styles.buttonIcon}>→</span>
        </button>
      </div>
    </div>
  );
}

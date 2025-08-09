// components/MCQComponent.js
import { useState, useEffect } from 'react';
import styles from '../styles/MCQ.module.css';

export default function MCQComponent({ questions }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    if (isFinished) return;
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
  }, [isFinished]);

  //

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  const handleNextQuestion = () => {
    const isCorrect = selectedAnswer === questions[currentQuestionIndex].answer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setUserAnswers([...userAnswers, {
      question: questions[currentQuestionIndex].question,
      selected: selectedAnswer,
      correct: questions[currentQuestionIndex].answer,
      isCorrect: isCorrect,
    }]);

    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isFinished) {
    return (
  <div className={styles.resultsContainer}>
        <h2>Quiz Completed!</h2>
        <p className={styles.finalScore}>Your Score: {score} out of {questions.length}</p>
        <div className={styles.review}>
          <h3>Review Your Answers:</h3>
          {userAnswers.map((ua, index) => (
            <div key={index} className={styles.reviewItem}>
              <p><strong>Q{index + 1}:</strong> {ua.question}</p>
              <p className={ua.isCorrect ? styles.correct : styles.incorrect}>
                Your answer: {ua.selected} {ua.isCorrect ? ' (Correct)' : ` (Incorrect, correct was ${ua.correct})`}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
  <div className={styles.quizInterface}>
      <div className={styles.quizHeader}>
        <div className={styles.progress}>
          Question {currentQuestionIndex + 1} of {questions.length}
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className={styles.timer}>Time Left: {formatTime(timeLeft)}</div>
      </div>
      <div className={styles.questionContainer}>
  <h3>{currentQuestion.question}</h3>
      </div>
      <div className={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            className={`${styles.option} ${selectedAnswer === option ? styles.selected : ''}`}
            onClick={() => handleAnswerSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className={styles.navigation}>
        <button
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          className={styles.nextButton}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      </div>
    </div>
  );
}

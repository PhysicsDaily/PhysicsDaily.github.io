// components/Quiz.js
import { useState, useEffect, useRef } from 'react';
import useMathJax from '../hooks/useMathJax';
import styles from '../styles/Quiz.module.css';

export default function Quiz({ quizData }) {
  // State variables to manage the quiz
  const [gameState, setGameState] = useState('setup'); // 'setup', 'active', 'finished'
  const [settings, setSettings] = useState({ count: 10, time: 60 });
  const [activeQuiz, setActiveQuiz] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [questionStatus, setQuestionStatus] = useState([]); // 'not-visited', 'answered', 'review', 'answered-review'
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const quizRootRef = useRef(null);

  // Effect to handle the timer countdown
  useEffect(() => {
    if (gameState === 'active') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            submitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(timer);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  // MathJax: typeset whenever the active question or game state changes
  useMathJax(quizRootRef, [gameState, currentQuestionIndex, activeQuiz]);
  
  // --- Setup Phase ---
  const handleSettingChange = (e) => {
    setSettings({ ...settings, [e.target.name]: parseInt(e.target.value) });
  };

  const startTest = () => {
    const shuffled = [...quizData].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, settings.count);
    
    setActiveQuiz(selectedQuestions);
    setUserAnswers(new Array(settings.count).fill(null));
    setQuestionStatus(new Array(settings.count).fill('not-visited'));
    setTimeLeft(settings.time * 60);
    setCurrentQuestionIndex(0);
    setGameState('active');
  };

  // --- Active Quiz Phase ---
  const handleAnswerSelect = (option) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = option;
    setUserAnswers(newAnswers);

    const newStatus = [...questionStatus];
    if (newStatus[currentQuestionIndex] !== 'review' && newStatus[currentQuestionIndex] !== 'answered-review') {
        newStatus[currentQuestionIndex] = 'answered';
    } else {
        newStatus[currentQuestionIndex] = 'answered-review';
    }
    setQuestionStatus(newStatus);
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleMarkReview = () => {
    const newStatus = [...questionStatus];
    const currentStatus = newStatus[currentQuestionIndex];
    if(currentStatus === 'review' || currentStatus === 'answered-review') {
        newStatus[currentQuestionIndex] = userAnswers[currentQuestionIndex] ? 'answered' : 'not-visited';
    } else {
        newStatus[currentQuestionIndex] = userAnswers[currentQuestionIndex] ? 'answered-review' : 'review';
    }
    setQuestionStatus(newStatus);
    if (currentQuestionIndex < activeQuiz.length - 1) handleNext();
  };
  
  const jumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };
  
  const submitTest = () => {
    clearInterval(timerInterval);
    let score = 0, correct = 0, incorrect = 0, unanswered = 0;
    activeQuiz.forEach((q, index) => {
        if (userAnswers[index] === null) unanswered++;
        else if (userAnswers[index] === q.answer) {
            score += 4; correct++;
        } else {
            score -= 1; incorrect++;
        }
    });
    setFinalScore({ score, correct, incorrect, unanswered });
    setGameState('finished');
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // --- Render Logic ---

  if (gameState === 'setup') {
    return (
      <div className={styles.instructionsContainer} ref={quizRootRef}>
        <h2>📝 Instructions</h2>
        <ul>
          <li>Select the number of questions and set your desired timer.</li>
          <li>Each correct answer awards <strong>+4 marks</strong>.</li>
          <li>Each incorrect answer results in a penalty of <strong>-1 mark</strong>.</li>
          <li>Use the question palette to navigate between questions.</li>
        </ul>
        <div className={styles.quizSetup}>
          <div className={styles.setupItem}>
            <label htmlFor="question-count">Number of Questions:</label>
            {/* THIS IS THE MODIFIED PART */}
            <select id="question-count" name="count" value={settings.count} onChange={handleSettingChange}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="75">75</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className={styles.setupItem}>
            <label htmlFor="timer-input">Set Timer (minutes):</label>
            <input type="number" id="timer-input" name="time" value={settings.time} onChange={handleSettingChange} min="1" />
          </div>
        </div>
        <button onClick={startTest} className={`btn ${styles.startBtn}`}>Start Test</button>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
        <div className={styles.resultsContainer} ref={quizRootRef}>
             <div className={styles.resultsSummary}>
                <h2>Quiz Results</h2>
                <p>Final Score: {finalScore.score} / {activeQuiz.length * 4}</p>
                <span>Correct: {finalScore.correct}</span> | <span>Incorrect: {finalScore.incorrect}</span> | <span>Unanswered: {finalScore.unanswered}</span>
             </div>
             <div className={styles.detailedResults}>
                <h3>Detailed Analysis</h3>
                {activeQuiz.map((q, index) => {
                    const userAnswer = userAnswers[index];
                    const isCorrect = userAnswer === q.answer;
                    if(isCorrect && userAnswer !== null) return null; // Don't show correct answers to keep it concise
                    return (
                        <div key={index} className={styles.resultQuestion}>
                            <p><strong>Q{index + 1}:</strong> <span dangerouslySetInnerHTML={{ __html: q.question }} /></p>
                            <p>Your Answer: <span className={userAnswer === null ? '' : styles.incorrectAnswer}>{userAnswer || 'Not Answered'}</span></p>
                            <p>Correct Answer: <span className={styles.correctAnswer}>{q.answer}</span></p>
                            {q.solution && <div className={styles.solution} dangerouslySetInnerHTML={{ __html: '<strong>Solution:</strong> ' + q.solution }} />}
                        </div>
                    );
                })}
             </div>
             <button onClick={() => setGameState('setup')} className="btn">Take Another Test</button>
        </div>
    );
  }

  const currentQuestion = activeQuiz[currentQuestionIndex];

  return (
    <div className={styles.testContainer}>
      <div className={styles.testMain}>
        <div className={styles.timerContainer}>
            <div className={styles.timerLabel}>Time Remaining</div>
            <div className={styles.timerDisplay}>{formatTime(timeLeft)}</div>
        </div>
        <div className={styles.questionHeader}>
            <span className={styles.questionNumber}>Question {currentQuestionIndex + 1}</span>
            <div className={styles.marks}><span className={`${styles.markTag} ${styles.positive}`}>+4</span><span className={`${styles.markTag} ${styles.negative}`}>-1</span></div>
        </div>
        <div className={styles.questionContent}><p dangerouslySetInnerHTML={{ __html: currentQuestion.question }} /></div>
        <div className={styles.optionsList}>
            {currentQuestion.options.map((option, index) => (
                <div key={index} className={styles.optionItem}>
                    <label>
                        <input type="radio" name={`q${currentQuestionIndex}`} value={option} checked={userAnswers[currentQuestionIndex] === option} onChange={() => handleAnswerSelect(option)} />
                        <span>{option}</span>
                    </label>
                </div>
            ))}
        </div>
        <div className={styles.quizNavigation}>
            <button onClick={handlePrev} disabled={currentQuestionIndex === 0} className="btn btn-secondary">Previous</button>
            <button onClick={handleMarkReview} className="btn btn-secondary">Mark for Review</button>
            <button onClick={handleNext} className="btn">Save & Next</button>
        </div>
      </div>
      <aside className={styles.testSidebar}>
        <div className={styles.sidebarHeader}>Question Palette</div>
        <div className={styles.questionPalette}>
            {activeQuiz.map((_, index) => (
                <button key={index} 
                    className={`${styles.paletteBtn} ${currentQuestionIndex === index ? styles.current : ''} ${styles[questionStatus[index]]}`}
                    onClick={() => jumpToQuestion(index)}>
                    {index + 1}
                </button>
            ))}
        </div>
        <button onClick={() => { if(confirm('Are you sure you want to submit?')) submitTest(); }} className="btn" style={{width: '100%'}}>Submit Test</button>
      </aside>
    </div>
  );
}

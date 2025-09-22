// Page-specific bootstrap for the Chapter 3 Force and Newton's Laws quiz.
document.addEventListener('DOMContentLoaded', () => {
  if (typeof QuizManager !== 'function') {
    console.error('QuizManager is not available. Ensure /assets/js/quiz-manager.js loads first.');
    return;
  }

  new QuizManager({
    dataUrl: '/assets/js/mcq-data/chapter3-force-newton.json',
    maxQuestions: 20,
    defaultTime: 10,
    positiveMarks: 4,
    negativeMarks: 1
  });
});


// hooks/useMathJax.js
import { useEffect } from 'react';

export default function useMathJax(deps = []) {
  useEffect(() => {
    const renderMath = () => {
      if (typeof window !== 'undefined' && window.MathJax) {
        if (window.MathJax.typeset) {
          window.MathJax.typeset();
        } else if (window.MathJax.Hub) {
          window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
        }
      }
    };

    // If MathJax is already loaded, render immediately
    if (typeof window !== 'undefined' && window.MathJax) {
      renderMath();
    } else {
      // Otherwise, wait for MathJax to load
      const checkMathJax = setInterval(() => {
        if (typeof window !== 'undefined' && window.MathJax) {
          renderMath();
          clearInterval(checkMathJax);
        }
      }, 100);

      // Clean up interval after 10 seconds
      setTimeout(() => clearInterval(checkMathJax), 10000);

      return () => clearInterval(checkMathJax);
    }
  }, deps);
}

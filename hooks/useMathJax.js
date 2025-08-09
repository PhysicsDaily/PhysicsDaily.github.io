// hooks/useMathJax.js
import { useEffect } from 'react';

export default function useMathJax(deps = []) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.MathJax && window.MathJax.typeset) {
      window.MathJax.typeset();
    }
  }, deps);
}

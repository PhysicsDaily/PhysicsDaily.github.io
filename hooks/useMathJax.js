// hooks/useMathJax.js
import { useEffect } from 'react';

/**
 * useMathJax
 * Triggers MathJax v3 typesetting for the whole document or a specific element.
 * Call this after content updates that may include TeX/MathML.
 *
 * @param {React.RefObject<HTMLElement>|null} rootRef - Optional ref to scope typesetting.
 * @param {Array<any>} deps - Dependency array; when values change, typeset runs.
 */
export default function useMathJax(rootRef = null, deps = []) {
  useEffect(() => {
    const el = rootRef && rootRef.current ? rootRef.current : document.body;
    const typeset = async () => {
      if (typeof window === 'undefined' || !window.MathJax || !window.MathJax.typesetPromise) return;
      try {
        await window.MathJax.typesetPromise([el]);
      } catch (e) {
        // swallow errors to avoid noisy logs in production
      }
    };
    typeset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// hooks/useScrollAnimation.js
import { useEffect } from 'react';

const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1, // Trigger when 10% of the element is visible
    });

    const elementsToAnimate = document.querySelectorAll('.fade-in');
    elementsToAnimate.forEach(el => observer.observe(el));

    // Cleanup function to disconnect the observer when the component is unmounted
    return () => {
      elementsToAnimate.forEach(el => observer.unobserve(el));
    };
  }, []); // The empty array ensures this effect runs only once
};

export default useScrollAnimation;

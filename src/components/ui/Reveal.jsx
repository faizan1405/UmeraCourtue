'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function Reveal({ children, className = '', delay = 0, duration = 800, threshold = 0.05 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const style = {
    transitionDelay: `${delay}ms`,
    transitionDuration: `${duration}ms`,
  };

  return (
    <div
      ref={ref}
      className={`reveal-item ${isVisible ? 'is-visible' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

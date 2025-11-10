import { useEffect, useRef, useState } from 'react';

export const useParallax = (speed = 0.5) => {
  const elementRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const elementTop = rect.top + scrolled;
      const windowHeight = window.innerHeight;
      
      // Calculate parallax offset
      if (rect.top < windowHeight && rect.bottom > 0) {
        const yPos = -(scrolled - elementTop) * speed;
        setOffset(yPos);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return [elementRef, offset];
};

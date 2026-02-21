import { useState, useEffect, useCallback } from 'react';

const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    if (typeof window !== 'undefined') {
      return Boolean(localStorage.getItem('hc_mode'));
    }
    return false;
  });

  const toggle = useCallback(() => {
    setIsHighContrast((hc) => {
      const next = !hc;
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('high-contrast', next);
      }
      try {
        if (next) {
          localStorage.setItem('hc_mode', '1');
        } else {
          localStorage.removeItem('hc_mode');
        }
      } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('high-contrast', isHighContrast);
    }
  }, [isHighContrast]);

  return { isHighContrast, toggle };
};

export { useHighContrast };

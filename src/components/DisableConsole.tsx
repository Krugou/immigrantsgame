'use client';
import { useEffect } from 'react';

const DisableConsole: React.FC = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      const noop = () => {};
      const methods: Array<keyof Console> = ['log', 'info', 'warn', 'error', 'debug', 'trace'];
      methods.forEach((m) => {
        try {
          // @ts-expect-error assigning to console methods intentionally
          console[m] = noop;
        } catch (_e) {
          // ignore if assignment fails in some environments
        }
      });
    }
  }, []);

  return null;
};

export default DisableConsole;

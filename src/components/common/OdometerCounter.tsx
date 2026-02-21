'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, MotionValue } from 'framer-motion';

/* ── Single animated digit ──────────────────────────────────────────── */

interface DigitProps {
  value: number;
}

const Digit: React.FC<DigitProps> = ({ value }) => {
  const spring = useSpring(value, { stiffness: 120, damping: 20, mass: 0.8 });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <span
      className="inline-block relative overflow-hidden"
      style={{ width: '0.65em', height: '1.15em' }}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
        <DigitSpan key={d} digit={d} spring={spring} />
      ))}
    </span>
  );
};

interface DigitSpanProps {
  digit: number;
  spring: MotionValue<number>;
}

const DigitSpan: React.FC<DigitSpanProps> = ({ digit, spring }) => {
  const y = useTransform(spring, (v) => {
    const diff = digit - (v % 10);
    // Wrap around: find shortest distance in the 0-9 ring
    const wrapped = ((diff % 10) + 10) % 10;
    const offset = wrapped > 5 ? wrapped - 10 : wrapped;
    return offset * -1.15; // em units
  });

  return (
    <motion.span
      className="absolute left-0 top-0 tabular-nums"
      style={{ y: useTransform(y, (v) => `${v}em`) }}
    >
      {digit}
    </motion.span>
  );
};

/* ── Separator (comma / period) ─────────────────────────────────────── */

const Separator: React.FC<{ char: string }> = ({ char }) => (
  <span className="inline-block" style={{ width: '0.35em' }}>
    {char}
  </span>
);

/* ── Main component ────────────────────────────────────────────────── */

interface OdometerCounterProps {
  value: number;
  className?: string;
}

/**
 * Odometer-style animated population counter.
 * Each digit rolls independently using framer-motion springs.
 */
const OdometerCounter: React.FC<OdometerCounterProps> = ({ value, className = '' }) => {
  const formatted = Math.floor(Math.abs(value)).toLocaleString();
  const prevRef = useRef(formatted);

  useEffect(() => {
    prevRef.current = formatted;
  }, [formatted]);

  // Split into characters: digits and separators
  const chars = formatted.split('');

  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        className={`inline-flex items-baseline ${className}`}
        aria-label={`Population: ${formatted}`}
        role="status"
      >
        {chars.map((char, i) => {
          const isDigit = /\d/.test(char);
          if (isDigit) {
            return <Digit key={`d-${chars.length - i}`} value={parseInt(char, 10)} />;
          }
          return <Separator key={`s-${i}`} char={char} />;
        })}
      </motion.span>
    </AnimatePresence>
  );
};

export default OdometerCounter;

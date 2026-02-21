'use client';

import { useCallback, useRef, useState } from 'react';

const STORAGE_KEY = 'immigrants_sound_muted';

/**
 * Procedural sound engine using the Web Audio API.
 * Generates synthetic sounds — no audio files needed.
 */
export const useSoundEngine = () => {
  const ctxRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === 'true';
  });

  // Lazily create AudioContext on first interaction
  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  /** Short, bright click sound for buttons */
  const playClick = useCallback(() => {
    if (isMuted) {
      return;
    }
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }, [isMuted, getCtx]);

  /** Triumphant ascending chime for Era transitions */
  const playEraChime = useCallback(() => {
    if (isMuted) {
      return;
    }
    const ctx = getCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const startTime = ctx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain).connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.7);
    });
  }, [isMuted, getCtx]);

  /** Subtle milestone tone — two-note arpeggio */
  const playMilestone = useCallback(() => {
    if (isMuted) {
      return;
    }
    const ctx = getCtx();
    [440, 554.37].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      const t = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.35);
    });
  }, [isMuted, getCtx]);

  /** Low rumble for disaster events — sawtooth wave at ~120Hz */
  const playDisaster = useCallback(() => {
    if (isMuted) {
      return;
    }
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.55);
  }, [isMuted, getCtx]);

  /** Warm chime for immigration events — sine at ~660Hz */
  const playImmigration = useCallback(() => {
    if (isMuted) {
      return;
    }
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  }, [isMuted, getCtx]);

  return {
    isMuted,
    toggleMute,
    playClick,
    playEraChime,
    playMilestone,
    playDisaster,
    playImmigration,
  };
};

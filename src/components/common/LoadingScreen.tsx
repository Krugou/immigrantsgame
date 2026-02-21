'use client';

import React, { useState, useEffect } from 'react';
import Logo from './Logo';

interface LoadingScreenProps {
  onFinished?: () => void;
}

const messages = [
  'Calibrating orbital sensors...',
  'Syncing territory data...',
  'Waking up sleepers...',
  'Initializing population protocols...',
  'Optimizing transit routes...',
  'Establishing secure uplink...',
  'Mapping sector boundaries...',
  'Heating up the reactors...',
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Progress interval
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 5;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 100);

    // Message interval
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
    };
  }, []);

  useEffect(() => {
    // always return cleanup function
    let timeout: NodeJS.Timeout | undefined;
    if (progress === 100) {
      timeout = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          if (onFinished) {
            onFinished();
          }
        }, 800); // Wait for fade-out animation
      }, 500);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [progress, onFinished]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-cinematic-bg transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none scale-105'
      }`}
    >
      {/* Background with blur and dark overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/cover.png")',
          filter: 'brightness(0.3) blur(4px)',
        }}
      />

      {/* Vignette effect */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle,transparent_20%,rgba(13,17,23,0.8)_100%)]" />

      <div className="relative z-20 flex flex-col items-center max-w-xl w-full px-8">
        <Logo className="mb-12 w-full transform scale-110" />

        <div className="w-full space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-brand-primary font-mono text-[10px] tracking-widest uppercase opacity-70">
              {messages[messageIndex]}
            </span>
            <span className="text-white font-mono text-xs">{Math.floor(progress)}%</span>
          </div>

          <div className="w-full h-1 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
            <div
              className="h-full bg-brand-primary shadow-[0_0_15px_rgba(88,166,255,0.6)] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center opacity-30">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-brand-primary rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
            <span className="text-[8px] text-slate-400 font-mono tracking-tighter">
              SYSTEM_BOOT_SEQUENCE_ALPHA_V4.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence, type Easing } from 'framer-motion';

const easeOut: Easing = [0.0, 0.0, 0.2, 1.0];

interface EraOverlayProps {
  eraName: string;
  quote: string;
  imagePath: string;
  onFinished: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, staggerChildren: 0.3 } },
  exit: { opacity: 0, transition: { duration: 1 } },
};

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
};

const dividerVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.6, ease: easeOut } },
};

const EraOverlay: React.FC<EraOverlayProps> = ({ eraName, quote, imagePath, onFinished }) => {
  useEffect(() => {
    const timer = setTimeout(onFinished, 7000); // Auto-dismiss after 7s
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-60 flex flex-col items-center justify-center bg-black"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Cinematic Background Image with Ken Burns */}
        <motion.div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${imagePath}")`,
            filter: 'brightness(0.4)',
          }}
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 10, ease: 'linear' }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

        {/* Content */}
        <motion.div
          className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl"
          variants={overlayVariants}
        >
          <motion.div className="mb-4" variants={childVariants}>
            <span className="text-brand-primary font-mono text-xs tracking-[0.5em] uppercase opacity-70">
              Evolution Detected
            </span>
            <h2 className="text-5xl md:text-7xl font-black italic text-white mt-2 tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {eraName}
            </h2>
          </motion.div>

          <motion.div
            className="w-24 h-px bg-brand-primary/50 mb-8 origin-center"
            variants={dividerVariants}
          />

          <motion.p
            className="text-xl md:text-2xl text-slate-300 font-light italic leading-relaxed"
            variants={childVariants}
          >
            &ldquo;{quote}&rdquo;
          </motion.p>

          <motion.button
            onClick={onFinished}
            className="mt-12 text-[10px] font-mono tracking-[0.3em] text-slate-500 uppercase hover:text-white transition-colors cursor-pointer"
            variants={childVariants}
            whileHover={{ scale: 1.05 }}
          >
            Click to continue sequence
          </motion.button>
        </motion.div>

        {/* Decorative corners */}
        <div className="absolute top-12 left-12 w-12 h-12 border-t border-l border-brand-primary/30" />
        <div className="absolute top-12 right-12 w-12 h-12 border-t border-r border-brand-primary/30" />
        <div className="absolute bottom-12 left-12 w-12 h-12 border-b border-l border-brand-primary/30" />
        <div className="absolute bottom-12 right-12 w-12 h-12 border-b border-r border-brand-primary/30" />
      </motion.div>
    </AnimatePresence>
  );
};

export default EraOverlay;

import React from 'react';
import { colors } from '../../lib/colors';

interface LogoProps {
  className?: string;
  withSubtitle?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', withSubtitle = false }) => (
  <div className={`flex flex-col items-center ${className}`}>
    <svg
      viewBox="0 0 500 80"
      className="w-full h-auto drop-shadow-[0_0_10px_rgba(88,166,255,0.8)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="500" height="80" fill="transparent" />
      {/* Main Text: THE IMMIGRANTS */}
      <text
        x="50%"
        y="60"
        textAnchor="middle"
        className="font-black italic"
        fill="white"
        style={{
          fontSize: '52px',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}
      >
        The{' '}
        <tspan fill={colors.logoAccent} className="drop-shadow-[0_0_15px_rgba(88,166,255,1)]">
          Immigrants
        </tspan>
      </text>

      {/* Decorative lines inspired by the cover image */}
      <path
        d="M20 15 H140 M360 15 H480"
        stroke={colors.logoAccent}
        strokeWidth="2"
        strokeOpacity="0.5"
      />
      <path
        d="M20 15 V25 M480 15 V25"
        stroke={colors.logoAccent}
        strokeWidth="2"
        strokeOpacity="0.5"
      />
    </svg>

    {withSubtitle && (
      <div className="mt-2 text-brand-primary font-mono text-xs tracking-[0.3em] uppercase animate-pulse">
        Initializing Population Protocols...
      </div>
    )}
  </div>
);

export default Logo;

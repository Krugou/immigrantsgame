'use client';

import React, { useRef, useEffect, useCallback } from 'react';

interface StarFieldProps {
  /** Total population — drives star density and color variation */
  population: number;
  /** Number of unlocked territories — drives nebula intensity */
  territoryCount: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  hue: number;
}

const StarField: React.FC<StarFieldProps> = ({ population, territoryCount }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);

  // Calculate star count based on population (logarithmic scale, capped at 400)
  const starCount = Math.min(400, 50 + Math.floor(Math.log10(Math.max(1, population)) * 30));

  const createStars = useCallback(
    (width: number, height: number) => {
      const stars: Star[] = [];
      for (let i = 0; i < starCount; i++) {
        // Hue shifts based on territory count (more territories = more blue/purple)
        const baseHue = 200 + territoryCount * 8;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.3 + 0.05,
          opacity: Math.random() * 0.8 + 0.2,
          hue: baseHue + Math.random() * 40 - 20,
        });
      }
      return stars;
    },
    [starCount, territoryCount],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      // no canvas, nothing to animate – return a no-op cleanup to keep returns consistent
      return () => {};
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      // no drawing context, return a no-op cleanup
      return () => {};
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsRef.current = createStars(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      // ctx and canvas are guaranteed to exist at this point (checked above);
      // drop the early return so the function never explicitly returns a value
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle nebula gradient in the background
      if (territoryCount > 3) {
        const gradient = ctx.createRadialGradient(
          canvas.width * 0.7,
          canvas.height * 0.3,
          0,
          canvas.width * 0.7,
          canvas.height * 0.3,
          canvas.width * 0.5,
        );
        const nebulaOpacity = Math.min(0.08, territoryCount * 0.008);
        gradient.addColorStop(0, `rgba(88, 166, 255, ${nebulaOpacity})`);
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${nebulaOpacity * 0.5})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw and animate stars
      for (const star of starsRef.current) {
        star.y -= star.speed;
        if (star.y < -2) {
          star.y = canvas.height + 2;
          star.x = Math.random() * canvas.width;
        }

        // Twinkle effect
        const twinkle = 0.5 + 0.5 * Math.sin(Date.now() * 0.002 + star.x);
        const finalOpacity = star.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.hue}, 80%, 80%, ${finalOpacity})`;
        ctx.fill();

        // Glow for larger stars
        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${star.hue}, 80%, 80%, ${finalOpacity * 0.1})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [createStars, territoryCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      role="img"
      aria-hidden="false"
      aria-label={`Star field; population ${population}, ${territoryCount} territories`}
    />
  );
};

export default StarField;

'use client';

import { useMemo } from 'react';

export type BackgroundTheme = 'cyber' | 'aurora' | 'minimal' | 'sunset' | 'ocean';

interface Orb {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

const themeColors: Record<BackgroundTheme, string[]> = {
  cyber: [
    'hsl(217 91% 60% / 0.15)',
    'hsl(38 92% 50% / 0.12)',
    'hsl(280 70% 50% / 0.1)',
    'hsl(160 70% 40% / 0.08)',
  ],
  aurora: [
    'hsl(160 70% 50% / 0.15)',
    'hsl(200 80% 50% / 0.12)',
    'hsl(280 60% 60% / 0.1)',
    'hsl(320 70% 50% / 0.08)',
  ],
  minimal: [
    'hsl(0 0% 50% / 0.08)',
    'hsl(0 0% 40% / 0.06)',
    'hsl(0 0% 60% / 0.05)',
    'hsl(0 0% 30% / 0.04)',
  ],
  sunset: [
    'hsl(20 90% 50% / 0.15)',
    'hsl(350 80% 50% / 0.12)',
    'hsl(40 90% 50% / 0.1)',
    'hsl(280 50% 40% / 0.08)',
  ],
  ocean: [
    'hsl(200 80% 50% / 0.15)',
    'hsl(180 70% 40% / 0.12)',
    'hsl(220 60% 50% / 0.1)',
    'hsl(160 50% 40% / 0.08)',
  ],
};

interface AnimatedBackgroundProps {
  theme?: BackgroundTheme;
}

export function AnimatedBackground({ theme = 'cyber' }: AnimatedBackgroundProps) {
  const orbs = useMemo<Orb[]>(() => {
    const colors = themeColors[theme];
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 200 + Math.random() * 400,
      color: colors[i % colors.length],
      delay: i * 1.5,
      duration: 15 + Math.random() * 10,
    }));
  }, [theme]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
      
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full blur-3xl animate-float-slow"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            animationDelay: `${orb.delay}s`,
            animationDuration: `${orb.duration}s`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-pulse-slow" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30 animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>
      
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)"/>
        </svg>
      </div>
    </div>
  );
}

export default AnimatedBackground;


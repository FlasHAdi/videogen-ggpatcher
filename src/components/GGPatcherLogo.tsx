import React from 'react';

interface GGPatcherLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showUrl?: boolean;
  animated?: boolean;
  className?: string;
}

export const GGPatcherLogo: React.FC<GGPatcherLogoProps> = ({
  size = 'md',
  showUrl = true,
  animated = true,
  className = '',
}) => {
  const scaleMap = {
    sm: 'scale-75',
    md: 'scale-100',
    lg: 'scale-125',
    hero: 'scale-110 sm:scale-150',
  };

  return (
    <div className={`flex flex-col items-center justify-center select-none ${scaleMap[size]} ${className}`}>
      {/* 3D Geometric Interlocking GG Emblem */}
      <div className="relative flex items-center justify-center">
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full transform scale-150 pointer-events-none animate-pulse" />

        <div className="relative flex items-center gap-4">
          <svg
            className={`w-28 h-28 drop-shadow-[0_0_25px_rgba(56,189,248,0.65)] ${
              animated ? 'animate-[spin_20s_linear_infinite]' : ''
            }`}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="ggGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              <linearGradient id="ggGradWhite" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#bae6fd" />
              </linearGradient>
              <linearGradient id="ggGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0c4a6e" />
                <stop offset="100%" stopColor="#032541" />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Left G Prism Link */}
            <g transform="translate(10, 0)">
              {/* Outer faceted polygons forming G1 */}
              <polygon
                points="40,60 70,30 100,60 85,75 70,60 55,75 55,125 70,140 100,110 100,125 70,155 40,125"
                fill="url(#ggGradWhite)"
                filter="url(#neonGlow)"
              />
              <polygon
                points="70,30 100,60 90,70 70,50"
                fill="#f0f9ff"
                opacity="0.9"
              />
              <polygon
                points="55,125 70,140 60,150 40,125"
                fill="#93c5fd"
              />
            </g>

            {/* Right G Prism Link (Interlocking) */}
            <g transform="translate(45, 15)">
              <polygon
                points="60,45 90,15 120,45 105,60 90,45 75,60 75,110 90,125 120,95 120,110 90,140 60,110"
                fill="url(#ggGradCyan)"
                filter="url(#neonGlow)"
              />
              <polygon
                points="90,15 120,45 110,55 90,35"
                fill="#7dd3fc"
              />
              <polygon
                points="75,110 90,125 80,135 60,110"
                fill="#0284c7"
              />
            </g>

            {/* Central energy node */}
            <circle cx="100" cy="100" r="8" fill="#38bdf8" className="animate-ping" opacity="0.75" />
            <circle cx="100" cy="100" r="4" fill="#ffffff" />
          </svg>

          {/* Typography */}
          <div className="flex flex-col">
            <div className="flex items-center tracking-tight">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-wider drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)]">
                GG
              </span>
              <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-300 to-white ml-2 tracking-wide drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                Patcher
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-[2px] w-6 bg-cyan-400" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-cyan-200/80 font-mono">
                HIGH SPEED GAMING CLIENT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Holographic Glowing URL Capsule */}
      {showUrl && (
        <div className="relative mt-8 group">
          {/* Border Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition duration-700 animate-pulse" />
          
          <div className="relative px-7 py-2.5 rounded-full bg-[#0a1120]/90 border border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-md flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <a
              href="https://ggpatcher.com"
              target="_blank"
              rel="noreferrer"
              className="text-base sm:text-lg font-mono text-cyan-300 font-semibold tracking-wider hover:text-white transition-colors"
            >
              https://ggpatcher.com
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

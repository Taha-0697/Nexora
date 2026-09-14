import React from 'react';

interface NexoraLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Precision Vector Emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        {/* Soft Ambient Aura */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-sky-500/20 blur-md -z-10 group-hover:scale-110 transition-transform duration-300" />
        
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Light Mode Gradient */}
            <linearGradient id="nexoraGradLight" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>

            {/* Dark Mode Gradient */}
            <linearGradient id="nexoraGradDark" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>

            {/* Facet 1 Gradient */}
            <linearGradient id="facet1" x1="14" y1="12" x2="24" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>

            {/* Facet 2 Gradient */}
            <linearGradient id="facet2" x1="20" y1="14" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4338ca" />
            </linearGradient>

            {/* Facet 3 Gradient */}
            <linearGradient id="facet3" x1="24" y1="14" x2="34" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>

          {/* Outer Hexagonal Structure */}
          <polygon
            points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"
            className="stroke-indigo-600/30 dark:stroke-sky-400/40"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Inner Geometric "N" Structure with 3D Facets */}
          {/* Left Stem */}
          <path
            d="M14 34V14L20 17.5V37.5L14 34Z"
            className="fill-indigo-600 dark:fill-sky-400 opacity-90 transition-colors"
          />
          
          {/* Diagonal Crossbar */}
          <path
            d="M20 17.5L28 30.5V36L20 23V17.5Z"
            className="fill-blue-600 dark:fill-indigo-400 opacity-95 transition-colors"
          />

          {/* Right Stem */}
          <path
            d="M28 10.5L34 14V34L28 30.5V10.5Z"
            className="fill-teal-600 dark:fill-teal-400 opacity-90 transition-colors"
          />

          {/* Central Highlight Node Connection */}
          <circle cx="24" cy="24" r="2.2" className="fill-white dark:fill-sky-200" />

          {/* Vertex Nodes */}
          <circle cx="24" cy="3" r="2" className="fill-indigo-600 dark:fill-sky-400" />
          <circle cx="42" cy="13.5" r="2" className="fill-blue-600 dark:fill-indigo-400" />
          <circle cx="42" cy="34.5" r="2" className="fill-teal-600 dark:fill-teal-400" />
          <circle cx="24" cy="45" r="2" className="fill-indigo-600 dark:fill-sky-400" />
          <circle cx="6" cy="34.5" r="2" className="fill-blue-600 dark:fill-indigo-400" />
          <circle cx="6" cy="13.5" r="2" className="fill-teal-600 dark:fill-teal-400" />
        </svg>
      </div>

      {/* Typography Brand Mark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors duration-200 ${titleSizes[size]}`}
          >
            NEXORA
          </span>
          <span className="text-[10px] sm:text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 tracking-wider">
            SYS
          </span>
        </div>
        {showSubtitle && (
          <p
            className={`tracking-wider uppercase font-semibold text-slate-500 dark:text-slate-400 transition-colors ${subtitleSizes[size]}`}
          >
            Custom ERP • Web Portals • Apps
          </p>
        )}
      </div>
    </div>
  );
};


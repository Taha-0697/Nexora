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
      {/* Precision Vector Emblem (Calm, Eye-Friendly Tones) */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        {/* Ambient Aura */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-indigo-500/15 via-blue-500/10 to-sky-400/15 blur-md -z-10 group-hover:scale-105 transition-transform duration-300" />
        
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs transition-transform duration-300 group-hover:scale-102"
        >
          <defs>
            {/* Eye-Friendly Calibrated Soft Gradients */}
            <linearGradient id="logoPrimaryGrad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4338ca" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>

            <linearGradient id="logoDarkGrad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            <linearGradient id="stemGrad" x1="14" y1="14" x2="20" y2="37.5" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>

            <linearGradient id="crossGrad" x1="20" y1="17.5" x2="28" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            <linearGradient id="rightGrad" x1="28" y1="10.5" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
          </defs>

          {/* Outer Symmetric Hexagonal Enclosure */}
          <polygon
            points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"
            className="stroke-indigo-400/40 dark:stroke-sky-400/30"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Precision 3D Geometric "N" */}
          {/* Left Pillar */}
          <path
            d="M14 34V14L20 17.5V37.5L14 34Z"
            className="fill-indigo-600 dark:fill-indigo-400 opacity-90 transition-colors"
          />
          
          {/* Central Connecting Strut */}
          <path
            d="M20 17.5L28 30.5V36L20 23V17.5Z"
            className="fill-blue-600 dark:fill-sky-400 opacity-95 transition-colors"
          />

          {/* Right Pillar */}
          <path
            d="M28 10.5L34 14V34L28 30.5V10.5Z"
            className="fill-teal-600 dark:fill-teal-400 opacity-90 transition-colors"
          />

          {/* Balanced Geometric Anchor Nodes */}
          <circle cx="24" cy="24" r="2" className="fill-white dark:fill-sky-100 shadow-xs" />
          <circle cx="24" cy="3" r="1.8" className="fill-indigo-500 dark:fill-sky-400" />
          <circle cx="42" cy="13.5" r="1.8" className="fill-blue-500 dark:fill-sky-400" />
          <circle cx="42" cy="34.5" r="1.8" className="fill-teal-500 dark:fill-teal-400" />
          <circle cx="24" cy="45" r="1.8" className="fill-indigo-500 dark:fill-sky-400" />
          <circle cx="6" cy="34.5" r="1.8" className="fill-blue-500 dark:fill-sky-400" />
          <circle cx="6" cy="13.5" r="1.8" className="fill-teal-500 dark:fill-teal-400" />
        </svg>
      </div>

      {/* Typography Brand Mark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-200 ${titleSizes[size]}`}
          >
            NEXORA
          </span>
          <span className="text-[10px] sm:text-xs font-mono font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 tracking-wider">
            SYSTEMS
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

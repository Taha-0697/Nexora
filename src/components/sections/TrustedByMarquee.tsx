import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck } from 'lucide-react';
import {
  getClientLogos,
  getMarqueeSettings,
  B2B_SECTIONS_EVENT,
  type ClientLogo,
  type MarqueeSettings
} from '../../services/b2bSectionsService';

function safeSvg(raw: string): string {
  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+\s*=/gi, 'data-removed=')
    .replace(/javascript:/gi, '')
    .replace(/href\s*=\s*["']?\s*data:[^"'\s>]*/gi, 'href="about:blank"');
}

export const TrustedByMarquee: React.FC = () => {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [settings, setSettings] = useState<MarqueeSettings>({
    direction: 'ltr',
    speed: 32,
    isPaused: false,
    pauseOnHover: true,
    headingText: 'Trusted by engineering and operations leaders worldwide'
  });

  const loadData = useCallback(() => {
    setLogos(getClientLogos());
    setSettings(getMarqueeSettings());
  }, []);

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener(B2B_SECTIONS_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(B2B_SECTIONS_EVENT, handleUpdate);
    };
  }, [loadData]);

  const activeLogos = logos.filter(l => l.active);
  const animationClass = settings.direction === 'ltr' ? 'animate-marquee-right' : 'animate-marquee-left';

  return (
    <section
      id="clients"
      className="py-10 sm:py-14 section-surface-2 border-b border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Nexora's Indigo-to-Sky Vertical Accent Bar */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3.5 sm:gap-4">
            {/* 4px vertical accent bar */}
            <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-indigo-500 via-blue-500 to-sky-400 shrink-0 min-h-[28px]" />
            
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider text-indigo-600 dark:text-sky-400">
                  Trusted Infrastructure
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">
                {settings.headingText}
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* Full-width Marquee Track with Edge Fade Masks */}
      <div
        className={`w-full relative overflow-hidden marquee-fade-mask marquee-container ${
          settings.isPaused ? 'marquee-paused' : ''
        }`}
        style={
          {
            '--marquee-speed': `${settings.speed}s`
          } as React.CSSProperties
        }
      >
        <div className={`flex items-center gap-4 sm:gap-6 py-2 ${animationClass}`}>
          {/* Render track twice for seamless loop */}
          {[...activeLogos, ...activeLogos].map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="w-[190px] sm:w-[230px] h-[82px] sm:h-[90px] rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200/90 dark:border-slate-800/90 shadow-xs hover:border-indigo-400/60 dark:hover:border-sky-500/50 hover:shadow-md transition-all shrink-0 flex flex-col items-center justify-center p-3.5 group cursor-default text-slate-800 dark:text-slate-100"
            >
              {logo.logoSvg ? (
                <div
                  className="flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity"
                  dangerouslySetInnerHTML={{ __html: safeSvg(logo.logoSvg) }}
                />
              ) : logo.imageUrl ? (
                <img
                  src={logo.imageUrl}
                  alt={logo.name}
                  className="max-h-8 max-w-[130px] object-contain opacity-85 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white font-heading">
                    {logo.name}
                  </span>
                </div>
              )}

              {logo.tagline && (
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1 truncate max-w-[180px] text-center">
                  {logo.tagline}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

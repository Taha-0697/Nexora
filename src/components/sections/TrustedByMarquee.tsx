import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  translateToArabicCached,
  getCachedArabicTranslation
} from '../../services/translationService';
import {
  getClientLogos,
  getMarqueeSettings,
  B2B_SECTIONS_EVENT,
  type ClientLogo,
  type MarqueeSettings
} from '../../services/b2bSectionsService';

function safeSvg(raw: string): string {
  return DOMPurify.sanitize(raw, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ['script', 'foreignObject', 'iframe', 'object', 'embed'],
  });
}

export const TrustedByMarquee: React.FC = () => {
  const { language } = useLanguage();
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [arHeading, setArHeading] = useState<string>('');
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

  useEffect(() => {
    if (language !== 'ar' || !settings.headingText) return;
    let cancelled = false;
    const cached = getCachedArabicTranslation(settings.headingText);
    if (cached) {
      setArHeading(cached);
    } else {
      translateToArabicCached(settings.headingText).then(tr => {
        if (!cancelled && tr) setArHeading(tr);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [language, settings.headingText]);

  const activeLogos = useMemo(() => logos.filter(l => l.active), [logos]);

  // Ensure each half-track is wide enough for any viewport so -50% wraparound is seamless
  const trackLogos = useMemo(() => {
    if (activeLogos.length === 0) return [];
    const repeatCount = Math.max(1, Math.ceil(6 / activeLogos.length));
    const list: ClientLogo[] = [];
    for (let i = 0; i < repeatCount; i++) {
      list.push(...activeLogos);
    }
    return list;
  }, [activeLogos]);

  const animationClass = settings.direction === 'ltr' ? 'animate-marquee-right' : 'animate-marquee-left';

  const renderLogoInner = (logo: ClientLogo) => (
    <>
      {logo.logoSvg ? (
        <div
          className="inline-flex items-center [&_svg]:h-10 sm:[&_svg]:h-12 [&_svg]:w-auto"
          dangerouslySetInnerHTML={{ __html: safeSvg(logo.logoSvg) }}
        />
      ) : logo.imageUrl ? (
        <>
          <img
            src={logo.imageUrl}
            alt={logo.name}
            className="h-10 sm:h-12 w-auto max-w-[160px] object-contain opacity-95 group-hover:opacity-100 transition-all duration-300"
          />
          <span className="font-heading font-extrabold text-lg sm:text-2xl tracking-tight">
            {logo.name}
          </span>
        </>
      ) : (
        <>
          <ShieldCheck className="w-8 h-8 sm:w-9 sm:h-9 text-indigo-600 dark:text-sky-400 group-hover:text-indigo-700 dark:group-hover:text-sky-300 transition-colors shrink-0" />
          <span className="font-heading font-extrabold text-lg sm:text-2xl tracking-tight">
            {logo.name}
          </span>
        </>
      )}
    </>
  );

  const renderLogoItem = (logo: ClientLogo, key: string) => {
    const baseClasses =
      'inline-flex items-center gap-4 whitespace-nowrap shrink-0 select-none text-slate-800 dark:text-slate-100 hover:text-slate-950 dark:hover:text-white hover:scale-[1.03] transition-all duration-300 group';

    const effectiveLinkType =
      logo.linkType ||
      (logo.websiteUrl ? 'website' : logo.caseStudySlug || logo.caseStudyId ? 'case_study' : 'none');

    if (effectiveLinkType === 'website' && logo.websiteUrl) {
      return (
        <a
          key={key}
          href={logo.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${logo.name} website`}
          title={`Visit ${logo.name}`}
          className={`${baseClasses} cursor-pointer focus:outline-none focus-visible:underline`}
        >
          {renderLogoInner(logo)}
        </a>
      );
    }

    if (effectiveLinkType === 'case_study' && (logo.caseStudySlug || logo.caseStudyId)) {
      const slugPart = logo.caseStudySlug ? `/${encodeURIComponent(logo.caseStudySlug)}` : '';
      const targetHref = `/case-studies${slugPart}`;
      return (
        <a
          key={key}
          href={targetHref}
          aria-label={`${logo.name} case study`}
          title={`View ${logo.name} Case Study`}
          onClick={e => {
            e.preventDefault();
            try {
              window.history.pushState(null, '', '/case-studies');
              window.dispatchEvent(new PopStateEvent('popstate'));
            } catch {
              window.location.hash = '#case-studies';
            }
          }}
          className={`${baseClasses} cursor-pointer focus:outline-none focus-visible:underline`}
        >
          {renderLogoInner(logo)}
        </a>
      );
    }

    return (
      <div key={key} className={`${baseClasses} cursor-default`}>
        {renderLogoInner(logo)}
      </div>
    );
  };

  return (
    <section
      id="clients"
      className="py-12 sm:py-16 section-surface-2 border-b border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        
        {/* Section Header with Nexora's Indigo-to-Sky Vertical Accent Bar */}
        <div className="flex items-center justify-between gap-4 mb-8 sm:mb-10">
          <div className="flex items-center gap-3.5 sm:gap-4">
            {/* 4px vertical accent bar */}
            <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-indigo-500 via-blue-500 to-sky-400 shrink-0 min-h-[28px]" />
            
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider text-indigo-600 dark:text-sky-400">
                  {language === 'ar' ? 'البنية التحتية الموثوقة' : 'Trusted Infrastructure'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">
                {language === 'ar' ? (arHeading || 'موثوق به من قبل قادة الهندسة والعمليات حول العالم') : settings.headingText}
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* Full-width Single-Line Marquee Track with Subtle Edge Fade Masks */}
      {trackLogos.length > 0 && (
        <div
          dir="ltr"
          className={`w-full relative overflow-hidden marquee-fade-mask marquee-container ${
            settings.isPaused ? 'marquee-paused' : ''
          } ${settings.pauseOnHover === false ? 'marquee-no-pause' : ''}`}
          style={
            {
              '--marquee-speed': `${settings.speed}s`
            } as React.CSSProperties
          }
        >
          <div className={`${animationClass} py-4`}>
            {/* Two identical track halves, each with matching trailing padding = gap for exact -50% wraparound */}
            {[0, 1].map(trackIdx => (
              <div
                key={trackIdx}
                aria-hidden={trackIdx === 1}
                className="flex items-center shrink-0 gap-14 sm:gap-20 pr-14 sm:pr-20 whitespace-nowrap"
              >
                {trackLogos.map((logo, idx) => renderLogoItem(logo, `${trackIdx}-${logo.id}-${idx}`))}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

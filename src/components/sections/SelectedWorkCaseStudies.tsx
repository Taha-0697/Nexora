import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Settings, Sparkles } from 'lucide-react';
import {
  getCaseStudies,
  getCaseStudiesSettings,
  B2B_SECTIONS_EVENT,
  type CaseStudy,
  type CaseStudiesSettings
} from '../../services/b2bSectionsService';

interface SelectedWorkCaseStudiesProps {
  onOpenAdminDrawer?: () => void;
  onOpenConsultation?: () => void;
  onViewAllProjects?: () => void;
}

export const SelectedWorkCaseStudies: React.FC<SelectedWorkCaseStudiesProps> = ({
  onOpenAdminDrawer,
  onOpenConsultation,
  onViewAllProjects
}) => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [settings, setSettings] = useState<CaseStudiesSettings>({
    eyebrowLabel: 'SELECTED WORK',
    headingText: 'Real projects, real operational outcomes',
    subtitleText: 'Proven engineering deliverables across custom web ERPs, high-concurrency Odoo bridges, and mission-critical cloud backends.',
    primaryCtaText: 'Discuss my project →',
    secondaryCtaText: 'View all case studies →'
  });

  const loadData = useCallback(() => {
    setCaseStudies(getCaseStudies());
    setSettings(getCaseStudiesSettings());
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

  // Identify Hero Card (Left ~60%) and Stacked Cards (Right ~40%)
  const heroCard = caseStudies.find(cs => cs.isHero) || caseStudies[0];
  const stackedCards = caseStudies
    .filter(cs => cs.isStacked)
    .sort((a, b) => (a.stackedPosition || 1) - (b.stackedPosition || 2))
    .slice(0, 2);

  // Fallback if not specifically marked as stacked
  const fallbackStacked = caseStudies.filter(cs => cs.id !== heroCard?.id).slice(0, 2);
  const rightCards = stackedCards.length === 2 ? stackedCards : fallbackStacked;

  const handleDiscussClick = () => {
    if (onOpenConsultation) {
      onOpenConsultation();
    } else {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = '#contact';
      }
    }
  };

  const handleViewAllClick = () => {
    if (onViewAllProjects) {
      onViewAllProjects();
    } else {
      const portfolioEl = document.getElementById('portfolio');
      if (portfolioEl) {
        portfolioEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = '#portfolio';
      }
    }
  };

  return (
    <section
      id="case-studies"
      className="py-16 sm:py-24 bg-[#F8FAFC] dark:bg-[#0E1526] border-b border-slate-200/80 dark:border-slate-800/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16">
          <div className="max-w-3xl">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F766E]/10 dark:bg-[#0F766E]/20 border border-[#0F766E]/25 text-xs font-mono font-bold text-[#0F766E] dark:text-teal-300 mb-3 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{settings.eyebrowLabel}</span>
            </div>

            {/* Bold Heading */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight mb-3">
              {settings.headingText}
            </h2>

            {/* 1-sentence subtitle */}
            <p className="text-sm sm:text-base text-[#475569] dark:text-slate-300 leading-relaxed">
              {settings.subtitleText}
            </p>
          </div>

          {onOpenAdminDrawer && (
            <button
              type="button"
              onClick={onOpenAdminDrawer}
              className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white dark:bg-[#131C31] border border-[#E2E8F0] dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#0F766E] dark:hover:text-teal-400 hover:border-[#0F766E]/50 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer group shrink-0"
              title="Manage Case Studies and Layout"
            >
              <Settings className="w-3.5 h-3.5 text-[#0F766E] dark:text-teal-400 group-hover:rotate-45 transition-transform" />
              <span>Edit Case Studies</span>
            </button>
          )}
        </div>

        {/* Asymmetric 2-Column Grid (~60% Left, ~40% Right on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mb-12 sm:mb-16">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: HERO CARD (~60% Desktop: lg:col-span-7)       */}
          {/* ========================================================= */}
          {heroCard && (
            <div className="lg:col-span-7 flex flex-col">
              <div className="h-full rounded-3xl bg-[#FFFFFF] dark:bg-[#060913] border border-[#E2E8F0] dark:border-slate-800/80 shadow-md hover:border-[#0F766E]/50 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
                
                {/* Rounded Image Preview */}
                <div className="relative h-60 sm:h-80 overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
                  <img
                    src={heroCard.imageUrl}
                    alt={heroCard.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Category Pill Tag Overlay */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-[10px] sm:text-xs font-mono font-bold tracking-wider text-[#0F766E] dark:text-teal-300 border border-[#0F766E]/30 uppercase shadow-xs">
                      {heroCard.categoryTag}
                    </span>
                  </div>

                  {heroCard.client && (
                    <div className="absolute bottom-4 left-4 z-10 text-white font-medium text-xs font-mono">
                      Client: <span className="font-bold underline underline-offset-2">{heroCard.client}</span>
                    </div>
                  )}
                </div>

                {/* Card Content Body */}
                <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 space-y-5">
                  <div className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white leading-snug group-hover:text-[#0F766E] dark:group-hover:text-teal-400 transition-colors">
                      {heroCard.title}
                    </h3>

                    {/* 2-Sentence Summary */}
                    <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-300 leading-relaxed">
                      {heroCard.summary}
                    </p>

                    {/* Checkmark Bullet Point Highlighting Measurable Impact */}
                    <div className="p-4 rounded-2xl bg-[#0F766E]/5 dark:bg-[#0F766E]/15 border border-[#0F766E]/20 flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#0F766E] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        ✓
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-[#0F766E] dark:text-teal-200 leading-snug">
                        {heroCard.outcomeHighlight}
                      </p>
                    </div>
                  </div>

                  {/* Deep Teal Text Link */}
                  <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
                    <a
                      href={heroCard.storyUrl || '#portfolio'}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#0F766E] dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors group/link"
                    >
                      <span>Read the story</span>
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>

                    <span className="text-[11px] font-mono font-medium text-[#475569] dark:text-slate-400">
                      Featured Case Study
                    </span>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* RIGHT COLUMN: STACKED CARDS (~40% Desktop: lg:col-span-5)  */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {rightCards.map((card, idx) => (
              <div
                key={card.id || idx}
                className="rounded-3xl bg-[#FFFFFF] dark:bg-[#060913] border border-[#E2E8F0] dark:border-slate-800/80 shadow-md hover:border-[#0F766E]/50 hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between flex-1 group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-800">
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Meta info & Category */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-[#0F766E] dark:text-teal-400 uppercase block truncate mb-1">
                        {card.categoryTag}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white leading-snug line-clamp-2 group-hover:text-[#0F766E] dark:group-hover:text-teal-400 transition-colors">
                        {card.title}
                      </h4>
                    </div>
                  </div>

                  {/* Summary preview on medium+ screens */}
                  <p className="text-xs text-[#475569] dark:text-slate-300 leading-relaxed line-clamp-2">
                    {card.summary}
                  </p>

                  {/* Single Checkmark Outcome Line */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800 flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#0F766E] text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                      ✓
                    </div>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">
                      {card.outcomeHighlight}
                    </span>
                  </div>
                </div>

                {/* Bottom link */}
                <div className="pt-3 mt-3 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
                  <a
                    href={card.storyUrl || '#portfolio'}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors"
                  >
                    <span>Read case details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  {card.client && (
                    <span className="text-[10px] font-mono text-[#475569] dark:text-slate-400 truncate max-w-[140px]">
                      {card.client}
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* ========================================================= */}
        {/* FOOTER CTAs: Side-by-Side Centered Buttons                */}
        {/* ========================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          {/* Primary Solid Dark Teal Button */}
          <button
            type="button"
            onClick={handleDiscussClick}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-extrabold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>{settings.primaryCtaText}</span>
          </button>

          {/* Secondary White Outlined Button */}
          <button
            type="button"
            onClick={handleViewAllClick}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-slate-50 dark:bg-transparent dark:hover:bg-slate-900 text-[#0F172A] dark:text-slate-200 border border-[#CBD5E1] dark:border-slate-700 font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>{settings.secondaryCtaText}</span>
          </button>
        </div>

      </div>
    </section>
  );
};

import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import type { Review } from '../../types';
import {
  translateToArabicCached,
  getCachedArabicTranslation,
  hasArabicCharacters
} from '../../services/translationService';
import { 
  Star, 
  ExternalLink, 
  MessageSquareQuote, 
  CheckCircle2, 
  Play, 
  Video, 
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Terminal
} from 'lucide-react';

export const GoogleReviewsSection: React.FC = () => {
  const { language, t } = useLanguage();
  const { reviews, googleSettings } = useData();

  // Filter Bar State
  const [filterType, setFilterType] = useState<'all' | 'video' | 'google' | 'dotnet' | 'odoo'>('all');
  const [activeVideoReview, setActiveVideoReview] = useState<Review | null>(null);

  // Pagination State (Step by 2 reviews at a time)
  const [currentPage, setCurrentPage] = useState<number>(0);

  // In-place text expansion state
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedReviews(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Requirement 3: Only reviews marked as Display (isVisible !== false) are rendered on the public website
  const publicReviews = useMemo(() => {
    return reviews.filter(r => r.isVisible !== false);
  }, [reviews]);

  // Automatic Arabic translation for review quotes & roles (preserving company/product & tech stack names)
  const [arReviewMap, setArReviewMap] = useState<Record<string, { text?: string; role?: string }>>({});

  useEffect(() => {
    if (language !== 'ar' || publicReviews.length === 0) return;
    let cancelled = false;

    const initialMap: Record<string, { text?: string; role?: string }> = {};
    const pending: Array<Promise<void>> = [];

    for (const r of publicReviews) {
      const enText = typeof r.content === 'object' ? r.content.en : (r.content || (r as any).reviewText || '');
      const arTextExisting = typeof r.content === 'object' ? r.content.ar : '';
      const protectedTerms = [r.company, r.authorName].filter(Boolean);
      const entry: { text?: string; role?: string } = {};

      if (enText && !hasArabicCharacters(arTextExisting)) {
        const cached = getCachedArabicTranslation(enText, protectedTerms);
        if (cached) entry.text = cached;
        else {
          pending.push(
            translateToArabicCached(enText, protectedTerms).then(res => {
              if (!cancelled && res) {
                setArReviewMap(prev => ({ ...prev, [r.id]: { ...prev[r.id], text: res } }));
              }
            })
          );
        }
      }

      if (r.authorRole && !hasArabicCharacters(r.authorRole)) {
        const cachedRole = getCachedArabicTranslation(r.authorRole);
        if (cachedRole) entry.role = cachedRole;
        else {
          pending.push(
            translateToArabicCached(r.authorRole).then(res => {
              if (!cancelled && res) {
                setArReviewMap(prev => ({ ...prev, [r.id]: { ...prev[r.id], role: res } }));
              }
            })
          );
        }
      }

      if (Object.keys(entry).length > 0) {
        initialMap[r.id] = entry;
      }
    }

    if (Object.keys(initialMap).length > 0) {
      setArReviewMap(prev => ({ ...prev, ...initialMap }));
    }
    if (pending.length > 0) {
      Promise.all(pending).catch(() => {});
    }

    return () => {
      cancelled = true;
    };
  }, [language, publicReviews]);

  const getLocalizedReviewText = (r: Review): string => {
    const enText = typeof r.content === 'object' ? r.content.en : (r.content || (r as any).reviewText || '');
    if (language === 'ar') {
      const arExisting = typeof r.content === 'object' ? r.content.ar : '';
      return arReviewMap[r.id]?.text || (hasArabicCharacters(arExisting) ? arExisting : enText);
    }
    return enText;
  };

  const getLocalizedRole = (r: Review): string => {
    if (language === 'ar') {
      return arReviewMap[r.id]?.role || r.authorRole;
    }
    return r.authorRole;
  };

  const videoReviewsCount = publicReviews.filter(r => r.hasVideo).length;
  const dotnetReviewsCount = publicReviews.filter(r => (r as any).techCategory === 'dotnet' || (r.content && typeof r.content === 'object' && r.content.en && r.content.en.toLowerCase().includes('.net'))).length;
  const odooReviewsCount = publicReviews.filter(r => (r as any).techCategory === 'odoo' || (r.content && typeof r.content === 'object' && r.content.en && r.content.en.toLowerCase().includes('odoo'))).length;

  const handleFilterChange = (type: 'all' | 'video' | 'google' | 'dotnet' | 'odoo') => {
    setFilterType(type);
    setCurrentPage(0);
  };

  const filteredReviews = publicReviews.filter(r => {
    const isDotnet = (r as any).techCategory === 'dotnet' || (r.content && typeof r.content === 'object' && r.content.en && r.content.en.toLowerCase().includes('.net'));
    const isOdoo = (r as any).techCategory === 'odoo' || (r.content && typeof r.content === 'object' && r.content.en && r.content.en.toLowerCase().includes('odoo'));

    if (filterType === 'video') return Boolean(r.hasVideo);
    if (filterType === 'google') return Boolean(r.isGoogleReview);
    if (filterType === 'dotnet') return isDotnet;
    if (filterType === 'odoo') return isOdoo;
    return true;
  });

  // 1. Featured Spotlight Review (Top Video / Flagged as Featured in Admin)
  const spotlightReview = 
    filteredReviews.find(r => r.featured && r.hasVideo) ||
    filteredReviews.find(r => r.featured) ||
    filteredReviews.find(r => r.hasVideo) ||
    filteredReviews[0] ||
    publicReviews.find(r => r.hasVideo) ||
    publicReviews[0];

  // 2. Stacked Reviews for right column (Other reviews or all reviews)
  const nonSpotlightReviews = filteredReviews.filter(r => r.id !== spotlightReview?.id);
  const displayReviewList = nonSpotlightReviews.length > 0 ? nonSpotlightReviews : filteredReviews;

  const reviewsPerPage = 2;
  const totalPages = Math.max(1, Math.ceil(displayReviewList.length / reviewsPerPage));

  // Current page 2-card slice
  const startIndex = currentPage * reviewsPerPage;
  const currentTwoReviews = displayReviewList.slice(startIndex, startIndex + reviewsPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prev => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <section id="reviews" className="py-10 sm:py-16 lg:py-20 relative bg-white section-surface-1 border-t border-b border-slate-200/80 dark:border-slate-800/80 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-sky-400 mb-3 sm:mb-4">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>{t('reviews.badge')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3 sm:mb-4">
            {t('reviews.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-lg">
            {t('reviews.sub')}
          </p>
        </div>

        {/* Google Business Live Reputation Bar */}
        <div className="max-w-4xl mx-auto rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 dark:border-slate-800 mb-6 sm:mb-10 shadow-md dark:shadow-2xl bg-slate-50 dark:bg-gradient-to-r dark:from-dark-900/90 dark:via-dark-850/90 dark:to-dark-900/90">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            
            {/* Left: Google Brand & Aggregate Score */}
            <div className="flex items-center gap-3 sm:gap-5 w-full md:w-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white flex items-center justify-center shadow-md p-2 sm:p-2.5 shrink-0 border border-slate-100 dark:border-transparent">
                <svg className="w-full h-full" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                  <span className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {googleSettings.overallRating}
                  </span>
                  <div className="flex text-amber-500 dark:text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {googleSettings.totalReviewsCount} {language === 'ar' ? 'تقييم موثق من جوجل' : 'Verified Google Reviews'}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono text-[10px] sm:text-[11px] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{googleSettings.lastSyncTimestamp}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Direct CTA to write review on Google */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <a
                href={googleSettings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm border border-slate-200 dark:border-slate-700 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>{t('reviews.writeReview')}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </a>
            </div>

          </div>
        </div>

        {/* Filter Tabs (Strict Separation of .NET & Odoo) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-6 sm:mb-10">
          <button
            type="button"
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-1 ring-indigo-500'
                : 'bg-slate-100 dark:bg-dark-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {language === 'ar' ? `كافة التقييمات (${reviews.length})` : `All Reviews (${reviews.length})`}
          </button>

          <button
            type="button"
            onClick={() => handleFilterChange('video')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'video'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-1 ring-indigo-500'
                : 'bg-slate-100 dark:bg-dark-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>🎥</span>
            <span>{language === 'ar' ? `شهادات الفيديو (${videoReviewsCount})` : `Video Testimonials (${videoReviewsCount})`}</span>
          </button>

          <button
            type="button"
            onClick={() => handleFilterChange('google')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'google'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-1 ring-indigo-500'
                : 'bg-slate-100 dark:bg-dark-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>⭐</span>
            <span>{language === 'ar' ? `موثق من جوجل (${googleSettings.totalReviewsCount})` : `Google Verified (${googleSettings.totalReviewsCount})`}</span>
          </button>

          {/* Distinct .NET Filter Tab */}
          <button
            type="button"
            onClick={() => handleFilterChange('dotnet')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'dotnet'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-1 ring-indigo-500'
                : 'bg-slate-100 dark:bg-dark-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500 dark:text-sky-400" />
            <span>{language === 'ar' ? `.NET Enterprise (${dotnetReviewsCount})` : `.NET Enterprise (${dotnetReviewsCount})`}</span>
          </button>

          {/* Distinct Odoo Filter Tab (strictly 'Odoo') */}
          <button
            type="button"
            onClick={() => handleFilterChange('odoo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'odoo'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-1 ring-indigo-500'
                : 'bg-slate-100 dark:bg-dark-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            <span>{language === 'ar' ? `Odoo Enterprise (${odooReviewsCount})` : `Odoo Enterprise (${odooReviewsCount})`}</span>
          </button>
        </div>

        {/* Split 2-Column Asymmetric Layout (40% Left, 60% Right) */}
        {filteredReviews.length === 0 ? (
          <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto bg-white dark:bg-dark-900/60 shadow-xs">
            <MessageSquareQuote className="w-10 h-10 mx-auto mb-3 text-slate-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {language === 'ar' ? 'لا توجد تقييمات مطابقة' : 'No Reviews in this Category'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ar' ? 'اختر تبويباً آخر أو استعرض كافة التقييمات.' : 'Select another filter or reset to All Reviews.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            
            {/* ======================================================== */}
            {/* COLUMN 1: LEFT FEATURED SPOTLIGHT (40% - lg:col-span-5)  */}
            {/* ======================================================== */}
            <div className="lg:col-span-5 flex flex-col">
              {spotlightReview ? (
                <div className="h-full rounded-3xl p-6 sm:p-7 border border-indigo-500/30 dark:border-sky-500/30 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 shadow-xl flex flex-col justify-between relative overflow-hidden group">
                  
                  {/* Decorative subtle ambient glow */}
                  <div className="absolute -top-20 -right-20 w-44 h-44 bg-indigo-500/10 dark:bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />

                  <div>
                    {/* Top Tag & Verified Status */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'قصة نجاح مميزة (فيديو)' : 'Featured Video Story'}</span>
                      </div>

                      {(spotlightReview as any).techCategory && (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                          (spotlightReview as any).techCategory === 'odoo'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400/30 text-emerald-700 dark:text-emerald-400'
                            : 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400/30 text-indigo-700 dark:text-sky-300'
                        }`}>
                          {(spotlightReview as any).techCategory === 'odoo' ? 'Odoo' : '.NET Core'}
                        </span>
                      )}
                    </div>

                    {/* Video Interactive Thumbnail / Play Banner */}
                    <div 
                      onClick={() => setActiveVideoReview(spotlightReview)}
                      className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-md group/video cursor-pointer mb-5"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80"
                        alt="Client Case Study Video"
                        className="w-full h-full object-cover group-hover/video:scale-105 transition-transform duration-500 opacity-80 group-hover/video:opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                      {/* Pulsing Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative flex items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-14 w-14 rounded-full bg-sky-400 opacity-60"></span>
                          <div className="w-14 h-14 rounded-full bg-indigo-600/90 group-hover/video:bg-indigo-500 group-hover/video:scale-110 text-white flex items-center justify-center shadow-xl backdrop-blur-md transition-all border border-white/20">
                            <Play className="w-6 h-6 fill-current translate-x-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Overlay HUD Info */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                        <span className="font-mono bg-slate-950/80 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                          <Video className="w-3 h-3 text-sky-400" />
                          <span>45s Executive Review</span>
                        </span>
                        <span className="font-bold text-sky-300 drop-shadow">
                          {spotlightReview.company}
                        </span>
                      </div>
                    </div>

                    {/* Reviewer Bio & Rating */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={spotlightReview.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                          alt={spotlightReview.authorName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400/40"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                            {spotlightReview.authorName}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {getLocalizedRole(spotlightReview)} • <span className="text-slate-800 dark:text-slate-200 font-medium">{spotlightReview.company}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex text-amber-500 shrink-0">
                        {[...Array(spotlightReview.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                    </div>

                    {/* Short 2-Line Key Takeaway Quote */}
                    <div className="relative pl-3 border-l-2 border-indigo-500/60 dark:border-sky-500/60 mb-5">
                      <p dir={language === 'ar' ? 'rtl' : 'ltr'} className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic line-clamp-3">
                        "{getLocalizedReviewText(spotlightReview)}"
                      </p>
                    </div>
                  </div>

                  {/* Spotlight Footer CTA */}
                  <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{language === 'ar' ? 'عقد موثق ومشروع منجز' : 'Verified Enterprise Contract'}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setActiveVideoReview(spotlightReview)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{language === 'ar' ? 'تشغيل الفيديو (45ث)' : 'Watch Video (45s)'}</span>
                    </button>
                  </div>

                </div>
              ) : null}
            </div>

            {/* ======================================================== */}
            {/* COLUMN 2: RIGHT REVIEW VERTICAL 2-CARD STACK (60% - 7col)*/}
            {/* ======================================================== */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              
              {/* Dedicated Row: Prev Button | 2-Card Stack | Next Button */}
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                {/* Left Dedicated Navigation Button (desktop & tablet) */}
                <button
                  type="button"
                  onClick={handlePrevPage}
                  className="hidden sm:flex shrink-0 w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-md items-center justify-center hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-sky-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  title={language === 'ar' ? 'التقييمات السابقة' : 'Previous Reviews'}
                  aria-label="Previous Reviews"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Vertical Stack of 2 Full-Width Review Cards (Filling height evenly) */}
                <div className="flex-1 min-w-0 flex flex-col gap-4 sm:gap-5 h-full justify-between">
                  {currentTwoReviews.map((review) => {
                  const reviewText = getLocalizedReviewText(review);
                  
                  const isOdoo = (review as any).techCategory === 'odoo' || reviewText.toLowerCase().includes('odoo');
                  const isDotnet = (review as any).techCategory === 'dotnet' || reviewText.toLowerCase().includes('.net');
                  const isExpanded = Boolean(expandedReviews[review.id]);
                  const isLong = reviewText.length > 170;

                  return (
                    <div
                      key={review.id}
                      className="flex-1 w-full rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-sky-500/40 bg-white dark:bg-dark-900/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Header: Reviewer, Rating & Category Tag */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={review.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                              alt={review.authorName}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
                                {review.authorName}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {getLocalizedRole(review)} • <span className="text-slate-700 dark:text-slate-300 font-medium">{review.company}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Distinct Category Tag */}
                            {isOdoo ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400/30 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                                Odoo
                              </span>
                            ) : isDotnet ? (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-400/30 text-[10px] font-mono font-bold text-indigo-700 dark:text-sky-300">
                                .NET
                              </span>
                            ) : null}

                            {/* Google 'G' tag */}
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-300">
                              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                              </svg>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">Google</span>
                            </div>
                          </div>
                        </div>

                        {/* Stars & Date */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex text-amber-500">
                            {[...Array(review.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {review.date || 'Verified'}
                          </span>
                        </div>

                        {/* Review Content + See More / See Less Toggle */}
                        <div className="relative mb-3">
                          <p className={`text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed transition-all ${
                            isExpanded ? '' : 'line-clamp-3'
                          }`}>
                            "{reviewText}"
                          </p>
                          {isLong && (
                            <button
                              type="button"
                              onClick={() => toggleExpand(review.id)}
                              className="inline-block mt-1 text-[11px] font-bold text-indigo-600 dark:text-sky-400 hover:underline cursor-pointer"
                            >
                              {isExpanded ? (language === 'ar' ? 'عرض أقل' : 'See less') : (language === 'ar' ? 'عرض المزيد' : 'See more')}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Footer: Verified Check & Actions */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{review.location || 'Verified Client'}</span>
                        </span>

                        {review.hasVideo ? (
                          <button
                            type="button"
                            onClick={() => setActiveVideoReview(review)}
                            className="text-indigo-600 dark:text-sky-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>{language === 'ar' ? 'فيديو' : 'Video'}</span>
                          </button>
                        ) : review.googleReviewUrl ? (
                          <a
                            href={review.googleReviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors flex items-center gap-1"
                          >
                            <span>{language === 'ar' ? 'الخرائط' : 'Maps'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : null}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Right Dedicated Navigation Button (desktop & tablet) */}
              <button
                type="button"
                onClick={handleNextPage}
                className="hidden sm:flex shrink-0 w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-md items-center justify-center hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-sky-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title={language === 'ar' ? 'التقييمات التالية' : 'Next Reviews'}
                aria-label="Next Reviews"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Pagination Info Indicator & Mobile Navigation */}
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span>
                {language === 'ar' 
                  ? `صفحة ${currentPage + 1} من ${totalPages} (${displayReviewList.length} تقييم)` 
                  : `Page ${currentPage + 1} of ${totalPages} (${displayReviewList.length} verified reviews)`}
              </span>

              <div className="flex items-center gap-3">
                {/* Page Indicator Dots */}
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentPage(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        currentPage === idx
                          ? 'w-6 bg-indigo-600 dark:bg-sky-400'
                          : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                      }`}
                      aria-label={`Go to page ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Mobile-only Arrow buttons placed cleanly below the cards */}
                <div className="flex sm:hidden items-center gap-1.5 ml-2">
                  <button
                    type="button"
                    onClick={handlePrevPage}
                    className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-slate-700 active:scale-95 cursor-pointer"
                    title={language === 'ar' ? 'التقييمات السابقة' : 'Previous Reviews'}
                    aria-label="Previous Reviews"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPage}
                    className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-slate-700 active:scale-95 cursor-pointer"
                    title={language === 'ar' ? 'التقييمات التالية' : 'Next Reviews'}
                    aria-label="Next Reviews"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          </div>
        )}

      </div>

      {/* Video Testimonial Modal */}
      {activeVideoReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div
            className="fixed inset-0"
            onClick={() => setActiveVideoReview(null)}
          />
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-750 rounded-3xl p-6 shadow-2xl z-10 overflow-hidden text-white">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-sky-400">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-white">
                    {activeVideoReview.authorName} • <span className="text-slate-400 text-sm font-normal">{activeVideoReview.company}</span>
                  </h3>
                  <p className="text-xs text-sky-400 font-mono">
                    {language === 'ar' ? 'شهادة فيديو موثقة من العميل' : 'Verified Client Video Testimonial'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveVideoReview(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner mb-4">
              <video
                src={activeVideoReview.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42994-large.mp4'}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>

            {/* Quote excerpt */}
            <p dir={language === 'ar' ? 'rtl' : 'ltr'} className="text-xs sm:text-sm text-slate-300 italic mb-4">
              "{getLocalizedReviewText(activeVideoReview)}"
            </p>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setActiveVideoReview(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

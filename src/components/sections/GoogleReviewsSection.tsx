import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { Star, ExternalLink, MessageSquareQuote, CheckCircle2 } from 'lucide-react';

export const GoogleReviewsSection: React.FC = () => {
  const { language, t } = useLanguage();
  const { reviews, googleSettings } = useData();

  return (
    <section id="reviews" className="py-24 relative bg-white dark:bg-dark-950 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-sky-400 mb-4">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>{t('reviews.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('reviews.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            {t('reviews.sub')}
          </p>
        </div>

        {/* Google Business Live Reputation Bar */}
        <div className="max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 mb-16 shadow-md dark:shadow-2xl bg-slate-50 dark:bg-gradient-to-r dark:from-dark-900/90 dark:via-dark-850/90 dark:to-dark-900/90">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left: Google Brand & Aggregate Score */}
            <div className="flex items-center gap-5">
              {/* Google Multicolor 'G' Icon */}
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-md p-2.5 shrink-0 border border-slate-100 dark:border-transparent">
                <svg className="w-full h-full" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {googleSettings.overallRating}
                  </span>
                  <div className="flex text-amber-500 dark:text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {googleSettings.totalReviewsCount} {language === 'ar' ? 'تقييم موثق من جوجل' : 'Verified Google Reviews'}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono text-[11px] font-semibold">
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
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm border border-slate-200 dark:border-slate-700 transition-all hover:scale-105 active:scale-95 cursor-pointer"
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

        {/* Dynamic Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="glass-panel p-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-sky-500/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md bg-white dark:bg-dark-900/60"
            >
              <div>
                {/* Header: Reviewer, Rating & Google Badge */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatar}
                      alt={review.authorName}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
                        {review.authorName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {review.authorRole} • <span className="text-slate-700 dark:text-slate-300 font-medium">{review.company}</span>
                      </p>
                    </div>
                  </div>

                  {/* Google Tag */}
                  {review.isGoogleReview && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-300 shrink-0">
                      <svg className="w-3 h-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Google Review</span>
                    </div>
                  )}
                </div>

                {/* Stars & Date */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-amber-500 dark:text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {review.date}
                  </span>
                </div>

                {/* Content */}
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  "{review.content[language]}"
                </p>
              </div>

              {/* Footer: Verified Check */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'عقد موثق ومشروع منجز' : 'Verified Client Contract'}</span>
                </span>
                {review.googleReviewUrl && (
                  <a
                    href={review.googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors flex items-center gap-1"
                  >
                    <span>{language === 'ar' ? 'عرض على الخرائط' : 'View on Maps'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

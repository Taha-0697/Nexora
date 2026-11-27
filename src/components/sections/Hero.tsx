import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import {
  ShieldCheck,
  ArrowRight,
  Layers,
  Star,
  Calendar,
  Sparkles,
  Rocket,
  Shield
} from 'lucide-react';

interface HeroProps {
  onOpenQuote: () => void;
  onBookDemo?: () => void;
  onOpenConsultation?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuote, onBookDemo, onOpenConsultation }) => {
  const { language } = useLanguage();
  const { googleSettings } = useData();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-16 lg:pb-24 bg-slate-50 section-surface-1 transition-colors">
      {/* Background Ambient Aura (Soft & Non-Straining) */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-sky-500/10 rounded-full blur-[130px] transition-colors" />
        <div className="absolute top-1/3 right-10 w-[420px] h-[420px] bg-blue-500/10 dark:bg-indigo-600/10 rounded-full blur-[110px] transition-colors" />
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035] bg-grid-ambient" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Floating Badge */}
        <div className="flex justify-center mb-4 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/90 dark:bg-slate-900/90 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-sky-300 shadow-xs dark:shadow-md backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 dark:bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600 dark:bg-sky-500"></span>
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
            <span>
              {language === 'ar'
                ? 'بيت برمجيات متكامل • أنظمة ERP مخصصة • بوابات وتطبيقات سحابية'
                : 'Enterprise Software House • Custom ERP • Web Portals & Apps'}
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-4 sm:mb-6">
            <span>{language === 'ar' ? 'نهندس ' : 'Engineering '}</span>
            <span className="text-gradient-cyan">
              {language === 'ar' ? 'أنظمة ERP وبوابات' : 'Custom Web ERPs'}
            </span>
            <br className="hidden sm:inline" />
            <span>{language === 'ar' ? ' ومواقع وتطبيقات مخصصة' : ' & High-Impact Portals'}</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-6 sm:mb-9 leading-relaxed font-normal">
            {language === 'ar'
              ? 'بيت برمجيات متخصص في بناء أنظمة تخطيط الموارد المخصصة (Custom ERP) والبوابات المؤسسية وتطبيقات الجوال. نعتمد على .NET Core Web API، وReact / Next.js، وNode.js، وقواعد بيانات MSSQL، مع تطبيقات أصيلة بـ Swift و Kotlin و Flutter، مع تركيز مطلق على الحلول البرمجية المخصصة (Customized Solutions) لاحتياجات عملك.'
              : 'Full-cycle enterprise software house crafting bespoke Web ERPs, client portals, and mobile apps. Powered by .NET Core Web API, React, Next.js, Node.js, and MSSQL databases, with native iOS Swift, Android Kotlin, Flutter, and cutting-edge AI integrations built for high performance.'}
          </p>

          {/* Primary CTA Row — 2 prominent buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-5 sm:mb-7">
            <button
              onClick={onBookDemo || onOpenQuote}
              className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 hover:from-indigo-500 hover:via-blue-500 hover:to-sky-400 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-white shrink-0" />
              <span>{language === 'ar' ? 'احجز عرضاً حياً مجانياً' : 'Book Free Live Demo'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            <button
              onClick={() => {
                if (onOpenConsultation) {
                  onOpenConsultation();
                } else {
                  scrollTo('contact');
                }
              }}
              className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-extrabold text-sm sm:text-base tracking-wide border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-sky-500/70 backdrop-blur-md transition-all flex items-center justify-center gap-2.5 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{language === 'ar' ? 'استشارة هندسية مجانية' : 'Free Engineering Consultation'}</span>
            </button>
          </div>

          {/* Social Proof Uplift Badge Row (Phase 2) */}
          <div className="flex items-center justify-center mb-5 sm:mb-8">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-100/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs text-xs sm:text-sm">
              <span className="text-amber-500 font-extrabold flex items-center gap-1 font-mono">
                <span>★ 4.9/5 Rating</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium font-sans">(148 Reviews)</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {language === 'ar'
                  ? 'موثوق من قادة الهندسة التقنية في دبي ولندن ومسقط'
                  : 'Trusted by engineering leaders in Dubai, London, and Muscat'}
              </span>
            </div>
          </div>

        </div>

        {/* 4 Core Engineering Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 max-w-6xl mx-auto">

          {/* Metric 1: MVP Rollout */}
          <div className="glass-panel p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-sky-500/40 transition-all group bg-white dark:bg-slate-900/70 shadow-xs">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold truncate">
                {language === 'ar' ? 'إطلاق المرحلة الأولى' : 'MVP Rollout'}
              </span>
              <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-sky-400 shrink-0" />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
              <span dir="ltr">4–8 Wks</span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
              {language === 'ar' ? 'إطلاق النسخة التشغيلية الأولى' : 'First Production Release'}
            </p>
          </div>

          {/* Metric 2: Production Systems */}
          <div className="glass-panel p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-sky-500/40 transition-all group bg-white dark:bg-slate-900/70 shadow-xs">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold truncate">
                {language === 'ar' ? 'الأنظمة المنفذة' : 'Systems Shipped'}
              </span>
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-sky-400 shrink-0" />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
              150+
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
              {language === 'ar' ? 'أنظمة ERP وبوابات وتطبيقات' : 'Custom ERPs, Portals & Apps'}
            </p>
          </div>

          {/* Metric 3: Client Rating */}
          <div className="glass-panel p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800/80 hover:border-amber-400/60 transition-all group bg-white dark:bg-slate-900/70 shadow-xs">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold truncate">
                {language === 'ar' ? 'تقييم العملاء' : 'Client Rating'}
              </span>
              <div className="flex text-amber-500">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500 text-amber-500" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-amber-500 transition-colors flex items-baseline gap-1">
              <span>{googleSettings.overallRating}</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-400">/ 5.0</span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
              {googleSettings.totalReviewsCount} {language === 'ar' ? 'تقييم موثق' : 'Verified Reviews'}
            </p>
          </div>

          {/* Metric 4: Code & IP Ownership */}
          <div className="glass-panel p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-sky-500/40 transition-all group bg-white dark:bg-slate-900/70 shadow-xs">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold truncate">
                {language === 'ar' ? 'ملكية الكود' : 'Code & IP Rights'}
              </span>
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-sky-400 shrink-0" />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
              100%
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
              {language === 'ar' ? 'ملكية كاملة للكود والبيانات' : 'Full Source & Data Ownership'}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
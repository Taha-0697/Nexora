import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import {
  ShieldCheck,
  ArrowRight,
  Calculator,
  Server,
  Layers,
  Terminal,
  CheckCircle2,
  Zap,
  Star
} from 'lucide-react';

interface HeroProps {
  onOpenQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuote }) => {
  const { language, t } = useLanguage();
  const { googleSettings } = useData();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-24">
      {/* Background Ambient Aura (Soft & Non-Straining) */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-sky-500/10 rounded-full blur-[130px] transition-colors" />
        <div className="absolute top-1/3 right-10 w-[420px] h-[420px] bg-blue-500/10 dark:bg-indigo-600/10 rounded-full blur-[110px] transition-colors" />
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Floating Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-slate-900/90 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-sky-300 shadow-xs dark:shadow-md backdrop-blur-md">
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
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6">
            <span>{language === 'ar' ? 'نهندس ' : 'Engineering '}</span>
            <span className="text-gradient-cyan">
              {language === 'ar' ? 'أنظمة ERP وبوابات' : 'Custom Web ERPs'}
            </span>
            <br className="hidden sm:inline" />
            <span>{language === 'ar' ? ' ومواقع وتطبيقات مخصصة' : ' & High-Impact Portals'}</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-9 leading-relaxed font-normal">
            {language === 'ar'
              ? 'بيت برمجيات متخصص في بناء أنظمة تخطيط الموارد المخصصة (Custom ERP) والبوابات المؤسسية وتطبيقات الجوال. نعتمد على .NET Core Web API، وReact / Next.js، وNode.js، وقواعد بيانات MSSQL، مع تطبيقات أصيلة بـ Swift و Kotlin و Flutter، مع تركيز مطلق على الحلول البرمجية المخصصة (Customized Solutions) لاحتياجات عملك.'
              : 'Full-cycle enterprise software house crafting bespoke Web ERPs, client portals, and mobile apps. Powered by .NET Core Web API, React, Next.js, Node.js, and MSSQL databases, with native iOS Swift, Android Kotlin, Flutter, and cutting-edge AI integrations built for high performance.'}
          </p>

          {/* Action CTAs */}
<<<<<<< HEAD
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-7">
=======
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
            <button
              onClick={() => scrollTo('estimator')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-sm tracking-wide shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-white" />
              <span>{t('hero.ctaEstimator')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => scrollTo('services')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-bold text-sm tracking-wide border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-sky-500/50 backdrop-blur-md transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
            >
              <Layers className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
              <span>{t('hero.ctaServices')}</span>
            </button>

            <button
              onClick={onOpenQuote}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-50/80 dark:bg-slate-800/80 hover:bg-indigo-100 dark:hover:bg-slate-700 text-indigo-700 dark:text-sky-300 font-bold text-sm tracking-wide border border-indigo-200/80 dark:border-indigo-500/30 hover:border-indigo-400 dark:hover:border-sky-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
              <span>{t('nav.quote')}</span>
            </button>
          </div>

<<<<<<< HEAD
          {/* Social Proof Uplift Badge Row (Phase 2) */}
          <div className="flex items-center justify-center mb-10">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full bg-slate-100/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs text-xs sm:text-sm">
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

=======
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
          {/* Software House Core Stack Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-16">
            {[
              'Custom Web ERP (.NET Core)',
<<<<<<< HEAD
              'Odoo Enterprise & Python Bridges',
              'React.js & Next.js 15',
              'Microsoft SQL Server (MSSQL)',
              'PostgreSQL Data Sync',
=======
              'React.js & Next.js 15',
              'Microsoft SQL Server (MSSQL)',
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
              'REST API Integrations',
              'Native iOS Swift',
              'Native Android Kotlin',
              'Flutter Cross-Platform',
              'Node.js & NestJS',
<<<<<<< HEAD
              'AI & LLM Integrations'
=======
              'AI & LLM Integrations',
              'Customized Enterprise Solutions'
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-300 hover:border-indigo-300 dark:hover:border-sky-500/40 transition-colors shadow-2xs"
              >
                {tech}
              </span>
            ))}
          </div>

        </div>

        {/* 4 Core Engineering Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">

          {/* Metric 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-sky-500/40 transition-all group bg-white dark:bg-slate-900/70 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                SLA Uptime
              </span>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">LIVE</span>
              </div>
            </div>
<<<<<<< HEAD
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
=======
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
              99.99%
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-indigo-600 dark:text-sky-400" />
              <span>Contractual SLA Guaranteed</span>
            </p>
          </div>

          {/* Metric 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-sky-500/40 transition-all group bg-white dark:bg-slate-900/70 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                ERP & Web Portals
              </span>
              <Server className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
            </div>
<<<<<<< HEAD
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
=======
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
              150+
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Custom Apps & Integrations
            </p>
          </div>

          {/* Metric 3: Google Rating */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 hover:border-amber-400/60 transition-all group bg-white dark:bg-slate-900/70 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                Client Rating
              </span>
              <div className="flex text-amber-500">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
            </div>
<<<<<<< HEAD
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-amber-500 transition-colors flex items-baseline gap-1.5">
=======
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-amber-500 transition-colors flex items-baseline gap-1.5">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
              <span>{googleSettings.overallRating}</span>
              <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {googleSettings.totalReviewsCount} Verified Enterprise Reviews
            </p>
          </div>

          {/* Metric 4 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-sky-500/40 transition-all group bg-white dark:bg-slate-900/70 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                Stack Velocity
              </span>
              <Zap className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
            </div>
<<<<<<< HEAD
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
=======
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
              &lt; 20ms
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              .NET Core API Response
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

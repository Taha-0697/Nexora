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
  const { t } = useLanguage();
  const { googleSettings } = useData();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Ambient Aura (Soft & Non-Straining) */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-indigo-500/10 dark:bg-sky-500/10 rounded-full blur-[140px] transition-colors" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-blue-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px] transition-colors" />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-dark-900/90 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-sky-300 shadow-sm dark:shadow-lg dark:shadow-indigo-500/10 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 dark:bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600 dark:bg-sky-500"></span>
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
            <span>{t('hero.badge')}</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
            <span>{t('hero.titleLine1')} </span>
            <span className="text-gradient-cyan">
              {t('hero.titleHighlight')}
            </span>
            <br className="hidden sm:inline" />
            <span> {t('hero.titleLine2')}</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            {t('hero.sub')}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => scrollTo('estimator')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-white" />
              <span>{t('hero.ctaEstimator')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => scrollTo('services')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-dark-900/90 hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-bold text-sm tracking-wide border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-sky-500/50 backdrop-blur-md transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Layers className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
              <span>{t('hero.ctaServices')}</span>
            </button>

            <button
              onClick={onOpenQuote}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-50 dark:bg-dark-800/60 hover:bg-indigo-100 dark:hover:bg-dark-700/80 text-indigo-700 dark:text-sky-300 font-bold text-sm tracking-wide border border-indigo-200 dark:border-indigo-500/30 hover:border-indigo-400 dark:hover:border-sky-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
              <span>{t('nav.quote')}</span>
            </button>
          </div>

          {/* Software House Focus Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto mb-16">
            {[
              'Custom Odoo 17 ERP', 
              'Custom Enterprise Web Portals', 
              'Custom iOS & Android Apps', 
              'Kubernetes & AWS EKS', 
              'React & Next.js', 
              'Python FastAPI & Django', 
              'PostgreSQL & Redis', 
              'High-Speed Headless Portals'
            ].map((tech) => (
              <span 
                key={tech}
                className="px-3 py-1 rounded-md bg-white dark:bg-dark-900/80 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-sky-300 hover:border-indigo-300 dark:hover:border-sky-500/40 transition-colors shadow-2xs"
              >
                {tech}
              </span>
            ))}
          </div>

        </div>

        {/* 4 Core Engineering Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          
          {/* Metric 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-sky-500/40 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                {t('hero.statUptime')}
              </span>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">LIVE</span>
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
              99.99%
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-indigo-600 dark:text-sky-400" />
              <span>Contractual SLA Guaranteed</span>
            </p>
          </div>

          {/* Metric 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-sky-500/40 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                {t('hero.statDeployments')}
              </span>
              <Server className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
              140+
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Custom ERPs, Portals & Apps
            </p>
          </div>

          {/* Metric 3: Google Rating */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 hover:border-amber-400/60 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                Google Business Rating
              </span>
              <div className="flex text-amber-500 dark:text-amber-400">
                <Star className="w-4 h-4 fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors flex items-baseline gap-1.5">
              <span>{googleSettings.overallRating}</span>
              <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {googleSettings.totalReviewsCount} Verified Client Reviews
            </p>
          </div>

          {/* Metric 4 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-sky-500/40 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                {t('hero.statResponse')}
              </span>
              <Zap className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
              &lt; 15 min
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              24/7 Dedicated SRE On-Call
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

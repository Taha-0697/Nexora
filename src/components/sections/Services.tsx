import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import type { ServiceCategory } from '../../types';
import { 
  Database, 
  Server, 
  Smartphone, 
  Globe, 
  LayoutGrid, 
  Check, 
  ArrowUpRight, 
  Sparkles,
  Layers
} from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const { language, t } = useLanguage();
  const { services } = useData();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Database': return <Database className="w-6 h-6 text-indigo-600 dark:text-sky-400" />;
      case 'Server': return <Server className="w-6 h-6 text-indigo-600 dark:text-sky-400" />;
      case 'Smartphone': return <Smartphone className="w-6 h-6 text-indigo-600 dark:text-sky-400" />;
      case 'Globe': return <Globe className="w-6 h-6 text-indigo-600 dark:text-sky-400" />;
      case 'LayoutGrid': return <LayoutGrid className="w-6 h-6 text-indigo-600 dark:text-sky-400" />;
      default: return <Layers className="w-6 h-6 text-indigo-600 dark:text-sky-400" />;
    }
  };

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <section id="services" className="py-24 relative bg-white dark:bg-dark-900/50 border-t border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-sky-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('services.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('services.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            {t('services.sub')}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: t('portfolio.all') },
            { id: 'erp', label: language === 'ar' ? 'أنظمة ERP مخصصة' : 'Custom ERP' },
            { id: 'web', label: t('portfolio.web') },
            { id: 'mobile', label: t('portfolio.mobile') },
            { id: 'ai', label: language === 'ar' ? 'ذكاء اصطناعي (AI)' : 'AI Integrations' },
            { id: 'cloud', label: t('portfolio.cloud') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as ServiceCategory)}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-indigo-600 dark:bg-sky-500 text-white dark:text-dark-950 font-bold shadow-md shadow-indigo-600/20 dark:shadow-sky-500/20 scale-105'
                  : 'bg-slate-100 dark:bg-dark-800/80 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-dark-700 border border-slate-200 dark:border-slate-700/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div 
              key={service.id}
              className="glass-panel rounded-2xl p-7 flex flex-col justify-between border border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-sky-500/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-sm hover:shadow-xl dark:shadow-xl dark:shadow-black/40 bg-white dark:bg-dark-900/60"
            >
              <div>
                {/* Card Top: Icon & Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-dark-950 border border-indigo-200 dark:border-sky-500/30 flex items-center justify-center group-hover:border-indigo-500 dark:group-hover:border-sky-400 group-hover:shadow-md transition-all">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800/80 text-indigo-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700">
                    {service.badge[language]}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
                  {service.title[language]}
                </h3>
                <p className="text-xs font-semibold text-indigo-600 dark:text-sky-400/90 mb-4">
                  {service.tagline[language]}
                </p>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  {service.description[language]}
                </p>

                {/* Core Features List */}
                <div className="space-y-2.5 mb-6 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {language === 'ar' ? 'القدرات الهندسية الأساسية' : 'Engineering Capabilities'}
                  </h4>
                  {service.features[language].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <div className="mt-0.5 w-3.5 h-3.5 rounded-full bg-indigo-50 dark:bg-sky-950 flex items-center justify-center shrink-0 border border-indigo-300 dark:border-sky-500/40">
                        <Check className="w-2.5 h-2.5 text-indigo-600 dark:text-sky-400" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Tech Stack Chips & CTA */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80">
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {service.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-950/70 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onSelectService(service.title[language])}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-dark-800/90 hover:bg-indigo-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-dark-950 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-600 dark:hover:border-sky-400 group/btn cursor-pointer shadow-2xs"
                >
                  <span>{language === 'ar' ? 'طلب استشارة لهذه الخدمة' : 'Request Architecture Consultation'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

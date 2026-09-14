import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import type { Project, ServiceCategory } from '../../types';
import {
  FolderGit2,
  ExternalLink,
  ArrowUpRight,
  TrendingUp,
  X,
  Calendar,
  Building,
  Globe2
} from 'lucide-react';

export const Portfolio: React.FC = () => {
  const { language, t } = useLanguage();
  const { projects } = useData();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => {
      if (p.categories && p.categories.length > 0) {
        return p.categories.includes(activeCategory);
      }
      return p.category === activeCategory;
    });

  return (
    <section id="portfolio" className="py-20 relative bg-slate-100/50 dark:bg-slate-900/30 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-sky-400 mb-4">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>{t('portfolio.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('portfolio.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            {language === 'ar'
              ? 'نماذج ودراسات حالة من أنظمة الـ ERP المخصصة وبوابات الويب السحابية وتطبيقات الجوال مع روابط مباشرة للاطلاع والتجربة.'
              : 'Explore custom ERPs, high-throughput web portals, native mobile apps, and AI integrations with direct live demonstration links.'}
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
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeCategory === tab.id
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 shadow-2xs'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-panel rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-sky-500/50 transition-all duration-300 group hover:-translate-y-1.5 flex flex-col justify-between shadow-xs hover:shadow-xl bg-white dark:bg-slate-900/80"
            >
              <div
                onClick={() => setSelectedProject(project)}
                className="cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                  <img
                    src={project.image}
                    alt={project.title[language] || project.title.en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                  {/* Category Pills */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[85%]">
                    {(project.categories && project.categories.length > 0 ? project.categories : [project.category]).map(cat => (
                      <span key={cat} className="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-indigo-400/40 text-[9px] font-mono uppercase font-bold text-sky-300 backdrop-blur-md">
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Client & Country */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
                    <span className="font-semibold text-white drop-shadow">
                      {project.client}
                    </span>
                    <span className="text-[11px] font-mono text-sky-300">
                      {project.country}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
                    {project.title[language] || project.title.en}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {project.shortDesc[language] || project.shortDesc.en}
                  </p>

                  {/* Key Metrics Badges */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 mb-4">
                    {project.metrics.slice(0, 3).map((metric, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-xs font-black text-indigo-600 dark:text-sky-400">
                          {metric.value}
                        </div>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate">
                          {metric.label[language] || metric.label.en}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 4).map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Bottom with Direct Redirect Link */}
              <div className="p-6 pt-0">
                <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                  >
                    <span>{t('portfolio.viewDetails')}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Live Redirect Button */}
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm"
                      title="Direct Project Demo Redirect"
                    >
                      <span>{language === 'ar' ? 'رابط المشروع' : 'Live Demo'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400">Enterprise NDA</span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Case Study Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-indigo-500/40 p-6 sm:p-8 bg-white dark:bg-slate-950 shadow-2xl">

            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            <div className="relative h-60 sm:h-72 w-full rounded-2xl overflow-hidden mb-6">
              <img
                src={selectedProject.image}
                alt={selectedProject.title[language] || selectedProject.title.en}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(selectedProject.categories && selectedProject.categories.length > 0 ? selectedProject.categories : [selectedProject.category]).map(cat => (
                    <span key={cat} className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-black uppercase tracking-wider inline-block shadow-sm">
                      {cat}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {selectedProject.title[language] || selectedProject.title.en}
                </h3>
              </div>
            </div>

            {/* Meta Info Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 pb-5 border-b border-slate-200 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
                <span className="font-semibold">{selectedProject.client}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
                <span className="font-semibold">{selectedProject.country}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
                <span className="font-semibold">{selectedProject.completionDate}</span>
              </div>
            </div>

            {/* Technical Case Study Body */}
            <div className="space-y-6 mb-8">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-sky-400 mb-2">
                  {language === 'ar' ? 'نظرة عامة على النظام والهندسة المعمارية' : 'System Overview & Engineering Architecture'}
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  {selectedProject.fullDesc[language] || selectedProject.fullDesc.en}
                </p>
              </div>

              {/* Metrics Grid */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
                  <span>{t('portfolio.metrics')}</span>
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {selectedProject.metrics.map((metric, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                      <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-sky-400 mb-1">
                        {metric.value}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {metric.label[language] || metric.label.en}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies Architecture */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  {language === 'ar' ? 'التقنيات المستخدمة في البناء' : 'Deployed Tech Stack'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-indigo-200 dark:border-sky-500/30 text-xs font-mono text-indigo-700 dark:text-sky-300 font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
                >
                  <span>{language === 'ar' ? 'زيارة الرابط المباشر للمشروع' : 'Visit Live Deployment'}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
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

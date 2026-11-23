import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import type { Project, ServiceCategory } from '../../types';
import {
  FolderGit2,
  ArrowUpRight,
  TrendingUp,
  X,
  Calendar,
  Building,
  Globe2,
  Play,
  Video,
  Images
} from 'lucide-react';

interface PortfolioProps {
  onBookDemo?: (project: Project) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onBookDemo }) => {
  const { language, t } = useLanguage();
  const { projects } = useData();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [videoWalkthroughProject, setVideoWalkthroughProject] = useState<Project | null>(null);
  const [activeModalImageIndex, setActiveModalImageIndex] = useState<number>(0);

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => {
      if (activeCategory === 'proprietary') {
        return p.category === 'proprietary' || p.isProprietary === true || (p.categories && p.categories.includes('proprietary'));
      }
      if (p.categories && p.categories.length > 0) {
        return p.categories.includes(activeCategory);
      }
      return p.category === activeCategory;
    });

  return (
    <section id="portfolio" className="py-12 sm:py-16 lg:py-20 relative bg-slate-50 section-surface-1 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-sky-400 mb-3 sm:mb-4">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>{t('portfolio.badge')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3 sm:mb-4">
            {t('portfolio.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-lg">
            {language === 'ar'
              ? 'نماذج ودراسات حالة من أنظمة الـ ERP المخصصة وبوابات الويب السحابية وتطبيقات الجوال مع روابط مباشرة للاطلاع والتجربة.'
              : 'Explore custom ERPs, high-throughput web portals, native mobile apps, and AI integrations with direct live demonstration links.'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-12">
          {[
            { id: 'all', label: t('portfolio.all') },
            { id: 'erp', label: language === 'ar' ? 'أنظمة ERP مخصصة' : 'Custom ERP' },
            { id: 'web', label: t('portfolio.web') },
            { id: 'mobile', label: t('portfolio.mobile') },
            { id: 'ai', label: language === 'ar' ? 'ذكاء اصطناعي (AI)' : 'AI Integrations' },
            { id: 'cloud', label: t('portfolio.cloud') },
            { id: 'proprietary', label: language === 'ar' ? 'البرمجيات الحصرية (Proprietary Suite)' : 'Proprietary Suite' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as ServiceCategory)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeCategory === tab.id
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 shadow-2xs'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="glass-panel rounded-2xl border border-slate-200/90 dark:border-slate-800 p-12 text-center max-w-xl mx-auto bg-white dark:bg-slate-900/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-sky-400">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {language === 'ar' ? 'لا توجد مشاريع منشورة حالياً' : 'No Published Projects'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'ar'
                ? 'لم يتم تسجيل أي مشاريع بعد في قاعدة البيانات. يمكنك إضافة مشاريع جديدة بسهولة عبر لوحة التحكم.'
                : 'No client deliverables are currently registered in the database. New projects can be added directly via the Nexora Command Center.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {filteredProjects.map((project) => {
              const projectTitle = typeof project.title === 'object'
                ? (project.title[language] || project.title.en)
                : ((project as any).titleEn || 'Untitled Deliverable');
              const projectImage = (project.images && project.images.length > 0 ? project.images[0] : null) || project.image || (project as any).imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';
              const projectClient = project.client || (project as any).clientName || 'Enterprise Partner';
              const projectCountry = project.country || (project as any).region || 'UAE / GCC';
              const projectTags = Array.isArray(project.tags) ? project.tags : (Array.isArray((project as any).techStack) ? (project as any).techStack : []);
              const projectMetrics = Array.isArray(project.metrics) ? project.metrics : [];
              const projectShortDesc = typeof project.shortDesc === 'object'
                ? (project.shortDesc[language] || project.shortDesc.en)
                : (project.shortDesc || '');

              return (
                <div
                  key={project.id}
                  className="glass-panel rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-sky-500/50 transition-all duration-300 group hover:-translate-y-1.5 flex flex-col justify-between shadow-xs hover:shadow-xl bg-white dark:bg-slate-900/80"
                >
                  <div
                    onClick={() => {
                      setActiveModalImageIndex(0);
                      setSelectedProject(project);
                    }}
                    className="cursor-pointer"
                  >
                    {/* Image Container */}
                    <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                      <img
                        src={projectImage}
                        alt={projectTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                      {/* Category Pills */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[60%]">
                        {(project.categories && project.categories.length > 0 ? project.categories : [project.category]).map(cat => (
                          <span key={cat} className="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-indigo-400/40 text-[9px] font-mono uppercase font-bold text-sky-300 backdrop-blur-md">
                            {cat}
                          </span>
                        ))}
                      </div>

                      {/* Pulsing Watch 30s Demo Badge (Phase 4) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setVideoWalkthroughProject(project);
                        }}
                        className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 hover:bg-indigo-600 text-white text-[10px] font-extrabold border border-sky-400/50 hover:border-sky-300 backdrop-blur-md transition-all shadow-md hover:scale-105 active:scale-95 group/demobtn cursor-pointer"
                        title={language === 'ar' ? 'مشاهدة عرض الفيديو 30 ثانية' : 'Watch 30s Video Demo'}
                      >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                        </span>
                        <Play className="w-3 h-3 fill-current text-sky-300 group-hover/demobtn:text-white" />
                        <span>{language === 'ar' ? 'عرض 30ث' : 'Watch 30s Demo'}</span>
                      </button>

                      {/* Client & Country */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
                        <span className="font-semibold text-white drop-shadow">
                          {projectClient}
                        </span>
                        <span className="text-[11px] font-mono text-sky-300">
                          {projectCountry}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
                        {projectTitle}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                        {projectShortDesc}
                      </p>

                      {/* Key Metrics Badges */}
                      {projectMetrics.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 mb-4">
                          {projectMetrics.slice(0, 3).map((metric, idx) => (
                            <div key={idx} className="text-center">
                              <div className="text-xs font-black text-indigo-600 dark:text-sky-400">
                                {metric.value}
                              </div>
                              <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate">
                                {metric.label ? (metric.label[language] || metric.label.en) : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {projectTags.slice(0, 4).map((tag: string, idx: number) => (
                          <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                            {tag}
                          </span>
                        ))}
                        {projectTags.length > 4 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                            +{projectTags.length - 4}
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

                      {/* Action Button: Live Demo or Book Free Live Demo for Proprietary */}
                      {project.category === 'proprietary' || project.isProprietary ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onBookDemo) {
                              onBookDemo(project);
                            } else {
                              window.dispatchEvent(new CustomEvent('nexora_book_demo', { detail: { project } }));
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
                          title="Schedule a private interactive 30-minute walkthrough"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'حجز عرض حي مجاني' : 'Book Free Live Demo'}</span>
                        </button>
                      ) : project.images && project.images.length > 1 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-sky-300 text-[11px] font-mono font-semibold">
                          <Images className="w-3.5 h-3.5" />
                          <span>{project.images.length} Arch Views</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-400">Enterprise Solution</span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

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

            {/* Modal Image Header & Gallery */}
            {(() => {
              const modalImages = selectedProject.images && selectedProject.images.length > 0
                ? selectedProject.images
                : [selectedProject.image || (selectedProject as any).imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'];
              const currentImg = modalImages[activeModalImageIndex] || modalImages[0];

              return (
                <div className="space-y-3 mb-6">
                  <div className="relative h-60 sm:h-72 w-full rounded-2xl overflow-hidden">
                    <img
                      src={currentImg}
                      alt={typeof selectedProject.title === 'object' ? (selectedProject.title[language] || selectedProject.title.en) : ((selectedProject as any).titleEn || '')}
                      className="w-full h-full object-cover transition-all duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';
                      }}
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
                        {typeof selectedProject.title === 'object' ? (selectedProject.title[language] || selectedProject.title.en) : ((selectedProject as any).titleEn || '')}
                      </h3>
                    </div>
                  </div>

                  {/* Thumbnail Row if Multiple Images */}
                  {modalImages.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {modalImages.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveModalImageIndex(idx)}
                          className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                            activeModalImageIndex === idx
                              ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-500/20'
                              : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Meta Info Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 pb-5 border-b border-slate-200 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
                <span className="font-semibold">{selectedProject.client || (selectedProject as any).clientName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
                <span className="font-semibold">{selectedProject.country || (selectedProject as any).region}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
                <span className="font-semibold">{selectedProject.completionDate || '2026'}</span>
              </div>
            </div>

            {/* Technical Case Study Body */}
            <div className="space-y-6 mb-8">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-sky-400 mb-2">
                  {language === 'ar' ? 'نظرة عامة على النظام والهندسة المعمارية' : 'System Overview & Engineering Architecture'}
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  {typeof selectedProject.fullDesc === 'object' ? (selectedProject.fullDesc[language] || selectedProject.fullDesc.en) : (selectedProject.fullDesc || selectedProject.shortDesc || '')}
                </p>
              </div>

              {/* Metrics Grid */}
              {Array.isArray(selectedProject.metrics) && selectedProject.metrics.length > 0 && (
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
                          {metric.label ? (metric.label[language] || metric.label.en) : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies Architecture */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  {language === 'ar' ? 'التقنيات المستخدمة في البناء' : 'Deployed Tech Stack'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(selectedProject.tags) ? selectedProject.tags : (Array.isArray((selectedProject as any).techStack) ? (selectedProject as any).techStack : [])).map((tag: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-indigo-200 dark:border-sky-500/30 text-xs font-mono text-indigo-700 dark:text-sky-300 font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
              {(selectedProject.category === 'proprietary' || selectedProject.isProprietary) && (
                <button
                  type="button"
                  onClick={() => {
                    const proj = selectedProject;
                    setSelectedProject(null);
                    if (onBookDemo) {
                      onBookDemo(proj);
                    } else {
                      window.dispatchEvent(new CustomEvent('nexora_book_demo', { detail: { project: proj } }));
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 hover:scale-[1.02] cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{language === 'ar' ? 'حجز عرض حي تفاعلي مجاناً' : 'Book Free Live Demo'}</span>
                </button>
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

      {/* Video Walkthrough Modal (Phase 4) */}
      {videoWalkthroughProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div
            className="fixed inset-0"
            onClick={() => setVideoWalkthroughProject(null)}
          />
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-750 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 overflow-hidden text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-sky-400">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950/80 border border-sky-500/30 text-sky-400 font-bold">
                      {language === 'ar' ? 'عرض حي للنظام (30 ثانية)' : '30s Interactive Architecture Demo'}
                    </span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-xs text-slate-400">
                      {videoWalkthroughProject.client || (videoWalkthroughProject as any).clientName}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {typeof videoWalkthroughProject.title === 'object'
                      ? (videoWalkthroughProject.title[language] || videoWalkthroughProject.title.en)
                      : ((videoWalkthroughProject as any).titleEn || '')}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setVideoWalkthroughProject(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Frame with Video / Interactive Simulation Walkthrough */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner mb-5 group">
              <video
                src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42994-large.mp4"
                poster={videoWalkthroughProject.image || (videoWalkthroughProject as any).imageUrl}
                controls
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* In-video HUD Overlay */}
              <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ERP SYSTEM ACTIVE • 99.99% SLA</span>
              </div>
            </div>

            {/* Video Footer Info & CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-400 text-center sm:text-start">
                <span className="font-semibold text-slate-200">
                  {language === 'ar' ? 'التقنيات المنفذة في هذا النظام:' : 'Core Stack:'}
                </span>{' '}
                {(Array.isArray(videoWalkthroughProject.tags) ? videoWalkthroughProject.tags : (Array.isArray((videoWalkthroughProject as any).techStack) ? (videoWalkthroughProject as any).techStack : [])).slice(0, 4).join(' • ')}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setVideoWalkthroughProject(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  {language === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

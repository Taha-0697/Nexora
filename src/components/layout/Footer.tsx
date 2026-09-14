import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { NexoraLogo } from '../common/NexoraLogo';
import { Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { language, t } = useLanguage();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-100 dark:bg-dark-950 border-t border-slate-200 dark:border-slate-800/80 pt-16 pb-12 text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800/80">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <NexoraLogo size="md" />
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
              {t('footer.tagline')}
            </p>
            <div className="flex flex-wrap items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <span className="px-2.5 py-1 rounded bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-indigo-600 dark:text-sky-400 font-semibold shadow-xs">
                ISO/IEC 27001 Certified
              </span>
              <span className="px-2.5 py-1 rounded bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-indigo-600 dark:text-sky-400 font-semibold shadow-xs">
                Odoo Official Partner
              </span>
              <span className="px-2.5 py-1 rounded bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-indigo-600 dark:text-sky-400 font-semibold shadow-xs">
                AWS Solution Architect
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              {language === 'ar' ? 'روابط سريعة' : 'Navigation'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollTo('services')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors">
                  {t('nav.services')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('portfolio')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors">
                  {t('nav.portfolio')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('estimator')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors">
                  {t('nav.estimator')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('tech-stack')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors">
                  {t('nav.techStack')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('reviews')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors">
                  {t('nav.reviews')}
                </button>
              </li>
            </ul>
          </div>

          {/* Core Software House Engineering */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              {language === 'ar' ? 'الخدمات الهندسية' : 'Software Engineering'}
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>Custom ERP Systems & Odoo 17</li>
              <li>Custom Enterprise Web Portals</li>
              <li>Custom Mobile Apps (iOS & Android)</li>
              <li>24/7 Cloud & Server DevOps</li>
              <li>High-Velocity Headless Portals</li>
            </ul>
          </div>

          {/* Governance & Admin */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              {language === 'ar' ? 'الإدارة والحوكمة' : 'Enterprise & Admin'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 text-indigo-600 dark:text-sky-400 hover:text-indigo-700 dark:hover:text-sky-300 font-semibold transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t('admin.title')}</span>
                </button>
              </li>
              <li>Mutual Non-Disclosure (NDA)</li>
              <li>Tier-4 Service Level Agreement (SLA)</li>
              <li>Enterprise Security & Zero-Trust</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} {t('footer.rights')}
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with precision for enterprise scale</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

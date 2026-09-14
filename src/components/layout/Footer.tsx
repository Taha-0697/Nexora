import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { NexoraLogo } from '../common/NexoraLogo';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const { language, t } = useLanguage();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 pt-16 pb-12 text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800/80">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <NexoraLogo size="md" />
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
              {t('footer.tagline')}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-indigo-600 dark:text-sky-400 font-semibold">
                .NET Core & Next.js
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-indigo-600 dark:text-sky-400 font-semibold">
                MSSQL & Redis
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-indigo-600 dark:text-sky-400 font-semibold">
                Swift • Kotlin • Flutter
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-indigo-600 dark:text-sky-400 font-semibold">
                ISO 27001 Certified
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
                <button onClick={() => scrollTo('services')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer">
                  {t('nav.services')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('portfolio')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer">
                  {t('nav.portfolio')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('estimator')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer">
                  {t('nav.estimator')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('tech-stack')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer">
                  {t('nav.techStack')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('reviews')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer">
                  {t('nav.reviews')}
                </button>
              </li>
            </ul>
          </div>

          {/* Core Software House Engineering */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              {language === 'ar' ? 'الخدمات الهندسية الأساسية' : 'Software House Core'}
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>Custom Web ERP (.NET & MSSQL)</li>
              <li>Custom Web Portals (Next.js & React)</li>
              <li>Custom Mobile Apps (Swift & Kotlin)</li>
              <li>REST API Integrations & Microservices</li>
              <li>AI Integrations & Agentic LLMs</li>
              <li>24/7 Cloud DevOps & Kubernetes</li>
              <li>Bespoke ERP Modules & System Integration</li>
            </ul>
          </div>

          {/* Enterprise Governance & Compliance */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              {language === 'ar' ? 'الأمان والحوكمة' : 'Enterprise Assurance'}
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400 shrink-0" />
                <span>Mutual Non-Disclosure (NDA)</span>
              </li>
              <li>Tier-4 99.99% Availability SLA</li>
              <li>Zero-Trust Role-Based Access</li>
              <li>Encrypted MSSQL & Automated Backups</li>
              <li>Agile Bi-Weekly Sprint Milestones</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} {t('footer.rights')}
          </div>
          <div className="flex items-center gap-2">
            <span>Built with React, Next.js, .NET Core & TypeScript</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

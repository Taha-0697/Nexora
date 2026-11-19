import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { NexoraLogo } from '../common/NexoraLogo';
import { ShieldCheck } from 'lucide-react';
<<<<<<< HEAD
import type { AppView } from './Navbar';

interface FooterProps {
  onOpenAdmin?: () => void;
  onNavigate?: (view: AppView, targetSection?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  const handleLinkClick = (sectionId: string) => {
    if (onNavigate) {
      onNavigate('website', sectionId);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubpageClick = (view: AppView) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  return (
    <footer className="bg-slate-100 dark:bg-[#060913] border-t border-slate-200 dark:border-slate-800/80 pt-16 pb-12 text-slate-600 dark:text-slate-400 text-xs transition-colors">
=======

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
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800/80">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
<<<<<<< HEAD
            <div onClick={() => handleSubpageClick('website')} className="cursor-pointer">
              <NexoraLogo size="md" />
            </div>
=======
            <NexoraLogo size="md" />
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
              {t('footer.tagline')}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-slate-600 dark:text-slate-300">
<<<<<<< HEAD
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-indigo-600 dark:text-sky-400 font-semibold">
                .NET 9 Core & Next.js
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-indigo-600 dark:text-sky-400 font-semibold">
                Odoo & Python 3.12
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-indigo-600 dark:text-sky-400 font-semibold">
                MSSQL & PostgreSQL
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-indigo-600 dark:text-sky-400 font-semibold">
                99.99% SLA Uptime
=======
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
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
<<<<<<< HEAD
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] font-heading">
=======
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
              {language === 'ar' ? 'روابط سريعة' : 'Navigation'}
            </h4>
            <ul className="space-y-2">
              <li>
<<<<<<< HEAD
                <button onClick={() => handleLinkClick('services')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer">
=======
                <button onClick={() => scrollTo('services')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
                  {t('nav.services')}
                </button>
              </li>
              <li>
<<<<<<< HEAD
                <button onClick={() => handleLinkClick('portfolio')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer">
=======
                <button onClick={() => scrollTo('portfolio')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
                  {t('nav.portfolio')}
                </button>
              </li>
              <li>
<<<<<<< HEAD
                <button onClick={() => handleLinkClick('estimator')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer">
=======
                <button onClick={() => scrollTo('estimator')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
                  {t('nav.estimator')}
                </button>
              </li>
              <li>
<<<<<<< HEAD
                <button onClick={() => handleLinkClick('tech-stack')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer">
=======
                <button onClick={() => scrollTo('tech-stack')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
                  {t('nav.techStack')}
                </button>
              </li>
              <li>
<<<<<<< HEAD
                <button onClick={() => handleLinkClick('why-us')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer">
                  {language === 'ar' ? 'لماذا نيكسورا؟' : 'Why Nexora'}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('reviews')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer">
=======
                <button onClick={() => scrollTo('reviews')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
                  {t('nav.reviews')}
                </button>
              </li>
            </ul>
          </div>

          {/* Core Software House Engineering */}
          <div className="space-y-3">
<<<<<<< HEAD
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] font-heading">
              {language === 'ar' ? 'الخدمات الهندسية الأساسية' : 'Flagship Services'}
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => handleSubpageClick('service-custom-dotnet-erp')}
                  className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors text-left font-medium"
                >
                  Custom Web ERP (.NET 9 & MSSQL)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSubpageClick('service-odoo-enterprise')}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-left font-medium"
                >
                  Odoo Enterprise & Python Bridges
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSubpageClick('service-ai-and-cloud')}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-left font-medium"
                >
                  AI Integrations & 24/7 Cloud DevOps
                </button>
              </li>
              <li>Custom Web Portals (Next.js & React 19)</li>
              <li>Native Mobile Apps (iOS, Android & Flutter)</li>
              <li>REST API Integrations & Microservices</li>
              <li>Legacy Database Migration & CDC Sync</li>
=======
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
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
            </ul>
          </div>

          {/* Enterprise Governance & Compliance */}
          <div className="space-y-3">
<<<<<<< HEAD
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] font-heading">
=======
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
              {language === 'ar' ? 'الأمان والحوكمة' : 'Enterprise Assurance'}
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
<<<<<<< HEAD
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Client Code & IP Ownership</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero Per-Seat SaaS Licensing Lock-in</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>ZATCA Phase-2 Tax Compliant</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>NDA & Direct Senior Architect SLA</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>SOC2 & ISO 27001 Security Best Practices</span>
              </li>
=======
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400 shrink-0" />
                <span>Mutual Non-Disclosure (NDA)</span>
              </li>
              <li>Tier-4 99.99% Availability SLA</li>
              <li>Zero-Trust Role-Based Access</li>
              <li>Encrypted MSSQL & Automated Backups</li>
              <li>Agile Bi-Weekly Sprint Milestones</li>
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
            </ul>
          </div>

        </div>

<<<<<<< HEAD
        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-500">
          <div>
            © {new Date().getFullYear()} Nexora Systems Ltd. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-6">
            <span>Dubai • London • Muscat</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="font-mono text-emerald-600 dark:text-emerald-400">99.99% SLA Guaranteed</span>
=======
        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} {t('footer.rights')}
          </div>
          <div className="flex items-center gap-2">
            <span>Built with React, Next.js, .NET Core & TypeScript</span>
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
          </div>
        </div>

      </div>
    </footer>
  );
};

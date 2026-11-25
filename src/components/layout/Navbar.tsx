import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { NexoraLogo } from '../common/NexoraLogo';
import {
  Menu,
  X,
  Star,
  Globe,
  ArrowUpRight,
  Sun,
  Moon,
  Megaphone,
  ChevronDown,
  Code2,
  Layers,
  Globe2,
  Smartphone,
  RefreshCw,
  ArrowRight,
  Bot,
  Cloud,
  Calendar
} from 'lucide-react';

export type AppView =
  | 'website'
  | 'admin'
  | 'case-studies'
  | 'service-custom-dotnet-erp'
  | 'service-odoo-enterprise'
  | 'service-web-apps'
  | 'service-mobile-apps'
  | 'service-ai-and-agents'
  | 'service-cloud-devops'
  | 'service-erp-modernization';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onNavigate?: (view: AppView, targetSection?: string) => void;
  onOpenQuote: () => void;
  onBookDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onNavigate,
  onOpenQuote,
  onBookDemo,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { googleSettings, marketingSettings } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleNavigate = (view: AppView, targetSection?: string) => {
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(view, targetSection);
    } else {
      setCurrentView(view);
      if (view === 'website' && targetSection) {
        setTimeout(() => {
          document.getElementById(targetSection)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const scrollToSection = (id: string) => {
    handleNavigate('website', id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setServicesDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 200);
  };

  return (
    <>
      {/* Top Marketing Announcement Banner */}
      {marketingSettings?.bannerEnabled && (
        <div className="bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-800 text-white text-xs py-2 px-4 text-center font-medium shadow-xs transition-colors flex items-center justify-center gap-2">
          <Megaphone className="w-3.5 h-3.5 shrink-0 animate-pulse text-sky-200" />
          <span className="truncate max-w-2xl">
            {marketingSettings.bannerText[language] || marketingSettings.bannerText.en}
          </span>
          {marketingSettings.bannerUrl && (
            <a
              href={marketingSettings.bannerUrl}
              className="inline-flex items-center gap-1 font-bold underline hover:text-sky-200 ml-1 shrink-0"
            >
              <span>{marketingSettings.bannerCtaText[language] || 'Learn More'}</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Main Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 dark:bg-[#060913]/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 shadow-xs dark:shadow-none">
        <div className="w-100 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16 sm:h-[72px]">

            {/* Logo Brand */}
            <div
              onClick={() => handleNavigate('website')}
              className="cursor-pointer group shrink-0"
            >
              <NexoraLogo size="sm" />
            </div>

            {/* Desktop Navigation Links (Strictly single-line, zero overlap) */}
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-0.5 xl:gap-1.5 min-w-0">
              {/* Interactive Services Dropdown */}
              <div
                ref={dropdownRef}
                className="relative shrink-0"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className={`inline-flex items-center gap-1 px-2 xl:px-2.5 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${servicesDropdownOpen || currentView.startsWith('service-')
                    ? 'text-indigo-600 dark:text-sky-400 bg-indigo-50/70 dark:bg-sky-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                    }`}
                  aria-expanded={servicesDropdownOpen}
                >
                  <span>{t('nav.services')}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-indigo-600 dark:text-sky-400' : ''
                      }`}
                  />
                </button>

                {/* Dropdown Flyout Menu */}
                {servicesDropdownOpen && (
                  <div className="absolute top-full start-0 mt-2 w-[620px] rounded-2xl glass-panel bg-white/95 dark:bg-[#0E1526]/95 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">

                      {/* Column 1: Core Enterprise Solutions */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-sky-400 px-2 pb-1">
                          {language === 'ar' ? 'أنظمة المؤسسات و ERP' : 'Enterprise Systems & Portals'}
                        </div>

                        <div
                          onClick={() => handleNavigate('service-custom-dotnet-erp')}
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
                              <Code2 className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-sky-400 flex items-center gap-1 font-heading">
                                <span>{language === 'ar' ? 'نظام ERP مخصص بـ .NET' : 'Custom .NET Web ERP'}</span>
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                {language === 'ar' ? 'شفرة خاصة، بدون اشتراكات، ملكية 100%' : 'Bespoke microservices, zero seat licensing, 100% IP.'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          onClick={() => handleNavigate('service-odoo-enterprise')}
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/70 border border-purple-200/60 dark:border-purple-500/30 flex items-center justify-center shrink-0 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                              <Layers className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 flex items-center gap-1 font-heading">
                                <span>{language === 'ar' ? 'تطوير أودو إنتربرايز' : 'Odoo Enterprise & Python'}</span>
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                {language === 'ar' ? 'موديولات مخصصة، جسور FastAPI، مزامنة' : 'Custom modules, FastAPI bridges & PostgreSQL sync.'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          onClick={() => handleNavigate('service-web-apps')}
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-200/60 dark:border-blue-500/30 flex items-center justify-center shrink-0 text-blue-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
                              <Globe2 className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 flex items-center gap-1 font-heading">
                                <span>{language === 'ar' ? 'بوابات الويب و REST APIs' : 'Custom Web Apps & REST APIs'}</span>
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                {language === 'ar' ? 'بوابات React/Next.js عالية السرعة' : 'Next.js 15, React 19, high-concurrency microservices.'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          onClick={() => handleNavigate('service-mobile-apps')}
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/70 border border-sky-200/60 dark:border-sky-500/30 flex items-center justify-center shrink-0 text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
                              <Smartphone className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 flex items-center gap-1 font-heading">
                                <span>{language === 'ar' ? 'تطبيقات الجوال (iOS و Android)' : 'Mobile Apps (iOS, Android, Flutter)'}</span>
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                {language === 'ar' ? 'تطبيقات أصلية وفلاتر للشركات' : 'Native Swift, Kotlin, and offline-first Flutter.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Column 2: Advanced AI, Cloud & Modernization */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 px-2 pb-1">
                          {language === 'ar' ? 'الذكاء الاصطناعي والحوسبة السحابية' : 'AI, Cloud & Modernization'}
                        </div>

                        <div
                          onClick={() => handleNavigate('service-ai-and-agents')}
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200/60 dark:border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
                              <Bot className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 flex items-center gap-1 font-heading">
                                <span>{language === 'ar' ? 'ذكاء اصطناعي وأتمتة الوكلاء' : 'AI Integrations & Agentic Automation'}</span>
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                {language === 'ar' ? 'أنابيب RAG، وكلاء LangGraph، pgvector' : 'Enterprise RAG, LangGraph agents, pgvector.'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          onClick={() => handleNavigate('service-cloud-devops')}
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/70 border border-sky-200/60 dark:border-sky-500/30 flex items-center justify-center shrink-0 text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
                              <Cloud className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 flex items-center gap-1 font-heading">
                                <span>{language === 'ar' ? 'إدارة السيرفرات السحابية 24/7' : '24/7 Cloud DevOps & SRE'}</span>
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                {language === 'ar' ? 'جاهزية 99.99%، Kubernetes، Terraform' : 'Kubernetes, Terraform IaC & Prometheus 99.99% SLA.'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          onClick={() => handleNavigate('service-erp-modernization')}
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/70 border border-amber-200/60 dark:border-amber-500/30 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                              <RefreshCw className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 flex items-center gap-1 font-heading">
                                <span>{language === 'ar' ? 'تحديث ERP والتكامل الشامل' : 'ERP Modernization & Integration'}</span>
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                {language === 'ar' ? 'بث CDC، انتقال تدريجي بدون توقف' : 'Change Data Capture (Kafka) & zero-downtime cutover.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Dropdown Footer CTA */}
                    <div className="pt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {language === 'ar' ? 'هل تريد معرفة نطاق وتكلفة مشروعك؟' : 'Need an architecture scope and budget estimate?'}
                      </span>
                      <button
                        onClick={() => scrollToSection('estimator')}
                        className="font-bold text-indigo-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{language === 'ar' ? 'افتح الحاسبة التفاعلية' : 'Open Cost Estimator'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Dedicated Case Studies Nav Link */}
              <button
                onClick={() => handleNavigate('case-studies')}
                className={`px-2 xl:px-2.5 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${currentView === 'case-studies'
                  ? 'text-indigo-600 dark:text-sky-400 bg-indigo-50/70 dark:bg-sky-950/40 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                  }`}
              >
                {language === 'ar' ? 'دراسات الحالة' : 'Case Studies'}
              </button>

              <button
                onClick={() => scrollToSection('portfolio')}
                className="px-2 xl:px-2.5 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                {t('nav.portfolio')}
              </button>
              <button
                onClick={() => scrollToSection('estimator')}
                className="px-2 xl:px-2.5 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                {t('nav.estimator')}
              </button>

              <button
                onClick={() => scrollToSection('tech-stack')}
                className="hidden xl:inline-flex px-2.5 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                {t('nav.techStack')}
              </button>
              <button
                onClick={() => scrollToSection('why-us')}
                className="hidden 2xl:inline-flex px-2.5 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                {language === 'ar' ? 'لماذا نيكسورا؟' : 'Why Nexora'}
              </button>
              <button
                onClick={() => scrollToSection('reviews')}
                className="px-2 xl:px-2.5 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                {t('nav.reviews')}
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="px-2 xl:px-2.5 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                {t('nav.contact')}
              </button>
            </nav>

            {/* Right Action Tools: Google Rating, Theme Switcher, Language Switcher, Main CTA */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">

              {/* Google Rating Pill (shown on 2xl+ to prevent overlap on 1024-1440px screens) */}
              {/* <a
                href={googleSettings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Verified Google Reviews Rating"
                className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 hover:border-amber-500/40 text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors shrink-0"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <div className="flex items-center text-amber-500 font-bold">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
                  <span>{googleSettings.overallRating}</span>
                </div>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">({googleSettings.totalReviewsCount})</span>
              </a> */}

              {/* Dark / Light Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shrink-0"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                aria-label="Toggle Theme Mode"
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4 text-indigo-600" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
              </button>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap transition-colors cursor-pointer shrink-0"
                title="Switch Language (English / Arabic)"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400 shrink-0" />
                <span>{language === 'en' ? 'العربية' : 'EN'}</span>
              </button>

              {/* Book Free Live Demo */}
              {onBookDemo && (
                <button
                  onClick={onBookDemo}
                  className="hidden 2xl:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-500/30 text-indigo-700 dark:text-sky-300 text-xs font-bold whitespace-nowrap transition-all active:scale-95 cursor-pointer shadow-2xs shrink-0"
                  title="Schedule a private interactive 30-minute walkthrough"
                >
                  <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400 shrink-0" />
                  <span>{language === 'ar' ? 'عرض حي مجاني' : 'Live Demo'}</span>
                </button>
              )}

              {/* Main Proposal CTA */}
              <button
                onClick={onOpenQuote}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg btn-primary-cta text-white font-bold text-xs tracking-wide whitespace-nowrap shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <span>{t('nav.quote')}</span>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>

            {/* Mobile & Tablet Actions (Theme, Language, CTA on md, Hamburger) */}
            <div className="flex lg:hidden items-center gap-2 shrink-0">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                aria-label="Toggle Theme Mode"
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4 text-indigo-600" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
              </button>

              <button
                onClick={toggleLanguage}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-indigo-600 dark:text-sky-400 whitespace-nowrap cursor-pointer"
              >
                {language === 'en' ? 'عربي' : 'EN'}
              </button>

              <button
                onClick={onOpenQuote}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg btn-primary-cta text-white font-bold text-xs whitespace-nowrap cursor-pointer"
              >
                <span>{t('nav.quote')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile & Tablet Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-[#060913] border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3 shadow-xl max-h-[80vh] overflow-y-auto">
            {/* Mobile Services Accordion */}
            <div>
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="flex items-center justify-between w-full py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-sky-400"
              >
                <span>{t('nav.services')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileServicesOpen && (
                <div className="pl-3 pr-1 py-2 space-y-1.5 border-l-2 border-indigo-500/30 dark:border-sky-500/30 my-1 bg-slate-50/50 dark:bg-slate-900/40 rounded-r-lg">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-sky-400 pt-1">
                    {language === 'ar' ? 'صفحات الخدمات المخصصة (7 خدمات)' : 'Dedicated Service Pages (7 Services)'}
                  </div>
                  <button
                    onClick={() => handleNavigate('service-custom-dotnet-erp')}
                    className="block w-full text-left py-1 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-sky-400"
                  >
                    • {language === 'ar' ? 'نظام ERP مخصص بـ .NET' : 'Custom .NET Web ERP'}
                  </button>
                  <button
                    onClick={() => handleNavigate('service-odoo-enterprise')}
                    className="block w-full text-left py-1 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    • {language === 'ar' ? 'تطوير أودو إنتربرايز و Python' : 'Odoo Enterprise & Python'}
                  </button>
                  <button
                    onClick={() => handleNavigate('service-web-apps')}
                    className="block w-full text-left py-1 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-sky-400"
                  >
                    • {language === 'ar' ? 'بوابات الويب و REST APIs' : 'Custom Web Apps & REST APIs'}
                  </button>
                  <button
                    onClick={() => handleNavigate('service-mobile-apps')}
                    className="block w-full text-left py-1 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400"
                  >
                    • {language === 'ar' ? 'تطبيقات الجوال (iOS, Android, Flutter)' : 'Custom Mobile Apps (iOS, Android, Flutter)'}
                  </button>
                  <button
                    onClick={() => handleNavigate('service-ai-and-agents')}
                    className="block w-full text-left py-1 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400"
                  >
                    • {language === 'ar' ? 'ذكاء اصطناعي وأتمتة الوكلاء' : 'AI Integrations & Agentic Automation'}
                  </button>
                  <button
                    onClick={() => handleNavigate('service-cloud-devops')}
                    className="block w-full text-left py-1 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400"
                  >
                    • {language === 'ar' ? 'إدارة السيرفرات السحابية 24/7' : '24/7 Server Management & Cloud DevOps'}
                  </button>
                  <button
                    onClick={() => handleNavigate('service-erp-modernization')}
                    className="block w-full text-left py-1 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400"
                  >
                    • {language === 'ar' ? 'تحديث ERP والتكامل الشامل' : 'ERP Modernization & Integration'}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavigate('case-studies')}
              className={`block w-full text-left py-2 text-sm font-semibold transition-colors ${currentView === 'case-studies'
                ? 'text-indigo-600 dark:text-sky-400 font-bold'
                : 'text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-sky-400'
                }`}
            >
              {language === 'ar' ? 'دراسات الحالة' : 'Case Studies'}
            </button>

            <button
              onClick={() => scrollToSection('portfolio')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-sky-400"
            >
              {t('nav.portfolio')}
            </button>
            <button
              onClick={() => scrollToSection('estimator')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-sky-400"
            >
              {t('nav.estimator')}
            </button>
            <button
              onClick={() => scrollToSection('tech-stack')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-sky-400"
            >
              {t('nav.techStack')}
            </button>
            <button
              onClick={() => scrollToSection('why-us')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-sky-400"
            >
              {language === 'ar' ? 'لماذا نيكسورا؟' : 'Why Nexora'}
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-sky-400"
            >
              {t('nav.reviews')}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-sky-400"
            >
              {t('nav.contact')}
            </button>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              {onBookDemo && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onBookDemo();
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-sky-300 font-bold text-xs text-center border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'حجز عرض حي تفاعلي مجاني' : 'Book Free Live Demo'}</span>
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote();
                }}
                className="w-full py-3 rounded-xl btn-primary-cta text-white font-bold text-sm text-center shadow-md shadow-indigo-600/25"
              >
                {t('nav.quote')}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

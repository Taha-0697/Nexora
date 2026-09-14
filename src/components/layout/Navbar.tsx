import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { NexoraLogo } from '../common/NexoraLogo';
import { Menu, X, Star, Globe, ArrowUpRight, Sun, Moon, Megaphone } from 'lucide-react';

interface NavbarProps {
  currentView: 'website' | 'admin';
  setCurrentView: (view: 'website' | 'admin') => void;
  onOpenQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenQuote,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { googleSettings, marketingSettings } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const scrollToSection = (id: string) => {
    if (currentView !== 'website') {
      setCurrentView('website');
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Marketing Announcement Banner (Controlled by Marketing Manager in Admin) */}
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
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 shadow-xs dark:shadow-none">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo Brand */}
            <div
              onClick={() => { setCurrentView('website'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="cursor-pointer group"
            >
              <NexoraLogo size="sm" />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              <button
                onClick={() => scrollToSection('services')}
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
              >
                {t('nav.services')}
              </button>
              <button
                onClick={() => scrollToSection('portfolio')}
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
              >
                {t('nav.portfolio')}
              </button>
              <button
                onClick={() => scrollToSection('estimator')}
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
              >
                {t('nav.estimator')}
              </button>
              <button
                onClick={() => scrollToSection('tech-stack')}
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
              >
                {t('nav.techStack')}
              </button>
              <button
                onClick={() => scrollToSection('reviews')}
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
              >
                {t('nav.reviews')}
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
              >
                {t('nav.contact')}
              </button>
            </nav>

            {/* Right Action Tools: Currency Converter, Google Rating, Theme Switcher, Language Switcher, Main CTA */}
            <div className="hidden md:flex items-center gap-2.5">

              {/* Google Rating Pill */}
              <a
                href={googleSettings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Verified Google Reviews Rating"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 hover:border-amber-500/40 text-xs text-slate-700 dark:text-slate-300 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
              </a>


              {/* Dark / Light Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                title="Switch Language (English / Arabic)"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
                <span>{language === 'en' ? 'العربية' : 'English'}</span>
              </button>

              {/* Main Proposal CTA */}
              <button
                onClick={onOpenQuote}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs tracking-wide shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all active:scale-95 cursor-pointer"
              >
                <span>{t('nav.quote')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Actions (Theme, Language, Hamburger) */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
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
                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-indigo-600 dark:text-sky-400"
              >
                {language === 'en' ? 'عربي' : 'EN'}
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

        {/* Mobile Drawer Menu (No Public Admin Link) */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3 shadow-xl">
            <button
              onClick={() => scrollToSection('services')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-sky-400"
            >
              {t('nav.services')}
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

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote();
                }}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm text-center shadow-md shadow-indigo-600/25"
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

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import { Services } from './components/sections/Services';
import { Estimator } from './components/sections/Estimator';
import { Portfolio } from './components/sections/Portfolio';
import { TechStack } from './components/sections/TechStack';
import { GoogleReviewsSection } from './components/sections/GoogleReviewsSection';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/layout/Footer';
import { QuickQuoteModal } from './components/modals/QuickQuoteModal';
import { AdminPortal } from './components/admin/AdminPortal';

const MainApp: React.FC = () => {
  const { language } = useLanguage();
  const [currentView, setCurrentView] = useState<'website' | 'admin'>('website');

  // Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quotePrefill, setQuotePrefill] = useState<any>(null);

  // Check URL hash for direct #admin access
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setCurrentView('admin');
    }
  }, []);

  const handleOpenQuoteWithService = (serviceName: string) => {
    setQuotePrefill({ serviceName });
    setIsQuoteModalOpen(true);
  };

  const handleOpenQuoteWithScope = (scopeDetails: any) => {
    setQuotePrefill(scopeDetails);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 font-sans selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:bg-sky-500/30 dark:selection:text-sky-200 transition-colors duration-300 ${language === 'ar' ? 'font-arabic' : ''}`}>
      
      {currentView === 'website' ? (
        <>
          <Navbar 
            currentView={currentView}
            setCurrentView={setCurrentView}
            onOpenQuote={() => {
              setQuotePrefill(null);
              setIsQuoteModalOpen(true);
            }}
          />

          <main>
            <Hero onOpenQuote={() => setIsQuoteModalOpen(true)} />
            <Services onSelectService={handleOpenQuoteWithService} />
            <Estimator onRequestProposalWithScope={handleOpenQuoteWithScope} />
            <Portfolio />
            <TechStack />
            <GoogleReviewsSection />
            <Contact />
          </main>

          <Footer onOpenAdmin={() => setCurrentView('admin')} />

          <QuickQuoteModal
            isOpen={isQuoteModalOpen}
            onClose={() => setIsQuoteModalOpen(false)}
            prefillScope={quotePrefill}
          />
        </>
      ) : (
        <AdminPortal onBackToWebsite={() => setCurrentView('website')} />
      )}

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <DataProvider>
          <MainApp />
        </DataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;

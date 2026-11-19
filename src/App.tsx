import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import { Navbar, type AppView } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import { Services } from './components/sections/Services';
import { Estimator } from './components/sections/Estimator';
import { Portfolio } from './components/sections/Portfolio';
import { TechStack } from './components/sections/TechStack';
import { WhyChooseUs } from './components/sections/WhyChooseUs';
import { GoogleReviewsSection } from './components/sections/GoogleReviewsSection';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/layout/Footer';
import { QuickQuoteModal } from './components/modals/QuickQuoteModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { CustomDotNetErpPage } from './components/pages/CustomDotNetErpPage';
import { OdooEnterprisePage } from './components/pages/OdooEnterprisePage';
import { AiAndCloudPage } from './components/pages/AiAndCloudPage';

const MainApp: React.FC = () => {
  const { language } = useLanguage();
  const [currentView, setCurrentView] = useState<AppView>('website');

  // Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quotePrefill, setQuotePrefill] = useState<any>(null);

  // Synchronize route with URL pathname & hash
  useEffect(() => {
    const syncRouteFromUrl = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      const hash = window.location.hash.toLowerCase();

      if (
        path === '/admin' ||
        path === '/adminportal' ||
        hash === '#admin' ||
        hash === '#adminportal'
      ) {
        setCurrentView('admin');
      } else if (
        path === '/services/custom-dotnet-erp' ||
        hash === '#services/custom-dotnet-erp'
      ) {
        setCurrentView('service-custom-dotnet-erp');
      } else if (
        path === '/services/odoo-enterprise' ||
        hash === '#services/odoo-enterprise'
      ) {
        setCurrentView('service-odoo-enterprise');
      } else if (
        path === '/services/ai-and-cloud' ||
        hash === '#services/ai-and-cloud'
      ) {
        setCurrentView('service-ai-and-cloud');
      } else {
        setCurrentView('website');
      }
    };

    syncRouteFromUrl();
    window.addEventListener('popstate', syncRouteFromUrl);
    window.addEventListener('hashchange', syncRouteFromUrl);

    return () => {
      window.removeEventListener('popstate', syncRouteFromUrl);
      window.removeEventListener('hashchange', syncRouteFromUrl);
    };
  }, []);

  const handleNavigate = (view: AppView, targetSection?: string) => {
    setCurrentView(view);

    if (view === 'website') {
      if (targetSection) {
        try {
          history.pushState(null, '', `/#${targetSection}`);
        } catch {
          window.location.hash = `#${targetSection}`;
        }
        setTimeout(() => {
          const el = document.getElementById(targetSection);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        try {
          history.pushState(null, '', '/');
        } catch {
          window.location.hash = '';
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (view === 'service-custom-dotnet-erp') {
      try {
        history.pushState(null, '', '/services/custom-dotnet-erp');
      } catch {
        window.location.hash = '#services/custom-dotnet-erp';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'service-odoo-enterprise') {
      try {
        history.pushState(null, '', '/services/odoo-enterprise');
      } catch {
        window.location.hash = '#services/odoo-enterprise';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'service-ai-and-cloud') {
      try {
        history.pushState(null, '', '/services/ai-and-cloud');
      } catch {
        window.location.hash = '#services/ai-and-cloud';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'admin') {
      try {
        history.pushState(null, '', '/admin');
      } catch {
        window.location.hash = '#admin';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReturnToWebsite = () => {
    handleNavigate('website');
  };

  const handleOpenQuoteWithService = (serviceName: string) => {
    setQuotePrefill({ serviceName });
    setIsQuoteModalOpen(true);
  };

  const handleOpenQuoteWithScope = (scopeDetails: any) => {
    setQuotePrefill(scopeDetails);
    setIsQuoteModalOpen(true);
  };

  const handleNavigateToEstimator = () => {
    handleNavigate('website', 'estimator');
  };

  return (
    <div
      className={`min-h-screen bg-[#F8FAFC] dark:bg-[#060913] text-slate-800 dark:text-slate-100 font-sans selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:bg-sky-500/30 dark:selection:text-sky-200 transition-colors duration-300 ${
        language === 'ar' ? 'font-arabic' : ''
      }`}
    >
      {currentView === 'admin' ? (
        <AdminPortal onBackToWebsite={handleReturnToWebsite} />
      ) : (
        <>
          <Navbar
            currentView={currentView}
            setCurrentView={setCurrentView}
            onNavigate={handleNavigate}
            onOpenQuote={() => {
              setQuotePrefill(null);
              setIsQuoteModalOpen(true);
            }}
          />

          <main>
            {currentView === 'website' && (
              <>
                <Hero onOpenQuote={() => setIsQuoteModalOpen(true)} />
                <GoogleReviewsSection />
                <Services onSelectService={handleOpenQuoteWithService} />
                <Estimator onRequestProposalWithScope={handleOpenQuoteWithScope} />
                <Portfolio />
                <TechStack />
                <WhyChooseUs />
                <Contact />
              </>
            )}

            {currentView === 'service-custom-dotnet-erp' && (
              <CustomDotNetErpPage
                onOpenQuote={() => {
                  setQuotePrefill({ serviceName: 'Custom .NET Web ERP' });
                  setIsQuoteModalOpen(true);
                }}
                onNavigateToEstimator={handleNavigateToEstimator}
              />
            )}

            {currentView === 'service-odoo-enterprise' && (
              <OdooEnterprisePage
                onOpenQuote={() => {
                  setQuotePrefill({ serviceName: 'Odoo Enterprise & Python Bridges' });
                  setIsQuoteModalOpen(true);
                }}
                onNavigateToEstimator={handleNavigateToEstimator}
              />
            )}

            {currentView === 'service-ai-and-cloud' && (
              <AiAndCloudPage
                onOpenQuote={() => {
                  setQuotePrefill({ serviceName: 'AI Integrations & 24/7 Cloud DevOps' });
                  setIsQuoteModalOpen(true);
                }}
                onNavigateToEstimator={handleNavigateToEstimator}
              />
            )}
          </main>

          <Footer onNavigate={handleNavigate} />

          <QuickQuoteModal
            isOpen={isQuoteModalOpen}
            onClose={() => setIsQuoteModalOpen(false)}
            prefillScope={quotePrefill}
          />
        </>
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

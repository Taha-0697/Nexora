import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import { Navbar, type AppView } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
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
import { CustomWebAppsPage } from './components/pages/CustomWebAppsPage';
import { CustomMobileAppsPage } from './components/pages/CustomMobileAppsPage';
import { AiAndAgentsPage } from './components/pages/AiAndAgentsPage';
import { CloudDevOpsPage } from './components/pages/CloudDevOpsPage';
import { ErpModernizationPage } from './components/pages/ErpModernizationPage';
import { CaseStudiesPage } from './components/pages/CaseStudiesPage';
import { TrustedByMarquee } from './components/sections/TrustedByMarquee';
import { ErrorBoundary } from './components/common/ErrorBoundary';

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
        path === '/case-studies' ||
        hash === '#case-studies'
      ) {
        setCurrentView('case-studies');
      } else if (
        path === '/services/custom-web-erp' ||
        path === '/services/custom-dotnet-erp' ||
        hash === '#services/custom-web-erp' ||
        hash === '#services/custom-dotnet-erp'
      ) {
        setCurrentView('service-custom-dotnet-erp');
      } else if (
        path === '/services/odoo-enterprise' ||
        hash === '#services/odoo-enterprise'
      ) {
        setCurrentView('service-odoo-enterprise');
      } else if (
        path === '/services/custom-web-apps' ||
        path === '/services/web-apps' ||
        hash === '#services/custom-web-apps' ||
        hash === '#services/web-apps'
      ) {
        setCurrentView('service-web-apps');
      } else if (
        path === '/services/mobile-apps' ||
        path === '/services/custom-mobile-apps' ||
        hash === '#services/mobile-apps' ||
        hash === '#services/custom-mobile-apps'
      ) {
        setCurrentView('service-mobile-apps');
      } else if (
        path === '/services/ai-integrations' ||
        path === '/services/ai-and-agents' ||
        path === '/services/ai-and-cloud' ||
        hash === '#services/ai-integrations' ||
        hash === '#services/ai-and-agents' ||
        hash === '#services/ai-and-cloud'
      ) {
        setCurrentView('service-ai-and-agents');
      } else if (
        path === '/services/cloud-devops' ||
        hash === '#services/cloud-devops'
      ) {
        setCurrentView('service-cloud-devops');
      } else if (
        path === '/services/erp-modernization' ||
        hash === '#services/erp-modernization'
      ) {
        setCurrentView('service-erp-modernization');
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

  const handleNavigate = useCallback((view: AppView, targetSection?: string) => {
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
    } else if (view === 'case-studies') {
      try {
        history.pushState(null, '', '/case-studies');
      } catch {
        window.location.hash = '#case-studies';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'service-custom-dotnet-erp') {
      try {
        history.pushState(null, '', '/services/custom-web-erp');
      } catch {
        window.location.hash = '#services/custom-web-erp';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'service-odoo-enterprise') {
      try {
        history.pushState(null, '', '/services/odoo-enterprise');
      } catch {
        window.location.hash = '#services/odoo-enterprise';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'service-web-apps') {
      try {
        history.pushState(null, '', '/services/custom-web-apps');
      } catch {
        window.location.hash = '#services/custom-web-apps';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'service-mobile-apps') {
      try {
        history.pushState(null, '', '/services/mobile-apps');
      } catch {
        window.location.hash = '#services/mobile-apps';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'service-ai-and-agents') {
      try {
        history.pushState(null, '', '/services/ai-integrations');
      } catch {
        window.location.hash = '#services/ai-integrations';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'service-cloud-devops') {
      try {
        history.pushState(null, '', '/services/cloud-devops');
      } catch {
        window.location.hash = '#services/cloud-devops';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'service-erp-modernization') {
      try {
        history.pushState(null, '', '/services/erp-modernization');
      } catch {
        window.location.hash = '#services/erp-modernization';
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
  }, []);

  const handleReturnToWebsite = useCallback(() => {
    handleNavigate('website');
  }, [handleNavigate]);

  const handleOpenQuoteWithScope = useCallback((scopeDetails: any) => {
    setQuotePrefill(scopeDetails);
    setIsQuoteModalOpen(true);
  }, []);

  const handleNavigateToEstimator = useCallback(() => {
    handleNavigate('website', 'estimator');
  }, [handleNavigate]);

  const handleOpenDemoModal = useCallback((project?: any) => {
    const projName = project
      ? (typeof project.title === 'object'
        ? (project.title[language] || project.title.en)
        : (project.title || project.titleEn || project.name))
      : 'Nexora Flow™ Enterprise ERP Suite';

    setQuotePrefill({
      isLiveDemo: true,
      productName: projName,
      category: 'Proprietary Suite',
      serviceName: 'Proprietary Suite'
    });
    setIsQuoteModalOpen(true);
  }, [language]);

  useEffect(() => {
    const handleDemoEvent = (e: any) => {
      handleOpenDemoModal(e.detail?.project);
    };
    window.addEventListener('nexora_book_demo', handleDemoEvent);
    return () => window.removeEventListener('nexora_book_demo', handleDemoEvent);
  }, [handleOpenDemoModal]);

  return (
    <div
      className={`min-h-screen bg-[#F8FAFC] dark:bg-[#060913] text-slate-800 dark:text-slate-100 font-sans selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:bg-sky-500/30 dark:selection:text-sky-200 transition-colors duration-300 ${
        language === 'ar' ? 'font-arabic' : ''
      }`}
    >
      {currentView === 'admin' ? (
        <ErrorBoundary fallbackTitle="Admin Command Center Error" fallbackMessage="An issue occurred within the Command Center module. You can return to the main site or retry.">
          <AdminPortal onBackToWebsite={handleReturnToWebsite} />
        </ErrorBoundary>
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
            onBookDemo={() => handleOpenDemoModal()}
          />

          <ErrorBoundary fallbackTitle="Page Content Error" fallbackMessage="An issue occurred rendering this view.">
            <main>
              {currentView === 'website' && (
                <>
                  <Hero
                    onOpenQuote={() => setIsQuoteModalOpen(true)}
                    onBookDemo={() => handleOpenDemoModal()}
                    onOpenConsultation={() => {
                      const el = document.getElementById('contact');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />
                  <TrustedByMarquee />
                  <GoogleReviewsSection />
                  <Estimator onRequestProposalWithScope={handleOpenQuoteWithScope} />
                  <ErrorBoundary fallbackTitle="Portfolio Section Error">
                    <Portfolio onBookDemo={handleOpenDemoModal} />
                  </ErrorBoundary>
                  <TechStack />
                  <WhyChooseUs />
                  <Contact />
                </>
              )}

            {currentView === 'case-studies' && (
              <CaseStudiesPage
                onOpenQuote={() => {
                  setQuotePrefill({ serviceName: 'Enterprise Case Studies Inquiry' });
                  setIsQuoteModalOpen(true);
                }}
                onNavigateToEstimator={handleNavigateToEstimator}
              />
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

            {currentView === 'service-web-apps' && (
              <CustomWebAppsPage
                onOpenQuote={() => {
                  setQuotePrefill({ serviceName: 'Custom Web Apps & REST APIs' });
                  setIsQuoteModalOpen(true);
                }}
                onNavigateToEstimator={handleNavigateToEstimator}
              />
            )}

            {currentView === 'service-mobile-apps' && (
              <CustomMobileAppsPage
                onOpenQuote={() => {
                  setQuotePrefill({ serviceName: 'Custom Mobile Apps (iOS, Android, Flutter)' });
                  setIsQuoteModalOpen(true);
                }}
                onNavigateToEstimator={handleNavigateToEstimator}
              />
            )}

            {currentView === 'service-ai-and-agents' && (
              <AiAndAgentsPage
                onOpenQuote={() => {
                  setQuotePrefill({ serviceName: 'AI Integrations & Agentic Automation' });
                  setIsQuoteModalOpen(true);
                }}
                onNavigateToEstimator={handleNavigateToEstimator}
              />
            )}

            {currentView === 'service-cloud-devops' && (
              <CloudDevOpsPage
                onOpenQuote={() => {
                  setQuotePrefill({ serviceName: '24/7 Server Management & Cloud DevOps' });
                  setIsQuoteModalOpen(true);
                }}
                onNavigateToEstimator={handleNavigateToEstimator}
              />
            )}

            {currentView === 'service-erp-modernization' && (
              <ErpModernizationPage
                onOpenQuote={() => {
                  setQuotePrefill({ serviceName: 'ERP Modernization & System Integration' });
                  setIsQuoteModalOpen(true);
                }}
                onNavigateToEstimator={handleNavigateToEstimator}
              />
            )}
            </main>
          </ErrorBoundary>

          <Footer onNavigate={handleNavigate} />

          <ErrorBoundary fallbackTitle="Modal Error">
            <QuickQuoteModal
              isOpen={isQuoteModalOpen}
              onClose={() => setIsQuoteModalOpen(false)}
              prefillScope={quotePrefill}
            />
          </ErrorBoundary>
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

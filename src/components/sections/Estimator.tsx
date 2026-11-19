import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Calculator,
  CheckSquare,
  Square,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Cpu,
  Globe2,
<<<<<<< HEAD
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  ServerCog
=======

  ChevronDown
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EstimatorProps {
  onRequestProposalWithScope: (scopeDetails: {
    services: string[];
    scale: string;
    support: string;
    estimatedBudget: string;
    estimatedTimeline: string;
    customStack?: string[];
  }) => void;
}

interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', flag: '🇵🇰' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'OMR', symbol: 'ر.ع', name: 'Omani Rial', flag: '🇴🇲' },
  { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal', flag: '🇶🇦' },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', flag: '🇰🇼' },
  { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar', flag: '🇧🇭' },
];

const COUNTRY_CURRENCY: Record<string, string> = {
  PK: 'PKR', SA: 'SAR', AE: 'AED', OM: 'OMR', QA: 'QAR',
  KW: 'KWD', BH: 'BHD', GB: 'GBP', US: 'USD', DE: 'EUR',
  FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', CA: 'USD',
  AU: 'USD', IN: 'USD'
};

const LOCALE_CURRENCY: Record<string, string> = {
  'ur': 'PKR', 'pk': 'PKR', 'ar-sa': 'SAR', 'ar-ae': 'AED',
  'ar-om': 'OMR', 'ar-qa': 'QAR', 'ar-kw': 'KWD', 'ar-bh': 'BHD',
  'en-gb': 'GBP', 'en-us': 'USD', 'de': 'EUR', 'fr': 'EUR'
};

const FALLBACK_RATES: Record<string, number> = {
  USD: 1, PKR: 278.5, SAR: 3.75, AED: 3.67, EUR: 0.92,
  GBP: 0.79, OMR: 0.385, QAR: 3.64, KWD: 0.307, BHD: 0.377,
};

export const Estimator: React.FC<EstimatorProps> = ({ onRequestProposalWithScope }) => {
  const { language, t } = useLanguage();

  // Geo-location Currency State
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [detectedCountry, setDetectedCountry] = useState<string>('');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(FALLBACK_RATES);

  // Selected Services
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'custom-erp',
    'custom-web'
  ]);

  // Project Scale
  const [projectScale, setProjectScale] = useState<'mvp' | 'growth' | 'enterprise'>('growth');

  // Support SLA
  const [supportTier, setSupportTier] = useState<'none' | 'standard' | 'mission-critical'>('mission-critical');

<<<<<<< HEAD
  // Primary Architecture Selector
  const PRIMARY_ARCHITECTURES = [
    {
      id: 'custom-erp',
      title: { en: 'Custom ERP (.NET Core)', ar: 'نظام ERP مخصص (.NET Core)' },
      tagline: { en: '.NET 9, Next.js & MSSQL (100% Owned IP)', ar: '.NET 9 و Next.js و MSSQL' },
      stack: [
        '.NET Core Web API',
        'Next.js / React',
        'MS SQL Server (MSSQL)',
        'Redis In-Memory Cache',
        'REST API Integrations',
        'Docker & Kubernetes (K8s)'
      ]
    },
    {
      id: 'odoo-enterprise',
      title: { en: 'Odoo Enterprise (Python/PostgreSQL)', ar: 'منظومة Odoo Enterprise (بايثون)' },
      tagline: { en: 'Custom Modules, FastAPI & PostgreSQL Sync', ar: 'وحدات مخصصة وجسور FastAPI ومزامنة PostgreSQL' },
      stack: [
        'Odoo Enterprise & Python Bridges',
        'Python 3.12 ORM / FastAPI',
        'PostgreSQL / SQL',
        'PostgreSQL Data Synchronization',
        'REST API Integrations',
        'XML-RPC & Webhooks'
      ]
    },
    {
      id: 'saas-portal',
      title: { en: 'SaaS Portal', ar: 'بوابة SaaS سحابية' },
      tagline: { en: 'Next.js 15, Node.js & Redis In-Memory Cache', ar: 'Next.js 15 و Node.js و Redis' },
      stack: [
        'Next.js / React',
        'Node.js / NestJS',
        'PostgreSQL / SQL',
        'Redis In-Memory Cache',
        'AWS Cloud Infrastructure',
        'REST API Integrations'
      ]
    },
    {
      id: 'mobile-app',
      title: { en: 'Mobile App', ar: 'تطبيقات الجوال' },
      tagline: { en: 'Native iOS Swift, Android Kotlin & Flutter', ar: 'iOS أصيل وأندرويد وفلاتر' },
      stack: [
        'Native iOS (Swift & SwiftUI)',
        'Native Android (Kotlin)',
        'Flutter Cross-Platform',
        '.NET Core Web API',
        'REST API Integrations'
      ]
    },
    {
      id: 'ai-integration',
      title: { en: 'AI Integration', ar: 'تكاملات الذكاء الاصطناعي' },
      tagline: { en: 'Python LLM Engines, Custom RAG & K8s', ar: 'محركات بايثون وذكاء اصطناعي' },
      stack: [
        'AI & LLM Integrations',
        'Python AI Engine & Bridges',
        'Next.js / React',
        'PostgreSQL / SQL',
        'Docker & Kubernetes (K8s)'
      ]
    }
  ];

  const [primaryArchitecture, setPrimaryArchitecture] = useState<string>('custom-erp');
  const [showAdvancedCustomization, setShowAdvancedCustomization] = useState<boolean>(false);

  // Client Custom Tech Stack Specifications
=======
  // Client Custom Tech Stack Specifications (Giving preference to customized architectures)
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
  const [selectedStackSpecs, setSelectedStackSpecs] = useState<string[]>([
    '.NET Core Web API',
    'Next.js / React',
    'MS SQL Server (MSSQL)',
<<<<<<< HEAD
    'Redis In-Memory Cache',
    'REST API Integrations'
  ]);

  const handleSelectArchitecture = (archId: string) => {
    setPrimaryArchitecture(archId);
    const matched = PRIMARY_ARCHITECTURES.find(a => a.id === archId);
    if (matched) {
      setSelectedStackSpecs(matched.stack);
    }
    if (archId === 'odoo-enterprise') {
      setSelectedServices(prev => {
        const withoutOldErp = prev.filter(s => s !== 'custom-erp');
        return withoutOldErp.includes('odoo-enterprise') ? withoutOldErp : ['odoo-enterprise', ...withoutOldErp];
      });
    } else if (archId === 'custom-erp') {
      setSelectedServices(prev => {
        const withoutOdoo = prev.filter(s => s !== 'odoo-enterprise');
        return withoutOdoo.includes('custom-erp') ? withoutOdoo : ['custom-erp', ...withoutOdoo];
      });
    } else if (archId === 'saas-portal') {
      setSelectedServices(prev => prev.includes('custom-web') ? prev : ['custom-web', ...prev]);
    } else if (archId === 'mobile-app') {
      setSelectedServices(prev => prev.includes('mobile-app') ? prev : ['mobile-app', ...prev]);
    } else if (archId === 'ai-integration') {
      setSelectedServices(prev => prev.includes('ai-solution') ? prev : ['ai-solution', ...prev]);
    }
  };

=======
    'REST API Integrations'
  ]);

>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
  // 1. Auto-detect currency by browser locale and IP
  useEffect(() => {
    try {
      const browserLang = (navigator.language || 'en-US').toLowerCase();
      for (const [key, curr] of Object.entries(LOCALE_CURRENCY)) {
        if (browserLang.includes(key)) {
          setSelectedCurrency(curr);
          break;
        }
      }
    } catch {
      // Default to USD
    }

    const detectLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3500) });
        if (res.ok) {
          const data = await res.json();
          const country = data.country_code as string;
          if (country) {
            setDetectedCountry(country);
            const matched = COUNTRY_CURRENCY[country];
            if (matched) setSelectedCurrency(matched);
          }
        }
      } catch {
        // Fallback silently
      }
    };
    detectLocation();
  }, []);

  // 2. Fetch live exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD', {
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.rates) setExchangeRates(data.rates);
        }
      } catch {
        // Use fallbacks
      }
    };
    fetchRates();
  }, []);

  const techStackOptions = [
    { id: 'dotnet-api', label: '.NET Core Web API', category: 'Backend' },
<<<<<<< HEAD
    { id: 'odoo-python', label: 'Odoo Enterprise & Python Bridges', category: 'ERP' },
=======
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
    { id: 'react-next', label: 'Next.js / React', category: 'Frontend' },
    { id: 'nodejs', label: 'Node.js / NestJS', category: 'Backend' },
    { id: 'mssql', label: 'MS SQL Server (MSSQL)', category: 'Database' },
    { id: 'sql-db', label: 'PostgreSQL / SQL', category: 'Database' },
<<<<<<< HEAD
    { id: 'pg-mssql-sync', label: 'PostgreSQL Data Synchronization', category: 'Database' },
=======
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
    { id: 'rest-apis', label: 'REST API Integrations', category: 'Backend' },
    { id: 'swift-ios', label: 'Native iOS (Swift & SwiftUI)', category: 'Mobile' },
    { id: 'kotlin-android', label: 'Native Android (Kotlin)', category: 'Mobile' },
    { id: 'flutter', label: 'Flutter Cross-Platform', category: 'Mobile' },
    { id: 'ai-integrations', label: 'AI & LLM Integrations', category: 'AI' },
<<<<<<< HEAD
    { id: 'python-ai', label: 'Python AI Engine & Bridges', category: 'AI' },
=======
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
    { id: 'redis', label: 'Redis In-Memory Cache', category: 'Database' },
    { id: 'aws', label: 'AWS Cloud Infrastructure', category: 'Cloud' },
    { id: 'azure', label: 'Microsoft Azure Cloud', category: 'Cloud' },
    { id: 'k8s', label: 'Docker & Kubernetes (K8s)', category: 'Cloud' },
    { id: 'bespoke-erp', label: 'Bespoke ERP Modules', category: 'ERP' },
  ];

  const servicesOptions = [
    {
      id: 'custom-erp',
      title: {
        en: 'Custom Web ERP (.NET Core, Next.js & MSSQL Database)',
        ar: 'نظام ERP سحابي مخصص بالكامل (.NET Core و Next.js و MSSQL)'
      },
<<<<<<< HEAD
      subtitle: {
        en: '100% bespoke architecture, zero per-seat licensing, full IP ownership',
        ar: 'بنية برمجية مخصصة 100%، بدون رسوم تراخيص، ملكية فكرية كاملة'
      },
=======
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
      baseCost: 9500,
      baseWeeks: 7,
    },
    {
<<<<<<< HEAD
      id: 'odoo-enterprise',
      title: {
        en: 'Odoo Enterprise Customization & Python Bridges',
        ar: 'تخصيص وتطوير Odoo Enterprise وجسور بايثون البرمجية'
      },
      subtitle: {
        en: 'Bespoke Odoo modules, FastAPI middleware & PostgreSQL/MSSQL sync',
        ar: 'وحدات مخصصة، وسيط FastAPI، ومزامنة قواعد بيانات PostgreSQL/MSSQL'
      },
      baseCost: 8500,
      baseWeeks: 6,
    },
    {
=======
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
      id: 'custom-web',
      title: {
        en: 'Custom Enterprise Web Portal & REST API Ecosystem',
        ar: 'بوابة إلكترونية مؤسسية مخصصة ومنظومة REST API متكاملة'
      },
<<<<<<< HEAD
      subtitle: {
        en: 'High-speed Next.js portals, secure user authentication & microservices',
        ar: 'بوابات Next.js فائقة السرعة مع مصادقة أمنية متقدمة وخدمات مصغرة'
      },
=======
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
      baseCost: 6500,
      baseWeeks: 5,
    },
    {
      id: 'mobile-app',
      title: {
        en: 'Custom Mobile App (iOS Swift, Android Kotlin or Flutter)',
        ar: 'تطبيق جوال مخصص (iOS Swift أو Android Kotlin أو Flutter)'
      },
<<<<<<< HEAD
      subtitle: {
        en: 'Native 60FPS mobile experiences with biometric security & offline sync',
        ar: 'تطبيقات جوال أصيلة بسرعة 60 إطاراً في الثانية مع حماية بيومترية'
      },
=======
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
      baseCost: 7500,
      baseWeeks: 6,
    },
    {
      id: 'ai-solution',
      title: {
        en: 'Enterprise AI Integrations, Custom RAG & Autonomous Agents',
        ar: 'تكاملات الذكاء الاصطناعي (AI) والبحث الدلالي RAG والوكلاء الأذكياء'
      },
<<<<<<< HEAD
      subtitle: {
        en: 'Private domain LLMs, semantic vector search & business automation',
        ar: 'نماذج لغوية خاصة، بحث دلالي موجه، وأتمتة ذكية لمهام العمل'
      },
=======
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
      baseCost: 5500,
      baseWeeks: 4,
    },
    {
      id: 'cloud-devops',
      title: {
        en: '24/7 Cloud Architecture & DevOps Operations (AWS / K8s)',
        ar: 'هندسة السيرفرات السحابية وإدارة DevOps المتقدمة 24/7'
      },
<<<<<<< HEAD
      subtitle: {
        en: '99.99% SLA uptime, automated CI/CD pipelines & container orchestration',
        ar: 'استقرار تشغيلي 99.99%، خطوط نشر مؤتمتة وإدارة حاويات سحابية'
      },
=======
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
      baseCost: 4000,
      baseWeeks: 3,
    },
    {
      id: 'erp-modernization',
      title: {
        en: 'Custom ERP Modernization & Enterprise System Integration',
        ar: 'تحديث وتطوير أنظمة الـ ERP والتكاملات البرمجية المؤسسية'
      },
<<<<<<< HEAD
      subtitle: {
        en: 'Legacy DB migration, CDC data streaming & zero-downtime upgrades',
        ar: 'ترحيل قواعد البيانات القديمة ومزامنة البيانات اللحظية بدون انقطاع'
      },
=======
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
      baseCost: 5000,
      baseWeeks: 4,
    },
  ];

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(s => s !== id));
      }
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const toggleStackSpec = (label: string) => {
    if (selectedStackSpecs.includes(label)) {
      setSelectedStackSpecs(selectedStackSpecs.filter(s => s !== label));
    } else {
      setSelectedStackSpecs([...selectedStackSpecs, label]);
    }
  };

  // Calculations in USD
  const baseEstimate = useMemo(() => {
    let baseSum = 0;
    let weeksSum = 0;

    selectedServices.forEach(svcId => {
      const match = servicesOptions.find(s => s.id === svcId);
      if (match) {
        baseSum += match.baseCost;
        weeksSum += match.baseWeeks;
      }
    });

    let multiplier = 1.0;
    if (projectScale === 'mvp') multiplier = 0.8;
    if (projectScale === 'growth') multiplier = 1.3;
    if (projectScale === 'enterprise') multiplier = 2.0;

    let supportCost = 0;
    if (supportTier === 'standard') supportCost = 800;
    if (supportTier === 'mission-critical') supportCost = 2200;

    const totalBase = Math.round((baseSum * multiplier) / 500) * 500;
    const totalMax = Math.round((totalBase * 1.25) / 500) * 500;

    const finalWeeks = Math.max(3, Math.round(weeksSum * (multiplier * 0.75)));
    const finalWeeksMax = Math.round(finalWeeks * 1.3);

    return {
      minBudgetUSD: totalBase,
      maxBudgetUSD: totalMax,
      supportCostUSD: supportCost,
      weeksMin: finalWeeks,
      weeksMax: finalWeeksMax,
    };
  }, [selectedServices, projectScale, supportTier]);

  // Convert to selected currency
  const currencyRate = exchangeRates[selectedCurrency] || 1;
  const currentCurrencyObj = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];

  const convertedMin = Math.round(baseEstimate.minBudgetUSD * currencyRate);
  const convertedMax = Math.round(baseEstimate.maxBudgetUSD * currencyRate);
  const convertedSupport = Math.round(baseEstimate.supportCostUSD * currencyRate);

  const handleTriggerProposal = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const serviceTitles = selectedServices.map(id => {
      const s = servicesOptions.find(opt => opt.id === id);
      return s ? s.title[language] : id;
    });

    const budgetString = `${currentCurrencyObj.symbol}${convertedMin.toLocaleString()} - ${currentCurrencyObj.symbol}${convertedMax.toLocaleString()} ${selectedCurrency}`;

    onRequestProposalWithScope({
      services: serviceTitles,
      scale: projectScale,
      support: supportTier,
      estimatedBudget: budgetString,
      estimatedTimeline: `${baseEstimate.weeksMin} - ${baseEstimate.weeksMax} ${language === 'ar' ? 'أسابيع' : 'Weeks'}`,
      customStack: selectedStackSpecs,
    });
  };

  return (
<<<<<<< HEAD
    <section id="estimator" className="py-20 relative overflow-hidden bg-slate-50 dark:bg-[#060913] transition-colors">
=======
    <section id="estimator" className="py-20 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-sky-400 mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t('estimator.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('estimator.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            {language === 'ar'
              ? 'احسب تكلفة مشروعك المخصص بالكامل وفق عملتك المحلية مع حرية تعديل العملة والمواصفات الهندسية.'
              : 'Estimate your bespoke enterprise software investment in your local currency with custom specifications.'}
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Controls: Left 7 cols */}
          <div className="lg:col-span-7 space-y-7">

            {/* Step 1: Select Services */}
<<<<<<< HEAD
            <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0E1526] shadow-xs">
=======
            <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black">1</span>
                <span>{t('estimator.stepServices')}</span>
              </h3>

              <div className="space-y-2.5">
                {servicesOptions.map((svc) => {
                  const isChecked = selectedServices.includes(svc.id);
                  return (
                    <div
                      key={svc.id}
                      onClick={() => toggleService(svc.id)}
<<<<<<< HEAD
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between min-w-0 ${isChecked
=======
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${isChecked
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
                          ? 'bg-indigo-50/70 dark:bg-slate-800 border-indigo-500/70 dark:border-indigo-500/60 shadow-2xs'
                          : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                    >
<<<<<<< HEAD
                      <div className="flex items-start gap-3 min-w-0">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-sky-400 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400 dark:text-slate-600 shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0">
                          <span className={`text-sm block break-words ${isChecked ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-700 dark:text-slate-300 font-medium'}`}>
                            {svc.title[language]}
                          </span>
                          {svc.subtitle && (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug break-words">
                              {svc.subtitle[language]}
                            </span>
                          )}
                        </div>
=======
                      <div className="flex items-center gap-3">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-sky-400 shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400 dark:text-slate-600 shrink-0" />
                        )}
                        <span className={`text-sm ${isChecked ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-700 dark:text-slate-300 font-medium'}`}>
                          {svc.title[language]}
                        </span>
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Project Scale & Complexity */}
<<<<<<< HEAD
            <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0E1526] shadow-xs">
=======
            <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black">2</span>
                <span>{t('estimator.stepScale')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'mvp',
                    title: { en: 'MVP / Lean', ar: 'نسخة أولية MVP' },
                    desc: { en: 'Core feature validation, rapid release', ar: 'التحقق من الفكرة وإطلاق سريع' }
                  },
                  {
                    id: 'growth',
                    title: { en: 'Growth Scale', ar: 'توسع ونمو مؤسسي' },
                    desc: { en: 'Full custom modules, REST APIs & MSSQL', ar: 'وحدات مخصصة وربط APIs وقواعد MSSQL' }
                  },
                  {
                    id: 'enterprise',
                    title: { en: 'Enterprise Grade', ar: 'مؤسسات كبرى ودولية' },
<<<<<<< HEAD
                    desc: { en: 'Multi-region, strict RBAC, 99.99% SLA', ar: 'تعدد الفروع والمناطق وامتثال أمني' }
=======
                    desc: { en: 'Multi-region, strict RBAC, 99.999% SLA', ar: 'تعدد الفروع والمناطق وامتثال أمني' }
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
                  },
                ].map((scale) => (
                  <div
                    key={scale.id}
                    onClick={() => setProjectScale(scale.id as any)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${projectScale === scale.id
                        ? 'bg-indigo-50/70 dark:bg-slate-800 border-indigo-500/70 dark:border-indigo-500/70 shadow-xs'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                  >
                    <div className={`text-sm font-bold mb-1 ${projectScale === scale.id ? 'text-indigo-700 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
                      {scale.title[language]}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {scale.desc[language]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Cloud & SLA Support Tier */}
<<<<<<< HEAD
            <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0E1526] shadow-xs">
=======
            <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black">3</span>
                <span>{t('estimator.stepSLA')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'none',
                    title: { en: 'Handover Only', ar: 'تسليم فقط' },
                    desc: { en: '60-day warranty, full code & DB handover', ar: 'ضمان 60 يوماً وتسليم الأكواد' }
                  },
                  {
                    id: 'standard',
                    title: { en: 'Standard 8x5 SLA', ar: 'دعم قياسي 8x5' },
                    desc: { en: 'Weekly backups, patch updates, SLA response', ar: 'نسخ احتياطي أسبوعي وتحديثات أمنية' }
                  },
                  {
                    id: 'mission-critical',
                    title: { en: '24/7 High-Availability', ar: 'دعم مستمر 24/7' },
                    desc: { en: 'Dedicated SRE monitoring, <15m response', ar: 'مراقبة فورية 24 ساعة واستجابة <15 دقيقة' }
                  },
                ].map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => setSupportTier(tier.id as any)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${supportTier === tier.id
                        ? 'bg-indigo-50/70 dark:bg-slate-800 border-indigo-500/70 dark:border-indigo-500/70 shadow-xs'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                  >
                    <div className={`text-sm font-bold mb-1 ${supportTier === tier.id ? 'text-indigo-700 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
                      {tier.title[language]}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {tier.desc[language]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

<<<<<<< HEAD
            {/* Step 4: Primary Architecture Selector & Stack (Phase 3) */}
            <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0E1526] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black">4</span>
                  <span>{language === 'ar' ? 'البنية المعمارية الأساسية للحل' : 'Primary Solution Architecture'}</span>
                </h3>
                <span className="text-[11px] font-mono text-indigo-600 dark:text-sky-400 font-bold">
                  {selectedStackSpecs.length} {language === 'ar' ? 'تقنيات مهيأة' : 'Tech Components Configured'}
=======
            {/* Step 4: Client Stack Specifications */}
            <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black">4</span>
                  <span>{language === 'ar' ? 'تخصيص التقنيات والمواصفات البرمجية' : 'Custom Tech Stack Specifications'}</span>
                </h3>
                <span className="text-[11px] font-mono text-indigo-600 dark:text-sky-400 font-bold">
                  {selectedStackSpecs.length} {language === 'ar' ? 'محددة' : 'Selected'}
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                {language === 'ar'
<<<<<<< HEAD
                  ? 'اختر البنية المعمارية الأساسية لتهيئة منظومة التقنيات المناسبة تلقائياً، مع إمكانية التخصيص الدقيق للخبراء التقنيين:'
                  : 'Select your core architectural pattern to auto-configure optimal tech components, with advanced custom tuning:'}
              </p>

              {/* 5 Primary Architecture Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-4">
                {PRIMARY_ARCHITECTURES.map((arch) => {
                  const isSelected = primaryArchitecture === arch.id;
                  return (
                    <div
                      key={arch.id}
                      onClick={() => handleSelectArchitecture(arch.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between min-w-0 ${
                        isSelected
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 shadow-sm ring-1 ring-indigo-500/50'
                          : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-1.5 min-w-0 mb-1.5">
                          <span className={`text-xs font-bold leading-snug break-words min-w-0 ${isSelected ? 'text-indigo-600 dark:text-sky-400' : 'text-slate-900 dark:text-white'}`}>
                            {arch.title[language]}
                          </span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-sky-400 animate-pulse shrink-0 mt-0.5" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed break-words">
                          {arch.tagline[language]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Auto-selected Stack Summary Badges */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#060913]/70 border border-slate-200 dark:border-[#1E293B] mb-3">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <ServerCog className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400 shrink-0" />
                    <span>{language === 'ar' ? 'المنظومة التقنية المهيأة تلقائياً' : 'Auto-Selected Architecture Stack'}</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold whitespace-nowrap">
                    {language === 'ar' ? '✓ تم التحسين' : '✓ Optimized'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStackSpecs.map((spec) => (
                    <span
                      key={spec}
                      className="px-2.5 py-1 rounded-md bg-white dark:bg-[#131C31] border border-slate-200 dark:border-[#1E293B] text-[11px] font-mono font-medium text-slate-700 dark:text-slate-200 break-words"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Advanced Customization Collapsible Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvancedCustomization(!showAdvancedCustomization)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#131C31] hover:bg-slate-50 dark:hover:bg-[#1A2642] border border-slate-200 dark:border-[#1E293B] text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
                    <span>
                      {language === 'ar'
                        ? 'تخصيص متقدم للأطر وقواعد البيانات (للمهندسين والتقنيين)'
                        : 'Advanced Customization (For Technical Buyers)'}
                    </span>
                  </span>
                  {showAdvancedCustomization ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {showAdvancedCustomization && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-[#060913]/80 border border-slate-200 dark:border-[#1E293B] space-y-3">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === 'ar'
                        ? 'انقر لتفعيل أو إلغاء أي مكون تقني في البنية التحتية لمشروعك:'
                        : 'Toggle specific backend microservices, enterprise databases, or mobile toolchains:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {techStackOptions.map((stack) => {
                        const isSelected = selectedStackSpecs.includes(stack.label);
                        return (
                          <button
                            type="button"
                            key={stack.id}
                            onClick={() => toggleStackSpec(stack.label)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-2xs font-bold ring-1 ring-indigo-500'
                                : 'bg-white dark:bg-[#0E1526] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#131C31] border border-slate-200 dark:border-[#1E293B]'
                            }`}
                          >
                            <Cpu className="w-3 h-3" />
                            <span>{stack.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
=======
                  ? 'اختر أطر العمل وقواعد البيانات لتخصيص البنية المعمارية لمشروعك:'
                  : 'Specify your preferred frameworks, databases, and APIs for our bespoke architecture:'}
              </p>

              <div className="flex flex-wrap gap-2">
                {techStackOptions.map((stack) => {
                  const isSelected = selectedStackSpecs.includes(stack.label);
                  return (
                    <button
                      type="button"
                      key={stack.id}
                      onClick={() => toggleStackSpec(stack.label)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${isSelected
                          ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/60'
                        }`}
                    >
                      <Cpu className="w-3 h-3" />
                      <span>{stack.label}</span>
                    </button>
                  );
                })}
              </div>
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
            </div>

          </div>

          {/* Results Summary Card: Right 5 cols */}
          <div className="lg:col-span-5 sticky top-28">
<<<<<<< HEAD
            <div className="glass-panel p-7 sm:p-8 rounded-3xl border border-indigo-200 dark:border-indigo-500/40 shadow-xl relative overflow-hidden bg-white dark:bg-[#0E1526]">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Geo-Location Currency Bar */}
              <div className="mb-6 p-3 rounded-2xl bg-slate-50 dark:bg-[#131C31] border border-slate-200 dark:border-[#1E293B] flex items-center justify-between gap-3">
=======
            <div className="glass-panel p-7 sm:p-8 rounded-3xl border border-indigo-200 dark:border-indigo-500/40 shadow-xl relative overflow-hidden bg-white dark:bg-slate-900">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Geo-Location Currency Bar */}
              <div className="mb-6 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-indigo-600 dark:text-sky-400 shrink-0" />
                  <div className="text-xs">
                    <span className="text-slate-400 block text-[10px] font-mono">
                      {detectedCountry ? `Geo: ${detectedCountry}` : 'Selected Currency'}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {currentCurrencyObj.flag} {currentCurrencyObj.name}
                    </span>
                  </div>
                </div>

                {/* Change Currency Dropdown */}
                <div className="relative">
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
<<<<<<< HEAD
                    className="pl-2.5 pr-7 py-1.5 rounded-xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] text-xs font-mono font-bold text-indigo-600 dark:text-sky-300 focus:outline-none cursor-pointer appearance-none"
=======
                    className="pl-2.5 pr-7 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-indigo-600 dark:text-sky-300 focus:outline-none cursor-pointer appearance-none"
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2 text-indigo-600 dark:text-sky-400 text-xs font-mono font-semibold uppercase tracking-wider mb-6">
                <Sparkles className="w-4 h-4" />
                <span>{language === 'ar' ? 'التقدير الهندسي المباشر' : 'Live Engineering Scope Output'}</span>
              </div>

              {/* Estimated Investment Range in User Currency */}
              <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  {t('estimator.estimatedBudget')} ({selectedCurrency})
                </span>
<<<<<<< HEAD
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-emerald-600 dark:text-emerald-400 flex items-baseline gap-1.5">
=======
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1.5 text-gradient-cyan">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
                  <span>{currentCurrencyObj.symbol}{convertedMin.toLocaleString()}</span>
                  <span className="text-slate-400 text-2xl font-light">-</span>
                  <span>{currentCurrencyObj.symbol}{convertedMax.toLocaleString()}</span>
                </div>
                {convertedSupport > 0 && (
                  <p className="text-xs text-indigo-600 dark:text-sky-300 mt-1.5 flex items-center gap-1 font-mono font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>+{currentCurrencyObj.symbol}{convertedSupport.toLocaleString()}/mo ({supportTier === 'mission-critical' ? '24/7 Dedicated SRE' : 'Standard SLA'})</span>
                  </p>
                )}
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  Quote auto-adapted for {selectedCurrency} (Exchange Rate 1 USD ≈ {currencyRate.toFixed(2)} {selectedCurrency})
                </span>
              </div>

              {/* Estimated Delivery Timeline */}
              <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  {t('estimator.estimatedTimeline')}
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Clock className="w-6 h-6 text-indigo-600 dark:text-sky-400" />
                  <span>{baseEstimate.weeksMin} - {baseEstimate.weeksMax} {language === 'ar' ? 'أسابيع عمل' : 'Weeks Sprint'}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {language === 'ar' ? 'مع تسليمات تدريجية كل أسبوعين (Agile Sprints)' : 'Includes bi-weekly milestone demo releases'}
                </p>
              </div>

              {/* Included Services Summary */}
              <div className="mb-4 space-y-2">
<<<<<<< HEAD
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-heading">
=======
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
                  {language === 'ar' ? 'الخدمات المضمنة في التقدير:' : 'Included Scope Services:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedServices.map(id => {
                    const svc = servicesOptions.find(o => o.id === id);
                    return (
<<<<<<< HEAD
                      <span key={id} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#131C31] border border-slate-200 dark:border-[#1E293B] text-[11px] font-medium text-slate-700 dark:text-slate-200 break-words">
=======
                      <span key={id} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-200">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
                        {svc?.title[language]}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Selected Tech Stack Summary */}
              {selectedStackSpecs.length > 0 && (
                <div className="mb-7 space-y-2">
<<<<<<< HEAD
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-heading">
=======
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
                    {language === 'ar' ? 'المواصفات التقنية المحددة:' : 'Specified Tech Stack:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStackSpecs.map(spec => (
<<<<<<< HEAD
                      <span key={spec} className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-[#131C31] border border-indigo-200 dark:border-[#1E293B] text-[10px] font-mono text-indigo-700 dark:text-sky-300 font-semibold break-words">
=======
                      <span key={spec} className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-[10px] font-mono text-indigo-700 dark:text-sky-300 font-semibold">
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Lock in & Submit */}
              <button
                onClick={handleTriggerProposal}
<<<<<<< HEAD
                className="w-full py-4 px-6 rounded-xl btn-primary-cta text-white font-extrabold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'ar' ? 'طلب عرض فني وهندسي رسمي للمشروع' : 'Request Formal Engineering Proposal'}</span>
=======
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-sm tracking-wide shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('estimator.submitQuote')}</span>
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 mt-3">
                {language === 'ar' ? '🔒 سرية تامة وتوقيع اتفاقية عدم إفصاح (NDA) عند الطلب' : '🔒 Strict Confidentiality & Mutual NDA Guarantee'}
              </p>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

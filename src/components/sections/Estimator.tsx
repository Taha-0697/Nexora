import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Calculator, 
  CheckSquare, 
  Square, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  Cpu
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

export const Estimator: React.FC<EstimatorProps> = ({ onRequestProposalWithScope }) => {
  const { language, t } = useLanguage();

  // Selected Services
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'odoo-erp',
    'cloud-devops'
  ]);

  // Project Scale
  const [projectScale, setProjectScale] = useState<'mvp' | 'growth' | 'enterprise'>('growth');

  // Support SLA
  const [supportTier, setSupportTier] = useState<'none' | 'standard' | 'mission-critical'>('mission-critical');

  // Client Custom Tech Stack Specifications
  const [selectedStackSpecs, setSelectedStackSpecs] = useState<string[]>([
    'Python / FastAPI',
    'PostgreSQL',
    'AWS Cloud',
    'Docker & K8s'
  ]);

  const techStackOptions = [
    { id: 'react-next', label: 'React / Next.js', category: 'Frontend' },
    { id: 'vue', label: 'Vue.js / Nuxt', category: 'Frontend' },
    { id: 'flutter', label: 'Flutter (iOS & Android)', category: 'Mobile' },
    { id: 'swift-ios', label: 'Native iOS (Swift)', category: 'Mobile' },
    { id: 'kotlin-android', label: 'Native Android (Kotlin)', category: 'Mobile' },
    { id: 'python-fastapi', label: 'Python / FastAPI', category: 'Backend' },
    { id: 'django', label: 'Python Django', category: 'Backend' },
    { id: 'nodejs', label: 'Node.js / NestJS', category: 'Backend' },
    { id: 'golang', label: 'Go (Golang)', category: 'Backend' },
    { id: 'dotnet', label: '.NET Core', category: 'Backend' },
    { id: 'postgres', label: 'PostgreSQL', category: 'Database' },
    { id: 'mysql', label: 'MySQL / MariaDB', category: 'Database' },
    { id: 'redis', label: 'Redis In-Memory', category: 'Database' },
    { id: 'odoo-core', label: 'Odoo 17 Enterprise', category: 'ERP' },
    { id: 'custom-erp', label: 'Custom Python ERP Engine', category: 'ERP' },
    { id: 'aws', label: 'AWS Cloud', category: 'Cloud' },
    { id: 'azure', label: 'Microsoft Azure', category: 'Cloud' },
    { id: 'k8s', label: 'Docker & K8s', category: 'Cloud' },
  ];

  const servicesOptions = [
    {
      id: 'odoo-erp',
      title: { en: 'Custom ERP & Odoo 17 Enterprise System', ar: 'نظام ERP مخصص / تطبيق وتخصيص أودو 17' },
      baseCost: 8000,
      baseWeeks: 6,
    },
    {
      id: 'custom-web',
      title: { en: 'Custom Enterprise Web Portal & B2B Dashboard', ar: 'بوابة إلكترونية مخصصة ولوحة تحكم B2B للمؤسسات' },
      baseCost: 6500,
      baseWeeks: 5,
    },
    {
      id: 'mobile-app',
      title: { en: 'Custom Mobile App (Flutter / Native iOS & Android)', ar: 'تطبيق جوال مخصص (Flutter / أصلي iOS و Android)' },
      baseCost: 7500,
      baseWeeks: 6,
    },
    {
      id: 'cloud-devops',
      title: { en: '24/7 Server Operations & Cloud DevOps (AWS/K8s)', ar: 'إدارة السيرفرات والبنى السحابية 24/7 (AWS/K8s)' },
      baseCost: 4000,
      baseWeeks: 3,
    },
    {
      id: 'wordpress',
      title: { en: 'High-Performance Headless Portal / E-Commerce', ar: 'بوابة رقمية فائقة السرعة ومتجر إلكتروني متكامل' },
      baseCost: 3000,
      baseWeeks: 2,
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

  // Calculations
  const estimate = useMemo(() => {
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
      minBudget: totalBase,
      maxBudget: totalMax,
      supportCost,
      weeksMin: finalWeeks,
      weeksMax: finalWeeksMax,
    };
  }, [selectedServices, projectScale, supportTier]);

  const handleTriggerProposal = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    const serviceTitles = selectedServices.map(id => {
      const s = servicesOptions.find(opt => opt.id === id);
      return s ? s.title[language] : id;
    });

    onRequestProposalWithScope({
      services: serviceTitles,
      scale: projectScale,
      support: supportTier,
      estimatedBudget: `$${estimate.minBudget.toLocaleString()} - $${estimate.maxBudget.toLocaleString()}`,
      estimatedTimeline: `${estimate.weeksMin} - ${estimate.weeksMax} ${language === 'ar' ? 'أسابيع' : 'Weeks'}`,
      customStack: selectedStackSpecs,
    });
  };

  return (
    <section id="estimator" className="py-24 relative overflow-hidden bg-slate-50 dark:bg-dark-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-sky-400 mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t('estimator.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('estimator.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            {t('estimator.sub')}
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls: Left 7 cols */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Select Services */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-dark-900/60 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 dark:bg-sky-500 text-white dark:text-dark-950 flex items-center justify-center text-xs font-black">1</span>
                <span>{t('estimator.stepServices')}</span>
              </h3>

              <div className="space-y-3">
                {servicesOptions.map((svc) => {
                  const isChecked = selectedServices.includes(svc.id);
                  return (
                    <div
                      key={svc.id}
                      onClick={() => toggleService(svc.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-indigo-50/70 dark:bg-sky-950/40 border-indigo-500/70 dark:border-sky-500/60 shadow-xs'
                          : 'bg-white dark:bg-dark-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-sky-400 shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400 dark:text-slate-600 shrink-0" />
                        )}
                        <span className={`text-sm ${isChecked ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-700 dark:text-slate-300 font-medium'}`}>
                          {svc.title[language]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Project Scale & Complexity */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-dark-900/60 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 dark:bg-sky-500 text-white dark:text-dark-950 flex items-center justify-center text-xs font-black">2</span>
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
                    desc: { en: 'High availability, full modules, API integrations', ar: 'توفر عالٍ، وحدات متكاملة وربط APIs' }
                  },
                  {
                    id: 'enterprise',
                    title: { en: 'Enterprise Grade', ar: 'مؤسسات كبرى ودولية' },
                    desc: { en: 'Multi-region, strict compliance, 99.999% SLA', ar: 'تعدد الفروع والمناطق وامتثال أمني' }
                  },
                ].map((scale) => (
                  <div
                    key={scale.id}
                    onClick={() => setProjectScale(scale.id as any)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      projectScale === scale.id
                        ? 'bg-indigo-50/70 dark:bg-sky-950/50 border-indigo-500/70 dark:border-sky-500/70 shadow-sm'
                        : 'bg-white dark:bg-dark-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
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
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-dark-900/60 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 dark:bg-sky-500 text-white dark:text-dark-950 flex items-center justify-center text-xs font-black">3</span>
                <span>{t('estimator.stepSLA')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'none',
                    title: { en: 'Handover Only', ar: 'تسليم فقط' },
                    desc: { en: '30-day warranty, full source handover', ar: 'ضمان 30 يوماً وتسليم الأكواد' }
                  },
                  {
                    id: 'standard',
                    title: { en: 'Standard 8x5 SLA', ar: 'دعم قياسي 8x5' },
                    desc: { en: 'Weekly backups, patch updates, SLA response', ar: 'نسخ احتياطي أسبوعي وتحديثات أمنية' }
                  },
                  {
                    id: 'mission-critical',
                    title: { en: '24/7 High-Availability', ar: 'دعم مستمر 24/7' },
                    desc: { en: 'Round-the-clock SRE monitoring, <15m SLA', ar: 'مراقبة فورية 24 ساعة واستجابة <15 دقيقة' }
                  },
                ].map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => setSupportTier(tier.id as any)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      supportTier === tier.id
                        ? 'bg-indigo-50/70 dark:bg-sky-950/50 border-indigo-500/70 dark:border-sky-500/70 shadow-sm'
                        : 'bg-white dark:bg-dark-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
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

            {/* Step 4: Client Stack Specifications (New Feature) */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-dark-900/60 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 dark:bg-sky-500 text-white dark:text-dark-950 flex items-center justify-center text-xs font-black">4</span>
                  <span>{language === 'ar' ? 'تخصيص التقنيات ومواصفات البناء (Tech Stack)' : 'Client Tech Stack Specifications'}</span>
                </h3>
                <span className="text-[11px] font-mono text-indigo-600 dark:text-sky-400 font-semibold">
                  {selectedStackSpecs.length} {language === 'ar' ? 'محددة' : 'Selected'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                {language === 'ar' 
                  ? 'اختر أطر العمل وقواعد البيانات والبنى السحابية التي ترغب في تطبيقها في مشروعك:'
                  : 'Specify the frameworks, databases, and cloud infrastructure you want our engineers to build with:'}
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
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-700 border border-slate-200 dark:border-slate-700/60'
                      }`}
                    >
                      <Cpu className="w-3 h-3" />
                      <span>{stack.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Results Summary Card: Right 5 cols */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="glass-panel p-8 rounded-3xl border border-indigo-200 dark:border-indigo-500/40 shadow-xl dark:shadow-2xl relative overflow-hidden bg-white dark:bg-dark-900/90">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/10 dark:bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-2 text-indigo-600 dark:text-sky-400 text-xs font-mono font-semibold uppercase tracking-wider mb-6">
                <Sparkles className="w-4 h-4" />
                <span>{language === 'ar' ? 'التقدير الهندسي المباشر' : 'Live Engineering Scope Output'}</span>
              </div>

              {/* Estimated Investment Range */}
              <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  {t('estimator.estimatedBudget')}
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1 text-gradient-cyan">
                  <span>${estimate.minBudget.toLocaleString()}</span>
                  <span className="text-slate-400 text-2xl font-light">-</span>
                  <span>${estimate.maxBudget.toLocaleString()}</span>
                </div>
                {estimate.supportCost > 0 && (
                  <p className="text-xs text-indigo-600 dark:text-sky-300/90 mt-1 flex items-center gap-1 font-mono font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>+{estimate.supportCost}/mo ({supportTier === 'mission-critical' ? '24/7 Dedicated SRE' : 'Standard SLA'})</span>
                  </p>
                )}
              </div>

              {/* Estimated Delivery Timeline */}
              <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  {t('estimator.estimatedTimeline')}
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Clock className="w-6 h-6 text-indigo-600 dark:text-sky-400" />
                  <span>{estimate.weeksMin} - {estimate.weeksMax} {language === 'ar' ? 'أسابيع عمل' : 'Weeks Sprint'}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {language === 'ar' ? 'مع تسليمات تدريجية كل أسبوعين (Agile Sprints)' : 'Includes bi-weekly milestone demo releases'}
                </p>
              </div>

              {/* Included Services Summary */}
              <div className="mb-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  {language === 'ar' ? 'الخدمات المضمنة في التقدير:' : 'Included Scope Services:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedServices.map(id => {
                    const svc = servicesOptions.find(o => o.id === id);
                    return (
                      <span key={id} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-indigo-500/30 text-[11px] font-medium text-slate-700 dark:text-sky-300">
                        {svc?.title[language]}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Selected Tech Stack Summary */}
              {selectedStackSpecs.length > 0 && (
                <div className="mb-8 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    {language === 'ar' ? 'المواصفات التقنية المحددة:' : 'Specified Tech Stack:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStackSpecs.map(spec => (
                      <span key={spec} className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-dark-800 border border-indigo-200 dark:border-slate-700 text-[10px] font-mono text-indigo-700 dark:text-sky-300 font-semibold">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Lock in & Submit */}
              <button
                onClick={handleTriggerProposal}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('estimator.submitQuote')}</span>
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

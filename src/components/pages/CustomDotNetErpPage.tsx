import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Code2,
  Database,
  ShieldCheck,
  Zap,
  ArrowRight,
  Terminal,
  Layers,
  Sparkles,
  Calculator,
  Lock
} from 'lucide-react';

interface CustomDotNetErpPageProps {
  onOpenQuote: () => void;
  onNavigateToEstimator: () => void;
}

export const CustomDotNetErpPage: React.FC<CustomDotNetErpPageProps> = ({
  onOpenQuote,
  onNavigateToEstimator,
}) => {
  const { language } = useLanguage();

  return (
    <div className="pt-24 pb-20 overflow-hidden">
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-sky-400 mb-6 shadow-xs">
            <Code2 className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'حلول الـ ERP المخصصة بالكامل' : '100% Bespoke Enterprise Web ERP'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mb-6 font-heading">
            {language === 'ar' ? (
              <>
                هندسة أنظمة <span className="text-gradient-cyan">ERP سحابية مخصصة</span> بـ .NET 9 و Next.js وبدون اشتراكات شهرية
              </>
            ) : (
              <>
                Custom Web ERPs Built on <span className="text-gradient-cyan">.NET 9 Core & Next.js</span>. Zero Per-Seat Licensing.
              </>
            )}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl max-w-3xl leading-relaxed mb-8">
            {language === 'ar'
              ? 'تخلص من القيود والاشتراكات الشهرية المتصاعدة للأنظمة الجاهزة. نبني لك منصة ERP مخصصة بنسبة 100% لعملياتك مع تسليم كامل للملكية الفكرية وشفرة المصدر وتراخيص مستخدمين غير محدودة.'
              : 'Eliminate rigid SaaS templates and escalating per-user fees. Nexora engineers tailored, mission-critical Web ERPs with microsecond .NET microservices, MSSQL relational integrity, and 100% intellectual property ownership.'}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onNavigateToEstimator}
              className="px-6 py-3.5 rounded-xl btn-primary-cta text-white font-extrabold text-sm tracking-wide flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>{language === 'ar' ? 'احسب تكلفة الـ ERP المخصص' : 'Calculate Custom ERP Cost'}</span>
            </button>

            <button
              onClick={onOpenQuote}
              className="px-6 py-3.5 rounded-xl btn-secondary-outline text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'ar' ? 'طلب استشارة مع كبير المعماريين' : 'Speak with Lead ERP Architect'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-sky-400">
            {language === 'ar' ? 'البنية المعمارية المتقدمة' : 'Engineered for Performance & Scale'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 font-heading">
            {language === 'ar' ? 'مواصفات المنظومة البرمجية المخصصة' : 'Why Mid-Market & Enterprise Leaders Choose Bespoke .NET'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: { en: '.NET 9 Core Web API Microservices', ar: 'محرك .NET 9 Core Web API فائق السرعة' },
              desc: {
                en: 'Sub-20ms REST endpoints engineered with C# 13, asynchronous thread pools, and domain-driven design to handle tens of thousands of concurrent inventory and order transactions.',
                ar: 'نقاط نهاية REST بزمن استجابة أقل من 20 مللي ثانية، مبرمجة بـ C# 13 وتصميم موجه للمجال (DDD) لمعالجة عشرات الآلاف من العمليات اللحظية.'
              },
              icon: <Zap className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
            },
            {
              title: { en: 'Next.js 15 & React 19 Executive UI', ar: 'واجهات Next.js 15 و React 19 التفاعلية' },
              desc: {
                en: 'Ultra-responsive administrative dashboards with Server-Side Rendering (SSR), streaming hydration, and real-time WebSocket telemetry for instantaneous operational decision-making.',
                ar: 'بوابات إدارية فائقة الاستجابة تعتمد التصيير من جهة الخادم (SSR) مع تدفق البيانات عبر WebSocket لقرارات تشغيلية فورية.'
              },
              icon: <Terminal className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
            },
            {
              title: { en: 'MSSQL Relational Integrity & Redis', ar: 'قواعد بيانات MSSQL وتخزين Redis المؤقت' },
              desc: {
                en: 'ACID-compliant Microsoft SQL Server schemas optimized with columnstore indexes, stored procedures, and Redis in-memory caching to eliminate bottlenecks.',
                ar: 'قواعد بيانات Microsoft SQL Server المتوافقة مع معايير ACID مع فهرسة متقدمة وتخزين Redis المؤقت لمنع أي بطء.'
              },
              icon: <Database className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
            },
            {
              title: { en: '100% IP & Source Code Handover', ar: 'تسليم كامل للملكية الفكرية وشفرة المصدر' },
              desc: {
                en: 'You own every line of code, Dockerfile, database migration, and schema. No monthly per-seat licensing fees or vendor lock-in ever.',
                ar: 'تمتلك شركتك كل سطر برمجي وملفات الإعداد وقواعد البيانات. بدون أي رسوم اشتراك شهرية على المستخدمين وبدون أي قيود.'
              },
              icon: <Lock className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
            },
            {
              title: { en: 'ZATCA & GCC Multi-Region Tax Compliance', ar: 'امتثال ضريبي لهيئة الزكاة والضريبة والجمارك' },
              desc: {
                en: 'Automated cryptographic Phase-2 XML e-invoicing, QR generation, multi-currency ledgers, and automated customs reporting tailored to Gulf operations.',
                ar: 'فوترة إلكترونية مشفرة للمرحلة الثانية مع توليد QR آلي، ودفاتر حسابات متعددة العملات متوافقة مع متطلبات دول الخليج.'
              },
              icon: <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
            },
            {
              title: { en: 'Bi-Directional API Integration Bridges', ar: 'جسور ربط API ثنائية الاتجاه مع البنوك والأنظمة' },
              desc: {
                en: 'Pre-engineered connectors for banking APIs, shipping carriers, legacy databases, and third-party CRM platforms with automated retry queues.',
                ar: 'موصلات برمجية جاهزة للربط مع بوابات البنوك وشركات الشحن والأنظمة المحاسبية السابقة مع طوابير إعادة المحاولة التلقائية.'
              },
              icon: <Layers className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
            }
          ].map((pillar, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-indigo-500/40 transition-all hover:-translate-y-1"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                  {pillar.icon}
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 font-heading">
                  {pillar.title[language]}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {pillar.desc[language]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Live CTA Banner */}
        <div className="mt-16 glass-panel p-8 sm:p-12 rounded-3xl border border-indigo-200 dark:border-indigo-500/40 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for Production Deployment</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            {language === 'ar' ? 'هل أنت جاهز لتملك نظام الـ ERP الخاص بشركتك؟' : 'Ready to Own Your Enterprise ERP Infrastructure?'}
          </h3>

          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {language === 'ar'
              ? 'احسب التكلفة التقديرية بدقة عبر حاسبة المشاريع التفاعلية أو اطلب مراجعة معمارية مجانية مع كبار مهندسي نيكسورا.'
              : 'Configure your custom module specifications in our interactive estimator or schedule an architecture review with our lead engineers.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onNavigateToEstimator}
              className="px-6 py-3.5 rounded-xl btn-primary-cta text-white font-extrabold text-sm tracking-wide flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>{language === 'ar' ? 'فتح حاسبة التكلفة التفاعلية' : 'Open Interactive Cost Estimator'}</span>
            </button>

            <button
              onClick={onOpenQuote}
              className="px-6 py-3.5 rounded-xl btn-secondary-outline text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'ar' ? 'طلب عرض فني مفصل' : 'Request Proposal & Scope'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

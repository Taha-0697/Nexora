import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Terminal,
  ArrowRight,
  Calculator,
  Sparkles,
  Zap,
  Layers,
  ShieldCheck,
  RefreshCw,
  GitBranch
} from 'lucide-react';
import { RelatedServiceCaseStudies } from '../common/RelatedServiceCaseStudies';

interface OdooEnterprisePageProps {
  onOpenQuote: () => void;
  onNavigateToEstimator: () => void;
}

export const OdooEnterprisePage: React.FC<OdooEnterprisePageProps> = ({
  onOpenQuote,
  onNavigateToEstimator,
}) => {
  const { language } = useLanguage();

  return (
    <div className="pt-24 pb-20 overflow-hidden">
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 section-surface-1">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-500/30 text-xs font-semibold text-purple-700 dark:text-purple-400 mb-6 shadow-xs">
            <Terminal className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تخصيص Odoo المؤسسي وتطوير بايثون' : 'Odoo Enterprise & Python Engineering'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mb-6 font-heading">
            {language === 'ar' ? (
              <>
                تخصيص <span className="text-gradient-cyan">Odoo Enterprise</span> وتطوير جسور بايثون اللحظية مع قواعد بياناتك
              </>
            ) : (
              <>
                Odoo Enterprise Customization & <span className="text-gradient-cyan">Python 3.12 Backend Bridges</span>
              </>
            )}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl max-w-3xl leading-relaxed mb-8">
            {language === 'ar'
              ? 'تجاوز حدود القوالب الافتراضية. يبني مهندسونا وحدات Odoo برمجية مخصصة بالكامل، مع جسور FastAPI فائقة السرعة ومزامنة حية ثنائية الاتجاه بين PostgreSQL و Microsoft SQL Server (MSSQL) تضمن دقة السجلات المحاسبية واللوجستية.'
              : 'Extend Odoo without breaking future upgrades. Nexora architects bespoke Python modules, FastAPI middleware, and real-time bi-directional PostgreSQL/MSSQL data synchronization for multi-entity conglomerates.'}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onNavigateToEstimator}
              className="px-6 py-3.5 rounded-xl btn-primary-cta text-white font-extrabold text-sm tracking-wide flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>{language === 'ar' ? 'احسب تكلفة تخصيص Odoo' : 'Calculate Odoo Project Cost'}</span>
            </button>

            <button
              onClick={onOpenQuote}
              className="px-6 py-3.5 rounded-xl btn-secondary-outline text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'ar' ? 'طلب استشارة مع استشاري Odoo' : 'Consult with Odoo Architect'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-surface-2">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            {language === 'ar' ? 'القدرات الهندسية لـ Odoo' : 'Enterprise Odoo Specializations'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 font-heading">
            {language === 'ar' ? 'كيف نحدث الفارق في مشاريع Odoo المؤسسية؟' : 'Robust Architecture Over Fragile Workarounds'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: { en: 'Bespoke Odoo 17/18 Module Development', ar: 'تطوير وحدات Odoo 17/18 المخصصة بالكامل' },
              desc: {
                en: 'Clean, isolated module engineering utilizing the official Python 3.12 ORM. Custom fields, inherited views, automated business logic, and regression-free upgrade compliance.',
                ar: 'بناء وحدات برمجية معزولة ونظيفة باستخدام نماذج بايثون 3.12 الرسمية. حقول مخصصة، وشاشات مهيأة، وضمان الترقية المستقبلية دون أي تعارض.'
              },
              icon: <Terminal className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            },
            {
              title: { en: 'Bi-Directional PostgreSQL & MSSQL Sync', ar: 'مزامنة حية ثنائية الاتجاه بين PostgreSQL و MSSQL' },
              desc: {
                en: 'High-throughput Change Data Capture (CDC) pipelines synchronizing orders, inventory, and customer ledgers in real time between Odoo PostgreSQL and corporate MSSQL servers.',
                ar: 'خطوط نقل وتزامن لحظية للبيانات بين قواعد بيانات Odoo (PostgreSQL) وخوادم MSSQL المركزية لضمان تطابق المخزون ودفاتر الحسابات.'
              },
              icon: <RefreshCw className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            },
            {
              title: { en: 'FastAPI & XML-RPC Middleware Bridges', ar: 'جسور FastAPI و XML-RPC السحابية فائقة السرعة' },
              desc: {
                en: 'High-velocity asynchronous Python REST microservices providing secure programmatic access between Odoo ERP, custom mobile apps, and administrative customer portals.',
                ar: 'خدمات مصغرة غير متزامنة بـ FastAPI لتوفير وصول برمجي فائق السرعة والأمان بين نظام Odoo وتطبيقات الجوال وبوابات العملاء.'
              },
              icon: <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            },
            {
              title: { en: 'ZATCA & GCC Automated Tax Invoicing', ar: 'الفوترة الإلكترونية والامتثال الضريبي الخليجي' },
              desc: {
                en: 'Native Phase-2 integration generating compliant XML invoices, cryptographic digital signatures, and automated dispatch to tax authorities across UAE, KSA, and GCC.',
                ar: 'تكامل أصيل للمرحلة الثانية مع توليد الفواتير المشفرة والأختام الرقمية والإرسال الآلي لهيئات الضرائب في السعودية والإمارات ودول الخليج.'
              },
              icon: <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            },
            {
              title: { en: 'Multi-Warehouse Barcode & RFID Logistics', ar: 'أتمتة المخازن والباركود والتحكم اللوجستي' },
              desc: {
                en: 'Hardware-level barcode terminal integrations, wave picking workflows, serialized tracking, and multi-location reordering automation for high-volume distributors.',
                ar: 'ربط مباشر مع قارئات الباركود المحمولة، وأنظمة التتبع اللوجستي المتعددة، وأتمتة أوامر الشراء وإعادة تعبئة المخازن تلقائياً.'
              },
              icon: <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            },
            {
              title: { en: 'Multi-Company Consolidation & Financials', ar: 'توحيد الحسابات والشركات القابضة والمجموعات' },
              desc: {
                en: 'Unified chart of accounts, inter-company automated transactions, multi-currency valuation adjustments, and executive consolidated P&L balance sheets.',
                ar: 'دليل حسابات موحد، وقيود يومية آلية بين الشركات الشقيقة، وتقارير أرباح وخسائر وقوائم مركز مالي موحدة للشركات القابضة.'
              },
              icon: <GitBranch className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            }
          ].map((pillar, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-purple-500/40 transition-all hover:-translate-y-1"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center mb-4">
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

        {/* Related Case Studies for Odoo Enterprise */}
        <RelatedServiceCaseStudies
          serviceField="Odoo Enterprise & Python Bridges"
          onOpenQuote={onOpenQuote}
        />

        {/* Live CTA Banner */}
        <div className="mt-16 glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Odoo Certified Engineering & Python Specialists</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            {language === 'ar' ? 'هل تريد رفع كفاءة نظام Odoo ليتناسب مع عملياتك المعقدة؟' : 'Ready to Supercharge Your Odoo Enterprise Ecosystem?'}
          </h3>

          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {language === 'ar'
              ? 'احسب استثمار مشروع Odoo بدقة بعملتك المحلية أو اطلب مراجعة معمارية لربط قواعد بياناتك الحالية.'
              : 'Estimate your Odoo customization and bridge implementation in our calculator or speak directly with our senior Python/Odoo engineers.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onNavigateToEstimator}
              className="px-6 py-3.5 rounded-xl btn-primary-cta text-white font-extrabold text-sm tracking-wide flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>{language === 'ar' ? 'فتح حاسبة تكلفة Odoo' : 'Calculate Odoo Scope in Estimator'}</span>
            </button>

            <button
              onClick={onOpenQuote}
              className="px-6 py-3.5 rounded-xl btn-secondary-outline text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'ar' ? 'طلب استشارة فنية' : 'Request Architecture Consultation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

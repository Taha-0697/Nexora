import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  RefreshCw,
  Layers,
  ArrowRight,
  Calculator,
  ShieldCheck,
  GitMerge
} from 'lucide-react';
import { RelatedServiceCaseStudies } from '../common/RelatedServiceCaseStudies';

interface ErpModernizationPageProps {
  onOpenQuote: () => void;
  onNavigateToEstimator: () => void;
}

export const ErpModernizationPage: React.FC<ErpModernizationPageProps> = ({
  onOpenQuote,
  onNavigateToEstimator,
}) => {
  const { language } = useLanguage();

  return (
    <div className="pt-24 pb-20 overflow-hidden">
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 section-surface-1">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-6 shadow-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تحديث أنظمة ERP القديمة والتكامل السلس' : 'Legacy ERP Modernization & High-Throughput Integration'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mb-6 font-heading">
            {language === 'ar' ? (
              <>
                تحديث أنظمة <span className="text-gradient-cyan">ERP والربط البرمجي الشامل</span> بدون توقف للأعمال
              </>
            ) : (
              <>
                ERP Modernization & <span className="text-gradient-cyan">Enterprise Integration</span>
              </>
            )}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl max-w-3xl leading-relaxed mb-8">
            {language === 'ar'
              ? 'تفكيك الأنظمة التقليدية القديمة المعقدة والانتقال إلى بنى برمجية حديثة وقابلة للتوسع، مع ربط متزامن فوري بين أنظمة المحاسبة، وسلاسل الإمداد، وإدارة المخزون، ونقاط البيع.'
              : 'Safely deconstruct legacy monolithic ERPs and migrate mission-critical workflows to high-speed microservices. Real-time data synchronization across SAP, Oracle, Odoo, and custom enterprise databases with zero downtime.'}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onNavigateToEstimator}
              className="px-6 py-3.5 rounded-xl btn-primary-cta text-white font-extrabold text-sm tracking-wide flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>{language === 'ar' ? 'احسب تكلفة التحديث والتكامل' : 'Calculate ERP Modernization Cost'}</span>
            </button>

            <button
              onClick={onOpenQuote}
              className="px-6 py-3.5 rounded-xl btn-secondary-outline text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'ar' ? 'استشارة مع كبير مهندسي تكامل النظم' : 'Consult Principal Integration Architect'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-surface-2">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {language === 'ar' ? 'منهجية التحديث الآمنة' : 'Zero-Downtime Migration & Data Integrity'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 font-heading">
            {language === 'ar' ? 'ركائز تحديث الأنظمة والتكامل' : 'Modernization & Integration Pillars'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: GitMerge,
              title: language === 'ar' ? 'مزامنة البيانات الحية (CDC)' : 'Real-Time Change Data Capture (CDC)',
              desc: language === 'ar'
                ? 'استخدام Apache Kafka و Debezium لبث التغييرات بين الأنظمة القديمة والحديثة لحظياً وبدون أي تعارض.'
                : 'Bi-directional streaming replication between legacy and modern relational stores with automated conflict resolution.'
            },
            {
              icon: Layers,
              title: language === 'ar' ? 'تفكيك الكتل المعمارية (Strangler Fig)' : 'Incremental Strangler Fig Decommissioning',
              desc: language === 'ar'
                ? 'استبدال الوحدات التشغيلية تدريجياً وبأمان دون إيقاف العمليات اليومية أو التأثير على العملاء.'
                : 'De-risk enterprise upgrades by migrating business capabilities slice by slice behind a unified reverse proxy.'
            },
            {
              icon: ShieldCheck,
              title: language === 'ar' ? 'بوابات API الموحدة والأمان' : 'Unified Enterprise API Gateways',
              desc: language === 'ar'
                ? 'ربط مركزي آمن بين بوابات الدفع، والجهات الحكومية (ZATCA وغيرها)، وأنظمة المستودعات مع تدقيق كامل.'
                : 'Centralized, rate-limited and audited API gateways connecting third-party platforms, fiscal authorities, and ERPs.'
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 shadow-xs group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-105 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-heading">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Related Work / Case Studies */}
      <RelatedServiceCaseStudies
        serviceField="ERP Modernization & System Integration"
        onOpenQuote={onOpenQuote}
      />
    </div>
  );
};

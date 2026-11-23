import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Cloud,
  ShieldCheck,
  ArrowRight,
  Calculator,
  Activity,
  Terminal
} from 'lucide-react';
import { RelatedServiceCaseStudies } from '../common/RelatedServiceCaseStudies';

interface CloudDevOpsPageProps {
  onOpenQuote: () => void;
  onNavigateToEstimator: () => void;
}

export const CloudDevOpsPage: React.FC<CloudDevOpsPageProps> = ({
  onOpenQuote,
  onNavigateToEstimator,
}) => {
  const { language } = useLanguage();

  return (
    <div className="pt-24 pb-20 overflow-hidden">
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 section-surface-1">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-500/30 text-xs font-semibold text-sky-700 dark:text-sky-400 mb-6 shadow-xs">
            <Activity className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'إدارة السيرفرات السحابية ومراقبة SRE على مدار الساعة' : '24/7 Cloud DevOps & SRE Management'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mb-6 font-heading">
            {language === 'ar' ? (
              <>
                إدارة السيرفرات السحابية <span className="text-gradient-cyan">بجاهزية 99.99%</span> وهندسة DevOps متقدمة
              </>
            ) : (
              <>
                24/7 Server Management & <span className="text-gradient-cyan">Cloud DevOps</span>. 99.99% SLA Uptime.
              </>
            )}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl max-w-3xl leading-relaxed mb-8">
            {language === 'ar'
              ? 'بنية تحتية مرنة وقابلة للتوسع التلقائي على AWS و Azure و GCP مع مراقبة استباقية مدار الساعة، ونسخ احتياطي فوري، واستجابة للطوارئ في أقل من 15 دقيقة.'
              : 'Enterprise cloud infrastructure engineered for zero unplanned downtime. Multi-region Kubernetes orchestration, automated CI/CD pipelines, Terraform IaC, and 24/7 proactive SRE incident response.'}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onNavigateToEstimator}
              className="px-6 py-3.5 rounded-xl btn-primary-cta text-white font-extrabold text-sm tracking-wide flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>{language === 'ar' ? 'احسب تكلفة DevOps والسيرفرات' : 'Calculate Cloud & DevOps Cost'}</span>
            </button>

            <button
              onClick={onOpenQuote}
              className="px-6 py-3.5 rounded-xl btn-secondary-outline text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'ar' ? 'استشارة مع مهندس البنية التحتية' : 'Consult Lead SRE Architect'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-surface-2">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            {language === 'ar' ? 'معايير التشغيل والموثوقية' : 'High-Availability Architecture & Compliance'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 font-heading">
            {language === 'ar' ? 'ركائز البنية السحابية وإدارة الخوادم' : 'Cloud Infrastructure & SRE Pillars'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Cloud,
              title: language === 'ar' ? 'مجموعات Kubernetes المتعددة' : 'Multi-Region Kubernetes (EKS/GKE)',
              desc: language === 'ar'
                ? 'إدارة متقدمة لحاويات التطبيقات مع تحجيم أفقي تلقائي وتحمل كامل للأعطال بدون أي توقف.'
                : 'Production-hardened Kubernetes clusters with automated horizontal pod autoscaling, zero-downtime rolling deploys, and automated failover.'
            },
            {
              icon: Terminal,
              title: language === 'ar' ? 'البنية ككود (Terraform / IaC)' : 'Infrastructure as Code & CI/CD',
              desc: language === 'ar'
                ? 'تشييد وإدارة البيئات البرمجية بكود موثوق عبر Terraform مع أنابيب تسليم مستمر مؤمنة بالكامل.'
                : 'Reproducible cloud environments provisioned via Terraform and GitOps workflows, backed by automated security scans.'
            },
            {
              icon: ShieldCheck,
              title: language === 'ar' ? 'مراقبة استباقية 24/7 وحماية DDoS' : '24/7 SRE Monitoring & Hardening',
              desc: language === 'ar'
                ? 'مراقبة حية عبر Prometheus و Grafana مع حماية متقدمة من هجمات حجب الخدمة ومطابقة معايير SOC2 و ISO.'
                : 'Sub-15 minute incident response SLAs, Prometheus/Grafana real-time telemetry, Cloudflare enterprise DDoS protection, and automated backups.'
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800/80 hover:border-sky-500/40 transition-all duration-300 shadow-xs group"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-6 group-hover:scale-105 transition-transform">
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
        serviceField="24/7 Server Management & Cloud DevOps"
        onOpenQuote={onOpenQuote}
      />
    </div>
  );
};

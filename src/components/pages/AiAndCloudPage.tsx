import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Cpu,
  Cloud,
  ShieldCheck,
  Zap,
  ArrowRight,
  Calculator,
  Sparkles,
  Bot,
  Activity,
  Terminal
} from 'lucide-react';

interface AiAndCloudPageProps {
  onOpenQuote: () => void;
  onNavigateToEstimator: () => void;
}

export const AiAndCloudPage: React.FC<AiAndCloudPageProps> = ({
  onOpenQuote,
  onNavigateToEstimator,
}) => {
  const { language } = useLanguage();

  return (
    <div className="pt-24 pb-20 overflow-hidden">
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-500/30 text-xs font-semibold text-cyan-700 dark:text-cyan-400 mb-6 shadow-xs">
            <Cpu className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'الذكاء الاصطناعي والبنية التحتية السحابية' : 'Enterprise AI & Cloud Infrastructure'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mb-6 font-heading">
            {language === 'ar' ? (
              <>
                دمج <span className="text-gradient-cyan">الذكاء الاصطناعي وبنية سحابية</span> بنسبة جاهزية 99.99% على AWS و Azure
              </>
            ) : (
              <>
                Production AI Agents & <span className="text-gradient-cyan">24/7 Cloud DevOps</span>. 99.99% SLA Uptime.
              </>
            )}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl max-w-3xl leading-relaxed mb-8">
            {language === 'ar'
              ? 'حوّل عملياتك التشغيلية إلى نماذج ذكاء اصطناعي ذاتية التنفيذ مدعومة ببنى تحتية سحابية مرنة وقابلة للتوسع التلقائي على AWS و Azure مع مراقبة مدار الساعة وشهادات أمان دولية.'
              : 'Empower your enterprise with custom LLM orchestrations, RAG pipelines, and automated multi-agent workflows backed by resilient, self-healing cloud clusters on AWS and Azure.'}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onNavigateToEstimator}
              className="px-6 py-3.5 rounded-xl btn-primary-cta text-white font-extrabold text-sm tracking-wide flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>{language === 'ar' ? 'احسب تكلفة المشروع' : 'Calculate AI & Cloud Project Cost'}</span>
            </button>

            <button
              onClick={onOpenQuote}
              className="px-6 py-3.5 rounded-xl btn-secondary-outline text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'ar' ? 'استشارة مع مهندس الذكاء الاصطناعي' : 'Consult AI & SRE Lead Architect'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            {language === 'ar' ? 'المعايير الهندسية والأمان' : 'Engineered for Zero Downtime & Maximum Accuracy'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 font-heading">
            {language === 'ar' ? 'قدرات الذكاء الاصطناعي والعمليات السحابية' : 'Enterprise Capabilities & Cloud Architecture'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: { en: 'Enterprise LLMs & Custom RAG Pipelines', ar: 'نماذج LLM مخصصة وتقنيات استرجاع RAG' },
              desc: {
                en: 'Fine-tuned OpenAI, Anthropic, or self-hosted vLLM deployments with Milvus/Pinecone vector databases and hybrid search to eliminate hallucinations and secure proprietary data.',
                ar: 'نماذج ذكاء اصطناعي مدربة وقواعد بيانات متجهة (Vector DBs) لتأمين بيانات الشركة وتقديم إجابات دقيقة خالية من الهلوسة.'
              },
              icon: <Bot className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            },
            {
              title: { en: 'Autonomous AI Workflow Agents', ar: 'وكلاء ذكاء اصطناعي لأتمتة سير العمل المعقد' },
              desc: {
                en: 'Autonomous agentic loops for invoice matching, financial reconciliation, customer support triage, and automated document extraction with human-in-the-loop audit gates.',
                ar: 'وكلاء رقميون لأتمتة مطابقة الفواتير، تدقيق الحسابات، دعم العملاء واستخراج البيانات من المستندات مع إمكانية التحقق البشري.'
              },
              icon: <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            },
            {
              title: { en: 'Kubernetes (EKS / AKS) Auto-Scaling', ar: 'عناقيد Kubernetes (EKS / AKS) ذات التوسع الذاتي' },
              desc: {
                en: 'Production-ready container clusters with Horizontal Pod Autoscalers (HPA), zero-downtime rolling canary deployments, and multi-zone regional failover.',
                ar: 'عناقيد حاويات موثوقة مع توسع ديناميكي تلقائي، وتحديثات سلسة بدون أي توقف، مع توزيع جغرافي لضمان استمرارية العمل.'
              },
              icon: <Cloud className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            },
            {
              title: { en: 'Infrastructure as Code (Terraform & GitOps)', ar: 'إدارة البنية كشفرة برمجية (Terraform و GitOps)' },
              desc: {
                en: '100% reproducible AWS and Azure environments provisioned via Terraform, modularized configs, and automated GitHub Actions CI/CD deployment pipelines.',
                ar: 'بنية سحابية قابلة للتكرار بالكامل عبر Terraform ومسارات نشر أوتوماتيكية GitOps توفر سرعة وأمان في عمليات الإطلاق.'
              },
              icon: <Terminal className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            },
            {
              title: { en: '24/7 SRE Telemetry & Sub-15m MTTR', ar: 'مراقبة حية على مدار الساعة وزمن استجابة أقل من 15 دقيقة' },
              desc: {
                en: 'Prometheus, Grafana, and OpenTelemetry instrumentation with automated anomaly detection, pager alerts, and guaranteed SLA incident resolution.',
                ar: 'أنظمة قياس ومراقبة شاملة مع تنبيهات استباقية وكشف فوري للخلل التشغيلي مع التزام باتفاقيات مستوى الخدمة (SLA).'
              },
              icon: <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            },
            {
              title: { en: 'SOC2 & ISO 27001 Security Hardening', ar: 'حماية أمنية وتشفير معتمد لبيانات المؤسسة' },
              desc: {
                en: 'Strict VPC network segmentation, IAM least-privilege policies, automated Trivy container scans, and KMS envelope encryption at rest and in transit.',
                ar: 'عزل شبكي صارم، سياسات وصول دقيقة، تشفير شامل للبيانات أثناء النقل والتخزين، وفحوصات دورية للثغرات الأمنية.'
              },
              icon: <ShieldCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            }
          ].map((pillar, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition-all hover:-translate-y-1"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-slate-800 flex items-center justify-center mb-4">
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
        <div className="mt-16 glass-panel p-8 sm:p-12 rounded-3xl border border-cyan-200 dark:border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>99.99% SLA Available</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            {language === 'ar' ? 'هل أنت مستعد لنشر الذكاء الاصطناعي وتطوير بنيتك السحابية؟' : 'Ready to Deploy Enterprise AI & Fortify Your Cloud?'}
          </h3>

          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {language === 'ar'
              ? 'احصل على دراسة جدوى وتكلفة تقديرية خلال دقائق أو تحدث مع رئيس مهندسي الذكاء الاصطناعي والبنية السحابية في نيكسورا.'
              : 'Calculate your architecture budget in our interactive estimator or book a technical deep-dive with our AI & DevOps architects.'}
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
              <span>{language === 'ar' ? 'طلب استشارة فنية' : 'Request Architecture Consultation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

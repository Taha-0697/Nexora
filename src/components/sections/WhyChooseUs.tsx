import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Database, 
  Layers, 
  Zap, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Code2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface KeyQuestion {
  id: string;
  question: {
    en: string;
    ar: string;
  };
  category: {
    en: string;
    ar: string;
  };
  answer: {
    en: string;
    ar: string;
  };
  highlights: {
    en: string[];
    ar: string[];
  };
  icon: React.ReactNode;
}

export const WhyChooseUs: React.FC = () => {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const questions: KeyQuestion[] = [
    {
      id: 'senior-oversight',
      category: {
        en: 'Engineering Architecture',
        ar: 'الهندسة المعمارية'
      },
      question: {
        en: 'Who actually designs and writes our software? Will junior developers be handed our project?',
        ar: 'من يقوم فعلياً بتصميم وبرمجة نظامنا؟ وهل يتم تسليم المشروع لمطورين مبتدئين؟'
      },
      answer: {
        en: 'Zero outsourcing and zero junior handoffs. Every line of code, database schema, and microservice is directly engineered and reviewed by seasoned full-stack architects with extensive backgrounds in .NET Core, Next.js, and distributed enterprise systems. You interface directly with technical decision-makers who understand high-throughput concurrency, business logic, and code maintainability.',
        ar: 'نلتزم بمبدأ عدم تفويض المشاريع لمطورين مبتدئين أو وسطاء. تتم هندسة وكتابة كل سطر برمجي ومخطط قاعدة بيانات وميكروسيرفس بإشراف وتنفيذ مباشر من كبار معماريي البرمجيات ذوي الخبرة العميقة في .NET Core و Next.js والأنظمة السحابية الموزعة. تتواصل مباشرة مع مهندسين تقنيين يفهمون منطق الأعمال وقابلية التوسع.'
      },
      highlights: {
        en: [
          'Direct senior architect oversight on 100% of deliverables',
          'Rigorous PR code reviews & automated SonarQube quality gates',
          'Clean architecture (Domain-Driven Design, CQRS, Repository patterns)'
        ],
        ar: [
          'إشراف وتنفيذ مباشر من كبار المهندسين على 100% من المخرجات',
          'مراجعات صارمة للأكواد واختبارات جودة مؤتمتة SonarQube',
          'بنية معمارية نظيفة (Clean Architecture & Domain-Driven Design)'
        ]
      },
      icon: <Terminal className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
    },
    {
      id: 'custom-dotnet-erp',
      category: {
        en: 'Custom Web ERP (.NET)',
        ar: 'أنظمة ERP مخصصة (.NET)'
      },
      question: {
        en: 'How does Nexora build 100% bespoke Web ERP systems without per-seat licensing fees?',
        ar: 'كيف تقوم نيكسورا ببناء أنظمة ERP سحابية مخصصة 100% بدون رسوم تراخيص مستخدمين؟'
      },
      answer: {
        en: 'We engineer mission-critical Web ERP platforms from the ground up using .NET 9 Core Web API microservices, React 19 / Next.js 15 administrative portals, and Microsoft SQL Server (MSSQL). Unlike off-the-shelf monolithic ERPs that charge escalating per-seat monthly subscription taxes, Nexora hands over 100% proprietary intellectual property (IP), custom domain models, and unrestricted user licensing. Your organization owns the asset outright with tailored modules built specifically around your workflows.',
        ar: 'نبني منصات الـ ERP المؤسسية المخصصة من الصفر باستخدام خدمات .NET 9 Core Web API المصغرة، وبوابات Next.js 15 الإدارية التفاعلية، وقواعد بيانات MSSQL. خلافاً لحلول الـ ERP الجاهزة التي تفرض رسوماً شهرية متصاعدة عن كل مستخدم، تسلم نيكسورا ملكية فكرية كاملة (IP) 100% للعميل مع تراخيص مستخدمين غير محدودة. تمتلك شركتك المنظومة بالكامل مع وحدات مصممة خصيصاً لتفاصيل عملياتك.'
      },
      highlights: {
        en: [
          '.NET 9 Core Web API, Next.js 15 & MSSQL transaction engine',
          '100% IP & source code ownership — zero recurring per-user licensing fees',
          'Tailored workflow modules, multi-branch ledgers & ZATCA e-invoicing'
        ],
        ar: [
          'محرك .NET 9 Core Web API و Next.js 15 وقواعد بيانات MSSQL الموثوقة',
          'ملكية فكرية كاملة 100% للكود والأصول — بدون رسوم شهرية على المستخدمين',
          'وحدات مخصصة بالكامل لعملياتك ودفاتر الحسابات والفوترة الضريبية'
        ]
      },
      icon: <Code2 className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
    },
    {
      id: 'odoo-enterprise-stack',
      category: {
        en: 'Odoo Enterprise',
        ar: 'أنظمة Odoo المؤسسية'
      },
      question: {
        en: 'What Odoo Enterprise customization capabilities do you provide, and how do Python bridges connect our databases?',
        ar: 'ما هي قدراتكم في تخصيص Odoo المؤسسي، وكيف تربط جسور بايثون قواعد بياناتنا؟'
      },
      answer: {
        en: 'Our dedicated Odoo engineering practice focuses on deep enterprise customization: bespoke Python 3.12 modules, custom accounting workflows, multi-company consolidation, and warehouse/barcode automation. We engineer high-speed FastAPI middleware and XML-RPC bridges that bi-directionally synchronize Odoo PostgreSQL databases with existing corporate Microsoft SQL Server (MSSQL) or custom .NET microservices in real time, preventing data drift and eliminating double entries.',
        ar: 'يركز فريق Odoo المتخصص لدينا على التخصيص المؤسسي العميق: بناء وحدات برمجية مخصصة بـ Python 3.12، سير عمل محاسبي مخصص، توحيد دفاتر الشركات المتعددة، وأتمتة المستودعات والباركود. نطور جسور برمجية متقدمة عبر FastAPI و XML-RPC لمزامنة لحظية ثنائية الاتجاه بين قواعد بيانات Odoo (PostgreSQL) وقواعد MSSQL وأنظمة .NET القائمة، مما يمنع تضارب البيانات ويوحد التقارير المالية.'
      },
      highlights: {
        en: [
          'Custom Odoo 17/18 module development & Python 3.12 ORM extensions',
          'High-throughput FastAPI middleware & XML-RPC real-time event bridges',
          'Bi-directional PostgreSQL & MSSQL synchronization with zero data loss'
        ],
        ar: [
          'تطوير وحدات Odoo 17/18 المخصصة وتوسعة نماذج بايثون 3.12',
          'وسيط FastAPI عالي السرعة وجسور XML-RPC لنقل الأحداث اللحظية',
          'مزامنة ثنائية الاتجاه بين PostgreSQL و MSSQL مع ضمان سلامة البيانات'
        ]
      },
      icon: <Database className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
    },
    {
      id: 'full-cycle-stack',
      category: {
        en: 'Full-Stack Delivery',
        ar: 'تطوير شامل متكامل'
      },
      question: {
        en: 'Do we need to hire separate agencies for Web, Mobile, and Cloud infrastructure?',
        ar: 'هل نحتاج لتوظيف شركات مختلفة لتطوير الويب والجوال والسيرفرات السحابية؟'
      },
      answer: {
        en: 'No. Nexora operates as a unified, full-cycle software engineering house. Our core capabilities span high-velocity Next.js 15 SSR web portals, native iOS (Swift/SwiftUI), native Android (Kotlin), and Flutter cross-platform applications, supported by automated Docker/Kubernetes cloud orchestration on AWS, Azure, and Neon PostgreSQL. You get one accountable partner for the entire technology lifecycle.',
        ar: 'لا إطلاقاً. نيكسورا بيت برمجيات متكامل يغطي كافة المراحل تحت سقف واحد. قدراتنا تشمل بوابات Next.js 15 السريعة، وتطبيقات الجوال الأصيلة بـ Swift للآيفون و Kotlin للأندرويد وفلاتر، إلى جانب إدارة السيرفرات السحابية بـ Docker و Kubernetes على AWS و Azure و Neon PostgreSQL. شريك واحد موثوق لكافة احتياجاتك التقنية.'
      },
      highlights: {
        en: [
          'Unified API contract between web, native iOS, Android, and Flutter',
          'Single centralized backend & microservices architecture',
          'Eliminates friction, finger-pointing, and coordination overhead'
        ],
        ar: [
          'منظومة API موحدة بين بوابات الويب وتطبيقات الجوال وفلاتر',
          'بنية تحتية مركزية واحدة تمنع تضارب البيانات وتكرار التكاليف',
          'القضاء على فوضى التنسيق بين شركات متعددة وضمان سرعة الإنجاز'
        ]
      },
      icon: <Layers className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
    },
    {
      id: 'security-sla',
      category: {
        en: 'Security & Uptime',
        ar: 'الأمان والاستقرار'
      },
      question: {
        en: 'How do you guarantee 99.99% SLA uptime and protect confidential enterprise data?',
        ar: 'كيف تضمنون تشغيلاً بنسبة 99.99% وحماية البيانات المؤسسية الحساسة؟'
      },
      answer: {
        en: 'We engineer enterprise platforms with zero-trust security principles from day one: role-based access control (RBAC), multi-factor biometric authentication, field-level database encryption, and comprehensive immutable audit logging. For cloud reliability, we implement multi-region failover, Redis distributed caching, connection pooling, and automated real-time SRE monitoring.',
        ar: 'نبني منصاتنا المؤسسية وفق مبادئ Zero-Trust الأمنية الصارمة: صلاحيات RBAC دقيقة، تحقق بيومتري متقدم، تشفير البيانات على مستوى الحقول في قواعد البيانات، وسجلات تدقيق غير قابلة للتعديل. لضمان الاستقرار السحابي، نعتمد أنظمة التوزيع الجغرافي، التخزين المؤقت في Redis، والمراقبة الآلية اللحظية 24/7.'
      },
      highlights: {
        en: [
          'Sub-millisecond query caching via Redis In-Memory cluster',
          'Granular RBAC access policies with comprehensive audit trails',
          'Automated CI/CD deployments with zero-downtime rolling updates'
        ],
        ar: [
          'تسريع استعلامات قواعد البيانات لأجزاء من الثانية عبر Redis',
          'نظام صلاحيات وحوكمة دقيق وسجل كامل لعمليات الموظفين',
          'نشر برمجي آمن CI/CD مع تحديثات حية بدون انقطاع الخدمة'
        ]
      },
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
    },
    {
      id: 'speed-velocity',
      category: {
        en: 'Velocity & Delivery',
        ar: 'سرعة التسليم'
      },
      question: {
        en: 'What is your delivery speed and how transparent is the development process?',
        ar: 'ما هي سرعة الإنجاز لديكم ومدى الشفافية خلال مراحل التطوير؟'
      },
      answer: {
        en: 'We work in two-week agile sprints with direct client visibility. You receive access to staging environments, Git progress logs, and a dedicated Slack/Teams communication channel with lead engineers. Most enterprise MVP portals are production-ready in 4 to 8 weeks, backed by clear sprint milestones and contractual SLA guarantees.',
        ar: 'نعمل وفق دورات Agile مدتها أسبوعان مع شفافية مطلقة. يحصل العميل على وصول مباشر لبيئات المعاينة، وسجلات تقدم المشروع، وقنوات تواصل فورية عبر Slack أو Teams مع المهندسين مباشرة. نطلق النسخ الأولية المتقدمة (MVP) خلال 4 إلى 8 أسابيع وفق جداول زمنية دقيقة وضمانات تعاقدية.'
      },
      highlights: {
        en: [
          'Bi-weekly production sprints with interactive live demos',
          'Direct engineer-to-client communication (no bureaucratic middlemen)',
          'Complete IP, documentation, and source code handover upon release'
        ],
        ar: [
          'إصدارات برمجية كل أسبوعين مع استعراض مباشر للميزات الجديدة',
          'تواصل هندسي مباشر وسريع يختصر الوقت ويمنع سوء الفهم',
          'ملكية فكرية كاملة للعميل مع تسليم الأكواد والتوثيق البرمجي الشامل'
        ]
      },
      icon: <Zap className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
    },
    {
      id: 'pricing-clarity',
      category: {
        en: 'Cost & Value',
        ar: 'الشفافية المالية'
      },
      question: {
        en: 'How does your custom software development cost compare to off-the-shelf SaaS subscriptions?',
        ar: 'كيف تقارن تكلفة البرمجيات المخصصة باشتراكات الـ SaaS الجاهزة سنوياً؟'
      },
      answer: {
        en: 'Generic SaaS tools charge recurring per-user licenses that balloon into tens of thousands of dollars annually while locking your workflows into rigid templates. Nexora builds custom, owned software assets with zero recurring per-seat licensing fees. You invest once in proprietary enterprise software that scales infinitely with your business.',
        ar: 'برمجيات SaaS الجاهزة تفرض اشتراكات شهرية متزايدة عن كل مستخدم تكلف الشركات مبالغ طائلة سنوياً مع فرض قوالب جامدة لا تلائم طبيعة عملك. في نيكسورا نبني أصولاً برمجية مملوكة بالكامل لشركتك بدون أي رسوم اشتراك على عدد الموظفين، مما يحقق وفورات مالية ضخمة واستقلالية تشغيلية مطلقة.'
      },
      highlights: {
        en: [
          'Zero recurring per-user licensing fees — own your software outright',
          'Bespoke business workflows tailored 100% to your operational edge',
          'Multi-currency transparent estimation with contractual milestones'
        ],
        ar: [
          'بدون أي اشتراكات شهرية على عدد المستخدمين — ملكية تامة للنظام',
          'حلول مخصصة بنسبة 100% لتتوافق تماماً مع دورة عملك وميزتك التنافسية',
          'تقدير تكلفة شفاف بعملتك المحلية مع دفعات مرتبطة بمراحل الإنجاز'
        ]
      },
      icon: <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
    }
  ];

  const categories = [
    { id: 'all', label: language === 'ar' ? 'كافة المحاور' : 'All Dimensions' },
    { id: 'Engineering Architecture', label: language === 'ar' ? 'الهندسة المعمارية' : 'Engineering Architecture' },
    { id: 'Custom Web ERP (.NET)', label: language === 'ar' ? 'أنظمة ERP مخصصة (.NET)' : 'Custom Web ERP (.NET)' },
    { id: 'Odoo Enterprise', label: language === 'ar' ? 'منظومة Odoo المؤسسية' : 'Odoo Enterprise' },
    { id: 'Full-Stack Delivery', label: language === 'ar' ? 'تطوير شامل متكامل' : 'Full-Stack Delivery' },
    { id: 'Security & Uptime', label: language === 'ar' ? 'الأمان والاستقرار' : 'Security & Uptime' },
    { id: 'Velocity & Delivery', label: language === 'ar' ? 'سرعة الإنجاز' : 'Velocity & Delivery' },
  ];

  const filteredQuestions = activeCategoryFilter === 'all'
    ? questions
    : questions.filter(q => q.category.en === activeCategoryFilter);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="why-us" className="py-24 relative bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-500/10 via-sky-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-sky-400 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
            <span>
              {language === 'ar' ? 'لماذا تختار نيكسورا للأنظمة؟' : 'Why Choose Nexora Systems'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4 font-heading">
            {language === 'ar' ? (
              <>
                هندسة برمجية بواسطة <span className="text-gradient-cyan">كبار المعماريين</span>، بلا وسطاء
              </>
            ) : (
              <>
                Engineered by <span className="text-gradient-cyan">Senior Architects</span>. Delivered Without Compromise.
              </>
            )}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            {language === 'ar'
              ? 'إجابات مباشرة وشفافة لأهم الأسئلة التقنية التي تهم قادة الأعمال ومديري التكنولوجيا قبل بدء مشاريعهم.'
              : 'Direct, substantive answers to the core architectural, operational, and commercial questions enterprise leaders evaluate before partnering with us.'}
          </p>
        </div>

        {/* 7 Distinct Value Summary Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-3.5 mb-14">
          {[
            {
              title: { en: 'Direct Senior Code', ar: 'مهندسون كبار مباشرة' },
              subtitle: { en: 'Zero junior outsourcing', ar: 'بدون تفويض لمبتدئين' },
              icon: <Terminal className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
            },
            {
              title: { en: '100% Custom .NET 9', ar: '.NET 9 مخصص 100%' },
              subtitle: { en: 'Bespoke Web ERPs & APIs', ar: 'أنظمة ERP مخصصة وبدون رسوم' },
              icon: <Code2 className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
            },
            {
              title: { en: 'Odoo Enterprise', ar: 'أنظمة Odoo المؤسسية' },
              subtitle: { en: 'Modules, FastAPI & Sync', ar: 'وحدات مخصصة وجسور FastAPI' },
              icon: <Database className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
            },
            {
              title: { en: 'MSSQL + PostgreSQL', ar: 'تزامن قواعد البيانات' },
              subtitle: { en: 'Real-time CDC data sync', ar: 'مزامنة لحظية بلا فقدان' },
              icon: <Layers className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
            },
            {
              title: { en: 'Native Web & Mobile', ar: 'تطبيقات الويب والجوال' },
              subtitle: { en: 'Next.js 15, Swift, Kotlin', ar: 'Next.js وسويفت وكوتلن' },
              icon: <Cpu className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
            },
            {
              title: { en: '99.99% SLA Uptime', ar: 'استقرار 99.99%' },
              subtitle: { en: 'Zero-trust RBAC security', ar: 'حماية أمنية مشددة' },
              icon: <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
            },
            {
              title: { en: '100% Owned IP', ar: 'ملكية تامة للكود' },
              subtitle: { en: 'Zero per-seat licensing', ar: 'بدون اشتراكات شهرية' },
              icon: <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
            },
          ].map((card, i) => (
            <div
              key={i}
              className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xs text-center flex flex-col items-center justify-between hover:border-indigo-400 dark:hover:border-sky-500/50 transition-all hover:-translate-y-0.5"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center mb-2">
                {card.icon}
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mb-0.5 leading-snug">
                {card.title[language]}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {card.subtitle[language]}
              </div>
            </div>
          ))}
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Deep Substantive Q&A Accordion */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredQuestions.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-white dark:bg-slate-900 border-indigo-500/70 dark:border-indigo-500/60 shadow-md ring-1 ring-indigo-500/20'
                    : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Accordion Question Trigger */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 text-start flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-indigo-600/15 text-indigo-600 dark:text-sky-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {item.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-sky-400 block mb-1">
                        {item.category[language]}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {item.question[language]}
                      </h3>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Expanded Answer Content */}
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                      {item.answer[language]}
                    </p>

                    {/* Technical Proof Highlights */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800/80 space-y-2">
                      <div className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <Code2 className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
                        <span>{language === 'ar' ? 'المعايير الهندسية المضمونة:' : 'Engineering Guarantees:'}</span>
                      </div>
                      {item.highlights[language].map((hl, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Direct CTA */}
        <div className="mt-14 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
            <div className="text-start">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {language === 'ar' ? 'هل لديك مواصفات تقنية خاصة لنظامك؟' : 'Have a unique architectural challenge or ERP requirement?'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'تحدث مباشرة مع كبار مهندسينا لمناقشة المتطلبات وقواعد البيانات' : 'Speak directly with our senior software architects today.'}
              </div>
            </div>
            <a
              href="#contact"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm shrink-0 cursor-pointer"
            >
              <span>{language === 'ar' ? 'استشارة مع مهندس رئيسي' : 'Consult a Principal Architect'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

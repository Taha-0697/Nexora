import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Bot,
  ArrowRight,
  Calculator,
  Database,
  BrainCircuit,
  Workflow
} from 'lucide-react';
import { RelatedServiceCaseStudies } from '../common/RelatedServiceCaseStudies';

interface AiAndAgentsPageProps {
  onOpenQuote: () => void;
  onNavigateToEstimator: () => void;
}

export const AiAndAgentsPage: React.FC<AiAndAgentsPageProps> = ({
  onOpenQuote,
  onNavigateToEstimator,
}) => {
  const { language } = useLanguage();

  return (
    <div className="pt-24 pb-20 overflow-hidden">
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 section-surface-1">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-500/30 text-xs font-semibold text-cyan-700 dark:text-cyan-400 mb-6 shadow-xs">
            <Bot className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'أنظمة الذكاء الاصطناعي والوكلاء المستقلون' : 'Autonomous AI Agents & Enterprise LLM Workflows'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mb-6 font-heading">
            {language === 'ar' ? (
              <>
                حلول <span className="text-gradient-cyan">الذكاء الاصطناعي التوليدي</span> والوكلاء المستقلون للأعمال
              </>
            ) : (
              <>
                AI Integrations, LLMs & <span className="text-gradient-cyan">Agentic Automation</span>
              </>
            )}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl max-w-3xl leading-relaxed mb-8">
            {language === 'ar'
              ? 'حوّل عمليات شركتك إلى سير عمل ذكي ووكلاء تنفيذ ذاتيين مبنيين على أحدث نماذج اللغات (LLMs)، وأنابيب الاسترجاع المعزز بالتوليد (RAG)، وقواعد بيانات المتجهات الفائقة السرعة.'
              : 'Empower your enterprise with autonomous multi-agent systems, secure private RAG pipelines, fine-tuned domain models, and self-executing business workflows powered by LangGraph, LlamaIndex, and pgvector.'}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onNavigateToEstimator}
              className="px-6 py-3.5 rounded-xl btn-primary-cta text-white font-extrabold text-sm tracking-wide flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>{language === 'ar' ? 'احسب تكلفة حلول الذكاء الاصطناعي' : 'Calculate AI Project Cost'}</span>
            </button>

            <button
              onClick={onOpenQuote}
              className="px-6 py-3.5 rounded-xl btn-secondary-outline text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'ar' ? 'استشارة مع مهندس الذكاء الاصطناعي' : 'Consult Lead AI Architect'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-surface-2">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            {language === 'ar' ? 'الهندسة العميقة للذكاء الاصطناعي' : 'Production-Ready Enterprise AI Engineering'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 font-heading">
            {language === 'ar' ? 'ركائز هندسة الذكاء الاصطناعي' : 'Key AI Architecture Pillars'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: BrainCircuit,
              title: language === 'ar' ? 'أنابيب RAG المتقدمة' : 'Enterprise RAG Pipelines',
              desc: language === 'ar'
                ? 'استرجاع فائق الدقة من بيانات شركتك الحساسة مع عزل أمني تام وقواعد بيانات المتجهات pgvector و Qdrant.'
                : 'Sub-second semantic search over enterprise documentation, ERP data, and contracts with strict ACL security and zero data leakage.'
            },
            {
              icon: Workflow,
              title: language === 'ar' ? 'وكلاء المهام المستقلون' : 'Multi-Agent Orchestration',
              desc: language === 'ar'
                ? 'سير عمل متعدد الوكلاء مبني على LangGraph لتنفيذ المهام المعقدة كالتحقق المحاسبي وتدقيق العقود آلياً.'
                : 'Autonomous multi-agent loops that verify ERP entries, triage customer tickets, and execute multi-step reconciliation.'
            },
            {
              icon: Database,
              title: language === 'ar' ? 'استضافة محلية ونماذج مخصصة' : 'Private & Local LLM Deployments',
              desc: language === 'ar'
                ? 'تشغيل النماذج داخل سحابتك الخاصة (vLLM / Ollama) متوافقة 100% مع تشريعات سرية البيانات دون اتصال خارجي.'
                : 'Self-hosted LLM clusters inside your VPC ensuring 100% data residency, zero third-party telemetry, and SOC2 compliance.'
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 shadow-xs group"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6 group-hover:scale-105 transition-transform">
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
        serviceField="AI Integrations, LLMs & Agentic Automation"
        onOpenQuote={onOpenQuote}
      />
    </div>
  );
};

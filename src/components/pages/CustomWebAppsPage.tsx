import React from 'react';
import {
  Globe2,
  Zap,
  ArrowRight,
  Calculator,
  Sparkles,
  Server,
  Cpu
} from 'lucide-react';
import { RelatedServiceCaseStudies } from '../common/RelatedServiceCaseStudies';

interface CustomWebAppsPageProps {
  onOpenQuote: () => void;
  onNavigateToEstimator: () => void;
}

export const CustomWebAppsPage: React.FC<CustomWebAppsPageProps> = ({
  onOpenQuote,
  onNavigateToEstimator
}) => {
  return (
    <div className="pt-24 pb-20 overflow-hidden">
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 section-surface-1">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold text-blue-700 dark:text-sky-400 mb-6 shadow-xs">
            <Globe2 className="w-3.5 h-3.5" />
            <span>High-Throughput Web Portals & REST APIs</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mb-6 font-heading">
            Custom Web Applications & <span className="text-gradient-cyan">Scalable API Ecosystems</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl max-w-3xl leading-relaxed mb-8">
            Engineered with React 19, Next.js 15, and high-concurrency Node.js / ASP.NET microservices. We build blazing-fast enterprise B2B portals, customer self-service portals, and secure RESTful gateways with millisecond latency.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onNavigateToEstimator}
              className="px-6 py-3.5 rounded-xl btn-primary-cta text-white font-extrabold text-sm tracking-wide flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Web Portal Cost</span>
            </button>

            <button
              onClick={onOpenQuote}
              className="px-6 py-3.5 rounded-xl btn-secondary-outline text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <span>Speak with Lead Full-Stack Architect</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Core Architectural Highlights */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-surface-2">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">
            Enterprise Grade Full-Stack Standards
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 font-heading">
            Engineered for Million-User Concurrency
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Server-Side Rendered Next.js 15 Frontends',
              desc: 'Sub-second first contentful paint (FCP), automated code-splitting, and streaming React Server Components for enterprise-grade performance.',
              icon: <Zap className="w-5 h-5 text-blue-600 dark:text-sky-400" />
            },
            {
              title: 'Stateless RESTful & GraphQL Microservices',
              desc: 'Robust JWT / OAuth2 security, rate-limiting, OpenAPI / Swagger documentation, and distributed Redis session caching.',
              icon: <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            },
            {
              title: 'Relational ACID Databases & Read Replicas',
              desc: 'High-availability PostgreSQL & MSSQL cluster topologies with connection pooling and automated failover.',
              icon: <Cpu className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-blue-500/40 transition-all hover:-translate-y-1"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 font-heading">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Related Case Studies for Custom Web Apps & REST APIs */}
        <div className="mt-16">
          <RelatedServiceCaseStudies
            serviceField="Custom Web Apps & REST APIs"
            onOpenQuote={onOpenQuote}
          />
        </div>

        {/* CTA Banner */}
        <div className="mt-16 glass-panel p-8 sm:p-12 rounded-3xl border border-blue-200 dark:border-blue-500/40 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modernize Your Customer & Internal Facing Web Portals</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            Ready to Launch a Bespoke Web Application?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Configure your technical scope, expected concurrent user load, and API integrations in our interactive estimator or request a formal engineering proposal.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onNavigateToEstimator}
              className="px-6 py-3.5 rounded-xl btn-primary-cta text-white font-extrabold text-sm tracking-wide flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Open Cost Estimator</span>
            </button>

            <button
              onClick={onOpenQuote}
              className="px-6 py-3.5 rounded-xl btn-secondary-outline text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <span>Request Engineering Proposal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

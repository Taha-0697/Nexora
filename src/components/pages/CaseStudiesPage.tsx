import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Building2,
  Layers,
  Calculator,
  ExternalLink,
  Calendar
} from 'lucide-react';
import {
  getCaseStudies,
  SERVICE_FIELDS,
  B2B_SECTIONS_EVENT,
  type CaseStudy
} from '../../services/b2bSectionsService';

interface CaseStudiesPageProps {
  onOpenQuote: (prefill?: any) => void;
  onNavigateToEstimator: () => void;
}

export const CaseStudiesPage: React.FC<CaseStudiesPageProps> = ({
  onOpenQuote,
  onNavigateToEstimator
}) => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeModalStudy, setActiveModalStudy] = useState<CaseStudy | null>(null);

  const loadData = useCallback(() => {
    setCaseStudies(getCaseStudies());
  }, []);

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener(B2B_SECTIONS_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(B2B_SECTIONS_EVENT, handleUpdate);
    };
  }, [loadData]);

  const filteredCaseStudies = selectedFilter === 'all'
    ? caseStudies
    : caseStudies.filter(cs => cs.serviceField === selectedFilter);

  return (
    <div className="pt-24 pb-20 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 section-surface-1">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-sky-400 mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Proven Enterprise Operational Deliverables</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mb-6 font-heading">
            Real Projects, Real <span className="text-gradient-cyan">Operational Outcomes</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl max-w-3xl leading-relaxed mb-8">
            Explore verified engineering achievements delivered by Nexora Systems across bespoke .NET 9 Web ERPs, bidirectional Odoo 17 pipelines, native mobile telematics, and zero-downtime database migrations.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onOpenQuote({ serviceName: 'Enterprise Case Study Architecture' })}
              className="px-6 py-3.5 rounded-xl btn-primary-cta text-white font-extrabold text-sm tracking-wide flex items-center gap-2 cursor-pointer"
            >
              <span>Discuss Your System Architecture</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateToEstimator}
              className="px-6 py-3.5 rounded-xl btn-secondary-outline text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Open Scope & Cost Estimator</span>
            </button>
          </div>

        </div>
      </section>

      {/* Main Content & Filterable Case Studies Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-surface-2">
        
        {/* Service Field Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mr-2 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by Field:</span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-[#0E1526] text-slate-700 dark:text-slate-300 hover:border-indigo-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            All Case Studies ({caseStudies.length})
          </button>

          {SERVICE_FIELDS.map(field => {
            const count = caseStudies.filter(cs => cs.serviceField === field).length;
            const isSelected = selectedFilter === field;
            return (
              <button
                key={field}
                type="button"
                onClick={() => setSelectedFilter(field)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white dark:bg-[#0E1526] text-slate-700 dark:text-slate-300 hover:border-indigo-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>{field}</span>
                {count > 0 && <span className="ml-1.5 opacity-70">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Case Studies Grid */}
        {filteredCaseStudies.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Layers className="w-10 h-10 text-indigo-500 mx-auto opacity-40" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              No case studies found for this service field
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Our engineering team publishes new production retrospectives regularly. Contact our solutions architects to receive private enterprise case study briefs for this capability.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCaseStudies.map(cs => (
              <div
                key={cs.id}
                className="glass-panel rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  {/* Preview Image */}
                  <div className="relative h-52 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                    <img
                      src={cs.imageUrl}
                      alt={cs.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="absolute top-3.5 left-3.5">
                      <span className="px-2.5 py-1 rounded-md bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-[10px] font-mono font-bold uppercase text-indigo-700 dark:text-sky-300 border border-indigo-200 dark:border-indigo-500/30">
                        {cs.serviceField}
                      </span>
                    </div>

                    {cs.client && (
                      <div className="absolute bottom-3 left-3 text-white text-[11px] font-mono">
                        Client: <strong className="text-sky-300">{cs.client}</strong>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-sky-400 block truncate">
                      {cs.categoryTag}
                    </span>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
                      {cs.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {cs.summary}
                    </p>

                    {/* Measured Outcome Highlight Box */}
                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-slate-800 dark:text-slate-200 font-medium leading-snug">
                        {cs.outcomeHighlight}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalStudy(cs)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    <span>Read Full Architecture Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {cs.serviceField === 'Proprietary Suite' || cs.isProprietary ? (
                    <button
                      type="button"
                      onClick={() => onOpenQuote({
                        serviceName: 'Proprietary Suite',
                        isLiveDemo: true,
                        productName: cs.demoProductName || cs.title
                      })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:scale-[1.02] cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Free Live Demo</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenQuote({ serviceName: cs.serviceField, caseStudy: cs.title })}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                      title="Request similar engineering proposal"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* Case Study Full Architecture Modal */}
      {activeModalStudy && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl rounded-3xl glass-panel bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-sky-400 block mb-1">
                  {activeModalStudy.categoryTag} • {activeModalStudy.serviceField}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight font-heading">
                  {activeModalStudy.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> Client: <strong className="text-slate-800 dark:text-slate-200">{activeModalStudy.client}</strong>
                  </span>
                  <span>•</span>
                  <span>Industry: {activeModalStudy.industry}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalStudy(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden h-64 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <img
                src={activeModalStudy.imageUrl}
                alt={activeModalStudy.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                Operational Problem & Nexora Technical Solution:
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeModalStudy.summary}
              </p>

              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase text-indigo-700 dark:text-sky-300">
                  Verified Operational Impact:
                </span>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  ✓ {activeModalStudy.outcomeHighlight}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveModalStudy(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Close Retrospective
              </button>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
                {(activeModalStudy.serviceField === 'Proprietary Suite' || activeModalStudy.isProprietary) && (
                  <button
                    type="button"
                    onClick={() => {
                      const study = activeModalStudy;
                      setActiveModalStudy(null);
                      onOpenQuote({
                        serviceName: 'Proprietary Suite',
                        isLiveDemo: true,
                        productName: study.demoProductName || study.title
                      });
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Free Live Demo</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const study = activeModalStudy;
                    setActiveModalStudy(null);
                    onOpenQuote({ serviceName: study.serviceField, caseStudy: study.title });
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-primary-cta text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Request Custom Architecture Proposal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, CheckCircle2, Layers } from 'lucide-react';
import {
  getCaseStudiesByService,
  B2B_SECTIONS_EVENT,
  type CaseStudy,
  type ServiceField
} from '../../services/b2bSectionsService';

interface RelatedServiceCaseStudiesProps {
  serviceField: ServiceField;
  onOpenQuote?: (prefill?: any) => void;
}

export const RelatedServiceCaseStudies: React.FC<RelatedServiceCaseStudiesProps> = ({
  serviceField,
  onOpenQuote
}) => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);

  const loadData = useCallback(() => {
    setCaseStudies(getCaseStudiesByService(serviceField));
  }, [serviceField]);

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

  if (caseStudies.length === 0) return null;

  return (
    <section className="py-16 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-500/30 text-xs font-mono font-bold text-indigo-700 dark:text-sky-300 mb-2 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Production Retrospectives</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
              Related Case Studies in {serviceField}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Real architecture implementations and measurable ROI delivered for enterprise clients in this field.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map(cs => (
            <div
              key={cs.id}
              className="glass-panel rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col justify-between hover:border-indigo-500/40 hover:shadow-lg transition-all group"
            >
              <div>
                <div className="relative h-48 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <img
                    src={cs.imageUrl}
                    alt={cs.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-indigo-700 dark:text-sky-300 border border-indigo-200 dark:border-indigo-500/30">
                      {cs.categoryTag}
                    </span>
                  </div>

                  {cs.client && (
                    <div className="absolute bottom-2.5 left-3 text-white text-[11px] font-mono">
                      Client: <strong className="text-sky-300">{cs.client}</strong>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
                    {cs.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {cs.summary}
                  </p>

                  <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-800 dark:text-slate-200 font-medium leading-snug">
                      {cs.outcomeHighlight}
                    </span>
                  </div>
                </div>
              </div>

              {onOpenQuote && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => onOpenQuote({ serviceName: serviceField, caseStudy: cs.title })}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    <span>Request Similar Engineering Solution</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

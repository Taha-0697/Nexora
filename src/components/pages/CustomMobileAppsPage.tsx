import React from 'react';
import {
  Smartphone,
  Zap,
  ArrowRight,
  Calculator,
  Sparkles,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { RelatedServiceCaseStudies } from '../common/RelatedServiceCaseStudies';

interface CustomMobileAppsPageProps {
  onOpenQuote: () => void;
  onNavigateToEstimator: () => void;
}

export const CustomMobileAppsPage: React.FC<CustomMobileAppsPageProps> = ({
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
            <Smartphone className="w-3.5 h-3.5" />
            <span>Native iOS, Android & Cross-Platform Flutter</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mb-6 font-heading">
            Enterprise Mobile Apps Built for <span className="text-gradient-cyan">Mission-Critical Telemetry</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl max-w-3xl leading-relaxed mb-8">
            Engineered with Swift for iOS, Kotlin for Android, and enterprise Flutter for unified cross-platform rollouts. Offline-first synchronization, background GPS telematics, secure biometric authentication, and seamless ERP integration.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onNavigateToEstimator}
              className="px-6 py-3.5 rounded-xl btn-primary-cta text-white font-extrabold text-sm tracking-wide flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Mobile App Cost</span>
            </button>

            <button
              onClick={onOpenQuote}
              className="px-6 py-3.5 rounded-xl btn-secondary-outline text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <span>Speak with Lead Mobile Engineer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-surface-2">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">
            Native & Cross-Platform Mobile Standards
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 font-heading">
            Engineered for Field Operations & Consumer Scale
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Offline-First SQLite & WatermelonDB Sync',
              desc: 'Seamless data entry for drivers, field technicians, and sales reps with automatic conflict resolution when connection is restored.',
              icon: <Zap className="w-5 h-5 text-blue-600 dark:text-sky-400" />
            },
            {
              title: 'Native Biometrics & Keychain Encryption',
              desc: 'Hardware-backed Apple Secure Enclave & Android Keystore tokenization protecting sensitive enterprise credentials.',
              icon: <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            },
            {
              title: 'Automated CI/CD App Store & Play Store Pipelines',
              desc: 'Continuous integration using Fastlane, automated unit testing, and instant staging builds distributed via Firebase / TestFlight.',
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

        {/* Related Case Studies for Custom Mobile Apps */}
        <div className="mt-16">
          <RelatedServiceCaseStudies
            serviceField="Custom Mobile Apps (iOS, Android & Flutter)"
            onOpenQuote={onOpenQuote}
          />
        </div>

        {/* Live CTA Banner */}
        <div className="mt-16 glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-sky-300 border border-blue-500/20 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Field Proven Native & Flutter Architecture</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            Deploy Mobile Excellence to the App Stores
          </h3>

          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Estimate your mobile development timeline, feature list, and target platform matrix directly in our estimator or request an engineering consultation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onNavigateToEstimator}
              className="px-6 py-3.5 rounded-xl btn-primary-cta text-white font-extrabold text-sm tracking-wide flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Open Mobile App Estimator</span>
            </button>

            <button
              onClick={onOpenQuote}
              className="px-6 py-3.5 rounded-xl btn-secondary-outline text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <span>Request Mobile Scope</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

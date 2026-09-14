import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Terminal, 
  Server, 
  Database, 
  Smartphone, 
  Globe, 
  Cpu 
} from 'lucide-react';

export const TechStack: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'erp' | 'web' | 'mobile' | 'cloud' | 'cms'>('erp');

  const categories = [
    {
      id: 'erp',
      name: { en: 'Custom ERP & Odoo', ar: 'أنظمة ERP وأودو' },
      icon: <Database className="w-4 h-4" />,
      items: [
        { name: 'Odoo 16 / 17 Enterprise', role: 'Accounting, Supply Chain, Manufacturing, POS', badge: 'Certified' },
        { name: 'Python Backend Engine', role: 'Custom Business Logic & Workflow Algorithms', badge: 'Core' },
        { name: 'PostgreSQL Database', role: 'High-Concurrency ACID Relational Persistence', badge: 'High Throughput' },
        { name: 'XML-RPC & REST Connectors', role: 'Seamless Integration with 3rd Party CRMs & Banks', badge: 'API' },
        { name: 'Redis Cache Layer', role: 'Sub-Millisecond Query & Session Accelerators', badge: 'In-Memory' },
        { name: 'QWeb & Custom Reports', role: 'Fiscal Electronic Invoicing & Audit Templates', badge: 'Compliance' },
      ]
    },
    {
      id: 'web',
      name: { en: 'Custom Web Portals', ar: 'بوابات الويب المخصصة' },
      icon: <Globe className="w-4 h-4" />,
      items: [
        { name: 'React 19 & Next.js', role: 'High-Performance Server & Client Portals', badge: 'Fast / Modern' },
        { name: 'TypeScript Strict', role: 'Zero-Defect Enterprise Code Architecture', badge: 'Type Safe' },
        { name: 'Python FastAPI & Django', role: 'Microservice Architectures Handling 50k+ QPS', badge: 'Backend' },
        { name: 'Node.js & NestJS', role: 'High-Velocity Scalable Enterprise APIs', badge: 'Enterprise' },
        { name: 'Tailwind CSS Modern', role: 'Pixel-Perfect Responsive & Clean UIs', badge: 'Design' },
        { name: 'GraphQL & WebSockets', role: 'Real-Time Streaming Telemetry & Low-Latency Feeds', badge: 'Realtime' },
      ]
    },
    {
      id: 'mobile',
      name: { en: 'Custom Mobile Apps', ar: 'تطبيقات الجوال المخصصة' },
      icon: <Smartphone className="w-4 h-4" />,
      items: [
        { name: 'Flutter & Dart', role: 'Single-Codebase 60FPS Cross-Platform Applications', badge: 'High Velocity' },
        { name: 'Native iOS (Swift & SwiftUI)', role: 'Hardware-Optimized Apple Silicon Experiences', badge: 'iOS Native' },
        { name: 'Native Android (Kotlin)', role: 'Modern Jetpack Compose & Background Services', badge: 'Android Native' },
        { name: 'Biometric Keychain', role: 'FaceID, TouchID & HSM Secure Enclave Storage', badge: 'Bank-Grade' },
        { name: 'Offline Sync Engines', role: 'Encrypted SQLite & Realm Local Database Synchronization', badge: 'Offline First' },
        { name: 'Firebase & Push Messaging', role: 'Real-Time Notifications, Telemetry & Analytics', badge: 'Cloud' },
      ]
    },
    {
      id: 'cloud',
      name: { en: 'Cloud & DevOps 24/7', ar: 'السحابة وإدارة السيرفرات' },
      icon: <Server className="w-4 h-4" />,
      items: [
        { name: 'AWS & Azure Cloud', role: 'Multi-Region High-Availability Infrastructure', badge: 'Tier 4 SLA' },
        { name: 'Ubuntu & RedHat Linux', role: 'Bare-Metal & Virtual Kernel Hardening', badge: 'OS Core' },
        { name: 'Kubernetes (K8s)', role: 'Container Orchestration & Auto-Scaling', badge: 'Zero-Downtime' },
        { name: 'Docker & Microservices', role: 'Immutable Application Packaging', badge: 'DevOps' },
        { name: 'Terraform & Ansible', role: 'Declarative Infrastructure as Code (IaC)', badge: 'Automation' },
        { name: 'Prometheus & Grafana', role: 'Sub-Second Real-Time Telemetry & Alerting', badge: '24/7 SRE' },
      ]
    },
    {
      id: 'cms',
      name: { en: 'Headless Portals & E-Commerce', ar: 'البوابات الرقمية والتجارة' },
      icon: <Cpu className="w-4 h-4" />,
      items: [
        { name: 'Custom WP Themes', role: 'Gutenberg Blocks without Bloated Heavy Builders', badge: '98+ PageSpeed' },
        { name: 'WooCommerce Scaling', role: 'Multi-Currency, High-Volume Inventory Checkout', badge: 'E-Commerce' },
        { name: 'PHP 8.3 Strict Engine', role: 'Modern OOP, Security Hardening & Strict Typing', badge: 'Performance' },
        { name: 'Cloudflare Edge CDN', role: 'Global Caching & Automated Bot Scraping Shields', badge: 'Edge Security' },
        { name: 'Custom ERP Sync Plugins', role: 'Direct ERP Synchro & Payment Gateway Adapters', badge: 'Custom Code' },
        { name: 'Headless Architecture', role: 'Next.js Frontend Decoupled from CMS Content Engine', badge: 'Headless' },
      ]
    },
  ];

  const currentCategory = categories.find(c => c.id === activeTab) || categories[0];

  return (
    <section id="tech-stack" className="py-24 relative bg-slate-50 dark:bg-dark-900/40 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-sky-400 mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>{t('tech.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('tech.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            {t('tech.sub')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === cat.id
                  ? 'bg-indigo-600 dark:bg-sky-500 text-white dark:text-dark-950 font-bold shadow-md shadow-indigo-600/20 dark:shadow-sky-500/20 scale-105'
                  : 'bg-white dark:bg-dark-800/80 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-700 border border-slate-200 dark:border-slate-700/60'
              }`}
            >
              {cat.icon}
              <span>{cat.name[language]}</span>
            </button>
          ))}
        </div>

        {/* Technology Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCategory.items.map((tech, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-sky-500/40 transition-all group hover:-translate-y-1 shadow-sm hover:shadow-md bg-white dark:bg-dark-900/60"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
                  {tech.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-950 text-indigo-700 dark:text-sky-300 border border-slate-200 dark:border-indigo-500/30 font-semibold">
                  {tech.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {tech.role}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

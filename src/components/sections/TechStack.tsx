import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Terminal,
  Server,
  Database,
  Smartphone,
  Globe,
  Cpu,
  Layers
} from 'lucide-react';

export const TechStack: React.FC = () => {
  const { language, t } = useLanguage();
<<<<<<< HEAD
  const [selectedTabs, setSelectedTabs] = useState<string[]>(['dotnet-erp']);
  const [extraCategories, setExtraCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [showAdminControls, setShowAdminControls] = useState(false);
  const categories = [
    {
      id: 'dotnet-erp',
      name: { en: '.NET Enterprise ERP', ar: 'أنظمة .NET Enterprise ERP' },
      icon: <Database className="w-4 h-4" />,
      items: [
        { name: '.NET Core Web API', role: 'High-Throughput C# Microservice Endpoints & Domain Business Logic', badge: '.NET Core' },
        { name: 'Microsoft SQL Server (MSSQL)', role: 'Enterprise ACID Transactions, High-Concurrency Indexing', badge: 'MSSQL DB' },
=======
  const [selectedTabs, setSelectedTabs] = useState<string[]>(['erp']);
  const [extraCategories, setExtraCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const categories = [
    {
      id: 'erp',
      name: { en: 'Custom ERP (.NET & MSSQL)', ar: 'أنظمة ERP مخصصة (.NET & MSSQL)' },
      icon: <Database className="w-4 h-4" />,
      items: [
        { name: '.NET Core Web API', role: 'High-Throughput C# Microservice Endpoints & Business Logic', badge: 'High Velocity' },
        { name: 'Microsoft SQL Server (MSSQL)', role: 'Enterprise ACID Transactions, High-Concurrency Indexing', badge: 'Primary DB' },
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
        { name: 'React 19 & Next.js 15', role: 'Reactive Administrative Portals & SSR Executive Dashboards', badge: 'Frontend' },
        { name: 'REST & GraphQL APIs', role: 'Seamless Integration with Banks, Customs & Logistics Partners', badge: 'Integrations' },
        { name: 'Redis In-Memory Cache', role: 'Sub-Millisecond Query Response & Session Storage', badge: 'In-Memory' },
        { name: 'Role-Based RBAC & Audit', role: 'Granular Access Policies, Action Logging & Compliance', badge: 'Security' },
      ]
    },
    {
<<<<<<< HEAD
      id: 'odoo-erp',
      name: { en: 'Odoo Enterprise & Python', ar: 'أنظمة Odoo Enterprise و بايثون' },
      icon: <Terminal className="w-4 h-4" />,
      items: [
        { name: 'Odoo Enterprise Customization', role: 'Custom Python Modules, Accounting, Multi-Company Ledgers & Invoicing', badge: 'Odoo' },
        { name: 'Python Backend Bridges & APIs', role: 'High-Concurrency FastAPI & Python 3.12 Services, XML-RPC & Event Buses', badge: 'Python Core' },
        { name: 'PostgreSQL / MSSQL Data Sync', role: 'Bi-Directional Real-Time CDC Replication & Zero-Loss Data Pipelines', badge: 'Data Sync' },
        { name: 'Automated E-Invoicing & VAT', role: 'ZATCA & GCC Tax Compliance, Automated Financial Statements', badge: 'Compliance' },
        { name: 'Warehouse & Inventory Automation', role: 'Barcode Systems, Multi-Location Stock Allocation & POS', badge: 'Operations' },
        { name: 'Odoo REST API Connectors', role: 'Microservice Bridges Connecting Odoo to Custom Web Portals', badge: 'Integration' },
      ]
    },
    {
=======
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
      id: 'web',
      name: { en: 'Custom Web Portals & SaaS', ar: 'بوابات الويب المخصصة ومنصات SaaS' },
      icon: <Globe className="w-4 h-4" />,
      items: [
        { name: 'React.js & Next.js', role: 'Server-Side Rendered & Dynamic Enterprise Web Apps', badge: 'Modern Stack' },
        { name: 'Node.js & NestJS', role: 'Event-Driven Asynchronous Microservices & REST APIs', badge: 'Backend' },
        { name: 'TypeScript Strict', role: 'Zero-Defect Enterprise Code Quality & Type Safety', badge: 'Type Safe' },
        { name: 'Tailwind CSS Modern', role: 'Responsive, Eye-Friendly Design System & Clean Aesthetics', badge: 'UI / UX' },
        { name: 'Real-Time WebSockets', role: 'Live Fleet Telemetry, Streaming Notifications & Chat', badge: 'Realtime' },
        { name: 'PostgreSQL & MSSQL', role: 'Robust Relational Persistence & Distributed Sharding', badge: 'Database' },
      ]
    },
    {
      id: 'mobile',
      name: { en: 'Custom Mobile (iOS & Android)', ar: 'تطبيقات الجوال (iOS و Android)' },
      icon: <Smartphone className="w-4 h-4" />,
      items: [
        { name: 'Native iOS (Swift & SwiftUI)', role: 'Hardware-Accelerated Apple Enclave & Fluid Interfaces', badge: 'iOS Native' },
        { name: 'Native Android (Kotlin)', role: 'Modern Jetpack Compose & Resilient Background Sync', badge: 'Android Native' },
        { name: 'Flutter & Dart', role: 'Single-Codebase 60FPS Cross-Platform Applications', badge: 'High Velocity' },
        { name: 'Biometric Auth & Apple Pay', role: 'FaceID, TouchID, Secure Keychain & Digital Wallets', badge: 'Fintech' },
        { name: 'Offline-First SQLite / Realm', role: 'Local Encrypted Storage & Automatic Background Sync', badge: 'Offline First' },
        { name: 'REST API Mobile Gateway', role: 'Optimized Mobile Payloads, Push Notifications & Telemetry', badge: 'Mobile API' },
      ]
    },
    {
      id: 'ai',
      name: { en: 'AI & LLM Integrations', ar: 'تكاملات الذكاء الاصطناعي (AI)' },
      icon: <Cpu className="w-4 h-4" />,
      items: [
        { name: 'OpenAI & Claude APIs', role: 'Context-Aware Generative Pipelines & Reasoning Chains', badge: 'LLM Core' },
        { name: 'Retrieval-Augmented Gen (RAG)', role: 'Custom Document Search & Vector Databases (pgvector/Pinecone)', badge: 'RAG Search' },
        { name: 'Autonomous Workflow Agents', role: 'Automated Ticket Triage, Inbound Lead Qualification', badge: 'Agentic' },
        { name: 'Intelligent OCR & Parsing', role: 'Automated Invoice, Receipt & Contract Data Extraction', badge: 'Automation' },
        { name: '.NET & Next.js AI Connectors', role: 'Direct Native Embedding into Corporate ERP & Web Portals', badge: 'Full Stack' },
        { name: 'Natural Language SQL Querying', role: 'Ask plain English/Arabic questions to query MSSQL data', badge: 'Analytics' },
      ]
    },
    {
      id: 'cloud',
      name: { en: 'Cloud & DevOps 24/7', ar: 'السحابة وإدارة السيرفرات 24/7' },
      icon: <Server className="w-4 h-4" />,
      items: [
        { name: 'AWS & Azure Cloud', role: 'Multi-Region High-Availability Infrastructure', badge: 'Tier 4 SLA' },
        { name: 'Kubernetes (K8s) Orchestration', role: 'Automated Container Scaling & Zero-Downtime Rolling Deploys', badge: 'Zero-Downtime' },
        { name: 'Docker & Microservices', role: 'Containerized Packaging & Environment Parity', badge: 'DevOps' },
        { name: 'Linux Server Hardening', role: 'Kernel Tuning, SSL, Reverse Proxies & DDoS Protection', badge: 'Hardened' },
        { name: 'Terraform Infrastructure (IaC)', role: 'Declarative Cloud Provisioning & Disaster Recovery', badge: 'Automation' },
        { name: 'Prometheus & Grafana SRE', role: 'Sub-Second Real-Time Telemetry & 24/7 Incident On-Call', badge: '24/7 SRE' },
      ]
    },
    {
      id: 'odoo',
      name: { en: 'Bespoke Enterprise Systems', ar: 'حلول مؤسسية وتكاملات مخصصة' },
      icon: <Layers className="w-4 h-4" />,
      items: [
        { name: 'Custom ERP Modules', role: 'Tailored Business Workflows, Inventory, Financials & HR Models', badge: 'Enterprise' },
        { name: 'Enterprise Python & Node.js Services', role: 'Bespoke Automation Workflows, Pipelines & Microservices', badge: 'Custom Code' },
        { name: 'PostgreSQL & Enterprise DBs', role: 'High-Concurrency Relational Persistence & Secure Sharding', badge: 'Database' },
        { name: 'Bi-Directional REST Bridges', role: 'Seamless Data Exchange Between ERPs, .NET APIs & Web Portals', badge: 'API Bridge' },
        { name: 'ZATCA & GCC VAT Invoicing', role: 'Tax Compliance, Phase-2 Cryptographic Stamps & QR Automation', badge: 'VAT Compliant' },
        { name: 'Automated Logistics & Barcode', role: 'Mobile Warehouse Picking, RFID & Live Stock Synchronization', badge: 'Logistics' },
      ]
    },
  ];

  const displayedItems = selectedTabs.flatMap((tabId) => {
    const cat = [...categories, ...extraCategories].find((c) => c.id === tabId);
    return cat?.items ?? [];
  });

  return (
    <section id="tech-stack" className="py-20 relative bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-sky-400 mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>{t('tech.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('tech.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            {language === 'ar'
              ? 'ترسانة تقنية حديثة ومختبرة في كبرى المؤسسات. نركز على الأنظمة المخصصة بالكامل بـ .NET Core و Next.js و React و MSSQL وتطبيقات الجوال بـ Swift و Kotlin و Flutter، مع حلول الذكاء الاصطناعي والتكامل المؤسسي.'
              : 'Our battle-tested stack focuses on custom engineered architectures: .NET Core Web APIs, Next.js, React, Node.js, MSSQL databases, native Swift & Kotlin apps, Flutter, AI integrations, and bespoke enterprise systems.'}
          </p>
        </div>
<<<<<<< HEAD
        {/* Optional Admin/Dev Category Management (Hidden by default for pristine client view) */}
        {showAdminControls && (
          <div className="flex items-center gap-2 mb-6 justify-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs max-w-md mx-auto">
            <input
              type="text"
              placeholder="New category name"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
            />
            <button
              onClick={() => {
                const name = newCatName.trim();
                if (!name) return;
                const id = name.toLowerCase().replace(/\s+/g, '-');
                const newCat = {
                  id,
                  name: { en: name, ar: name },
                  icon: <Terminal className="w-4 h-4" />,
                  items: []
                };
                setExtraCategories([...extraCategories, newCat]);
                setNewCatName('');
              }}
              className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition cursor-pointer"
            >
              Add Category
            </button>
          </div>
        )}
=======
        {/* Add New Category Form */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          <input
            type="text"
            placeholder="New category name"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="px-3 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => {
              const name = newCatName.trim();
              if (!name) return;
              const id = name.toLowerCase().replace(/\s+/g, '-');
              const newCat = {
                id,
                name: { en: name, ar: '' },
                icon: <Terminal className="w-4 h-4" />,
                items: []
              };
              setExtraCategories([...extraCategories, newCat]);
              setNewCatName('');
            }}
            className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >Add Category</button>
        </div>
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[...categories, ...extraCategories].map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setSelectedTabs((prev) =>
                  prev.includes(cat.id) ? prev.filter((id) => id !== cat.id) : [...prev, cat.id]
                )
              }
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${selectedTabs.includes(cat.id)
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60'
                }`}
            >
              {cat.icon}
              <span>{cat.name[language]}</span>
            </button>
          ))}
        </div>

        {/* Technology Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((tech, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-sky-500/40 transition-all group hover:-translate-y-1 shadow-xs hover:shadow-md bg-white dark:bg-slate-900/60"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
                  {tech.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700 font-semibold">
                  {tech.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {tech.role}
              </p>
            </div>
          ))}
        </div>

<<<<<<< HEAD
        {/* Subtle Category Customization Toggle (Dev/Admin) */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setShowAdminControls(!showAdminControls)}
            className="text-[11px] font-mono text-slate-400 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
          >
            {showAdminControls ? '— Hide Stack Customizer' : '+ Configure Custom Categories'}
          </button>
        </div>

=======
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
      </div>
    </section>
  );
};

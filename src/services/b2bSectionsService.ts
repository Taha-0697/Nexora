/**
 * B2B Website Sections Service
 * Manages persistent state for:
 * 1. Infinite Logo Marquee ("Trusted by teams worldwide")
 * 2. Case Studies ("Selected Work") with multi-service field sync
 * 
 * Persisted in localStorage with instant live preview reactivity via custom events.
 */

export type ServiceField =
  | 'Custom Web ERP (.NET Core)'
  | 'Odoo Enterprise & Python Bridges'
  | 'Custom Web Apps & REST APIs'
  | 'Custom Mobile Apps (iOS, Android & Flutter)'
  | 'AI Integrations, LLMs & Agentic Automation'
  | '24/7 Server Management & Cloud DevOps'
  | 'Proprietary Suite'
  | 'ERP Modernization & System Integration';

export const SERVICE_FIELDS: ServiceField[] = [
  'Custom Web ERP (.NET Core)',
  'Odoo Enterprise & Python Bridges',
  'Custom Web Apps & REST APIs',
  'Custom Mobile Apps (iOS, Android & Flutter)',
  'AI Integrations, LLMs & Agentic Automation',
  '24/7 Server Management & Cloud DevOps',
  'Proprietary Suite',
  'ERP Modernization & System Integration'
];

export interface ClientLogo {
  id: string;
  name: string;
  tagline: string;
  category: string;
  logoSvg?: string;
  imageUrl?: string;
  linkType?: 'none' | 'website' | 'case_study';
  websiteUrl?: string;
  caseStudySlug?: string;
  caseStudyId?: string;
  active: boolean;
  order: number;
}

export interface MarqueeSettings {
  direction: 'ltr' | 'rtl';
  speed: number; // in seconds
  isPaused: boolean;
  pauseOnHover: boolean;
  headingText: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  categoryTag: string;
  serviceField: ServiceField;
  summary: string;
  outcomeHighlight: string;
  imageUrl: string;
  storyUrl: string;
  client: string;
  industry: string;
  isHero: boolean;
  isStacked: boolean;
  stackedPosition?: 1 | 2;
  isProprietary?: boolean;
  demoProductName?: string;
  bookDemoUrl?: string;
  order: number;
}

export interface CaseStudiesSettings {
  eyebrowLabel: string;
  headingText: string;
  subtitleText: string;
  primaryCtaText: string;
  secondaryCtaText: string;
}

const STORAGE_KEYS = {
  LOGOS: 'nexora_b2b_logos_v5',
  MARQUEE_SETTINGS: 'nexora_b2b_marquee_settings_v5',
  CASE_STUDIES: 'nexora_b2b_casestudies_v5',
  CASE_STUDIES_SETTINGS: 'nexora_b2b_casestudies_settings_v5',
};

// Automatic legacy cleanup: purge any old version keys or entries containing legacy names
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const keysToPurge: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        const val = window.localStorage.getItem(key) || '';
        if (
          val.toLowerCase().includes('bashalog') ||
          key.includes('_v1') ||
          key.includes('_v2') ||
          key.includes('_v3') ||
          key.includes('_v4')
        ) {
          keysToPurge.push(key);
        }
      }
    }
    keysToPurge.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // Ignore in non-browser or sandboxed storage environments
  }
}

export const B2B_SECTIONS_EVENT = 'nexora_b2b_sections_updated';

// Default Logos in Nexora Systems' Dark Tech Brand Identity
export const DEFAULT_LOGOS: ClientLogo[] = [
  {
    id: 'logo-medpulse',
    name: 'MedPulse',
    tagline: 'Healthcare & Clinical ERP',
    category: 'Healthcare',
    active: true,
    order: 1,
    logoSvg: `<svg viewBox="0 0 140 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-7 w-auto">
      <path d="M4 18h8l3-8 4 16 4-12 3 6h6" stroke="#6366F1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="36" cy="18" r="2.5" fill="#38BDF8"/>
      <text x="44" y="23" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="16" fill="currentColor">MedPulse</text>
    </svg>`
  },
  {
    id: 'logo-respos',
    name: 'Respos',
    tagline: 'Omnichannel POS & ERP',
    category: 'Retail & POS',
    active: true,
    order: 2,
    logoSvg: `<svg viewBox="0 0 130 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-7 w-auto">
      <rect x="4" y="8" width="20" height="20" rx="6" fill="#6366F1"/>
      <path d="M9 14h10M9 18h7M9 22h10" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      <text x="32" y="23" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="16" fill="currentColor">Respos</text>
    </svg>`
  },
  {
    id: 'logo-vanguard-tms',
    name: 'Vanguard Freight Network',
    tagline: 'Global Fleet & Cross-Border TMS',
    category: 'Logistics',
    active: true,
    order: 3,
    logoSvg: `<svg viewBox="0 0 160 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-7 w-auto">
      <path d="M6 10l8-4 8 4v12l-8 4-8-4V10z" stroke="#38BDF8" stroke-width="2" fill="#6366F1" fill-opacity="0.2"/>
      <path d="M6 10l8 4 8-4M14 14v12" stroke="#38BDF8" stroke-width="2"/>
      <text x="30" y="23" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="14" fill="currentColor">Vanguard TMS</text>
    </svg>`
  },
  {
    id: 'logo-vanguard',
    name: 'Vanguard Global Trade',
    tagline: 'Cross-Border Supply Chain',
    category: 'Import / Export',
    active: true,
    order: 4,
    logoSvg: `<svg viewBox="0 0 160 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-7 w-auto">
      <path d="M5 8l9 18 9-18h-4l-5 11-5-11H5z" fill="#6366F1"/>
      <text x="30" y="23" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="15" fill="currentColor">Vanguard</text>
    </svg>`
  },
  {
    id: 'logo-meridian',
    name: 'Meridian Capital Assets',
    tagline: 'Private Equity & Treasury',
    category: 'Fintech',
    active: true,
    order: 5,
    logoSvg: `<svg viewBox="0 0 150 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-7 w-auto">
      <circle cx="14" cy="18" r="10" stroke="#818CF8" stroke-width="2.5"/>
      <path d="M14 8v20M4 18h20" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/>
      <text x="32" y="23" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="15" fill="currentColor">Meridian</text>
    </svg>`
  },
  {
    id: 'logo-apex',
    name: 'Apex Automations',
    tagline: 'Smart Factory Floor MES',
    category: 'Manufacturing',
    active: true,
    order: 6,
    logoSvg: `<svg viewBox="0 0 135 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-7 w-auto">
      <path d="M14 6l10 20H4L14 6z" stroke="#6366F1" stroke-width="2.5" fill="#38BDF8" fill-opacity="0.2"/>
      <text x="30" y="23" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="16" fill="currentColor">Apex</text>
    </svg>`
  },
  {
    id: 'logo-zenith',
    name: 'Zenith Petrochem',
    tagline: 'Refinery Asset Reliability',
    category: 'Energy',
    active: true,
    order: 7,
    logoSvg: `<svg viewBox="0 0 145 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-7 w-auto">
      <path d="M6 8h16l-14 16h16" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="32" y="23" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="16" fill="currentColor">Zenith</text>
    </svg>`
  },
  {
    id: 'logo-albayan',
    name: 'Al-Bayan Media Group',
    tagline: 'Digital Publishing & Ads',
    category: 'Media',
    active: true,
    order: 8,
    logoSvg: `<svg viewBox="0 0 155 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-7 w-auto">
      <rect x="4" y="6" width="20" height="20" rx="4" stroke="#818CF8" stroke-width="2"/>
      <circle cx="14" cy="16" r="4" fill="#6366F1"/>
      <text x="32" y="23" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="15" fill="currentColor">Al-Bayan</text>
    </svg>`
  },
  {
    id: 'logo-omnicare',
    name: 'OmniCare Health',
    tagline: 'Multi-Hospital EHR Network',
    category: 'Healthcare',
    active: true,
    order: 9,
    logoSvg: `<svg viewBox="0 0 160 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-7 w-auto">
      <circle cx="14" cy="18" r="9" stroke="#38BDF8" stroke-width="2.5"/>
      <path d="M14 13v10M9 18h10" stroke="#6366F1" stroke-width="2.5" stroke-linecap="round"/>
      <text x="32" y="23" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="15" fill="currentColor">OmniCare</text>
    </svg>`
  }
];

export const DEFAULT_MARQUEE_SETTINGS: MarqueeSettings = {
  direction: 'ltr',
  speed: 32, // seconds for full loop
  isPaused: false,
  pauseOnHover: true,
  headingText: 'Trusted by engineering and operations leaders worldwide'
};

// Default Case Studies covering all 7 core service fields
export const DEFAULT_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-medpulse-clinical-erp',
    title: 'MedPulse Clinical Operations & Multi-Branch Patient Workflow ERP',
    categoryTag: 'CUSTOM .NET WEB ERP · HEALTHCARE',
    serviceField: 'Custom Web ERP (.NET Core)',
    summary: 'Orchestrated patient billing, electronic health records (EHR), lab orders, and pharmacy inventory across 18 specialty medical facilities in the UAE into an ultra-low latency C# .NET Core and Next.js portal.',
    outcomeHighlight: '99.99% system uptime across 18 clinics with sub-100ms prescription processing and compliant HIPAA/MOH audit logs.',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    storyUrl: '#contact',
    client: 'MedPulse Health Systems',
    industry: 'Healthcare Operations',
    isHero: true,
    isStacked: false,
    order: 1
  },
  {
    id: 'cs-odoo-warehouse-rescue',
    title: 'Multi-Warehouse Inventory & Supply Chain Consolidation on Odoo 17',
    categoryTag: 'ODOO RESCUE · DIGITAL SERVICES',
    serviceField: 'Odoo Enterprise & Python Bridges',
    summary: 'A GCC distribution group with 14 regional fulfillment depots suffered critical inventory desynchronization and audit bottlenecks across legacy ERP silos. Nexora engineered a high-concurrency Odoo 17 Enterprise pipeline with bidirectional MSSQL inventory bridges and real-time barcode telemetry.',
    outcomeHighlight: 'Reduced inter-warehouse reconciliation cycles by 83% while eliminating over $420,000 in redundant stock bloat within the first 90 days.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    storyUrl: '#contact',
    client: 'Vanguard Global Logistics',
    industry: 'Supply Chain & Distribution',
    isHero: false,
    isStacked: true,
    stackedPosition: 1,
    order: 2
  },
  {
    id: 'cs-respos-franchise-engine',
    title: 'Respos Real-Time Restaurant & Franchise Inventory Management System',
    categoryTag: 'NEXT.JS & .NET CORE · HIGH-THROUGHPUT POS',
    serviceField: 'Custom Web Apps & REST APIs',
    summary: 'Replaced rigid proprietary POS terminals with a progressive web application back-ended by ASP.NET Web APIs and Redis cache clusters, handling multi-branch recipe costing and live table telemetry.',
    outcomeHighlight: 'Processed 2.4M monthly orders with zero latency spikes across GCC franchise outlets during peak Ramadan evening rushes.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    storyUrl: '#contact',
    client: 'Respos International Franchises',
    industry: 'Retail & Hospitality',
    isHero: false,
    isStacked: true,
    stackedPosition: 2,
    order: 3
  },
  {
    id: 'cs-vanguard-custom-tms',
    title: 'Vanguard Global Fleet Telemetry & Customs Brokerage Mobile Suite',
    categoryTag: 'FLUTTER & FASTAPI · MOBILE TELEMETRICS',
    serviceField: 'Custom Mobile Apps (iOS, Android & Flutter)',
    summary: 'Engineered a high-performance cross-border driver mobile app in Flutter and Python FastAPI, handling live geolocation tracking, offline bill-of-lading (e-BOL) signatures, and automated customs checkpoint notifications.',
    outcomeHighlight: 'Accelerated cross-border clearing times from 36 hours down to 4.2 hours with automated compliance filings across 1,200 commercial haulers.',
    imageUrl: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80',
    storyUrl: '#contact',
    client: 'Vanguard Freight Network',
    industry: 'Freight & Transportation',
    isHero: false,
    isStacked: false,
    order: 4
  },
  {
    id: 'cs-cogniflow-agentic-ai',
    title: 'CogniFlow Enterprise RAG & Autonomous Document Intelligence Pipeline',
    categoryTag: 'PYTHON FASTAPI, LLMS & PGVECTOR · AGENTIC AI',
    serviceField: 'AI Integrations, LLMs & Agentic Automation',
    summary: 'Developed an autonomous agentic ingestion pipeline using LlamaIndex, pgvector, and local enterprise LLM inference to automatically classify, extract, and reconcile cross-entity commercial contracts and complex financial statements.',
    outcomeHighlight: 'Indexed 1.8M regulatory filing pages with sub-second semantic retrieval, slashing due-diligence review cycles by 78%.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    storyUrl: '#contact',
    client: 'Meridian Capital Assets',
    industry: 'Asset Management & Private Equity',
    isHero: false,
    isStacked: false,
    order: 5
  },
  {
    id: 'cs-apex-cloud-sre',
    title: 'Apex High-Availability SRE Infrastructure & Zero-Downtime Kubernetes Failover',
    categoryTag: 'KUBERNETES & TERRAFORM · SRE CLUSTER',
    serviceField: '24/7 Server Management & Cloud DevOps',
    summary: 'Architected and maintain a 24/7 mission-critical multi-region EKS cluster with automated Istio traffic management, zero-loss database read replicas, and 24/7 dedicated SRE incident triage.',
    outcomeHighlight: 'Sustained 99.999% SLA availability across multi-region AWS and Azure hybrid clusters under sudden 10x traffic bursts.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    storyUrl: '#contact',
    client: 'Apex Industrial Automations',
    industry: 'Industrial IoT & Manufacturing',
    isHero: false,
    isStacked: false,
    order: 6
  },
  {
    id: 'cs-zenith-erp-modernization',
    title: 'Legacy AS400 & On-Prem Oracle to Cloud-Native PostgreSQL Event-Driven Migration',
    categoryTag: 'KAFKA & MSSQL · ZERO-DOWNTIME CUTOVER',
    serviceField: 'ERP Modernization & System Integration',
    summary: 'Decommissioned a 19-year-old monolithic legacy database by introducing Apache Kafka event sourcing, CDC (Change Data Capture), and synchronized cloud-native microservices without interrupting operational plant floor scheduling.',
    outcomeHighlight: 'Migrated 12 million transactional records without a single minute of plant production stoppage or financial ledger reconciliation gap.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    storyUrl: '#contact',
    client: 'Zenith Petrochem Operations',
    industry: 'Energy & Refining',
    isHero: false,
    isStacked: false,
    order: 7
  },
  {
    id: 'cs-nexora-flow-suite',
    title: 'Nexora Flow™ Enterprise ERP & Autonomous Operations Suite',
    categoryTag: '.NET 9 CORE, REACT 19 & REDIS · PROPRIETARY SUITE',
    serviceField: 'Proprietary Suite',
    summary: 'Turnkey proprietary operations and resource planning suite engineered for mid-to-large enterprises. Integrates supply chain inventory, real-time banking rails, and automated multi-branch financial ledgers with 100% intellectual property ownership and zero recurring per-seat licensing fees.',
    outcomeHighlight: 'Turnkey deployment in under 14 days, 100% IP ownership, and sub-35ms live telemetry across 45+ enterprise distribution nodes.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    storyUrl: '#contact',
    client: 'Nexora Software Assets',
    industry: 'Enterprise Software & Supply Chain',
    isHero: false,
    isStacked: false,
    isProprietary: true,
    demoProductName: 'Nexora Flow™ Enterprise Suite',
    order: 8
  }
];

export const DEFAULT_CASE_STUDIES_SETTINGS: CaseStudiesSettings = {
  eyebrowLabel: 'PROVEN DELIVERABLES',
  headingText: 'Enterprise Case Studies & Operational Outcomes',
  subtitleText: 'Deep-dive into verified engineering achievements across custom .NET ERPs, Odoo bridges, mobile telematics, and 24/7 mission-critical infrastructures.',
  primaryCtaText: 'Discuss My System Architecture →',
  secondaryCtaText: 'Calculate Project Cost →'
};

// Helper: Broadcast state update event across window
function broadcastUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(B2B_SECTIONS_EVENT));
  }
}

// ----------------------------------------------------------------------
// MARQUEE & LOGO FUNCTIONS
// ----------------------------------------------------------------------

export function getClientLogos(): ClientLogo[] {
  if (typeof window === 'undefined') return DEFAULT_LOGOS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LOGOS, JSON.stringify(DEFAULT_LOGOS));
      return DEFAULT_LOGOS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_LOGOS;
  } catch (err) {
    console.error('Failed to load logos from localStorage:', err);
    return DEFAULT_LOGOS;
  }
}

export function saveClientLogos(logos: ClientLogo[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.LOGOS, JSON.stringify(logos));
  broadcastUpdate();
}

export function getMarqueeSettings(): MarqueeSettings {
  if (typeof window === 'undefined') return DEFAULT_MARQUEE_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MARQUEE_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MARQUEE_SETTINGS, JSON.stringify(DEFAULT_MARQUEE_SETTINGS));
      return DEFAULT_MARQUEE_SETTINGS;
    }
    return { ...DEFAULT_MARQUEE_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_MARQUEE_SETTINGS;
  }
}

export function saveMarqueeSettings(settings: MarqueeSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.MARQUEE_SETTINGS, JSON.stringify(settings));
  broadcastUpdate();
  fetch('/api/b2b/marquee', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      isPlaying: !settings.isPaused,
      direction: settings.direction,
      speedSeconds: settings.speed,
      pauseOnHover: settings.pauseOnHover,
      headingText: settings.headingText,
    }),
  }).catch(err => console.warn('[B2B] Failed to sync marquee settings to Neon DB:', err));
}

export function addClientLogo(logo: Omit<ClientLogo, 'id' | 'order'>): ClientLogo {
  const current = getClientLogos();
  const newLogo: ClientLogo = {
    ...logo,
    id: `logo-${Date.now()}`,
    order: current.length + 1
  };
  const updated = [...current, newLogo];
  saveClientLogos(updated);

  fetch('/api/b2b/logos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newLogo),
  })
    .then(res => (res.ok ? res.json() : null))
    .then(created => {
      if (created && created.id) {
        const latest = getClientLogos().map(l => (l.id === newLogo.id ? { ...l, id: created.id } : l));
        saveClientLogos(latest);
      }
    })
    .catch(err => console.warn('[B2B] Failed to create logo in Neon DB:', err));

  return newLogo;
}

export function updateClientLogo(id: string, updates: Partial<ClientLogo>): void {
  const current = getClientLogos();
  const updated = current.map(l => (l.id === id ? { ...l, ...updates } : l));
  saveClientLogos(updated);

  fetch(`/api/b2b/logos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  }).catch(err => console.warn('[B2B] Failed to update logo in Neon DB:', err));
}

export function deleteClientLogo(id: string): void {
  const current = getClientLogos();
  const updated = current.filter(l => l.id !== id);
  saveClientLogos(updated);

  fetch(`/api/b2b/logos/${id}`, { method: 'DELETE' }).catch(err =>
    console.warn('[B2B] Failed to delete logo in Neon DB:', err)
  );
}

export function toggleLogoActive(id: string): void {
  const current = getClientLogos();
  const target = current.find(l => l.id === id);
  const nextActive = target ? !target.active : true;
  const updated = current.map(l => (l.id === id ? { ...l, active: nextActive } : l));
  saveClientLogos(updated);

  fetch(`/api/b2b/logos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive: nextActive }),
  }).catch(err => console.warn('[B2B] Failed to toggle logo in Neon DB:', err));
}

// ----------------------------------------------------------------------
// CASE STUDIES FUNCTIONS
// ----------------------------------------------------------------------

export function getCaseStudies(): CaseStudy[] {
  if (typeof window === 'undefined') return DEFAULT_CASE_STUDIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CASE_STUDIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CASE_STUDIES, JSON.stringify(DEFAULT_CASE_STUDIES));
      return DEFAULT_CASE_STUDIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CASE_STUDIES;
  } catch (err) {
    console.error('Failed to load case studies from localStorage:', err);
    return DEFAULT_CASE_STUDIES;
  }
}

export function getCaseStudiesByService(serviceField: ServiceField): CaseStudy[] {
  const all = getCaseStudies();
  return all.filter(cs => cs.serviceField === serviceField);
}

export function saveCaseStudies(caseStudies: CaseStudy[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CASE_STUDIES, JSON.stringify(caseStudies));
  broadcastUpdate();
}

export function getCaseStudiesSettings(): CaseStudiesSettings {
  if (typeof window === 'undefined') return DEFAULT_CASE_STUDIES_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CASE_STUDIES_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CASE_STUDIES_SETTINGS, JSON.stringify(DEFAULT_CASE_STUDIES_SETTINGS));
      return DEFAULT_CASE_STUDIES_SETTINGS;
    }
    return { ...DEFAULT_CASE_STUDIES_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_CASE_STUDIES_SETTINGS;
  }
}

export function saveCaseStudiesSettings(settings: CaseStudiesSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CASE_STUDIES_SETTINGS, JSON.stringify(settings));
  broadcastUpdate();
}

export function assignHeroCaseStudy(id: string): void {
  const current = getCaseStudies();
  const updated = current.map(cs => {
    if (cs.id === id) {
      return { ...cs, isHero: true, isStacked: false, stackedPosition: undefined };
    }
    if (cs.isHero) {
      return { ...cs, isHero: false };
    }
    return cs;
  });
  saveCaseStudies(updated);
  fetch(`/api/b2b/casestudies/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isHero: true, isStacked: false }),
  }).catch(() => {});
}

export function assignStackedCaseStudy(id: string, position: 1 | 2): void {
  const current = getCaseStudies();
  const updated = current.map(cs => {
    if (cs.id === id) {
      return { ...cs, isStacked: true, stackedPosition: position, isHero: false };
    }
    if (cs.isStacked && cs.stackedPosition === position) {
      return { ...cs, isStacked: false, stackedPosition: undefined };
    }
    return cs;
  });
  saveCaseStudies(updated);
  fetch(`/api/b2b/casestudies/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isStacked: true, stackedPosition: position, isHero: false }),
  }).catch(() => {});
}

export function addCaseStudy(cs: Omit<CaseStudy, 'id' | 'order' | 'isHero' | 'isStacked'>): CaseStudy {
  const current = getCaseStudies();
  const newCs: CaseStudy = {
    ...cs,
    id: `cs-${Date.now()}`,
    isHero: false,
    isStacked: false,
    order: current.length + 1
  };
  const updated = [...current, newCs];
  saveCaseStudies(updated);

  fetch('/api/b2b/casestudies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCs),
  })
    .then(res => (res.ok ? res.json() : null))
    .then(created => {
      if (created && created.id) {
        const latest = getCaseStudies().map(item => (item.id === newCs.id ? { ...item, id: created.id } : item));
        saveCaseStudies(latest);
      }
    })
    .catch(err => console.warn('[B2B] Failed to create case study in Neon DB:', err));

  return newCs;
}

export function updateCaseStudy(id: string, updates: Partial<CaseStudy>): void {
  const current = getCaseStudies();
  const updated = current.map(cs => (cs.id === id ? { ...cs, ...updates } : cs));
  saveCaseStudies(updated);

  fetch(`/api/b2b/casestudies/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  }).catch(err => console.warn('[B2B] Failed to update case study in Neon DB:', err));
}

export function deleteCaseStudy(id: string): void {
  const current = getCaseStudies();
  const updated = current.filter(cs => cs.id !== id);
  saveCaseStudies(updated);

  fetch(`/api/b2b/casestudies/${id}`, { method: 'DELETE' }).catch(err =>
    console.warn('[B2B] Failed to delete case study in Neon DB:', err)
  );
}

// Background Neon DB hydration for B2B CMS
export async function syncB2bFromNeon(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const [logosRes, csRes, marqueeRes] = await Promise.all([
      fetch('/api/b2b/logos'),
      fetch('/api/b2b/casestudies'),
      fetch('/api/b2b/marquee'),
    ]);

    if (logosRes.ok) {
      const dbLogos = await logosRes.json();
      if (Array.isArray(dbLogos) && dbLogos.length > 0) {
        const mappedLogos: ClientLogo[] = dbLogos.map((l: any) => ({
          id: l.id,
          name: l.companyName || l.name,
          tagline: l.tagline || '',
          category: l.category || '',
          logoSvg: l.logoSvg || undefined,
          imageUrl: l.logoUrl || l.imageUrl,
          linkType: (l.linkType as 'none' | 'website' | 'case_study') || (l.websiteUrl ? 'website' : (l.caseStudySlug || l.caseStudyId ? 'case_study' : 'none')),
          websiteUrl: l.websiteUrl || undefined,
          caseStudySlug: l.caseStudySlug || undefined,
          caseStudyId: l.caseStudyId || undefined,
          active: l.isActive !== undefined ? Boolean(l.isActive) : true,
          order: l.displayOrder ?? 0,
        }));
        localStorage.setItem(STORAGE_KEYS.LOGOS, JSON.stringify(mappedLogos));
      }
    }

    if (csRes.ok) {
      const dbCs = await csRes.json();
      if (Array.isArray(dbCs) && dbCs.length > 0) {
        const mappedCs: CaseStudy[] = dbCs.map((cs: any) => ({
          id: cs.id,
          title: cs.title,
          categoryTag: cs.categoryTag || 'ERP Modernization',
          serviceField: (cs.serviceField || 'Custom Web ERP (.NET Core)') as ServiceField,
          summary: cs.summary || '',
          outcomeHighlight: cs.outcomeHighlight || '',
          imageUrl: cs.coverImageUrl || cs.imageUrl || '',
          storyUrl: cs.storyUrl || '#',
          client: cs.clientName || cs.client || 'Enterprise Partner',
          industry: cs.industry || 'Enterprise Logistics',
          isHero: Boolean(cs.isHero),
          isStacked: Boolean(cs.isStacked),
          stackedPosition: cs.stackedPosition || undefined,
          isProprietary: Boolean(cs.isProprietary),
          demoProductName: cs.demoProductName || undefined,
          bookDemoUrl: cs.bookDemoUrl || undefined,
          order: cs.displayOrder ?? 0,
        }));
        localStorage.setItem(STORAGE_KEYS.CASE_STUDIES, JSON.stringify(mappedCs));
      }
    }

    if (marqueeRes.ok) {
      const dbMarquee = await marqueeRes.json();
      if (dbMarquee && dbMarquee.id) {
        const current = getMarqueeSettings();
        const synced: MarqueeSettings = {
          ...current,
          direction: (dbMarquee.direction === 'rtl' ? 'rtl' : 'ltr'),
          speed: dbMarquee.speedSeconds ?? current.speed,
          isPaused: dbMarquee.isPlaying !== undefined ? !dbMarquee.isPlaying : current.isPaused,
          pauseOnHover: dbMarquee.pauseOnHover !== undefined ? dbMarquee.pauseOnHover : current.pauseOnHover,
          headingText: dbMarquee.headingText || current.headingText,
        };
        localStorage.setItem(STORAGE_KEYS.MARQUEE_SETTINGS, JSON.stringify(synced));
      }
    }
    broadcastUpdate();
  } catch (err) {
    console.warn('[B2B] Background Neon sync failed:', err);
  }
}

if (typeof window !== 'undefined') {
  syncB2bFromNeon();
}

// ----------------------------------------------------------------------
// RESET TO PRISTINE NEXORA DEFAULTS
// ----------------------------------------------------------------------

export function resetB2BSectionsToDefault(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.LOGOS, JSON.stringify(DEFAULT_LOGOS));
  localStorage.setItem(STORAGE_KEYS.MARQUEE_SETTINGS, JSON.stringify(DEFAULT_MARQUEE_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.CASE_STUDIES, JSON.stringify(DEFAULT_CASE_STUDIES));
  localStorage.setItem(STORAGE_KEYS.CASE_STUDIES_SETTINGS, JSON.stringify(DEFAULT_CASE_STUDIES_SETTINGS));
  broadcastUpdate();
}

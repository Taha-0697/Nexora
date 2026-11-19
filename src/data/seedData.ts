import type {
  Project,
  Review,
  ServiceItem,
  GoogleReviewSettings,
  AdminUser,
  MarketingSettings
} from '../types';

export const initialGoogleSettings: GoogleReviewSettings = {
  placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
  syncEnabled: true,
  businessName: 'Nexora Systems Software House & Cloud Operations',
  overallRating: 4.9,
  totalReviewsCount: 148,
  lastSyncTimestamp: 'Just now (Live Verified)',
  googleMapsUrl: 'https://maps.google.com/?q=Nexora+Systems+Software+House'
};

export const initialServices: ServiceItem[] = [
  {
    id: 'odoo-erp-custom',
    category: 'erp',
    iconName: 'Database',
    title: {
      en: 'Odoo Enterprise Customization & Python Bridges',
      ar: 'تخصيص أنظمة Odoo المؤسسية والربط البرمجي بـ Python'
    },
    tagline: {
      en: 'Bespoke Odoo modules, Python bridges & PostgreSQL/MSSQL synchronization',
      ar: 'وحدات Odoo مخصصة، محركات بايثون وتزامن بيانات PostgreSQL و MSSQL'
    },
    description: {
      en: 'End-to-end enterprise customization for Odoo. We build proprietary Python backend bridges, high-speed FastAPI connectors, and real-time bi-directional synchronization between PostgreSQL and Microsoft SQL Server (MSSQL), eliminating silos across your financial ledgers and supply chains.',
      ar: 'تخصيص متقدم وشامل لمنظومة Odoo Enterprise. نطور جسور خلفية بلغة Python ومحركات FastAPI فائقة السرعة مع مزامنة فورية ثنائية الاتجاه بين PostgreSQL وقواعد بيانات MSSQL لضمان استقرار العمليات المحاسبية وسلاسل التوريد.'
    },
    features: {
      en: [
        'Proprietary Odoo Enterprise Module Development & Python ORM',
        'Python 3.12 Backend Bridges, FastAPI & High-Throughput XML-RPC',
        'Real-Time PostgreSQL & MSSQL Bi-Directional Data Synchronization',
        'Multi-Entity Accounting, Automated Invoicing & Tax Compliance',
        'Legacy ERP Data Migration with Zero Production Downtime'
      ],
      ar: [
        'تطوير وحدات Odoo المخصصة بالكامل وهندسة محركات بايثون',
        'جسور Python 3.12 ومحركات FastAPI للربط عالي الكثافة',
        'مزامنة بيانات لحظية بين PostgreSQL و Microsoft SQL Server',
        'أنظمة محاسبية متعددة الكيانات وفوترة إلكترونية متوافقة ضريبياً',
        'ترحيل آمن لبيانات أنظمة الـ ERP القديمة بدون أي توقف'
      ]
    },
    technologies: [
      'Odoo Enterprise',
      'Python 3.12',
      'FastAPI',
      'PostgreSQL',
      'MSSQL Sync',
      'Docker'
    ],
    badge: {
      en: 'Odoo Core',
      ar: 'تطوير Odoo'
    }
  },
  {
    id: 'custom-erp',
    category: 'erp',
    iconName: 'Database',
    title: {
      en: 'Custom Web ERP & Enterprise Portals',
      ar: 'أنظمة ERP السحابية المخصصة والبوابات المؤسسية'
    },
    tagline: {
      en: 'High-throughput .NET Core Web API, React/Next.js, MSSQL & Redis',
      ar: 'محرك .NET Core فائق السرعة، واجهات Next.js وقواعد بيانات MSSQL'
    },
    description: {
      en: 'Tailored enterprise ERP solutions engineered with high-velocity .NET Core Web APIs, React/Next.js frontends, and robust Microsoft SQL Server (MSSQL). Featuring modular billing, multi-branch inventory, real-time analytics, and automated REST API integrations with banking, customs, and payment gateways.',
      ar: 'أنظمة تخطيط موارد مؤسسية (ERP) مخصصة 100% مبنية بمحركات .NET Core Web API وواجهات React و Next.js وقواعد بيانات MSSQL العملاقة. تشمل الفوترة، إدارة المستودعات متعددة الفروع، ولوحات تحكم فورية مع ربط كامل بالبنوك وبوابات الدفع.'
    },
    features: {
      en: [
        'High-Performance .NET 9 Core Web API & Microservices',
        'Next.js 15 & React Modern Responsive Portals',
        'Microsoft SQL Server (MSSQL) & High-Concurrency Indexing',
        'Complex Role-Based Access Control (RBAC) & Audit Trails',
        'Bi-directional REST API Integrations (Banking, CRM, Logistics)'
      ],
      ar: [
        'محركات برمجية فائقة السرعة بـ .NET 9 Core Web API وبنى المايكروسيرفس',
        'بوابات إلكترونية تفاعلية باستخدام Next.js 15 و React',
        'قواعد بيانات Microsoft SQL Server (MSSQL) فائقة الاستقرار',
        'نظام حوكمة وإدارة صلاحيات دقيق (RBAC) وسجل تدقيق شامل',
        'ربط برمجيات الـ REST APIs مع البنوك، الجمارك، وشركات الشحن'
      ]
    },
    technologies: [
      '.NET Core Web API',
      'React / Next.js',
      'MS SQL Server (MSSQL)',
      'Node.js',
      'Redis',
      'REST APIs'
    ],
    badge: {
      en: 'Flagship ERP',
      ar: 'المنظومة الأساسية'
    }
  },
  {
    id: 'custom-web-apps',
    category: 'web',
    iconName: 'Globe',
    title: {
      en: 'Custom Web Apps & REST API Ecosystems',
      ar: 'تطبيقات الويب المخصصة ومنظومات الـ REST API'
    },
    tagline: {
      en: 'Next.js, React, Node.js & .NET Core High-Performance Architectures',
      ar: 'هندسة منصات الويب الحديثة بأحدث تقنيات Next.js و Node.js و .NET'
    },
    description: {
      en: 'Scalable SaaS platforms, customer portals, and internal enterprise dashboards. Built with modular TypeScript frontends, event-driven Node.js/.NET Core backends, and zero-latency caching pipelines.',
      ar: 'تطوير منصات SaaS وبوابات العملاء ولوحات الإدارة الداخلية للشركات. مبنية بأحدث معايير TypeScript و .NET Core و Node.js لتحقيق سرعة استجابة مذهلة وحماية أمنية لا تضاهى.'
    },
    features: {
      en: [
        'Server-Side Rendered (SSR) Next.js & React 19',
        'Scalable Node.js (NestJS / Express) & .NET APIs',
        'Multi-Tenant SaaS Architecture with Data Isolation',
        'Real-Time WebSockets & Streaming Event Dashboards',
        'Full REST API Documentation & Swagger / OpenAPI 3.0'
      ],
      ar: [
        'واجهات سريعة التصفح بتقنية SSR عبر Next.js و React 19',
        'واجهات برمجية API سريعة مبنية بـ Node.js و .NET Core',
        'بنية SaaS متعددة المستأجرين مع عزل كامل للبيانات',
        'مزامنة حية وتدفق بيانات فوري عبر WebSockets',
        'توثيق برمجي شامل عبر معايير Swagger و OpenAPI'
      ]
    },
    technologies: [
      'Next.js',
      'React.js',
      'Node.js',
      '.NET Core',
      'TypeScript',
      'MSSQL / Postgres'
    ],
    badge: {
      en: 'High Velocity',
      ar: 'أداء فائق السرعة'
    }
  },
  {
    id: 'custom-mobile-apps',
    category: 'mobile',
    iconName: 'Smartphone',
    title: {
      en: 'Custom Mobile Apps (iOS, Android & Flutter)',
      ar: 'تطبيقات الجوال المخصصة (iOS ،Android و Flutter)'
    },
    tagline: {
      en: 'Native Swift, Kotlin, and High-Performance 60FPS Flutter',
      ar: 'تطبيقات أصلية بلغة Swift و Kotlin و Flutter فائقة الأداء'
    },
    description: {
      en: 'End-to-end mobile engineering from architecture and UI/UX design to App Store & Google Play deployment. Expertly delivering native iOS (Swift/SwiftUI), native Android (Kotlin), and cross-platform Flutter applications.',
      ar: 'دورة تطوير تطبيقات جوال شاملة من التصميم الهندسي وتجربة المستخدم حتى النشر على App Store و Google Play. خبرة عميقة في تطوير تطبيقات iOS الأصلية بـ Swift وتطبيقات أندرويد بـ Kotlin وحلول Flutter.'
    },
    features: {
      en: [
        'Native iOS Development with Swift, SwiftUI & Apple Enclave',
        'Native Android Development with Kotlin & Jetpack Compose',
        'Single-Codebase High-Performance Flutter Architecture',
        'Biometric Authentication, Apple Pay & Google Pay',
        'Offline-First Local Storage (SQLite / Realm) & Auto-Sync'
      ],
      ar: [
        'تطوير أصلي لنظام iOS باستخدام Swift و SwiftUI والأمان البيومتري',
        'تطوير أصلي لنظام Android باستخدام Kotlin و Jetpack Compose',
        'تطبيقات متعددة المنصات بكود موحد فائق السرعة عبر Flutter',
        'المصادقة ببصمة الوجه ودعم Apple Pay و Google Pay',
        'العمل بدون إنترنت مع مزامنة ذكية لقواعد البيانات المحلية'
      ]
    },
    technologies: [
      'iOS Swift',
      'Android Kotlin',
      'Flutter / Dart',
      'REST APIs',
      'Firebase',
      'Biometrics'
    ],
    badge: {
      en: 'Native & Hybrid',
      ar: 'أصلي وهجين'
    }
  },
  {
    id: 'ai-integrations',
    category: 'ai',
    iconName: 'Cpu',
    title: {
      en: 'AI Integrations, LLMs & Agentic Automation',
      ar: 'تكاملات الذكاء الاصطناعي (AI) ونماذج الـ LLM والأتمتة'
    },
    tagline: {
      en: 'OpenAI, Claude, Custom Vector RAG, and Workflow Agents',
      ar: 'دمج نماذج الذكاء الاصطناعي، البحث المتجهي RAG، والوكلاء الأذكياء'
    },
    description: {
      en: 'Supercharge your software systems with intelligent automation. We embed OpenAI, Anthropic Claude, custom fine-tuned LLMs, semantic vector search, and automated agentic pipelines directly into your .NET, Next.js, and ERP backends.',
      ar: 'تمكين منظومتك البرمجية بقدرات الذكاء الاصطناعي الحديث. دمج نماذج OpenAI و Claude والبحث الدلالي RAG والأتمتة الذكية مباشرة داخل أنظمة .NET و Next.js وتطبيقات الجوال.'
    },
    features: {
      en: [
        'Custom RAG (Retrieval-Augmented Generation) & Vector DBs',
        'Autonomous AI Agents for Customer Support & Lead Triage',
        'Intelligent Document & Invoice OCR Extraction Pipelines',
        'Natural Language Business Intelligence & Dynamic SQL Querying',
        'Private On-Premise LLM Deployments for Strict Data Privacy'
      ],
      ar: [
        'بناء أنظمة RAG للبحث الذكي والربط بقواعد البيانات المتجهة',
        'وكلاء ذكاء اصطناعي لخدمة العملاء وفرز الطلبات تلقائياً',
        'استخراج البيانات وقراءة الفواتير والمستندات آلياً بتقنية OCR',
        'تحليل الأعمال عبر الاستعلام باللغة الطبيعية وتوليد SQL',
        'نشر نماذج ذكاء اصطناعي خاصة في سيرفراتك لحماية سرية البيانات'
      ]
    },
    technologies: [
      'OpenAI APIs',
      'Anthropic Claude',
      'Python / LangChain',
      'Vector DB (Pinecone/pgvector)',
      '.NET AI SDK',
      'REST APIs'
    ],
    badge: {
      en: 'AI Powered',
      ar: 'مدعوم بالذكاء الاصطناعي'
    }
  },
  {
    id: 'cloud-devops',
    category: 'cloud',
    iconName: 'Server',
    title: {
      en: '24/7 Server Management & Cloud DevOps',
      ar: 'إدارة السيرفرات والبنى السحابية 24/7 (DevOps)'
    },
    tagline: {
      en: 'Bare-metal, AWS, Azure, Docker, Kubernetes & 99.99% SLA',
      ar: 'بنية تحتية سحابية ومادية مع ضمان استمرارية 99.99%'
    },
    description: {
      en: 'End-to-end server architecture, Linux/Windows administration, Kubernetes cluster orchestration, zero-downtime CI/CD deployment pipelines, DDoS mitigation, and 24/7 telemetry monitoring.',
      ar: 'هندسة متكاملة للخوادم، إدارة أنظمة لينكس وويندوز، إدارة كتل Kubernetes، خطوط النشر الآلي CI/CD بدون توقف، الحماية من هجمات DDoS ومراقبة مستمرة على مدار الساعة.'
    },
    features: {
      en: [
        'AWS, Azure, GCP & Bare-Metal Linux Server Clustering',
        'Kubernetes, Docker & Microservices Orchestration',
        'CI/CD Deployment Automation (GitHub Actions, GitLab CI)',
        'Zero-Trust Firewall, SSL, Reverse Proxies & DDoS Hardening',
        '24/7 Proactive Uptime Telemetry & Incident SRE Response'
      ],
      ar: [
        'بنية سحابية على AWS و Azure وسيرفرات لينكس مادية',
        'إدارة كتل Kubernetes وحاويات Docker والمايكروسيرفس',
        'أتمتة خطوط النشر عبر GitHub Actions و GitLab',
        'جدران حماية Zero-Trust وشهادات SSL وحماية DDoS',
        'مراقبة فورية 24/7 واستجابة سريعة لحوادث الخوادم'
      ]
    },
    technologies: [
      'AWS / Azure',
      'Kubernetes',
      'Docker',
      'Terraform',
      'Nginx / Caddy',
      'Linux Admin'
    ],
    badge: {
      en: '99.99% SLA',
      ar: 'ضمان 99.99%'
    }
  },
  {
    id: 'erp-modernization',
    category: 'erp',
    iconName: 'Database',
    title: {
      en: 'ERP Modernization & System Integration',
      ar: 'تحديث وتطوير أنظمة الـ ERP والتكاملات المؤسسية'
    },
    tagline: {
      en: 'Custom module engineering, automated workflows & high-speed API bridges',
      ar: 'تطوير وتخصيص أنظمة الـ ERP وربط سير العمل بالواجهات الحديثة'
    },
    description: {
      en: 'Enterprise-grade ERP enhancement, custom module development, accounting compliance, automated inventory control, and direct bi-directional synchronization with your custom .NET and React applications.',
      ar: 'تحديث وتطوير أنظمة الـ ERP للشركات وتطوير وحدات برمجية مخصصة، وإدارة المحاسبة والفوترة الإلكترونية، مع ربط مباشر مع أنظمة .NET و React المخصصة.'
    },
    features: {
      en: [
        'Custom Workflow Modules & Enterprise Business Logic',
        'Bi-directional REST API Sync to Custom .NET & Next.js Systems',
        'Automated Invoicing, ZATCA & GCC Multi-Region Tax Compliance',
        'Multi-Warehouse Inventory & Barcode Automation',
        'Legacy Database Modernization & Cloud Integration'
      ],
      ar: [
        'تطوير وحدات وأنظمة سير عمل مخصصة للمؤسسات',
        'مزامنة حية عبر الـ APIs مع منصات .NET و Next.js',
        'الفواتير الآلية، ضريبة القيمة المضافة والمحاسبة',
        'أتمتة المخازن والباركود والمستودعات',
        'ترحيل وتحديث قواعد البيانات القديمة إلى السحابة'
      ]
    },
    technologies: [
      'Custom ERP Modules',
      '.NET Core API',
      'PostgreSQL / SQL',
      'REST Bridges',
      'Python',
      'Docker'
    ],
    badge: {
      en: 'Enterprise ERP',
      ar: 'حلول مؤسسية'
    }
  }
];

export const initialProjects: Project[] = [];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    authorName: 'Tariq Al-Mansoor',
    authorRole: 'Chief Operating Officer',
    company: 'Al-Madar Global Logistics (Dubai)',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content: {
      en: 'Nexora Systems delivered our custom web ERP using .NET Core Web API and Next.js with perfection. Our MSSQL database handles millions of rows effortlessly, and their REST API integrations with our banks eliminated manual reconciliations completely.',
      ar: 'قامت نيكسورا بتطوير نظام الـ ERP المخصص لنا بالكامل عبر .NET Core و Next.js وقواعد بيانات MSSQL. أصبح العمل سريعاً وسلساً، وأتمتة الـ APIs مع البنوك وفرت مئات الساعات شهرياً.'
    },
    date: '1 week ago',
    isGoogleReview: true,
    googleReviewUrl: 'https://maps.google.com/?q=Nexora+Systems',
    verified: true
  },
  {
    id: 'rev-2',
    authorName: 'David H. Sterling',
    authorRole: 'VP of Engineering',
    company: 'FinEdge Payment Technologies (London)',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content: {
      en: 'Exceptional software house. Their team built our mobile apps in native Swift and Kotlin alongside Flutter cross-platform modules. Response times on our .NET Core microservices dropped under 25ms, and their 24/7 Kubernetes management is faultless.',
      ar: 'بيت برمجيات استثنائي بكل المقاييس. طوّر فريقهم تطبيقاتنا الأصلية بـ Swift و Kotlin بجانب واجهات Flutter. استجابة السيرفرات فائقة والعمل السحابي عبر Kubernetes دون أي انقطاع.'
    },
    date: '3 weeks ago',
    isGoogleReview: true,
    googleReviewUrl: 'https://maps.google.com/?q=Nexora+Systems',
    verified: true
  },
  {
    id: 'rev-3',
    authorName: 'Fatima Al-Zahra',
    authorRole: 'Digital Transformation Director',
    company: 'Capital Trade & Holdings (Muscat)',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content: {
      en: 'We contracted Nexora Systems for a bespoke enterprise portal and AI document automation pipeline. Their bilingual Arabic/English execution, clean code standards, and rapid bi-weekly sprint deliveries make them our primary technology partner.',
      ar: 'تعاقدنا مع نيكسورا لتطوير منصة مؤسسية مخصصة ومحرك ذكاء اصطناعي لمعالجة المستندات. دقة التنفيذ ودعم اللغتين العربية والإنجليزية والتسليمات الدورية جعلهم شريكنا التقني الدائم.'
    },
    date: '1 month ago',
    isGoogleReview: true,
    googleReviewUrl: 'https://maps.google.com/?q=Nexora+Systems',
    verified: true
  },
  {
    id: 'rev-4',
    authorName: 'Marcus Vance',
    authorRole: 'Founder & Managing Director',
    company: 'Vanguard Industrial Technologies',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content: {
      en: 'Outstanding engineering team. They delivered our enterprise web portals with bank-grade encryption, Next.js rendering, and robust .NET APIs. Our team loves the fluid performance and eye-friendly interface.',
      ar: 'فريق هندسي على أعلى مستوى. سلّموا بوابتنا المؤسسية بأعلى معايير الأمان والتشفير وبسرعة تصفح فائقة عبر Next.js ومحركات .NET القوية. تجربة مستخدم مبهرة وسلسة.'
    },
    date: '2 months ago',
    isGoogleReview: true,
    googleReviewUrl: 'https://maps.google.com/?q=Nexora+Systems',
    verified: true
  }
];

// Pre-configured Team Users with Multi-Role Support
export const initialAdminUsers: AdminUser[] = [
  {
    id: 'usr-admin',
    email: 'admin@nexora.io',
    name: 'Executive Administrator',
    roles: ['admin', 'project_manager', 'marketing_manager', 'review_manager'],
    password: 'admin2026!',
    title: 'Chief Technology Officer (All Permissions)',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-pm',
    email: 'pm@nexora.io',
    name: 'Sarah Jenkins',
    roles: ['project_manager'],
    password: 'pm2026!',
    title: 'Senior Project Manager (Projects & Deliverables)',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-mkt',
    email: 'marketing@nexora.io',
    name: 'Alexander Ross',
    roles: ['marketing_manager'],
    password: 'mkt2026!',
    title: 'Head of Marketing & SEO Growth (Ads & SEO)',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-rev',
    email: 'reviews@nexora.io',
    name: 'Zainab Al-Hashimi',
    roles: ['review_manager'],
    password: 'rev2026!',
    title: 'Reputation & Client Review Manager',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  }
];

// Initial Marketing & Ads Settings
export const initialMarketingSettings: MarketingSettings = {
  bannerEnabled: true,
  bannerText: {
    en: '🚀 Q3 2026 Enterprise Grants: Book your Custom ERP & Web App Architecture Review with 0% Setup Fees',
    ar: '🚀 عروض الربع الثالث 2026: احجز استشارة هندسية مجانية لتطوير نظام الـ ERP أو تطبيقك المخصص'
  },
  bannerCtaText: {
    en: 'Claim Free Audit',
    ar: 'احجز الآن'
  },
  bannerUrl: '#estimator',
  seoTitle:
    'Nexora Systems | Custom Web ERP, Portals, Apps, .NET & Cloud Software House',
  seoDescription:
    'Premier enterprise software house specializing in Custom Web ERPs, React & Next.js web portals, .NET Core Web APIs, MSSQL, Kotlin, Swift, Flutter, and AI integrations.',
  focusKeywords:
    'Custom ERP, .NET Core Web API, Next.js, React, MSSQL, Swift iOS, Kotlin Android, Flutter, Software House, Cloud DevOps',
  googleAnalyticsId: 'G-NEXORA2026',
  metaPixelId: '108492049284920',
  linkedInInsightId: '9840291',
  adCampaigns: [
    {
      id: 'ad-1',
      name: 'Google Ads: Enterprise Custom Web ERP (.NET & React)',
      platform: 'Google Ads',
      status: 'active',
      dailyBudget: 120,
      targetRegion: 'GCC (UAE, Saudi Arabia, Qatar, Oman)',
      impressions: 48200,
      clicks: 2150,
      conversions: 84,
      spent: 2480
    },
    {
      id: 'ad-2',
      name: 'LinkedIn B2B: Custom Web Portals & Mobile Apps (CTO / VP Focus)',
      platform: 'LinkedIn B2B',
      status: 'active',
      dailyBudget: 95,
      targetRegion: 'UK, US & Europe',
      impressions: 26400,
      clicks: 980,
      conversions: 42,
      spent: 1890
    },
    {
      id: 'ad-3',
      name: 'Meta Ads: High-Growth Custom Mobile Apps (Swift / Kotlin / Flutter)',
      platform: 'Meta / Facebook',
      status: 'paused',
      dailyBudget: 60,
      targetRegion: 'Global Tech Founders',
      impressions: 19800,
      clicks: 640,
      conversions: 19,
      spent: 720
    }
  ]
};

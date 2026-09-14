import type {
  Project,
  Review,
  ServiceItem,
  GoogleReviewSettings
} from '../types'

export const initialGoogleSettings: GoogleReviewSettings = {
  placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
  syncEnabled: true,
  businessName: 'Nexora Systems Software House & Cloud Operations',
  overallRating: 4.9,
  totalReviewsCount: 148,
  lastSyncTimestamp: 'Just now (Live Verified)',
  googleMapsUrl: 'https://maps.google.com/?q=Nexora+Systems+Software+House'
}

export const initialServices: ServiceItem[] = [
  {
    id: 'odoo-erp',
    category: 'erp',
    iconName: 'Database',
    title: {
      en: 'Enterprise Odoo & Custom ERPs',
      ar: 'أنظمة أودو وتخطيط موارد المؤسسات مخصصة (ERP)'
    },
    tagline: {
      en: 'Unified operations, manufacturing, finance & supply chain',
      ar: 'إدارة متكاملة للعمليات، التصنيع، المحاسبة وسلاسل الإمداد'
    },
    description: {
      en: 'Certified Odoo 16/17 enterprise implementation, custom module development, multi-company accounting, point of sale, and legacy database migration tailored for large-scale operations.',
      ar: 'تطبيق وتخصيص أنظمة أودو المعتمدة وتطوير وحدات برمجية مخصصة، إدارة المحاسبة متعددة الشركات، نقاط البيع، وترحيل قواعد البيانات القديمة لتلائم المؤسسات الكبرى.'
    },
    features: {
      en: [
        'Odoo 16/17 Community & Enterprise Setup',
        'Custom Workflow Modules & API Extensions',
        'Automated Invoicing, VAT & Accounting',
        'Inventory, Warehouse & Barcode Automation',
        'Legacy SAP / Oracle ERP Data Migration'
      ],
      ar: [
        'تثبيت وتكوين أودو 16 و 17 النسخة المجتمعية والمؤسسية',
        'تطوير وحدات وأنظمة سير عمل مخصصة وربط APIs',
        'الفواتير الآلية، ضريبة القيمة المضافة والمحاسبة',
        'أتمتة المخازن والباركود والمستودعات',
        'ترحيل البيانات من أنظمة SAP و Oracle القديمة'
      ]
    },
    technologies: [
      'Odoo 17',
      'Python',
      'PostgreSQL',
      'XML-RPC',
      'Docker',
      'QWeb'
    ],
    badge: {
      en: 'Enterprise Core',
      ar: 'أساسي للمؤسسات'
    }
  },
  {
    id: 'server-devops',
    category: 'cloud',
    iconName: 'Server',
    title: {
      en: '24/7 Server Management & Cloud DevOps',
      ar: 'إدارة السيرفرات والبنية السحابية 24/7 (DevOps)'
    },
    tagline: {
      en: 'Bare-metal, cloud infrastructure, 99.99% uptime SLA',
      ar: 'بنية تحتية سحابية ومادية مع ضمان استمرارية 99.99%'
    },
    description: {
      en: 'End-to-end server architecture, Linux/Windows administration, Kubernetes cluster orchestration, zero-downtime CI/CD deployment pipelines, DDoS mitigation, and 24/7 telemetry monitoring.',
      ar: 'هندسة متكاملة للخوادم، إدارة أنظمة لينكس وويندوز، إدارة كتل Kubernetes، خطوط النشر الآلي CI/CD بدون توقف، الحماية من هجمات DDoS ومراقبة مستمرة على مدار الساعة.'
    },
    features: {
      en: [
        'AWS, Azure, GCP & Bare-Metal Linux Clustering',
        'Kubernetes, Docker & Microservices Orchestration',
        'CI/CD Pipelines (GitHub Actions, GitLab CI)',
        'Zero-Trust Firewall, SSL & DDoS Hardening',
        '24/7 Proactive Uptime Telemetry & Incident Response'
      ],
      ar: [
        'بنية سحابية على AWS و Azure و GCP وسيرفرات مادية',
        'إدارة Kubernetes و Docker والبنى المصغرة',
        'أتمتة خطوط النشر عبر GitHub Actions و GitLab',
        'جدران حماية Zero-Trust وشهادات SSL وحماية DDoS',
        'مراقبة فورية 24/7 واستجابة سريعة لحوادث الخوادم'
      ]
    },
    technologies: [
      'AWS',
      'Ubuntu Server',
      'Kubernetes',
      'Docker',
      'Terraform',
      'Prometheus',
      'Nginx'
    ],
    badge: {
      en: '99.99% SLA',
      ar: 'ضمان 99.99%'
    }
  },
  {
    id: 'mobile-apps',
    category: 'mobile',
    iconName: 'Smartphone',
    title: {
      en: 'Custom Mobile Apps (iOS & Android)',
      ar: 'تطوير تطبيقات الجوال المخصصة (iOS & Android)'
    },
    tagline: {
      en: 'Native Swift, Kotlin & High-Performance Flutter',
      ar: 'تطبيقات أصلية بلغة Swift و Kotlin و Flutter فائقة الأداء'
    },
    description: {
      en: 'Human-centric, frictionless mobile applications engineered for millions of users. Full lifecycle development from intuitive UI/UX design to App Store & Google Play publishing.',
      ar: 'تطبيقات جوال سريعة وتفاعلية مصممة لملايين المستخدمين. دورة تطوير كاملة بدءاً من تصميم واجهة وتجربة المستخدم وحتى النشر على متجري App Store و Google Play.'
    },
    features: {
      en: [
        'Native iOS (Swift & SwiftUI) & Android (Kotlin)',
        'Cross-Platform Apps with Flutter & React Native',
        'Biometric Auth, Apple Pay & Google Pay Integration',
        'Real-Time WebSockets, Push Notifications & Offline Mode',
        'App Store & Play Store Compliance & Publishing'
      ],
      ar: [
        'تطوير أصلي لنظام iOS (SwiftUI) ونظام أندرويد (Kotlin)',
        'تطبيقات متعددة المنصات بواسطة Flutter و React Native',
        'المصادقة البيومترية ودمج Apple Pay و Google Pay',
        'إشعارات فورية ومزامنة حية والعمل بدون إنترنت',
        'الامتثال الكامل لسياسات متجري آبل وجوجل والنشر'
      ]
    },
    technologies: [
      'Flutter',
      'Swift',
      'Kotlin',
      'React Native',
      'Firebase',
      'GraphQL'
    ],
    badge: {
      en: 'App Store Verified',
      ar: 'معتمد للمتاجر'
    }
  },
  {
    id: 'custom-web',
    category: 'web',
    iconName: 'Globe',
    title: {
      en: 'Custom Web Applications & Portals',
      ar: 'تطبيقات ومواقع الويب المخصصة والمنصات الرقمية'
    },
    tagline: {
      en: 'High-throughput enterprise portals & SaaS architectures',
      ar: 'بوابات مؤسسية متقدمة وحلول البرمجيات كخدمة (SaaS)'
    },
    description: {
      en: 'Bespoke web applications built with cutting-edge React, Next.js, Node.js, .NET, and Python stacks. Engineered for lightning performance, SEO dominance, and enterprise-grade data security.',
      ar: 'تطبيقات ويب مخصصة مبنية بأحدث التقنيات: React و Next.js و Node.js و .NET و Python. مصممة لأداء فائق، وتصدر محركات البحث، وأمان بيانات عالي المستوى للمؤسسات.'
    },
    features: {
      en: [
        'Modern React 18, Next.js & TypeScript Frontends',
        'High-Speed RESTful & GraphQL Microservice APIs',
        'Complex Role-Based Access Control (RBAC) & Portals',
        'Real-Time Dashboards, Analytics & Reporting Engines',
        'Enterprise Single Sign-On (SSO / OAuth2 / SAML)'
      ],
      ar: [
        'واجهات أمامية متطورة بـ React 18 و Next.js و TypeScript',
        'واجهات برمجية API سريعة مبنية بالـ REST و GraphQL',
        'إدارة صلاحيات متقدمة وحسابات مستخدمين متعددة المستويات',
        'لوحات تحكم تفاعلية وتقارير وتحليلات بيانية فورية',
        'تسجيل الدخول الموحد SSO و OAuth2 للمؤسسات'
      ]
    },
    technologies: [
      'React 18',
      'Next.js',
      'Node.js',
      '.NET Core',
      'Python',
      'TailwindCSS'
    ],
    badge: {
      en: 'High Velocity',
      ar: 'أداء فائق السرعة'
    }
  },
  {
    id: 'wordpress-cms',
    category: 'wordpress',
    iconName: 'LayoutGrid',
    title: {
      en: 'Custom WordPress & Headless E-Commerce',
      ar: 'تطوير ووردبريس المخصص والمتاجر الإلكترونية'
    },
    tagline: {
      en: 'Bespoke themes, high-security plugins & 95+ Core Web Vitals',
      ar: 'قوالب وإضافات مخصصة، أمان مشدد وسرعة تحميل تفوق 95%'
    },
    description: {
      en: 'Enterprise-grade WordPress engineering with zero bloated page builders. Custom Gutenberg blocks, secure payment gateway integrations, WooCommerce scaling, and multi-currency support.',
      ar: 'تطوير ووردبريس احترافي بمستوى مؤسسي خالٍ من أدوات البناء الثقيلة. كتل Gutenberg مخصصة، بوابات دفع آمنة، توسعة متاجر WooCommerce ودعم العملات المتعددة.'
    },
    features: {
      en: [
        '100% Custom Theme Development (Tailwind / Modern PHP)',
        'Custom Plugin Architecture & API Integrations',
        'WooCommerce Enterprise Scaling & Payment Gateways',
        'Advanced Caching, Redis, Cloudflare CDN & Speed Tuning',
        'Hardened Security, Malware Auditing & Auto-Backups'
      ],
      ar: [
        'تطوير قوالب مخصصة 100% بتقنيات حديثة',
        'برمجة إضافات مخصصة وربط بوابات الدفع الإلكتروني',
        'توسعة متاجر WooCommerce لتتحمل آلاف المنتجات والطلبات',
        'تسريع فائق عبر Redis وتخزين الكاش وشبكة Cloudflare CDN',
        'حماية أمنية مشددة وفحص دوري ونسخ احتياطي تلقائي'
      ]
    },
    technologies: [
      'WordPress',
      'WooCommerce',
      'PHP 8.3',
      'MySQL',
      'Redis',
      'Headless WP'
    ],
    badge: {
      en: 'Speed Optimized',
      ar: 'سرعة فائقة'
    }
  }
]

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    category: 'erp',
    title: {
      en: 'Apex Supply Chain: Multi-Country Odoo 17 Enterprise ERP',
      ar: 'سلاسل إمداد آبيكس: نظام أودو 17 المؤسسي متعدد الدول'
    },
    shortDesc: {
      en: 'Unified multi-entity procurement, inventory barcode automation, and fiscal accounting for an international distributor.',
      ar: 'أتمتة موحدة للمشتريات والمخازن بالباركود والمحاسبة المالية لموزع دولي في 4 دول.'
    },
    fullDesc: {
      en: 'Replaced 3 disparate legacy systems with a customized Odoo 17 Enterprise deployment. Included tailored inventory valuation, automated customs clearance documentation, barcode scanning for 45,000+ SKUs, and real-time ledger synchronization across GCC branches.',
      ar: 'استبدال 3 أنظمة قديمة بنظام Odoo 17 Enterprise مخصص بالكامل. شمل تقييم المخزون المخصص، التوثيق الجمركي الآلي، مسح الباركود لأكثر من 45,000 منتج، ومزامنة دفاتر الحسابات فورياً بين فروع دول الخليج.'
    },
    client: 'Apex Global Logistics & Distribution',
    country: 'UAE & Oman',
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    tags: [
      'Odoo 17',
      'PostgreSQL',
      'Supply Chain',
      'Python',
      'Barcode Automation',
      'Accounting'
    ],
    metrics: [
      {
        label: { en: 'Process Efficiency', ar: 'كفاءة العمليات' },
        value: '+65%'
      },
      {
        label: { en: 'Inventory Accuracy', ar: 'دقة المخزون' },
        value: '99.8%'
      },
      {
        label: { en: 'Reporting Time', ar: 'زمن استخراج التقارير' },
        value: '-80%'
      }
    ],
    featured: true,
    liveUrl: 'https://apex-supply.example.com',
    completionDate: '2026-06'
  },
  {
    id: 'proj-2',
    category: 'cloud',
    title: {
      en: 'FinEdge Core: Multi-Region Kubernetes & 24/7 Cloud Operations',
      ar: 'فين إيدج كور: بنية كوبرنيتس متعددة المناطق وإدارة سحابية 24/7'
    },
    shortDesc: {
      en: 'Mission-critical AWS cloud architecture hosting banking-grade transactions with 99.999% availability.',
      ar: 'بنية سحابية على AWS تدعم المعاملات البنكية بضمان توفر 99.999% دون أي توقف.'
    },
    fullDesc: {
      en: 'Designed and deployed infrastructure-as-code using Terraform and Amazon EKS across 3 AWS regions. Engineered automated Canary deployments, automated failover, WAF rate limiting, Prometheus/Grafana real-time metrics, and round-the-clock incident response handling 4.2M daily requests.',
      ar: 'تصميم وبناء البنية ككود عبر Terraform و Amazon EKS عبر 3 مناطق سحابية. هندسة خطوط نشر تدريجي Canary، تحويل مسار تلقائي عند الأعطال، جدران حماية WAF، ومراقبة ذكية عبر Prometheus لـ 4.2 مليون طلب يومياً.'
    },
    client: 'FinEdge International Payment Gateways',
    country: 'United Kingdom',
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    tags: [
      'AWS',
      'Kubernetes (EKS)',
      'Terraform',
      'CI/CD',
      'Prometheus',
      'DevOps 24/7'
    ],
    metrics: [
      { label: { en: 'Uptime Achieved', ar: 'معدل التوفر' }, value: '99.999%' },
      { label: { en: 'Avg Latency', ar: 'متوسط الاستجابة' }, value: '18ms' },
      {
        label: { en: 'Deploy Frequency', ar: 'معدل التحديث' },
        value: 'Daily CI/CD'
      }
    ],
    featured: true,
    liveUrl: 'https://finedge-cloud.example.com',
    completionDate: '2026-04'
  },
  {
    id: 'proj-3',
    category: 'mobile',
    title: {
      en: 'AuraPay: Biometric Digital Wallet & Cross-Border Remittance',
      ar: 'أورا باي: محفظة رقمية بيومترية والتحويلات المالية الفورية'
    },
    shortDesc: {
      en: 'Native iOS & Android mobile application with instant remittances, virtual debit cards, and bank-grade security.',
      ar: 'تطبيق جوال أصلي لـ iOS و Android للتحويل المالي الفوري والبطاقات الافتراضية بأعلى معايير الأمان المصرفي.'
    },
    fullDesc: {
      en: 'Engineered with Flutter and native platform channels for biometrics (FaceID/TouchID), hardware security module (HSM) encryption, dynamic QR payments, instant P2P transfers, and multi-language support (English and Arabic). Rated 4.9 stars across 80,000+ active app users.',
      ar: 'تم تطويره عبر Flutter مع ربط أصلي للأجهزة للمصادقة بالوجه وبصمة الإصبع، وتشفير عتادي، ودفع عبر رموز QR، وتحويلات P2P فورية، ودعم كامل للغتين العربية والإنجليزية، بتقييم 4.9 نجوم لأكثر من 80,000 مستخدم.'
    },
    client: 'AuraPay Financial Technologies',
    country: 'Saudi Arabia',
    image:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    tags: [
      'Flutter',
      'iOS / Swift',
      'Android / Kotlin',
      'Fintech',
      'Biometrics',
      'REST API'
    ],
    metrics: [
      { label: { en: 'Active Users', ar: 'مستخدم نشط' }, value: '80K+' },
      {
        label: { en: 'App Store Rating', ar: 'تقييم المتاجر' },
        value: '4.9 ★'
      },
      {
        label: { en: 'Tx Settlement Time', ar: 'زمن المعاملة' },
        value: '< 1.2s'
      }
    ],
    featured: true,
    liveUrl: 'https://aurapay.example.com',
    completionDate: '2026-02'
  },
  {
    id: 'proj-4',
    category: 'web',
    title: {
      en: 'OmniDesk: Real-Time Enterprise Operations & BI Analytics',
      ar: 'أومني ديسك: منصة إدارة العمليات المؤسسية والذكاء التحليلي'
    },
    shortDesc: {
      en: 'High-throughput enterprise management dashboard with live fleet telematics and predictive KPI forecasting.',
      ar: 'لوحة تحكم تشغيلية كبرى تجمع بين تتبع الأساطيل المباشر والتنبؤ الذكي بالمؤشرات الرئيسية.'
    },
    fullDesc: {
      en: 'Developed with React 18, TypeScript, Tailwind, and a high-performance Python FastAPI backend. Integrated WebSockets for real-time equipment status, interactive geospatial maps, role-based access control, and automated monthly executive PDF generation.',
      ar: 'مبنية بتقنيات React 18 و TypeScript ومحرك Python FastAPI فائق السرعة. ربط مباشر عبر WebSockets لحالة المعدات الحية، خرائط جغرافية تفاعلية، صلاحيات دقيقة للمستخدمين وإصدار تقارير تنفيذية دورية.'
    },
    client: 'Stellar Technical Operations',
    country: 'Oman',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    tags: [
      'React 18',
      'TypeScript',
      'FastAPI',
      'PostgreSQL',
      'WebSockets',
      'TailwindCSS'
    ],
    metrics: [
      {
        label: { en: 'Telemetry Data Points', ar: 'نقاط بيانات حية' },
        value: '10M+/day'
      },
      {
        label: { en: 'Query Speedup', ar: 'تسريع الاستعلامات' },
        value: '4.8x'
      },
      { label: { en: 'Operating Cost', ar: 'التوفير التشغيلي' }, value: '-35%' }
    ],
    featured: true,
    liveUrl: 'https://omnidesk-bi.example.com',
    completionDate: '2026-05'
  },
  {
    id: 'proj-5',
    category: 'wordpress',
    title: {
      en: 'Velox Motorworks: High-Speed Custom WooCommerce & Headless Portal',
      ar: 'فيلوكس موتوروركس: متجر ووكومرس فائق السرعة وبوابة مخصصة'
    },
    shortDesc: {
      en: 'Bespoke custom WordPress theme with 98% Google PageSpeed score and automated ERP inventory sync.',
      ar: 'قالب ووردبريس مخصص 100% حقق سرعة 98% على Google PageSpeed مع ربط المخزون تلقائياً بالـ ERP.'
    },
    fullDesc: {
      en: 'Created an ultra-modern corporate presence and digital catalog for a premium performance brand. Replaced slow third-party builders with lightweight custom Gutenberg blocks, Redis object cache, multi-currency checkout, and direct webhook sync to Odoo inventory.',
      ar: 'إنشاء بوابة رقمية ومتجر فاخر خالٍ من أي بطء أو قوالب تجارية ثقيلة. اعتمد على كتل Gutenberg خفيفة، وتخزين كاش Redis، ودفع متعدد العملات، مع ربط كامل بمخازن Odoo عبر الـ Webhooks.'
    },
    client: 'Velox Luxury Automotive Group',
    country: 'Germany / GCC',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    tags: [
      'WordPress',
      'WooCommerce',
      'TailwindCSS',
      'Redis',
      'PageSpeed 98%',
      'Odoo Sync'
    ],
    metrics: [
      {
        label: { en: 'Google PageSpeed', ar: 'سرعة التصفح' },
        value: '98 / 100'
      },
      {
        label: { en: 'Checkout Conversion', ar: 'زيادة التحويل' },
        value: '+42%'
      },
      {
        label: { en: 'Server Response', ar: 'استجابة السيرفر' },
        value: '110ms'
      }
    ],
    featured: false,
    liveUrl: 'https://velox-motors.example.com',
    completionDate: '2026-03'
  }
]

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    authorName: 'Tariq Al-Mansoor',
    authorRole: 'Chief Operating Officer',
    company: 'Apex Global Logistics (Dubai)',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content: {
      en: 'Nexora Systems completely transformed our operations. Their custom Odoo 17 ERP implementation migrated 45,000 SKUs across 4 international branches without an hour of downtime. Their server and database engineering is unmatched in the region.',
      ar: 'نظام نيكسورا غيّر كفاءة عملياتنا التشغيلية جذرياً. تطبيق نظام Odoo 17 وترحيل أكثر من 45,000 منتج في 4 فروع دولية تم دون توقف ثانية واحدة. خبرتهم في إدارة السيرفرات وقواعد البيانات تفوق التوقعات.'
    },
    date: '2 weeks ago',
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
      en: 'Finding a software house that excels equally at cloud server DevOps (Kubernetes/AWS) and custom mobile app development is exceptionally rare. Nexora Systems handled our 24/7 cluster management with zero incidents and engineered our biometric iOS/Android app with perfection.',
      ar: 'من النادر جداً العثور على بيت برمجيات يجمع بين الاحتراف المطلق في إدارة السيرفرات السحابية (Kubernetes و AWS) وتطوير تطبيقات الجوال المعقدة. فريق نيكسورا أدار خوادمنا بنسبة توفر 100% وطوّر تطبيقنا المالي بأعلى دقة.'
    },
    date: '1 month ago',
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
      en: 'We contracted Nexora Systems for a bespoke enterprise portal and WordPress commerce setup. Their attention to detail, bilingual Arabic/English execution, and lightning-fast loading speeds on mobile devices made them our permanent technology partner.',
      ar: 'تعاقدنا مع نيكسورا لتطوير منصة مؤسسية مخصصة وبوابة ووردبريس تجارية. الاهتمام الشديد بالتفاصيل، ودعم اللغة العربية والإنجليزية بشكل متميز، والسرعة الفائقة للتصفح جعلهم شريكنا التقني الدائم.'
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
    company: 'Vance Capital Partners',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content: {
      en: 'Outstanding engineering team. They delivered our iOS & Android portfolio management applications on schedule with bank-grade encryption and a stunning UI. Our clients love the fluidity and speed.',
      ar: 'فريق هندسي استثنائي. سلّموا تطبيقات إدارة المحافظ الاستثمارية لـ iOS و Android في الموعد المحدد مع تشفير بمستوى بنكي وتصميم مبهر. عملاؤنا معجبون جداً بالسرعة والسلاسة.'
    },
    date: '2 months ago',
    isGoogleReview: true,
    googleReviewUrl: 'https://maps.google.com/?q=Nexora+Systems',
    verified: true
  }
]

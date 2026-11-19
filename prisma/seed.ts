import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Neon database...');

  // 1. Projects
  const count = await prisma.project.count();
  if (count === 0) {

  const projectsToSeed = [
    {
      titleEn: 'NexCore ERP: Multi-Entity Enterprise Web Portal & Financials',
      titleAr: 'نيكس كور: منصة الـ ERP السحابية والبوابة المؤسسية متعددة الكيانات',
      category: 'ERP',
      clientName: 'Al-Madar Logistics & Global Trade',
      region: 'UAE, Saudi Arabia & Oman',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      hasLiveDemo: true,
      liveDemoUrl: 'https://demo-erp.nexora.io',
      techStack: ['.NET Core Web API', 'Next.js', 'React.js', 'MSSQL Server', 'Redis Cache', 'REST APIs'],
    },
    {
      titleEn: 'OmniPortal: GCC Cross-Border Customs & Port Logistics Hub',
      titleAr: 'أومني بورتال: بوابة التخليص الجمركي والخدمات اللوجستية للموانئ',
      category: 'WEB',
      clientName: 'Apex Trans-Gulf Terminals',
      region: 'Saudi Arabia & Bahrain',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      hasLiveDemo: true,
      liveDemoUrl: 'https://omniportal.nexora.io',
      techStack: ['Next.js 15', 'ASP.NET Core', 'MSSQL Database', 'Customs REST API', 'Azure Cloud'],
    },
    {
      titleEn: 'AuraPay: Enterprise Multi-Currency B2B Treasury & Escrow App',
      titleAr: 'أورا باي: تطبيق الخزينة والدفع والضمان التجاري للشركات B2B',
      category: 'MOBILE',
      clientName: 'Dinar Capital Group',
      region: 'Kuwait & UAE',
      imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
      hasLiveDemo: true,
      liveDemoUrl: 'https://aurapay.nexora.io',
      techStack: ['iOS (Swift)', 'Android (Kotlin)', '.NET Core Web API', 'MSSQL Always-On', 'Biometric Security'],
    },
    {
      titleEn: 'IntelliPulse: Predictive Freight Demand & Dynamic Tariff AI',
      titleAr: 'إنتلي بالس: محرك الذكاء الاصطناعي للتنبؤ بحجم الشحن والتسعير الديناميكي',
      category: 'AI',
      clientName: 'RedSea Maritime Carriers',
      region: 'Egypt & Saudi Arabia',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      hasLiveDemo: true,
      liveDemoUrl: 'https://intellipulse.nexora.io',
      techStack: ['Python AI', '.NET Core API', 'FastAPI', 'MSSQL Analytics', 'React Dashboard'],
    },
    {
      titleEn: 'FinEdge Core: Resilient Zero-Trust Cloud Infrastructure Migration',
      titleAr: 'فين إيدج كور: ترحيل وإعادة هندسة البنية التحتية السحابية المصرفية',
      category: 'CLOUD',
      clientName: 'Crescent Securities Group',
      region: 'Qatar & UAE',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      hasLiveDemo: false,
      liveDemoUrl: null,
      techStack: ['AWS / Azure', 'Terraform', 'Docker & K8s', 'MSSQL High-Availability', 'Zero-Trust'],
    },
    {
      titleEn: 'Apex Logistics: Multi-Warehouse Inventory & Dispatch ERP',
      titleAr: 'أبيكس لوجستيكس: نظام ERP لإدارة المستودعات وسلاسل التوريد والتوزيع',
      category: 'ERP',
      clientName: 'Al-Haramain Retail Network',
      region: 'Oman & Saudi Arabia',
      imageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80',
      hasLiveDemo: true,
      liveDemoUrl: 'https://apex-logistics.nexora.io',
      techStack: ['.NET Core Web API', 'Next.js', 'MSSQL Server', 'Redis Distributed Lock', 'Barcode Engine'],
    },
  ];

    for (const project of projectsToSeed) {
      await prisma.project.create({ data: project });
    }

    console.log(`Seeded ${projectsToSeed.length} projects successfully to Neon.`);
  } else {
    console.log(`Database already contains ${count} projects.`);
  }

  // 2. Seed Reviews
  const reviewCount = await prisma.review.count();
  if (reviewCount === 0) {
    const reviewsToSeed = [
      {
        clientName: 'Rashid Al-Falasi',
        role: 'Chief Technology Officer',
        company: 'Trans-Gulf Maritime Logistics',
        location: 'Dubai, UAE',
        rating: 5,
        reviewText: 'Nexora engineered our mission-critical customs & multi-port ERP from scratch on .NET 9 and MSSQL. Their microsecond real-time sync with GCC customs APIs eliminated our 14-hour cargo dispatch bottlenecks. Best engineering team in the region.',
        hasVideo: true,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42994-large.mp4',
        verified: true,
        featured: false,
        techCategory: 'dotnet',
      },
      {
        clientName: 'Julian Sterling',
        role: 'VP of Engineering',
        company: 'Vanguard Global Trade & FinTech',
        location: 'London, UK',
        rating: 5,
        reviewText: 'Their Odoo enterprise customization combined with custom Python backend bridges completely streamlined our cross-border inventory and multi-currency ledgers. Absolute tier-one execution with zero post-launch regressions.',
        hasVideo: true,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42994-large.mp4',
        verified: true,
        featured: true,
        techCategory: 'odoo',
      },
      {
        clientName: 'Tariq Al-Said',
        role: 'Head of Digital Infrastructure',
        company: 'Sultanate Trading & Contracting',
        location: 'Muscat, Oman',
        rating: 5,
        reviewText: 'The predictive AI engine and custom web ERP built by Nexora handles 45,000+ daily orders with sub-second response times. Their team’s transparency, speed, and PostgreSQL data replication architecture are unmatched.',
        hasVideo: false,
        videoUrl: null,
        verified: true,
      },
      {
        clientName: 'Eng. Fahad Al-Mutawa',
        role: 'Group Enterprise Architect',
        company: 'Gulf Horizon Petrochemical Logistics',
        location: 'Riyadh, Saudi Arabia',
        rating: 5,
        reviewText: 'Our previous monolithic ERP was causing millions in delayed dispatches. Nexora replaced it with a modern Next.js 15 and .NET Core architecture with distributed Redis caching. 99.999% uptime achieved across all GCC sites.',
        hasVideo: false,
        videoUrl: null,
        verified: true,
      },
      {
        clientName: 'Soraya Haddad',
        role: 'Chief Operating Officer',
        company: 'Levant & Med Logistics Alliance',
        location: 'Dubai & Beirut',
        rating: 5,
        reviewText: 'From native mobile drivers apps in Swift & Kotlin to automated financial audits, Nexora delivered exactly on schedule and within budget. Their executive engineering support is world class.',
        hasVideo: true,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42994-large.mp4',
        verified: true,
      },
      {
        clientName: 'Marcus Vance',
        role: 'Director of Technology',
        company: 'Meridian Capital Assets',
        location: 'London, UK',
        rating: 5,
        reviewText: 'Flawless zero-trust cloud migration and PostgreSQL data synchronization. The Nexora team thinks like enterprise partners rather than mere contractors.',
        hasVideo: false,
        videoUrl: null,
        verified: true,
      },
    ];

    for (const r of reviewsToSeed) {
      await prisma.review.create({ data: r });
    }
    console.log(`Seeded ${reviewsToSeed.length} reviews successfully to Neon.`);
  }

  // 3. Seed Engineering Leadership
  const teamCount = await prisma.teamMember.count();
  if (teamCount === 0) {
    const teamToSeed = [
      {
        name: 'Farhan M. Tariq',
        role: 'Chief Systems Architect & Co-Founder',
        bio: '12+ years engineering mission-critical ERPs, high-throughput .NET Core microservices, and distributed cloud backends for enterprise networks across the GCC and Europe.',
        linkedinUrl: 'https://www.linkedin.com/',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        displayOrder: 1,
      },
      {
        name: 'Dr. Zaid Al-Nuaimi',
        role: 'Principal ERP & Odoo Solutions Architect',
        bio: 'Authority in Odoo enterprise modernization, custom Python ORM engines, and high-concurrency PostgreSQL / MSSQL data synchronization pipelines.',
        linkedinUrl: 'https://www.linkedin.com/',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        displayOrder: 2,
      },
      {
        name: 'Elena Rostova',
        role: 'Head of Mobile & Edge Engineering',
        bio: 'Specialist in native iOS (Swift) & Android (Kotlin) high-security fintech applications with biometric encryption, offline-first sync, and Apple Pay integrations.',
        linkedinUrl: 'https://www.linkedin.com/',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        displayOrder: 3,
      },
      {
        name: 'Kareem Mansour',
        role: 'Director of AI & Distributed Systems',
        bio: 'Leads predictive demand neural models, automated LLM enterprise workflow agents, and zero-downtime Kubernetes infrastructure.',
        linkedinUrl: 'https://www.linkedin.com/',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        displayOrder: 4,
      },
    ];

    for (const member of teamToSeed) {
      await prisma.teamMember.create({ data: member });
    }
    console.log(`Seeded ${teamToSeed.length} leadership members successfully to Neon.`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

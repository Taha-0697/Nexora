import { prisma } from '../lib/prisma.ts';

export interface FormattedProject {
  id: string;
  titleEn: string;
  titleAr: string;
  title: {
    en: string;
    ar: string;
  };
  category: string;
  clientName: string;
  client: string;
  region: string;
  country: string;
  imageUrl: string;
  image: string;
  hasLiveDemo: boolean;
  liveDemoUrl: string | null;
  liveUrl: string;
  techStack: string[];
  tags: string[];
  shortDesc: {
    en: string;
    ar: string;
  };
  fullDesc: {
    en: string;
    ar: string;
  };
  metrics: Array<{
    label: { en: string; ar: string };
    value: string;
  }>;
  featured: boolean;
  completionDate: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export function formatProject(p: any): FormattedProject {
  const techStack = Array.isArray(p.techStack)
    ? p.techStack
    : typeof p.techStack === 'string'
    ? p.techStack.split(',').map((t: string) => t.trim()).filter(Boolean)
    : [];

  const titleEn = p.titleEn || p.title?.en || 'Untitled Deliverable';
  const titleAr = p.titleAr || p.title?.ar || titleEn;
  const clientName = p.clientName || p.client || 'Enterprise Partner';
  const region = p.region || p.country || 'GCC / UAE';
  const imageUrl =
    p.imageUrl ||
    p.image ||
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';
  const liveDemoUrl = p.liveDemoUrl || p.liveUrl || null;
  const hasLiveDemo = Boolean(p.hasLiveDemo ?? Boolean(liveDemoUrl));
  const category = (p.category || 'erp').toLowerCase();

  return {
    id: p.id,
    titleEn,
    titleAr,
    title: {
      en: titleEn,
      ar: titleAr,
    },
    category,
    clientName,
    client: clientName,
    region,
    country: region,
    imageUrl,
    image: imageUrl,
    hasLiveDemo,
    liveDemoUrl,
    liveUrl: hasLiveDemo && liveDemoUrl ? liveDemoUrl : '',
    techStack,
    tags: techStack,
    shortDesc: p.shortDesc && typeof p.shortDesc === 'object'
      ? {
          en: p.shortDesc.en || `${category.toUpperCase()} solution engineered for ${clientName}.`,
          ar: p.shortDesc.ar || `منظومة ${category.toUpperCase()} تم تطويرها لـ ${clientName}.`,
        }
      : {
          en: `${category.toUpperCase()} solution engineered for ${clientName} in ${region}.`,
          ar: `منظومة ${category.toUpperCase()} تم تطويرها لصالح ${clientName} في ${region}.`,
        },
    fullDesc: p.fullDesc && typeof p.fullDesc === 'object'
      ? {
          en: p.fullDesc.en || `Enterprise architecture engineered for ${clientName}.`,
          ar: p.fullDesc.ar || `بنية تحتية سحابية مخصصة لـ ${clientName}.`,
        }
      : {
          en: `Custom enterprise-grade solution built for ${clientName} (${region}). Engineered with ${techStack.join(', ')}.`,
          ar: `حل برمجي مؤسسي متكامل تم تنفيذه لـ ${clientName} (${region}). التقنيات: ${techStack.join(', ')}.`,
        },
    metrics: Array.isArray(p.metrics) && p.metrics.length > 0
      ? p.metrics
      : [
          { label: { en: 'Processing Speed', ar: 'سرعة العمليات' }, value: '+65%' },
          { label: { en: 'Accuracy & Uptime', ar: 'الدقة والجاهزية' }, value: '99.9%' },
          { label: { en: 'Efficiency Gain', ar: 'معدل الكفاءة' }, value: '+80%' },
        ],
    featured: p.featured !== undefined ? Boolean(p.featured) : true,
    completionDate: p.completionDate || (p.createdAt ? new Date(p.createdAt).toISOString().slice(0, 7) : '2026-06'),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs = 8000,
  errorMsg = 'Database query timed out. Please verify DATABASE_URL in .env points to an active Neon PostgreSQL instance.'
): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(errorMsg)), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer);
  }
}

export async function getAllProjects() {
  const records = await withTimeout(
    prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  );
  return records.map(formatProject);
}

export async function createProjectRecord(data: any) {
  const titleEn = String(data.titleEn || data.title?.en || '').trim();
  if (!titleEn) {
    throw new Error('Title (English) is required.');
  }

  const titleAr = String(data.titleAr || data.title?.ar || titleEn).trim();
  const category = String(data.category || 'ERP').toUpperCase();
  const clientName = String(data.clientName || data.client || 'Enterprise Partner').trim();
  const region = String(data.region || data.country || 'UAE / GCC').trim();
  const imageUrl = String(
    data.imageUrl ||
      data.image ||
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
  ).trim();

  const liveDemoUrl = data.liveDemoUrl || data.liveUrl ? String(data.liveDemoUrl || data.liveUrl).trim() : null;
  const hasLiveDemo = Boolean(data.hasLiveDemo !== undefined ? data.hasLiveDemo : Boolean(liveDemoUrl));

  let techStack: string[] = [];
  if (Array.isArray(data.techStack)) {
    techStack = data.techStack.map(String).map((s: string) => s.trim()).filter(Boolean);
  } else if (Array.isArray(data.tags)) {
    techStack = data.tags.map(String).map((s: string) => s.trim()).filter(Boolean);
  } else if (typeof data.techStack === 'string') {
    techStack = data.techStack.split(',').map((s: string) => s.trim()).filter(Boolean);
  } else if (typeof data.tags === 'string') {
    techStack = data.tags.split(',').map((s: string) => s.trim()).filter(Boolean);
  }

  if (techStack.length === 0) {
    techStack = ['React', 'PostgreSQL', 'REST API'];
  }

  const created = await withTimeout(
    prisma.project.create({
      data: {
        titleEn,
        titleAr,
        category,
        clientName,
        region,
        imageUrl,
        hasLiveDemo,
        liveDemoUrl,
        techStack,
      },
    })
  );

  return formatProject(created);
}

export async function deleteProjectRecord(id: string) {
  if (!id) {
    throw new Error('Project ID is required.');
  }

  await withTimeout(
    prisma.project.delete({
      where: { id },
    })
  );

  return { success: true, message: `Project ${id} deleted successfully.` };
}

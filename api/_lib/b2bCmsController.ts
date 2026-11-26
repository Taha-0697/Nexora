import { prisma } from './prisma.js';

// --- B2B CLIENT LOGOS ---
export async function getAllB2bLogos() {
  return await prisma.b2bClientLogo.findMany({
    orderBy: { displayOrder: 'asc' },
  });
}

// Helper to enforce mutually exclusive single destination link per client logo
function resolveLogoLinkFields(data: any): {
  linkType: 'none' | 'website' | 'case_study';
  websiteUrl: string | null;
  caseStudySlug: string | null;
  caseStudyId: string | null;
} {
  const rawType = String(data.linkType || '').toLowerCase();
  let linkType: 'none' | 'website' | 'case_study' = 'none';
  if (rawType === 'website' || (!rawType && data.websiteUrl)) {
    linkType = 'website';
  } else if (rawType === 'case_study' || (!rawType && (data.caseStudySlug || data.caseStudyId))) {
    linkType = 'case_study';
  }

  if (linkType === 'website') {
    let url = data.websiteUrl ? String(data.websiteUrl).trim() : '';
    if (url && !/^https?:\/\//i.test(url) && !url.startsWith('/') && !url.startsWith('#')) {
      url = `https://${url}`;
    }
    return {
      linkType: url ? 'website' : 'none',
      websiteUrl: url || null,
      caseStudySlug: null,
      caseStudyId: null,
    };
  }

  if (linkType === 'case_study') {
    const slug = data.caseStudySlug ? String(data.caseStudySlug).trim() : null;
    const csId = data.caseStudyId ? String(data.caseStudyId).trim() : null;
    return {
      linkType: slug || csId ? 'case_study' : 'none',
      websiteUrl: null,
      caseStudySlug: slug,
      caseStudyId: csId,
    };
  }

  return {
    linkType: 'none',
    websiteUrl: null,
    caseStudySlug: null,
    caseStudyId: null,
  };
}

export async function createB2bLogo(data: any) {
  const companyName = String(data.companyName || data.name || 'Enterprise Client').trim();
  const logoUrl = String(data.logoUrl || data.imageUrl || '').trim();
  const linkFields = resolveLogoLinkFields(data);

  return await prisma.b2bClientLogo.create({
    data: {
      companyName,
      tagline: data.tagline ? String(data.tagline).trim() : null,
      category: data.category ? String(data.category).trim() : null,
      logoUrl: logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      logoSvg: data.logoSvg || null,
      linkType: linkFields.linkType,
      websiteUrl: linkFields.websiteUrl,
      caseStudySlug: linkFields.caseStudySlug,
      caseStudyId: linkFields.caseStudyId,
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : (typeof data.order === 'number' ? data.order : 0),
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : (data.active !== undefined ? Boolean(data.active) : true),
    },
  });
}

export async function updateB2bLogo(id: string, data: any) {
  if (!id) throw new Error('Logo ID is required.');
  const updateData: any = {};

  if (data.companyName !== undefined || data.name !== undefined) {
    updateData.companyName = data.companyName || data.name;
  }
  if (data.tagline !== undefined) updateData.tagline = data.tagline;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.logoUrl !== undefined || data.imageUrl !== undefined) {
    updateData.logoUrl = data.logoUrl || data.imageUrl;
  }
  if (data.logoSvg !== undefined) updateData.logoSvg = data.logoSvg;

  if (
    data.linkType !== undefined ||
    data.websiteUrl !== undefined ||
    data.caseStudySlug !== undefined ||
    data.caseStudyId !== undefined
  ) {
    const linkFields = resolveLogoLinkFields(data);
    updateData.linkType = linkFields.linkType;
    updateData.websiteUrl = linkFields.websiteUrl;
    updateData.caseStudySlug = linkFields.caseStudySlug;
    updateData.caseStudyId = linkFields.caseStudyId;
  }

  if (data.displayOrder !== undefined || data.order !== undefined) {
    updateData.displayOrder = typeof data.displayOrder === 'number' ? data.displayOrder : data.order;
  }
  if (data.isActive !== undefined || data.active !== undefined) {
    updateData.isActive = data.isActive !== undefined ? Boolean(data.isActive) : Boolean(data.active);
  }

  return await prisma.b2bClientLogo.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteB2bLogo(id: string) {
  if (!id) throw new Error('Logo ID is required.');
  const deleted = await prisma.b2bClientLogo.delete({
    where: { id },
  });
  return { success: true, deletedId: deleted.id };
}

// --- B2B CASE STUDIES ---
export async function getAllB2bCaseStudies() {
  return await prisma.b2bCaseStudy.findMany({
    orderBy: { displayOrder: 'asc' },
  });
}

export async function createB2bCaseStudy(data: any) {
  const title = String(data.title || 'Untitled Case Study').trim();
  const clientName = String(data.clientName || data.client || 'Enterprise Partner').trim();

  let impactMetrics: string[] = [];
  if (Array.isArray(data.impactMetrics)) {
    impactMetrics = data.impactMetrics.map(String).filter(Boolean);
  } else if (typeof data.impactMetrics === 'string') {
    impactMetrics = data.impactMetrics.split(',').map((s: string) => s.trim()).filter(Boolean);
  }

  let techStack: string[] = [];
  if (Array.isArray(data.techStack)) {
    techStack = data.techStack.map(String).filter(Boolean);
  } else if (typeof data.techStack === 'string') {
    techStack = data.techStack.split(',').map((s: string) => s.trim()).filter(Boolean);
  }

  return await prisma.b2bCaseStudy.create({
    data: {
      title,
      slug: data.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      clientName,
      industry: data.industry || 'Enterprise Logistics',
      categoryTag: data.categoryTag || 'ERP Modernization',
      serviceField: data.serviceField || 'Custom Web ERP (.NET Core)',
      summary: data.summary || '',
      challenge: data.challenge || '',
      solution: data.solution || '',
      outcomeHighlight: data.outcomeHighlight || '',
      impactMetrics,
      techStack,
      coverImageUrl: data.coverImageUrl || data.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      storyUrl: data.storyUrl || '#',
      isHero: Boolean(data.isHero),
      isStacked: Boolean(data.isStacked),
      stackedPosition: data.stackedPosition ? Number(data.stackedPosition) : null,
      isProprietary: Boolean(data.isProprietary),
      demoProductName: data.demoProductName || null,
      bookDemoUrl: data.bookDemoUrl || null,
      isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : false,
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : (typeof data.order === 'number' ? data.order : 0),
    },
  });
}

export async function updateB2bCaseStudy(id: string, data: any) {
  if (!id) throw new Error('Case study ID is required.');
  const updateData: any = {};

  if (data.title !== undefined) updateData.title = String(data.title).trim();
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.clientName !== undefined || data.client !== undefined) {
    updateData.clientName = data.clientName || data.client;
  }
  if (data.industry !== undefined) updateData.industry = data.industry;
  if (data.categoryTag !== undefined) updateData.categoryTag = data.categoryTag;
  if (data.serviceField !== undefined) updateData.serviceField = data.serviceField;
  if (data.summary !== undefined) updateData.summary = data.summary;
  if (data.challenge !== undefined) updateData.challenge = data.challenge;
  if (data.solution !== undefined) updateData.solution = data.solution;
  if (data.outcomeHighlight !== undefined) updateData.outcomeHighlight = data.outcomeHighlight;
  if (data.coverImageUrl !== undefined || data.imageUrl !== undefined) {
    updateData.coverImageUrl = data.coverImageUrl || data.imageUrl;
  }
  if (data.storyUrl !== undefined) updateData.storyUrl = data.storyUrl;
  if (data.isHero !== undefined) updateData.isHero = Boolean(data.isHero);
  if (data.isStacked !== undefined) updateData.isStacked = Boolean(data.isStacked);
  if (data.stackedPosition !== undefined) updateData.stackedPosition = data.stackedPosition ? Number(data.stackedPosition) : null;
  if (data.isProprietary !== undefined) updateData.isProprietary = Boolean(data.isProprietary);
  if (data.demoProductName !== undefined) updateData.demoProductName = data.demoProductName;
  if (data.bookDemoUrl !== undefined) updateData.bookDemoUrl = data.bookDemoUrl;
  if (data.isFeatured !== undefined) updateData.isFeatured = Boolean(data.isFeatured);
  if (data.isPublished !== undefined) updateData.isPublished = Boolean(data.isPublished);
  if (data.displayOrder !== undefined || data.order !== undefined) {
    updateData.displayOrder = typeof data.displayOrder === 'number' ? data.displayOrder : data.order;
  }

  if (data.impactMetrics !== undefined) {
    updateData.impactMetrics = Array.isArray(data.impactMetrics)
      ? data.impactMetrics.map(String).filter(Boolean)
      : String(data.impactMetrics).split(',').map((s: string) => s.trim()).filter(Boolean);
  }

  if (data.techStack !== undefined) {
    updateData.techStack = Array.isArray(data.techStack)
      ? data.techStack.map(String).filter(Boolean)
      : String(data.techStack).split(',').map((s: string) => s.trim()).filter(Boolean);
  }

  return await prisma.b2bCaseStudy.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteB2bCaseStudy(id: string) {
  if (!id) throw new Error('Case study ID is required.');
  const deleted = await prisma.b2bCaseStudy.delete({
    where: { id },
  });
  return { success: true, deletedId: deleted.id };
}

// --- B2B MARQUEE SETTINGS ---
export async function getB2bMarqueeSettings() {
  let settings = await prisma.b2bMarqueeSettings.findUnique({
    where: { sectionKey: 'b2b_logos' },
  });
  if (!settings) {
    settings = await prisma.b2bMarqueeSettings.create({
      data: {
        sectionKey: 'b2b_logos',
        isPlaying: true,
        direction: 'ltr',
        speedSeconds: 30,
        pauseOnHover: true,
        gapPx: 48,
        headingText: 'Trusted by engineering & operations leaders worldwide',
      },
    });
  }
  return settings;
}

export async function updateB2bMarqueeSettings(data: any) {
  const updateData: any = {};
  if (data.isPlaying !== undefined || data.isPaused !== undefined) {
    updateData.isPlaying = data.isPlaying !== undefined ? Boolean(data.isPlaying) : !Boolean(data.isPaused);
  }
  if (data.direction !== undefined) updateData.direction = String(data.direction);
  if (data.speedSeconds !== undefined || data.speed !== undefined) {
    updateData.speedSeconds = Number(data.speedSeconds || data.speed) || 30;
  }
  if (data.pauseOnHover !== undefined) updateData.pauseOnHover = Boolean(data.pauseOnHover);
  if (data.gapPx !== undefined) updateData.gapPx = Number(data.gapPx) || 48;
  if (data.headingText !== undefined) updateData.headingText = String(data.headingText);

  return await prisma.b2bMarqueeSettings.upsert({
    where: { sectionKey: 'b2b_logos' },
    update: updateData,
    create: {
      sectionKey: 'b2b_logos',
      isPlaying: updateData.isPlaying !== undefined ? updateData.isPlaying : true,
      direction: updateData.direction || 'ltr',
      speedSeconds: updateData.speedSeconds || 30,
      pauseOnHover: updateData.pauseOnHover !== undefined ? updateData.pauseOnHover : true,
      gapPx: updateData.gapPx || 48,
      headingText: updateData.headingText || 'Trusted by engineering & operations leaders worldwide',
    },
  });
}

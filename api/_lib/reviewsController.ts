import { prisma } from './prisma.js';

export interface FormattedReview {
  id: string;
  authorName: string;
  authorId?: string | null;
  authorEmail?: string | null;
  clientName: string;
  authorRole: string;
  role: string;
  company: string;
  location: string;
  avatar: string;
  rating: number;
  content: {
    en: string;
    ar: string;
  };
  reviewText: string;
  reviewTextAr?: string | null;
  date: string;
  hasVideo: boolean;
  videoUrl: string | null;
  verified: boolean;
  featured: boolean;
  isVisible: boolean; // Display on public website
  techCategory: string; // 'dotnet' | 'odoo' | 'general'
  isGoogleReview: boolean;
  googleReviewUrl?: string;
  createdAt?: Date | string;
}

export function formatReview(r: any): FormattedReview {
  const authorName = r.authorName || r.clientName || 'Verified Client';
  const authorRole = r.authorRole || r.role || 'Enterprise Partner';
  const authorId = r.authorId || null;
  const authorEmail = r.authorEmail || null;
  const company = r.company || 'Enterprise Partner';
  const location = r.location || 'GCC';
  const rating = Number(r.rating) || 5;
  const reviewText = (r.reviewText || (typeof r.content === 'object' ? r.content.en : r.content) || '')
    .replace(/Odoo 17/g, 'Odoo');
  const reviewTextAr = (r.reviewTextAr || r.contentAr || (typeof r.content === 'object' ? r.content.ar : '') || reviewText)
    .replace(/Odoo 17/g, 'Odoo');
  const hasVideo = Boolean(r.hasVideo);
  const videoUrl = r.videoUrl || (hasVideo ? 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42994-large.mp4' : null);
  const verified = r.verified !== undefined ? Boolean(r.verified) : true;
  const featured = Boolean(r.featured);
  const isVisible = r.isVisible !== undefined ? Boolean(r.isVisible) : true;
  const techCategory = r.techCategory || (reviewText.toLowerCase().includes('odoo') ? 'odoo' : (reviewText.toLowerCase().includes('.net') ? 'dotnet' : 'general'));
  const isGoogleReview = r.isGoogleReview !== undefined ? Boolean(r.isGoogleReview) : true;
  
  // Clean avatars
  const avatar = r.avatar || r.avatarUrl || `https://images.unsplash.com/photo-${
    hasVideo ? '1534528741775-53994a69daeb' : '1507003211169-0a1dd7228f2d'
  }?auto=format&fit=crop&w=200&q=80`;

  const dateFormatted = r.createdAt 
    ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recent';

  return {
    id: r.id,
    authorName,
    authorId,
    authorEmail,
    clientName: authorName,
    authorRole,
    role: authorRole,
    company,
    location,
    avatar,
    rating,
    content: {
      en: reviewText,
      ar: reviewTextAr,
    },
    reviewText,
    reviewTextAr,
    date: dateFormatted,
    hasVideo,
    videoUrl,
    verified,
    featured,
    isVisible,
    techCategory,
    isGoogleReview,
    googleReviewUrl: r.googleReviewUrl || 'https://maps.google.com/?q=Nexora+Systems',
    createdAt: r.createdAt,
  };
}

export async function getAllReviews() {
  try {
    const raw = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return raw.map(formatReview);
  } catch (err: any) {
    console.error('Error in getAllReviews:', err);
    throw err;
  }
}

export async function createReviewRecord(data: any) {
  const authorName = String(data.authorName || data.clientName || 'Enterprise Partner').trim();
  const authorRole = String(data.authorRole || data.role || 'Engineering Leader').trim();
  const company = String(data.company || 'GCC Enterprise').trim();
  const location = String(data.location || 'Dubai, UAE').trim();
  const rating = Number(data.rating) || 5;
  const reviewText = String(data.reviewText || data.contentEn || (typeof data.content === 'object' ? data.content.en : data.content) || '')
    .replace(/Odoo 17/g, 'Odoo');
  const reviewTextAr = String(data.reviewTextAr || data.contentAr || (typeof data.content === 'object' ? data.content.ar : '') || reviewText)
    .replace(/Odoo 17/g, 'Odoo');
  const hasVideo = Boolean(data.hasVideo);
  const videoUrl = data.videoUrl || null;
  const verified = data.verified !== undefined ? Boolean(data.verified) : true;
  const featured = Boolean(data.featured);
  const isVisible = data.isVisible !== undefined ? Boolean(data.isVisible) : true;
  const techCategory = data.techCategory || (reviewText.toLowerCase().includes('odoo') ? 'odoo' : (reviewText.toLowerCase().includes('.net') ? 'dotnet' : 'general'));

  const authorId = data.authorId || null;
  const authorEmail = data.authorEmail || null;
  const avatarUrl = data.avatar || data.avatarUrl || null;
  const isGoogleReview = data.isGoogleReview !== undefined ? Boolean(data.isGoogleReview) : true;
  const googleReviewUrl = data.googleReviewUrl || null;

  const created = await prisma.review.create({
    data: {
      clientName: authorName,
      role: authorRole,
      company,
      location,
      rating,
      reviewText,
      reviewTextAr,
      hasVideo,
      videoUrl,
      verified,
      featured,
      isVisible,
      techCategory,
      authorId,
      authorEmail,
      authorName,
      avatarUrl,
      isGoogleReview,
      googleReviewUrl,
    },
  });

  return formatReview(created);
}

export async function updateReviewRecord(id: string, data: any, requestingUser?: any) {
  // Distinguish administrative moderation/curation (Display/Spotlight toggles)
  // from actual review content editing (which remains strictly author-only)
  const isContentEdit =
    data.clientName !== undefined ||
    data.authorName !== undefined ||
    data.role !== undefined ||
    data.authorRole !== undefined ||
    data.company !== undefined ||
    data.location !== undefined ||
    data.rating !== undefined ||
    data.reviewText !== undefined ||
    data.contentEn !== undefined ||
    data.reviewTextAr !== undefined;

  // Author-only check enforcement on content edits
  if (requestingUser && isContentEdit) {
    try {
      const existing = await prisma.review.findUnique({ where: { id } });
      if (existing) {
        const isOwner =
          (existing.authorId && existing.authorId === requestingUser.id) ||
          (existing.authorEmail && requestingUser.email && existing.authorEmail.toLowerCase() === requestingUser.email.toLowerCase()) ||
          (!existing.authorId && !existing.authorEmail && existing.clientName && requestingUser.name && existing.clientName.trim().toLowerCase() === requestingUser.name.trim().toLowerCase());
        if (!isOwner) {
          throw new Error('Unauthorized: Only the review author can edit this review.');
        }
      }
    } catch (e: any) {
      if (e.message?.startsWith('Unauthorized:')) throw e;
    }
  }

  const updateData: any = {};
  if (data.clientName !== undefined || data.authorName !== undefined) {
    updateData.clientName = data.clientName || data.authorName;
    updateData.authorName = data.authorName || data.clientName;
  }
  if (data.role !== undefined || data.authorRole !== undefined) {
    updateData.role = data.role || data.authorRole;
  }
  if (data.company !== undefined) updateData.company = data.company;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.rating !== undefined) updateData.rating = Number(data.rating);
  if (data.reviewText !== undefined || data.contentEn !== undefined) {
    updateData.reviewText = (data.reviewText || data.contentEn || '').replace(/Odoo 17/g, 'Odoo');
  }
  if (data.reviewTextAr !== undefined || data.contentAr !== undefined) {
    updateData.reviewTextAr = (data.reviewTextAr || data.contentAr || '').replace(/Odoo 17/g, 'Odoo');
  }
  if (data.hasVideo !== undefined) updateData.hasVideo = Boolean(data.hasVideo);
  if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl;
  if (data.verified !== undefined) updateData.verified = Boolean(data.verified);
  if (data.featured !== undefined) updateData.featured = Boolean(data.featured);
  if (data.isVisible !== undefined) updateData.isVisible = Boolean(data.isVisible);
  if (data.techCategory !== undefined) updateData.techCategory = data.techCategory;
  if (data.avatarUrl !== undefined || data.avatar !== undefined) {
    updateData.avatarUrl = data.avatarUrl || data.avatar;
  }

  const updated = await prisma.review.update({
    where: { id },
    data: updateData,
  });

  return formatReview(updated);
}

export async function deleteReviewRecord(id: string, requestingUser?: any) {
  // Author-only check enforcement
  if (requestingUser) {
    try {
      const existing = await prisma.review.findUnique({ where: { id } });
      if (existing) {
        const isOwner =
          (existing.authorId && existing.authorId === requestingUser.id) ||
          (existing.authorEmail && requestingUser.email && existing.authorEmail.toLowerCase() === requestingUser.email.toLowerCase()) ||
          (!existing.authorId && !existing.authorEmail && existing.clientName && requestingUser.name && existing.clientName.trim().toLowerCase() === requestingUser.name.trim().toLowerCase());
        if (!isOwner) {
          throw new Error('Unauthorized: Only the review author can delete this review.');
        }
      }
    } catch (e: any) {
      if (e.message?.startsWith('Unauthorized:')) throw e;
    }
  }

  const deleted = await prisma.review.delete({
    where: { id },
  });
  return { success: true, deletedId: deleted.id };
}

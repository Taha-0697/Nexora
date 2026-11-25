import { prisma } from '../lib/prisma';

export interface FormattedReview {
  id: string;
  authorName: string;
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
  date: string;
  hasVideo: boolean;
  videoUrl: string | null;
  verified: boolean;
  featured: boolean;
  techCategory: string; // 'dotnet' | 'odoo' | 'general'
  isGoogleReview: boolean;
  googleReviewUrl?: string;
  createdAt?: Date | string;
}

export function formatReview(r: any): FormattedReview {
  const authorName = r.clientName || r.authorName || 'Verified Client';
  const authorRole = r.role || r.authorRole || 'Enterprise Partner';
  const company = r.company || 'Enterprise Partner';
  const location = r.location || 'GCC';
  const rating = Number(r.rating) || 5;
  const reviewText = (r.reviewText || (typeof r.content === 'object' ? r.content.en : r.content) || '')
    .replace(/Odoo 17/g, 'Odoo'); // Requirement 4: update to say Odoo instead of Odoo 17
  const hasVideo = Boolean(r.hasVideo);
  const videoUrl = r.videoUrl || (hasVideo ? 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42994-large.mp4' : null);
  const verified = r.verified !== undefined ? Boolean(r.verified) : true;
  const featured = Boolean(r.featured);
  const techCategory = r.techCategory || (reviewText.toLowerCase().includes('odoo') ? 'odoo' : (reviewText.toLowerCase().includes('.net') ? 'dotnet' : 'general'));
  const isGoogleReview = r.isGoogleReview !== undefined ? Boolean(r.isGoogleReview) : true;
  
  // Deterministic clean avatars
  const avatar = r.avatar || `https://images.unsplash.com/photo-${
    hasVideo ? '1534528741775-53994a69daeb' : '1507003211169-0a1dd7228f2d'
  }?auto=format&fit=crop&w=200&q=80`;

  const dateFormatted = r.createdAt 
    ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recent';

  return {
    id: r.id,
    authorName,
    clientName: authorName,
    authorRole,
    role: authorRole,
    company,
    location,
    avatar,
    rating,
    content: {
      en: reviewText,
      ar: (r.contentAr || reviewText).replace(/Odoo 17/g, 'Odoo'),
    },
    reviewText,
    date: dateFormatted,
    hasVideo,
    videoUrl,
    verified,
    featured,
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
  const clientName = data.clientName || data.authorName || 'Enterprise Partner';
  const role = data.role || data.authorRole || 'Engineering Leader';
  const company = data.company || 'GCC Enterprise';
  const location = data.location || 'Dubai, UAE';
  const rating = Number(data.rating) || 5;
  const reviewText = (data.reviewText || data.contentEn || (typeof data.content === 'object' ? data.content.en : data.content) || '')
    .replace(/Odoo 17/g, 'Odoo');
  const hasVideo = Boolean(data.hasVideo);
  const videoUrl = data.videoUrl || null;
  const verified = data.verified !== undefined ? Boolean(data.verified) : true;
  const featured = Boolean(data.featured);
  const techCategory = data.techCategory || (reviewText.toLowerCase().includes('odoo') ? 'odoo' : (reviewText.toLowerCase().includes('.net') ? 'dotnet' : 'general'));

  const created = await prisma.review.create({
    data: {
      clientName,
      role,
      company,
      location,
      rating,
      reviewText,
      hasVideo,
      videoUrl,
      verified,
      featured,
      techCategory,
    },
  });

  return formatReview(created);
}

export async function updateReviewRecord(id: string, data: any) {
  const updateData: any = {};
  if (data.clientName !== undefined || data.authorName !== undefined) {
    updateData.clientName = data.clientName || data.authorName;
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
  if (data.hasVideo !== undefined) updateData.hasVideo = Boolean(data.hasVideo);
  if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl;
  if (data.verified !== undefined) updateData.verified = Boolean(data.verified);
  if (data.featured !== undefined) updateData.featured = Boolean(data.featured);
  if (data.techCategory !== undefined) updateData.techCategory = data.techCategory;

  const updated = await prisma.review.update({
    where: { id },
    data: updateData,
  });

  return formatReview(updated);
}

export async function deleteReviewRecord(id: string) {
  const deleted = await prisma.review.delete({
    where: { id },
  });
  return { success: true, deletedId: deleted.id };
}

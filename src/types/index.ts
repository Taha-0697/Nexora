export type Language = 'en' | 'ar';

export type ServiceCategory =
  | 'erp'
  | 'cloud'
  | 'mobile'
  | 'web'
  | 'ai'
  | 'wordpress'
  | 'all';

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface ProjectMetric {
  label: LocalizedString;
  value: string;
}

export interface Project {
  id: string;
  title: LocalizedString;
  category: ServiceCategory;
  categories?: string[];
  shortDesc: LocalizedString;
  fullDesc: LocalizedString;
  client: string;
  country: string;
  image: string;
  tags: string[];
  metrics: ProjectMetric[];
  featured: boolean;
  liveUrl?: string;
  completionDate: string;
}

export interface Review {
  id: string;
  authorName: string;
  authorRole: string;
  company: string;
<<<<<<< HEAD
  location?: string;
=======
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
  avatar: string;
  rating: number; // 1 - 5
  content: LocalizedString;
  date: string;
  isGoogleReview: boolean;
  googleReviewUrl?: string;
  verified: boolean;
<<<<<<< HEAD
  hasVideo?: boolean;
  videoUrl?: string | null;
  featured?: boolean;
  techCategory?: string; // 'dotnet' | 'odoo' | 'general'
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  linkedinUrl: string;
  avatarUrl?: string | null;
  displayOrder?: number;
=======
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceType: string;
  budget: string;
  timeline: string;
  message: string;
  customStack?: string[];
  createdAt: string;
  status: 'new' | 'contacted' | 'proposal_sent' | 'closed';
}

export interface ServiceItem {
  id: string;
  iconName: string;
  category: ServiceCategory;
  title: LocalizedString;
  tagline: LocalizedString;
  description: LocalizedString;
  features: {
    en: string[];
    ar: string[];
  };
  technologies: string[];
  badge: LocalizedString;
}

export interface GoogleReviewSettings {
  placeId: string;
  syncEnabled: boolean;
  businessName: string;
  overallRating: number;
  totalReviewsCount: number;
  lastSyncTimestamp: string;
  googleMapsUrl: string;
}

// User Roles & Access Control
export type UserRole =
  | 'admin'
  | 'project_manager'
  | 'marketing_manager'
  | 'review_manager';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  password: string;
  title: string;
  avatar?: string;
}

// Marketing & Ads Types
<<<<<<< HEAD
export type MarketingPlatform =
  | 'Google Ads'
  | 'Meta Ads'
  | 'Meta / Facebook'
  | 'LinkedIn Ads'
  | 'LinkedIn B2B'
  | 'X (Twitter)'
  | 'X / Twitter';

export interface AdCampaign {
  id: string;
  name: string;
  platform: MarketingPlatform | string;
=======
export interface AdCampaign {
  id: string;
  name: string;
  platform: 'Google Ads' | 'Meta / Facebook' | 'LinkedIn B2B' | 'X / Twitter';
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
  status: 'active' | 'paused' | 'draft';
  dailyBudget: number; // in USD
  targetRegion: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spent: number;
}

<<<<<<< HEAD
export interface PlatformAccountConnection {
  id: string;
  platform: 'Google Ads' | 'Meta Ads' | 'LinkedIn' | 'X';
  accountName: string;
  accountId: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSyncedAt?: string;
  webhookUrl?: string;
  apiKeyMasked?: string;
  developerToken?: string;
}

export interface SocialAdPost {
  id: string;
  title: string;
  platforms: string[];
  headline: string;
  copy: string;
  mediaUrl?: string;
  ctaText: string;
  targetUrl: string;
  scheduledFor?: string;
  status: 'published' | 'scheduled' | 'draft';
  createdAt: string;
}

=======
>>>>>>> a5fac620b4a00e443286bf9df03bf10890b6e75e
export interface MarketingSettings {
  bannerEnabled: boolean;
  bannerText: LocalizedString;
  bannerCtaText: LocalizedString;
  bannerUrl: string;
  seoTitle: string;
  seoDescription: string;
  focusKeywords: string;
  googleAnalyticsId: string;
  metaPixelId: string;
  linkedInInsightId: string;
  adCampaigns: AdCampaign[];
}

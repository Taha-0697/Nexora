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
  avatar: string;
  rating: number; // 1 - 5
  content: LocalizedString;
  date: string;
  isGoogleReview: boolean;
  googleReviewUrl?: string;
  verified: boolean;
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
export interface AdCampaign {
  id: string;
  name: string;
  platform: 'Google Ads' | 'Meta / Facebook' | 'LinkedIn B2B' | 'X / Twitter';
  status: 'active' | 'paused' | 'draft';
  dailyBudget: number; // in USD
  targetRegion: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spent: number;
}

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

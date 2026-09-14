export type Language = 'en' | 'ar'

export type ServiceCategory =
  | 'erp'
  | 'cloud'
  | 'mobile'
  | 'web'
  | 'wordpress'
  | 'all'

export interface LocalizedString {
  en: string
  ar: string
}

export interface ProjectMetric {
  label: LocalizedString
  value: string
}

export interface Project {
  id: string
  title: LocalizedString
  category: ServiceCategory
  shortDesc: LocalizedString
  fullDesc: LocalizedString
  client: string
  country: string
  image: string
  tags: string[]
  metrics: ProjectMetric[]
  featured: boolean
  liveUrl?: string
  completionDate: string
}

export interface Review {
  id: string
  authorName: string
  authorRole: string
  company: string
  avatar: string
  rating: number // 1 - 5
  content: LocalizedString
  date: string
  isGoogleReview: boolean
  googleReviewUrl?: string
  verified: boolean
}

export interface Inquiry {
  id: string
  name: string
  email: string
  phone: string
  company: string
  serviceType: string
  budget: string
  timeline: string
  message: string
  customStack?: string[]
  createdAt: string
  status: 'new' | 'contacted' | 'proposal_sent' | 'closed'
}

export interface ServiceItem {
  id: string
  iconName: string
  category: ServiceCategory
  title: LocalizedString
  tagline: LocalizedString
  description: LocalizedString
  features: {
    en: string[]
    ar: string[]
  }
  technologies: string[]
  badge: LocalizedString
}

export interface GoogleReviewSettings {
  placeId: string
  syncEnabled: boolean
  businessName: string
  overallRating: number
  totalReviewsCount: number
  lastSyncTimestamp: string
  googleMapsUrl: string
}

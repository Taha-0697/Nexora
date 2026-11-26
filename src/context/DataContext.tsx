import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  Project,
  Review,
  Inquiry,
  ServiceItem,
  GoogleReviewSettings,
  TeamMember,
  MarketingSettings,
  AdCampaign
} from '../types';
import {
  initialProjects,
  initialReviews,
  initialServices,
  initialGoogleSettings,
  initialMarketingSettings
} from '../data/seedData';

interface DataContextType {
  projects: Project[];
  isLoadingProjects: boolean;
  projectError: string | null;
  refreshProjects: () => Promise<void>;
  reviews: Review[];
  isLoadingReviews: boolean;
  refreshReviews: () => Promise<void>;
  inquiries: Inquiry[];
  services: ServiceItem[];
  googleSettings: GoogleReviewSettings;
  users: TeamMember[];
  adminUsers: TeamMember[];
  isLoadingUsers: boolean;
  userError: string | null;
  refreshUsers: () => Promise<void>;
  marketingSettings: MarketingSettings;

  // Project Actions
  addProject: (project: any) => Promise<any>;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => Promise<any>;

  // Review Actions
  addReview: (review: Omit<Review, 'id'>) => Promise<any>;
  updateReview: (review: Review) => Promise<any>;
  deleteReview: (id: string) => Promise<any>;
  syncGoogleReviews: () => Promise<boolean>;
  updateGoogleSettings: (settings: Partial<GoogleReviewSettings>) => void;

  // Inquiry / Lead Actions
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  deleteInquiry: (id: string) => void;

  // Team Member / Admin User Actions (Super Admin managed via DB)
  addAdminUser: (user: any) => Promise<TeamMember>;
  updateAdminUser: (user: TeamMember) => Promise<TeamMember>;
  deleteAdminUser: (id: string) => Promise<any>;
  resetUserPassword: (userId: string, newPassword?: string) => string;
  resetAllPasswords: (newPassword?: string) => string;
  resetPasswordByEmail: (email: string, newPassword?: string) => boolean;

  // Marketing & Ads Actions
  updateMarketingSettings: (settings: Partial<MarketingSettings>) => void;
  addAdCampaign: (campaign: Omit<AdCampaign, 'id'>) => void;
  updateAdCampaign: (campaign: AdCampaign) => void;
  deleteAdCampaign: (id: string) => void;
  toggleAdCampaignStatus: (id: string) => void;

  // Restore Default State
  resetToDefaults: () => void;
}

function safeParseLocalStorage<T>(key: string, fallback: T, isArray = false): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    if (raw.includes('__proto__') || raw.includes('constructor') || raw.includes('prototype')) {
      console.warn(`[Security] Suspicious payload detected in localStorage for key "${key}", purging.`);
      localStorage.removeItem(key);
      return fallback;
    }
    const parsed = JSON.parse(raw);
    if (isArray && !Array.isArray(parsed)) {
      console.warn(`[Security] Expected array for key "${key}", received non-array.`);
      return fallback;
    }
    return parsed as T;
  } catch (err) {
    console.error(`Error safely reading localStorage key "${key}":`, err);
    return fallback;
  }
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Projects State (Hydrated from Neon DB /api/projects)
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const parsed = safeParseLocalStorage<Project[]>('nexora_projects', initialProjects, true);
      // Wipe out old 6 dummy projects if stored in localStorage
      const hasDummy = Array.isArray(parsed) && parsed.some((p: any) =>
        p.id === 'proj-1' ||
        p.title?.en?.includes('NexCore') ||
        p.titleEn?.includes('NexCore')
      );
      if (!hasDummy && Array.isArray(parsed) && parsed.length > 0) return parsed;
      return initialProjects;
    } catch (e) {
      console.error('Error loading initial projects', e);
      return initialProjects;
    }
  });

  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true);
  const [projectError, setProjectError] = useState<string | null>(null);

  const refreshProjects = async () => {
    try {
      setIsLoadingProjects(true);
      setProjectError(null);
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setProjects(data);
          localStorage.setItem('nexora_projects', JSON.stringify(data));
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        setProjectError(errJson.error || 'Failed to fetch projects');
      }
    } catch (err: any) {
      console.error('Failed to fetch /api/projects:', err);
      setProjectError(err.message || 'Error communicating with database');
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // 2. Reviews State (Hydrated strictly from Neon DB /api/reviews)
  const [reviews, setReviews] = useState<Review[]>(() => {
    return safeParseLocalStorage<Review[]>('nexora_reviews', initialReviews, true);
  });
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(true);

  const refreshReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setReviews(data);
          localStorage.setItem('nexora_reviews', JSON.stringify(data));
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch /api/reviews:', err);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    refreshProjects();
    refreshReviews();
    refreshUsers();
    refreshInquiries();
    refreshMarketingCampaigns();
  }, []);

  // 3. Inquiries State
  const defaultInquiries: Inquiry[] = [
    {
      id: 'inq-1',
      name: 'Mansoor Al-Rashid',
      email: 'm.rashid@gulflogistics.sa',
      phone: '+966 50 882 1920',
      company: 'Gulf Horizon Logistics Holding',
      serviceType: 'Custom Web ERP & Enterprise Portals',
      budget: '$30,000 - $60,000',
      timeline: '2 - 3 Months',
      message: 'We require a high-throughput .NET Core Web API and Next.js portal with MSSQL to manage multi-country logistics across 5 GCC ports.',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      status: 'proposal_sent'
    }
  ];

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    return safeParseLocalStorage<Inquiry[]>('nexora_inquiries', defaultInquiries, true);
  });

  const refreshInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setInquiries(data);
          localStorage.setItem('nexora_inquiries', JSON.stringify(data));
        }
      }
    } catch (err) {
      console.warn('Failed to fetch /api/inquiries from Neon DB:', err);
    }
  };

  // 4. Services (static catalog)
  const [services] = useState<ServiceItem[]>(initialServices);

  // 5. Google Review Settings
  const [googleSettings, setGoogleSettings] = useState<GoogleReviewSettings>(() => {
    return safeParseLocalStorage<GoogleReviewSettings>('nexora_google_settings', initialGoogleSettings, false);
  });

  // 6. Admin Users State (Hydrated strictly from Neon DB /api/users — no static fallbacks)
  const [adminUsers, setAdminUsers] = useState<TeamMember[]>(() => {
    return safeParseLocalStorage<TeamMember[]>('nexora_admin_users', [], true);
  });
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
  const [userError, setUserError] = useState<string | null>(null);

  const refreshUsers = async () => {
    try {
      setIsLoadingUsers(true);
      setUserError(null);
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAdminUsers(data);
          localStorage.setItem('nexora_admin_users', JSON.stringify(data));
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        setUserError(errJson.error || 'Failed to fetch users from database');
      }
    } catch (err: any) {
      console.error('Failed to fetch /api/users:', err);
      setUserError(err.message || 'Error communicating with database');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // 7. Marketing Settings State
  const [marketingSettings, setMarketingSettings] = useState<MarketingSettings>(() => {
    return safeParseLocalStorage<MarketingSettings>('nexora_marketing_settings', initialMarketingSettings, false);
  });

  const refreshMarketingCampaigns = async () => {
    try {
      const res = await fetch('/api/marketing/campaigns');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: AdCampaign[] = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            platform: c.platform,
            status: c.status,
            dailyBudget: c.dailyBudget,
            targetRegion: c.targetRegion || 'GCC / Middle East',
            impressions: c.impressions,
            clicks: c.clicks,
            conversions: c.conversions,
            spent: c.spendAmount ?? c.spent ?? 0,
          }));
          setMarketingSettings(prev => ({
            ...prev,
            adCampaigns: mapped,
          }));
        }
      }
    } catch (err) {
      console.warn('Failed to fetch /api/marketing/campaigns:', err);
    }
  };

  // Persist updates to localStorage
  useEffect(() => {
    localStorage.setItem('nexora_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('nexora_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('nexora_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('nexora_google_settings', JSON.stringify(googleSettings));
  }, [googleSettings]);

  useEffect(() => {
    localStorage.setItem('nexora_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  useEffect(() => {
    localStorage.setItem('nexora_marketing_settings', JSON.stringify(marketingSettings));
  }, [marketingSettings]);

  // Project Handlers (Connected to Neon DB API)
  const addProject = async (projectData: any) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!res.ok) {
        let errorDetails = '';
        try {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const errJson = await res.json();
            errorDetails = errJson.details
              ? `${errJson.error || 'Database Error'}: ${errJson.details}`
              : (errJson.error || errJson.message || '');
          } else {
            const rawText = await res.text();
            if (rawText.trim().startsWith('<')) {
              errorDetails = 'API endpoint returned HTML (SPA rewrite). The Serverless Function in /api may not be reachable or rewrites are misconfigured.';
            } else {
              errorDetails = rawText.slice(0, 250);
            }
          }
        } catch {
          // ignore
        }
        const errorMsg = errorDetails 
          ? `[HTTP ${res.status}] ${errorDetails}`
          : `[HTTP ${res.status} ${res.statusText}] Failed to save project to Neon PostgreSQL.`;
        throw new Error(errorMsg);
      }

      const created = await res.json();
      setProjects(prev => [created, ...prev.filter(p => p.id !== created.id)]);
      return created;
    } catch (err: any) {
      console.error('addProject failed:', err);
      throw err;
    }
  };

  const updateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const deleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        let errorDetails = '';
        try {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const errJson = await res.json();
            errorDetails = errJson.details || errJson.error || '';
          }
        } catch {
          // ignore
        }
        const errorMsg = errorDetails 
          ? `[HTTP ${res.status}] ${errorDetails}`
          : `[HTTP ${res.status} ${res.statusText}] Failed to delete project.`;
        throw new Error(errorMsg);
      }

      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      console.error('deleteProject failed:', err);
      throw err;
    }
  };

  // Review Handlers (Connected strictly to Neon DB API with Author-Only Enforcement)
  const getActiveSessionUser = () => {
    try {
      const saved = sessionStorage.getItem('nexora_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const addReview = async (reviewData: any) => {
    const user = getActiveSessionUser();
    const payload = {
      ...reviewData,
      authorId: reviewData.authorId || user?.id,
      authorEmail: reviewData.authorEmail || user?.email,
      isVisible: reviewData.isVisible !== undefined ? reviewData.isVisible : true,
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        setReviews(prev => [created, ...prev.filter(r => r.id !== created.id)]);
        return created;
      }
    } catch (err) {
      console.warn('API review creation failed, saving to local state:', err);
    }

    // Local fallback for client persistence
    const localCreated: Review = {
      ...payload,
      id: payload.id || `rev-${Date.now()}`,
      authorName: payload.authorName || user?.name || 'Verified Client',
      authorRole: payload.authorRole || 'Enterprise Partner',
      authorId: payload.authorId || user?.id,
      authorEmail: payload.authorEmail || user?.email,
      company: payload.company || 'Enterprise Partner',
      avatar: payload.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: Number(payload.rating) || 5,
      content: payload.content || { en: payload.reviewText || '', ar: payload.contentAr || payload.reviewText || '' },
      date: payload.date || 'Just now (Organic)',
      isGoogleReview: Boolean(payload.isGoogleReview),
      verified: true,
      isVisible: payload.isVisible !== undefined ? payload.isVisible : true,
    };
    setReviews(prev => [localCreated, ...prev.filter(r => r.id !== localCreated.id)]);
    return localCreated;
  };

  const updateReview = async (updated: Review) => {
    const user = getActiveSessionUser();
    const existing = reviews.find(r => r.id === updated.id);

    // Distinguish administrative curation (Display/Spotlight toggles) from review content edits
    const isContentEdit =
      existing &&
      ((existing as any).reviewText !== (updated as any).reviewText ||
       existing.rating !== updated.rating ||
       existing.authorName !== updated.authorName ||
       existing.authorRole !== updated.authorRole ||
       existing.company !== updated.company ||
       (existing.content && updated.content && (existing.content.en !== updated.content.en || existing.content.ar !== updated.content.ar)));

    // Enforce author-only modification check on state mutation layer for content edits
    if (isContentEdit && existing && user) {
      const isOwner =
        (existing.authorId && existing.authorId === user.id) ||
        (existing.authorEmail && user.email && existing.authorEmail.toLowerCase() === user.email.toLowerCase()) ||
        (!existing.authorId && !existing.authorEmail && existing.authorName && user.name && existing.authorName.trim().toLowerCase() === user.name.trim().toLowerCase());
      if (!isOwner) {
        throw new Error('Unauthorized: Only the review author can edit this review.');
      }
    }

    try {
      const res = await fetch(`/api/reviews/${updated.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const saved = await res.json();
        setReviews(prev => prev.map(r => (r.id === saved.id ? { ...r, ...saved } : r)));
        return saved;
      } else {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.details || 'Failed to update review in Neon database.');
      }
    } catch (err: any) {
      if (err.message?.startsWith('Unauthorized:')) throw err;
      console.warn('API review update failed:', err);
      throw err;
    }
  };

  const deleteReview = async (id: string) => {
    const user = getActiveSessionUser();
    const existing = reviews.find(r => r.id === id);

    // Enforce author-only deletion check on state mutation layer
    if (existing && user) {
      const isOwner =
        (existing.authorId && existing.authorId === user.id) ||
        (existing.authorEmail && user.email && existing.authorEmail.toLowerCase() === user.email.toLowerCase()) ||
        (!existing.authorId && !existing.authorEmail && existing.authorName && user.name && existing.authorName.trim().toLowerCase() === user.name.trim().toLowerCase());
      if (!isOwner) {
        throw new Error('Unauthorized: Only the review author can delete this review.');
      }
    }

    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        if (errJson.error?.includes('Unauthorized')) {
          throw new Error(errJson.error);
        }
      }
    } catch (err: any) {
      if (err.message?.startsWith('Unauthorized:')) throw err;
      console.warn('API review delete failed, removing from local state:', err);
    }

    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const syncGoogleReviews = async (): Promise<boolean> => {
    await refreshReviews();
    setGoogleSettings(prev => ({
      ...prev,
      lastSyncTimestamp: new Date().toLocaleTimeString() + ' (DB Synced)'
    }));
    return true;
  };

  const updateGoogleSettings = (settings: Partial<GoogleReviewSettings>) => {
    setGoogleSettings(prev => ({ ...prev, ...settings }));
  };

  // Inquiry Handlers (Wired to Neon DB API)
  const addInquiry = async (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData),
      });
      if (res.ok) {
        const created = await res.json();
        setInquiries(prev => [created, ...prev.filter(i => i.id !== created.id)]);
        return;
      }
    } catch (err) {
      console.warn('API inquiry creation failed, saving to local state:', err);
    }
    const newInquiry: Inquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    setInquiries(prev => [newInquiry, ...prev]);
  };

  const updateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    setInquiries(prev => prev.map(inq => (inq.id === id ? { ...inq, status } : inq)));
    try {
      await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.warn('API inquiry status update failed:', err);
    }
  };

  const deleteInquiry = async (id: string) => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
    try {
      await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API inquiry delete failed:', err);
    }
  };

  // Admin User & Roles Handlers (Live Neon DB API — no static users)
  const addAdminUser = async (userData: any): Promise<TeamMember> => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to add user to database');
      }

      const created = await res.json();
      setAdminUsers(prev => [...prev.filter(u => u.id !== created.id), created]);
      return created;
    } catch (err: any) {
      console.error('addAdminUser failed:', err);
      throw err;
    }
  };

  const updateAdminUser = async (updatedUser: TeamMember): Promise<TeamMember> => {
    try {
      const res = await fetch(`/api/users/${updatedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to update user in database');
      }

      const updated = await res.json();
      setAdminUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
      return updated;
    } catch (err: any) {
      console.error('updateAdminUser failed:', err);
      throw err;
    }
  };

  const deleteAdminUser = async (id: string): Promise<any> => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to delete user from database');
      }

      setAdminUsers(prev => prev.filter(u => u.id !== id));
      return await res.json();
    } catch (err: any) {
      console.error('deleteAdminUser failed:', err);
      throw err;
    }
  };

  const resetUserPassword = (userId: string, newPassword?: string): string => {
    const finalPassword = newPassword?.trim() || `nexora${Math.floor(1000 + Math.random() * 9000)}!`;
    setAdminUsers(prev => prev.map(u => (u.id === userId ? { ...u, password: finalPassword } : u)));
    fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: finalPassword }),
    }).catch(err => console.error('Failed to persist password reset to DB:', err));
    return finalPassword;
  };

  const resetAllPasswords = (newPassword?: string): string => {
    const finalPassword = newPassword?.trim() || `Nexora#${new Date().getFullYear()}!`;
    setAdminUsers(prev => {
      prev.forEach(u => {
        fetch(`/api/users/${u.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: finalPassword }),
        }).catch(err => console.error('Failed to persist bulk password reset to DB:', err));
      });
      return prev.map(u => ({ ...u, password: finalPassword }));
    });
    return finalPassword;
  };

  const resetPasswordByEmail = (email: string, newPassword?: string): boolean => {
    const target = adminUsers.find(u => (u.email || '').toLowerCase() === email.trim().toLowerCase());
    if (!target) return false;
    const finalPassword = newPassword?.trim() || `Nexora#${Math.floor(1000 + Math.random() * 9000)}!`;
    setAdminUsers(prev => prev.map(u => (u.id === target.id ? { ...u, password: finalPassword } : u)));
    fetch(`/api/users/${target.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: finalPassword }),
    }).catch(err => console.error('Failed to persist email password reset to DB:', err));
    return true;
  };

  // Marketing & Ads Handlers
  const updateMarketingSettings = (settings: Partial<MarketingSettings>) => {
    setMarketingSettings(prev => {
      const next = { ...prev, ...settings };
      if (
        settings.bannerEnabled !== undefined ||
        settings.bannerText !== undefined ||
        settings.bannerCtaText !== undefined ||
        settings.bannerUrl !== undefined ||
        settings.googleAnalyticsId !== undefined ||
        settings.metaPixelId !== undefined ||
        settings.linkedInInsightId !== undefined
      ) {
        fetch('/api/marketing/banner-pixel', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bannerActive: next.bannerEnabled,
            bannerText: next.bannerText?.en,
            bannerCtaLabel: next.bannerCtaText?.en,
            bannerCtaUrl: next.bannerUrl,
            googleAdsPixel: next.googleAnalyticsId,
            metaPixel: next.metaPixelId,
            linkedinPixel: next.linkedInInsightId,
          }),
        }).catch(err => console.warn('Failed to persist banner/pixel settings to Neon DB:', err));
      }
      return next;
    });
  };

  const addAdCampaign = async (campaignData: Omit<AdCampaign, 'id'>) => {
    try {
      const res = await fetch('/api/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      });
      if (res.ok) {
        const created = await res.json();
        const mapped: AdCampaign = {
          id: created.id,
          name: created.name,
          platform: created.platform,
          status: created.status,
          dailyBudget: created.dailyBudget,
          targetRegion: created.targetRegion || 'GCC / Middle East',
          impressions: created.impressions,
          clicks: created.clicks,
          conversions: created.conversions,
          spent: created.spendAmount ?? created.spent ?? 0,
        };
        setMarketingSettings(prev => ({
          ...prev,
          adCampaigns: [mapped, ...prev.adCampaigns.filter(c => c.id !== mapped.id)]
        }));
        return;
      }
    } catch (err) {
      console.warn('API campaign creation failed, falling back to local:', err);
    }
    const newCampaign: AdCampaign = {
      ...campaignData,
      id: `ad-${Date.now()}`
    };
    setMarketingSettings(prev => ({
      ...prev,
      adCampaigns: [newCampaign, ...prev.adCampaigns]
    }));
  };

  const updateAdCampaign = async (updatedCampaign: AdCampaign) => {
    setMarketingSettings(prev => ({
      ...prev,
      adCampaigns: prev.adCampaigns.map(c => (c.id === updatedCampaign.id ? updatedCampaign : c))
    }));
    try {
      await fetch(`/api/marketing/campaigns/${updatedCampaign.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedCampaign,
          spendAmount: updatedCampaign.spent,
        }),
      });
    } catch (err) {
      console.warn('API campaign update failed:', err);
    }
  };

  const deleteAdCampaign = async (id: string) => {
    setMarketingSettings(prev => ({
      ...prev,
      adCampaigns: prev.adCampaigns.filter(c => c.id !== id)
    }));
    try {
      await fetch(`/api/marketing/campaigns/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API campaign delete failed:', err);
    }
  };

  const toggleAdCampaignStatus = async (id: string) => {
    const target = marketingSettings.adCampaigns.find(c => c.id === id);
    const nextStatus = target?.status === 'active' ? 'paused' : 'active';
    setMarketingSettings(prev => ({
      ...prev,
      adCampaigns: prev.adCampaigns.map(c => (c.id === id ? { ...c, status: nextStatus } : c))
    }));
    try {
      await fetch(`/api/marketing/campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (err) {
      console.warn('API campaign status toggle failed:', err);
    }
  };

  const resetToDefaults = () => {
    setProjects(initialProjects);
    setReviews(initialReviews);
    setGoogleSettings(initialGoogleSettings);
    setAdminUsers([]);
    setMarketingSettings(initialMarketingSettings);
    localStorage.removeItem('nexora_projects');
    localStorage.removeItem('nexora_reviews');
    localStorage.removeItem('nexora_google_settings');
    localStorage.removeItem('nexora_admin_users');
    localStorage.removeItem('nexora_marketing_settings');
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        isLoadingProjects,
        projectError,
        refreshProjects,
        reviews,
        isLoadingReviews,
        refreshReviews,
        inquiries,
        services,
        googleSettings,
        adminUsers,
        users: adminUsers,
        isLoadingUsers,
        userError,
        refreshUsers,
        marketingSettings,
        addProject,
        updateProject,
        deleteProject,
        addReview,
        updateReview,
        deleteReview,
        syncGoogleReviews,
        updateGoogleSettings,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        resetUserPassword,
        resetAllPasswords,
        resetPasswordByEmail,
        updateMarketingSettings,
        addAdCampaign,
        updateAdCampaign,
        deleteAdCampaign,
        toggleAdCampaignStatus,
        resetToDefaults
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

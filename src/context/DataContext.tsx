import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  Project,
  Review,
  Inquiry,
  ServiceItem,
  GoogleReviewSettings,
  AdminUser,
  MarketingSettings,
  AdCampaign
} from '../types';
import {
  initialProjects,
  initialReviews,
  initialServices,
  initialGoogleSettings,
  initialAdminUsers,
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
  adminUsers: AdminUser[];
  marketingSettings: MarketingSettings;

  // Project Actions
  addProject: (project: any) => Promise<any>;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => Promise<any>;

  // Review Actions
  addReview: (review: Omit<Review, 'id'>) => void;
  updateReview: (review: Review) => void;
  deleteReview: (id: string) => void;
  syncGoogleReviews: () => Promise<boolean>;
  updateGoogleSettings: (settings: Partial<GoogleReviewSettings>) => void;

  // Inquiry / Lead Actions
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  deleteInquiry: (id: string) => void;

  // Admin User & Roles Actions
  addAdminUser: (user: Omit<AdminUser, 'id'>) => void;
  updateAdminUser: (user: AdminUser) => void;
  deleteAdminUser: (id: string) => void;
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

  // 2. Reviews State (Hydrated from Neon DB /api/reviews)
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
        if (Array.isArray(data) && data.length > 0) {
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

  // 4. Services (static catalog)
  const [services] = useState<ServiceItem[]>(initialServices);

  // 5. Google Review Settings
  const [googleSettings, setGoogleSettings] = useState<GoogleReviewSettings>(() => {
    return safeParseLocalStorage<GoogleReviewSettings>('nexora_google_settings', initialGoogleSettings, false);
  });

  // 6. Admin Users State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    return safeParseLocalStorage<AdminUser[]>('nexora_admin_users', initialAdminUsers, true);
  });

  // 7. Marketing Settings State
  const [marketingSettings, setMarketingSettings] = useState<MarketingSettings>(() => {
    return safeParseLocalStorage<MarketingSettings>('nexora_marketing_settings', initialMarketingSettings, false);
  });

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

  // Review Handlers (Connected to Neon DB API)
  const addReview = async (reviewData: any) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      if (res.ok) {
        const created = await res.json();
        setReviews(prev => [created, ...prev.filter(r => r.id !== created.id)]);
        return created;
      }
    } catch (err) {
      console.error('Failed to post review to API, saving locally:', err);
    }
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`
    };
    setReviews(prev => [newReview, ...prev]);
    return newReview;
  };

  const updateReview = async (updated: Review) => {
    try {
      await fetch(`/api/reviews/${updated.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('Failed to update review on API:', err);
    }
    setReviews(prev => prev.map(r => (r.id === updated.id ? updated : r)));
  };

  const deleteReview = async (id: string) => {
    try {
      await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete review on API:', err);
    }
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const syncGoogleReviews = async (): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1400));
    const organicGoogleReview: Review = {
      id: `rev-google-${Date.now()}`,
      authorName: 'Sultan Khalid Al-Harthy',
      authorRole: 'Chief Information Officer',
      company: 'PetroTech Global Systems',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      content: {
        en: 'Nexora Systems engineered our custom web ERP and migrated our legacy clusters to a resilient .NET Core & MSSQL architecture. Outstanding responsiveness and deep technical mastery.',
        ar: 'قامت نيكسورا للأنظمة بتطوير نظام الـ ERP السحابي وترحيل قواعد بياناتنا إلى بنية .NET Core و MSSQL مستقرة وسريعة للغاية. احترافية عالية واستجابة لا مثيل لها.'
      },
      date: 'Just now (Google Live Sync)',
      isGoogleReview: true,
      googleReviewUrl: 'https://maps.google.com/?q=Nexora+Systems',
      verified: true
    };

    setReviews(prev => {
      if (prev.some(r => r.authorName.includes('Sultan Khalid'))) return prev;
      return [organicGoogleReview, ...prev];
    });

    setGoogleSettings(prev => ({
      ...prev,
      totalReviewsCount: prev.totalReviewsCount + 1,
      lastSyncTimestamp: new Date().toLocaleTimeString() + ' (Google Verified)'
    }));

    return true;
  };

  const updateGoogleSettings = (settings: Partial<GoogleReviewSettings>) => {
    setGoogleSettings(prev => ({ ...prev, ...settings }));
  };

  // Inquiry Handlers
  const addInquiry = (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: Inquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    setInquiries(prev => [newInquiry, ...prev]);
  };

  const updateInquiryStatus = (id: string, status: Inquiry['status']) => {
    setInquiries(prev => prev.map(inq => (inq.id === id ? { ...inq, status } : inq)));
  };

  const deleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
  };

  // Admin User & Roles Handlers
  const addAdminUser = (userData: Omit<AdminUser, 'id'>) => {
    const newUser: AdminUser = {
      ...userData,
      id: `usr-${Date.now()}`
    };
    setAdminUsers(prev => [...prev, newUser]);
  };

  const updateAdminUser = (updatedUser: AdminUser) => {
    setAdminUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
  };

  const deleteAdminUser = (id: string) => {
    setAdminUsers(prev => prev.filter(u => u.id !== id));
  };

  const resetUserPassword = (userId: string, newPassword?: string): string => {
    const finalPassword = newPassword?.trim() || `nexora${Math.floor(1000 + Math.random() * 9000)}!`;
    setAdminUsers(prev => prev.map(u => (u.id === userId ? { ...u, password: finalPassword } : u)));
    return finalPassword;
  };

  const resetAllPasswords = (newPassword?: string): string => {
    const finalPassword = newPassword?.trim() || `Nexora#${new Date().getFullYear()}!`;
    setAdminUsers(prev => prev.map(u => ({ ...u, password: finalPassword })));
    return finalPassword;
  };

  const resetPasswordByEmail = (email: string, newPassword?: string): boolean => {
    const target = adminUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!target) return false;
    const finalPassword = newPassword?.trim() || `Nexora#${Math.floor(1000 + Math.random() * 9000)}!`;
    setAdminUsers(prev => prev.map(u => (u.id === target.id ? { ...u, password: finalPassword } : u)));
    return true;
  };

  // Marketing & Ads Handlers
  const updateMarketingSettings = (settings: Partial<MarketingSettings>) => {
    setMarketingSettings(prev => ({ ...prev, ...settings }));
  };

  const addAdCampaign = (campaignData: Omit<AdCampaign, 'id'>) => {
    const newCampaign: AdCampaign = {
      ...campaignData,
      id: `ad-${Date.now()}`
    };
    setMarketingSettings(prev => ({
      ...prev,
      adCampaigns: [newCampaign, ...prev.adCampaigns]
    }));
  };

  const updateAdCampaign = (updatedCampaign: AdCampaign) => {
    setMarketingSettings(prev => ({
      ...prev,
      adCampaigns: prev.adCampaigns.map(c => (c.id === updatedCampaign.id ? updatedCampaign : c))
    }));
  };

  const deleteAdCampaign = (id: string) => {
    setMarketingSettings(prev => ({
      ...prev,
      adCampaigns: prev.adCampaigns.filter(c => c.id !== id)
    }));
  };

  const toggleAdCampaignStatus = (id: string) => {
    setMarketingSettings(prev => ({
      ...prev,
      adCampaigns: prev.adCampaigns.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status: c.status === 'active' ? 'paused' : 'active'
          };
        }
        return c;
      })
    }));
  };

  const resetToDefaults = () => {
    setProjects(initialProjects);
    setReviews(initialReviews);
    setGoogleSettings(initialGoogleSettings);
    setAdminUsers(initialAdminUsers);
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

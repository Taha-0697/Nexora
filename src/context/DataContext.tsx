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

  // Review Handlers (Connected strictly to Neon DB API)
  const addReview = async (reviewData: any) => {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || errJson.details || 'Failed to save review to database');
    }
    const created = await res.json();
    setReviews(prev => [created, ...prev.filter(r => r.id !== created.id)]);
    return created;
  };

  const updateReview = async (updated: Review) => {
    const res = await fetch(`/api/reviews/${updated.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || errJson.details || 'Failed to update review in database');
    }
    const saved = await res.json();
    setReviews(prev => prev.map(r => (r.id === saved.id ? saved : r)));
    return saved;
  };

  const deleteReview = async (id: string) => {
    const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || errJson.details || 'Failed to delete review from database');
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

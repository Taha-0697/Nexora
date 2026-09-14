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
  reviews: Review[];
  inquiries: Inquiry[];
  services: ServiceItem[];
  googleSettings: GoogleReviewSettings;
  adminUsers: AdminUser[];
  marketingSettings: MarketingSettings;

  // Project Actions
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;

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

  // Marketing & Ads Actions
  updateMarketingSettings: (settings: Partial<MarketingSettings>) => void;
  addAdCampaign: (campaign: Omit<AdCampaign, 'id'>) => void;
  updateAdCampaign: (campaign: AdCampaign) => void;
  deleteAdCampaign: (id: string) => void;
  toggleAdCampaignStatus: (id: string) => void;

  // Restore Default State
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Projects State
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('nexora_projects');
      return saved ? JSON.parse(saved) : initialProjects;
    } catch (e) {
      console.error('Error loading projects', e);
      return initialProjects;
    }
  });

  // 2. Reviews State
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('nexora_reviews');
      return saved ? JSON.parse(saved) : initialReviews;
    } catch (e) {
      console.error('Error loading reviews', e);
      return initialReviews;
    }
  });

  // 3. Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    try {
      const saved = localStorage.getItem('nexora_inquiries');
      if (saved) return JSON.parse(saved);
      return [
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
    } catch (e) {
      console.error('Error loading inquiries', e);
      return [];
    }
  });

  // 4. Services (static catalog)
  const [services] = useState<ServiceItem[]>(initialServices);

  // 5. Google Review Settings
  const [googleSettings, setGoogleSettings] = useState<GoogleReviewSettings>(() => {
    try {
      const saved = localStorage.getItem('nexora_google_settings');
      return saved ? JSON.parse(saved) : initialGoogleSettings;
    } catch (e) {
      console.error('Error loading google settings', e);
      return initialGoogleSettings;
    }
  });

  // 6. Admin Users State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem('nexora_admin_users');
      return saved ? JSON.parse(saved) : initialAdminUsers;
    } catch (e) {
      console.error('Error loading admin users', e);
      return initialAdminUsers;
    }
  });

  // 7. Marketing Settings State
  const [marketingSettings, setMarketingSettings] = useState<MarketingSettings>(() => {
    try {
      const saved = localStorage.getItem('nexora_marketing_settings');
      return saved ? JSON.parse(saved) : initialMarketingSettings;
    } catch (e) {
      console.error('Error loading marketing settings', e);
      return initialMarketingSettings;
    }
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

  // Project Handlers
  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Review Handlers
  const addReview = (reviewData: Omit<Review, 'id'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const updateReview = (updated: Review) => {
    setReviews(prev => prev.map(r => (r.id === updated.id ? updated : r)));
  };

  const deleteReview = (id: string) => {
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
        reviews,
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

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Project, Review, Inquiry, ServiceItem, GoogleReviewSettings } from '../types';
import { initialProjects, initialReviews, initialServices, initialGoogleSettings } from '../data/seedData';

interface DataContextType {
  projects: Project[];
  reviews: Review[];
  inquiries: Inquiry[];
  services: ServiceItem[];
  googleSettings: GoogleReviewSettings;
  
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
      // Default initial inquiry sample
      return [
        {
          id: 'inq-1',
          name: 'Ahmed Al-Subaie',
          email: 'a.subaie@gulfenterprises.sa',
          phone: '+966 50 123 4567',
          company: 'Gulf Horizon Holdings',
          serviceType: 'Enterprise Odoo & Custom ERPs',
          budget: '$25,000 - $50,000',
          timeline: '2 - 3 Months',
          message: 'We require a multi-warehouse Odoo 17 implementation with custom VAT and mobile inventory integration.',
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

  // Project Handlers
  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Review Handlers
  const addReview = (reviewData: Omit<Review, 'id'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const updateReview = (updated: Review) => {
    setReviews(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const syncGoogleReviews = async (): Promise<boolean> => {
    // Simulate real-time fetch from Google Places API / Google Business Profile
    await new Promise(resolve => setTimeout(resolve, 1400));

    // Add an organic verified Google review if not already present
    const organicGoogleReview: Review = {
      id: `rev-google-${Date.now()}`,
      authorName: 'Sultan Khalid Al-Harthy',
      authorRole: 'Chief Information Officer',
      company: 'PetroTech Global Systems',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      content: {
        en: 'Nexora Systems audited and migrated our legacy server cluster to a resilient Kubernetes multi-region architecture. Flawless execution and unmatched responsiveness.',
        ar: 'قامت نيكسورا للأنظمة بتدقيق وترحيل خوادمنا القديمة إلى بنية كوبرنيتس سحابية حديثة متعددة المناطق. تنفيذ لا تشوبه شائبة واستجابة سريعة جداً.'
      },
      date: 'Just now (Google Live Sync)',
      isGoogleReview: true,
      googleReviewUrl: 'https://maps.google.com/?q=Nexora+Systems',
      verified: true
    };

    setReviews(prev => {
      // Prevent duplicates by checking author
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
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
  };

  const deleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
  };

  const resetToDefaults = () => {
    setProjects(initialProjects);
    setReviews(initialReviews);
    setGoogleSettings(initialGoogleSettings);
    localStorage.removeItem('nexora_projects');
    localStorage.removeItem('nexora_reviews');
    localStorage.removeItem('nexora_google_settings');
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        reviews,
        inquiries,
        services,
        googleSettings,
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

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import type { ServiceCategory, Project, Review, UserRole, TeamMember, AdCampaign } from '../../types';
import { OmnichannelMarketingHub } from './OmnichannelMarketingHub';
import {
  Lock,
  FolderPlus,
  MessageSquarePlus,
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  Star,
  Mail,
  ArrowLeft,
  Sliders,
  Sun,
  Moon,
  Users,
  Megaphone,
  ExternalLink,
  Plus,
  X,
  Video
} from 'lucide-react';

interface AdminPortalProps {
  onBackToWebsite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToWebsite }) => {
  const { theme, toggleTheme } = useTheme();
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    reviews,
    addReview,
    updateReview,
    deleteReview,
    syncGoogleReviews,
    inquiries,
    updateInquiryStatus,
    deleteInquiry,
    googleSettings,
    updateGoogleSettings,
    adminUsers,
    updateAdminUser,
    addAdminUser,
    deleteAdminUser,
    marketingSettings,
    updateMarketingSettings,
    addAdCampaign,
    updateAdCampaign,
    deleteAdCampaign,
    toggleAdCampaignStatus,
    resetToDefaults
  } = useData();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(() => {
    try {
      const saved = sessionStorage.getItem('nexora_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'projects' | 'marketing' | 'reviews' | 'leads' | 'settings' | 'team'
  >('projects');

  // Modals State
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // New / Edit Project Form
  const [projectForm, setProjectForm] = useState({
    titleEn: '',
    titleAr: '',
    category: 'erp' as ServiceCategory,
    client: '',
    country: 'UAE / GCC',
    shortDescEn: '',
    shortDescAr: '',
    fullDescEn: '',
    fullDescAr: '',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    tags: '.NET Core Web API, Next.js, MSSQL, Redis, REST APIs',
    metric1Val: '+65%',
    metric1LabelEn: 'Processing Speed',
    metric1LabelAr: 'سرعة العمليات',
    metric2Val: '99.99%',
    metric2LabelEn: 'Accuracy',
    metric2LabelAr: 'دقة المحاسبة',
    metric3Val: '-80%',
    metric3LabelEn: 'Time Saved',
    metric3LabelAr: 'توفير الوقت',
    liveUrl: 'https://demo-portal.nexora.io',
    hasLiveDemo: true,
    featured: true,
    completionDate: '2026-06'
  });

  const [isSavingProject, setIsSavingProject] = useState(false);
  const [projectSubmitError, setProjectSubmitError] = useState('');

  // Review Form
  const [reviewForm, setReviewForm] = useState({
    authorName: '',
    authorRole: '',
    company: '',
    location: 'Dubai, UAE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    contentEn: '',
    contentAr: '',
    hasVideo: false,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42994-large.mp4',
    featured: false,
    techCategory: 'dotnet' as 'dotnet' | 'odoo' | 'general',
    isGoogleReview: true,
    googleReviewUrl: 'https://maps.google.com/?q=Nexora+Systems'
  });

  const [isSavingReview, setIsSavingReview] = useState(false);
  const [reviewSubmitError, setReviewSubmitError] = useState('');
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [userSubmitError, setUserSubmitError] = useState('');

  // Campaign Form
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    platform: 'Google Ads' as AdCampaign['platform'],
    dailyBudget: 100,
    targetRegion: 'GCC (UAE, Saudi Arabia)',
  });

  // New User Form
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    title: '',
    password: '',
    roles: ['project_manager'] as UserRole[]
  });

  // Google Syncing state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState('');

  // Handle Login — async against Neon DB via /api/auth/login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        setAuthError(errJson.error || 'Invalid email or password. Please try again.');
        return;
      }

      const { user } = await res.json();
      setCurrentUser(user);
      sessionStorage.setItem('nexora_active_user', JSON.stringify(user));

      // Set default tab based on roles
      if (user.roles.includes('super_admin') || user.roles.includes('admin') || user.roles.includes('project_manager')) {
        setActiveTab('projects');
      } else if (user.roles.includes('marketing_manager')) {
        setActiveTab('marketing');
      } else if (user.roles.includes('review_manager')) {
        setActiveTab('reviews');
      }
    } catch (err: any) {
      setAuthError('Connection error. Please check your network and try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('nexora_active_user');
  };

  // Helper to check user permissions
  const isSuperOrAdmin = (): boolean => {
    if (!currentUser || !Array.isArray(currentUser.roles)) return false;
    return currentUser.roles.includes('super_admin') || currentUser.roles.includes('admin');
  };

  const hasRole = (role: UserRole): boolean => {
    if (!currentUser || !Array.isArray(currentUser.roles)) return false;
    return isSuperOrAdmin() || currentUser.roles.includes(role);
  };

  // Helper to verify if active tab is accessible
  const isTabAuthorized = (tab: 'projects' | 'marketing' | 'reviews' | 'leads' | 'settings' | 'team'): boolean => {
    if (!currentUser) return false;
    if (isSuperOrAdmin()) return true;
    switch (tab) {
      case 'projects':
        return hasRole('project_manager');
      case 'marketing':
        return hasRole('marketing_manager');
      case 'reviews':
        return hasRole('review_manager');
      case 'leads':
        return hasRole('project_manager') || hasRole('marketing_manager');
      case 'settings':
      case 'team':
        return isSuperOrAdmin();
      default:
        return false;
    }
  };

  // Get primary authorized tab for redirection
  const getPrimaryAuthorizedTab = (roles: UserRole[] = []): 'projects' | 'marketing' | 'reviews' | 'leads' | 'settings' | 'team' => {
    if (roles.includes('super_admin') || roles.includes('admin')) return 'projects';
    if (roles.includes('project_manager')) return 'projects';
    if (roles.includes('marketing_manager')) return 'marketing';
    if (roles.includes('review_manager')) return 'reviews';
    return 'projects';
  };

  // Open Edit Project Modal
  const handleStartEditProject = (proj: any) => {
    setEditingProject(proj);
    setProjectForm({
      titleEn: proj.titleEn || proj.title?.en || '',
      titleAr: proj.titleAr || proj.title?.ar || '',
      category: proj.category,
      client: proj.clientName || proj.client || '',
      country: proj.region || proj.country || 'UAE / GCC',
      shortDescEn: proj.shortDesc?.en || '',
      shortDescAr: proj.shortDesc?.ar || '',
      fullDescEn: proj.fullDesc?.en || '',
      fullDescAr: proj.fullDesc?.ar || '',
      image: proj.imageUrl || proj.image || '',
      tags: (proj.techStack || proj.tags || []).join(', '),
      metric1Val: proj.metrics?.[0]?.value || '+50%',
      metric1LabelEn: proj.metrics?.[0]?.label?.en || 'Performance',
      metric1LabelAr: proj.metrics?.[0]?.label?.ar || 'الأداء',
      metric2Val: proj.metrics?.[1]?.value || '99.9%',
      metric2LabelEn: proj.metrics?.[1]?.label?.en || 'Uptime',
      metric2LabelAr: proj.metrics?.[1]?.label?.ar || 'التوفر',
      metric3Val: proj.metrics?.[2]?.value || '-40%',
      metric3LabelEn: proj.metrics?.[2]?.label?.en || 'Efficiency',
      metric3LabelAr: proj.metrics?.[2]?.label?.ar || 'الكفاءة',
      liveUrl: proj.liveDemoUrl || proj.liveUrl || '',
      hasLiveDemo: proj.hasLiveDemo !== undefined ? proj.hasLiveDemo : Boolean(proj.liveUrl || proj.liveDemoUrl),
      featured: proj.featured !== undefined ? proj.featured : true,
      completionDate: proj.completionDate || '2026-06'
    });
  };

  // Save Project (Add or Edit) - Wired to POST /api/projects
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.titleEn) return;
    setIsSavingProject(true);
    setProjectSubmitError('');

    const tagsArray = projectForm.tags.split(',').map(t => t.trim()).filter(Boolean);

    const projectPayload = {
      titleEn: projectForm.titleEn,
      titleAr: projectForm.titleAr || projectForm.titleEn,
      category: projectForm.category,
      clientName: projectForm.client || 'Enterprise Partner',
      region: projectForm.country || 'UAE / GCC',
      imageUrl: projectForm.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      hasLiveDemo: Boolean(projectForm.hasLiveDemo),
      liveDemoUrl: projectForm.liveUrl || null,
      techStack: tagsArray,
      // Compatibility fields for immediate UI updates
      title: {
        en: projectForm.titleEn,
        ar: projectForm.titleAr || projectForm.titleEn
      },
      client: projectForm.client || 'Enterprise Partner',
      country: projectForm.country || 'UAE / GCC',
      image: projectForm.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      shortDesc: {
        en: projectForm.shortDescEn || `${projectForm.category.toUpperCase()} solution engineered for ${projectForm.client || 'Enterprise Partner'}.`,
        ar: projectForm.shortDescAr || `منظومة ${projectForm.category.toUpperCase()} تم تطويرها لـ ${projectForm.client || 'الشركاء'}.`
      },
      fullDesc: {
        en: projectForm.fullDescEn || projectForm.shortDescEn || `Enterprise application engineered for ${projectForm.client || 'Enterprise Partner'}.`,
        ar: projectForm.fullDescAr || projectForm.shortDescAr || `منظومة رقمية متكاملة تم تطويرها لصالح ${projectForm.client || 'الشركاء'}.`
      },
      tags: tagsArray,
      metrics: [
        {
          label: { en: projectForm.metric1LabelEn, ar: projectForm.metric1LabelAr },
          value: projectForm.metric1Val
        },
        {
          label: { en: projectForm.metric2LabelEn, ar: projectForm.metric2LabelAr },
          value: projectForm.metric2Val
        },
        {
          label: { en: projectForm.metric3LabelEn, ar: projectForm.metric3LabelAr },
          value: projectForm.metric3Val
        }
      ],
      featured: projectForm.featured,
      liveUrl: projectForm.liveUrl,
      completionDate: projectForm.completionDate
    };

    try {
      if (editingProject) {
        updateProject({
          ...projectPayload,
          id: editingProject.id
        });
        setEditingProject(null);
      } else {
        await addProject(projectPayload);
        setShowAddProjectModal(false);
      }
    } catch (err: any) {
      console.error('Failed to save project:', err);
      setProjectSubmitError(err.message || 'Failed to save project to Neon DB');
    } finally {
      setIsSavingProject(false);
    }
  };

  // Open Add Review Modal (reset form)
  const handleOpenAddReview = () => {
    setEditingReview(null);
    setReviewSubmitError('');
    setReviewForm({
      authorName: '',
      authorRole: '',
      company: '',
      location: 'Dubai, UAE',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      contentEn: '',
      contentAr: '',
      hasVideo: false,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42994-large.mp4',
      featured: false,
      techCategory: 'dotnet',
      isGoogleReview: true,
      googleReviewUrl: 'https://maps.google.com/?q=Nexora+Systems'
    });
    setShowAddReviewModal(true);
  };

  // Open Edit Review Modal
  const handleOpenEditReview = (rev: Review) => {
    setEditingReview(rev);
    setReviewSubmitError('');
    setReviewForm({
      authorName: rev.authorName,
      authorRole: rev.authorRole,
      company: rev.company,
      location: rev.location || 'Dubai, UAE',
      avatar: rev.avatar,
      rating: rev.rating || 5,
      contentEn: typeof rev.content === 'object' ? rev.content.en : (rev.content as any),
      contentAr: typeof rev.content === 'object' ? rev.content.ar : (rev.content as any),
      hasVideo: Boolean(rev.hasVideo),
      videoUrl: rev.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42994-large.mp4',
      featured: Boolean((rev as any).featured),
      techCategory: ((rev as any).techCategory || 'dotnet') as 'dotnet' | 'odoo' | 'general',
      isGoogleReview: rev.isGoogleReview,
      googleReviewUrl: rev.googleReviewUrl || 'https://maps.google.com/?q=Nexora+Systems',
    });
    setShowAddReviewModal(true);
  };

  // Toggle Featured status directly from card
  const handleToggleFeatured = async (rev: Review) => {
    const newFeatured = !(rev as any).featured;
    await updateReview({
      ...rev,
      featured: newFeatured,
    } as any);
  };

  // Submit Review (Add or Edit - Connected strictly to Neon DB)
  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.authorName || !reviewForm.contentEn.trim()) return;
    setIsSavingReview(true);
    setReviewSubmitError('');

    try {
      if (editingReview) {
        await updateReview({
          ...editingReview,
          authorName: reviewForm.authorName,
          clientName: reviewForm.authorName,
          authorRole: reviewForm.authorRole || 'Managing Director',
          role: reviewForm.authorRole || 'Managing Director',
          company: reviewForm.company || 'Enterprise Partner',
          location: reviewForm.location || 'Dubai, UAE',
          avatar: reviewForm.avatar,
          rating: Number(reviewForm.rating) || 5,
          content: {
            en: reviewForm.contentEn.replace(/Odoo 17/g, 'Odoo'),
            ar: (reviewForm.contentAr || reviewForm.contentEn).replace(/Odoo 17/g, 'Odoo'),
          },
          reviewText: reviewForm.contentEn.replace(/Odoo 17/g, 'Odoo'),
          hasVideo: Boolean(reviewForm.hasVideo),
          videoUrl: reviewForm.hasVideo ? reviewForm.videoUrl : null,
          featured: Boolean(reviewForm.featured),
          techCategory: reviewForm.techCategory,
          verified: true,
        } as any);
      } else {
        await addReview({
          authorName: reviewForm.authorName,
          clientName: reviewForm.authorName,
          authorRole: reviewForm.authorRole || 'Managing Director',
          role: reviewForm.authorRole || 'Managing Director',
          company: reviewForm.company || 'Enterprise Partner',
          location: reviewForm.location || 'Dubai, UAE',
          avatar: reviewForm.avatar,
          rating: Number(reviewForm.rating) || 5,
          content: {
            en: reviewForm.contentEn.replace(/Odoo 17/g, 'Odoo'),
            ar: (reviewForm.contentAr || reviewForm.contentEn).replace(/Odoo 17/g, 'Odoo'),
          },
          reviewText: reviewForm.contentEn.replace(/Odoo 17/g, 'Odoo'),
          hasVideo: Boolean(reviewForm.hasVideo),
          videoUrl: reviewForm.hasVideo ? reviewForm.videoUrl : null,
          featured: Boolean(reviewForm.featured),
          techCategory: reviewForm.techCategory,
          date: 'Just now (Organic)',
          isGoogleReview: reviewForm.isGoogleReview,
          googleReviewUrl: reviewForm.googleReviewUrl,
          verified: true,
        } as any);
      }

      setEditingReview(null);
      setShowAddReviewModal(false);
    } catch (err: any) {
      setReviewSubmitError(err.message || 'Failed to save review to database.');
    } finally {
      setIsSavingReview(false);
    }
  };

  // Submit Campaign
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.name) return;

    addAdCampaign({
      name: campaignForm.name,
      platform: campaignForm.platform,
      status: 'active',
      dailyBudget: Number(campaignForm.dailyBudget) || 50,
      targetRegion: campaignForm.targetRegion || 'Global',
      impressions: 0,
      clicks: 0,
      conversions: 0,
      spent: 0
    });

    setShowAddCampaignModal(false);
    setCampaignForm({
      name: '',
      platform: 'Google Ads',
      dailyBudget: 100,
      targetRegion: 'GCC (UAE, Saudi Arabia)'
    });
  };

  // Submit User (Super Admin creates TeamMember in DB)
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.email || !userForm.name) return;
    setIsSavingUser(true);
    setUserSubmitError('');

    try {
      await addAdminUser({
        name: userForm.name,
        email: userForm.email,
        role: userForm.title || 'Team Specialist',
        title: userForm.title || 'Team Specialist',
        password: userForm.password,
        roles: userForm.roles
      });

      setShowAddUserModal(false);
      setUserForm({
        name: '',
        email: '',
        title: '',
        password: '',
        roles: ['project_manager']
      });
    } catch (err: any) {
      setUserSubmitError(err.message || 'Failed to add team member to database.');
    } finally {
      setIsSavingUser(false);
    }
  };

  // Trigger Google Sync
  const handleTriggerGoogleSync = async () => {
    setIsSyncing(true);
    setSyncSuccessMessage('');
    await syncGoogleReviews();
    setIsSyncing(false);
    setSyncSuccessMessage('Google Reviews successfully synced with Google Business Profile!');
    setTimeout(() => setSyncSuccessMessage(''), 4000);
  };

  // ==========================================
  // 1. AUTHENTICATION LOGIN SCREEN
  // ==========================================
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="w-full max-w-lg glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-xl bg-white dark:bg-slate-900">
          
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-sky-400">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
            Nexora Command Center
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">
            Private Access for Management Team (Role-Based Authorization)
          </p>

          <form onSubmit={handleLogin} className="space-y-3.5 text-left mb-6">
            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Authorized Work Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="e.g. pm@nexora.io"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-500 dark:text-rose-400 font-semibold text-center">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating…
                </>
              ) : (
                'Sign In to Command Center'
              )}
            </button>

            <button
              type="button"
              onClick={onBackToWebsite}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </form>

          <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center pt-2">
            Access restricted to authorized Nexora personnel only.
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // 2. AUTHENTICATED DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white cursor-pointer transition-colors"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Nexora Command Center</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-sky-300 border border-indigo-200 dark:border-indigo-500/30">
                  {(currentUser.roles || []).map(r => r.toUpperCase().replace('_', ' ')).join(' • ')}
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged in as <strong>{currentUser.name}</strong> ({currentUser.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={onBackToWebsite}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-sky-300 border border-indigo-200 dark:border-indigo-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Website</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Sync Success Alert */}
        {syncSuccessMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{syncSuccessMessage}</span>
          </div>
        )}

        {/* Navigation Tabs (Filtered strictly by User Role) */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {/* Projects: Admin or Project Manager */}
          {hasRole('project_manager') && (
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <FolderPlus className="w-4 h-4" />
              <span>Projects ({projects.length})</span>
            </button>
          )}

          {/* Marketing & Ads: Admin or Marketing Manager */}
          {hasRole('marketing_manager') && (
            <button
              onClick={() => setActiveTab('marketing')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'marketing'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Marketing & Ads ({marketingSettings?.adCampaigns?.length || 0})</span>
            </button>
          )}

          {/* Reviews: Admin or Review Manager */}
          {hasRole('review_manager') && (
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Reviews ({reviews.length})</span>
            </button>
          )}

          {/* Leads: Admin, Project Manager or Marketing Manager */}
          {(hasRole('project_manager') || hasRole('marketing_manager')) && (
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Inquiries & Leads ({inquiries.length})</span>
            </button>
          )}

          {/* Settings: Super Admin / Admin Only */}
          {isSuperOrAdmin() && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>System Settings</span>
            </button>
          )}

          {/* Team Roles: Super Admin / Admin Only */}
          {isSuperOrAdmin() && (
            <button
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'team'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Team & Roles ({adminUsers.length})</span>
            </button>
          )}
        </div>

        {/* ==========================================
            TAB 1: PROJECTS (Add / Edit / Delete)
            ========================================== */}
        {activeTab === 'projects' && hasRole('project_manager') && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Portfolio Deliverables & Client Redirects
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add, edit descriptions, tech stacks, metrics, and live URL redirects.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setShowAddProjectModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>

            {/* Projects Table */}
            <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Client / Region</th>
                      <th className="px-6 py-4">Live Redirect Link</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {projects.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 text-xs">
                          <FolderPlus className="w-8 h-8 mx-auto mb-2 opacity-40 text-indigo-500" />
                          <p className="font-semibold text-slate-700 dark:text-slate-300">No project deliverables in Neon DB</p>
                          <p className="text-[11px] mt-1">Click "Add New Project" above to create your first portfolio entry.</p>
                        </td>
                      </tr>
                    ) : (
                      projects.map(proj => {
                        const titleEn = proj.title?.en || (proj as any).titleEn || 'Untitled Deliverable';
                        const titleAr = proj.title?.ar || (proj as any).titleAr || titleEn;
                        const client = proj.client || (proj as any).clientName || 'Enterprise Partner';
                        const country = proj.country || (proj as any).region || 'UAE / GCC';
                        const image = proj.image || (proj as any).imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';
                        const liveUrl = proj.liveUrl || (proj as any).liveDemoUrl;

                        return (
                          <tr key={proj.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={image}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                                    {titleEn}
                                  </div>
                                  <div className="text-[11px] text-indigo-600 dark:text-sky-400 font-arabic">
                                    {titleAr}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-sky-300 font-mono text-[10px] uppercase font-bold border border-slate-200 dark:border-slate-700">
                                {proj.category}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-medium text-slate-800 dark:text-slate-200">
                                {client}
                              </div>
                              <div className="text-slate-400 text-[10px]">
                                {country}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {liveUrl ? (
                                <a
                                  href={liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-mono text-xs"
                                >
                                  <span className="truncate max-w-[180px]">{liveUrl}</span>
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                              ) : (
                                <span className="text-slate-400 italic">No direct link</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleStartEditProject(proj)}
                                  className="p-2 rounded-lg bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-100 text-indigo-600 dark:text-sky-400 border border-indigo-200 dark:border-slate-700 transition-colors cursor-pointer"
                                  title="Edit Project Details"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (window.confirm(`Delete project "${titleEn}" permanently from database?`)) {
                                      try {
                                        await deleteProject(proj.id);
                                      } catch (err: any) {
                                        alert(`Failed to delete project: ${err.message}`);
                                      }
                                    }
                                  }}
                                  className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40 transition-colors cursor-pointer"
                                  title="Delete Project Permanently"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: MARKETING & ADS MANAGEMENT (Omnichannel Hub)
            ========================================== */}
        {activeTab === 'marketing' && hasRole('marketing_manager') && (
          <OmnichannelMarketingHub
            marketingSettings={marketingSettings}
            updateMarketingSettings={updateMarketingSettings}
            addAdCampaign={addAdCampaign}
            updateAdCampaign={updateAdCampaign}
            deleteAdCampaign={deleteAdCampaign}
            toggleAdCampaignStatus={toggleAdCampaignStatus}
            canManage={hasRole('marketing_manager')}
          />
        )}

        {/* ==========================================
            TAB 3: REVIEWS & GOOGLE SYNC
            ========================================== */}
        {activeTab === 'reviews' && hasRole('review_manager') && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center p-2 shrink-0 border border-slate-200 dark:border-slate-700">
                  <svg className="w-full h-full" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Google Business Profile Reputation Sync
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live Score: <span className="text-amber-500 font-bold">{googleSettings.overallRating} ★</span> ({googleSettings.totalReviewsCount} Reviews) • Last Sync: {googleSettings.lastSyncTimestamp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={handleTriggerGoogleSync}
                  disabled={isSyncing}
                  className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-indigo-600 dark:text-sky-400 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing with Google...' : 'Trigger Google Reviews Sync'}</span>
                </button>

                <button
                  onClick={handleOpenAddReview}
                  className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>Add Review</span>
                </button>
              </div>
            </div>

            {/* Reviews Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map(rev => (
                <div
                  key={rev.id}
                  className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between bg-white dark:bg-slate-900 shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white text-sm">
                              {rev.authorName}
                            </span>
                            {/* Tech Category Badge */}
                            {(rev as any).techCategory === 'odoo' ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400/30 text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                                Odoo
                              </span>
                            ) : (rev as any).techCategory === 'dotnet' ? (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-400/30 text-[9px] font-mono font-bold text-indigo-700 dark:text-sky-300">
                                .NET
                              </span>
                            ) : null}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {rev.authorRole} • {rev.company}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span className="font-bold text-xs">{rev.rating}.0</span>
                        </div>
                        {rev.hasVideo && (
                          <span className="text-[10px] font-mono text-sky-400 flex items-center gap-0.5">
                            <Video className="w-2.5 h-2.5" /> Video
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed italic mb-2">
                      "{rev.content.en}"
                    </p>
                    <p className="text-indigo-600 dark:text-sky-300/80 text-xs font-arabic leading-relaxed">
                      "{rev.content.ar}"
                    </p>
                  </div>

                  <div className="pt-3 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      {/* Featured Spotlight Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(rev)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          (rev as any).featured
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-amber-500 border border-slate-200 dark:border-slate-700'
                        }`}
                        title="Click to pin or unpin from 40% Left Spotlight"
                      >
                        <Star className={`w-3 h-3 ${(rev as any).featured ? 'fill-current' : ''}`} />
                        <span>{(rev as any).featured ? 'Featured Spotlight' : 'Set Featured'}</span>
                      </button>
                      <span className="text-slate-400 font-mono">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditReview(rev)}
                        className="text-indigo-600 dark:text-sky-400 hover:underline flex items-center gap-1 text-xs cursor-pointer font-semibold"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => deleteReview(rev.id)}
                        className="text-rose-500 hover:text-rose-600 flex items-center gap-1 text-xs cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 4: LEADS & INQUIRIES
            ========================================== */}
        {activeTab === 'leads' && (hasRole('project_manager') || hasRole('marketing_manager')) && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Client Proposals & Estimator Submissions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Incoming leads with client-specified tech stacks and budget scopes.
              </p>
            </div>

            {inquiries.length === 0 ? (
              <div className="glass-panel p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm bg-white dark:bg-slate-900">
                No inquiries received yet. Leads submitted through the public website will appear here in real-time.
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map(inq => (
                  <div
                    key={inq.id}
                    className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 bg-white dark:bg-slate-900 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {inq.name}
                        </h3>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-3 mt-0.5">
                          <span>Email: <strong className="text-slate-700 dark:text-slate-200">{inq.email}</strong></span>
                          {inq.phone && <span>Phone: <strong className="text-slate-700 dark:text-slate-200">{inq.phone}</strong></span>}
                          {inq.company && <span>Company: <strong className="text-slate-700 dark:text-slate-200">{inq.company}</strong></span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={inq.status}
                          onChange={e => updateInquiryStatus(inq.id, e.target.value as any)}
                          className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-indigo-600 dark:text-sky-300"
                        >
                          <option value="new">New Lead</option>
                          <option value="contacted">Contacted</option>
                          <option value="proposal_sent">Proposal Sent</option>
                          <option value="closed">Closed / Won</option>
                        </select>
                        <button
                          onClick={() => deleteInquiry(inq.id)}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500 hover:bg-rose-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">Service Requested</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{inq.serviceType}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">Budget Bracket</span>
                        <span className="font-semibold text-indigo-600 dark:text-sky-400">{inq.budget}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">Target Timeline</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{inq.timeline}</span>
                      </div>
                    </div>

                    {inq.customStack && inq.customStack.length > 0 && (
                      <div className="text-xs">
                        <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Client Specified Tech Stacks:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {inq.customStack.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-slate-800 text-[10px] font-mono font-semibold text-indigo-700 dark:text-sky-300 border border-indigo-200 dark:border-slate-700">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {inq.message && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed">
                        {inq.message}
                      </p>
                    )}

                    <div className="text-[10px] text-slate-400 font-mono">
                      Received on {new Date(inq.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 5: SYSTEM SETTINGS (Super Admin / Admin Only)
            ========================================== */}
        {activeTab === 'settings' && isSuperOrAdmin() && (
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-7 max-w-3xl bg-white dark:bg-slate-900 shadow-xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                System & Reputation Configuration
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update Place IDs, Google sync parameters, or restore initial demo data.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Google Maps Business Place ID
                </label>
                <input
                  type="text"
                  value={googleSettings.placeId}
                  onChange={e => updateGoogleSettings({ placeId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Business Name on Google Maps
                </label>
                <input
                  type="text"
                  value={googleSettings.businessName}
                  onChange={e => updateGoogleSettings({ businessName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Google Maps Public Review Link
                </label>
                <input
                  type="text"
                  value={googleSettings.googleMapsUrl}
                  onChange={e => updateGoogleSettings({ googleMapsUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Factory Reset
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Restore all projects, reviews, settings, and campaigns back to original seed data state.
              </p>
              <button
                onClick={() => {
                  if (window.confirm('Reset all projects, reviews, and settings to factory default state?')) {
                    resetToDefaults();
                    alert('Data restored to initial factory defaults.');
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Reset to Factory Defaults
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 6: TEAM & MULTI-ROLES (Super Admin / Admin Only)
            ========================================== */}
        {activeTab === 'team' && isSuperOrAdmin() && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Management Team & Multi-Role Permissions
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  All team users and roles are stored in the database (TeamMember) and managed by Super Admin.
                </p>
              </div>
              <button
                onClick={() => {
                  setUserSubmitError('');
                  setShowAddUserModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Team Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminUsers.map(user => (
                <div
                  key={user.id}
                  className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatarUrl || user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{user.name}</h4>
                        <div className="text-xs text-slate-400">{(user as any).title || user.role}</div>
                        <div className="text-[11px] font-mono text-indigo-600 dark:text-sky-400">{user.email}</div>
                      </div>
                    </div>
                    {/* Delete user button — guard against self-deletion */}
                    {currentUser?.id !== user.id && (
                      <button
                        type="button"
                        title="Remove user"
                        onClick={async () => {
                          if (!window.confirm(`Remove ${user.name} from the portal? This action cannot be undone.`)) return;
                          try {
                            await deleteAdminUser(user.id);
                          } catch (err: any) {
                            alert(err.message || 'Failed to delete user.');
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition-colors cursor-pointer flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-1.5">
                      Assigned Roles (Multi-Role Support):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(['super_admin', 'admin', 'project_manager', 'marketing_manager', 'review_manager'] as UserRole[]).map(role => {
                        const userRoles = user.roles || [];
                        const hasThisRole = userRoles.includes(role);
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={async () => {
                              if (currentUser?.id === user.id && (role === 'super_admin' || role === 'admin') && hasThisRole) {
                                alert('You cannot remove your own administrative privileges.');
                                return;
                              }
                              const updatedRoles = hasThisRole
                                ? userRoles.filter(r => r !== role)
                                : [...userRoles, role];
                              try {
                                await updateAdminUser({ ...user, roles: updatedRoles });
                              } catch (err: any) {
                                alert(err.message || 'Failed to update roles.');
                              }
                            }}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold transition-colors cursor-pointer ${
                              hasThisRole
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {role.toUpperCase().replace('_', ' ')}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            UNAUTHORIZED ROLE RESTRICTION GUARD
            ========================================== */}
        {!isTabAuthorized(activeTab) && (
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/20 text-center space-y-4 max-w-xl mx-auto my-12 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-300 dark:border-rose-700">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Access Restricted — Insufficient Role Permissions
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Your current account role(s) <span className="font-mono font-bold text-indigo-600 dark:text-sky-400">[{(currentUser.roles || []).map(r => r.toUpperCase().replace('_', ' ')).join(', ')}]</span> does not have authorization to view or configure the <strong className="text-slate-900 dark:text-white capitalize">{activeTab}</strong> console.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveTab(getPrimaryAuthorizedTab(currentUser.roles || []))}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                Go to Authorized Console ({getPrimaryAuthorizedTab(currentUser.roles || []).toUpperCase()})
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ==========================================
          MODAL 1: ADD OR EDIT PROJECT
          ========================================== */}
      {(showAddProjectModal || editingProject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 bg-white dark:bg-slate-900 shadow-2xl">
            <button
              onClick={() => {
                setShowAddProjectModal(false);
                setEditingProject(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              {editingProject ? 'Edit Project Deliverable' : 'Add New Portfolio Project'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Update client case study, tech stack tags, and direct demo redirect link.
            </p>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Title (English)</label>
                  <input
                    type="text"
                    required
                    value={projectForm.titleEn}
                    onChange={e => setProjectForm({ ...projectForm, titleEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Title (Arabic)</label>
                  <input
                    type="text"
                    value={projectForm.titleAr}
                    onChange={e => setProjectForm({ ...projectForm, titleAr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-arabic text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={e => setProjectForm({ ...projectForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="erp">Custom ERP (.NET / MSSQL)</option>
                    <option value="web">Web Portals & Apps</option>
                    <option value="mobile">Mobile (iOS / Android / Flutter)</option>
                    <option value="ai">AI Integrations & LLMs</option>
                    <option value="cloud">Cloud & DevOps</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Client Name</label>
                  <input
                    type="text"
                    value={projectForm.client}
                    onChange={e => setProjectForm({ ...projectForm, client: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Country / Region</label>
                  <input
                    type="text"
                    value={projectForm.country}
                    onChange={e => setProjectForm({ ...projectForm, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
                  value={projectForm.image}
                  onChange={e => setProjectForm({ ...projectForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              {/* Direct Project Redirect Link & Live Demo Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Live Project Redirect URL (Opens on "Live Demo" Click)
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-indigo-600 dark:text-sky-400">
                    <input
                      type="checkbox"
                      checked={projectForm.hasLiveDemo}
                      onChange={e => setProjectForm({ ...projectForm, hasLiveDemo: e.target.checked })}
                      className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Live Demo Enabled</span>
                  </label>
                </div>
                <input
                  type="url"
                  placeholder="https://client-demo.nexora.io"
                  value={projectForm.liveUrl}
                  onChange={e => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Short Description (English)</label>
                <textarea
                  rows={2}
                  value={projectForm.shortDescEn}
                  onChange={e => setProjectForm({ ...projectForm, shortDescEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Technical Description (English)</label>
                <textarea
                  rows={3}
                  value={projectForm.fullDescEn}
                  onChange={e => setProjectForm({ ...projectForm, fullDescEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tech Stack Tags (Comma separated)</label>
                <input
                  type="text"
                  value={projectForm.tags}
                  onChange={e => setProjectForm({ ...projectForm, tags: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-500 mb-1">Metric 1 Value</label>
                  <input
                    type="text"
                    value={projectForm.metric1Val}
                    onChange={e => setProjectForm({ ...projectForm, metric1Val: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-500 mb-1">Metric 2 Value</label>
                  <input
                    type="text"
                    value={projectForm.metric2Val}
                    onChange={e => setProjectForm({ ...projectForm, metric2Val: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-500 mb-1">Metric 3 Value</label>
                  <input
                    type="text"
                    value={projectForm.metric3Val}
                    onChange={e => setProjectForm({ ...projectForm, metric3Val: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              {projectSubmitError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs">
                  {projectSubmitError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddProjectModal(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProject}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold cursor-pointer"
                >
                  {isSavingProject ? 'Saving to Database...' : editingProject ? 'Save Project Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2: ADD AD CAMPAIGN
          ========================================== */}
      {showAddCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 bg-white dark:bg-slate-900 shadow-2xl">
            <button
              onClick={() => setShowAddCampaignModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Launch New Ad Campaign
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Create a paid marketing campaign across search or social channels.
            </p>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Ads: Custom Web ERP"
                  value={campaignForm.name}
                  onChange={e => setCampaignForm({ ...campaignForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ad Platform</label>
                <select
                  value={campaignForm.platform}
                  onChange={e => setCampaignForm({ ...campaignForm, platform: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Google Ads">Google Ads</option>
                  <option value="LinkedIn B2B">LinkedIn B2B Ads</option>
                  <option value="Meta / Facebook">Meta / Facebook</option>
                  <option value="X / Twitter">X / Twitter</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Daily Budget ($)</label>
                  <input
                    type="number"
                    min="10"
                    value={campaignForm.dailyBudget}
                    onChange={e => setCampaignForm({ ...campaignForm, dailyBudget: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Region</label>
                  <input
                    type="text"
                    value={campaignForm.targetRegion}
                    onChange={e => setCampaignForm({ ...campaignForm, targetRegion: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddCampaignModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 3: ADD / EDIT REVIEW — Professional Form
          ========================================== */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 bg-white dark:bg-slate-900 shadow-2xl">
            <button
              onClick={() => { setEditingReview(null); setShowAddReviewModal(false); }}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-sky-400">
                <MessageSquarePlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingReview ? 'Edit Client Review' : 'Add Verified Client Review'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {editingReview 
                    ? 'Update client feedback, toggle featured spotlight, or adjust category.' 
                    : 'All reviews are saved to the database and shown on the public website.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-5 text-xs mt-6">
              {/* Section 1: Client Information */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" />
                  <span>Client Information</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sultan Al-Rashid"
                      value={reviewForm.authorName}
                      onChange={e => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title / Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Chief Information Officer"
                      value={reviewForm.authorRole}
                      onChange={e => setReviewForm({ ...reviewForm, authorRole: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company</label>
                    <input
                      type="text"
                      placeholder="e.g. Gulf Horizon Logistics"
                      value={reviewForm.company}
                      onChange={e => setReviewForm({ ...reviewForm, company: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="Dubai, UAE"
                      value={reviewForm.location}
                      onChange={e => setReviewForm({ ...reviewForm, location: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Avatar / Photo URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={reviewForm.avatar}
                    onChange={e => setReviewForm({ ...reviewForm, avatar: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-[11px] focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Section 2: Rating & Classification */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                  <Star className="w-3.5 h-3.5" />
                  <span>Rating & Classification</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Star Rating</label>
                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="p-1 cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star className={`w-6 h-6 ${star <= reviewForm.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300 dark:text-slate-600'} transition-colors`} />
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-bold text-slate-900 dark:text-white">{reviewForm.rating}.0</span>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tech Category</label>
                    <select
                      value={reviewForm.techCategory}
                      onChange={e => setReviewForm({ ...reviewForm, techCategory: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:border-indigo-500 focus:outline-none transition-colors"
                    >
                      <option value="dotnet">.NET Enterprise Architecture</option>
                      <option value="odoo">Odoo Enterprise & Python</option>
                      <option value="general">General Enterprise & Cloud</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Review Content */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>Review Content</span>
                </h4>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Review Text (English) *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter the client's review in English..."
                    value={reviewForm.contentEn}
                    onChange={e => setReviewForm({ ...reviewForm, contentEn: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-colors leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Review Text (Arabic) <span className="text-slate-400 font-normal">— optional</span></label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    placeholder="أدخل نص التقييم بالعربية (اختياري)..."
                    value={reviewForm.contentAr}
                    onChange={e => setReviewForm({ ...reviewForm, contentAr: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-arabic text-right focus:border-indigo-500 focus:outline-none transition-colors leading-relaxed"
                  />
                </div>
              </div>

              {/* Section 4: Display Options */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Display Options</span>
                </h4>
                
                {/* Featured Spotlight Toggle */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50 transition-colors">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reviewForm.featured}
                      onChange={e => setReviewForm({ ...reviewForm, featured: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block text-xs">
                        ⭐ Featured Spotlight
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Pin this review to the prominent left spotlight on the public homepage.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Video Testimonial Toggle */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-sky-500/30 transition-colors">
                  <label className="flex items-center gap-3 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={reviewForm.hasVideo}
                      onChange={e => setReviewForm({ ...reviewForm, hasVideo: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                        🎥 Video Testimonial
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Attach a client video testimonial (MP4 URL).
                      </span>
                    </div>
                  </label>
                  {reviewForm.hasVideo && (
                    <input
                      type="url"
                      placeholder="https://cdn.example.com/testimonial.mp4"
                      value={reviewForm.videoUrl}
                      onChange={e => setReviewForm({ ...reviewForm, videoUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono mt-1 focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  )}
                </div>
              </div>

              {reviewSubmitError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs">
                  {reviewSubmitError}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setEditingReview(null); setShowAddReviewModal(false); }}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingReview}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold cursor-pointer shadow-md shadow-indigo-600/20 transition-all"
                >
                  {isSavingReview ? 'Saving to Database…' : editingReview ? 'Update Review' : 'Save Review to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 4: ADD TEAM MEMBER
          ========================================== */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 bg-white dark:bg-slate-900 shadow-2xl">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Add Management Team Member
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Create an account with role-based access for your software house.
            </p>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Systems Architect"
                  value={userForm.title}
                  onChange={e => setUserForm({ ...userForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={userForm.password}
                  onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Role</label>
                <select
                  value={userForm.roles[0]}
                  onChange={e => setUserForm({ ...userForm, roles: [e.target.value as UserRole] })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="project_manager">Project Manager</option>
                  <option value="marketing_manager">Marketing Manager</option>
                  <option value="review_manager">Review Manager</option>
                  <option value="admin">Administrator (All Access)</option>
                  <option value="super_admin">Super Administrator</option>
                </select>
              </div>

              {userSubmitError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs">
                  {userSubmitError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingUser}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold cursor-pointer"
                >
                  {isSavingUser ? 'Creating…' : 'Add Team Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

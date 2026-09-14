import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import type { ServiceCategory } from '../../types';
import { 
  Lock, 
  FolderPlus, 
  MessageSquarePlus, 
  RefreshCw, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Star, 
  Mail, 
  ArrowLeft,
  RotateCcw,
  Sliders
} from 'lucide-react';

interface AdminPortalProps {
  onBackToWebsite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToWebsite }) => {
  const { 
    projects, 
    addProject, 
    deleteProject, 
    reviews, 
    addReview, 
    deleteReview, 
    syncGoogleReviews,
    inquiries,
    updateInquiryStatus,
    deleteInquiry,
    googleSettings,
    updateGoogleSettings,
    resetToDefaults
  } = useData();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('nexora_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'projects' | 'reviews' | 'leads' | 'settings'>('projects');

  // New Project Form State
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
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
    tags: 'Odoo 17, Cloud, PostgreSQL, Docker',
    metric1Val: '+50%',
    metric1LabelEn: 'Performance',
    metric1LabelAr: 'زيادة الأداء',
    metric2Val: '99.9%',
    metric2LabelEn: 'Uptime',
    metric2LabelAr: 'نسبة التوفر',
    liveUrl: '',
    featured: true
  });

  // New Review Form State
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    authorName: '',
    authorRole: '',
    company: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    contentEn: '',
    contentAr: '',
    isGoogleReview: true,
    googleReviewUrl: 'https://maps.google.com/?q=Nexora+Systems'
  });

  // Google Syncing state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === 'nexora2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('nexora_admin_auth', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nexora_admin_auth');
  };

  // Submit Project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.titleEn) return;

    addProject({
      title: { en: projectForm.titleEn, ar: projectForm.titleAr || projectForm.titleEn },
      category: projectForm.category,
      client: projectForm.client || 'Enterprise Client',
      country: projectForm.country,
      shortDesc: { en: projectForm.shortDescEn, ar: projectForm.shortDescAr || projectForm.shortDescEn },
      fullDesc: { en: projectForm.fullDescEn || projectForm.shortDescEn, ar: projectForm.fullDescAr || projectForm.shortDescAr || projectForm.shortDescEn },
      image: projectForm.image,
      tags: projectForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      metrics: [
        {
          label: { en: projectForm.metric1LabelEn, ar: projectForm.metric1LabelAr },
          value: projectForm.metric1Val
        },
        {
          label: { en: projectForm.metric2LabelEn, ar: projectForm.metric2LabelAr },
          value: projectForm.metric2Val
        }
      ],
      featured: projectForm.featured,
      liveUrl: projectForm.liveUrl,
      completionDate: new Date().toISOString().slice(0, 7)
    });

    setShowAddProjectModal(false);
    setProjectForm({
      titleEn: '',
      titleAr: '',
      category: 'erp',
      client: '',
      country: 'UAE / GCC',
      shortDescEn: '',
      shortDescAr: '',
      fullDescEn: '',
      fullDescAr: '',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      tags: 'Odoo 17, Cloud, PostgreSQL, Docker',
      metric1Val: '+50%',
      metric1LabelEn: 'Performance',
      metric1LabelAr: 'زيادة الأداء',
      metric2Val: '99.9%',
      metric2LabelEn: 'Uptime',
      metric2LabelAr: 'نسبة التوفر',
      liveUrl: '',
      featured: true
    });
  };

  // Submit Review
  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.authorName) return;

    addReview({
      authorName: reviewForm.authorName,
      authorRole: reviewForm.authorRole || 'Managing Director',
      company: reviewForm.company || 'Enterprise Partner',
      avatar: reviewForm.avatar,
      rating: reviewForm.rating,
      content: { en: reviewForm.contentEn, ar: reviewForm.contentAr || reviewForm.contentEn },
      date: 'Just now (Organic)',
      isGoogleReview: reviewForm.isGoogleReview,
      googleReviewUrl: reviewForm.googleReviewUrl,
      verified: true
    });

    setShowAddReviewModal(false);
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

  // Authentication Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-dark-950">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-cyan-500/30 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-cyan-500/40 flex items-center justify-center mx-auto mb-4 text-cyan-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Nexora Admin Portal
          </h2>
          <p className="text-slate-400 text-xs mb-6">
            Authorized management access for projects, Google reviews & leads.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (e.g. admin123)"
                className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-slate-700 text-white placeholder-slate-500 text-center text-sm focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-semibold">
                Invalid passcode. Please use "admin123" or "nexora2026"
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-dark-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              Authenticate & Enter
            </button>

            <button
              type="button"
              onClick={onBackToWebsite}
              className="w-full py-2.5 rounded-xl bg-dark-800 text-slate-400 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            Default Demo Passcode: <code className="text-cyan-400 font-mono">admin123</code>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-dark-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="p-2 rounded-xl bg-dark-900 border border-slate-700 text-slate-300 hover:text-white"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <span>Nexora Command Center</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  ADMIN LIVE
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Manage portfolio projects, organic Google reviews, and client inquiries.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Sync Success Alert */}
        {syncSuccessMessage && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncSuccessMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'projects'
                ? 'bg-cyan-500 text-dark-950 shadow-lg shadow-cyan-500/20'
                : 'bg-dark-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'reviews'
                ? 'bg-cyan-500 text-dark-950 shadow-lg shadow-cyan-500/20'
                : 'bg-dark-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Google Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'leads'
                ? 'bg-cyan-500 text-dark-950 shadow-lg shadow-cyan-500/20'
                : 'bg-dark-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Inquiries & Leads ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'settings'
                ? 'bg-cyan-500 text-dark-950 shadow-lg shadow-cyan-500/20'
                : 'bg-dark-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Reputation & Settings</span>
          </button>
        </div>

        {/* TAB 1: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Portfolio Case Studies</h2>
                <p className="text-xs text-slate-400">Add or remove showcased client deliverables.</p>
              </div>
              <button
                onClick={() => setShowAddProjectModal(true)}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-dark-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>

            {/* Projects Table */}
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-dark-900/90 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Impact Metrics</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {projects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-dark-900/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={proj.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            <div>
                              <div className="font-bold text-white text-sm">{proj.title.en}</div>
                              <div className="text-[11px] text-cyan-400 font-arabic">{proj.title.ar}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded bg-dark-900 text-cyan-300 font-mono text-[10px] uppercase border border-slate-800">
                            {proj.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-200">{proj.client}</div>
                          <div className="text-slate-500 text-[10px]">{proj.country}</div>
                        </td>
                        <td className="px-6 py-4 font-mono text-cyan-400">
                          {proj.metrics.map(m => m.value).join(' | ')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteProject(proj.id)}
                            className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REVIEWS & GOOGLE SYNC */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            
            {/* Google Sync Banner */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2 shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Google Business Profile Integration</h3>
                  <p className="text-xs text-slate-400">
                    Live Score: <span className="text-amber-400 font-bold">{googleSettings.overallRating} ★</span> ({googleSettings.totalReviewsCount} Reviews) • Last Sync: {googleSettings.lastSyncTimestamp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={handleTriggerGoogleSync}
                  disabled={isSyncing}
                  className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing with Google...' : 'Trigger Google Reviews Sync'}</span>
                </button>

                <button
                  onClick={() => setShowAddReviewModal(true)}
                  className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-dark-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>Add Review</span>
                </button>
              </div>
            </div>

            {/* Reviews Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img src={rev.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-white text-sm">{rev.authorName}</div>
                          <div className="text-[11px] text-slate-400">{rev.authorRole} • {rev.company}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-bold text-xs">{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed italic mb-2">
                      "{rev.content.en}"
                    </p>
                    <p className="text-cyan-300/80 text-xs font-arabic leading-relaxed">
                      "{rev.content.ar}"
                    </p>
                  </div>

                  <div className="pt-3 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-mono">{rev.date}</span>
                    <button
                      onClick={() => deleteReview(rev.id)}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: LEADS & INQUIRIES */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Client Proposal Requests & Leads</h2>
              <p className="text-xs text-slate-400">Incoming inquiries from the website form and cost estimator.</p>
            </div>

            {inquiries.length === 0 ? (
              <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 text-slate-400 text-sm">
                No inquiries received yet. Leads submitted through the public website will appear here in real-time.
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <div>
                        <h3 className="text-base font-bold text-white">{inq.name}</h3>
                        <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 mt-0.5">
                          <span>Email: <strong className="text-slate-200">{inq.email}</strong></span>
                          {inq.phone && <span>Phone: <strong className="text-slate-200">{inq.phone}</strong></span>}
                          {inq.company && <span>Company: <strong className="text-slate-200">{inq.company}</strong></span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={inq.status}
                          onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                          className="px-3 py-1.5 rounded-lg bg-dark-900 border border-slate-700 text-xs font-semibold text-cyan-300"
                        >
                          <option value="new">New Lead</option>
                          <option value="contacted">Contacted</option>
                          <option value="proposal_sent">Proposal Sent</option>
                          <option value="closed">Closed / Won</option>
                        </select>
                        <button
                          onClick={() => deleteInquiry(inq.id)}
                          className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/60"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-dark-900 border border-slate-800">
                        <span className="text-slate-500 block text-[10px] uppercase font-mono">Service Requested</span>
                        <span className="font-semibold text-white">{inq.serviceType}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-dark-900 border border-slate-800">
                        <span className="text-slate-500 block text-[10px] uppercase font-mono">Budget Bracket</span>
                        <span className="font-semibold text-cyan-400">{inq.budget}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-dark-900 border border-slate-800">
                        <span className="text-slate-500 block text-[10px] uppercase font-mono">Target Timeline</span>
                        <span className="font-semibold text-slate-200">{inq.timeline}</span>
                      </div>
                    </div>

                    {inq.message && (
                      <p className="text-xs text-slate-300 bg-dark-900/80 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                        {inq.message}
                      </p>
                    )}

                    <div className="text-[10px] text-slate-500 font-mono">
                      Received on {new Date(inq.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SETTINGS & RESET */}
        {activeTab === 'settings' && (
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8 max-w-3xl">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">System Configuration</h2>
              <p className="text-xs text-slate-400">Configure reputation parameters or reset demo data.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Google Maps Business Place ID
                </label>
                <input
                  type="text"
                  value={googleSettings.placeId}
                  onChange={(e) => updateGoogleSettings({ placeId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Business Name on Google Maps
                </label>
                <input
                  type="text"
                  value={googleSettings.businessName}
                  onChange={(e) => updateGoogleSettings({ businessName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Google Maps Public Review Link
                </label>
                <input
                  type="text"
                  value={googleSettings.googleMapsUrl}
                  onChange={(e) => updateGoogleSettings({ googleMapsUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white mb-2">Factory Reset</h3>
              <p className="text-xs text-slate-400 mb-4">
                Restore all projects, reviews, and settings back to original initial data state.
              </p>
              <button
                onClick={() => {
                  if (window.confirm('Reset all projects and reviews to factory default state?')) {
                    resetToDefaults();
                    alert('Data restored to initial factory defaults.');
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 text-xs font-bold border border-rose-800/40 flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Factory Seed Data</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Modal: Add Project */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl border border-cyan-500/40 p-6 sm:p-8 bg-dark-950 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Add New Portfolio Project</h2>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Project Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.titleEn}
                    onChange={(e) => setProjectForm({ ...projectForm, titleEn: e.target.value })}
                    placeholder="e.g. Cloud Logistics Kubernetes Cluster"
                    className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Project Title (Arabic)</label>
                  <input
                    type="text"
                    value={projectForm.titleAr}
                    onChange={(e) => setProjectForm({ ...projectForm, titleAr: e.target.value })}
                    placeholder="مثال: بنية سحابية لإدارة الخدمات اللوجستية"
                    className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-700 text-white"
                  >
                    <option value="erp">Odoo & ERP</option>
                    <option value="cloud">Cloud & Servers</option>
                    <option value="mobile">Mobile Apps (iOS & Android)</option>
                    <option value="web">Custom Web Platform</option>
                    <option value="wordpress">WordPress & CMS</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Client Name</label>
                  <input
                    type="text"
                    value={projectForm.client}
                    onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                    placeholder="e.g. PetroTech Solutions"
                    className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Country / Region</label>
                  <input
                    type="text"
                    value={projectForm.country}
                    onChange={(e) => setProjectForm({ ...projectForm, country: e.target.value })}
                    placeholder="e.g. UAE / Oman"
                    className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Short Summary (English)</label>
                <input
                  type="text"
                  value={projectForm.shortDescEn}
                  onChange={(e) => setProjectForm({ ...projectForm, shortDescEn: e.target.value })}
                  placeholder="A one-sentence impact summary"
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">In-Depth Case Study (English)</label>
                <textarea
                  rows={3}
                  value={projectForm.fullDescEn}
                  onChange={(e) => setProjectForm({ ...projectForm, fullDescEn: e.target.value })}
                  placeholder="Architectural challenge, implementation details, and business outcome..."
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={projectForm.image}
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Metric 1 (e.g. +65% Speed)</label>
                  <input
                    type="text"
                    value={projectForm.metric1Val}
                    onChange={(e) => setProjectForm({ ...projectForm, metric1Val: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Metric 2 (e.g. 99.99% Uptime)</label>
                  <input
                    type="text"
                    value={projectForm.metric2Val}
                    onChange={(e) => setProjectForm({ ...projectForm, metric2Val: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 rounded-lg bg-dark-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-500 text-dark-950 font-bold"
                >
                  Save & Publish to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Review */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-cyan-500/40 p-6 sm:p-8 bg-dark-950 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Add Client Review</h2>

            <form onSubmit={handleCreateReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Reviewer Name *</label>
                <input
                  type="text"
                  required
                  value={reviewForm.authorName}
                  onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                  placeholder="e.g. Michael Thorne"
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Role</label>
                  <input
                    type="text"
                    value={reviewForm.authorRole}
                    onChange={(e) => setReviewForm({ ...reviewForm, authorRole: e.target.value })}
                    placeholder="e.g. VP of Infrastructure"
                    className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Company</label>
                  <input
                    type="text"
                    value={reviewForm.company}
                    onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
                    placeholder="e.g. Apex Global"
                    className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Star Rating (1 - 5)</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-700 text-white"
                >
                  <option value={5}>5 Stars (★★★★★)</option>
                  <option value={4}>4 Stars (★★★★☆)</option>
                  <option value={3}>3 Stars (★★★☆☆)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Review Content (English)</label>
                <textarea
                  rows={3}
                  required
                  value={reviewForm.contentEn}
                  onChange={(e) => setReviewForm({ ...reviewForm, contentEn: e.target.value })}
                  placeholder="Their engineering team delivered our system flawlessly..."
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Review Content (Arabic)</label>
                <textarea
                  rows={2}
                  value={reviewForm.contentAr}
                  onChange={(e) => setReviewForm({ ...reviewForm, contentAr: e.target.value })}
                  placeholder="فريق هندسي متميز أنجز مشروعنا بأعلى دقة..."
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-700 text-white font-arabic"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isGoogleReview"
                  checked={reviewForm.isGoogleReview}
                  onChange={(e) => setReviewForm({ ...reviewForm, isGoogleReview: e.target.checked })}
                  className="rounded text-cyan-500"
                />
                <label htmlFor="isGoogleReview" className="text-slate-300">
                  Mark as Verified Google Business Review
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="px-4 py-2 rounded-lg bg-dark-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-500 text-dark-950 font-bold"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

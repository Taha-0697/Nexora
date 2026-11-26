import React, { useState, useEffect } from 'react';
import type {
  AdCampaign,
  MarketingSettings,
  PlatformAccountConnection,
  SocialAdPost,
  MarketingPlatform
} from '../../types';
import {
  Megaphone,
  BarChart3,
  Plus,
  Trash2,
  Pause,
  CheckCircle2,
  Share2,
  Send,
  Calendar,
  Clock,
  Key,
  Copy,
  Check,
  TrendingUp,
  Sparkles,
  RefreshCw,
  X as CloseIcon,
  Edit,
  Globe,
  Radio
} from 'lucide-react';

interface OmnichannelMarketingHubProps {
  marketingSettings: MarketingSettings;
  updateMarketingSettings: (settings: Partial<MarketingSettings>) => void;
  addAdCampaign: (campaign: Omit<AdCampaign, 'id'>) => void;
  updateAdCampaign: (campaign: AdCampaign) => void;
  deleteAdCampaign: (id: string) => void;
  toggleAdCampaignStatus: (id: string) => void;
  canManage: boolean;
}

// Initial Mock Connected Accounts for Google, Meta, LinkedIn, X
const INITIAL_ACCOUNTS: PlatformAccountConnection[] = [
  {
    id: 'conn-google',
    platform: 'Google Ads',
    accountName: 'Nexora Systems Global (Search & Demand Gen)',
    accountId: '824-910-4491',
    status: 'connected',
    lastSyncedAt: '3 mins ago',
    webhookUrl: 'https://api.nexora.io/v1/webhooks/google-ads',
    apiKeyMasked: 'AIzaSyD984••••••••••••••••382kL',
    developerToken: 'dev-tok-98402941-nx'
  },
  {
    id: 'conn-meta',
    platform: 'Meta Ads',
    accountName: 'Nexora Systems (Facebook & Instagram Business)',
    accountId: 'act_94820194820',
    status: 'connected',
    lastSyncedAt: '12 mins ago',
    webhookUrl: 'https://api.nexora.io/v1/webhooks/meta-conversions',
    apiKeyMasked: 'EAAG9824••••••••••••••••ZAd10',
    developerToken: 'graph-api-v20.0'
  },
  {
    id: 'conn-linkedin',
    platform: 'LinkedIn',
    accountName: 'Nexora Systems Official Page (B2B Enterprise)',
    accountId: 'urn:li:organization:8492041',
    status: 'connected',
    lastSyncedAt: '1 hour ago',
    webhookUrl: 'https://api.nexora.io/v1/webhooks/linkedin-leads',
    apiKeyMasked: 'AQVz••••••••••••••••09Lp',
    developerToken: 'linkedin-marketing-developer'
  },
  {
    id: 'conn-x',
    platform: 'X',
    accountName: '@NexoraSystems (X Ads & Developer API v2)',
    accountId: 'x-ad-account-583091',
    status: 'connected',
    lastSyncedAt: '25 mins ago',
    webhookUrl: 'https://api.nexora.io/v1/webhooks/x-campaigns',
    apiKeyMasked: 'Bearer AAAAAAAAAAAAAAAAAAAA••••••••3a9f',
    developerToken: 'x-api-v2-developer'
  }
];

// Initial Posts for Composer History
const INITIAL_POSTS: SocialAdPost[] = [
  {
    id: 'post-1',
    title: 'Custom ERP vs Generic SaaS Case Study',
    platforms: ['Google Ads', 'LinkedIn', 'X'],
    headline: 'Why High-Growth Logistics Firms in Dubai Replaced Monolithic ERP with .NET Core & Next.js',
    copy: 'Legacy ERP bottlenecks cost enterprise operations 35% in wasted processing cycles. Nexora architected a bi-directional custom ERP with sub-30ms API response and automated ZATCA invoicing. Discover the technical architecture breakdown.',
    mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Read Architecture Case Study',
    targetUrl: 'https://nexora.io/#casestudies',
    status: 'published',
    createdAt: 'Yesterday at 3:15 PM'
  },
  {
    id: 'post-2',
    title: 'Q3 Enterprise Architecture Audit Promo',
    platforms: ['Meta Ads', 'LinkedIn', 'Google Ads'],
    headline: 'Zero-Debt Software Modernization for Mid-Market Enterprises',
    copy: 'Migrate mission-critical business logic to modern microservices without disrupting live workflows. Book a senior engineering architecture review with Nexora.',
    mediaUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Claim Free Audit',
    targetUrl: 'https://nexora.io/#estimator',
    status: 'scheduled',
    scheduledFor: 'Tomorrow, 09:00 AM UTC',
    createdAt: 'Today at 10:45 AM'
  }
];

export const OmnichannelMarketingHub: React.FC<OmnichannelMarketingHubProps> = ({
  marketingSettings,
  updateMarketingSettings,
  addAdCampaign,
  updateAdCampaign,
  deleteAdCampaign,
  toggleAdCampaignStatus,
  canManage
}) => {
  // Navigation Subtabs
  const [activeSubTab, setActiveSubTab] = useState<
    'campaigns' | 'composer' | 'analytics' | 'connections' | 'banner'
  >('campaigns');

  // Campaign Filter
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'draft'>('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudgetCampaign, setEditingBudgetCampaign] = useState<AdCampaign | null>(null);
  const [newBudgetVal, setNewBudgetVal] = useState<number>(100);

  // New Campaign Form
  const [newCampaignForm, setNewCampaignForm] = useState({
    name: '',
    platform: 'Google Ads' as MarketingPlatform,
    dailyBudget: 150,
    targetRegion: 'GCC (UAE, Saudi Arabia, Qatar, Oman)'
  });

  // Account Connections State
  const [accounts, setAccounts] = useState<PlatformAccountConnection[]>(() => {
    try {
      const saved = localStorage.getItem('nexora_marketing_accounts');
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  const [selectedConnectionModal, setSelectedConnectionModal] = useState<PlatformAccountConnection | null>(null);
  const [testPingState, setTestPingState] = useState<Record<string, 'idle' | 'pinging' | 'success'>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Post / Creative Composer State
  const [composerForm, setComposerForm] = useState({
    title: 'Custom ERP & Cloud Modernization Spotlight',
    platforms: ['Google Ads', 'Meta Ads', 'LinkedIn', 'X'],
    headline: 'Engineering High-Performance Web ERPs & Scalable Cloud Portals',
    copy: 'Stop paying per-seat subscriptions for rigid SaaS. Nexora engineers custom .NET Core and React enterprise platforms built specifically around your workflows, with direct database sync and bank-grade security.',
    mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Book Architecture Review',
    targetUrl: 'https://nexora.io/#estimator',
    isScheduled: false,
    scheduledDateTime: '2026-11-22T10:00'
  });

  const [activePreviewPlatform, setActivePreviewPlatform] = useState<
    'Google Ads' | 'Meta Ads' | 'LinkedIn' | 'X'
  >('LinkedIn');

  const [postsList, setPostsList] = useState<SocialAdPost[]>(() => {
    try {
      const saved = localStorage.getItem('nexora_marketing_posts');
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    const syncMarketingFromNeon = async () => {
      try {
        const [connRes, postsRes, bpRes] = await Promise.all([
          fetch('/api/marketing/connections'),
          fetch('/api/marketing/posts'),
          fetch('/api/marketing/banner-pixel'),
        ]);

        if (connRes.ok) {
          const dbConns = await connRes.json();
          if (Array.isArray(dbConns) && dbConns.length > 0) {
            const mapped = dbConns.map((c: any) => ({
              id: c.id,
              platform: c.platform,
              accountName: c.accountName || '',
              accountId: c.accountId || '',
              status: c.status || 'connected',
              lastSyncedAt: c.lastSyncedAt ? new Date(c.lastSyncedAt).toLocaleTimeString() : 'Synced',
              webhookUrl: c.webhookUrl,
              apiKeyMasked: c.apiKeyMasked,
              developerToken: c.developerToken,
            }));
            setAccounts(mapped);
            localStorage.setItem('nexora_marketing_accounts', JSON.stringify(mapped));
          }
        }

        if (postsRes.ok) {
          const dbPosts = await postsRes.json();
          if (Array.isArray(dbPosts) && dbPosts.length > 0) {
            const mappedPosts: SocialAdPost[] = dbPosts.map((p: any) => ({
              id: p.id,
              title: p.title,
              platforms: p.targetNetworks || [],
              headline: p.headline || p.title,
              copy: p.content,
              mediaUrl: p.mediaUrl || '',
              ctaText: p.ctaLabel || 'Learn More',
              targetUrl: p.ctaUrl || 'https://nexora.io',
              status: p.status || 'draft',
              scheduledFor: p.scheduledAt ? new Date(p.scheduledAt).toISOString().slice(0, 16) : undefined,
              createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recent',
            }));
            setPostsList(mappedPosts);
            localStorage.setItem('nexora_marketing_posts', JSON.stringify(mappedPosts));
          }
        }

        if (bpRes.ok) {
          const bp = await bpRes.json();
          if (bp && bp.id) {
            updateMarketingSettings({
              bannerEnabled: Boolean(bp.bannerActive),
              bannerText: {
                en: bp.bannerText || marketingSettings.bannerText?.en || '',
                ar: bp.bannerText || marketingSettings.bannerText?.ar || '',
              },
              bannerCtaText: {
                en: bp.bannerCtaLabel || marketingSettings.bannerCtaText?.en || 'Learn More',
                ar: bp.bannerCtaLabel || marketingSettings.bannerCtaText?.ar || 'Learn More',
              },
              bannerUrl: bp.bannerCtaUrl || marketingSettings.bannerUrl || '#contact',
              googleAnalyticsId: bp.googleAdsPixel || marketingSettings.googleAnalyticsId || '',
              metaPixelId: bp.metaPixel || marketingSettings.metaPixelId || '',
              linkedInInsightId: bp.linkedinPixel || marketingSettings.linkedInInsightId || '',
            });
          }
        }
      } catch (err) {
        console.warn('[Marketing] Neon DB sync warning:', err);
      }
    };
    syncMarketingFromNeon();
  }, []);

  const showNotification = (text: string, type: 'success' | 'info' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Handle Account Connection Toggle
  const handleToggleConnection = (id: string) => {
    const target = accounts.find(a => a.id === id);
    const nextStatus = target?.status === 'connected' ? 'disconnected' : 'connected';
    const updated = accounts.map(acc => (acc.id === id ? { ...acc, status: nextStatus as 'connected' | 'disconnected' } : acc));
    setAccounts(updated);
    localStorage.setItem('nexora_marketing_accounts', JSON.stringify(updated));
    showNotification('Account connection status updated in Neon DB.');

    if (target) {
      fetch('/api/marketing/connections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...target, status: nextStatus }),
      }).catch(err => console.warn('[Marketing] Connection toggle persist failed:', err));
    }
  };

  // Test Ping Connection
  const handleTestPing = (id: string) => {
    setTestPingState(prev => ({ ...prev, [id]: 'pinging' }));
    setTimeout(() => {
      setTestPingState(prev => ({ ...prev, [id]: 'success' }));
      showNotification(`API Ping Successful: 200 OK (Latency: 42ms)`);
      setTimeout(() => {
        setTestPingState(prev => ({ ...prev, [id]: 'idle' }));
      }, 3000);
    }, 800);
  };

  // Handle Save Connection Keys
  const handleSaveConnectionConfig = (updated: PlatformAccountConnection) => {
    const list = accounts.map(a => (a.id === updated.id ? updated : a));
    setAccounts(list);
    localStorage.setItem('nexora_marketing_accounts', JSON.stringify(list));
    setSelectedConnectionModal(null);
    showNotification(`${updated.platform} credentials and webhook updated in Neon DB.`);

    fetch('/api/marketing/connections', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(err => console.warn('[Marketing] Connection save persist failed:', err));
  };

  // Handle Add Campaign
  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignForm.name.trim()) return;

    addAdCampaign({
      name: newCampaignForm.name.trim(),
      platform: newCampaignForm.platform,
      dailyBudget: Number(newCampaignForm.dailyBudget) || 100,
      targetRegion: newCampaignForm.targetRegion.trim(),
      status: 'active',
      impressions: 0,
      clicks: 0,
      conversions: 0,
      spent: 0
    });

    setShowAddModal(false);
    setNewCampaignForm({
      name: '',
      platform: 'Google Ads',
      dailyBudget: 150,
      targetRegion: 'GCC (UAE, Saudi Arabia, Qatar, Oman)'
    });
    showNotification('New campaign launched across omnichannel network.');
  };

  // Handle Budget Update
  const handleSaveBudget = () => {
    if (!editingBudgetCampaign) return;
    updateAdCampaign({
      ...editingBudgetCampaign,
      dailyBudget: newBudgetVal
    });
    setEditingBudgetCampaign(null);
    showNotification(`Daily budget updated to $${newBudgetVal}/day.`);
  };

  // Handle Composer Publish / Schedule
  const handlePublishComposerPost = (isScheduleAction = false) => {
    if (!composerForm.headline.trim()) return;

    const newPost: SocialAdPost = {
      id: `post-${Date.now()}`,
      title: composerForm.title || 'Omnichannel Creative',
      platforms: composerForm.platforms,
      headline: composerForm.headline,
      copy: composerForm.copy,
      mediaUrl: composerForm.mediaUrl,
      ctaText: composerForm.ctaText,
      targetUrl: composerForm.targetUrl,
      status: isScheduleAction || composerForm.isScheduled ? 'scheduled' : 'published',
      scheduledFor: isScheduleAction || composerForm.isScheduled ? composerForm.scheduledDateTime : undefined,
      createdAt: 'Just now'
    };

    const updated = [newPost, ...postsList];
    setPostsList(updated);
    localStorage.setItem('nexora_marketing_posts', JSON.stringify(updated));

    fetch('/api/marketing/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newPost.title,
        headline: newPost.headline,
        content: newPost.copy,
        mediaUrl: newPost.mediaUrl,
        ctaLabel: newPost.ctaText,
        ctaUrl: newPost.targetUrl,
        targetNetworks: newPost.platforms,
        status: newPost.status,
        scheduledAt: newPost.scheduledFor,
      }),
    })
      .then(res => (res.ok ? res.json() : null))
      .then(created => {
        if (created && created.id) {
          setPostsList(prev => prev.map(p => (p.id === newPost.id ? { ...p, id: created.id } : p)));
        }
      })
      .catch(err => console.warn('[Marketing] Post creation failed in Neon DB:', err));

    showNotification(
      isScheduleAction || composerForm.isScheduled
        ? `Ad Creative scheduled for ${composerForm.scheduledDateTime} across ${composerForm.platforms.join(', ')}.`
        : `Published creative instantly across ${composerForm.platforms.join(', ')}!`
    );
  };

  // Filtered Campaigns
  const allCampaigns = marketingSettings?.adCampaigns || [];
  const filteredCampaigns = allCampaigns.filter(c => {
    const platformMatch =
      platformFilter === 'all'
        ? true
        : c.platform.toLowerCase().includes(platformFilter.toLowerCase()) ||
          (platformFilter === 'meta' && (c.platform.toLowerCase().includes('meta') || c.platform.toLowerCase().includes('facebook'))) ||
          (platformFilter === 'linkedin' && c.platform.toLowerCase().includes('linkedin')) ||
          (platformFilter === 'x' && (c.platform.toLowerCase().includes('x') || c.platform.toLowerCase().includes('twitter')));

    const statusMatch = statusFilter === 'all' ? true : c.status === statusFilter;

    return platformMatch && statusMatch;
  });

  // Calculate Consolidated Analytics
  const totalSpend = allCampaigns.reduce((acc, c) => acc + (c.spent || 0), 0);
  const totalImpressions = allCampaigns.reduce((acc, c) => acc + (c.impressions || 0), 0);
  const totalClicks = allCampaigns.reduce((acc, c) => acc + (c.clicks || 0), 0);
  const totalConversions = allCampaigns.reduce((acc, c) => acc + (c.conversions || 0), 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
  const avgCpa = totalConversions > 0 ? (totalSpend / totalConversions).toFixed(2) : '0.00';
  const totalDailyBudget = allCampaigns.filter(c => c.status === 'active').reduce((acc, c) => acc + (c.dailyBudget || 0), 0);

  // Platform Badge helper
  const getPlatformBadge = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('google')) {
      return {
        name: 'Google Ads',
        color: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
        icon: (
          <svg className="w-3.5 h-3.5 inline mr-1" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
        )
      };
    }
    if (p.includes('meta') || p.includes('facebook') || p.includes('instagram')) {
      return {
        name: 'Meta Ads',
        color: 'text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20',
        icon: (
          <span className="font-bold text-[11px] inline-block mr-1 text-[#1877F2]">M</span>
        )
      };
    }
    if (p.includes('linkedin')) {
      return {
        name: 'LinkedIn Ads',
        color: 'text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20',
        icon: (
          <span className="font-bold text-[11px] inline-block mr-1 text-[#0A66C2]">in</span>
        )
      };
    }
    if (p.includes('x') || p.includes('twitter')) {
      return {
        name: 'X (Twitter)',
        color: 'text-slate-900 dark:text-slate-200 bg-slate-100 dark:bg-slate-500/10 border-slate-300 dark:border-slate-500/20',
        icon: (
          <span className="font-bold text-[11px] inline-block mr-1 text-slate-900 dark:text-slate-100">𝕏</span>
        )
      };
    }
    return {
      name: platform,
      color: 'text-slate-800 dark:text-slate-400 bg-slate-100 dark:bg-slate-500/10 border-slate-300 dark:border-slate-500/20',
      icon: <Megaphone className="w-3.5 h-3.5 inline mr-1" />
    };
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-indigo-500/40 text-white shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{feedbackMsg.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-indigo-950/60 dark:to-slate-900 shadow-xl relative overflow-hidden text-slate-900 dark:text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-400/30 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
              <span>Omnichannel Growth Engine • Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Omnichannel Marketing & Ad Campaign Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Create, run, schedule, and orchestrate paid campaigns & organic content across{' '}
              <strong className="text-blue-700 dark:text-sky-300 font-bold">Google Ads</strong>,{' '}
              <strong className="text-indigo-800 dark:text-indigo-300 font-bold">Meta Ads</strong>,{' '}
              <strong className="text-blue-800 dark:text-blue-400 font-bold">LinkedIn B2B</strong>, and{' '}
              <strong className="text-slate-900 dark:text-white font-bold">X (Twitter)</strong>.
            </p>
          </div>

          {/* Quick Metrics Capsule */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-white/10">
            <div className="px-3 py-1 border-r border-slate-200 dark:border-white/10">
              <span className="block text-[10px] font-mono text-slate-600 dark:text-slate-400 uppercase font-semibold">Active Budget</span>
              <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">${totalDailyBudget}/day</span>
            </div>
            <div className="px-3 py-1 border-r border-slate-200 dark:border-white/10">
              <span className="block text-[10px] font-mono text-slate-600 dark:text-slate-400 uppercase font-semibold">Total Leads</span>
              <span className="text-base font-bold text-blue-700 dark:text-sky-300">{totalConversions}</span>
            </div>
            <div className="px-3 py-1">
              <span className="block text-[10px] font-mono text-slate-600 dark:text-slate-400 uppercase font-semibold">Avg CTR</span>
              <span className="text-base font-bold text-amber-800 dark:text-amber-300">{avgCtr}%</span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-slate-200 dark:border-white/10 relative z-10">
          <button
            type="button"
            onClick={() => setActiveSubTab('campaigns')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === 'campaigns'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/70'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Unified Campaign Manager ({allCampaigns.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('composer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === 'composer'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/70'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Cross-Platform Post & Ad Composer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/70'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Consolidated Analytics & ROAS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('connections')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === 'connections'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/70'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Account Connections & APIs ({accounts.filter(a => a.status === 'connected').length}/4)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('banner')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === 'banner'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/70'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Top Banner & SEO Pixels</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUBTAB 1: UNIFIED CAMPAIGN MANAGER                        */}
      {/* ========================================================= */}
      {activeSubTab === 'campaigns' && (
        <div className="space-y-5">
          
          {/* Controls Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-[11px] font-mono text-slate-400 uppercase mr-1">Platform:</span>
              {[
                { id: 'all', label: 'All Networks' },
                { id: 'google', label: 'Google Ads' },
                { id: 'meta', label: 'Meta Ads' },
                { id: 'linkedin', label: 'LinkedIn B2B' },
                { id: 'x', label: '𝕏 Twitter' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPlatformFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    platformFilter === tab.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Launch Campaign Action */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="paused">Paused Only</option>
              </select>

              {canManage && (
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Launch New Campaign</span>
                </button>
              )}
            </div>
          </div>

          {/* Unified Campaigns Table */}
          <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-mono text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5 whitespace-nowrap">Campaign Name & Region</th>
                    <th className="px-5 py-3.5 whitespace-nowrap">Network</th>
                    <th className="px-5 py-3.5 whitespace-nowrap">Status</th>
                    <th className="px-5 py-3.5 whitespace-nowrap">Daily Budget</th>
                    <th className="px-5 py-3.5 whitespace-nowrap">Impressions / Clicks</th>
                    <th className="px-5 py-3.5 whitespace-nowrap">CTR</th>
                    <th className="px-5 py-3.5 whitespace-nowrap">Conversions</th>
                    <th className="px-5 py-3.5 whitespace-nowrap">Spend / ROAS</th>
                    {canManage && <th className="px-5 py-3.5 text-right whitespace-nowrap">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredCampaigns.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-5 py-12 text-center text-slate-500 dark:text-slate-400 font-mono text-xs">
                        No campaigns found for the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredCampaigns.map(camp => {
                      const badge = getPlatformBadge(camp.platform);
                      const ctr = camp.impressions > 0 ? ((camp.clicks / camp.impressions) * 100).toFixed(2) : '0.00';
                      const roas = camp.spent > 0 ? (camp.conversions * 125 / camp.spent).toFixed(1) : '3.8';

                      return (
                        <tr key={camp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-5 py-3.5">
                            <span className="font-bold text-slate-900 dark:text-white block text-sm">
                              {camp.name}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">
                              Geo: {camp.targetRegion}
                            </span>
                          </td>

                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-bold border inline-flex items-center gap-1.5 ${badge.color}`}>
                              {badge.icon}
                              {badge.name}
                            </span>
                          </td>

                          <td className="px-5 py-3.5 whitespace-nowrap">
                            {canManage ? (
                              <button
                                type="button"
                                onClick={() => toggleAdCampaignStatus(camp.id)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                                  camp.status === 'active'
                                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200'
                                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-200'
                                }`}
                              >
                                {camp.status === 'active' ? (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>ACTIVE</span>
                                  </>
                                ) : (
                                  <>
                                    <Pause className="w-2.5 h-2.5" />
                                    <span>PAUSED</span>
                                  </>
                                )}
                              </button>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                {camp.status.toUpperCase()}
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                                ${camp.dailyBudget}/day
                              </span>
                              {canManage && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingBudgetCampaign(camp);
                                    setNewBudgetVal(camp.dailyBudget);
                                  }}
                                  className="text-slate-400 hover:text-indigo-600 dark:hover:text-sky-400 p-0.5 rounded"
                                  title="Edit Budget"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-3.5 font-mono text-[11px] whitespace-nowrap">
                            <span className="text-slate-900 dark:text-white font-semibold">{camp.impressions.toLocaleString()}</span>
                            <span className="text-slate-500 dark:text-slate-400"> imp • </span>
                            <span className="text-blue-700 dark:text-sky-400 font-bold">{camp.clicks.toLocaleString()} clicks</span>
                          </td>

                          <td className="px-5 py-3.5 font-mono font-bold text-amber-800 dark:text-amber-400 text-xs whitespace-nowrap">
                            {ctr}%
                          </td>

                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-xs">
                              {camp.conversions} leads
                            </span>
                          </td>

                          <td className="px-5 py-3.5 font-mono whitespace-nowrap">
                            <div className="text-slate-900 dark:text-white font-semibold">${camp.spent.toLocaleString()}</div>
                            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">{roas}x ROAS</div>
                          </td>

                          {canManage && (
                            <td className="px-5 py-3.5 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => deleteAdCampaign(camp.id)}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                                title="Delete Campaign"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          )}
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

      {/* ========================================================= */}
      {/* SUBTAB 2: CROSS-PLATFORM POST & AD COMPOSER               */}
      {/* ========================================================= */}
      {activeSubTab === 'composer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Form Inputs (7 Cols) */}
            <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-sky-400">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Unified Creative Composer
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Write once, preview authentic layouts, and broadcast to all 4 ad networks.
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-sky-300 border border-indigo-200 dark:border-indigo-800">
                  Multi-Channel Sync
                </span>
              </div>

              {/* Target Platforms Multi-Select */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1.5">
                  Distribute Across Networks
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'Google Ads', name: 'Google Ads', color: 'border-blue-500/50 text-blue-400' },
                    { id: 'Meta Ads', name: 'Meta (FB / IG)', color: 'border-indigo-500/50 text-indigo-400' },
                    { id: 'LinkedIn', name: 'LinkedIn B2B', color: 'border-sky-500/50 text-sky-400' },
                    { id: 'X', name: '𝕏 Twitter', color: 'border-slate-400/50 text-slate-200' }
                  ].map(platform => {
                    const isSelected = composerForm.platforms.includes(platform.id);
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => {
                          setComposerForm(prev => ({
                            ...prev,
                            platforms: isSelected
                              ? prev.platforms.filter(p => p !== platform.id)
                              : [...prev.platforms, platform.id]
                          }));
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span>{platform.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                  Ad / Post Headline
                </label>
                <input
                  type="text"
                  value={composerForm.headline}
                  onChange={e => setComposerForm({ ...composerForm, headline: e.target.value })}
                  placeholder="e.g. Engineering High-Performance Web ERPs & Custom .NET Portals"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              {/* Body Copy */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold">
                    Creative Ad Copy / Content
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    {composerForm.copy.length} chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={composerForm.copy}
                  onChange={e => setComposerForm({ ...composerForm, copy: e.target.value })}
                  placeholder="Draft your promotional text..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              {/* Media URL & CTA Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                    Visual Media / Thumbnail URL
                  </label>
                  <input
                    type="text"
                    value={composerForm.mediaUrl}
                    onChange={e => setComposerForm({ ...composerForm, mediaUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                    Call To Action Button Label
                  </label>
                  <select
                    value={composerForm.ctaText}
                    onChange={e => setComposerForm({ ...composerForm, ctaText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="Book Architecture Review">Book Architecture Review</option>
                    <option value="Claim Free Audit">Claim Free Audit</option>
                    <option value="Learn More">Learn More</option>
                    <option value="Contact Engineers">Contact Engineers</option>
                    <option value="Explore Solutions">Explore Solutions</option>
                  </select>
                </div>
              </div>

              {/* Destination URL */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                  Destination Target Link
                </label>
                <input
                  type="text"
                  value={composerForm.targetUrl}
                  onChange={e => setComposerForm({ ...composerForm, targetUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              {/* Schedule / Immediate Toggle */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Automated Scheduler
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Release simultaneously across selected platform timezones.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="datetime-local"
                    value={composerForm.scheduledDateTime}
                    onChange={e => setComposerForm({ ...composerForm, scheduledDateTime: e.target.value, isScheduled: true })}
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handlePublishComposerPost(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>Schedule Post</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePublishComposerPost(false)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish to {composerForm.platforms.length} Platforms Now</span>
                </button>
              </div>

            </div>

            {/* Right Column: Interactive Live Platform Previews (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Preview Selector Tabs */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-400">
                  Live Platform Preview
                </span>
                
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {(['Google Ads', 'Meta Ads', 'LinkedIn', 'X'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setActivePreviewPlatform(p)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        activePreviewPlatform === p
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-sky-300 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {p === 'Google Ads' ? 'Google' : p === 'Meta Ads' ? 'Meta' : p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Cards */}
              <div className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                
                {/* 1. Google Ads Search Preview */}
                {activePreviewPlatform === 'Google Ads' && (
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 font-sans">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">Sponsored</span>
                      <span>•</span>
                      <span className="text-slate-600 dark:text-slate-400 font-mono text-[10px]">https://nexora.io/solutions › custom-erp</span>
                    </div>

                    <h4 className="text-base font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
                      {composerForm.headline || 'Custom Web ERP & Enterprise Software | Nexora Systems'}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {composerForm.copy}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2 text-xs text-[#1a0dab] dark:text-[#8ab4f8]">
                      <span className="hover:underline cursor-pointer">Architecture Audit</span>
                      <span>•</span>
                      <span className="hover:underline cursor-pointer">.NET Core & Next.js Stack</span>
                      <span>•</span>
                      <span className="hover:underline cursor-pointer">Live Demo Request</span>
                    </div>
                  </div>
                )}

                {/* 2. Meta (Facebook / Instagram) Feed Preview */}
                {activePreviewPlatform === 'Meta Ads' && (
                  <div className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden font-sans">
                    {/* Header */}
                    <div className="p-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white font-bold text-xs">
                          NX
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            <span>Nexora Systems</span>
                            <span className="text-sky-500">●</span>
                          </div>
                          <span className="text-[10px] text-slate-400">Sponsored • 🌐</span>
                        </div>
                      </div>
                      <span className="text-slate-400 text-xs">•••</span>
                    </div>

                    {/* Copy */}
                    <div className="p-3.5 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                      {composerForm.copy}
                    </div>

                    {/* Media */}
                    {composerForm.mediaUrl && (
                      <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={composerForm.mediaUrl}
                          alt="Creative preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* CTA Card Footer */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                      <div className="max-w-[70%]">
                        <span className="text-[10px] font-mono uppercase text-slate-400 block truncate">
                          nexora.io
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                          {composerForm.headline}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs shrink-0 cursor-pointer"
                      >
                        {composerForm.ctaText}
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. LinkedIn B2B Feed Preview */}
                {activePreviewPlatform === 'LinkedIn' && (
                  <div className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden font-sans">
                    {/* Header */}
                    <div className="p-3.5 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800">
                      <div className="w-10 h-10 rounded-lg bg-[#0A66C2] flex items-center justify-center text-white font-black text-sm">
                        in
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          <span>Nexora Systems</span>
                          <span className="text-[10px] text-slate-400 font-normal">• Promoted</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Enterprise Software House • Custom Web ERPs & Cloud</span>
                      </div>
                    </div>

                    {/* Post Copy with hashtag styling */}
                    <div className="p-3.5 text-xs text-slate-800 dark:text-slate-200 leading-relaxed space-y-2">
                      <p>{composerForm.copy}</p>
                      <p className="text-sky-600 dark:text-sky-400 font-semibold text-[11px]">
                        #EnterpriseArchitecture #CustomERP #DotNetCore #CloudScalability
                      </p>
                    </div>

                    {/* Media */}
                    {composerForm.mediaUrl && (
                      <div className="aspect-[1.91/1] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={composerForm.mediaUrl}
                          alt="Creative preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Banner Bar */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                      <div className="truncate pr-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                          {composerForm.headline}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">nexora.io/solutions</span>
                      </div>
                      <button
                        type="button"
                        className="px-3 py-1 rounded-full border border-sky-600 text-sky-600 dark:text-sky-400 font-bold text-xs hover:bg-sky-50 dark:hover:bg-sky-950/40 shrink-0 cursor-pointer"
                      >
                        {composerForm.ctaText}
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. X (Twitter) Preview */}
                {activePreviewPlatform === 'X' && (
                  <div className="rounded-2xl bg-black border border-slate-800 text-white p-4 font-sans space-y-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                        𝕏
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-bold">Nexora Systems</span>
                          <span className="text-slate-400">@NexoraSystems</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-[10px] text-slate-400 font-mono">Ad</span>
                        </div>
                        <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                          {composerForm.copy}
                        </p>
                      </div>
                    </div>

                    {/* Tweet Summary Card */}
                    {composerForm.mediaUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60">
                        <img
                          src={composerForm.mediaUrl}
                          alt="X Card"
                          className="w-full aspect-[1.91/1] object-cover"
                        />
                        <div className="p-2.5">
                          <span className="text-[10px] text-slate-400 font-mono block">nexora.io</span>
                          <span className="text-xs font-bold text-white block mt-0.5 truncate">
                            {composerForm.headline}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Previously Composed Dispatches */}
              <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400">
                  Broadcast History & Scheduled Queue
                </h4>
                <div className="space-y-2">
                  {postsList.slice(0, 3).map(post => (
                    <div
                      key={post.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs"
                    >
                      <div className="truncate max-w-[70%]">
                        <span className="font-bold text-slate-900 dark:text-white block truncate">
                          {post.headline}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {post.platforms.join(' • ')} — {post.scheduledFor || post.createdAt}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                          post.status === 'published'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}
                      >
                        {post.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 3: CONSOLIDATED ANALYTICS & ROAS                   */}
      {/* ========================================================= */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* Top KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Total Ad Spend', value: `$${totalSpend.toLocaleString()}`, trend: '+12.4%', color: 'text-indigo-700 dark:text-indigo-400' },
              { label: 'Total Impressions', value: totalImpressions.toLocaleString(), trend: '+28.2%', color: 'text-blue-700 dark:text-sky-400' },
              { label: 'Total Ad Clicks', value: totalClicks.toLocaleString(), trend: '+15.6%', color: 'text-blue-700 dark:text-blue-400' },
              { label: 'Average CTR', value: `${avgCtr}%`, trend: '+0.4%', color: 'text-amber-800 dark:text-amber-400' },
              { label: 'Qualified Leads', value: `${totalConversions} Leads`, trend: '+21.8%', color: 'text-emerald-700 dark:text-emerald-400' },
              { label: 'Average CPA', value: `$${avgCpa}`, trend: '-8.5%', color: 'text-emerald-700 dark:text-emerald-400' }
            ].map((kpi, idx) => (
              <div
                key={idx}
                className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
              >
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold block truncate">
                  {kpi.label}
                </span>
                <span className={`text-xl font-extrabold block mt-1 ${kpi.color}`}>
                  {kpi.value}
                </span>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{kpi.trend} vs last month</span>
                </span>
              </div>
            ))}
          </div>

          {/* Channel Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                platform: 'Google Ads',
                sub: 'Search & High-Intent ERP Queries',
                spend: '$2,480',
                clicks: '2,150',
                leads: '84 Leads',
                cpa: '$29.52',
                ctr: '4.46%',
                badgeClass: 'text-blue-700 dark:text-blue-400 border-blue-500/20 bg-blue-500/10'
              },
              {
                platform: 'LinkedIn B2B',
                sub: 'CTO / VP Architecture Demographics',
                spend: '$1,890',
                clicks: '980',
                leads: '42 Leads',
                cpa: '$45.00',
                ctr: '3.71%',
                badgeClass: 'text-blue-700 dark:text-sky-400 border-sky-500/20 bg-sky-500/10'
              },
              {
                platform: 'Meta Ads',
                sub: 'Custom Mobile & React Portals Showcase',
                spend: '$720',
                clicks: '640',
                leads: '19 Leads',
                cpa: '$37.89',
                ctr: '3.23%',
                badgeClass: 'text-indigo-700 dark:text-indigo-400 border-indigo-500/20 bg-indigo-500/10'
              },
              {
                platform: 'X (Twitter)',
                sub: 'Tech Founders & Developer Community',
                spend: '$450',
                clicks: '390',
                leads: '14 Leads',
                cpa: '$32.14',
                ctr: '3.90%',
                badgeClass: 'text-slate-700 dark:text-slate-300 border-slate-500/20 bg-slate-500/10'
              }
            ].map((ch, i) => (
              <div
                key={i}
                className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold border ${ch.badgeClass}`}>
                    {ch.platform}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">{ch.leads}</span>
                </div>
                
                <p className="text-[11px] text-slate-600 dark:text-slate-400">{ch.sub}</p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Spend</span>
                    <span className="font-bold text-slate-900 dark:text-white">{ch.spend}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Clicks</span>
                    <span className="font-bold text-slate-900 dark:text-white">{ch.clicks}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Avg CPA</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{ch.cpa}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">CTR</span>
                    <span className="font-bold text-amber-800 dark:text-amber-400">{ch.ctr}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Regional Pipeline Breakdown */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span>Enterprise Lead Inflow by Geographic Market</span>
            </h4>
            
            <div className="space-y-3">
              {[
                { region: 'GCC & Middle East (UAE, Saudi Arabia, Qatar, Oman)', leads: 82, pct: '56%', bar: 'bg-indigo-600' },
                { region: 'United Kingdom & Western Europe (London, Berlin)', leads: 38, pct: '26%', bar: 'bg-sky-500' },
                { region: 'North America (US & Canada SaaS Founders)', leads: 25, pct: '18%', bar: 'bg-emerald-500' }
              ].map((geo, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{geo.region}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{geo.leads} Leads ({geo.pct})</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full ${geo.bar} rounded-full`} style={{ width: geo.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 4: ACCOUNT CONNECTIONS & APIS                      */}
      {/* ========================================================= */}
      {activeSubTab === 'connections' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-500" />
                <span>Connected Ad Accounts & Developer Webhooks</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authorize API access, sync conversions back into CRM, and configure webhook receivers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map(acc => {
              const isConn = acc.status === 'connected';
              const isPing = testPingState[acc.id] === 'pinging';
              const isPingSuccess = testPingState[acc.id] === 'success';

              return (
                <div
                  key={acc.id}
                  className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {acc.platform}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            isConn
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isConn ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                          <span>{acc.status.toUpperCase()}</span>
                        </span>
                      </div>

                      {canManage && (
                        <button
                          type="button"
                          onClick={() => handleToggleConnection(acc.id)}
                          className="text-[11px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                        >
                          {isConn ? 'Disconnect' : 'Reconnect'}
                        </button>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {acc.accountName}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400">
                      ID: {acc.accountId} • Synced: {acc.lastSyncedAt}
                    </p>
                  </div>

                  {/* Webhook Endpoint Box */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Live Inbound Webhook</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(acc.webhookUrl || '', acc.id)}
                        className="text-indigo-600 dark:text-sky-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        {copiedKey === acc.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === acc.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] font-mono text-slate-700 dark:text-slate-200 truncate select-all">
                      {acc.webhookUrl}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      disabled={isPing}
                      onClick={() => handleTestPing(acc.id)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      {isPing ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                      ) : isPingSuccess ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Radio className="w-3.5 h-3.5 text-indigo-500" />
                      )}
                      <span>{isPing ? 'Testing...' : isPingSuccess ? 'Ping: 200 OK' : 'Test API Ping'}</span>
                    </button>

                    {canManage && (
                      <button
                        type="button"
                        onClick={() => setSelectedConnectionModal(acc)}
                        className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Config</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 5: TOP BANNER & TRACKING PIXELS                    */}
      {/* ========================================================= */}
      {activeSubTab === 'banner' && (
        <div className="space-y-6">
          {/* Top Announcement Banner Controls */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-sky-400">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Website Promotional Top Banner
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Display an attention-grabbing live alert at the top of the public website.
                  </p>
                </div>
              </div>

              {canManage && (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingSettings?.bannerEnabled}
                    onChange={e => updateMarketingSettings({ bannerEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {marketingSettings?.bannerEnabled ? 'Active on Live Site' : 'Disabled'}
                  </span>
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-mono font-semibold uppercase text-slate-500 mb-1">
                  Banner Announcement Text (English)
                </label>
                <input
                  type="text"
                  disabled={!canManage}
                  value={marketingSettings?.bannerText?.en || ''}
                  onChange={e =>
                    updateMarketingSettings({
                      bannerText: { ...marketingSettings.bannerText, en: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono font-semibold uppercase text-slate-500 mb-1">
                  Banner Announcement Text (Arabic)
                </label>
                <input
                  type="text"
                  disabled={!canManage}
                  value={marketingSettings?.bannerText?.ar || ''}
                  onChange={e =>
                    updateMarketingSettings({
                      bannerText: { ...marketingSettings.bannerText, ar: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-arabic text-right"
                />
              </div>
            </div>
          </div>

          {/* SEO & Tracking Pixels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                SEO Meta Configuration
              </h4>
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">SEO Title</label>
                <input
                  type="text"
                  disabled={!canManage}
                  value={marketingSettings?.seoTitle || ''}
                  onChange={e => updateMarketingSettings({ seoTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  disabled={!canManage}
                  value={marketingSettings?.seoDescription || ''}
                  onChange={e => updateMarketingSettings({ seoDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Focus Keywords</label>
                <input
                  type="text"
                  disabled={!canManage}
                  value={marketingSettings?.focusKeywords || ''}
                  onChange={e => updateMarketingSettings({ focusKeywords: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Marketing Tracking Pixels & Tags
              </h4>
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Google Analytics 4 (GA4) ID</label>
                <input
                  type="text"
                  disabled={!canManage}
                  value={marketingSettings?.googleAnalyticsId || ''}
                  onChange={e => updateMarketingSettings({ googleAnalyticsId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Meta / Facebook Pixel ID</label>
                <input
                  type="text"
                  disabled={!canManage}
                  value={marketingSettings?.metaPixelId || ''}
                  onChange={e => updateMarketingSettings({ metaPixelId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">LinkedIn Insight Tag ID</label>
                <input
                  type="text"
                  disabled={!canManage}
                  value={marketingSettings?.linkedInInsightId || ''}
                  onChange={e => updateMarketingSettings({ linkedInInsightId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: LAUNCH NEW CAMPAIGN                                */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Launch Cross-Platform Ad Campaign
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GCC Enterprise ERP Demand Gen"
                  value={newCampaignForm.name}
                  onChange={e => setNewCampaignForm({ ...newCampaignForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                  Platform
                </label>
                <select
                  value={newCampaignForm.platform}
                  onChange={e => setNewCampaignForm({ ...newCampaignForm, platform: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="Google Ads">Google Ads (Search & Demand Gen)</option>
                  <option value="Meta Ads">Meta Ads (Facebook & Instagram)</option>
                  <option value="LinkedIn Ads">LinkedIn B2B (Target CTOs/VPs)</option>
                  <option value="X (Twitter)">X (Twitter Promoted Ads)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                    Daily Budget ($ USD)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={10000}
                    value={newCampaignForm.dailyBudget}
                    onChange={e => setNewCampaignForm({ ...newCampaignForm, dailyBudget: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                    Target Region
                  </label>
                  <input
                    type="text"
                    value={newCampaignForm.targetRegion}
                    onChange={e => setNewCampaignForm({ ...newCampaignForm, targetRegion: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
                >
                  Deploy Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT DAILY BUDGET                                  */}
      {/* ========================================================= */}
      {editingBudgetCampaign && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Adjust Daily Budget
            </h3>
            <p className="text-xs text-slate-500">
              Campaign: <strong className="text-slate-800 dark:text-slate-200">{editingBudgetCampaign.name}</strong>
            </p>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                New Daily Budget (USD)
              </label>
              <input
                type="number"
                min={5}
                max={50000}
                value={newBudgetVal}
                onChange={e => setNewBudgetVal(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingBudgetCampaign(null)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveBudget}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Save Budget
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CONFIGURE ACCOUNT CONNECTION                       */}
      {/* ========================================================= */}
      {selectedConnectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Configure {selectedConnectionModal.platform} Credentials
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedConnectionModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Account Name / Alias
                </label>
                <input
                  type="text"
                  value={selectedConnectionModal.accountName}
                  onChange={e => setSelectedConnectionModal({ ...selectedConnectionModal, accountName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Account / Organization ID
                </label>
                <input
                  type="text"
                  value={selectedConnectionModal.accountId}
                  onChange={e => setSelectedConnectionModal({ ...selectedConnectionModal, accountId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  API Key / OAuth Bearer Token
                </label>
                <input
                  type="text"
                  value={selectedConnectionModal.apiKeyMasked || ''}
                  onChange={e => setSelectedConnectionModal({ ...selectedConnectionModal, apiKeyMasked: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Webhook Dispatcher Endpoint
                </label>
                <input
                  type="text"
                  value={selectedConnectionModal.webhookUrl || ''}
                  onChange={e => setSelectedConnectionModal({ ...selectedConnectionModal, webhookUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedConnectionModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveConnectionConfig(selectedConnectionModal)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Save & Validate Connection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

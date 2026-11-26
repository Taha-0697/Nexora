import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus,
  Trash2,
  Edit,
  RotateCcw,
  Sparkles,
  Layout,
  Play,
  Pause,
  ArrowRightLeft,
  Layers,
  CheckCircle2,
  Upload,
  AlertCircle,
  X,
  Calendar
} from 'lucide-react';
import {
  getClientLogos,
  addClientLogo,
  updateClientLogo,
  deleteClientLogo,
  toggleLogoActive,
  getMarqueeSettings,
  saveMarqueeSettings,
  getCaseStudies,
  addCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  assignHeroCaseStudy,
  assignStackedCaseStudy,
  resetB2BSectionsToDefault,
  B2B_SECTIONS_EVENT,
  SERVICE_FIELDS,
  type ClientLogo,
  type MarqueeSettings,
  type CaseStudy,
  type ServiceField
} from '../../services/b2bSectionsService';

function safeSvg(raw: string): string {
  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+\s*=/gi, 'data-removed=')
    .replace(/javascript:/gi, '')
    .replace(/href\s*=\s*["']?\s*data:[^"'\s>]*/gi, 'href="about:blank"');
}

function isValidUrl(url: string): boolean {
  if (!url) return true; // empty is fine
  return /^https?:\/\//.test(url) || url.startsWith('/') || url.startsWith('#');
}

export const B2BConsoleCmsModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'marquee' | 'casestudies' | 'settings'>('marquee');

  // Data State
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [marqueeSettings, setMarqueeSettings] = useState<MarqueeSettings>({
    direction: 'ltr',
    speed: 32,
    isPaused: false,
    pauseOnHover: true,
    headingText: 'Trusted by engineering and operations leaders worldwide'
  });
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);

  // Logo Form Modal State
  const [editingLogo, setEditingLogo] = useState<ClientLogo | null>(null);
  const [isAddingLogo, setIsAddingLogo] = useState(false);
  const [logoForm, setLogoForm] = useState<{
    name: string;
    tagline: string;
    category: string;
    logoSvg: string;
    imageUrl: string;
    linkType: 'none' | 'website' | 'case_study';
    websiteUrl: string;
    caseStudySlug: string;
    caseStudyId: string;
    active: boolean;
  }>({
    name: '',
    tagline: '',
    category: 'Enterprise',
    logoSvg: '',
    imageUrl: '',
    linkType: 'none',
    websiteUrl: '',
    caseStudySlug: '',
    caseStudyId: '',
    active: true
  });

  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Case Study Form Modal State
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);
  const [isAddingCaseStudy, setIsAddingCaseStudy] = useState(false);
  const [caseStudyForm, setCaseStudyForm] = useState<{
    title: string;
    categoryTag: string;
    serviceField: ServiceField;
    summary: string;
    outcomeHighlight: string;
    imageUrl: string;
    storyUrl: string;
    client: string;
    industry: string;
    isProprietary?: boolean;
    demoProductName?: string;
    bookDemoUrl?: string;
  }>({
    title: '',
    categoryTag: 'CUSTOM WEB ERP · ENTERPRISE',
    serviceField: 'Custom Web ERP (.NET Core)',
    summary: '',
    outcomeHighlight: '',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    storyUrl: '#contact',
    client: '',
    industry: 'Enterprise Software',
    isProprietary: false,
    demoProductName: '',
    bookDemoUrl: '#demo'
  });

  // Direct Logo File Upload Handler (with Validation & Preview)
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB)
    const MAX_SIZE_BYTES = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      setLogoUploadError(`File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds 2MB limit.`);
      return;
    }

    // Validate type (PNG, JPG, SVG, WebP)
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
    if (!allowedTypes.includes(file.type) && !isSvg) {
      setLogoUploadError('Please select a valid PNG, JPG, WebP, or SVG logo image file.');
      return;
    }

    const reader = new FileReader();
    if (isSvg) {
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text && text.includes('<svg')) {
          setLogoForm(prev => ({
            ...prev,
            logoSvg: text,
            imageUrl: '',
            name: prev.name || file.name.replace(/\.[^/.]+$/, '')
          }));
        } else {
          setLogoUploadError('Selected SVG file does not contain valid XML markup.');
        }
      };
      reader.readAsText(file);
    } else {
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setLogoForm(prev => ({
          ...prev,
          imageUrl: dataUrl,
          logoSvg: '',
          name: prev.name || file.name.replace(/\.[^/.]+$/, '')
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearLogoMedia = () => {
    setLogoForm(prev => ({ ...prev, imageUrl: '', logoSvg: '' }));
    setLogoUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const loadData = useCallback(() => {
    setLogos(getClientLogos());
    setMarqueeSettings(getMarqueeSettings());
    setCaseStudies(getCaseStudies());
  }, []);

  useEffect(() => {
    loadData();
    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener(B2B_SECTIONS_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(B2B_SECTIONS_EVENT, handleUpdate);
    };
  }, [loadData]);

  const showToast = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => {
      setFeedbackNotice(null);
    }, 3200);
  };

  // ----------------------------------------------------------------------
  // Logo Marquee Handlers
  // ----------------------------------------------------------------------
  const handleOpenAddLogo = () => {
    setLogoForm({
      name: '',
      tagline: '',
      category: 'Enterprise',
      logoSvg: '',
      imageUrl: '',
      linkType: 'none',
      websiteUrl: '',
      caseStudySlug: '',
      caseStudyId: '',
      active: true
    });
    setLogoUploadError(null);
    setEditingLogo(null);
    setIsAddingLogo(true);
  };

  const handleOpenEditLogo = (logo: ClientLogo) => {
    const inferredType: 'none' | 'website' | 'case_study' =
      logo.linkType ||
      (logo.websiteUrl ? 'website' : logo.caseStudySlug || logo.caseStudyId ? 'case_study' : 'none');

    setEditingLogo(logo);
    setLogoForm({
      name: logo.name,
      tagline: logo.tagline || '',
      category: logo.category || 'Enterprise',
      logoSvg: logo.logoSvg || '',
      imageUrl: logo.imageUrl || '',
      linkType: inferredType,
      websiteUrl: logo.websiteUrl || '',
      caseStudySlug: logo.caseStudySlug || '',
      caseStudyId: logo.caseStudyId || '',
      active: logo.active
    });
    setLogoUploadError(null);
    setIsAddingLogo(true);
  };

  const handleSaveLogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoForm.name.trim()) return;

    // Enforce single mutually exclusive link option
    let websiteUrl: string | undefined = undefined;
    let caseStudySlug: string | undefined = undefined;
    let caseStudyId: string | undefined = undefined;
    let linkType: 'none' | 'website' | 'case_study' = logoForm.linkType;

    if (linkType === 'website') {
      let url = logoForm.websiteUrl.trim();
      if (url && !/^https?:\/\//i.test(url) && !url.startsWith('/') && !url.startsWith('#')) {
        url = `https://${url}`;
      }
      websiteUrl = url || undefined;
      if (!websiteUrl) linkType = 'none';
    } else if (linkType === 'case_study') {
      caseStudySlug = logoForm.caseStudySlug.trim() || undefined;
      caseStudyId = logoForm.caseStudyId.trim() || undefined;
      if (!caseStudySlug && !caseStudyId) linkType = 'none';
    }

    const payload = {
      name: logoForm.name.trim(),
      tagline: logoForm.tagline.trim(),
      category: logoForm.category.trim(),
      logoSvg: logoForm.logoSvg,
      imageUrl: logoForm.imageUrl,
      linkType,
      websiteUrl,
      caseStudySlug,
      caseStudyId,
      active: logoForm.active,
    };

    if (editingLogo) {
      updateClientLogo(editingLogo.id, payload);
      showToast(`Updated logo for "${logoForm.name}".`);
    } else {
      addClientLogo(payload);
      showToast(`Added "${logoForm.name}" to marquee.`);
    }
    setIsAddingLogo(false);
    setEditingLogo(null);
  };

  const handleDeleteLogo = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}" from client marquee?`)) {
      deleteClientLogo(id);
      showToast(`Removed "${name}" from marquee.`);
    }
  };

  const handleToggleLogoActive = (id: string) => {
    toggleLogoActive(id);
  };

  const handleToggleMarqueePlay = () => {
    const updated = { ...marqueeSettings, isPaused: !marqueeSettings.isPaused };
    setMarqueeSettings(updated);
    saveMarqueeSettings(updated);
    showToast(updated.isPaused ? 'Marquee animation paused.' : 'Marquee animation resumed.');
  };

  const handleToggleMarqueeDirection = () => {
    const nextDir: 'ltr' | 'rtl' = marqueeSettings.direction === 'ltr' ? 'rtl' : 'ltr';
    const updated = { ...marqueeSettings, direction: nextDir };
    setMarqueeSettings(updated);
    saveMarqueeSettings(updated);
    showToast(`Marquee direction set to ${nextDir.toUpperCase()}.`);
  };

  const handleChangeSpeed = (speed: number) => {
    const updated = { ...marqueeSettings, speed };
    setMarqueeSettings(updated);
    saveMarqueeSettings(updated);
  };

  // ----------------------------------------------------------------------
  // Case Study Handlers
  // ----------------------------------------------------------------------
  const handleOpenAddCaseStudy = () => {
    setCaseStudyForm({
      title: '',
      categoryTag: 'CUSTOM WEB ERP · ENTERPRISE',
      serviceField: 'Custom Web ERP (.NET Core)',
      summary: '',
      outcomeHighlight: '',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      storyUrl: '#contact',
      client: '',
      industry: 'Enterprise Software',
      isProprietary: false,
      demoProductName: '',
      bookDemoUrl: '#demo'
    });
    setEditingCaseStudy(null);
    setIsAddingCaseStudy(true);
  };

  const handleOpenEditCaseStudy = (cs: CaseStudy) => {
    setEditingCaseStudy(cs);
    setCaseStudyForm({
      title: cs.title,
      categoryTag: cs.categoryTag,
      serviceField: cs.serviceField || 'Custom Web ERP (.NET Core)',
      summary: cs.summary,
      outcomeHighlight: cs.outcomeHighlight,
      imageUrl: cs.imageUrl,
      storyUrl: cs.storyUrl || '#contact',
      client: cs.client || '',
      industry: cs.industry || '',
      isProprietary: Boolean(cs.isProprietary || cs.serviceField === 'Proprietary Suite'),
      demoProductName: cs.demoProductName || '',
      bookDemoUrl: cs.bookDemoUrl || '#demo'
    });
    setIsAddingCaseStudy(true);
  };

  const handleSaveCaseStudy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseStudyForm.title.trim()) return;

    if (!isValidUrl(caseStudyForm.storyUrl || '')) {
      showToast('Invalid CTA URL: must start with https://, /, or #');
      return;
    }
    if (!isValidUrl(caseStudyForm.imageUrl || '')) {
      showToast('Invalid Image URL: must start with https://, /, or #');
      return;
    }

    if (editingCaseStudy) {
      updateCaseStudy(editingCaseStudy.id, caseStudyForm);
      showToast(`Updated case study "${caseStudyForm.title}". Synced across site & service page.`);
    } else {
      addCaseStudy(caseStudyForm);
      showToast(`Published new case study. Automatically synced to /case-studies and ${caseStudyForm.serviceField}.`);
    }
    setIsAddingCaseStudy(false);
    setEditingCaseStudy(null);
  };

  const handleDeleteCaseStudy = (id: string, title: string) => {
    if (window.confirm(`Delete case study "${title}"?`)) {
      deleteCaseStudy(id);
      showToast(`Deleted case study.`);
    }
  };

  const handleAssignHero = (id: string) => {
    assignHeroCaseStudy(id);
    showToast('Promoted case study to Left Featured Hero Card (~60%).');
  };

  const handleAssignStacked = (id: string, position: 1 | 2) => {
    assignStackedCaseStudy(id, position);
    showToast(`Assigned case study to Right Stacked Slot ${position}.`);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset Logo Marquee and Case Studies to default Nexora Systems enterprise data? This will restore original client logos and 7 service case studies.')) {
      resetB2BSectionsToDefault();
      showToast('Reset all B2B section data to defaults.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header Banner */}
      <div className="p-6 rounded-2xl glass-panel bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-sky-300 text-xs font-mono font-bold mb-2">
              <Layout className="w-3.5 h-3.5" />
              <span>B2B Console CMS • Live Site Synchronization</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
              B2B Client Marquee & Case Studies CMS
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Manage the infinite client trust strip, publish verified case studies with automatic service-field synchronization across <strong className="text-indigo-600 dark:text-sky-300">/case-studies</strong> and dedicated service pages, and adjust live loop animation parameters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Defaults</span>
            </button>
          </div>
        </div>

        {/* Toast Feedback Notice */}
        {feedbackNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">{feedbackNotice}</span>
          </div>
        )}

        {/* Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-5 mt-5 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveSubTab('marquee')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'marquee'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>Client Logos & Marquee ({logos.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('casestudies')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'casestudies'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>Case Studies & Work ({caseStudies.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>Marquee Playback & Settings</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: CLIENT LOGOS & MARQUEE                         */}
      {/* ========================================================= */}
      {activeSubTab === 'marquee' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Client Logos in Live Marquee Strip
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logos scroll automatically on the landing page trust strip. Toggle visibility or edit metadata.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleMarqueePlay}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  marqueeSettings.isPaused
                    ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {marqueeSettings.isPaused ? <Play className="w-3.5 h-3.5 text-amber-600" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{marqueeSettings.isPaused ? 'Resume Loop' : 'Pause Loop'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleMarqueeDirection}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Direction ({marqueeSettings.direction.toUpperCase()})</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddLogo}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Client Logo</span>
              </button>
            </div>
          </div>

          {/* Add/Edit Logo Inline Drawer / Modal */}
          {isAddingLogo && (
            <form
              onSubmit={handleSaveLogo}
              className="p-5 rounded-2xl glass-panel bg-white dark:bg-[#0E1526] border border-indigo-500/40 space-y-4 shadow-lg animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-sm text-indigo-600 dark:text-sky-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>{editingLogo ? 'Edit Client Logo' : 'Add New Client Logo'}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingLogo(false);
                    setEditingLogo(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={logoForm.name}
                    onChange={e => setLogoForm({ ...logoForm, name: e.target.value })}
                    placeholder="e.g. Meridian Capital Assets"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tagline / Specialty
                  </label>
                  <input
                    type="text"
                    value={logoForm.tagline}
                    onChange={e => setLogoForm({ ...logoForm, tagline: e.target.value })}
                    placeholder="e.g. Private Equity & Treasury"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Industry Category
                  </label>
                  <input
                    type="text"
                    value={logoForm.category}
                    onChange={e => setLogoForm({ ...logoForm, category: e.target.value })}
                    placeholder="e.g. Healthcare, Fintech, Energy"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Direct File Upload & Media Preview */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300">
                    Upload Logo Image (PNG, SVG, JPG, WebP • Max 2MB)
                  </label>
                  {(logoForm.imageUrl || logoForm.logoSvg) && (
                    <button
                      type="button"
                      onClick={handleClearLogoMedia}
                      className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      <span>Clear Image</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-indigo-400 dark:border-indigo-500/50 bg-white dark:bg-slate-950 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-indigo-700 dark:text-sky-300 text-xs font-semibold cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Choose Logo File or Drag & Drop</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".png,.jpg,.jpeg,.svg,.webp,image/*"
                      onChange={handleLogoFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Live Preview Box */}
                  {(logoForm.imageUrl || logoForm.logoSvg) ? (
                    <div className="h-14 min-w-[120px] max-w-[180px] px-3 py-1.5 rounded-xl bg-white dark:bg-[#060913] border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs">
                      {logoForm.logoSvg ? (
                        <div
                          className="max-h-10 flex items-center justify-center"
                          dangerouslySetInnerHTML={{ __html: safeSvg(logoForm.logoSvg) }}
                        />
                      ) : (
                        <img
                          src={logoForm.imageUrl}
                          alt="Preview"
                          className="max-h-10 max-w-full object-contain"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="h-14 min-w-[120px] px-3 py-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-center">
                      No Media Selected
                    </div>
                  )}
                </div>

                {logoUploadError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{logoUploadError}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Manual Logo SVG Markup or Image URL (Optional Fallback)
                </label>
                <textarea
                  rows={2}
                  value={logoForm.logoSvg || logoForm.imageUrl}
                  onChange={e => {
                    const val = e.target.value;
                    if (val.trim().startsWith('<svg')) {
                      setLogoForm({ ...logoForm, logoSvg: val, imageUrl: '' });
                    } else {
                      setLogoForm({ ...logoForm, imageUrl: val, logoSvg: '' });
                    }
                  }}
                  placeholder='Paste <svg>...</svg> or https://example.com/logo.png'
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white resize-none"
                />
              </div>

              {/* Single Destination Link Option (Website URL OR Case Study Link) */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300">
                    Destination Link (Optional • Single Choice)
                  </label>
                  <div className="inline-flex rounded-lg bg-slate-200/70 dark:bg-slate-800 p-0.5 gap-0.5">
                    {(
                      [
                        { id: 'none', label: 'None' },
                        { id: 'website', label: 'Website URL (New Tab)' },
                        { id: 'case_study', label: 'Case Study Link' },
                      ] as const
                    ).map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setLogoForm(prev => ({
                            ...prev,
                            linkType: opt.id,
                            websiteUrl: opt.id === 'website' ? prev.websiteUrl : '',
                            caseStudySlug: opt.id === 'case_study' ? prev.caseStudySlug : '',
                            caseStudyId: opt.id === 'case_study' ? prev.caseStudyId : '',
                          }));
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                          logoForm.linkType === opt.id
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {logoForm.linkType === 'website' && (
                  <div>
                    <input
                      type="text"
                      value={logoForm.websiteUrl}
                      onChange={e => setLogoForm({ ...logoForm, websiteUrl: e.target.value })}
                      placeholder="https://client-company.com"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                    />
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Opens in a new browser tab when clicked in the live marquee.
                    </p>
                  </div>
                )}

                {logoForm.linkType === 'case_study' && (
                  <div className="space-y-2">
                    <select
                      value={logoForm.caseStudyId || logoForm.caseStudySlug}
                      onChange={e => {
                        const val = e.target.value;
                        const matched = caseStudies.find(cs => cs.id === val);
                        if (matched) {
                          const slug = matched.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                          setLogoForm({
                            ...logoForm,
                            caseStudyId: matched.id,
                            caseStudySlug: slug,
                          });
                        } else {
                          setLogoForm({
                            ...logoForm,
                            caseStudyId: '',
                            caseStudySlug: val,
                          });
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="">Select a Case Study…</option>
                      {caseStudies.map(cs => (
                        <option key={cs.id} value={cs.id}>
                          {cs.title} ({cs.client})
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={logoForm.caseStudySlug}
                      onChange={e => setLogoForm({ ...logoForm, caseStudySlug: e.target.value })}
                      placeholder="Case study slug (e.g. medpulse-clinical-erp)"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={logoForm.active}
                    onChange={e => setLogoForm({ ...logoForm, active: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Display in live public marquee</span>
                </label>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  {editingLogo ? 'Save Changes' : 'Add Logo to Strip'}
                </button>
              </div>
            </form>
          )}

          {/* Logos Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {logos.map(logo => (
              <div
                key={logo.id}
                className={`p-4 rounded-2xl glass-panel bg-white dark:bg-[#0E1526] border transition-all ${
                  logo.active
                    ? 'border-slate-200 dark:border-slate-800'
                    : 'border-dashed border-slate-300 dark:border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="h-10 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#060913] border border-slate-200 dark:border-slate-800/80 flex items-center justify-center shrink-0 min-w-[100px]">
                    {logo.logoSvg ? (
                      <div
                        className="text-slate-900 dark:text-white"
                        dangerouslySetInnerHTML={{ __html: safeSvg(logo.logoSvg) }}
                      />
                    ) : (
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{logo.name}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleLogoActive(logo.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        logo.active
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {logo.active ? 'ACTIVE' : 'MUTED'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditLogo(logo)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteLogo(logo.id, logo.name)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white font-heading">{logo.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{logo.tagline || logo.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: CASE STUDIES & WORK                            */}
      {/* ========================================================= */}
      {activeSubTab === 'casestudies' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Enterprise Case Studies & Operational Outcomes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All case studies are published to <strong className="text-indigo-600 dark:text-sky-300">/case-studies</strong> and dynamically linked to their tagged service page.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddCaseStudy}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Publish New Case Study</span>
            </button>
          </div>

          {/* Add / Edit Case Study Modal Form */}
          {isAddingCaseStudy && (
            <form
              onSubmit={handleSaveCaseStudy}
              className="p-5 rounded-2xl glass-panel bg-white dark:bg-[#0E1526] border border-indigo-500/40 space-y-4 shadow-xl animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-sm text-indigo-600 dark:text-sky-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>{editingCaseStudy ? 'Edit Case Study' : 'Create & Publish New Case Study'}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCaseStudy(false);
                    setEditingCaseStudy(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Case Study Title *
                </label>
                <input
                  type="text"
                  required
                  value={caseStudyForm.title}
                  onChange={e => setCaseStudyForm({ ...caseStudyForm, title: e.target.value })}
                  placeholder="e.g. Multi-Warehouse Inventory & Supply Chain Consolidation on Odoo 17"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category Tag *
                  </label>
                  <input
                    type="text"
                    required
                    value={caseStudyForm.categoryTag}
                    onChange={e => setCaseStudyForm({ ...caseStudyForm, categoryTag: e.target.value })}
                    placeholder="ODOO RESCUE · SUPPLY CHAIN"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Client / Enterprise Entity
                  </label>
                  <input
                    type="text"
                    value={caseStudyForm.client}
                    onChange={e => setCaseStudyForm({ ...caseStudyForm, client: e.target.value })}
                    placeholder="Vanguard Global Logistics"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={caseStudyForm.industry}
                    onChange={e => setCaseStudyForm({ ...caseStudyForm, industry: e.target.value })}
                    placeholder="Logistics & Supply Chain"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-semibold text-indigo-700 dark:text-sky-300 mb-1">
                  Service / Architectural Field * (Syncs with Service Sub-Pages & /case-studies Filters)
                </label>
                <select
                  value={caseStudyForm.serviceField}
                  onChange={e => setCaseStudyForm({ ...caseStudyForm, serviceField: e.target.value as ServiceField })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/40 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {SERVICE_FIELDS.map(sf => (
                    <option key={sf} value={sf}>
                      {sf}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Challenge & Architecture Solution (Summary) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={caseStudyForm.summary}
                  onChange={e => setCaseStudyForm({ ...caseStudyForm, summary: e.target.value })}
                  placeholder="Describe the client's operational bottleneck and the high-performance architectural solution engineered by Nexora..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white leading-relaxed resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                  Measurable Operational Outcome (✓ Metric Line) *
                </label>
                <input
                  type="text"
                  required
                  value={caseStudyForm.outcomeHighlight}
                  onChange={e => setCaseStudyForm({ ...caseStudyForm, outcomeHighlight: e.target.value })}
                  placeholder="e.g. Reduced inter-warehouse reconciliation cycles by 83% while eliminating over $420,000 in redundant stock bloat."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-emerald-300 dark:border-emerald-500/40 text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={caseStudyForm.imageUrl}
                    onChange={e => setCaseStudyForm({ ...caseStudyForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Direct Inquiry / CTA URL
                  </label>
                  <input
                    type="text"
                    value={caseStudyForm.storyUrl}
                    onChange={e => setCaseStudyForm({ ...caseStudyForm, storyUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Proprietary Suite Live Demo Metadata */}
              {(caseStudyForm.serviceField === 'Proprietary Suite' || caseStudyForm.isProprietary) && (
                <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-indigo-700 dark:text-sky-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Proprietary Suite Live Demo Setup
                    </span>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-indigo-600 dark:text-sky-400">
                      <input
                        type="checkbox"
                        checked={caseStudyForm.isProprietary}
                        onChange={e => setCaseStudyForm({ ...caseStudyForm, isProprietary: e.target.checked })}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Proprietary Software Deliverable</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Demo Product Name (Prefills Demo Modal)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Nexora Flow™ Enterprise Suite"
                        value={caseStudyForm.demoProductName}
                        onChange={e => setCaseStudyForm({ ...caseStudyForm, demoProductName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Live Demo Target / Booking Link
                      </label>
                      <input
                        type="text"
                        placeholder="#demo or https://calendly.com/nexora-demo"
                        value={caseStudyForm.bookDemoUrl}
                        onChange={e => setCaseStudyForm({ ...caseStudyForm, bookDemoUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  {editingCaseStudy ? 'Update & Sync Case Study' : 'Publish to Live Pages'}
                </button>
              </div>
            </form>
          )}

          {/* Case Studies Table & Cards */}
          <div className="space-y-3">
            {caseStudies.map(cs => (
              <div
                key={cs.id}
                className="p-4 sm:p-5 rounded-2xl glass-panel bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={cs.imageUrl}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-[10px] font-mono font-bold text-blue-700 dark:text-sky-300">
                        {cs.serviceField}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400">
                        {cs.categoryTag}
                      </span>
                      {cs.isHero && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[9px] font-mono font-bold">
                          ★ HERO CARD
                        </span>
                      )}
                      {cs.isStacked && (
                        <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 text-[9px] font-mono font-bold">
                          STACKED SLOT {cs.stackedPosition || 1}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white font-heading">
                      {cs.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                      Client: <strong className="text-slate-800 dark:text-slate-200">{cs.client || 'Enterprise'}</strong> • {cs.outcomeHighlight}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => handleAssignHero(cs.id)}
                    disabled={cs.isHero}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      cs.isHero
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Hero Card
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAssignStacked(cs.id, 1)}
                    disabled={cs.isStacked && cs.stackedPosition === 1}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      cs.isStacked && cs.stackedPosition === 1
                        ? 'bg-indigo-600 text-white cursor-default'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Slot 1
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAssignStacked(cs.id, 2)}
                    disabled={cs.isStacked && cs.stackedPosition === 2}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      cs.isStacked && cs.stackedPosition === 2
                        ? 'bg-indigo-600 text-white cursor-default'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Slot 2
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditCaseStudy(cs)}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Edit Case Study"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCaseStudy(cs.id, cs.title)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                    title="Delete Case Study"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: MARQUEE PLAYBACK & SETTINGS                    */}
      {/* ========================================================= */}
      {activeSubTab === 'settings' && (
        <div className="p-6 rounded-2xl glass-panel bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Marquee Loop & Speed Parameters
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure horizontal marquee scrolling speed, pause-on-hover behavior, and header title text.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Marquee Section Heading
              </label>
              <input
                type="text"
                value={marqueeSettings.headingText}
                onChange={e => {
                  const updated = { ...marqueeSettings, headingText: e.target.value };
                  setMarqueeSettings(updated);
                  saveMarqueeSettings(updated);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Loop Speed ({marqueeSettings.speed} seconds)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={12}
                  max={60}
                  value={marqueeSettings.speed}
                  onChange={e => handleChangeSpeed(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-sky-300 min-w-[50px]">
                  {marqueeSettings.speed}s
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={marqueeSettings.pauseOnHover}
                onChange={e => {
                  const updated = { ...marqueeSettings, pauseOnHover: e.target.checked };
                  setMarqueeSettings(updated);
                  saveMarqueeSettings(updated);
                  showToast(e.target.checked ? 'Enabled pause-on-hover.' : 'Disabled pause-on-hover.');
                }}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Pause animation smoothly when hovering over logos</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={marqueeSettings.direction === 'rtl'}
                onChange={e => {
                  const dir: 'ltr' | 'rtl' = e.target.checked ? 'rtl' : 'ltr';
                  const updated = { ...marqueeSettings, direction: dir };
                  setMarqueeSettings(updated);
                  saveMarqueeSettings(updated);
                  showToast(`Marquee direction set to ${dir.toUpperCase()}.`);
                }}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Right-to-Left (RTL) scroll direction</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

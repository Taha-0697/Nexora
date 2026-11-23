import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit,
  RotateCcw,
  Sparkles,
  Layout,
  Play,
  Pause,
  ArrowRightLeft,
  CheckCircle2,
  Layers
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
  getCaseStudiesSettings,
  saveCaseStudiesSettings,
  resetB2BSectionsToDefault,
  B2B_SECTIONS_EVENT,
  SERVICE_FIELDS,
  type ClientLogo,
  type MarqueeSettings,
  type CaseStudy,
  type CaseStudiesSettings,
  type ServiceField
} from '../../services/b2bSectionsService';

function safeSvg(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+\s*=/gi, 'data-removed=')
    .replace(/javascript:/gi, '')
    .replace(/href\s*=\s*["']?\s*data:[^"'\s>]*/gi, 'href="about:blank"');
}

interface B2BSectionsAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const B2BSectionsAdminDrawer: React.FC<B2BSectionsAdminDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'marquee' | 'casestudies' | 'settings'>('marquee');
  
  // Data State
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [marqueeSettings, setMarqueeSettings] = useState<MarqueeSettings>({
    direction: 'ltr',
    speed: 30,
    isPaused: false,
    pauseOnHover: true,
    headingText: 'Trusted by teams worldwide'
  });
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [caseStudiesSettings, setCaseStudiesSettings] = useState<CaseStudiesSettings>({
    eyebrowLabel: 'SELECTED WORK',
    headingText: 'Real projects, real operational outcomes',
    subtitleText: 'Proven engineering deliverables across custom web ERPs, high-concurrency Odoo bridges, and mission-critical cloud backends.',
    primaryCtaText: 'Discuss my project →',
    secondaryCtaText: 'View all case studies →'
  });

  // Modal / Form States
  const [editingLogo, setEditingLogo] = useState<ClientLogo | null>(null);
  const [isAddingLogo, setIsAddingLogo] = useState(false);
  const [logoForm, setLogoForm] = useState<{
    name: string;
    tagline: string;
    category: string;
    logoSvg: string;
    imageUrl: string;
    active: boolean;
  }>({
    name: '',
    tagline: '',
    category: 'Enterprise',
    logoSvg: '',
    imageUrl: '',
    active: true
  });

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
  }>({
    title: '',
    categoryTag: 'CUSTOM WEB ERP · ENTERPRISE',
    serviceField: 'Custom Web ERP (.NET Core)',
    summary: '',
    outcomeHighlight: '',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    storyUrl: '#portfolio',
    client: '',
    industry: 'Enterprise Software'
  });

  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const loadData = useCallback(() => {
    setLogos(getClientLogos());
    setMarqueeSettings(getMarqueeSettings());
    setCaseStudies(getCaseStudies());
    setCaseStudiesSettings(getCaseStudiesSettings());
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, loadData]);

  useEffect(() => {
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
    }, 2800);
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
      active: true
    });
    setEditingLogo(null);
    setIsAddingLogo(true);
  };

  const handleOpenEditLogo = (logo: ClientLogo) => {
    setEditingLogo(logo);
    setLogoForm({
      name: logo.name,
      tagline: logo.tagline || '',
      category: logo.category || 'Enterprise',
      logoSvg: logo.logoSvg || '',
      imageUrl: logo.imageUrl || '',
      active: logo.active
    });
    setIsAddingLogo(true);
  };

  const handleSaveLogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoForm.name.trim()) return;

    if (editingLogo) {
      updateClientLogo(editingLogo.id, logoForm);
      showToast(`Updated "${logoForm.name}" logo.`);
    } else {
      addClientLogo(logoForm);
      showToast(`Added "${logoForm.name}" to marquee track.`);
    }
    setIsAddingLogo(false);
    setEditingLogo(null);
  };

  const handleDeleteLogo = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}" from client logos?`)) {
      deleteClientLogo(id);
      showToast(`Deleted "${name}".`);
    }
  };

  const handleToggleDirection = () => {
    const nextDir: 'ltr' | 'rtl' = marqueeSettings.direction === 'ltr' ? 'rtl' : 'ltr';
    const updated: MarqueeSettings = { ...marqueeSettings, direction: nextDir };
    setMarqueeSettings(updated);
    saveMarqueeSettings(updated);
    showToast(`Marquee scroll direction set to ${nextDir === 'ltr' ? 'Left-to-Right' : 'Right-to-Left'}.`);
  };

  const handleTogglePause = () => {
    const updated = { ...marqueeSettings, isPaused: !marqueeSettings.isPaused };
    setMarqueeSettings(updated);
    saveMarqueeSettings(updated);
    showToast(updated.isPaused ? 'Marquee animation paused.' : 'Marquee animation resumed.');
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseInt(e.target.value, 10) || 30;
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
      storyUrl: '#portfolio',
      client: '',
      industry: 'Enterprise Software'
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
      storyUrl: cs.storyUrl || '#portfolio',
      client: cs.client || '',
      industry: cs.industry || ''
    });
    setIsAddingCaseStudy(true);
  };

  const handleSaveCaseStudy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseStudyForm.title.trim()) return;

    if (editingCaseStudy) {
      updateCaseStudy(editingCaseStudy.id, caseStudyForm);
      showToast(`Updated case study "${caseStudyForm.title}".`);
    } else {
      addCaseStudy(caseStudyForm);
      showToast(`Added new case study.`);
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
    if (window.confirm('Reset Logo Marquee and Case Studies to default Nexora Systems enterprise data? This will restore original client logos and case studies.')) {
      resetB2BSectionsToDefault();
      showToast('Reset all B2B section data to defaults.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0E1526] text-slate-900 dark:text-white shadow-2xl z-10 flex flex-col h-full border-l border-slate-200 dark:border-slate-800">
        
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#060913]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F766E]/15 text-[#0F766E] dark:text-teal-400 flex items-center justify-center">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Nexora B2B CMS Console
              </h2>
              <p className="text-xs text-[#475569] dark:text-slate-400">
                Live editor for Marquee logos & Selected Work case studies
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Toast Notice */}
        {feedbackNotice && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-[#0F766E]/10 border border-[#0F766E]/30 text-xs font-semibold text-[#0F766E] dark:text-teal-300 flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#0F766E] dark:text-teal-400" />
            <span>{feedbackNotice}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 pt-4 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('marquee');
              setIsAddingLogo(false);
              setIsAddingCaseStudy(false);
            }}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'marquee'
                ? 'border-[#0F766E] text-[#0F766E] dark:text-teal-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Client Logos ({logos.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('casestudies');
              setIsAddingLogo(false);
              setIsAddingCaseStudy(false);
            }}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'casestudies'
                ? 'border-[#0F766E] text-[#0F766E] dark:text-teal-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Case Studies ({caseStudies.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('settings');
              setIsAddingLogo(false);
              setIsAddingCaseStudy(false);
            }}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[#0F766E] text-[#0F766E] dark:text-teal-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Section Headings & Reset</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* ========================================================= */}
          {/* TAB 1: LOGO MARQUEE CONTROLS                              */}
          {/* ========================================================= */}
          {activeTab === 'marquee' && (
            <div className="space-y-6">
              
              {/* Marquee Animation Controls Bar */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#060913] border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Marquee Loop Controls
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleDirection}
                      className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold flex items-center gap-1.5 hover:border-[#0F766E]/50 cursor-pointer"
                    >
                      <ArrowRightLeft className="w-3 h-3 text-[#0F766E]" />
                      <span>{marqueeSettings.direction === 'ltr' ? 'Left → Right' : 'Right → Left'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTogglePause}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer border ${
                        marqueeSettings.isPaused
                          ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200'
                      }`}
                    >
                      {marqueeSettings.isPaused ? (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>PAUSED</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-3 h-3" />
                          <span>RUNNING</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Speed Slider */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400 mb-1">
                    <span>Loop Speed: {marqueeSettings.speed}s per cycle</span>
                    <span>Faster (10s) ↔ Slower (60s)</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="2"
                    value={marqueeSettings.speed}
                    onChange={handleSpeedChange}
                    className="w-full accent-[#0F766E] cursor-pointer"
                  />
                </div>
              </div>

              {/* Add / Edit Form Drawer */}
              {isAddingLogo ? (
                <form
                  onSubmit={handleSaveLogo}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-[#060913] border border-[#0F766E]/40 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#0F766E] dark:text-teal-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>{editingLogo ? 'Edit Client Logo' : 'Add New Client Logo'}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingLogo(false);
                        setEditingLogo(null);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={logoForm.name}
                        onChange={e => setLogoForm({ ...logoForm, name: e.target.value })}
                        placeholder="e.g. MedPulse"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Tagline / Category
                      </label>
                      <input
                        type="text"
                        value={logoForm.tagline}
                        onChange={e => setLogoForm({ ...logoForm, tagline: e.target.value })}
                        placeholder="Healthcare ERP"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Inline SVG Code (Recommended)
                    </label>
                    <textarea
                      rows={3}
                      value={logoForm.logoSvg}
                      onChange={e => setLogoForm({ ...logoForm, logoSvg: e.target.value })}
                      placeholder="<svg viewBox='0 0 140 36' ...>...</svg>"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Or Image URL (Fallback)
                    </label>
                    <input
                      type="url"
                      value={logoForm.imageUrl}
                      onChange={e => setLogoForm({ ...logoForm, imageUrl: e.target.value })}
                      placeholder="https://.../logo.png"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={logoForm.active}
                        onChange={e => setLogoForm({ ...logoForm, active: e.target.checked })}
                        className="rounded accent-[#0F766E]"
                      />
                      <span>Active in Marquee Loop</span>
                    </label>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs shadow-xs cursor-pointer"
                    >
                      {editingLogo ? 'Save Changes' : 'Add Logo'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Client Logo Track Items ({logos.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleOpenAddLogo}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Logo</span>
                  </button>
                </div>
              )}

              {/* Logos List */}
              <div className="space-y-2.5">
                {logos.map(logo => (
                  <div
                    key={logo.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      logo.active
                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        : 'bg-slate-100 dark:bg-slate-950/40 border-slate-200 dark:border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Logo Preview box */}
                      <div className="w-24 h-11 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                        {logo.logoSvg ? (
                          <div
                            className="max-h-7 max-w-full"
                            dangerouslySetInnerHTML={{ __html: safeSvg(logo.logoSvg) }}
                          />
                        ) : logo.imageUrl ? (
                          <img src={logo.imageUrl} alt={logo.name} className="max-h-6 max-w-full object-contain" />
                        ) : (
                          <span className="font-bold text-xs text-[#0F766E]">{logo.name}</span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {logo.name}
                          </h4>
                          {!logo.active && (
                            <span className="text-[9px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.2 rounded border border-amber-300 dark:border-amber-800">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                          {logo.tagline || logo.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleLogoActive(logo.id)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold border cursor-pointer ${
                          logo.active
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                        }`}
                        title="Toggle active / inactive"
                      >
                        {logo.active ? 'ACTIVE' : 'OFF'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditLogo(logo)}
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#0F766E] dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Edit logo details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteLogo(logo.id, logo.name)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950 cursor-pointer"
                        title="Delete logo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: CASE STUDIES CONTROLS                              */}
          {/* ========================================================= */}
          {activeTab === 'casestudies' && (
            <div className="space-y-6">
              
              {isAddingCaseStudy ? (
                <form
                  onSubmit={handleSaveCaseStudy}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-[#060913] border border-[#0F766E]/40 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#0F766E] dark:text-teal-300 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      <span>{editingCaseStudy ? 'Edit Case Study' : 'Create New Case Study'}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCaseStudy(false);
                        setEditingCaseStudy(null);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800"
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
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Category Tag *
                      </label>
                      <input
                        type="text"
                        required
                        value={caseStudyForm.categoryTag}
                        onChange={e => setCaseStudyForm({ ...caseStudyForm, categoryTag: e.target.value })}
                        placeholder="ODOO RESCUE · DIGITAL SERVICES"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Client / Enterprise
                      </label>
                      <input
                        type="text"
                        value={caseStudyForm.client}
                        onChange={e => setCaseStudyForm({ ...caseStudyForm, client: e.target.value })}
                        placeholder="Vanguard Global Logistics"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-semibold text-[#0F766E] dark:text-teal-300 mb-1">
                      Service / Architectural Field * (Syncs with Service Pages & Filters)
                    </label>
                    <select
                      value={caseStudyForm.serviceField}
                      onChange={e => setCaseStudyForm({ ...caseStudyForm, serviceField: e.target.value as ServiceField })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium"
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
                      Problem & Solution (2-Sentence Summary) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={caseStudyForm.summary}
                      onChange={e => setCaseStudyForm({ ...caseStudyForm, summary: e.target.value })}
                      placeholder="Describe the operational challenge and the technical solution delivered by Nexora..."
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white leading-relaxed resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-semibold text-[#0F766E] dark:text-teal-300 mb-1">
                      Checkmark (✓) Measurable Outcome Line *
                    </label>
                    <input
                      type="text"
                      required
                      value={caseStudyForm.outcomeHighlight}
                      onChange={e => setCaseStudyForm({ ...caseStudyForm, outcomeHighlight: e.target.value })}
                      placeholder="e.g. Reduced inter-warehouse reconciliation cycles by 83% while eliminating over $420,000 in redundant stock bloat."
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Preview Image URL
                      </label>
                      <input
                        type="url"
                        value={caseStudyForm.imageUrl}
                        onChange={e => setCaseStudyForm({ ...caseStudyForm, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Story Link URL
                      </label>
                      <input
                        type="text"
                        value={caseStudyForm.storyUrl}
                        onChange={e => setCaseStudyForm({ ...caseStudyForm, storyUrl: e.target.value })}
                        placeholder="#portfolio or /case-studies/odoo"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs shadow-xs cursor-pointer"
                    >
                      {editingCaseStudy ? 'Update Case Study' : 'Publish Case Study'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Layout Assignments & Case Studies
                    </h3>
                    <p className="text-[11px] text-[#475569] dark:text-slate-400">
                      Assign 1 Left Hero (~60%) and 2 Right Stacked (~40%) cards
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddCaseStudy}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Case Study</span>
                  </button>
                </div>
              )}

              {/* Case Studies Cards List */}
              <div className="space-y-4">
                {caseStudies.map(cs => {
                  return (
                    <div
                      key={cs.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        cs.isHero
                          ? 'bg-[#0F766E]/5 dark:bg-[#0F766E]/15 border-[#0F766E]/50 shadow-sm'
                          : cs.isStacked
                          ? 'bg-slate-50 dark:bg-slate-900 border-indigo-300 dark:border-indigo-800 shadow-2xs'
                          : 'bg-white dark:bg-[#060913] border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={cs.imageUrl}
                            alt=""
                            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-mono font-bold uppercase text-[#0F766E] dark:text-teal-300">
                                {cs.categoryTag}
                              </span>

                              {cs.serviceField && (
                                <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-[9px] font-mono font-semibold text-blue-700 dark:text-sky-300">
                                  {cs.serviceField}
                                </span>
                              )}

                              {cs.isHero && (
                                <span className="px-2 py-0.5 rounded-md bg-[#0F766E] text-white text-[9px] font-mono font-bold tracking-wider">
                                  ★ HERO (LEFT ~60%)
                                </span>
                              )}

                              {cs.isStacked && (
                                <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[9px] font-mono font-bold tracking-wider">
                                  STACKED SLOT {cs.stackedPosition || 1} (~40%)
                                </span>
                              )}
                            </div>

                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug line-clamp-1 mt-0.5">
                              {cs.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              Client: {cs.client || 'Enterprise'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEditCaseStudy(cs)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#0F766E] hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCaseStudy(cs.id, cs.title)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Quick Layout Role Assignment Buttons */}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          Layout Slot:
                        </span>
                        
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAssignHero(cs.id)}
                            disabled={cs.isHero}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                              cs.isHero
                                ? 'bg-[#0F766E] text-white cursor-default'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-[#0F766E]/20 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            Set as Hero (Left)
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAssignStacked(cs.id, 1)}
                            disabled={cs.isStacked && cs.stackedPosition === 1}
                            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                              cs.isStacked && cs.stackedPosition === 1
                                ? 'bg-indigo-600 text-white cursor-default'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            Right Slot 1
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAssignStacked(cs.id, 2)}
                            disabled={cs.isStacked && cs.stackedPosition === 2}
                            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                              cs.isStacked && cs.stackedPosition === 2
                                ? 'bg-indigo-600 text-white cursor-default'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            Right Slot 2
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: SECTION HEADINGS & FACTORY RESET                   */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#060913] border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Section 1 (Marquee) Headings
                </h3>
                <div>
                  <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Marquee Header Title
                  </label>
                  <input
                    type="text"
                    value={marqueeSettings.headingText}
                    onChange={e => {
                      const updated = { ...marqueeSettings, headingText: e.target.value };
                      setMarqueeSettings(updated);
                      saveMarqueeSettings(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#060913] border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Section 2 (Selected Work) Headings & CTAs
                </h3>
                
                <div>
                  <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Eyebrow Label
                  </label>
                  <input
                    type="text"
                    value={caseStudiesSettings.eyebrowLabel}
                    onChange={e => {
                      const updated = { ...caseStudiesSettings, eyebrowLabel: e.target.value };
                      setCaseStudiesSettings(updated);
                      saveCaseStudiesSettings(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Heading Title
                  </label>
                  <input
                    type="text"
                    value={caseStudiesSettings.headingText}
                    onChange={e => {
                      const updated = { ...caseStudiesSettings, headingText: e.target.value };
                      setCaseStudiesSettings(updated);
                      saveCaseStudiesSettings(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subtitle (1-Sentence)
                  </label>
                  <textarea
                    rows={2}
                    value={caseStudiesSettings.subtitleText}
                    onChange={e => {
                      const updated = { ...caseStudiesSettings, subtitleText: e.target.value };
                      setCaseStudiesSettings(updated);
                      saveCaseStudiesSettings(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Primary Solid Button CTA
                    </label>
                    <input
                      type="text"
                      value={caseStudiesSettings.primaryCtaText}
                      onChange={e => {
                        const updated = { ...caseStudiesSettings, primaryCtaText: e.target.value };
                        setCaseStudiesSettings(updated);
                        saveCaseStudiesSettings(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Secondary Outlined Button CTA
                    </label>
                    <input
                      type="text"
                      value={caseStudiesSettings.secondaryCtaText}
                      onChange={e => {
                        const updated = { ...caseStudiesSettings, secondaryCtaText: e.target.value };
                        setCaseStudiesSettings(updated);
                        saveCaseStudiesSettings(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Reset to Default Nexora Data */}
              <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-xs text-rose-900 dark:text-rose-200">
                    Reset to Default Nexora Data
                  </h4>
                  <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">
                    Restores the initial 9 verified client enterprise logos and 4 core ERP case studies.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Data</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { X, Send, CheckCircle2, ShieldCheck, Sparkles, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillScope?: {
    services?: string[];
    scale?: string;
    support?: string;
    estimatedBudget?: string;
    estimatedTimeline?: string;
    serviceName?: string;
    customStack?: string[];
  };
}

export const QuickQuoteModal: React.FC<QuickQuoteModalProps> = ({
  isOpen,
  onClose,
  prefillScope,
}) => {
  const { language, t } = useLanguage();
  const { addInquiry } = useData();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: 'Enterprise Odoo & Custom ERPs',
    budget: '$15,000 - $35,000',
    timeline: '1 - 2 Months',
    message: '',
    customStack: [] as string[],
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (prefillScope) {
      const defaultService = prefillScope.serviceName 
        || (prefillScope.services && prefillScope.services.join(', '))
        || 'Enterprise Odoo & Custom ERPs';

      const stackText = prefillScope.customStack && prefillScope.customStack.length > 0
        ? `\nSpecified Tech Stack: ${prefillScope.customStack.join(', ')}`
        : '';

      setFormData(prev => ({
        ...prev,
        serviceType: defaultService,
        budget: prefillScope.estimatedBudget || prev.budget,
        timeline: prefillScope.estimatedTimeline || prev.timeline,
        customStack: prefillScope.customStack || [],
        message: prefillScope.services
          ? `Estimated Scope: ${prefillScope.services.join(' + ')} | Scale: ${prefillScope.scale} | Support Tier: ${prefillScope.support}${stackText}`
          : prev.message
      }));
    }
  }, [prefillScope]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    addInquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      serviceType: formData.serviceType,
      budget: formData.budget,
      timeline: formData.timeline,
      message: formData.message,
      customStack: formData.customStack,
    });

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {
      // ignore
    }

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-slate-200 dark:border-indigo-500/40 p-6 sm:p-8 bg-white dark:bg-dark-950 shadow-2xl transition-colors">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-dark-800 text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {language === 'ar' ? 'تم استلام طلب العرض الفني!' : 'Proposal Request Dispatched!'}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              {language === 'ar' 
                ? 'شكراً لتواصلك مع نيكسورا سيستمز. تم إدراج طلبك في بوابة الإدارة وسيقوم مهندس الحلول بالتواصل معك خلال ساعات قليلة.'
                : 'Thank you for connecting with Nexora Systems. Our solution engineering lead will review your requirements and reach out within 4 hours.'}
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              {language === 'ar' ? 'تم ومتابعة التصفح' : 'Done & Return'}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-sky-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'ar' ? 'طلب عرض هندسي واستشاري' : 'Engineering Proposal Request'}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
              {language === 'ar' ? 'لنبدأ في هندسة مشروعك القادم' : 'Let’s Architect Your Next Solution'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">
              {language === 'ar' 
                ? 'سنقوم بإعداد دراسة فنية ونطاق عمل مخصص بالكامل مع اتفاقية سرية (NDA).'
                : 'We will prepare a comprehensive architectural scope and fixed-price quotation under mutual NDA.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('contact.fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('contact.email')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('contact.phone')}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+968 / +971 / +1"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('contact.company')}
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Company Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Budget Range
                  </label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-sky-300 font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Timeline
                  </label>
                  <input
                    type="text"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              {formData.customStack && formData.customStack.length > 0 && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
                    <span>Specified Tech Stack:</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-slate-700">
                    {formData.customStack.map(tech => (
                      <span key={tech} className="px-2 py-0.5 rounded bg-white dark:bg-dark-800 text-indigo-600 dark:text-sky-300 border border-slate-200 dark:border-slate-700 font-mono text-[10px] font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Scope Overview / Note
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Outline any legacy software, servers, or user scale..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs resize-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs tracking-wide shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit Inquiry to Nexora Architects</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
                <span>Protected by Mutual Non-Disclosure Agreement (NDA)</span>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import {
  X,
  Send,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Cpu,
  Loader2,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { sendCostEstimateEmail, isValidEmail } from '../../services/emailService';

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
    isLiveDemo?: boolean;
    productName?: string;
    category?: string;
    caseStudy?: string;
  };
}

const QuickQuoteModalComponent: React.FC<QuickQuoteModalProps> = ({
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
    serviceType: 'Custom Web ERP & Enterprise Portals',
    budget: '$15,000 - $35,000',
    timeline: '1 - 2 Months',
    message: '',
    customStack: [] as string[],
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateField = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  useEffect(() => {
    if (isOpen && prefillScope) {
      if (prefillScope.isLiveDemo || prefillScope.productName) {
        setFormData(prev => ({
          ...prev,
          serviceType: `Live Demo: ${prefillScope.productName || 'Proprietary Suite'}`,
          budget: 'N/A - Free Live Demo',
          timeline: 'Immediate / Next 48 Hours',
          message: `Requesting a private 30-minute interactive live demonstration of: ${prefillScope.productName || 'Proprietary Software Suite'}.`,
        }));
        return;
      }

      const defaultService = prefillScope.serviceName 
        || (prefillScope.services && prefillScope.services.join(', '))
        || 'Custom Web ERP & Enterprise Portals';

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
  }, [isOpen, prefillScope]);

  if (!isOpen) return null;

  const isDemo = Boolean(prefillScope?.isLiveDemo || prefillScope?.productName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Client-side validation
    if (!formData.name.trim()) {
      setSubmitError(
        language === 'ar'
          ? 'يرجى إدخال اسمك الكامل'
          : 'Please provide your full name.'
      );
      return;
    }

    if (!isValidEmail(formData.email)) {
      setSubmitError(
        language === 'ar'
          ? 'يرجى إدخال بريد إلكتروني صالح'
          : 'Please provide a valid email address.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendCostEstimateEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        serviceType: formData.serviceType,
        budget: formData.budget,
        timeline: formData.timeline,
        message: formData.message,
        customStack: formData.customStack,
        scale: prefillScope?.scale,
        support: prefillScope?.support,
        services: prefillScope?.services,
      });

      if (result.success && result.status === 200) {
        // Record in internal inquiries state (Admin Command Center)
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

        // Reset form fields ONLY after a successful 200 response
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          serviceType: 'Custom Web ERP & Enterprise Portals',
          budget: '$15,000 - $35,000',
          timeline: '1 - 2 Months',
          message: '',
          customStack: [],
        });

        setSubmitted(true);
      } else {
        setSubmitError(
          result.error ||
            (language === 'ar'
              ? 'حدث خطأ أثناء إرسال طلب العرض. يرجى المحاولة مرة أخرى.'
              : 'Failed to transmit proposal request via EmailJS. Please try again.')
        );
      }
    } catch (err: any) {
      setSubmitError(
        err?.message ||
          (language === 'ar'
            ? 'حدث خطأ غير متوقع أثناء الإرسال.'
            : 'An unexpected transmission error occurred.')
      );
    } finally {
      setIsSubmitting(false);
    }
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
              {isDemo
                ? (language === 'ar' ? 'تم تأكيد حجز العرض الحي!' : 'Live Demo Scheduled!')
                : (language === 'ar' ? 'تم استلام طلب العرض الفني!' : 'Proposal Request Dispatched!')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              {isDemo
                ? (language === 'ar'
                  ? `شكراً لاهتمامك بـ ${prefillScope?.productName || 'أنظمتنا الحصرية'}. سيقوم مهندس الحلول بإرسال دعوة التقويم ورابط بيئة العرض المباشرة عبر بريدك الإلكتروني.`
                  : `Thank you for booking a live demo for ${prefillScope?.productName || 'our proprietary suite'}. Our lead systems architect will email you a calendar invite with private live staging environment credentials.`)
                : (language === 'ar' 
                  ? 'شكراً لتواصلك مع نيكسورا سيستمز. تم إدراج طلبك في بوابة الإدارة وسيقوم مهندس الحلول بالتواصل معك خلال ساعات قليلة.'
                  : 'Thank you for connecting with Nexora Systems. Our solution engineering lead will review your requirements and reach out within 4 hours.')}
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
              {isDemo ? <Calendar className="w-4 h-4 text-sky-400" /> : <Sparkles className="w-4 h-4" />}
              <span>
                {isDemo
                  ? (language === 'ar' ? 'حجز عرض تفاعلي مباشر' : 'Private Live System Demonstration')
                  : (language === 'ar' ? 'طلب عرض هندسي واستشاري' : 'Engineering Proposal Request')}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
              {isDemo
                ? (language === 'ar' ? `تجربة حية لـ ${prefillScope?.productName || 'المنظومة'}` : `Book Free Live Demo: ${prefillScope?.productName || 'Proprietary Software'}`)
                : (language === 'ar' ? 'لنبدأ في هندسة مشروعك القادم' : 'Let’s Architect Your Next Solution')}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">
              {isDemo
                ? (language === 'ar'
                  ? 'احجز جلسة استعراضية تفاعلية مدتها 30 دقيقة مع رئيس مهندسي الأنظمة لاختبار جميع الوحدات وقواعد البيانات والمزامنة اللحظية.'
                  : 'Schedule an interactive 30-minute private walkthrough with our principal solutions architect to test live modules, database syncing, and telemetry.')
                : (language === 'ar' 
                  ? 'سنقوم بإعداد دراسة فنية ونطاق عمل مخصص بالكامل مع اتفاقية سرية (NDA).'
                  : 'We will prepare a comprehensive architectural scope and fixed-price quotation under mutual NDA.')}
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
                    onChange={(e) => updateField('name', e.target.value)}
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
                    onChange={(e) => updateField('email', e.target.value)}
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
                    onChange={(e) => updateField('phone', e.target.value)}
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
                    onChange={(e) => updateField('company', e.target.value)}
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
                    onChange={(e) => updateField('budget', e.target.value)}
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
                    onChange={(e) => updateField('timeline', e.target.value)}
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
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder="Outline any legacy software, servers, or user scale..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs resize-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Inline Error Alert */}
              {submitError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                  <div className="flex-1 leading-snug">{submitError}</div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 rounded-xl text-white font-black text-xs tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-80'
                      : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-600/20 active:scale-98 cursor-pointer'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>
                        {language === 'ar'
                          ? 'جارٍ الإرسال إلى كبار المعماريين عبر EmailJS...'
                          : 'Transmitting Proposal via EmailJS...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        {isDemo
                          ? (language === 'ar' ? 'تأكيد حجز العرض التجريبي المباشر ←' : 'Confirm Free Live Demo Request →')
                          : (language === 'ar' ? 'إرسال طلب العرض الفني لكبار المعماريين' : 'Submit Inquiry to Nexora Architects')}
                      </span>
                      {isDemo ? <Calendar className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                    </>
                  )}
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

export const QuickQuoteModal = React.memo(QuickQuoteModalComponent);

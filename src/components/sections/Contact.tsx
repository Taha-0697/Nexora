import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useData } from '../../context/DataContext'
import {
  Send,
  CheckCircle2,
  Mail,
  Phone,
  Building2,
  Sparkles,
  ShieldCheck,
  Cpu,
  Loader2,
  AlertCircle
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { sendContactEmail, isValidEmail } from '../../services/emailService'

interface ContactProps {
  initialService?: string
}

export const Contact: React.FC<ContactProps> = ({ initialService = '' }) => {
  const { language, t } = useLanguage()
  const { addInquiry } = useData()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: initialService || 'Custom Enterprise Web Portals',
    budget: '$15,000 - $35,000',
    timeline: '1 - 3 Months',
    message: '',
    selectedStacks: [] as string[]
  })

  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const quickStacks = [
    'React / Next.js',
    'Custom ERP',
    '.NET Core',
    'Web Apps',
    'REST APIs',
    'Kotlin / Java',
    'Flutter App',
    'Node.js',
    'Native iOS / Android',
    'Python FastAPI',
    'Odoo',
    'PostgreSQL',
    'AWS / Kubernetes',
    'Custom Python ERP',
    'Headless Portal'
  ]

  const toggleStack = (stack: string) => {
    setFormData(prev => {
      const exists = prev.selectedStacks.includes(stack)
      return {
        ...prev,
        selectedStacks: exists
          ? prev.selectedStacks.filter(s => s !== stack)
          : [...prev.selectedStacks, stack]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    // Client-side validation
    if (!formData.name.trim()) {
      setSubmitError(
        language === 'ar'
          ? 'يرجى إدخال اسمك الكامل'
          : 'Please provide your full name.'
      )
      return
    }

    if (!isValidEmail(formData.email)) {
      setSubmitError(
        language === 'ar'
          ? 'يرجى إدخال بريد إلكتروني صالح'
          : 'Please provide a valid email address.'
      )
      return
    }

    setIsSubmitting(true)

    try {
      const result = await sendContactEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        serviceType: formData.serviceType,
        budget: formData.budget,
        timeline: formData.timeline,
        message: formData.message,
        selectedStacks: formData.selectedStacks
      })

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
          customStack: formData.selectedStacks
        })

        // Reset form fields ONLY after a successful 200 response
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          serviceType: initialService || 'Custom Enterprise Web Portals',
          budget: '$15,000 - $35,000',
          timeline: '1 - 3 Months',
          message: '',
          selectedStacks: []
        })

        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          })
        } catch (err) {
          // ignore
        }

        setSubmitted(true)
      } else {
        setSubmitError(
          result.error ||
            (language === 'ar'
              ? 'حدث خطأ أثناء إرسال الاستفسار. يرجى المحاولة مرة أخرى.'
              : 'Failed to transmit inquiry via EmailJS. Please try again.')
        )
      }
    } catch (err: any) {
      setSubmitError(
        err?.message ||
          (language === 'ar'
            ? 'حدث خطأ غير متوقع أثناء الإرسال.'
            : 'An unexpected transmission error occurred.')
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id='contact'
      className='py-12 sm:py-16 lg:py-24 relative bg-white section-surface-2 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden transition-colors'
    >
      {/* Background glow */}
      <div className='absolute top-1/2 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-sky-500/10 rounded-full blur-[120px] pointer-events-none' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        {/* Header */}
        <div className='text-center max-w-3xl mx-auto mb-8 sm:mb-16'>
          <div className='inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-sky-400 mb-3 sm:mb-4'>
            <Sparkles className='w-3.5 h-3.5' />
            <span>{t('contact.badge')}</span>
          </div>
          <h2 className='text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3 sm:mb-4'>
            {t('contact.title')}
          </h2>
          <p className='text-slate-600 dark:text-slate-300 text-sm sm:text-lg'>
            {t('contact.sub')}
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 items-start max-w-6xl mx-auto'>
          {/* Left Column: Direct Contact Info & Value Props (5 cols) */}
          <div className='lg:col-span-5 space-y-5 sm:space-y-6'>
            <div className='glass-panel p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 space-y-5 sm:space-y-6 bg-white dark:bg-dark-900/60 shadow-sm'>
              <h3 className='text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2'>
                {language === 'ar'
                  ? 'مقر العمليات والاتصال المباشر'
                  : 'Direct Enterprise Channels'}
              </h3>
              <p className='text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed'>
                {language === 'ar'
                  ? 'يرجى ملء النموذج أو التواصل مع مهندسينا مباشرة لمناقشة المتطلبات وتوقيع اتفاقيات السرية.'
                  : 'Connect directly with our lead solution architects. We offer same-day architectural discovery sessions and mutual NDA protection.'}
              </p>

              <div className='space-y-3.5 sm:space-y-4 pt-3.5 sm:pt-4 border-t border-slate-200 dark:border-slate-800'>
                <div className='flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300'>
                  <div className='w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-dark-900 border border-indigo-200 dark:border-slate-700 flex items-center justify-center shrink-0 text-indigo-600 dark:text-sky-400'>
                    <Mail className='w-4 h-4 sm:w-5 sm:h-5' />
                  </div>
                  <div>
                    <div className='text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 uppercase font-mono'>
                      Inquiry Email
                    </div>
                    <a
                      href='mailto:solutions@nexorasystems.com'
                      className='text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-sky-400'
                    >
                      solutions@nexorasystems.com
                    </a>
                  </div>
                </div>

                <div className='flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300'>
                  <div className='w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-dark-900 border border-indigo-200 dark:border-slate-700 flex items-center justify-center shrink-0 text-indigo-600 dark:text-sky-400'>
                    <Phone className='w-4 h-4 sm:w-5 sm:h-5' />
                  </div>
                  <div>
                    <div className='text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 uppercase font-mono'>
                      Direct / WhatsApp
                    </div>
                    <a
                      href='tel:+96894122731'
                      className='text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-sky-400'
                    >
                      +968 9412 2731
                    </a>
                    &nbsp; / &nbsp;
                    <a
                      href='tel:+923032466418'
                      className='text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-sky-400'
                    >
                      +92 303 246 6418
                    </a>
                  </div>
                </div>

                <div className='flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300'>
                  <div className='w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-dark-900 border border-indigo-200 dark:border-slate-700 flex items-center justify-center shrink-0 text-indigo-600 dark:text-sky-400'>
                    <Building2 className='w-4 h-4 sm:w-5 sm:h-5' />
                  </div>
                  <div>
                    <div className='text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 uppercase font-mono'>
                      Global Operations
                    </div>
                    <div className='text-xs sm:text-sm font-semibold text-slate-900 dark:text-white'>
                      Muscat, Oman / Dubai, UAE / Karachi, Pakistan & Remote
                      Worldwide
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className='p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-indigo-50/70 dark:bg-dark-900/90 border border-indigo-200 dark:border-indigo-500/20 space-y-1.5 sm:space-y-2'>
                <div className='flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-sky-300'>
                  <ShieldCheck className='w-4 h-4 text-indigo-600 dark:text-sky-400' />
                  <span>
                    {language === 'ar'
                      ? 'ضمانات نيكسورا الهندسية'
                      : 'Nexora Engineering Guarantees'}
                  </span>
                </div>
                <p className='text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400 leading-normal'>
                  {language === 'ar'
                    ? '• اتفاقية عدم إفصاح متبادلة (Mutual NDA) • تسليم كامل للأكواد المصدرية • دعم تشغيلي على مدار الساعة'
                    : '• Mutual NDA protection • 100% IP & Source Code Ownership • 24/7 SLA Backed Support'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Capture Form (7 cols) */}
          <div className='lg:col-span-7'>
            <div className='glass-panel p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 relative bg-white dark:bg-dark-900/60 shadow-sm'>
              {submitted ? (
                <div className='text-center py-8 sm:py-12 space-y-4 sm:space-y-5'>
                  <div className='w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400'>
                    <CheckCircle2 className='w-8 h-8 sm:w-10 sm:h-10' />
                  </div>
                  <h3 className='text-xl sm:text-2xl font-bold text-slate-900 dark:text-white'>
                    {language === 'ar'
                      ? 'تم استلام طلبك بنجاح!'
                      : 'Inquiry Received!'}
                  </h3>
                  <p className='text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed'>
                    {t('contact.success')}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className='px-5 sm:px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-700 text-indigo-600 dark:text-sky-400 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer'
                  >
                    {language === 'ar'
                      ? 'إرسال استفسار آخر'
                      : 'Send Another Inquiry'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-5'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {/* Full Name */}
                    <div>
                      <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                        {t('contact.fullName')} *
                      </label>
                      <input
                        type='text'
                        required
                        value={formData.name}
                        onChange={e =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder='John Doe / طارق المنصور'
                        className='w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-sky-400 transition-colors'
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                        {t('contact.email')} *
                      </label>
                      <input
                        type='email'
                        required
                        value={formData.email}
                        onChange={e =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder='director@enterprise.com'
                        className='w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-sky-400 transition-colors'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {/* Phone */}
                    <div>
                      <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                        {t('contact.phone')}
                      </label>
                      <input
                        type='text'
                        value={formData.phone}
                        onChange={e =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder='+968 9123 4567'
                        className='w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-sky-400 transition-colors'
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                        {t('contact.company')}
                      </label>
                      <input
                        type='text'
                        value={formData.company}
                        onChange={e =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        placeholder='Apex Logistics Ltd'
                        className='w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-sky-400 transition-colors'
                      />
                    </div>
                  </div>

                  {/* Primary Service Selection */}
                  <div>
                    <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                      {t('contact.serviceType')}
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          serviceType: e.target.value
                        })
                      }
                      className='w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-sky-400 transition-colors'
                    >
                      <option value='Custom ERP & Enterprise Odoo'>
                        Custom ERP & Enterprise Odoo
                      </option>
                      <option value='Custom Enterprise Web Portals'>
                        Custom Enterprise Web Portals
                      </option>
                      <option value='Custom Mobile Apps (iOS & Android)'>
                        Custom Mobile Apps (iOS & Android)
                      </option>
                      <option value='24/7 Server Operations & Cloud DevOps'>
                        24/7 Server Operations & Cloud DevOps
                      </option>
                      <option value='High-Performance Headless E-Commerce'>
                        High-Performance Headless E-Commerce
                      </option>
                      <option value='Full Comprehensive Suite (All Services)'>
                        Full Comprehensive Suite (All Services)
                      </option>
                    </select>
                  </div>

                  {/* Client Tech Stack Specifications */}
                  <div>
                    <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5'>
                      <Cpu className='w-3.5 h-3.5 text-indigo-600 dark:text-sky-400' />
                      <span>
                        {language === 'ar'
                          ? 'حدد التقنيات المطلوبة (اختياري):'
                          : 'Desired Tech Stack Specifications (Optional):'}
                      </span>
                    </label>
                    <div className='flex flex-wrap gap-1.5'>
                      {quickStacks.map(stack => {
                        const isSelected =
                          formData.selectedStacks.includes(stack)
                        return (
                          <button
                            type='button'
                            key={stack}
                            onClick={() => toggleStack(stack)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white font-semibold'
                                : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                            }`}
                          >
                            {stack}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Budget & Timeline Brackets */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                        {t('contact.budget')}
                      </label>
                      <select
                        value={formData.budget}
                        onChange={e =>
                          setFormData({ ...formData, budget: e.target.value })
                        }
                        className='w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-sky-400 transition-colors'
                      >
                        <option value='$5,000 - $15,000'>
                          $5,000 - $15,000
                        </option>
                        <option value='$15,000 - $35,000'>
                          $15,000 - $35,000
                        </option>
                        <option value='$35,000 - $75,000'>
                          $35,000 - $75,000
                        </option>
                        <option value='$75,000+ Enterprise'>
                          $75,000+ Enterprise
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                        {language === 'ar'
                          ? 'الجدول الزمني المفضل'
                          : 'Target Timeline'}
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={e =>
                          setFormData({ ...formData, timeline: e.target.value })
                        }
                        className='w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-sky-400 transition-colors'
                      >
                        <option value='Immediate (< 1 Month)'>
                          Immediate (&lt; 1 Month)
                        </option>
                        <option value='1 - 3 Months'>1 - 3 Months</option>
                        <option value='3 - 6 Months'>3 - 6 Months</option>
                        <option value='Ongoing 24/7 SLA'>
                          Ongoing 24/7 SLA
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                      {t('contact.message')}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={e =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder='Describe your current software setup, scale, or migration goals...'
                      className='w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-sky-400 transition-colors resize-none'
                    />
                  </div>

                  {/* Inline Error Alert */}
                  {submitError && (
                    <div className='p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-fadeIn'>
                      <AlertCircle className='w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400' />
                      <div className='flex-1 leading-snug'>{submitError}</div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className={`w-full py-3.5 sm:py-4 rounded-xl text-white font-extrabold text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 ${
                      isSubmitting
                        ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-80'
                        : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-600/25 hover:shadow-indigo-600/40 active:scale-98 cursor-pointer'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className='w-4 h-4 animate-spin text-white' />
                        <span>
                          {language === 'ar'
                            ? 'جارٍ الإرسال عبر EmailJS...'
                            : 'Transmitting Inquiry via EmailJS...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>{t('contact.send')}</span>
                        <Send className='w-4 h-4' />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

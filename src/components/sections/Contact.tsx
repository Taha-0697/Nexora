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
  Cpu
} from 'lucide-react'
import confetti from 'canvas-confetti'

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

  const quickStacks = [
    'React / Next.js',
    'Custom ERP',
    '.NET Core',
    'Web Apps',
    'Web APis',
    'Kotlin / Java',
    'Flutter App',
    'Node.js',
    'Native iOS / Android',
    'Python FastAPI',
    'Odoo 17',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return

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
  }

  return (
    <section
      id='contact'
      className='py-24 relative bg-slate-50 dark:bg-dark-950 overflow-hidden transition-colors'
    >
      {/* Background glow */}
      <div className='absolute top-1/2 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-sky-500/10 rounded-full blur-[120px] pointer-events-none' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        {/* Header */}
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <div className='inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-sky-400 mb-4'>
            <Sparkles className='w-3.5 h-3.5' />
            <span>{t('contact.badge')}</span>
          </div>
          <h2 className='text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4'>
            {t('contact.title')}
          </h2>
          <p className='text-slate-600 dark:text-slate-300 text-base sm:text-lg'>
            {t('contact.sub')}
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto'>
          {/* Left Column: Direct Contact Info & Value Props (5 cols) */}
          <div className='lg:col-span-5 space-y-6'>
            <div className='glass-panel p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 space-y-6 bg-white dark:bg-dark-900/60 shadow-sm'>
              <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-2'>
                {language === 'ar'
                  ? 'مقر العمليات والاتصال المباشر'
                  : 'Direct Enterprise Channels'}
              </h3>
              <p className='text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed'>
                {language === 'ar'
                  ? 'يرجى ملء النموذج أو التواصل مع مهندسينا مباشرة لمناقشة المتطلبات وتوقيع اتفاقيات السرية.'
                  : 'Connect directly with our lead solution architects. We offer same-day architectural discovery sessions and mutual NDA protection.'}
              </p>

              <div className='space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800'>
                <div className='flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300'>
                  <div className='w-10 h-10 rounded-xl bg-indigo-50 dark:bg-dark-900 border border-indigo-200 dark:border-slate-700 flex items-center justify-center shrink-0 text-indigo-600 dark:text-sky-400'>
                    <Mail className='w-5 h-5' />
                  </div>
                  <div>
                    <div className='text-[11px] text-slate-500 dark:text-slate-400 uppercase font-mono'>
                      Inquiry Email
                    </div>
                    <a
                      href='mailto:solutions@nexorasystems.com'
                      className='font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-sky-400'
                    >
                      solutions@nexorasystems.com
                    </a>
                  </div>
                </div>

                <div className='flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300'>
                  <div className='w-10 h-10 rounded-xl bg-indigo-50 dark:bg-dark-900 border border-indigo-200 dark:border-slate-700 flex items-center justify-center shrink-0 text-indigo-600 dark:text-sky-400'>
                    <Phone className='w-5 h-5' />
                  </div>
                  <div>
                    <div className='text-[11px] text-slate-500 dark:text-slate-400 uppercase font-mono'>
                      Direct / WhatsApp
                    </div>
                    <a
                      href='tel:+96894122731'
                      className='font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-sky-400'
                    >
                      +968 9412 2731
                    </a>
                    &nbsp; / &nbsp;
                    <a
                      href='tel:+923032466418'
                      className='font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-sky-400'
                    >
                      +92 303 246 6418
                    </a>
                  </div>
                </div>

                <div className='flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300'>
                  <div className='w-10 h-10 rounded-xl bg-indigo-50 dark:bg-dark-900 border border-indigo-200 dark:border-slate-700 flex items-center justify-center shrink-0 text-indigo-600 dark:text-sky-400'>
                    <Building2 className='w-5 h-5' />
                  </div>
                  <div>
                    <div className='text-[11px] text-slate-500 dark:text-slate-400 uppercase font-mono'>
                      Global Operations
                    </div>
                    <div className='font-semibold text-slate-900 dark:text-white'>
                      Muscat, Oman / Dubai, UAE / Karachi, Pakistan & Remote
                      Worldwide
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className='p-4 rounded-2xl bg-indigo-50/70 dark:bg-dark-900/90 border border-indigo-200 dark:border-indigo-500/20 space-y-2'>
                <div className='flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-sky-300'>
                  <ShieldCheck className='w-4 h-4 text-indigo-600 dark:text-sky-400' />
                  <span>
                    {language === 'ar'
                      ? 'ضمانات نيكسورا الهندسية'
                      : 'Nexora Engineering Guarantees'}
                  </span>
                </div>
                <p className='text-[11px] text-slate-600 dark:text-slate-400 leading-normal'>
                  {language === 'ar'
                    ? '• اتفاقية عدم إفصاح متبادلة (Mutual NDA) • تسليم كامل للأكواد المصدرية • دعم تشغيلي على مدار الساعة'
                    : '• Mutual NDA protection • 100% IP & Source Code Ownership • 24/7 SLA Backed Support'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Capture Form (7 cols) */}
          <div className='lg:col-span-7'>
            <div className='glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 relative bg-white dark:bg-dark-900/60 shadow-sm'>
              {submitted ? (
                <div className='text-center py-12 space-y-5'>
                  <div className='w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400'>
                    <CheckCircle2 className='w-10 h-10' />
                  </div>
                  <h3 className='text-2xl font-bold text-slate-900 dark:text-white'>
                    {language === 'ar'
                      ? 'تم استلام طلبك بنجاح!'
                      : 'Inquiry Received!'}
                  </h3>
                  <p className='text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto leading-relaxed'>
                    {t('contact.success')}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className='px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-700 text-indigo-600 dark:text-sky-400 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer'
                  >
                    {language === 'ar'
                      ? 'إرسال استفسار آخر'
                      : 'Send Another Inquiry'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className='space-y-5'>
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
                      <option value='Custom ERP & Enterprise Odoo 17'>
                        Custom ERP & Enterprise Odoo 17
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

                  {/* Submit Button */}
                  <button
                    type='submit'
                    className='w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer'
                  >
                    <span>{t('contact.send')}</span>
                    <Send className='w-4 h-4' />
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

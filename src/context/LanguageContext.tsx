import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Language } from '../types';

interface LanguageContextType {
  language: Language;
  direction: 'ltr' | 'rtl';
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, { en: string; ar: string }> = {
  // Navigation
  'nav.services': { en: 'Services', ar: 'خدماتنا' },
  'nav.portfolio': { en: 'Portfolio', ar: 'أعمالنا' },
  'nav.estimator': { en: 'Cost Estimator', ar: 'حاسبة التكلفة' },
  'nav.techStack': { en: 'Tech Stack', ar: 'التقنيات' },
  'nav.reviews': { en: 'Client Reviews', ar: 'آراء العملاء' },
  'nav.contact': { en: 'Contact Us', ar: 'تواصل معنا' },
  'nav.admin': { en: 'Admin Portal', ar: 'بوابة الإدارة' },
  'nav.quote': { en: 'Get a Proposal', ar: 'اطلب عرض سعر' },

  // Hero
  'hero.badge': { en: 'Premier Enterprise Software House & Cloud Systems', ar: 'الرواد في هندسة البرمجيات وإدارة السيرفرات السحابية' },
  'hero.titleLine1': { en: 'Architecting Scalable', ar: 'نهندس برمجيات' },
  'hero.titleHighlight': { en: 'Digital Infrastructure', ar: 'المستقبل الرقمي' },
  'hero.titleLine2': { en: '& Enterprise Software', ar: 'وأنظمة المؤسسات الكبرى' },
  'hero.sub': {
    en: 'Nexora Systems engineers mission-critical solutions across Odoo ERP, 24/7 cloud server administration, high-throughput web portals, and native iOS & Android applications.',
    ar: 'تقدم نيكسورا للأنظمة حلولاً برمجية متقدمة تشمل أنظمة أودو لتخطيط الموارد (ERP)، وإدارة السيرفرات والبنى السحابية 24/7، وتطبيقات الجوال الأصلية، ومنصات الويب عالية الأداء.'
  },
  'hero.ctaServices': { en: 'Explore Capabilities', ar: 'استكشف خدماتنا' },
  'hero.ctaEstimator': { en: 'Calculate Project Cost', ar: 'احسب تكلفة مشروعك' },
  'hero.statUptime': { en: 'Server Uptime SLA', ar: 'استقرار السيرفرات' },
  'hero.statDeployments': { en: 'Production Deployments', ar: 'مشروع منجز بنجاح' },
  'hero.statClients': { en: 'Client Retention Rate', ar: 'نسبة رضا العملاء' },
  'hero.statResponse': { en: 'Emergency Cloud Response', ar: 'استجابة طوارئ السيرفرات' },

  // Services
  'services.badge': { en: 'End-to-End Capabilities', ar: 'قدراتنا التقنية المتكاملة' },
  'services.title': { en: 'Engineered for Performance & Scale', ar: 'حلول مصممة للأداء والتوسع المؤسسي' },
  'services.sub': {
    en: 'From bare-metal Linux server clusters to complex Odoo ERPs and slick mobile apps, we cover the complete engineering lifecycle.',
    ar: 'من إدارة الخوادم والبنى التحتية إلى أنظمة أودو وتطبيقات الجوال والويب، نغطي الدورة الهندسية الكاملة.'
  },

  // Estimator
  'estimator.badge': { en: 'Instant Project Scoping', ar: 'تسعير تقديري فوري' },
  'estimator.title': { en: 'Interactive Project Scope & Cost Estimator', ar: 'حاسبة النطاق وتقدير التكلفة التفاعلية' },
  'estimator.sub': {
    en: 'Select your target engineering requirements to generate an instant timeline and budget scope estimation.',
    ar: 'حدد متطلباتك التقنية وخدماتك المطلوبة للحصول على تقدير فوري للزمن والميزانية المقترحة.'
  },
  'estimator.stepServices': { en: '1. Select Services Needed', ar: '١. اختر الخدمات المطلوبة' },
  'estimator.stepScale': { en: '2. Project Scale & Complexity', ar: '٢. حجم المشروع والتعقيد' },
  'estimator.stepSLA': { en: '3. Cloud & SLA Support Tier', ar: '٣. مستوى الدعم السحابي والصيانة' },
  'estimator.estimatedBudget': { en: 'Estimated Investment Range', ar: 'الميزانية التقديرية' },
  'estimator.estimatedTimeline': { en: 'Estimated Delivery Timeline', ar: 'الجدول الزمني التقديري' },
  'estimator.submitQuote': { en: 'Request Formal Engineering Proposal', ar: 'طلب عرض فني ومالي رسمي' },

  // Portfolio
  'portfolio.badge': { en: 'Proven Track Record', ar: 'سجل إنجازاتنا' },
  'portfolio.title': { en: 'Featured Enterprise Case Studies', ar: 'أحدث المشاريع ودراسات الحالة' },
  'portfolio.sub': {
    en: 'Explore mission-critical ERPs, cloud deployments, and mobile applications engineered by our software house.',
    ar: 'استعرض نماذج حية من أنظمة الـ ERP، البنى السحابية وتطبيقات الجوال التي تم إنجازها لعملائنا.'
  },
  'portfolio.all': { en: 'All Systems', ar: 'جميع الأنظمة' },
  'portfolio.web': { en: 'Web Applications', ar: 'تطبيقات الويب' },
  'portfolio.cloud': { en: 'Cloud & Servers', ar: 'السيرفرات والسحابة' },
  'portfolio.mobile': { en: 'iOS & Android', ar: 'تطبيقات الجوال' },
  'portfolio.wordpress': { en: 'WordPress & CMS', ar: 'ووردبريس' },
  'portfolio.erp': { en: 'Odoo & ERPs', ar: 'أودو و ERP' },
  'portfolio.others': { en: 'Others', ar: 'أخرى' },
  'portfolio.viewDetails': { en: 'View Case Study', ar: 'تفاصيل دراسة الحالة' },
  'portfolio.client': { en: 'Client', ar: 'العميل' },
  'portfolio.metrics': { en: 'Key Impact Metrics', ar: 'مؤشرات الأثر والأداء' },

  // Reviews
  'reviews.badge': { en: 'Organic Reputation', ar: 'تقييمات موثقة' },
  'reviews.title': { en: 'Client Reviews & Google Business Rating', ar: 'آراء عملائنا وتقييمات جوجل المعتمدة' },
  'reviews.sub': {
    en: 'Real feedback directly synced from verified Google Business Profile and enterprise stakeholders.',
    ar: 'آراء حقيقية متصلة ومزامنة مباشرة مع الملف المعتمد على Google Business Profile.'
  },
  'reviews.googleRating': { en: 'Google Business Rating', ar: 'تقييم حساب جوجل للأنشطة' },
  'reviews.verifiedGoogle': { en: 'Posted on Google Reviews', ar: 'تم النشر عبر Google Reviews' },
  'reviews.writeReview': { en: 'Write a Review on Google', ar: 'اكتب تقييماً على جوجل' },
  'reviews.syncedStatus': { en: 'Live Sync Active', ar: 'مزامنة حية نشطة' },

  // Tech Stack
  'tech.badge': { en: 'Enterprise Technologies', ar: 'ترسانتنا التقنية' },
  'tech.title': { en: 'Modern, Scalable & Battle-Tested', ar: 'تقنيات حديثة ومختبرة في بيئات الإنتاج' },
  'tech.sub': {
    en: 'We leverage the most resilient programming languages, cloud frameworks, and databases for top-tier software delivery.',
    ar: 'نعتمد على أقوى لغات البرمجة، المنصات السحابية وقواعد البيانات لضمان أقصى درجات الاستقرار والتوسع.'
  },

  // Contact
  'contact.badge': { en: 'Let’s Build Together', ar: 'ابدأ مشروعك معنا' },
  'contact.title': { en: 'Schedule a Free Engineering Consultation', ar: 'احجز جلسة استشارية فنية مجانية' },
  'contact.sub': {
    en: 'Have an upcoming ERP migration, server challenge, or new custom app? Speak directly with our lead architects.',
    ar: 'هل تخطط لنظام ERP، أو تحتاج إدارة لسيرفراتك، أو بناء تطبيق جديد؟ تحدث مباشرة مع كبار مهندسينا.'
  },
  'contact.fullName': { en: 'Full Name', ar: 'الاسم الكامل' },
  'contact.email': { en: 'Work Email Address', ar: 'البريد الإلكتروني للعمل' },
  'contact.phone': { en: 'Phone / WhatsApp', ar: 'رقم الهاتف / واتساب' },
  'contact.company': { en: 'Company / Organization', ar: 'اسم الشركة أو المؤسسة' },
  'contact.serviceType': { en: 'Primary Service Needed', ar: 'الخدمة الأساسية المطلوبة' },
  'contact.budget': { en: 'Project Budget Bracket', ar: 'الميزانية التقريبية' },
  'contact.message': { en: 'Project Overview & Requirements', ar: 'تفاصيل ومتطلبات المشروع' },
  'contact.send': { en: 'Submit Engineering Inquiry', ar: 'إرسال الطلب للاستشاريين' },
  'contact.success': { en: 'Inquiry Submitted Successfully! Our engineering team will contact you within 4 hours.', ar: 'تم إرسال طلبك بنجاح! سيتواصل معك مهندسونا في غضون 4 ساعات.' },

  // Admin
  'admin.title': { en: 'Nexora Systems Command Center', ar: 'مركز إدارة نيكسورا للأنظمة' },
  'admin.passcode': { en: 'Enter Admin Passcode', ar: 'أدخل كلمة مرور الإدارة' },
  'admin.login': { en: 'Authenticate', ar: 'تسجيل الدخول' },
  'admin.logout': { en: 'Sign Out', ar: 'تسجيل الخروج' },
  'admin.tabProjects': { en: 'Manage Projects', ar: 'إدارة المشاريع' },
  'admin.tabReviews': { en: 'Manage Reviews & Google Sync', ar: 'إدارة التقييمات ومزامنة جوجل' },
  'admin.tabLeads': { en: 'Inquiries & Proposals', ar: 'الطلبات وعروض الأسعار' },
  'admin.addProject': { en: 'Add New Project', ar: 'إضافة مشروع جديد' },
  'admin.addReview': { en: 'Add Client Review', ar: 'إضافة تقييم عميل' },
  'admin.syncGoogle': { en: 'Trigger Google Reviews Sync', ar: 'تفعيل مزامنة تقييمات جوجل' },
  'admin.resetData': { en: 'Reset to Factory Seed Data', ar: 'استعادة البيانات الافتراضية' },

  // Footer
  'footer.rights': { en: 'All rights reserved. Nexora Systems Technologies Inc.', ar: 'جميع الحقوق محفوظة. شركة نيكسورا سيستمز للتقنية.' },
  'footer.tagline': { en: 'Full-Spectrum Software Engineering, Cloud Architecture & Enterprise ERPs.', ar: 'هندسة برمجيات متكاملة، بنى سحابية وأنظمة مؤسسية متطورة.' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('nexora_lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'en';
  });

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    localStorage.setItem('nexora_lang', language);
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

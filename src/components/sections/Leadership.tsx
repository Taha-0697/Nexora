import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { TeamMember } from '../../types';
import { 
  Users2, 
  ShieldCheck, 
  ExternalLink,
  Loader2
} from 'lucide-react';

export const Leadership: React.FC = () => {
  const { language } = useLanguage();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/team');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setTeamMembers(data);
          }
        }
      } catch {
        // Will show empty state
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <section id="leadership" className="py-24 relative bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-sky-400 mb-4">
            <Users2 className="w-3.5 h-3.5" />
            <span>
              {language === 'ar' ? 'القيادة الهندسية وكبار المعماريين' : 'Engineering Leadership & Core Architects'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {language === 'ar'
              ? 'نهندس مشاريعك بعقول كبار الخبراء التقنيين'
              : 'Direct Senior Engineering Oversight'}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            {language === 'ar'
              ? 'كل نظام ERP وبوابة ومشرع رقمي تشرف عليه مباشرة قياداتنا التقنية العليا لضمان أعلى معايير الأمان والاستقرار وقابلية التوسع دون وسطاء.'
              : 'Every enterprise system and mission-critical portal is directly architected, reviewed, and steered by senior engineering leadership with verifiable enterprise pedigrees.'}
          </p>
        </div>

        {/* Leadership Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-indigo-500 dark:text-sky-400 animate-spin" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Loading team from database…</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Users2 className="w-10 h-10 text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {language === 'ar' ? 'لم يتم إضافة أعضاء فريق بعد.' : 'No team members added yet.'}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {language === 'ar' ? 'يمكن للمسؤول إضافة أعضاء الفريق من لوحة التحكم.' : 'The Super Admin can add team members from the Command Center.'}
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="glass-panel p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-sky-500/50 transition-all duration-300 group hover:-translate-y-1.5 flex flex-col justify-between shadow-xs hover:shadow-xl bg-white dark:bg-slate-900/80"
            >
              <div>
                {/* Avatar with Status Ring */}
                <div className="relative mb-5 mx-auto w-24 h-24 sm:w-28 sm:h-28">
                  <img
                    src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={member.name}
                    className="w-full h-full rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 group-hover:border-indigo-500 dark:group-hover:border-sky-400 transition-colors shadow-sm"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 dark:bg-sky-500 text-white flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Name & Role */}
                <div className="text-center mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-sky-400/90 mt-1">
                    {member.role}
                  </p>
                </div>

                {/* Bio (Confidential Company Names Protected) */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-center mb-6 line-clamp-4">
                  {member.bio}
                </p>
              </div>

              {/* LinkedIn CTA Button */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80">
                <a
                  href={member.linkedinUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-sky-300 text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer group/link"
                >
                  <svg className="w-3.5 h-3.5 text-[#0077B5] fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 1.54-1.54A1.54 1.54 0 0 0 6.46 5.7a1.54 1.54 0 0 0-1.54 1.52c0 .85.7 1.54 1.54 1.54m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                  </svg>
                  <span>{language === 'ar' ? 'الملف المهني الموثق' : 'Professional Profile'}</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover/link:opacity-100 transition-opacity" />
                </a>
              </div>

            </div>
          ))}
        </div>
        )}

      </div>
    </section>
  );
};

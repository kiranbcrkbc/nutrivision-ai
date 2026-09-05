import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-2.5 pointer-events-none" />
      <select
        value={i18n.language.substring(0, 2)}
        onChange={handleLanguageChange}
        className="text-xs font-medium py-1.5 pl-8 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-health-500 cursor-pointer shadow-sm"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="dark:bg-slate-900">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

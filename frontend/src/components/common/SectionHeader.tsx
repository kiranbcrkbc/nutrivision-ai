import React from 'react';

export interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  centered = false,
  className = '',
}) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center max-w-3xl mx-auto' : ''} ${className}`}>
      {badge && (
        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-health-700 bg-health-50 dark:bg-health-950/70 dark:text-health-300 rounded-full border border-health-200 dark:border-health-800 mb-3">
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2.5 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

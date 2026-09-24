import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface MedicalDisclaimerProps {
  variant?: 'banner' | 'card' | 'compact';
  className?: string;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({
  variant = 'banner',
  className = '',
}) => {
  const { t } = useTranslation();

  const disclaimerText = t(
    'disclaimer.bannerText',
    'Results provided by Vitamin Deficiency are AI-based preliminary assessments or possible indicators only. They are not medically certified diagnoses. Users should consult qualified healthcare professionals for medical diagnosis and treatment.'
  );

  if (variant === 'compact') {
    return (
      <div className={`flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 ${className}`}>
        <Info className="w-4 h-4 text-health-600 dark:text-health-400 flex-shrink-0 mt-0.5" />
        <span className="leading-relaxed">{disclaimerText}</span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 ${className}`}>
        <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300 font-semibold text-sm mb-1.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span>{t('disclaimer.title', 'Medical Safety & Educational Disclaimer')}</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
          {disclaimerText}
        </p>
      </div>
    );
  }

  // Default: Banner style
  return (
    <div className={`p-4 rounded-2xl bg-health-50/80 dark:bg-health-950/30 border border-health-200 dark:border-health-900/50 shadow-sm ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-health-100 dark:bg-health-900/50 text-health-700 dark:text-health-300 flex-shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-health-950 dark:text-health-200">
            {t('disclaimer.title', 'Important Medical Disclaimer')}
          </h4>
          <p className="text-xs sm:text-sm text-health-800/90 dark:text-health-300/80 mt-1 leading-relaxed">
            {disclaimerText}
          </p>
        </div>
      </div>
    </div>
  );
};

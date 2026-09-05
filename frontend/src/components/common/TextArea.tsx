import React from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  helperText,
  className = '',
  id,
  rows = 4,
  ...props
}, ref) => {
  const areaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={areaId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={areaId}
        rows={rows}
        className={`
          block w-full rounded-xl border sm:text-sm transition-colors duration-150
          py-2.5 px-3.5
          bg-white dark:bg-slate-900
          text-slate-900 dark:text-slate-100
          placeholder-slate-400 dark:placeholder-slate-500
          focus:outline-none focus:ring-2
          ${
            error
              ? 'border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 focus:ring-rose-500 focus:border-rose-500'
              : 'border-slate-300 dark:border-slate-700 focus:ring-health-500 focus:border-health-500'
          }
          disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>}
      {!error && helperText && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
});

TextArea.displayName = 'TextArea';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  helperText,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        <select
          ref={ref}
          id={selectId}
          className={`
            block w-full rounded-xl border sm:text-sm appearance-none transition-colors duration-150
            py-2.5 pl-3.5 pr-10
            bg-white dark:bg-slate-900
            text-slate-900 dark:text-slate-100
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
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled} className="dark:bg-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>}
      {!error && helperText && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
});

Select.displayName = 'Select';

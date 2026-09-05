import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            block w-full rounded-xl border sm:text-sm transition-colors duration-150
            py-2.5 px-3.5
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
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
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>}
      {!error && helperText && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';

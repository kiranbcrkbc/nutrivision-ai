import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverable = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm',
    elevated: 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md dark:shadow-slate-950/50',
    bordered: 'bg-transparent border border-slate-200 dark:border-slate-800',
    glass: 'glass-panel shadow-glass dark:shadow-glass-dark',
  };

  const hoverStyle = hoverable ? 'transition-all duration-200 hover:shadow-md hover:border-health-300 dark:hover:border-health-700/60 hover:-translate-y-0.5' : '';

  return (
    <div
      className={`rounded-2xl overflow-hidden ${variantStyles[variant]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-semibold text-slate-900 dark:text-slate-100 ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);

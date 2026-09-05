import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  count = 1,
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  const elements = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${variantStyles[variant]} ${className}`}
    />
  ));

  return count === 1 ? elements[0] : <div className="space-y-2.5">{elements}</div>;
};

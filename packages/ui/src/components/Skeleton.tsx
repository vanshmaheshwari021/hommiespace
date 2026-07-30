import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text'
}) => {
  const baseStyle = 'bg-brand-sand-dark/20 animate-pulse';
  
  const variants = {
    text: 'h-4 w-full rounded-sm',
    rect: 'h-32 w-full rounded-none',
    circle: 'rounded-full'
  };

  return <div className={`${baseStyle} ${variants[variant]} ${className}`} />;
};

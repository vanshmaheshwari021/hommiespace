import React from 'react';
import { Button } from './Button.js';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-brand-sand-dark/30 bg-brand-linen/40 max-w-lg mx-auto my-8">
      {icon && <div className="mb-4 text-brand-clay">{icon}</div>}
      <h3 className="font-serif text-lg text-brand-walnut mb-2 tracking-wide font-bold">{title}</h3>
      <p className="text-brand-clay text-sm mb-6 max-w-sm font-sans leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

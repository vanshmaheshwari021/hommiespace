import React, { useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = ''
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-brand-charcoal/45 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative bg-brand-linen border border-brand-sand-dark/30 max-w-lg w-full p-8 shadow-2xl transition-all duration-300 z-10 rounded-none max-h-[90vh] overflow-y-auto animate-scale-in ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {title && <h3 className="font-serif text-lg text-brand-walnut font-bold tracking-wide">{title}</h3>}
          <button 
            onClick={onClose}
            className="text-brand-clay hover:text-brand-walnut transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Body */}
        <div className="text-brand-walnut">{children}</div>
      </div>
    </div>
  );
};

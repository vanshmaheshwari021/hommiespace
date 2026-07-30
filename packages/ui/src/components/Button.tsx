import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-serif tracking-wider uppercase transition-all duration-300 transform active:scale-95 focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-none text-xs font-semibold';
    
    const variants = {
      primary: 'bg-brand-walnut text-brand-linen hover:bg-brand-charcoal hover:shadow-md hover:-translate-y-[1px] active:translate-y-0',
      secondary: 'bg-brand-terracotta text-brand-linen hover:bg-opacity-90 hover:shadow-md hover:-translate-y-[1px] active:translate-y-0',
      outline: 'border border-brand-walnut text-brand-walnut hover:bg-brand-walnut hover:text-brand-linen hover:-translate-y-[1px] active:translate-y-0',
      ghost: 'text-brand-walnut hover:bg-brand-sand-light hover:-translate-y-[1px] active:translate-y-0'
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-[10px]',
      md: 'px-6 py-3',
      lg: 'px-8 py-4 text-sm'
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

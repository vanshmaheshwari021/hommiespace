import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  hoverEffect?: boolean;
  border?: boolean;
  flat?: boolean;
  children?: React.ReactNode;
}

export const Card = ({
  className = '',
  hoverEffect = true,
  border = true,
  flat = false,
  children,
  ...props
}: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse position ratios from 0 to 1
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Map coordinate ratios to 3D rotation angles with smooth springs
  const rotateXSpring = useSpring(useTransform(y, [0, 1], [8, -8]), { damping: 22, stiffness: 220 });
  const rotateYSpring = useSpring(useTransform(x, [0, 1], [-8, 8]), { damping: 22, stiffness: 220 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverEffect || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    if (!hoverEffect) return;
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: hoverEffect ? rotateXSpring : 0,
        rotateY: hoverEffect ? rotateYSpring : 0,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`bg-brand-linen dark:bg-brand-charcoal/40 rounded-none overflow-hidden transition-all duration-300
        ${border ? 'border border-brand-sand-dark/25 dark:border-brand-sand-dark/10' : ''} 
        ${flat ? '' : 'shadow-[0_4px_20px_-4px_rgba(61,46,38,0.05)]'}
        ${hoverEffect ? 'hover:shadow-[0_16px_36px_-8px_rgba(61,46,38,0.15)] hover:border-brand-sand-dark/50 dark:hover:border-brand-terracotta/30' : ''} 
        ${className}`}
      {...props}
    >
      <div style={{ transform: 'translateZ(15px)', transformStyle: 'preserve-3d' }} className="h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
};

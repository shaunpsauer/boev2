'use client';

import type { HTMLAttributes, ReactNode } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  icon?: ReactNode;
  children: ReactNode;
}

export function Badge({ 
  variant = 'default', 
  size = 'md',
  icon,
  className = '', 
  children, 
  ...props 
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full';

  const variantStyles = {
    default: 'bg-[#F1F5F9] text-[#64748B]',
    success: 'bg-[#DCFCE7] text-[#166534]',
    warning: 'bg-[#FEF3C7] text-[#92400E]',
    error: 'bg-[#FEE2E2] text-[#991B1B]',
    info: 'bg-[#DBEAFE] text-[#1E40AF]',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

export default Badge;

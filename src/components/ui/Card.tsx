'use client';

import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Card({ 
  variant = 'default', 
  padding = 'md',
  className = '', 
  children, 
  ...props 
}: CardProps) {
  const baseStyles = 'rounded-lg';

  const variantStyles = {
    default: 'bg-white border border-[#E2E8F0]',
    outlined: 'bg-transparent border border-[#E2E8F0]',
    filled: 'bg-[#F8FAFC]',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ 
  title, 
  subtitle, 
  action,
  className = '', 
  ...props 
}: CardHeaderProps) {
  return (
    <div 
      className={`flex items-start justify-between ${className}`} 
      {...props}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-[#1E293B]">{title}</h3>
        {subtitle && (
          <p className="text-xs text-[#64748B]">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardContent({ 
  className = '', 
  children, 
  ...props 
}: CardContentProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export default Card;

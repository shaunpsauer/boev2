'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  suffix?: string;
  prefix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, suffix, prefix, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="text-xs font-medium text-[#64748B]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 text-sm text-[#64748B]">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full h-10 px-3 
              ${prefix ? 'pl-8' : ''} 
              ${suffix ? 'pr-12' : ''}
              bg-white border border-[#E2E8F0] rounded-lg
              text-sm text-[#1E293B]
              placeholder:text-[#94A3B8]
              focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent
              disabled:bg-[#F8FAFC] disabled:text-[#94A3B8] disabled:cursor-not-allowed
              ${error ? 'border-red-500 focus:ring-red-500' : ''}
              ${className}
            `}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 text-sm text-[#64748B]">
              {suffix}
            </span>
          )}
        </div>
        {error && (
          <span className="text-xs text-red-500">{error}</span>
        )}
        {hint && !error && (
          <span className="text-xs text-[#94A3B8]">{hint}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

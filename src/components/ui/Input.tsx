'use client';

import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, icon, id, onFocus, onBlur, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            onBlur?.(e);
        };

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            'block text-sm font-medium mb-2 transition-colors duration-200',
                            isFocused ? 'text-[var(--accent-primary)]' : 'text-[var(--foreground)]'
                        )}
                    >
                        {label}
                        {props.required && (
                            <span className="text-[var(--accent-error)] ml-1">*</span>
                        )}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className={cn(
                            'w-full h-12 px-4 rounded-xl',
                            'bg-[var(--background-surface)]',
                            'text-[var(--foreground)]',
                            'placeholder:text-[var(--foreground-muted)]',
                            'border-2 transition-all duration-200',
                            'shadow-sm',
                            'focus:outline-none focus:shadow-md',
                            icon && 'pl-12',
                            error
                                ? 'border-[var(--accent-error)] focus:border-[var(--accent-error)] focus:shadow-[var(--accent-error)]/10'
                                : 'border-[var(--border)] hover:border-[var(--border-strong)] focus:border-[var(--accent-primary)] focus:shadow-[var(--accent-primary)]/10',
                            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--background-elevated)]',
                            className
                        )}
                        {...props}
                    />
                    {/* Focus glow effect */}
                    <div
                        className={cn(
                            'absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300',
                            'bg-gradient-to-r from-[var(--accent-primary)]/5 to-transparent',
                            isFocused ? 'opacity-100' : 'opacity-0'
                        )}
                    />
                </div>
                {error && (
                    <p className="mt-2 text-sm text-[var(--accent-error)] flex items-center gap-1.5 animate-fade-in">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p className="mt-2 text-sm text-[var(--foreground-muted)]">{hint}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };

'use client';

import { forwardRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    hint?: string;
    options: SelectOption[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, hint, options, id, onFocus, onBlur, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);
        const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

        const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
            setIsFocused(true);
            onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
            setIsFocused(false);
            onBlur?.(e);
        };

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={selectId}
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
                    <select
                        ref={ref}
                        id={selectId}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className={cn(
                            'w-full h-12 px-4 pr-10 rounded-xl appearance-none',
                            'bg-[var(--background-surface)]',
                            'text-[var(--foreground)]',
                            'border-2 transition-all duration-200',
                            'shadow-sm cursor-pointer',
                            'focus:outline-none focus:shadow-md',
                            error
                                ? 'border-[var(--accent-error)] focus:border-[var(--accent-error)]'
                                : 'border-[var(--border)] hover:border-[var(--border-strong)] focus:border-[var(--accent-primary)] focus:shadow-[var(--accent-primary)]/10',
                            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--background-elevated)]',
                            className
                        )}
                        {...props}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)] pointer-events-none" />
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

Select.displayName = 'Select';

export { Select };

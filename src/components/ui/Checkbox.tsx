'use client';

import { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    description?: string;
    onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, description, checked, onCheckedChange, onChange, id, ...props }, ref) => {
        const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e);
            onCheckedChange?.(e.target.checked);
        };

        return (
            <label
                htmlFor={checkboxId}
                className={cn(
                    'group flex items-start gap-3 cursor-pointer select-none',
                    props.disabled && 'cursor-not-allowed opacity-50',
                    className
                )}
            >
                <div className="relative mt-0.5">
                    <input
                        ref={ref}
                        type="checkbox"
                        id={checkboxId}
                        checked={checked}
                        onChange={handleChange}
                        className="sr-only peer"
                        {...props}
                    />
                    {/* Checkbox background */}
                    <div
                        className={cn(
                            'w-6 h-6 rounded-lg border-2 flex items-center justify-center',
                            'transition-all duration-200 ease-out',
                            'group-hover:border-[var(--accent-primary)]',
                            checked
                                ? 'bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] border-transparent shadow-md shadow-[var(--accent-primary)]/30'
                                : 'bg-[var(--background-surface)] border-[var(--border-strong)]'
                        )}
                    >
                        <Check
                            className={cn(
                                'w-4 h-4 text-white transition-all duration-200',
                                checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                            )}
                            strokeWidth={3}
                        />
                    </div>
                    {/* Glow effect on check */}
                    <div
                        className={cn(
                            'absolute inset-0 rounded-lg transition-opacity duration-300',
                            'bg-[var(--accent-primary)]/20 blur-md',
                            checked ? 'opacity-100' : 'opacity-0'
                        )}
                    />
                </div>
                {(label || description) && (
                    <div className="flex-1">
                        {label && (
                            <span className={cn(
                                'text-[var(--foreground)] font-medium transition-colors duration-200',
                                checked && 'text-[var(--accent-primary)]'
                            )}>
                                {label}
                            </span>
                        )}
                        {description && (
                            <p className="text-sm text-[var(--foreground-muted)] mt-0.5">
                                {description}
                            </p>
                        )}
                    </div>
                )}
            </label>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };

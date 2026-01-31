'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'success' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    glow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, glow = false, children, disabled, ...props }, ref) => {
        const baseStyles = `
      relative inline-flex items-center justify-center font-medium 
      transition-all duration-200 ease-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]
      disabled:pointer-events-none disabled:opacity-50
      active:scale-[0.97] 
      overflow-hidden
    `;

        const variants = {
            primary: `
        bg-gradient-to-r from-[var(--accent-primary)] to-[#8b5cf6]
        text-white 
        shadow-md shadow-[var(--accent-primary)]/20
        hover:shadow-lg hover:shadow-[var(--accent-primary)]/30
        hover:brightness-110
        focus-visible:ring-[var(--accent-primary)]
      `,
            secondary: `
        bg-[var(--background-elevated)] 
        text-[var(--foreground)] 
        border border-[var(--border)]
        hover:bg-[var(--border)] hover:border-[var(--border-strong)]
        shadow-sm
      `,
            ghost: `
        text-[var(--foreground-secondary)] 
        hover:text-[var(--foreground)]
        hover:bg-[var(--background-elevated)]
      `,
            outline: `
        border-2 border-[var(--accent-primary)]
        text-[var(--accent-primary)]
        hover:bg-[var(--accent-primary-light)]
      `,
            destructive: `
        bg-gradient-to-r from-[var(--accent-error)] to-[#f87171]
        text-white 
        shadow-md shadow-[var(--accent-error)]/20
        hover:shadow-lg hover:shadow-[var(--accent-error)]/30
        hover:brightness-110
        focus-visible:ring-[var(--accent-error)]
      `,
            success: `
        bg-gradient-to-r from-[var(--accent-success)] to-[#34d399]
        text-white 
        shadow-md shadow-[var(--accent-success)]/20
        hover:shadow-lg hover:shadow-[var(--accent-success)]/30
        hover:brightness-110
        focus-visible:ring-[var(--accent-success)]
      `,
        };

        const sizes = {
            sm: 'h-9 px-4 text-sm gap-1.5 rounded-xl',
            md: 'h-11 px-5 text-sm gap-2 rounded-xl',
            lg: 'h-13 px-7 text-base gap-2.5 rounded-2xl',
            icon: 'h-11 w-11 rounded-xl',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    glow && 'animate-glow',
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {/* Shimmer effect on hover */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700" />

                {isLoading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                ) : null}
                <span className={cn(isLoading && 'opacity-0')}>{children}</span>
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };

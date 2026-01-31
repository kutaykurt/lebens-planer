'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'glass' | 'gradient' | 'outline';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    glow?: 'none' | 'primary' | 'success' | 'warning';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', padding = 'md', hover = false, glow = 'none', children, ...props }, ref) => {
        const variants = {
            default: `
        bg-[var(--background-surface)]
        border border-[var(--border)]
        shadow-sm
      `,
            elevated: `
        bg-[var(--gradient-card)]
        border border-[var(--border)]
        shadow-md
      `,
            glass: `
        glass
        shadow-lg
      `,
            gradient: `
        bg-gradient-to-br from-[var(--accent-primary)]/5 via-transparent to-[var(--accent-success)]/5
        border border-[var(--border)]
        shadow-sm
      `,
            outline: `
        bg-transparent
        border-2 border-dashed border-[var(--border)]
      `,
        };

        const paddings = {
            none: '',
            sm: 'p-4',
            md: 'p-5',
            lg: 'p-6',
        };

        const glowStyles = {
            none: '',
            primary: 'shadow-[var(--shadow-glow-primary)]',
            success: 'shadow-[var(--shadow-glow-success)]',
            warning: 'shadow-[0_0_40px_var(--accent-warning-glow)]',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl transition-all duration-300 relative overflow-hidden',
                    variants[variant],
                    paddings[padding],
                    glowStyles[glow],
                    hover && `
            cursor-pointer 
            hover:border-[var(--border-strong)] 
            hover:shadow-lg 
            hover:-translate-y-1
            active:scale-[0.99] active:translate-y-0
          `,
                    className
                )}
                {...props}
            >
                {/* Top shine effect for elevated cards */}
                {(variant === 'elevated' || variant === 'glass') && (
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                )}
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

// Card Header
const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex flex-col gap-1.5 mb-4', className)}
            {...props}
        />
    )
);
CardHeader.displayName = 'CardHeader';

// Card Title
const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn('text-lg font-semibold text-[var(--foreground)] tracking-tight', className)}
            {...props}
        />
    )
);
CardTitle.displayName = 'CardTitle';

// Card Description
const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn('text-sm text-[var(--foreground-secondary)] leading-relaxed', className)}
            {...props}
        />
    )
);
CardDescription.displayName = 'CardDescription';

// Card Content
const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('', className)}
            {...props}
        />
    )
);
CardContent.displayName = 'CardContent';

// Card Footer
const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex items-center gap-3 pt-4 mt-4 border-t border-[var(--border-subtle)]', className)}
            {...props}
        />
    )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

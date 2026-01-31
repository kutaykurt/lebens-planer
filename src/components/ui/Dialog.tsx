'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface DialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: ReactNode;
    className?: string;
    showCloseButton?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function Dialog({
    open,
    onClose,
    title,
    description,
    children,
    className,
    showCloseButton = true,
    size = 'md',
}: DialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    // Lock body scroll when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    // Focus trap
    useEffect(() => {
        if (open && dialogRef.current) {
            dialogRef.current.focus();
        }
    }, [open]);

    if (!open) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fade-in"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Dialog */}
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'dialog-title' : undefined}
                aria-describedby={description ? 'dialog-description' : undefined}
                tabIndex={-1}
                className={cn(
                    'relative z-10 w-full',
                    sizes[size],
                    'bg-[var(--background-surface)]',
                    'rounded-3xl',
                    'shadow-2xl',
                    'border border-[var(--border)]',
                    'animate-fade-in-scale',
                    'max-h-[90vh] overflow-hidden flex flex-col',
                    className
                )}
            >
                {/* Top shine */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-start justify-between p-6 pb-0">
                        <div className="flex-1 pr-4">
                            {title && (
                                <h2
                                    id="dialog-title"
                                    className="text-xl font-semibold text-[var(--foreground)] tracking-tight"
                                >
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p
                                    id="dialog-description"
                                    className="mt-1.5 text-sm text-[var(--foreground-secondary)] leading-relaxed"
                                >
                                    {description}
                                </p>
                            )}
                        </div>
                        {showCloseButton && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="shrink-0 -mr-2 -mt-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                                aria-label="Schließen"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">{children}</div>
            </div>
        </div>
    );
}

// Dialog Footer for action buttons
export function DialogFooter({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'flex items-center justify-end gap-3 pt-6 mt-2',
                className
            )}
        >
            {children}
        </div>
    );
}

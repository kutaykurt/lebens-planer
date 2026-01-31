'use client';

import { useEffect, useState } from 'react';
import { X, Check, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastItemProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const duration = toast.duration || 4000;
        const exitDelay = duration - 300;

        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, exitDelay);

        const removeTimer = setTimeout(() => {
            onRemove(toast.id);
        }, duration);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(removeTimer);
        };
    }, [toast, onRemove]);

    const icons = {
        success: Check,
        error: AlertCircle,
        info: Info,
        warning: AlertTriangle,
    };

    const styles = {
        success: 'from-[var(--accent-success)] to-[#34d399]',
        error: 'from-[var(--accent-error)] to-[#f87171]',
        info: 'from-[var(--accent-primary)] to-[#8b5cf6]',
        warning: 'from-[var(--accent-warning)] to-[#fbbf24]',
    };

    const glowStyles = {
        success: 'shadow-[var(--accent-success)]/30',
        error: 'shadow-[var(--accent-error)]/30',
        info: 'shadow-[var(--accent-primary)]/30',
        warning: 'shadow-[var(--accent-warning)]/30',
    };

    const Icon = icons[toast.type];

    return (
        <div
            className={cn(
                'flex items-center gap-3 px-4 py-3.5 rounded-2xl text-white',
                'bg-gradient-to-r shadow-lg',
                styles[toast.type],
                glowStyles[toast.type],
                'backdrop-blur-sm',
                isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'
            )}
            role="alert"
        >
            {/* Icon with background */}
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
            </div>

            <p className="flex-1 text-sm font-medium pr-2">{toast.message}</p>

            <button
                onClick={() => onRemove(toast.id)}
                className="shrink-0 w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Schließen"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-3 max-w-sm">
            {toasts.map((toast, index) => (
                <div key={toast.id} style={{ animationDelay: `${index * 50}ms` }}>
                    <ToastItem toast={toast} onRemove={onRemove} />
                </div>
            ))}
        </div>
    );
}

// Toast Hook & API
let toastId = 0;
let listeners: Array<(toasts: Toast[]) => void> = [];
let toastsState: Toast[] = [];

function emitChange() {
    listeners.forEach((listener) => listener(toastsState));
}

export function toast(type: ToastType, message: string, duration?: number) {
    const id = String(++toastId);
    toastsState = [...toastsState, { id, type, message, duration }];
    emitChange();
    return id;
}

toast.success = (message: string, duration?: number) => toast('success', message, duration);
toast.error = (message: string, duration?: number) => toast('error', message, duration);
toast.info = (message: string, duration?: number) => toast('info', message, duration);
toast.warning = (message: string, duration?: number) => toast('warning', message, duration);

export function useToasts() {
    const [toasts, setToasts] = useState<Toast[]>(toastsState);

    useEffect(() => {
        listeners.push(setToasts);
        return () => {
            listeners = listeners.filter((l) => l !== setToasts);
        };
    }, []);

    const removeToast = (id: string) => {
        toastsState = toastsState.filter((t) => t.id !== id);
        emitChange();
    };

    return { toasts, removeToast };
}

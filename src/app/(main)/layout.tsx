'use client';

import { useState, ReactNode } from 'react';
import { Header, BottomNav, PageContainer } from '@/components/layout';
import { ToastContainer, useToasts } from '@/components/ui';
import { useUIStore, useLifeOSStore, useHydration } from '@/stores';
import { GlobalQuickAddDialog } from '@/components/features/GlobalQuickAddDialog';
import { CelebrationOverlay } from '@/components/features/CelebrationOverlay';
import { toast } from '@/components/ui/Toast';
import { useEffect } from 'react';

// Local QuickAddDialog removed in favor of GlobalQuickAddDialog

export default function MainLayout({ children }: { children: ReactNode }) {
    const isHydrated = useHydration();
    const refreshMasterStreak = useLifeOSStore((s) => s.refreshMasterStreak);
    const { toasts, removeToast } = useToasts();
    const openQuickAdd = useUIStore((s) => s.openQuickAdd);

    useEffect(() => {
        if (isHydrated) {
            refreshMasterStreak();
        }
    }, [isHydrated, refreshMasterStreak]);

    if (!isHydrated) {
        return (
            <div suppressHydrationWarning className="min-h-screen bg-[var(--background)] animate-pulse" />
        );
    }

    return (
        <>
            <Header onQuickAdd={openQuickAdd} />
            {children}
            <BottomNav />
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            <GlobalQuickAddDialog />
            <CelebrationOverlay />
        </>
    );
}

'use client';

import { useState, ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ToastContainer, useToasts } from '@/components/ui';
import { useUIStore } from '@/stores';
import { FloatingActionMenu } from '@/components/layout/FloatingActionMenu';
import { GlobalQuickAddDialog } from '@/components/features/GlobalQuickAddDialog';
import { CelebrationOverlay } from '@/components/features/CelebrationOverlay';
import { toast } from '@/components/ui/Toast';

// Local QuickAddDialog removed in favor of GlobalQuickAddDialog

export default function MainLayout({ children }: { children: ReactNode }) {
    const { toasts, removeToast } = useToasts();
    const openQuickAdd = useUIStore((s) => s.openQuickAdd);

    return (
        <>
            <Header onQuickAdd={openQuickAdd} />
            {children}
            <FloatingActionMenu />
            <BottomNav />
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            <GlobalQuickAddDialog />
            <CelebrationOverlay />
        </>
    );
}

'use client';

import { useState } from 'react';
import {
    Target, Repeat, Folder, LayoutGrid,
    Sparkles, Rocket, Zap, ChevronRight
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import HabitsPage from '../habits/page';
import GoalsPage from '../goals/page';
import ProjectsPage from '../projects/page';

type FocusTab = 'projects' | 'goals' | 'habits';

export default function FocusHubPage() {
    const [activeTab, setActiveTab] = useState<FocusTab>('projects');

    const tabs = [
        { id: 'projects', label: 'Projekte', icon: Folder, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: 'goals', label: 'Ziele', icon: Target, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { id: 'habits', label: 'Routinen', icon: Repeat, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ];

    return (
        <PageContainer width="wide">
            {/* ─── HEADER ────────────────────────────────────────────────────────── */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <Rocket className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tighter uppercase italic">
                            Fokus-<span className="text-indigo-500">Terminal</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--foreground-muted)]">
                            Operation: Strategic Alignment
                        </p>
                    </div>
                </div>
            </div>

            {/* ─── TAB NAVIGATION ────────────────────────────────────────────────── */}
            <div className="flex p-1.5 bg-[var(--background-surface)] border border-[var(--border)] rounded-[2rem] mb-10 shadow-inner max-w-2xl mx-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as FocusTab)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all duration-500 relative overflow-hidden group",
                                isActive
                                    ? "bg-white dark:bg-zinc-800 text-[var(--foreground)] shadow-xl scale-[1.02]"
                                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                            )}
                        >
                            <Icon className={cn("w-4 h-4 transition-transform duration-500", isActive ? "scale-110" : "group-hover:scale-110")} />
                            {tab.label}
                            {isActive && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ─── CONTENT ────────────────────────────────────────────────────────── */}
            <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700">
                {activeTab === 'projects' && (
                    <div className="focus-section-wrapper">
                        <ProjectsPage />
                    </div>
                )}
                {activeTab === 'goals' && (
                    <div className="focus-section-wrapper">
                        <GoalsPage />
                    </div>
                )}
                {activeTab === 'habits' && (activeTab === 'habits' && (
                    <div className="focus-section-wrapper">
                        <HabitsPage />
                    </div>
                ))}
            </div>

            <style jsx global>{`
                /* Hide nested PageContainers and headers to avoid double nesting layout */
                .focus-section-wrapper .page-container-inner {
                    padding-top: 0 !important;
                }
                /* We might need to hide the H1s in the subpages if they are too redundant */
                /* But for now let's see how it looks */
            `}</style>
        </PageContainer>
    );
}

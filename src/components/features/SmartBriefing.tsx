'use client';

import { useMemo } from 'react';
import { Sparkles, ArrowRight, Target, Flame } from 'lucide-react';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useLifeOSStore, useTodaysTasks } from '@/stores';
import { getToday } from '@/lib/utils';

const WISDOM = [
    "Das Geheimnis des Vorwärtskommens besteht darin, den ersten Schritt zu tun.",
    "Konzentriere dich auf das Wesentliche, nicht auf das Dringliche.",
    "Eine Gewohnheit ist wie ein Seil – wir flechten jeden Tag einen Faden.",
    "Der beste Weg, die Zukunft vorherzusagen, ist, sie selbst zu gestalten.",
    "Kleine Siege führen zu großen Erfolgen. Fang heute klein an."
];

export function SmartBriefing({ compact = false }: { compact?: boolean }) {
    const todaysTasks = useTodaysTasks();
    const preferences = useLifeOSStore((s) => s.preferences);
    const firstName = preferences.name || "User";

    const briefing = useMemo(() => {
        const hour = new Date().getHours();
        let greeting = "Guten Morgen";
        if (hour >= 12) greeting = "Guten Tag";
        if (hour >= 18) greeting = "Guten Abend";

        const highPriority = todaysTasks.find(t => t.priority === 'high' && t.status === 'pending');
        const wisdom = WISDOM[Math.floor(Math.random() * WISDOM.length)];

        return {
            greeting,
            highPriority,
            wisdom
        };
    }, [todaysTasks]);

    if (compact) {
        return (
            <Card variant="default" padding="sm" className="h-full flex flex-col justify-center bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-none">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-wider mb-0.5">
                            {briefing.greeting}, {firstName}
                        </p>
                        <p className="text-sm font-medium text-[var(--foreground-muted)] line-clamp-1">
                            {todaysTasks.filter(t => t.status === 'pending').length} offene Aufgaben
                        </p>
                    </div>
                    {briefing.highPriority && (
                        <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center">
                            <Target className="w-4 h-4 text-[var(--accent-primary)]" />
                        </div>
                    )}
                </div>
            </Card>
        );
    }

    return (
        <Card variant="elevated" className="mb-6 relative overflow-hidden bg-gradient-to-br from-[var(--background-surface)] to-[var(--background-elevated)] border-none shadow-glow-primary/5">
            {/* Same as before... */}
            {/* Glossy background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-primary)]/5 rounded-full blur-3xl -mr-10 -mt-10" />

            <div className="relative p-6">
                <div className="flex items-center gap-2 text-[var(--accent-primary)] mb-4">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest">Smart Briefing</span>
                </div>

                <h2 className="text-2xl font-black text-[var(--foreground)] mb-2 tracking-tight">
                    {briefing.greeting}, {firstName}! ✨
                </h2>

                <p className="text-[var(--foreground-secondary)] italic text-sm mb-6 leading-relaxed">
                    "{briefing.wisdom}"
                </p>

                <div className="space-y-4">
                    {briefing.highPriority && (
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--accent-error-light)] border border-[var(--accent-error)]/10 group cursor-pointer transition-all hover:scale-[1.02]">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-black/20 flex items-center justify-center shadow-sm">
                                <Target className="w-5 h-5 text-[var(--accent-error)]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-[var(--accent-error)] uppercase tracking-wider mb-1">Prio-Fokus heute</p>
                                <p className="font-bold text-[var(--foreground)]">{briefing.highPriority.title}</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity self-center" />
                        </div>
                    )}

                    <div className="flex items-center gap-6 p-4 rounded-2xl bg-[var(--background-surface)] border border-[var(--border)]">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-wider">Erledigt</span>
                            <span className="text-xl font-black text-[var(--foreground)]">
                                {todaysTasks.filter(t => t.status === 'completed').length} / {todaysTasks.length}
                            </span>
                        </div>
                        <div className="w-px h-8 bg-[var(--border-subtle)]" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-wider">Aktive Serie</span>
                            <div className="flex items-center gap-1.5">
                                <Flame className="w-5 h-5 text-orange-500" />
                                <span className="text-xl font-black text-[var(--foreground)]">7 Tage</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

'use client';

import { useMemo, useState } from 'react';
import {
    Sparkles, Target, Zap, Flame, Wallet,
    TrendingUp, Trophy, ArrowRight, CheckCircle2,
    Calendar, Star, Heart
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, toast } from '@/components/ui';
import { useLifeOSStore, useHydration } from '@/stores';
import { generateWeeklyBriefing } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function WeeklyBriefingPage() {
    const tasks = useLifeOSStore((s) => s.tasks);
    const energyLogs = useLifeOSStore((s) => s.energyLogs);
    const habitLogs = useLifeOSStore((s) => s.habitLogs);
    const transactions = useLifeOSStore((s) => s.transactions);
    const addXP = useLifeOSStore((s) => s.addXP);
    const isHydrated = useHydration();

    const [hasClaimedXP, setHasClaimedXP] = useState(false);

    const briefing = useMemo(() => {
        return generateWeeklyBriefing(tasks, energyLogs, habitLogs, transactions);
    }, [tasks, energyLogs, habitLogs, transactions]);

    const handleClaimXP = () => {
        if (!hasClaimedXP) {
            addXP(100, 'mental');
            setHasClaimedXP(true);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#fbbf24', '#f59e0b', '#3b82f6']
            });
            toast.success('100 XP für dein wöchentliches Review erhalten! 🏆');
        }
    };

    if (!isHydrated) return null;

    return (
        <PageContainer>
            <div className="max-w-3xl mx-auto space-y-8 pb-20">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 text-sm font-black uppercase tracking-widest animate-fade-in">
                        <Sparkles className="w-4 h-4" />
                        KI-Wochenbericht
                    </div>
                    <h1 className="text-5xl font-black text-[var(--foreground)] tracking-tight">
                        Deine Woche im <span className="text-[var(--accent-primary)]">Fokus</span>
                    </h1>
                    <p className="text-[var(--foreground-secondary)] text-xl">
                        Hier ist deine Zusammenfassung der letzten 7 Tage.
                    </p>
                </div>

                {/* Score Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6 border-b-4 border-b-emerald-500">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)]">Produktivität</span>
                        </div>
                        <p className="text-4xl font-black text-[var(--foreground)]">{briefing.tasksCompleted}</p>
                        <p className="text-sm text-[var(--foreground-secondary)]">Tasks erledigt ({briefing.completionRate}%)</p>
                    </Card>

                    <Card className="p-6 border-b-4 border-b-amber-500">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-amber-500" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)]">Vitalität</span>
                        </div>
                        <p className="text-4xl font-black text-[var(--foreground)]">{briefing.avgEnergy}</p>
                        <p className="text-sm text-[var(--foreground-secondary)]">Ø Energie-Level</p>
                    </Card>

                    <Card className="p-6 border-b-4 border-b-indigo-500">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                <Flame className="w-6 h-6 text-indigo-500" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)]">Disziplin</span>
                        </div>
                        <p className="text-4xl font-black text-[var(--foreground)]">{briefing.habitConsistency}%</p>
                        <p className="text-sm text-[var(--foreground-secondary)]">Habit-Konsistenz</p>
                    </Card>
                </div>

                {/* Main Insight Section */}
                <Card className="p-8 bg-gradient-to-br from-[var(--background-surface)] to-[var(--background-elevated)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles className="w-32 h-32" />
                    </div>

                    <div className="relative space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)] flex items-center justify-center shadow-lg shadow-[var(--accent-primary)]/20">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-black text-[var(--foreground)]">Das Highlight der Woche</h2>
                        </div>

                        <p className="text-xl text-[var(--foreground)] leading-relaxed font-medium italic">
                            "{briefing.recommendation}"
                        </p>

                        <div className="flex items-center gap-6 pt-4 border-t border-[var(--border-subtle)]">
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-amber-500" />
                                <span className="text-sm font-bold">Bester Tag: {briefing.bestDay}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Finance Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-6">
                        <h3 className="font-bold flex items-center gap-2 mb-4 text-[var(--foreground-muted)]">
                            <Wallet className="w-4 h-4" /> Finanzen
                        </h3>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-sm text-[var(--foreground-secondary)] mb-1">Wochen-Ausgaben</p>
                                <p className="text-2xl font-black text-rose-500">-{briefing.totalExpenses}€</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-[var(--foreground-secondary)] mb-1">Einnahmen</p>
                                <p className="text-2xl font-black text-emerald-500">+{briefing.totalIncome}€</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-[var(--accent-primary)] text-white">
                        <h3 className="font-bold flex items-center gap-2 mb-4 opacity-80">
                            <Star className="w-4 h-4" /> Belohnung
                        </h3>
                        <p className="text-sm mb-4 opacity-90">Review abgeschlossen! Sichere dir deinen wöchentlichen XP-Bonus für deine Disziplin.</p>
                        <Button
                            className="w-full bg-white text-[var(--accent-primary)] hover:bg-white/90 font-black"
                            onClick={handleClaimXP}
                            disabled={hasClaimedXP}
                        >
                            {hasClaimedXP ? 'Bonus erhalten ✓' : '100 XP Sichern'}
                        </Button>
                    </Card>
                </div>

                {/* Footer Quote */}
                <div className="text-center pt-8">
                    <p className="text-[var(--foreground-muted)] italic font-serif">
                        "Der Erfolg von morgen beginnt mit der Reflexion von heute."
                    </p>
                    <Button
                        variant="ghost"
                        onClick={() => window.location.href = '/today'}
                        className="mt-6 gap-2"
                    >
                        Zurück zum Dashboard <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </PageContainer>
    );
}

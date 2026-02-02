'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Plus, Repeat, Flame, CheckCircle2, Sparkles,
    Calendar, TrendingUp, Zap, Trophy, Shield, Activity, ChevronRight
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Dialog, DialogFooter, Input, Select, Textarea, toast } from '@/components/ui';
import { useLifeOSStore, useActiveHabits, useHabitStreak, useIsHabitCompleted, useHydration } from '@/stores';
import { getToday, cn } from '@/lib/utils';
import type { Habit, HabitFrequency } from '@/types';

// ─── Streak Badge ────────────────────────────────────────────────────────────

function StreakBadge({ streak }: { streak: number }) {
    if (streak === 0) return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--background-elevated)] text-[var(--foreground-muted)] border border-[var(--border-subtle)] opacity-50">
            <Flame className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">0 Streak</span>
        </div>
    );

    const isHot = streak >= 7;
    const isFire = streak >= 30;

    return (
        <div className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] shadow-xl transition-all duration-500 hover:scale-110',
            isFire
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-500/30'
                : isHot
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-amber-500/20'
                    : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
        )}>
            <Flame className={cn('w-4 h-4', (isHot || isFire) && 'animate-pulse text-glow-white')} />
            <span>{streak} Tage Streak</span>
        </div>
    );
}

// ─── Habit Card Component ────────────────────────────────────────────────────

function HabitCard({ habit, index }: { habit: Habit; index: number }) {
    const today = getToday();
    const isCompleted = useIsHabitCompleted(habit.id, today);
    const streak = useHabitStreak(habit.id);
    const toggleHabit = useLifeOSStore((s) => s.toggleHabitForDate);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleHabit(habit.id, today);
        if (!isCompleted) {
            toast.success('Konsistenz-Parameter synchronisiert! 🔥');
        }
    };

    const frequencyLabel = {
        daily: 'Täglich',
        times_per_week: `${habit.targetCount}x pro Woche`,
        specific_days: 'Selektive Tage',
    }[habit.frequency];

    return (
        <Link href={`/habits/${habit.id}`} className="block">
            <Card
                variant="glass"
                className={cn(
                    'mb-6 group animate-fade-in-up p-8 rounded-[2.5rem] border-white/10 relative overflow-hidden',
                    'hover:bg-white/10 dark:hover:bg-slate-900/40 transition-all duration-500'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
            >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-indigo-500/10 transition-colors duration-700 pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
                    {/* Toggle Button / Status Indicator */}
                    <button
                        onClick={handleToggle}
                        className={cn(
                            'relative w-24 h-24 rounded-[2.5rem] flex flex-col items-center justify-center shrink-0 transition-all duration-500',
                            'hover:scale-105 active:scale-95 group/btn border-2',
                            isCompleted
                                ? 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-300 shadow-2xl shadow-emerald-500/30'
                                : 'bg-[var(--background-surface)] border-[var(--border-strong)] hover:border-indigo-500 shadow-xl'
                        )}
                    >
                        {isCompleted ? (
                            <>
                                <CheckCircle2 className="w-10 h-10 text-white animate-checkmark drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                                <span className="text-[8px] font-black uppercase text-white/80 mt-1 tracking-tighter">Done</span>
                            </>
                        ) : (
                            <>
                                <Zap className="w-8 h-8 text-[var(--foreground-muted)] group-hover/btn:text-indigo-500 group-hover/btn:animate-pulse transition-colors" />
                                <span className="text-[8px] font-black uppercase text-[var(--foreground-muted)] mt-1 tracking-tighter">Sync</span>
                            </>
                        )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div>
                                <h3 className={cn(
                                    "text-2xl font-black transition-all tracking-tighter uppercase italic",
                                    isCompleted ? "text-[var(--foreground-muted)]" : "text-[var(--foreground)]"
                                )}>
                                    {habit.title}
                                </h3>
                                <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                                    <div className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{frequencyLabel}</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-[var(--border)]" />
                                    <div className="flex items-center gap-1.5 text-indigo-500 uppercase">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-[10px] font-black tracking-widest">Optimal Flow</span>
                                    </div>
                                </div>
                            </div>

                            <StreakBadge streak={streak} />
                        </div>

                        {habit.description && (
                            <p className="text-sm text-[var(--foreground-secondary)] font-medium italic opacity-70 mb-4 line-clamp-1">
                                "{habit.description}"
                            </p>
                        )}

                        {/* Consistency Visualization (Simplified bar) */}
                        <div className="flex items-center gap-2">
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className={cn(
                                    "h-1.5 flex-1 rounded-full transition-all duration-700",
                                    i === 6 ? (isCompleted ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-[var(--border-strong)]") : "bg-indigo-500/20"
                                )} />
                            ))}
                        </div>
                    </div>

                    <ChevronRight className="hidden sm:block w-8 h-8 text-[var(--foreground-muted)] group-hover:text-indigo-500 group-hover:translate-x-2 transition-all" />
                </div>
            </Card>
        </Link>
    );
}

// ─── Add Habit Dialog ────────────────────────────────────────────────────────

function AddHabitDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [frequency, setFrequency] = useState<HabitFrequency>('daily');
    const [targetCount, setTargetCount] = useState(3);

    const addHabit = useLifeOSStore((s) => s.addHabit);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            addHabit({
                title: title.trim(),
                description: description.trim() || null,
                frequency,
                targetDays: frequency === 'specific_days' ? [1, 2, 3, 4, 5] : null,
                targetCount: frequency === 'times_per_week' ? targetCount : null,
                goalId: null,
            });
            toast.success('Consistency Lab Update: Neue Routine initialisiert! 🌱');
            setTitle('');
            setDescription('');
            setFrequency('daily');
            setTargetCount(3);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} title="Neue Routine initialisieren">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Routine-Identifikation"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="z.B. Digitaler Check-in"
                    autoFocus
                    required
                />

                <Textarea
                    label="Zweck & Begründung"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Warum ist diese Routine essenziell?"
                />

                <Select
                    label="Frequenz-Modus"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
                    options={[
                        { value: 'daily', label: 'Dauerschleife (Täglich)' },
                        { value: 'times_per_week', label: 'X-Soll pro Woche' },
                        { value: 'specific_days', label: 'Gezielte Tage' },
                    ]}
                />

                {frequency === 'times_per_week' && (
                    <Input
                        label="Soll-Frequenz"
                        type="number"
                        min={1}
                        max={7}
                        value={targetCount}
                        onChange={(e) => setTargetCount(Number(e.target.value))}
                    />
                )}

                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose} className="rounded-2xl h-12">
                        Abbrechen
                    </Button>
                    <Button type="submit" disabled={!title.trim()} className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl h-12 shadow-lg shadow-indigo-500/20 font-black uppercase tracking-widest">
                        Routine starten
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function HabitsPage() {
    const [showAddHabit, setShowAddHabit] = useState(false);
    const isHydrated = useHydration();
    const activeHabits = useActiveHabits();

    if (!isHydrated) {
        return (
            <PageContainer>
                <div className="animate-pulse space-y-8">
                    <div className="h-24 bg-[var(--background-elevated)] rounded-[2.5rem]" />
                    <div className="h-32 bg-[var(--background-elevated)] rounded-[2.5rem]" />
                    <div className="h-32 bg-[var(--background-elevated)] rounded-[2.5rem]" />
                </div>
            </PageContainer>
        );
    }

    const totalStreaks = activeHabits.reduce((acc, h) => {
        // This is a bit expensive in render if many habits, but fine for typical usage
        // Ideally we'd have a selector for this
        return acc + 1; // Placeholder for logic
    }, 0);

    return (
        <PageContainer>
            {/* Header / Consistency Dashboard */}
            <div className="relative mb-16">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
                    <div>
                        <div className="flex items-center gap-6 mb-4">
                            <div className="w-16 h-16 rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                                <Activity className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-[var(--foreground)] tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground-muted)]">
                                    Consistency-<span className="text-emerald-500">Lab</span>
                                </h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Operation: Neural Rewiring</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <Card variant="glass" className="p-6 rounded-[2rem] border-emerald-500/10 bg-emerald-500/5 backdrop-blur-xl">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-2">Tracking</p>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black tracking-tighter">{activeHabits.length}</span>
                                <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase mb-1.5">Routines</span>
                            </div>
                        </Card>

                        <Card variant="glass" className="p-6 rounded-[2rem] border-amber-500/10 bg-amber-500/5 backdrop-blur-xl hidden md:block">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/60 mb-2">Overall Streak</p>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black tracking-tighter text-glow-amber">Active</span>
                                <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase mb-1.5">Focus</span>
                            </div>
                        </Card>

                        <Button
                            onClick={() => setShowAddHabit(true)}
                            className="h-auto aspect-square md:aspect-auto md:h-24 md:px-8 rounded-[2rem] bg-emerald-500 hover:bg-emerald-600 text-white flex flex-col items-center justify-center group shadow-2xl shadow-emerald-500/20"
                        >
                            <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
                            <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] mt-2">New Routine</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            {activeHabits.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-[var(--border)] rounded-[4rem] bg-emerald-500/[0.02] relative group">
                    <div className="absolute inset-0 bg-emerald-500/[0.02] group-hover:bg-emerald-500/[0.04] transition-colors rounded-[4rem]" />
                    <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-500/10 flex items-center justify-center mb-8 relative z-10">
                        <TrendingUp className="w-12 h-12 text-emerald-500 animate-float" />
                    </div>
                    <h2 className="text-3xl font-black text-[var(--foreground)] mb-4 tracking-tighter uppercase italic relative z-10">
                        Labor-Status: <span className="text-emerald-500">Inaktiv</span>
                    </h2>
                    <p className="text-[var(--foreground-secondary)] mb-10 text-center max-w-sm font-medium relative z-10">
                        Keine Routinen im aktuellen Flow lokalisiert. Baue Gewohnheiten auf, um dein System zu stärken.
                    </p>
                    <Button
                        onClick={() => setShowAddHabit(true)}
                        size="lg"
                        className="gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-10 rounded-2xl h-14 shadow-xl shadow-emerald-500/20 font-black uppercase tracking-widest relative z-10"
                    >
                        <Plus className="w-6 h-6" /> Routine initialisieren
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {activeHabits.map((habit, i) => (
                        <HabitCard key={habit.id} habit={habit} index={i} />
                    ))}
                </div>
            )}

            <AddHabitDialog open={showAddHabit} onClose={() => setShowAddHabit(false)} />
        </PageContainer>
    );
}

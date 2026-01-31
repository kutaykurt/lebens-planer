'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Repeat, Flame, CheckCircle2, Sparkles, Calendar, TrendingUp } from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Dialog, DialogFooter, Input, Select, Textarea, toast } from '@/components/ui';
import { useLifeOSStore, useActiveHabits, useHabitStreak, useIsHabitCompleted, useHydration } from '@/stores';
import { getToday, cn } from '@/lib/utils';
import type { Habit, HabitFrequency } from '@/types';

// ─── Streak Badge ────────────────────────────────────────────────────────────

function StreakBadge({ streak }: { streak: number }) {
    if (streak === 0) return null;

    const isHot = streak >= 7;
    const isFire = streak >= 30;

    return (
        <div className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold',
            isFire
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                : isHot
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/20'
                    : 'bg-[var(--accent-warning-light)] text-[var(--accent-warning)]'
        )}>
            <Flame className={cn('w-4 h-4', (isHot || isFire) && 'animate-pulse')} />
            <span>{streak}</span>
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
            toast.success('Gewohnheit abgehakt! 🔥');
        }
    };

    const frequencyLabel = {
        daily: 'Täglich',
        times_per_week: `${habit.targetCount}x pro Woche`,
        specific_days: 'An bestimmten Tagen',
    }[habit.frequency];

    return (
        <Link href={`/habits/${habit.id}`} className="block">
            <Card
                variant="elevated"
                className={cn('mb-4 group animate-fade-in-up hover:border-[var(--accent-primary)] transition-all duration-300')}
                style={{ animationDelay: `${index * 75}ms` }}
            >
                <div className="flex items-center gap-4">
                    {/* Toggle Button */}
                    <button
                        onClick={handleToggle}
                        className={cn(
                            'relative w-14 h-14 rounded-2xl flex items-center justify-center shrink-0',
                            'transition-all duration-300 hover:scale-110 active:scale-95 z-10',
                            isCompleted
                                ? 'bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] shadow-lg shadow-[var(--accent-primary)]/30'
                                : 'bg-[var(--background-elevated)] border-2 border-[var(--border)] hover:border-[var(--accent-primary)]'
                        )}
                    >
                        {isCompleted ? (
                            <CheckCircle2 className="w-7 h-7 text-white animate-checkmark" />
                        ) : (
                            <Repeat className="w-6 h-6 text-[var(--foreground-muted)]" />
                        )}

                        {/* Glow when completed */}
                        {isCompleted && (
                            <div className="absolute inset-0 rounded-2xl bg-[var(--accent-primary)]/30 blur-xl" />
                        )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className={cn(
                            'font-semibold transition-colors duration-200',
                            isCompleted ? 'text-[var(--foreground-muted)]' : 'text-[var(--foreground)]'
                        )}>
                            {habit.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                            <span className="text-sm text-[var(--foreground-secondary)]">
                                {frequencyLabel}
                            </span>
                        </div>
                    </div>

                    {/* Streak Badge */}
                    <StreakBadge streak={streak} />
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
            toast.success('Gewohnheit erstellt! 🌱');
            setTitle('');
            setDescription('');
            setFrequency('daily');
            setTargetCount(3);
            onClose();
        }
    };

    const frequencyOptions = [
        { value: 'daily', label: 'Täglich' },
        { value: 'times_per_week', label: 'X-mal pro Woche' },
        { value: 'specific_days', label: 'An bestimmten Tagen' },
    ];

    return (
        <Dialog open={open} onClose={onClose} title="Neue Gewohnheit">
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Gewohnheit"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="z.B. 10 Minuten meditieren"
                    autoFocus
                    required
                />

                <Textarea
                    label="Beschreibung (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Warum ist diese Gewohnheit wichtig für dich?"
                />

                <Select
                    label="Häufigkeit"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
                    options={frequencyOptions}
                />

                {frequency === 'times_per_week' && (
                    <Input
                        label="Wie oft pro Woche?"
                        type="number"
                        min={1}
                        max={7}
                        value={targetCount}
                        onChange={(e) => setTargetCount(Number(e.target.value))}
                    />
                )}

                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Abbrechen
                    </Button>
                    <Button type="submit" disabled={!title.trim()}>
                        Gewohnheit erstellen
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyHabitsState({ onAddHabit }: { onAddHabit: () => void }) {
    return (
        <Card variant="gradient" className="text-center py-14 animate-fade-in">
            <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--accent-success)]/20 to-[var(--accent-primary)]/20 flex items-center justify-center">
                    <TrendingUp className="w-12 h-12 text-[var(--accent-success)] animate-float" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce">
                    <Flame className="w-4 h-4 text-white" />
                </div>
            </div>

            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                Baue positive Gewohnheiten auf
            </h2>
            <p className="text-[var(--foreground-secondary)] mb-6 max-w-sm mx-auto leading-relaxed">
                Kleine, tägliche Gewohnheiten führen über Zeit zu großen Veränderungen.
                Starte mit einer einfachen Gewohnheit.
            </p>
            <Button onClick={onAddHabit} size="lg" className="gap-2">
                <Sparkles className="w-5 h-5" />
                Erste Gewohnheit erstellen
            </Button>
        </Card>
    );
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function HabitsPageSkeleton() {
    return (
        <PageContainer>
            <div className="animate-pulse">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="h-8 w-36 skeleton rounded-xl mb-2" />
                        <div className="h-4 w-48 skeleton rounded-lg" />
                    </div>
                    <div className="h-11 w-44 skeleton rounded-xl" />
                </div>
                <div className="h-24 skeleton rounded-2xl mb-4" />
                <div className="h-24 skeleton rounded-2xl mb-4" />
                <div className="h-24 skeleton rounded-2xl" />
            </div>
        </PageContainer>
    );
}

// ─── Habits Page ─────────────────────────────────────────────────────────────

export default function HabitsPage() {
    const [showAddHabit, setShowAddHabit] = useState(false);
    const [mounted, setMounted] = useState(false);
    const isHydrated = useHydration();
    const activeHabits = useActiveHabits();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isHydrated) {
        return <HabitsPageSkeleton />;
    }

    // Calculate today's completed habits
    const today = getToday();

    return (
        <PageContainer>
            {/* Header */}
            <div className="flex items-center justify-between mb-8 animate-fade-in">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Gewohnheiten</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1">
                        {activeHabits.length === 0
                            ? 'Noch keine Gewohnheiten'
                            : `${activeHabits.length} aktive Gewohnheiten`}
                    </p>
                </div>
                {activeHabits.length > 0 && (
                    <Button onClick={() => setShowAddHabit(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Neue Gewohnheit
                    </Button>
                )}
            </div>

            {/* Habits List or Empty State */}
            {activeHabits.length === 0 ? (
                <EmptyHabitsState onAddHabit={() => setShowAddHabit(true)} />
            ) : (
                <div>
                    {activeHabits.map((habit, i) => (
                        <HabitCard key={habit.id} habit={habit} index={i} />
                    ))}
                </div>
            )}

            <AddHabitDialog open={showAddHabit} onClose={() => setShowAddHabit(false)} />
        </PageContainer>
    );
}

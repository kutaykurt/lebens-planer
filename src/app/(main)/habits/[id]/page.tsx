'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft, Edit3, Trash2, CheckCircle2, Flame,
    Calendar, TrendingUp, Info, Activity, Archive,
    Target, Repeat, Clock, Sparkles, Pause, Play
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Dialog, DialogFooter, Input, Textarea, Select, toast } from '@/components/ui';
import {
    useLifeOSStore,
    useHabitById,
    useHabitLogs,
    useHabitStreak,
    useHabitCompletionRate,
    useHydration
} from '@/stores';
import { cn, getToday, formatDate, subtractDays, parseDate } from '@/lib/utils';
import type { Habit, HabitFrequency } from '@/types';

// ─── Heatmap Component ───────────────────────────────────────────────────────

function HabitHeatMap({ logs, days = 180 }: { logs: any[], days?: number }) {
    const today = new Date();

    // Create a map for quick lookups
    const logMap = useMemo(() => {
        const map = new Map();
        logs.forEach(log => {
            if (log.completed) {
                map.set(log.date, true);
            }
        });
        return map;
    }, [logs]);

    // Generate grid data
    const weeks = useMemo(() => {
        const result = [];
        let currentWeek = [];

        // Start from Monday of the week X days ago
        const start = subtractDays(today, days);
        const dayOfWeek = start.getDay();
        const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const startDate = new Date(start.setDate(diff));

        const totalDays = days + 7; // Buffer

        for (let i = 0; i < totalDays; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateStr = formatDate(date);

            currentWeek.push({
                date: dateStr,
                completed: logMap.has(dateStr),
                isFuture: date > today
            });

            if (currentWeek.length === 7) {
                result.push(currentWeek);
                currentWeek = [];
            }
        }

        if (currentWeek.length > 0) result.push(currentWeek);
        return result;
    }, [logMap, days]);

    return (
        <div className="overflow-x-auto pb-2 -mx-1 px-1 custom-scrollbar">
            <div className="flex gap-1.5 min-w-max">
                {weeks.map((week, wIndex) => (
                    <div key={wIndex} className="flex flex-col gap-1.5">
                        {week.map((day, dIndex) => (
                            <div
                                key={day.date}
                                className={cn(
                                    'w-3.5 h-3.5 rounded-[3px] transition-all duration-300',
                                    day.isFuture
                                        ? 'bg-[var(--background-elevated)] opacity-20'
                                        : day.completed
                                            ? 'bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] shadow-[0_0_8px_rgba(99,102,241,0.3)]'
                                            : 'bg-[var(--background-elevated)] hover:bg-[var(--background-subtle)]'
                                )}
                                title={day.date}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-3 text-[10px] text-[var(--foreground-muted)] uppercase tracking-widest font-bold">
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Vor {Math.round(days / 30)} Monaten</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Heute</span>
            </div>
        </div>
    );
}

// ─── Edit Habit Dialog ───────────────────────────────────────────────────────

function EditHabitDialog({
    habit,
    open,
    onClose
}: {
    habit: Habit;
    open: boolean;
    onClose: () => void
}) {
    const [title, setTitle] = useState(habit.title);
    const [description, setDescription] = useState(habit.description || '');
    const [frequency, setFrequency] = useState<HabitFrequency>(habit.frequency);
    const [targetCount, setTargetCount] = useState(habit.targetCount || 3);

    const updateHabit = useLifeOSStore((s) => s.updateHabit);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            updateHabit(habit.id, {
                title: title.trim(),
                description: description.trim() || null,
                frequency,
                targetCount: frequency === 'times_per_week' ? targetCount : null,
            });
            toast.success('Gewohnheit aktualisiert! ✨');
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} title="Gewohnheit bearbeiten">
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Titel"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <Textarea
                    label="Beschreibung (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Select
                    label="Frequenz"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
                    options={[
                        { value: 'daily', label: 'Täglich' },
                        { value: 'times_per_week', label: 'X-mal pro Woche' },
                        { value: 'specific_days', label: 'An bestimmten Tagen' },
                    ]}
                />
                {frequency === 'times_per_week' && (
                    <Input
                        label="Ziel (Mal pro Woche)"
                        type="number"
                        min="1"
                        max="7"
                        value={targetCount}
                        onChange={(e) => setTargetCount(parseInt(e.target.value))}
                    />
                )}
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Abbrechen
                    </Button>
                    <Button type="submit" disabled={!title.trim()}>
                        Speichern
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

// ─── Goal Detail Page ────────────────────────────────────────────────────────

export default function HabitDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const isHydrated = useHydration();
    const habitId = params.id as string;
    const habit = useHabitById(habitId);
    const logs = useHabitLogs(habitId);
    const streak = useHabitStreak(habitId);
    const completionRate = useHabitCompletionRate(habitId, 30);
    const archiveHabit = useLifeOSStore((s) => s.archiveHabit);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isHydrated) return null;

    if (!habit) {
        return (
            <PageContainer>
                <div className="text-center py-20">
                    <p className="text-[var(--foreground-secondary)]">Gewohnheit nicht gefunden</p>
                    <Link href="/habits">
                        <Button variant="ghost" className="mt-4">
                            Zurück zu Gewohnheiten
                        </Button>
                    </Link>
                </div>
            </PageContainer>
        );
    }

    const handleArchive = () => {
        archiveHabit(habitId);
        toast.success('Gewohnheit archiviert');
        router.push('/habits');
    };

    const stats = [
        {
            label: 'Streak',
            value: `${streak} Tage`,
            icon: Flame,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10'
        },
        {
            label: 'Quote (30t)',
            value: `${Math.round(completionRate)}%`,
            icon: Activity,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'Total',
            value: logs.filter(l => l.completed).length,
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
    ];

    const trend = useMemo(() => {
        const last7 = logs.filter(l => l.date >= formatDate(subtractDays(new Date(), 6)) && l.completed).length;
        const prev7 = logs.filter(l => l.date >= formatDate(subtractDays(new Date(), 13)) && l.date < formatDate(subtractDays(new Date(), 6)) && l.completed).length;

        if (prev7 === 0) return last7 > 0 ? 'up' : 'neutral';
        if (last7 > prev7) return 'up';
        if (last7 < prev7) return 'down';
        return 'neutral';
    }, [logs]);

    return (
        <PageContainer>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 animate-fade-in">
                <Link href="/habits" className="flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    <span>Zurück</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setShowEdit(true)}>
                        <Edit3 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Habit Overview */}
            <Card variant="elevated" className="mb-6 animate-fade-in-up">
                <div className="flex items-start gap-5 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] flex items-center justify-center shadow-xl shadow-[var(--accent-primary)]/20 text-white">
                        <Repeat className="w-8 h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">
                            {habit.title}
                        </h1>
                        <div className="flex items-center gap-2">
                            <p className="text-[var(--foreground-secondary)]">
                                {habit.frequency === 'daily' ? 'Täglich zu erledigen' : `Häufigkeit: ${habit.frequency === 'times_per_week' ? `${habit.targetCount}x pro Woche` : 'Spezifische Tage'}`}
                            </p>
                            {!habit.isActive && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase">Pausiert</span>
                            )}
                        </div>
                    </div>
                </div>

                {habit.description && (
                    <div className="p-4 rounded-xl bg-[var(--background-subtle)] border border-[var(--border-subtle)] mb-6">
                        <div className="flex gap-2 text-[var(--foreground-secondary)]">
                            <Info className="w-4 h-4 shrink-0 mt-0.5" />
                            <p className="text-sm leading-relaxed">{habit.description}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center p-3 rounded-2xl bg-[var(--background-elevated)] border border-[var(--border)]">
                            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-2', stat.bg)}>
                                <stat.icon className={cn('w-4 h-4', stat.color)} />
                            </div>
                            <span className="text-lg font-bold text-[var(--foreground)]">{stat.value}</span>
                            <span className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] font-semibold text-center">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Heatmap Section */}
            <Card variant="elevated" className="mb-6 animate-fade-in-up stagger-1">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary-light)] flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
                        </div>
                        <div>
                            <h2 className="font-bold text-[var(--foreground)]">Fortschritts-Analyse</h2>
                            <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-widest font-bold">Letzte 6 Monate</p>
                        </div>
                    </div>

                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold",
                        trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : trend === 'down' ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"
                    )}>
                        {trend === 'up' && <TrendingUp className="w-4 h-4" />}
                        {trend === 'up' ? "Trend: Steigend" : trend === 'down' ? "Trend: Fallend" : "Trend: Stabil"}
                    </div>
                </div>

                <HabitHeatMap logs={logs} days={180} />
            </Card>

            {/* History List */}
            <Card variant="elevated" className="mb-6 animate-fade-in-up stagger-2">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-[var(--background-elevated)] flex items-center justify-center">
                        <Activity className="w-4 h-4 text-[var(--foreground-muted)]" />
                    </div>
                    <h2 className="font-bold text-[var(--foreground)]">Letzte Aktivitäten</h2>
                </div>

                <div className="space-y-2">
                    {logs.slice(0, 7).map(log => (
                        <div key={log.date} className="flex items-center justify-between p-3 rounded-xl bg-[var(--background-surface)] border border-[var(--border-subtle)]">
                            <span className="text-sm font-medium">{formatDate(parseDate(log.date))}</span>
                            {log.completed ? (
                                <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Erledigt
                                </div>
                            ) : (
                                <div className="text-[var(--foreground-muted)] text-xs font-bold">Verpasst</div>
                            )}
                        </div>
                    ))}
                    {logs.length === 0 && <p className="text-sm text-[var(--foreground-muted)] italic text-center py-4">Noch keine Logs vorhanden</p>}
                </div>
            </Card>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 animate-fade-in-up stagger-2">
                <Button
                    variant="ghost"
                    className={cn(
                        "gap-2",
                        habit.isActive ? "text-amber-500" : "text-emerald-500"
                    )}
                    onClick={() => {
                        const updateHabit = useLifeOSStore.getState().updateHabit;
                        updateHabit(habit.id, { isActive: !habit.isActive });
                        toast.success(habit.isActive ? 'Gewohnheit pausiert' : 'Gewohnheit fortgesetzt');
                    }}
                >
                    {habit.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {habit.isActive ? 'Pausieren' : 'Fortsetzen'}
                </Button>
                <Button
                    variant="ghost"
                    className="gap-2 text-[var(--foreground-secondary)]"
                    onClick={() => setShowDeleteConfirm(true)}
                >
                    <Archive className="w-4 h-4" />
                    Archivieren
                </Button>
            </div>

            {/* Dialogs */}
            <EditHabitDialog
                habit={habit}
                open={showEdit}
                onClose={() => setShowEdit(false)}
            />

            <Dialog
                open={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Archivieren?"
                description="Diese Gewohnheit wird in deine Historie verschoben und erscheint nicht mehr im Dashboard."
            >
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
                        Abbrechen
                    </Button>
                    <Button variant="destructive" onClick={handleArchive}>
                        Archivieren
                    </Button>
                </DialogFooter>
            </Dialog>
        </PageContainer>
    );
}

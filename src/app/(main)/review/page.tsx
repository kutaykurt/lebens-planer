'use client';

import { useState, useEffect } from 'react';
import {
    Calendar, CheckCircle2, TrendingUp, Zap, Star,
    ChevronRight, BookOpen, Plus, Award, Target, Layout
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Dialog, DialogFooter, Input, Textarea, toast } from '@/components/ui';
import { useLifeOSStore, useHydration } from '@/stores';
import { cn, formatDate, getMonthName } from '@/lib/utils';
import type { MonthlyReflection, YearlyReflection } from '@/types';

// ─── Monthly Review Dialog ───────────────────────────────────────────────────

function MonthlyReviewDialog({
    open,
    onClose,
    existingReflection
}: {
    open: boolean;
    onClose: () => void;
    existingReflection?: MonthlyReflection;
}) {
    // Default to current month/year if new
    const now = new Date();
    // If we are doing a review, it's usually for the *previous* month or current ending month.
    // Let's assume we review the current month or we select a month. 
    // For simplicity, let's default to the *current* month string YYYY-MM.
    const currentMonthStr = new Date().toISOString().slice(0, 7);

    const [month, setMonth] = useState(existingReflection?.month || currentMonthStr);
    const [rating, setRating] = useState(existingReflection?.satisfactionRating || 5);
    const [highlights, setHighlights] = useState(existingReflection?.highlights?.join('\n') || '');
    const [challenges, setChallenges] = useState(existingReflection?.challenges || '');
    const [learnings, setLearnings] = useState(existingReflection?.keyLearnings || '');
    const [focus, setFocus] = useState(existingReflection?.focusNextMonth || '');

    const saveMonthlyReflection = useLifeOSStore((s) => s.saveMonthlyReflection);
    const tasks = useLifeOSStore((s) => s.tasks);
    const energyLogs = useLifeOSStore((s) => s.energyLogs);
    const habitLogs = useLifeOSStore((s) => s.habitLogs);

    // Calculate stats snapshot for the selected month
    const calculateStats = (selectedMonth: string) => {
        // Filter data for selectedMonth
        const monthTasks = tasks.filter(t => t.completedAt && t.completedAt.startsWith(selectedMonth));
        const monthEnergy = energyLogs.filter(e => e.date.startsWith(selectedMonth));
        const monthHabits = habitLogs.filter(h => h.date.startsWith(selectedMonth) && h.completed);

        const tasksCompleted = monthTasks.length;
        const avgEnergy = monthEnergy.length > 0
            ? monthEnergy.reduce((a, b) => a + b.level, 0) / monthEnergy.length
            : 0;

        // Simplistic habit rate calc (completed logs / days in month or just total logs)
        // Let's just store total completed habits for now as a "rate" indicator is complex without habit count context
        const habitsRate = monthHabits.length;

        return { tasksCompleted, avgEnergy, habitsRate };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const stats = calculateStats(month);

        saveMonthlyReflection({
            month,
            satisfactionRating: rating,
            highlights: highlights.split('\n').filter(s => s.trim()),
            challenges: challenges.trim() || null,
            keyLearnings: learnings.trim() || null,
            focusNextMonth: focus.trim() || null,
            statsSnapshot: stats,
        });

        toast.success(`Monatsrückblick gespeichert! 🌟`);
        onClose();
    };

    const stats = calculateStats(month);

    return (
        <Dialog open={open} onClose={onClose} title="Monatsrückblick">
            <div className="max-h-[70vh] overflow-y-auto px-1">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Month Selection & Stats */}
                    <div className="bg-[var(--background-subtle)] p-4 rounded-xl space-y-4">
                        <Input
                            type="month"
                            label="Monat"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            required
                        />

                        <div className="grid grid-cols-3 gap-2">
                            <div className="text-center p-2 bg-[var(--background-surface)] rounded-lg">
                                <div className="text-xl font-bold">{stats.tasksCompleted}</div>
                                <div className="text-[10px] uppercase text-[var(--foreground-muted)]">Tasks</div>
                            </div>
                            <div className="text-center p-2 bg-[var(--background-surface)] rounded-lg">
                                <div className="text-xl font-bold">{stats.avgEnergy.toFixed(1)}</div>
                                <div className="text-[10px] uppercase text-[var(--foreground-muted)]">Ø Energie</div>
                            </div>
                            <div className="text-center p-2 bg-[var(--background-surface)] rounded-lg">
                                <div className="text-xl font-bold">{stats.habitsRate}</div>
                                <div className="text-[10px] uppercase text-[var(--foreground-muted)]">Habits</div>
                            </div>
                        </div>
                    </div>

                    {/* Satisfaction */}
                    <div>
                        <label className="text-sm font-semibold mb-2 block flex justify-between">
                            <span>Zufriedenheit</span>
                            <span className="text-[var(--accent-primary)] font-bold">{rating}/10</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={rating}
                            onChange={(e) => setRating(parseInt(e.target.value))}
                            className="w-full h-2 bg-[var(--background-elevated)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)]"
                        />
                    </div>

                    <Textarea
                        label="Highlights (Ein Punkt pro Zeile)"
                        value={highlights}
                        onChange={(e) => setHighlights(e.target.value)}
                        placeholder="Was waren deine größten Erfolge?"
                        className="min-h-[100px]"
                    />

                    <Textarea
                        label="Herausforderungen"
                        value={challenges}
                        onChange={(e) => setChallenges(e.target.value)}
                        placeholder="Was lief nicht so gut?"
                    />

                    <Textarea
                        label="Wichtige Erkenntnisse"
                        value={learnings}
                        onChange={(e) => setLearnings(e.target.value)}
                        placeholder="Was hast du gelernt?"
                    />

                    <Textarea
                        label="Fokus für den nächsten Monat"
                        value={focus}
                        onChange={(e) => setFocus(e.target.value)}
                        placeholder="Worauf willst du dich konzentrieren?"
                    />
                </form>
            </div>

            <DialogFooter className="mt-4">
                <Button type="button" variant="ghost" onClick={onClose}>Abbrechen</Button>
                <Button onClick={handleSubmit}>Speichern</Button>
            </DialogFooter>
        </Dialog>
    );
}

// ─── Yearly Review Dialog ────────────────────────────────────────────────────

function YearlyReviewDialog({
    open,
    onClose,
    existingReflection
}: {
    open: boolean;
    onClose: () => void;
    existingReflection?: YearlyReflection;
}) {
    const currentYear = new Date().getFullYear();

    const [year, setYear] = useState(existingReflection?.year || currentYear);
    const [rating, setRating] = useState(existingReflection?.satisfactionRating || 5);
    const [wins, setWins] = useState(existingReflection?.biggestWins?.join('\n') || '');
    const [challenges, setChallenges] = useState(existingReflection?.challenges || '');
    const [lessons, setLessons] = useState(existingReflection?.lifeLessons || '');
    const [focus, setFocus] = useState(existingReflection?.focusNextYear || '');

    const saveYearlyReflection = useLifeOSStore((s) => s.saveYearlyReflection);
    const tasks = useLifeOSStore((s) => s.tasks);
    const energyLogs = useLifeOSStore((s) => s.energyLogs);
    const habitLogs = useLifeOSStore((s) => s.habitLogs);

    // Calculate stats snapshot for the selected year
    const calculateStats = (selectedYear: number) => {
        const yearStr = selectedYear.toString();
        const yearTasks = tasks.filter(t => t.completedAt && t.completedAt.startsWith(yearStr));
        const yearEnergy = energyLogs.filter(e => e.date.startsWith(yearStr));
        const yearHabits = habitLogs.filter(h => h.date.startsWith(yearStr) && h.completed);

        const tasksCompleted = yearTasks.length;
        const avgEnergy = yearEnergy.length > 0
            ? yearEnergy.reduce((a, b) => a + b.level, 0) / yearEnergy.length
            : 0;
        const habitsCount = yearHabits.length;

        return { tasksCompleted, avgEnergy, habitsCount };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveYearlyReflection({
            year,
            satisfactionRating: rating,
            biggestWins: wins.split('\n').filter(s => s.trim()),
            challenges: challenges.trim() || null,
            lifeLessons: lessons.trim() || null,
            focusNextYear: focus.trim() || null,
            moodGrid: {}, // Placeholder for now
        });

        toast.success(`Jahresrückblick gespeichert! 🏆`);
        onClose();
    };

    const stats = calculateStats(year);

    return (
        <Dialog open={open} onClose={onClose} title="Jahresrückblick">
            <div className="max-h-[70vh] overflow-y-auto px-1">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Year Selection & Stats */}
                    <div className="bg-[var(--background-subtle)] p-4 rounded-xl space-y-4">
                        <Input
                            type="number"
                            label="Jahr"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            required
                        />

                        <div className="grid grid-cols-3 gap-2">
                            <div className="text-center p-2 bg-[var(--background-surface)] rounded-lg">
                                <div className="text-xl font-bold">{stats.tasksCompleted}</div>
                                <div className="text-[10px] uppercase text-[var(--foreground-muted)]">Tasks</div>
                            </div>
                            <div className="text-center p-2 bg-[var(--background-surface)] rounded-lg">
                                <div className="text-xl font-bold">{stats.avgEnergy.toFixed(1)}</div>
                                <div className="text-[10px] uppercase text-[var(--foreground-muted)]">Ø Energie</div>
                            </div>
                            <div className="text-center p-2 bg-[var(--background-surface)] rounded-lg">
                                <div className="text-xl font-bold">{stats.habitsCount}</div>
                                <div className="text-[10px] uppercase text-[var(--foreground-muted)]">Habits</div>
                            </div>
                        </div>
                    </div>

                    {/* Satisfaction */}
                    <div>
                        <label className="text-sm font-semibold mb-2 block flex justify-between">
                            <span>Zufriedenheit mit dem Jahr</span>
                            <span className="text-[var(--accent-primary)] font-bold">{rating}/10</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={rating}
                            onChange={(e) => setRating(parseInt(e.target.value))}
                            className="w-full h-2 bg-[var(--background-elevated)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)]"
                        />
                    </div>

                    <Textarea
                        label="Größte Erfolge (Wins)"
                        value={wins}
                        onChange={(e) => setWins(e.target.value)}
                        placeholder="Was hast du dieses Jahr erreicht?"
                        className="min-h-[100px]"
                    />

                    <Textarea
                        label="Herausforderungen"
                        value={challenges}
                        onChange={(e) => setChallenges(e.target.value)}
                        placeholder="Was war schwierig?"
                    />

                    <Textarea
                        label="Lebens-Lektionen"
                        value={lessons}
                        onChange={(e) => setLessons(e.target.value)}
                        placeholder="Was hast du über dich und das Leben gelernt?"
                    />

                    <Textarea
                        label="Fokus für das nächste Jahr"
                        value={focus}
                        onChange={(e) => setFocus(e.target.value)}
                        placeholder="Was ist dein großes Thema für nächstes Jahr?"
                    />
                </form>
            </div>

            <DialogFooter className="mt-4">
                <Button type="button" variant="ghost" onClick={onClose}>Abbrechen</Button>
                <Button onClick={handleSubmit}>Speichern</Button>
            </DialogFooter>
        </Dialog>
    );
}

// ─── Review Page ─────────────────────────────────────────────────────────────

export default function ReviewPage() {
    const isHydrated = useHydration();
    const [showMonthly, setShowMonthly] = useState(false);
    const [showYearly, setShowYearly] = useState(false);

    const monthlyReflections = useLifeOSStore((s) => s.monthlyReflections);
    const yearlyReflections = useLifeOSStore((s) => s.yearlyReflections);

    const sortedMonthly = [...monthlyReflections].sort((a, b) => b.month.localeCompare(a.month));
    const sortedYearly = [...yearlyReflections].sort((a, b) => b.year - a.year);

    if (!isHydrated) return null;

    return (
        <PageContainer>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Review & Reflect</h1>
                    <p className="text-[var(--foreground-secondary)]">Lerne aus deiner Vergangenheit</p>
                </div>
                <Button onClick={() => setShowMonthly(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Neuer Rückblick
                </Button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-indigo-500">
                        <BookOpen className="w-5 h-5" />
                        Monthly Reviews
                    </h3>
                    <p className="text-3xl font-black mb-1">{monthlyReflections.length}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">Gespeicherte Monatsrückblicke</p>
                </Card>

                <Card
                    className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 cursor-pointer hover:border-amber-500 transition-colors"
                    onClick={() => setShowYearly(true)}
                >
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-amber-500">
                        <Award className="w-5 h-5" />
                        Yearly Reviews
                    </h3>
                    <p className="text-3xl font-black mb-1">{yearlyReflections.length}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">Gespeicherte Jahresrückblicke</p>
                </Card>
            </div>

            {/* Timeline */}
            <h2 className="text-xl font-bold mb-6">Historie</h2>

            {/* Yearly Timeline (if any) */}
            {sortedYearly.length > 0 && (
                <div className="mb-10 space-y-6">
                    <h3 className="font-bold text-[var(--foreground-muted)] uppercase tracking-wider text-sm">Jahresrückblicke</h3>
                    {sortedYearly.map((reflection) => (
                        <Card key={reflection.id} className="p-6 border-amber-500/30 bg-amber-500/5">
                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                <div className="shrink-0 flex md:flex-col items-center gap-2 min-w-[100px]">
                                    <div className="text-4xl font-black text-[var(--foreground)] text-amber-600">
                                        {reflection.year}
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-600 font-bold text-xs mt-1">
                                        <Star className="w-3 h-3 fill-current" />
                                        {reflection.satisfactionRating}/10
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 space-y-4 border-l border-amber-500/20 pl-6">
                                    {reflection.biggestWins.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold uppercase text-amber-600/70 mb-2">Biggest Wins</h4>
                                            <ul className="list-disc list-inside space-y-1">
                                                {reflection.biggestWins.map((h, i) => (
                                                    <li key={i} className="text-sm text-[var(--foreground)]">{h}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {reflection.focusNextYear && (
                                        <div className="bg-[var(--background-surface)] p-3 rounded-lg flex items-start gap-3 border border-amber-500/10">
                                            <Target className="w-4 h-4 text-amber-600 mt-0.5" />
                                            <div>
                                                <h4 className="text-xs font-bold uppercase text-amber-600/70 mb-1">Fokus {reflection.year + 1}</h4>
                                                <p className="text-sm font-medium text-[var(--foreground)]">{reflection.focusNextYear}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <div className="space-y-6">
                <h3 className="font-bold text-[var(--foreground-muted)] uppercase tracking-wider text-sm">Monatsrückblicke</h3>
                {sortedMonthly.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-[var(--border-subtle)] rounded-2xl">
                        <Layout className="w-12 h-12 text-[var(--foreground-muted)] mx-auto mb-4 opacity-50" />
                        <h3 className="font-semibold text-[var(--foreground)]">Noch keine Rückblicke</h3>
                        <p className="text-[var(--foreground-secondary)] mb-6 text-sm">
                            Starte deinen ersten Monatsrückblick, um Muster zu erkennen.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button onClick={() => setShowMonthly(true)} variant="outline">
                                Monats-Review
                            </Button>
                            <Button onClick={() => setShowYearly(true)} variant="outline">
                                Jahres-Review
                            </Button>
                        </div>
                    </div>
                ) : (
                    sortedMonthly.map((reflection) => (
                        <Card key={reflection.id} className="p-6">
                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                {/* Date Badge */}
                                <div className="shrink-0 flex md:flex-col items-center gap-2 min-w-[100px]">
                                    <div className="text-sm font-bold text-[var(--foreground-muted)] uppercase tracking-wider">
                                        {reflection.month.split('-')[0]}
                                    </div>
                                    <div className="text-3xl font-black text-[var(--foreground)]">
                                        {getMonthName(parseInt(reflection.month.split('-')[1]) - 1)}
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold text-xs mt-1">
                                        <Star className="w-3 h-3 fill-current" />
                                        {reflection.satisfactionRating}/10
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 space-y-4 border-l border-[var(--border-subtle)] pl-6">
                                    {/* Stats Row */}
                                    <div className="flex gap-4 text-sm text-[var(--foreground-secondary)] mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <span className="font-medium">{reflection.statsSnapshot.tasksCompleted} Tasks</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Zap className="w-4 h-4 text-amber-500" />
                                            <span className="font-medium">Ø {reflection.statsSnapshot.avgEnergy.toFixed(1)} Energie</span>
                                        </div>
                                    </div>

                                    {/* Highlights */}
                                    {reflection.highlights.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold uppercase text-[var(--foreground-muted)] mb-2">Highlights</h4>
                                            <ul className="list-disc list-inside space-y-1">
                                                {reflection.highlights.map((h, i) => (
                                                    <li key={i} className="text-sm text-[var(--foreground)]">{h}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Focus */}
                                    {reflection.focusNextMonth && (
                                        <div className="bg-[var(--background-subtle)] p-3 rounded-lg flex items-start gap-3">
                                            <Target className="w-4 h-4 text-[var(--accent-primary)] mt-0.5" />
                                            <div>
                                                <h4 className="text-xs font-bold uppercase text-[var(--foreground-muted)] mb-1">Fokus Next Month</h4>
                                                <p className="text-sm font-medium text-[var(--foreground)]">{reflection.focusNextMonth}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <MonthlyReviewDialog
                open={showMonthly}
                onClose={() => setShowMonthly(false)}
            />

            <YearlyReviewDialog
                open={showYearly}
                onClose={() => setShowYearly(false)}
            />
        </PageContainer>
    );
}

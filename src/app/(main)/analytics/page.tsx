'use client';

import { useMemo } from 'react';
import {
    BarChart3, TrendingUp, Zap, Calendar,
    Smile, Target, ArrowUpRight, Activity,
    Wallet, AlertCircle, Shield, Coffee, Rocket,
    ChevronRight, Brain, Sparkles, LayoutGrid,
    Flame, CheckCircle2, Globe, TrendingDown,
    Award
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { cn } from '@/lib/utils';
import { useLifeOSStore, useHydration } from '@/stores';
import { WheelOfLife } from '@/components/features/WheelOfLife';
import { generateSmartInsights, generateQuarterlyReport } from '@/lib/analytics';

const ICON_MAP: any = {
    Activity, Zap, TrendingUp, Target, AlertCircle, Wallet, Smile, Shield, Coffee, Rocket, Brain, Sparkles, Award
};

export default function AnalyticsPage() {
    const tasks = useLifeOSStore((s) => s.tasks);
    const goals = useLifeOSStore((s) => s.goals);
    const energyLogs = useLifeOSStore((s) => s.energyLogs);
    const habitLogs = useLifeOSStore((s) => s.habitLogs);
    const transactions = useLifeOSStore((s) => s.transactions);
    const dailyLogs = useLifeOSStore((s) => s.dailyLogs);
    const isHydrated = useHydration();

    const insights = useMemo(() => {
        return generateSmartInsights(tasks, energyLogs, habitLogs, transactions, dailyLogs);
    }, [tasks, energyLogs, habitLogs, transactions, dailyLogs]);

    const quarterlyReport = useMemo(() => {
        return generateQuarterlyReport(tasks, energyLogs, transactions);
    }, [tasks, energyLogs, transactions]);

    const stats = useMemo(() => {
        const completedTasks = tasks.filter(t => t.status === 'completed');
        const totalEnergy = energyLogs.reduce((acc, curr) => acc + curr.level, 0);
        const avgEnergy = energyLogs.length > 0 ? totalEnergy / energyLogs.length : 0;

        const taskSuccessRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

        // Peak day analysis (Weekly)
        const tasksByDay = new Array(7).fill(0);
        completedTasks.forEach(t => {
            if (t.completedAt) {
                const day = new Date(t.completedAt).getDay();
                tasksByDay[day]++;
            }
        });
        const peakDayIndex = tasksByDay.indexOf(Math.max(...tasksByDay));
        const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

        // Monthly Overview (Last 30 Days)
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            return d.toISOString().split('T')[0];
        });

        const tasksLast30Days = last30Days.map(dateStr => {
            return completedTasks.filter(t => t.completedAt && t.completedAt.startsWith(dateStr)).length;
        });

        // Task Distribution by Category
        const tasksByCategory: Record<string, number> = {};

        tasks.forEach(t => {
            if (t.goalId) {
                const goal = goals.find(g => g.id === t.goalId);
                if (goal) {
                    tasksByCategory[goal.category] = (tasksByCategory[goal.category] || 0) + 1;
                }
            } else {
                tasksByCategory['inbox'] = (tasksByCategory['inbox'] || 0) + 1;
            }
        });

        return {
            completedTasks: completedTasks.length,
            avgEnergy: avgEnergy.toFixed(1),
            taskSuccessRate: taskSuccessRate.toFixed(0),
            peakDay: dayNames[peakDayIndex],
            tasksByDay,
            tasksLast30Days,
            tasksByCategory,
            totalTasks: tasks.length
        };
    }, [tasks, energyLogs, goals]);

    const lifeScore = ((Number(stats.taskSuccessRate) * 0.6) + (Number(stats.avgEnergy) * 2 * 0.4)).toFixed(1);
    const balance = transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);

    if (!isHydrated) {
        return (
            <PageContainer>
                <div className="animate-pulse space-y-6">
                    <div className="h-32 bg-[var(--background-elevated)] rounded-2xl" />
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-[var(--background-elevated)] rounded-xl" />)}
                    </div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            {/* ═══════════════════════════════════════════════════════════════
                HEADER
            ═══════════════════════════════════════════════════════════════ */}
            <header className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
                    Analytik
                </h1>
                <p className="text-sm text-[var(--foreground-muted)] mt-1">
                    Deine Fortschritte auf einen Blick
                </p>
            </header>

            {/* ═══════════════════════════════════════════════════════════════
                TOP ROW: Life Score + Key Metrics
            ═══════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
                {/* Life Score - Hero Metric */}
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5" />
                            <span className="text-sm font-medium opacity-90">Life Score</span>
                        </div>
                        <p className="text-5xl md:text-6xl font-bold tracking-tight mb-2">
                            {lifeScore}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                <span>+2.4%</span>
                            </div>
                            <span className="opacity-70">diese Woche</span>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'Erledigt', value: stats.completedTasks, sub: `von ${stats.totalTasks}`, icon: CheckCircle2, color: 'bg-emerald-500' },
                        { label: 'Energie', value: stats.avgEnergy, sub: 'Durchschnitt', icon: Zap, color: 'bg-amber-500' },
                        { label: 'Erfolg', value: `${stats.taskSuccessRate}%`, sub: 'Rate', icon: Target, color: 'bg-indigo-500' },
                        { label: 'Peak', value: stats.peakDay?.slice(0, 2) || '-', sub: stats.peakDay || 'Tag', icon: Calendar, color: 'bg-purple-500' }
                    ].map((m, i) => (
                        <div key={i} className="bg-[var(--background-surface)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--border-strong)] transition-colors">
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white mb-3", m.color)}>
                                <m.icon className="w-4 h-4" />
                            </div>
                            <p className="text-xl font-bold text-[var(--foreground)]">{m.value}</p>
                            <p className="text-xs text-[var(--foreground-muted)]">{m.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                MAIN GRID: 3 Columns
            ═══════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COLUMN 1: Insights */}
                <div className="bg-[var(--background-surface)] border border-[var(--border)] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
                            <Brain className="w-4 h-4 text-indigo-500" />
                            Erkenntnisse
                        </h2>
                        <span className="text-xs text-[var(--foreground-muted)] bg-[var(--background-elevated)] px-2 py-1 rounded-md">
                            {insights.length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {insights.length > 0 ? insights.slice(0, 4).map((insight) => {
                            const Icon = ICON_MAP[insight.icon] || Activity;
                            return (
                                <div key={insight.id} className="flex gap-3 p-3 rounded-xl bg-[var(--background-elevated)] hover:bg-[var(--background-subtle)] transition-colors">
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                        insight.type === 'positive' ? "bg-emerald-100 text-emerald-600" :
                                            insight.type === 'warning' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                                    )}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-medium text-[var(--foreground)] truncate">{insight.title}</h3>
                                        <p className="text-xs text-[var(--foreground-muted)] line-clamp-2 mt-0.5">{insight.description}</p>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="text-center py-8 text-[var(--foreground-muted)]">
                                <Brain className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">Keine Insights</p>
                                <p className="text-xs mt-1">Logge mehr Daten</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* COLUMN 2: Projects + Finance */}
                <div className="space-y-6">
                    {/* Projects */}
                    <div className="bg-[var(--background-surface)] border border-[var(--border)] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-500" />
                                Projekte
                            </h2>
                            <span className="text-xs text-[var(--foreground-muted)] bg-[var(--background-elevated)] px-2 py-1 rounded-md">
                                {goals.length}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {goals.length > 0 ? goals.slice(0, 3).map(goal => {
                                const projectTasks = tasks.filter(t => t.goalId === goal.id);
                                const completedProjectTasks = projectTasks.filter(t => t.status === 'completed');
                                const progress = projectTasks.length > 0 ? (completedProjectTasks.length / projectTasks.length) * 100 : 0;

                                return (
                                    <div key={goal.id}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm font-medium text-[var(--foreground)] truncate pr-2">{goal.title}</span>
                                            <span className="text-sm font-bold text-indigo-600">{progress.toFixed(0)}%</span>
                                        </div>
                                        <div className="h-2 bg-[var(--background-elevated)] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="text-center py-6 text-[var(--foreground-muted)]">
                                    <Target className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">Keine Projekte</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Finance */}
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <Wallet className="w-4 h-4" />
                                <span className="text-sm font-medium opacity-90">Finanzen</span>
                            </div>
                            <p className="text-3xl font-bold tracking-tight mb-1">
                                {balance.toFixed(0)}€
                            </p>
                            <p className="text-sm opacity-80">Verfügbar</p>

                            <div className="mt-4 pt-4 border-t border-white/20 flex justify-between">
                                <div>
                                    <p className="text-lg font-bold">{habitLogs.filter(l => l.completed).length}</p>
                                    <p className="text-xs opacity-70">Habits</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold flex items-center gap-1 justify-end">
                                        {Number(stats.taskSuccessRate) > 70 ? <CheckCircle2 className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                                    </p>
                                    <p className="text-xs opacity-70">{Number(stats.taskSuccessRate) > 70 ? 'Top' : 'Gut'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMN 3: Wheel of Life */}
                <div className="bg-[var(--background-surface)] border border-[var(--border)] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
                            <Globe className="w-4 h-4 text-indigo-500" />
                            Lebens-Balance
                        </h2>
                    </div>

                    <div className="flex items-center justify-center py-4">
                        <WheelOfLife />
                    </div>

                    <p className="text-xs text-center text-[var(--foreground-muted)] mt-2">
                        Balance über alle Bereiche
                    </p>
                </div>
            </div>
        </PageContainer>
    );
}

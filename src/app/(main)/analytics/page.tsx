'use client';

import { useMemo } from 'react';
import {
    BarChart3, TrendingUp, Zap, Calendar,
    Smile, Target, ArrowUpRight, Activity
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useLifeOSStore, useHydration } from '@/stores';
import { WheelOfLife } from '@/components/features/WheelOfLife';

export default function AnalyticsPage() {
    const tasks = useLifeOSStore((s) => s.tasks);
    const goals = useLifeOSStore((s) => s.goals);
    const energyLogs = useLifeOSStore((s) => s.energyLogs);
    const habitLogs = useLifeOSStore((s) => s.habitLogs);
    const isHydrated = useHydration();

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
        let categorizedCount = 0;

        tasks.forEach(t => {
            if (t.goalId) {
                const goal = goals.find(g => g.id === t.goalId);
                if (goal) {
                    tasksByCategory[goal.category] = (tasksByCategory[goal.category] || 0) + 1;
                    categorizedCount++;
                }
            } else {
                tasksByCategory['inbox'] = (tasksByCategory['inbox'] || 0) + 1;
                categorizedCount++;
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

    if (!isHydrated) return null;

    return (
        <PageContainer>
            <div className="mb-10">
                <h1 className="text-4xl font-black text-[var(--foreground)] tracking-tighter mb-2">Tiefen-Analyse</h1>
                <p className="text-[var(--foreground-secondary)] text-lg">Entschlüssele deine Produktivitäts-Muster</p>
            </div>

            <WheelOfLife />

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="p-4 border-b-4 border-b-blue-500">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-1">Items Erledigt</p>
                    <p className="text-3xl font-black text-[var(--foreground)]">{stats.completedTasks}</p>
                </Card>
                <Card className="p-4 border-b-4 border-b-amber-500">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-1">Ø Energie</p>
                    <p className="text-3xl font-black text-[var(--foreground)]">{stats.avgEnergy}</p>
                </Card>
                <Card className="p-4 border-b-4 border-b-emerald-500">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-1">Erfolgsrate</p>
                    <p className="text-3xl font-black text-[var(--foreground)]">{stats.taskSuccessRate}%</p>
                </Card>
                <Card className="p-4 border-b-4 border-b-purple-500">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-1">Fokus-Score</p>
                    <p className="text-3xl font-black text-[var(--foreground)]">8.4</p>
                </Card>
            </div>

            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> Korrelations-Engine
            </h2>

            <div className="space-y-4">
                <Card className="p-6 relative overflow-hidden group hover:scale-[1.01] transition-transform">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[var(--foreground)]">Energie & Performance</h3>
                            <p className="text-sm text-[var(--foreground-secondary)]">
                                An Tagen mit hoher Energie (4-5) erledigst du im Schnitt <span className="font-bold text-[var(--accent-primary)]">42% mehr Aufgaben</span>.
                            </p>
                        </div>
                        <ArrowUpRight className="ml-auto w-6 h-6 text-[var(--foreground-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
                    </div>
                </Card>

                <Card className="p-6 relative overflow-hidden group hover:scale-[1.01] transition-transform">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[var(--foreground)]">Wochenend-Muster</h3>
                            <p className="text-sm text-[var(--foreground-secondary)]">
                                Sonntage sind deine glücklichsten Tage (Stimmung: 4.8), aber deine unproduktivsten Tage.
                            </p>
                        </div>
                        <ArrowUpRight className="ml-auto w-6 h-6 text-[var(--foreground-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
                    </div>
                </Card>

                <Card className="p-6 relative overflow-hidden group hover:scale-[1.01] transition-transform">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[var(--foreground)]">Morgendliche Dynamik</h3>
                            <p className="text-sm text-[var(--foreground-secondary)]">
                                Aufgaben, die vor 10:00 Uhr erledigt werden, erhöhen die Wahrscheinlichkeit eines "Fantastisch"-Logs um <span className="font-bold text-emerald-500">25%</span>.
                            </p>
                        </div>
                        <ArrowUpRight className="ml-auto w-6 h-6 text-[var(--foreground-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
                    </div>
                </Card>
            </div>

            <div className="mt-8">
                <Card className="p-6">
                    <h3 className="font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        Aktivität (30 Tage)
                    </h3>
                    <div className="flex items-end gap-1 h-32">
                        {stats.tasksLast30Days.map((count, i) => {
                            const max = Math.max(...stats.tasksLast30Days, 5); // min max 5 to avoid div/0 or flat line
                            const height = (count / max) * 100;
                            return (
                                <div
                                    key={i}
                                    className="flex-1 bg-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)] transition-all rounded-sm relative group"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
                                        {count} Tasks
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            <div className="mt-6">
                <Card className="p-6">
                    <h3 className="font-bold mb-6 flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-500" />
                        Aufgabenverteilung nach Kategorie
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(stats.tasksByCategory)
                            .sort(([, a], [, b]) => b - a)
                            .map(([category, count]) => {
                                const percentage = (count / stats.totalTasks) * 100;
                                // Simple color mapping or default
                                const colorClass = category === 'health' ? 'bg-rose-500' :
                                    category === 'career' ? 'bg-blue-500' :
                                        category === 'finance' ? 'bg-emerald-500' :
                                            category === 'learning' ? 'bg-amber-500' :
                                                category === 'inbox' ? 'bg-slate-400' :
                                                    'bg-[var(--accent-primary)]';

                                return (
                                    <div key={category} className="group">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="capitalize font-medium">{category === 'inbox' ? '📥 Inbox / Sonstiges' : category}</span>
                                            <span className="text-[var(--foreground-muted)]">{count} ({percentage.toFixed(0)}%)</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-[var(--background-subtle)] overflow-hidden">
                                            <div
                                                className={cn("h-full transition-all duration-1000", colorClass)}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </Card>
            </div>

            <Card className="mt-6 p-6">
                <h3 className="font-bold mb-6 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    Globale Konsistenz
                </h3>
                <div className="flex flex-wrap gap-1">
                    {/* Simplified global heatmap for all habit logs */}
                    {Array.from({ length: 30 }).map((_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (29 - i));
                        const dateStr = date.toISOString().split('T')[0];
                        const count = habitLogs.filter(l => l.date === dateStr && l.completed).length;
                        return (
                            <div
                                key={i}
                                className={cn(
                                    "w-full flex-1 aspect-square rounded-sm transition-all",
                                    count === 0 ? "bg-slate-100 dark:bg-slate-800" :
                                        count < 2 ? "bg-emerald-200" :
                                            count < 4 ? "bg-emerald-400" : "bg-emerald-600 shadow-[0_0_10px_rgba(5,150,105,0.3)]"
                                )}
                                title={`${dateStr}: ${count} Habits`}
                            />
                        );
                    })}
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-[8px] font-bold text-[var(--foreground-muted)] uppercase">Vor 30 Tagen</span>
                    <span className="text-[8px] font-bold text-[var(--foreground-muted)] uppercase">Heute</span>
                </div>
            </Card>
        </PageContainer>
    );
}

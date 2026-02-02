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
import { Card, Button } from '@/components/ui';
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

    if (!isHydrated) {
        return (
            <PageContainer>
                <div className="animate-pulse space-y-8">
                    <div className="h-64 bg-[var(--background-elevated)] rounded-[2.5rem]" />
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-[var(--background-elevated)] rounded-2xl" />)}
                    </div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            {/* Header / Meta-Core */}
            <div className="relative mb-16">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
                    <div>
                        <div className="flex items-center gap-6 mb-4">
                            <div className="w-16 h-16 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                                <Activity className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-[var(--foreground)] tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground-muted)]">
                                    Analytik-<span className="text-indigo-500">Kern</span>
                                </h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">System-Modus: Diagnose / Tiefen-Analyse</p>
                                <p className="text-[10px] text-[var(--foreground-muted)] font-medium mt-1">
                                    Analysiere deine Fortschritte, Energie-Level und Muster für eine datengestützte Selbstoptimierung.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:max-w-3xl w-full">
                        <Card variant="glass" className="p-4 md:p-5 rounded-[2rem] border-blue-500/10 bg-blue-500/5 backdrop-blur-xl flex flex-col items-center justify-center text-center">
                            <p className="text-[9px] font-black uppercase tracking-widest text-blue-500 mb-1">Items</p>
                            <p className="text-2xl md:text-3xl font-black tracking-tighter">{stats.completedTasks}</p>
                        </Card>
                        <Card variant="glass" className="p-4 md:p-5 rounded-[2rem] border-amber-500/10 bg-amber-500/5 backdrop-blur-xl flex flex-col items-center justify-center text-center">
                            <p className="text-[9px] font-black uppercase tracking-widest text-amber-500 mb-1">Energie</p>
                            <p className="text-2xl md:text-3xl font-black tracking-tighter">{stats.avgEnergy}</p>
                        </Card>
                        <Card variant="glass" className="p-4 md:p-5 rounded-[2rem] border-emerald-500/10 bg-emerald-500/5 backdrop-blur-xl flex flex-col items-center justify-center text-center">
                            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-1">Rate</p>
                            <p className="text-2xl md:text-3xl font-black tracking-tighter">{stats.taskSuccessRate}%</p>
                        </Card>
                        <Card variant="glass" className="p-4 md:p-5 rounded-[2rem] border-purple-500/10 bg-purple-500/5 backdrop-blur-xl flex flex-col items-center justify-center text-center">
                            <p className="text-[9px] font-black uppercase tracking-widest text-purple-500 mb-1">Score</p>
                            <p className="text-2xl md:text-3xl font-black tracking-tighter text-glow-indigo">8.4</p>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
                {/* Left Side: Insights & Reports */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                        <Zap className="w-6 h-6 text-amber-500 animate-pulse" /> Intelligenz-Feed
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        {insights.map((insight, i) => {
                            const Icon = ICON_MAP[insight.icon] || Activity;
                            const typeStyles = {
                                positive: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500',
                                warning: 'border-amber-500/20 bg-amber-500/5 text-amber-500',
                                info: 'border-blue-500/20 bg-blue-500/5 text-blue-500'
                            };

                            return (
                                <Card key={insight.id} variant="glass" className={cn(
                                    "p-6 rounded-[2rem] relative overflow-hidden group hover:scale-[1.01] transition-all flex items-center gap-6",
                                    typeStyles[insight.type as keyof typeof typeStyles] || typeStyles.info
                                )}>
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                                        insight.type === 'positive' ? 'bg-emerald-500 text-white' :
                                            insight.type === 'warning' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                                    )}>
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-black tracking-tight text-[var(--foreground)] uppercase">{insight.title}</h3>
                                        <p className="text-sm text-[var(--foreground-muted)] font-medium leading-relaxed italic line-clamp-2">
                                            {insight.description}
                                        </p>
                                    </div>
                                    <ArrowUpRight className="w-6 h-6 text-[var(--foreground-muted)] group-hover:text-indigo-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                </Card>
                            );
                        })}
                    </div>

                    {/* Quarterly Report */}
                    <Card variant="glass" className="p-10 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border-indigo-500/20 rounded-[3rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                            <div className="space-y-6 flex-1">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Quartals-Protokoll</span>
                                    </div>
                                    <h3 className="text-4xl font-black text-[var(--foreground)] tracking-tighter uppercase italic leading-none">Status: <span className="text-emerald-500 text-glow-emerald">Höchstform</span></h3>
                                </div>
                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Produktivität</p>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                                            <span className="text-3xl font-black tracking-tighter">+{quarterlyReport.taskGrowth}%</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Top Skill</p>
                                        <div className="flex items-center gap-2">
                                            <Award className="w-5 h-5 text-amber-500" />
                                            <span className="text-3xl font-black tracking-tighter">Elite</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 min-w-[200px]">
                                <Card variant="glass" className="p-4 bg-white/5 border-none shadow-xl rounded-2xl flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                        <Flame className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Hot Streak</p>
                                        <p className="text-sm font-bold truncate">{quarterlyReport.topHabit}</p>
                                    </div>
                                </Card>
                                <Button className="h-14 px-8 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-500/20 group">
                                    Fokus optimieren <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Side: Visual Data & Stats */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                        <Globe className="w-6 h-6 text-indigo-500" /> Lebens-Sphäre
                    </h2>

                    <Card variant="glass" className="p-4 rounded-[3rem] border-white/10 bg-white/5 shadow-2xl relative overflow-visible flex items-center justify-center min-h-[350px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-purple-500/[0.03] pointer-events-none rounded-[3rem]" />
                        <WheelOfLife />
                    </Card>

                    <Card variant="glass" className="p-8 rounded-[2.5rem] border-white/10 bg-white/5 shadow-xl">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-500 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Dynamik (30 Tage)
                        </h3>
                        <div className="flex items-end gap-1.5 h-40">
                            {stats.tasksLast30Days.map((count, i) => {
                                const max = Math.max(...stats.tasksLast30Days, 5);
                                const height = (count / max) * 100;
                                return (
                                    <div
                                        key={i}
                                        className="flex-1 group relative transition-all duration-500"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className={cn(
                                            "absolute inset-0 rounded-full transition-all duration-500",
                                            count === 0 ? "bg-[var(--border)] opacity-20" : "bg-gradient-to-t from-indigo-500 to-purple-400 group-hover:scale-x-125"
                                        )} />
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--background-surface)] border border-[var(--border)] text-[9px] font-black px-3 py-1.5 rounded-xl pointer-events-none whitespace-nowrap z-20 shadow-xl transition-all">
                                            {count} OPS
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between mt-4">
                            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--foreground-muted)] opacity-50">T-30 Days</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-indigo-500">Live Status</span>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Bottom Grid: Distributions & Consistency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                <Card variant="glass" className="p-8 rounded-[3rem] border-white/10 bg-white/5">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-500 mb-8 flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4" /> Ziele-Verteilung
                    </h3>
                    <div className="space-y-6">
                        {Object.entries(stats.tasksByCategory)
                            .sort(([, a], [, b]) => b - a)
                            .map(([category, count]) => {
                                const percentage = (count / stats.totalTasks) * 100;
                                const colorClass = category === 'health' ? 'bg-rose-500 shadow-rose-500/30' :
                                    category === 'career' ? 'bg-blue-500 shadow-blue-500/30' :
                                        category === 'finance' ? 'bg-emerald-500 shadow-emerald-500/30' :
                                            category === 'learning' ? 'bg-amber-500 shadow-amber-500/30' :
                                                category === 'inbox' ? 'bg-slate-400 opacity-50' :
                                                    'bg-indigo-500 shadow-indigo-500/30';

                                return (
                                    <div key={category} className="group cursor-default">
                                        <div className="flex justify-between text-[11px] font-black mb-2 uppercase tracking-wide">
                                            <span className="text-[var(--foreground)]">{category === 'inbox' ? '📥 Puffer' : category}</span>
                                            <span className="text-indigo-500">{percentage.toFixed(0)}%</span>
                                        </div>
                                        <div className="h-3 rounded-full bg-[var(--background-elevated)] overflow-hidden shadow-inner">
                                            <div
                                                className={cn("h-full transition-all duration-1000 ease-out shadow-lg", colorClass)}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </Card>

                <Card variant="glass" className="p-8 rounded-[3rem] border-white/10 bg-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-2">
                            <Activity className="w-4 h-4" /> System-Heatmap (30D)
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-sm bg-[var(--border)]" />
                                <span className="text-[8px] font-bold uppercase text-[var(--foreground-muted)]">Low</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-sm bg-emerald-500" />
                                <span className="text-[8px] font-bold uppercase text-emerald-500">Max</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-10 gap-2">
                        {Array.from({ length: 30 }).map((_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() - (29 - i));
                            const dateStr = date.toISOString().split('T')[0];
                            const count = habitLogs.filter(l => l.date === dateStr && l.completed).length;
                            return (
                                <div
                                    key={i}
                                    className={cn(
                                        "aspect-square rounded-lg transition-all duration-500 hover:scale-125 hover:shadow-xl cursor-default",
                                        count === 0 ? "bg-[var(--background-elevated)] border border-[var(--border)] opacity-20" :
                                            count < 2 ? "bg-emerald-500/20" :
                                                count < 4 ? "bg-emerald-500/60" : "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                    )}
                                    title={`${dateStr}: ${count} Syncs`}
                                />
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-6 pt-6 border-t border-[var(--border-subtle)]">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase text-[var(--foreground-muted)] tracking-widest">Global Stability</span>
                            <span className="text-xl font-black italic tracking-tighter text-emerald-500">OPTIMAL</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[24px] font-black italic tracking-tighter">+12.4%</span>
                            <p className="text-[8px] font-black uppercase text-indigo-500 tracking-widest">Growth Factor</p>
                        </div>
                    </div>
                </Card>
            </div>
        </PageContainer>
    );
}

'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    Plus, CheckCircle2, Circle, Flame, Zap, Droplets,
    ZapOff, Smile, Meh, Frown, MessageSquare,
    ChevronRight, Sparkles, Activity, Target, Clock,
    LayoutGrid, Trash2, Edit3, ArrowUpRight, Brain,
    Coffee, Sun, Moon, Calendar as CalendarIcon,
    TrendingUp, Trophy, RotateCcw
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Input, Slider, Textarea, Dialog, DialogFooter, toast } from '@/components/ui';
import {
    useLifeOSStore,
    useHydration,
    useTodaysTasks,
    useTodaysHabits,
    useTodaysEnergy,
    useTodaysDailyLog,
    useActiveGoals,
    usePreferences
} from '@/stores';
import { cn, getToday, formatDate } from '@/lib/utils';
import { AddTaskDialog } from '@/components/features/AddTaskDialog';
import { EditTaskDialog } from '@/components/features/EditTaskDialog';
import { FocusCockpit } from '@/components/features/FocusCockpit';
import { Task, EnergyLevel, MoodType, SkillType } from '@/types';

export default function TodayPage() {
    const isHydrated = useHydration();
    const [showAddTask, setShowAddTask] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showEnergyDialog, setShowEnergyDialog] = useState(false);
    const [viewMode, setViewMode] = useState<'today' | 'week'>('today');

    // Store data
    const tasks = useTodaysTasks();
    const habits = useTodaysHabits();
    const energy = useTodaysEnergy();
    const dailyLog = useTodaysDailyLog();
    const activeGoals = useActiveGoals();
    const preferences = usePreferences();

    // Store Actions
    const completeTask = useLifeOSStore((s) => s.completeTask);
    const uncompleteTask = useLifeOSStore((s) => s.uncompleteTask);
    const deleteTask = useLifeOSStore((s) => s.deleteTask);
    const toggleHabitForDate = useLifeOSStore((s) => s.toggleHabitForDate);
    const logEnergy = useLifeOSStore((s) => s.logEnergy);
    const updateWaterIntake = useLifeOSStore((s) => s.updateWaterIntake);
    const habitLogs = useLifeOSStore((s) => s.habitLogs);

    const today = getToday();

    // Stats
    const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
    const taskProgress = tasks.length > 0 ? (completedTasksCount / tasks.length) * 100 : 0;

    const masterStreak = preferences?.masterStreak?.current || 0;

    // Time-based greeting
    const [greeting, setGreeting] = useState({ text: 'Guten Tag', icon: <Sun className="w-6 h-6" /> });

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 5) setGreeting({ text: 'Gute Nacht', icon: <Moon className="w-6 h-6" /> });
        else if (hour < 12) setGreeting({ text: 'Guten Morgen', icon: <Coffee className="w-6 h-6" /> });
        else if (hour < 18) setGreeting({ text: 'Guten Tag', icon: <Sun className="w-6 h-6" /> });
        else setGreeting({ text: 'Guten Abend', icon: <Moon className="w-6 h-6" /> });
    }, []);

    if (!isHydrated) {
        return (
            <PageContainer>
                <div suppressHydrationWarning className="animate-pulse space-y-8">
                    <div suppressHydrationWarning className="h-32 bg-[var(--background-elevated)] rounded-[3rem]" />
                    <div suppressHydrationWarning className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div suppressHydrationWarning className="h-40 bg-[var(--background-elevated)] rounded-[2.5rem]" />
                        <div suppressHydrationWarning className="h-40 bg-[var(--background-elevated)] rounded-[2.5rem]" />
                        <div suppressHydrationWarning className="h-40 bg-[var(--background-elevated)] rounded-[2.5rem]" />
                    </div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer width="wide">
            {/* ─── BACKGROUND BLURS ────────────────────────────────────────────────── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-purple-500/5 rounded-full blur-[100px]" />
                <div className="absolute top-[40%] right-[15%] w-[20%] h-[20%] bg-emerald-500/5 rounded-full blur-[80px]" />
            </div>

            {/* ─── HEADER AREA ─────────────────────────────────────────────────── */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[1.8rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-2xl shadow-indigo-500/10">
                        <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p suppressHydrationWarning className="text-[8px] font-black uppercase tracking-[0.4em] text-indigo-500/60 mb-0.5">{new Intl.DateTimeFormat('de-DE', { weekday: 'long' }).format(new Date()).toUpperCase()}</p>
                        <h1 suppressHydrationWarning className="text-3xl font-black text-[var(--foreground)] tracking-tighter italic uppercase leading-none">
                            {new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
                        </h1>
                    </div>
                </div>

                <div className="flex gap-1 p-1.5 bg-[var(--background-surface)] rounded-2xl border border-[var(--border)] shadow-inner">
                    <Button
                        variant={viewMode === 'today' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('today')}
                        className="rounded-xl px-6 font-black uppercase tracking-widest text-[10px]"
                    >
                        Heute
                    </Button>
                    <Button
                        variant={viewMode === 'week' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('week')}
                        className="rounded-xl px-6 font-black uppercase tracking-widest text-[10px]"
                    >
                        Woche
                    </Button>
                </div>
            </div>

            {/* ─── TOP MATRIX GRID ─────────────────────────────────────────────── */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
                {/* SMART BRIEFING CARD (Col-Span-7) */}
                <Card variant="glass" className="lg:col-span-7 p-6 rounded-[2.2rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1.5 h-5 bg-indigo-500 rounded-full" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500">Intelligentes Briefing</span>
                        </div>

                        <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tighter mb-3 italic leading-none">
                            {greeting.text}, <span className="text-indigo-500">{preferences.name}!</span> ✨
                        </h2>
                        <p className="text-[13px] text-[var(--foreground-secondary)] italic mb-8 max-w-xl">
                            "Jede Entscheidung heute formt die Realität von morgen."
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-auto italic">
                            <div className="px-5 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow-emerald animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">System: Optimal</span>
                            </div>

                            <div className="px-5 py-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2.5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500">Aufgaben: <span className="text-white">{completedTasksCount}/{tasks.length}</span></span>
                            </div>

                            <div className="px-5 py-3 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center gap-2.5">
                                <Flame className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">Serie: <span className="text-white">{masterStreak}d</span></span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="space-y-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--foreground-muted)] flex items-center gap-2">
                                    <Zap className="w-3 h-3" /> Zentrale Missionen
                                </span>
                                <div className="h-10 rounded-xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center">
                                    <span className="text-[9px] font-black uppercase opacity-20 italic tracking-widest">Idle</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--foreground-muted)] flex items-center gap-2">
                                    <Target className="w-3 h-3" /> Skill-Fokus
                                </span>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex justify-between items-end mb-1.5">
                                        <span className="text-[9px] font-black uppercase italic">Meister</span>
                                        <span className="text-[9px] font-black text-indigo-500">75%</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                        <div className="h-full bg-indigo-500 w-[75%] shadow-glow-indigo" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--foreground-muted)] flex items-center gap-2">
                                    <Activity className="w-3 h-3" /> Tages-Power
                                </span>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex justify-between items-end mb-1.5">
                                        <span className="text-[9px] font-black uppercase italic">Progress</span>
                                        <span className="text-[9px] font-black text-emerald-500">{Math.round(taskProgress)}%</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                        <div className="h-full bg-emerald-500 shadow-glow-emerald transition-all duration-1000" style={{ width: `${taskProgress}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* FOCUS COCKPIT (Col-Span-5) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    <FocusCockpit />

                    <Card variant="glass" className="flex-1 p-5 rounded-[1.8rem] border-white/5 relative overflow-hidden group">
                        <div className="flex items-center gap-2 mb-3">
                            <Trophy className="w-4 h-4 text-amber-500" />
                            <h3 className="text-lg font-black uppercase italic tracking-tighter">Fokus-Skills</h3>
                        </div>
                        <div className="space-y-4">
                            {(['mental', 'physical', 'social', 'craft', 'soul'] as SkillType[]).map((skillType) => (
                                <div key={skillType} className="group/item">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-[var(--foreground-muted)] group-hover/item:text-[var(--foreground)] transition-colors">
                                            {skillType}
                                        </span>
                                        <span className="text-[9px] font-black text-indigo-500">LVL {preferences.skills[skillType].level}</span>
                                    </div>
                                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000"
                                            style={{ width: `${(preferences.skills[skillType].xp % 1000) / 10}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* ─── ACTION DIAGNOSTIC ROW ────────────────────────────────────────── */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                <Card variant="glass" className="p-4 rounded-2xl border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer" onClick={() => setShowEnergyDialog(true)}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                            {energy?.mood === 'great' ? <Smile className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-amber-500/60 mb-0.5">Energie</p>
                            <p className="text-xs font-black italic uppercase tracking-tight">{energy?.level || '?'}<span className="text-[9px] opacity-40 ml-1"> Status</span></p>
                        </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-all text-indigo-500" />
                </Card>

                <Card variant="glass" className="p-4 rounded-2xl border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                            <Brain className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-indigo-500/60 mb-0.5">Brain Journal</p>
                            <p className="text-xs font-black italic uppercase tracking-tight">{dailyLog ? 'Synchronisiert' : 'Initialisieren'}</p>
                        </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-all text-indigo-500" />
                </Card>

                <Card variant="glass" className="p-4 rounded-2xl border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
                            <Droplets className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-widest text-sky-500/60 mb-0.5">Hydration</p>
                                <p className="text-xs font-black italic uppercase tracking-tight">{dailyLog?.waterIntake || 0}<span className="text-[9px] opacity-40 ml-1">ml</span></p>
                            </div>
                            <button
                                onClick={() => updateWaterIntake(today, 0)}
                                className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-rose-500 hover:bg-rose-500/10 transition-all border border-rose-500/20"
                                title="Auf 0 zurücksetzen"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                        <button
                            onClick={() => updateWaterIntake(today, Math.max(0, (dailyLog?.waterIntake || 0) - 100))}
                            className="px-2.5 py-1.5 rounded-lg bg-black text-white text-[9px] font-black hover:bg-rose-600 transition-all border border-white/10"
                        >
                            -100
                        </button>
                        {[150, 200, 250].map(amt => (
                            <button
                                key={amt}
                                onClick={() => updateWaterIntake(today, (dailyLog?.waterIntake || 0) + amt)}
                                className="px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-500 text-[9px] font-black border border-sky-500/20 hover:bg-sky-500 hover:text-white transition-all"
                            >
                                +{amt}
                            </button>
                        ))}
                    </div>
                </Card>
            </div>

            {/* ─── HANDLUNGSEBENE ──────────────────────────────────────────────── */}
            <div className="relative z-10 flex items-center gap-4 mb-6 px-4">
                <div className="w-2 h-8 bg-indigo-500 rounded-full shadow-glow-indigo" />
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">Handlungsebene</h2>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 mb-32">
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between mb-2 px-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                        <span>Aktive Missionen</span>
                        <Button
                            onClick={() => setShowAddTask(true)}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white gap-2 h-9 px-4 rounded-xl font-black uppercase tracking-widest text-[8px] shadow-lg shadow-indigo-500/20"
                        >
                            <Plus className="w-3.5 h-3.5" /> Neue Mission
                        </Button>
                    </div>

                    {tasks.length === 0 ? (
                        <Card variant="glass" className="p-20 border-dashed border-white/10 flex flex-col items-center justify-center rounded-[3rem]">
                            <ZapOff className="w-16 h-16 text-white/5 mb-6" />
                            <p className="text-sm font-black uppercase italic tracking-widest text-white/20">System Idle: Warte auf Befehle</p>
                        </Card>
                    ) : (
                        tasks.sort((a, b) => a.status === 'completed' ? 1 : -1).map((task, i) => (
                            <Card
                                key={task.id}
                                variant="glass"
                                className={cn(
                                    "group p-4 rounded-[1.5rem] border-white/5 transition-all duration-500 hover:border-indigo-500/30",
                                    task.status === 'completed' && "opacity-40 grayscale-[0.5]"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => task.status === 'completed' ? uncompleteTask(task.id) : completeTask(task.id)}
                                        className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl",
                                            task.status === 'completed'
                                                ? "bg-emerald-500 text-white"
                                                : "bg-[var(--background-elevated)] border border-[var(--border)] text-[var(--foreground-muted)] hover:text-indigo-500 hover:border-indigo-500"
                                        )}
                                    >
                                        {task.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <h3 className={cn(
                                            "text-lg font-black tracking-tight mb-0.5 truncate transition-all duration-500",
                                            task.status === 'completed' && "line-through italic opacity-50"
                                        )}>
                                            {task.title}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <div className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 text-[7px] font-black uppercase tracking-widest">
                                                {task.skillId || 'Allgemein'}
                                            </div>
                                            {task.priority === 'high' && (
                                                <div className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 text-[7px] font-black uppercase tracking-widest animate-pulse">
                                                    Prio
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" onClick={() => setEditingTask(task)} className="h-8 w-8">
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                <div className="lg:col-span-4 space-y-5">
                    <Card variant="glass" className="p-6 rounded-[2rem] border-white/5 bg-gradient-to-br from-indigo-500/[0.03] to-purple-500/[0.03]">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white mb-4 shadow-xl shadow-indigo-500/20">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-1">Intelligenter Einblick</h4>
                        <h3 className="text-xl font-black tracking-tighter italic mb-3">Optimiere deinen <span className="text-indigo-500">Vormittag</span></h3>
                        <p className="text-[11px] text-[var(--foreground-secondary)] leading-relaxed italic opacity-80">
                            "Erledige deine komplexeste Mission zuerst. Nutze das Fenster für Fokus-Arbeit."
                        </p>
                        <Button variant="ghost" className="mt-6 p-0 text-indigo-500 font-black uppercase tracking-widest text-[8px] hover:bg-transparent hover:translate-x-1 transition-transform">
                            Weiterlesen <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                    </Card>

                    <Card variant="glass" className="p-6 rounded-[2rem] border-white/5">
                        <div className="flex items-center gap-2.5 mb-4">
                            <Target className="w-4 h-4 text-indigo-500" />
                            <h3 className="text-md font-black uppercase italic tracking-tighter text-[var(--foreground)]">Fokusbereiche</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['Arbeit', 'Gesundheit', 'Lernen', 'Finanzen'].map(area => (
                                <button key={area} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-[var(--foreground-muted)] hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all">
                                    {area}
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* ─── DIALOGS ────────────────────────────────────────────────────── */}
            <AddTaskDialog open={showAddTask} onClose={() => setShowAddTask(false)} />
            <EditTaskDialog task={editingTask} open={!!editingTask} onClose={() => setEditingTask(null)} />

            <Dialog
                open={showEnergyDialog}
                onClose={() => setShowEnergyDialog(false)}
                title="Energy Update"
            >
                <div className="space-y-8 py-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Energy Level</label>
                            <span className="text-2xl font-black text-indigo-500">{energy?.level || 3}</span>
                        </div>
                        <Slider
                            value={[(energy?.level || 3)]}
                            max={5}
                            min={1}
                            step={1}
                            onValueChange={([val]) => logEnergy(today, val as EnergyLevel, energy?.mood || 'neutral')}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Neuro-Mood Status</label>
                        <div className="grid grid-cols-5 gap-3">
                            {(['great', 'good', 'neutral', 'low', 'bad'] as MoodType[]).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => logEnergy(today, energy?.level || 3, m)}
                                    className={cn(
                                        "py-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2",
                                        energy?.mood === m
                                            ? "border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                                            : "border-[var(--background-elevated)] bg-[var(--background-elevated)] text-[var(--foreground-muted)] hover:border-indigo-500/30"
                                    )}
                                >
                                    <span className="text-[8px] font-black uppercase tracking-widest">{m}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button className="w-full h-14 rounded-2xl bg-indigo-500 hover:bg-indigo-600 font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20" onClick={() => setShowEnergyDialog(false)}>
                            Diagnostic complete
                        </Button>
                    </DialogFooter>
                </div>
            </Dialog>
        </PageContainer>
    );
}

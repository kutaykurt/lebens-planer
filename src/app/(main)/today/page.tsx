'use client';

import { useState, useEffect } from 'react';
import {
    Plus, CheckCircle2, Circle, Flame,
    ZapOff, Trash2, Edit3,
    Coffee, Sun, Moon, Calendar as CalendarIcon, Repeat
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, toast } from '@/components/ui';
import {
    useLifeOSStore,
    useHydration,
    useTodaysTasks,
    useTodaysHabits,
    usePreferences
} from '@/stores';
import { cn, getToday } from '@/lib/utils';
import { AddTaskDialog } from '@/components/features/AddTaskDialog';
import { EditTaskDialog } from '@/components/features/EditTaskDialog';
import { Task } from '@/types';

export default function TodayPage() {
    const isHydrated = useHydration();
    const [showAddTask, setShowAddTask] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

    // Store data
    const tasks = useTodaysTasks();
    const habits = useTodaysHabits();
    const preferences = usePreferences();

    // Store Actions
    const completeTask = useLifeOSStore((s) => s.completeTask);
    const uncompleteTask = useLifeOSStore((s) => s.uncompleteTask);
    const deleteTask = useLifeOSStore((s) => s.deleteTask);
    const toggleHabitForDate = useLifeOSStore((s) => s.toggleHabitForDate);
    const habitLogs = useLifeOSStore((s) => s.habitLogs);

    const today = getToday();

    // Stats
    const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
    const completedHabitsCount = habits.filter(h =>
        habitLogs.some(l => l.habitId === h.id && l.date === today && l.completed)
    ).length;

    // Time-based greeting
    const [greeting, setGreeting] = useState('Guten Tag');

    const handleDeleteTask = (id: string) => {
        deleteTask(id);
        setDeletingTaskId(null);
        toast.success('Aufgabe gelöscht');
    };

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 5) setGreeting('Gute Nacht');
        else if (hour < 12) setGreeting('Guten Morgen');
        else if (hour < 18) setGreeting('Guten Tag');
        else setGreeting('Guten Abend');
    }, []);

    if (!isHydrated) {
        return (
            <PageContainer>
                <div className="animate-pulse space-y-6">
                    <div className="h-24 bg-[var(--background-elevated)] rounded-3xl" />
                    <div className="h-64 bg-[var(--background-elevated)] rounded-3xl" />
                    <div className="h-48 bg-[var(--background-elevated)] rounded-3xl" />
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            {/* ─── HEADER ─────────────────────────────────────────────────────── */}
            <div className="mb-8">
                <p className="text-sm text-[var(--foreground-muted)] mb-1">
                    {new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}
                </p>
                <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
                    {greeting}, <span className="text-[var(--accent-primary)]">{preferences.name}</span>! 👋
                </h1>
            </div>

            {/* ─── QUICK STATS ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <Card className="p-4 text-center">
                    <p className="text-3xl font-bold text-[var(--accent-primary)]">{completedTasksCount}/{tasks.length}</p>
                    <p className="text-sm text-[var(--foreground-muted)]">Aufgaben erledigt</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-3xl font-bold text-emerald-500">{completedHabitsCount}/{habits.length}</p>
                    <p className="text-sm text-[var(--foreground-muted)]">Gewohnheiten</p>
                </Card>
            </div>

            {/* ─── AUFGABEN ───────────────────────────────────────────────────── */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5 text-[var(--accent-primary)]" />
                        <h2 className="text-xl font-bold text-[var(--foreground)]">Heutige Aufgaben</h2>
                    </div>
                    <Button onClick={() => setShowAddTask(true)} size="sm" className="gap-2">
                        <Plus className="w-4 h-4" /> Neue Aufgabe
                    </Button>
                </div>

                <div className="space-y-3">
                    {tasks.length === 0 ? (
                        <Card className="p-12 text-center border-dashed">
                            <ZapOff className="w-12 h-12 text-[var(--foreground-muted)] mx-auto mb-4 opacity-30" />
                            <p className="text-[var(--foreground-muted)]">Keine Aufgaben für heute</p>
                            <Button onClick={() => setShowAddTask(true)} variant="ghost" className="mt-4 gap-2">
                                <Plus className="w-4 h-4" /> Aufgabe hinzufügen
                            </Button>
                        </Card>
                    ) : (
                        tasks.sort((a, b) => a.status === 'completed' ? 1 : -1).map((task) => (
                            <Card
                                key={task.id}
                                className={cn(
                                    "p-4 flex items-center gap-4 group transition-all",
                                    task.status === 'completed' && "opacity-50"
                                )}
                            >
                                <button
                                    onClick={() => task.status === 'completed' ? uncompleteTask(task.id) : completeTask(task.id)}
                                    className="shrink-0"
                                >
                                    {task.status === 'completed' ? (
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                    ) : (
                                        <Circle className="w-6 h-6 text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] transition-colors" />
                                    )}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        "font-medium text-[var(--foreground)] truncate",
                                        task.status === 'completed' && "line-through"
                                    )}>
                                        {task.title}
                                    </p>
                                    {task.priority === 'high' && (
                                        <span className="text-xs text-rose-500 font-medium">Hohe Priorität</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" onClick={() => setEditingTask(task)} className="h-8 w-8">
                                        <Edit3 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => setDeletingTaskId(task.id)} className="h-8 w-8 text-rose-500 hover:text-rose-600">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* ─── GEWOHNHEITEN ────────────────────────────────────────────────── */}
            {habits.length > 0 && (
                <div className="mb-32">
                    <div className="flex items-center gap-3 mb-4">
                        <Repeat className="w-5 h-5 text-emerald-500" />
                        <h2 className="text-xl font-bold text-[var(--foreground)]">Gewohnheiten</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {habits.map((habit) => {
                            const isDone = habitLogs.some(l => l.habitId === habit.id && l.date === today && l.completed);
                            return (
                                <Card
                                    key={habit.id}
                                    className={cn(
                                        "p-4 flex items-center gap-4 cursor-pointer transition-all hover:border-emerald-500/30",
                                        isDone && "bg-emerald-500/10 border-emerald-500/20"
                                    )}
                                    onClick={() => toggleHabitForDate(habit.id, today)}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                        isDone ? "bg-emerald-500 text-white" : "bg-[var(--background-elevated)]"
                                    )}>
                                        {isDone ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : (
                                            <Flame className="w-5 h-5 text-[var(--foreground-muted)]" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className={cn(
                                            "font-medium",
                                            isDone ? "text-emerald-600" : "text-[var(--foreground)]"
                                        )}>
                                            {habit.title}
                                        </p>
                                        <p className="text-xs text-[var(--foreground-muted)]">
                                            Serie: {habit.currentStreak || 0} Tage
                                        </p>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ─── DIALOGS ────────────────────────────────────────────────────── */}
            <AddTaskDialog open={showAddTask} onClose={() => setShowAddTask(false)} />
            <EditTaskDialog task={editingTask} open={!!editingTask} onClose={() => setEditingTask(null)} />

            {/* Delete Confirmation */}
            {deletingTaskId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-bold mb-2">Aufgabe löschen?</h3>
                        <p className="text-[var(--foreground-muted)] mb-6">Diese Aktion kann nicht rückgängig gemacht werden.</p>
                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={() => setDeletingTaskId(null)} className="flex-1">
                                Abbrechen
                            </Button>
                            <Button variant="destructive" onClick={() => handleDeleteTask(deletingTaskId)} className="flex-1">
                                Löschen
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </PageContainer>
    );
}

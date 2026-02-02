'use client';

import { useState, useMemo } from 'react';
import {
    ChevronLeft, ChevronRight, Calendar as CalendarIcon,
    Plus, CheckCircle2, AlertCircle, Trash2, CalendarDays,
    Sparkles, Target, Activity, Zap
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Dialog, DialogFooter, toast } from '@/components/ui';
import { useLifeOSStore, useHydration } from '@/stores';
import {
    formatDate, getMonthStart, getMonthEnd,
    addDays, subtractDays, isToday, getToday,
    formatDateShort, cn
} from '@/lib/utils';
import { Task } from '@/types';
import { AddTaskDialog } from '@/components/features/AddTaskDialog';
import { EditTaskDialog } from '@/components/features/EditTaskDialog';
import { CalendarTaskDialog } from '@/components/features/CalendarTaskDialog';

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDayDialogOpen, setIsDayDialogOpen] = useState(false);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [addTaskInitialDate, setAddTaskInitialDate] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

    const tasks = useLifeOSStore((s) => s.tasks);
    const completeTask = useLifeOSStore((s) => s.completeTask);
    const uncompleteTask = useLifeOSStore((s) => s.uncompleteTask);
    const deleteTask = useLifeOSStore((s) => s.deleteTask);
    const isHydrated = useHydration();

    const monthData = useMemo(() => {
        const start = getMonthStart(currentDate);
        const end = getMonthEnd(currentDate);
        const days = [];

        // Find the Monday of the week containing the first day
        const firstDay = start.getDay();
        const diff = start.getDate() - firstDay + (firstDay === 0 ? -6 : 1);
        const calendarStart = new Date(new Date(start).setDate(diff));

        // Generate 42 days (6 weeks)
        for (let i = 0; i < 42; i++) {
            const date = addDays(calendarStart, i);
            const dateStr = formatDate(date);
            days.push({
                date: new Date(date),
                dateStr,
                isCurrentMonth: date.getMonth() === currentDate.getMonth(),
                isToday: isToday(dateStr),
                tasks: tasks.filter(t => t.scheduledDate === dateStr && t.status !== 'cancelled')
            });
        }
        return days;
    }, [currentDate, tasks]);

    if (!isHydrated) return null;

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    const monthName = currentDate.toLocaleString('de-DE', { month: 'long' });
    const year = currentDate.getFullYear();

    const handleDayClick = (day: typeof monthData[0]) => {
        setSelectedDate(day.date);
        setIsDayDialogOpen(true);
    };

    const handleAddTask = (dateStr: string) => {
        setAddTaskInitialDate(dateStr);
        setIsAddTaskOpen(true);
    };

    const handleToggleTask = (task: Task) => {
        if (task.status === 'completed') {
            uncompleteTask(task.id);
        } else {
            completeTask(task.id);
            toast.success('Mission erfüllt! ✨');
        }
    };

    const confirmDelete = () => {
        if (deletingTaskId) {
            deleteTask(deletingTaskId);
            setDeletingTaskId(null);
            toast.success('Aufgabe gelöscht');
        }
    };

    const selectedDayTasks = selectedDate
        ? tasks.filter(t => t.scheduledDate === formatDate(selectedDate) && t.status !== 'cancelled')
        : [];

    return (
        <PageContainer>
            <div className="relative mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="relative">
                        <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="flex items-center gap-5 mb-4 animate-fade-in-up">
                            <div className="w-14 h-14 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/20">
                                <CalendarDays className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-[var(--foreground)] tracking-tighter uppercase italic">
                                    <span className="electric-text">Kalender</span>
                                </h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Operation: Future Planning</p>
                                <p className="text-[10px] text-[var(--foreground-muted)] font-medium mt-1">
                                    Behalte den Überblick über deine Aufgaben und plane vorausschauend.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-[var(--background-surface)] p-2 rounded-[2rem] border border-[var(--border)] shadow-xl animate-fade-in-up stagger-1">
                        <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-2xl hover:bg-indigo-500/10 hover:text-indigo-500 transition-all">
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <div className="flex flex-col items-center px-6 min-w-[140px]">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">{year}</span>
                            <span className="text-xl font-black uppercase italic tracking-tighter">{monthName}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-2xl hover:bg-indigo-500/10 hover:text-indigo-500 transition-all">
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                        <div className="w-px h-8 bg-[var(--border)] mx-2" />
                        <Button
                            onClick={goToToday}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest px-6 rounded-2xl h-10 shadow-lg shadow-indigo-500/20"
                        >
                            Heute
                        </Button>
                    </div>
                </div>
            </div>

            <Card variant="glass" className="p-1 rounded-[3.5rem] border-white/10 shadow-2xl overflow-hidden bg-white/5 dark:bg-slate-900/10 backdrop-blur-2xl animate-fade-in-up stagger-2">
                <div className="grid grid-cols-7 gap-px bg-[var(--border)]/20">
                    {/* Weekday headers */}
                    {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
                        <div key={day} className="bg-[var(--background-surface)]/50 py-4 text-center backdrop-blur-md">
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--foreground-muted)]">{day}</span>
                        </div>
                    ))}

                    {/* Days */}
                    {monthData.map((day, i) => (
                        <div
                            key={day.dateStr}
                            onClick={() => handleDayClick(day)}
                            className={cn(
                                "min-h-[140px] bg-[var(--background-surface)]/30 p-4 transition-all group cursor-pointer relative overflow-hidden",
                                "hover:bg-indigo-500/[0.03] active:scale-[0.98]",
                                !day.isCurrentMonth && "opacity-20 grayscale-[0.5]",
                                day.isCurrentMonth && "hover:shadow-inner"
                            )}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className={cn(
                                    "w-9 h-9 flex items-center justify-center rounded-2xl text-sm font-black transition-all",
                                    day.isToday
                                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-110"
                                        : "text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] group-hover:bg-[var(--background-elevated)]"
                                )}>
                                    {day.date.getDate()}
                                </span>
                                {day.tasks.length > 0 && (
                                    <div className="flex gap-1">
                                        {day.tasks.some(t => t.priority === 'high' && t.status !== 'completed') && (
                                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                                        )}
                                        <span className="text-[10px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/10">
                                            {day.tasks.length}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5 relative z-10">
                                {day.tasks.slice(0, 3).map(task => (
                                    <div
                                        key={task.id}
                                        className={cn(
                                            "text-[10px] px-2.5 py-1.5 rounded-xl border truncate font-bold uppercase tracking-tight transition-all",
                                            task.status === 'completed'
                                                ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-500/60 line-through"
                                                : task.priority === 'high'
                                                    ? "bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-sm"
                                                    : "bg-[var(--background-elevated)] border-[var(--border)] text-[var(--foreground)]"
                                        )}
                                    >
                                        {task.title}
                                    </div>
                                ))}
                                {day.tasks.length > 3 && (
                                    <p className="text-[9px] text-[var(--foreground-muted)] font-black uppercase tracking-widest text-center mt-2 opacity-50">
                                        + {day.tasks.length - 3} weitere
                                    </p>
                                )}
                            </div>

                            {/* Hover background effect */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </div>
                    ))}
                </div>
            </Card>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up stagger-3">
                <Card variant="glass" className="p-8 border-amber-500/20 bg-amber-500/5 rounded-3xl relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Kapazität</p>
                            <h3 className="text-xl font-black tracking-tight">{tasks.filter(t => t.scheduledDate?.startsWith(currentDate.toISOString().slice(0, 7))).length} Missionen</h3>
                        </div>
                    </div>
                </Card>

                <Card variant="glass" className="p-8 border-emerald-500/20 bg-emerald-500/5 rounded-3xl relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Erfolgsquote</p>
                            <h3 className="text-xl font-black tracking-tight">
                                {tasks.filter(t => t.scheduledDate?.startsWith(currentDate.toISOString().slice(0, 7)) && t.status === 'completed').length} Abgeschlossen
                            </h3>
                        </div>
                    </div>
                </Card>

                <Card variant="glass" className="p-8 border-indigo-500/20 bg-indigo-500/5 rounded-3xl relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Fokus-Status</p>
                            <h3 className="text-xl font-black tracking-tight">System Aktiv</h3>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Dialogs */}
            <CalendarTaskDialog
                open={isDayDialogOpen}
                onClose={() => setIsDayDialogOpen(false)}
                date={selectedDate}
                tasks={selectedDayTasks}
                onAddTask={handleAddTask}
                onEditTask={(task) => {
                    setEditingTask(task);
                    setIsDayDialogOpen(false);
                }}
                onDeleteTask={(id) => {
                    setDeletingTaskId(id);
                    setIsDayDialogOpen(false);
                }}
                onToggleTask={handleToggleTask}
            />

            <AddTaskDialog
                open={isAddTaskOpen}
                initialDate={addTaskInitialDate}
                onClose={() => setIsAddTaskOpen(false)}
            />

            <EditTaskDialog
                open={!!editingTask}
                task={editingTask}
                onClose={() => setEditingTask(null)}
            />

            <Dialog
                open={!!deletingTaskId}
                onClose={() => setDeletingTaskId(null)}
                title="Mission entfernen?"
                description="Diese Mission wird dauerhaft aus der Datenbank gelöscht."
            >
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setDeletingTaskId(null)}>
                        Abbrechen
                    </Button>
                    <Button variant="destructive" onClick={confirmDelete}>
                        Löschen
                    </Button>
                </DialogFooter>
            </Dialog>
        </PageContainer>
    );
}

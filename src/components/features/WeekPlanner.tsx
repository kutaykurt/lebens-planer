'use client';

import { useMemo } from 'react';
import {
    Calendar, ChevronLeft, ChevronRight,
    CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { useLifeOSStore } from '@/stores';
import {
    formatDate, getWeekStart, addDays,
    getWeekdayName, isToday, getToday,
    formatDateShort, cn
} from '@/lib/utils';
import { Task } from '@/types';

export function WeekPlanner() {
    const tasks = useLifeOSStore((s) => s.tasks);
    const updateTask = useLifeOSStore((s) => s.updateTask);
    const today = new Date();
    const startOfWeek = getWeekStart(today);

    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = addDays(startOfWeek, i);
            const dateStr = formatDate(date);
            return {
                date,
                dateStr,
                dayName: getWeekdayName(i, 'short'),
                isToday: isToday(dateStr),
                tasks: tasks.filter(t => t.scheduledDate === dateStr && t.status !== 'cancelled')
            };
        });
    }, [tasks, startOfWeek]);

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        e.dataTransfer.setData('taskId', taskId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (e: React.DragEvent, dateStr: string) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            updateTask(taskId, { scheduledDate: dateStr });
            // toast.success('Verschoben!');
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => (
                    <div
                        key={day.dateStr}
                        className="flex flex-col items-center"
                        onDrop={(e) => handleDrop(e, day.dateStr)}
                        onDragOver={handleDragOver}
                    >
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest mb-2",
                            day.isToday ? "text-[var(--accent-primary)]" : "text-[var(--foreground-secondary)]"
                        )}>
                            {day.dayName}
                        </span>
                        <div className={cn(
                            "w-full aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all",
                            day.isToday
                                ? "bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] border-transparent text-white shadow-lg shadow-[var(--accent-primary)]/20 shadow-glow-primary"
                                : "bg-[var(--background-surface)] border-[var(--border)] text-[var(--foreground)]"
                        )}>
                            <span className="text-lg font-black leading-none">{day.date.getDate()}</span>
                            <span className="text-[8px] opacity-70 mt-1 uppercase font-bold">{formatDateShort(day.date).split('.')[1]}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                {weekDays.map((day) => (
                    <div
                        key={`list-${day.dateStr}`}
                        className={cn(
                            "relative pl-6 border-l-2 transition-colors duration-300",
                            day.isToday ? "border-[var(--accent-primary)]" : "border-[var(--border)] hover:border-[var(--accent-primary)]/30"
                        )}
                        onDrop={(e) => handleDrop(e, day.dateStr)}
                        onDragOver={handleDragOver}
                    >
                        {day.isToday && (
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[var(--accent-primary)] ring-4 ring-[var(--background)]" />
                        )}
                        <h3 className={cn(
                            "text-sm font-black uppercase tracking-widest mb-3",
                            day.isToday ? "text-[var(--accent-primary)]" : "text-[var(--foreground-muted)]"
                        )}>
                            {day.dateStr === getToday() ? 'Heute' : formatDateLong(day.date).split(',')[0]}
                        </h3>

                        {day.tasks.length === 0 ? (
                            <div className="min-h-[40px] flex items-center">
                                <p className="text-xs text-[var(--foreground-muted)] italic mb-6">Keine Aufgaben geplant</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-2 mb-6 min-h-[40px]">
                                {day.tasks.map(task => (
                                    <div
                                        key={task.id}
                                        draggable={task.status !== 'completed'}
                                        onDragStart={(e) => handleDragStart(e, task.id)}
                                        className={cn(
                                            "p-3 rounded-xl border border-[var(--border)] bg-[var(--background-surface)] flex items-center justify-between group",
                                            task.status === 'completed' ? "opacity-60 cursor-default" : "cursor-grab active:cursor-grabbing hover:border-[var(--accent-primary)]/50 hover:shadow-md transition-all active:scale-[0.98]"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                task.priority === 'high' ? "bg-red-500" : task.priority === 'low' ? "bg-blue-400" : "bg-amber-400"
                                            )} />
                                            <span className={cn(
                                                "text-sm font-medium",
                                                task.status === 'completed' && "line-through text-[var(--foreground-muted)]"
                                            )}>
                                                {task.title}
                                            </span>
                                        </div>
                                        {task.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function formatDateLong(date: Date): string {
    return date.toLocaleDateString('de-DE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
}

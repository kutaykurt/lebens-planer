'use client';

import { Task } from '@/types';
import { Dialog, Button, Card } from '@/components/ui';
import { CheckCircle2, AlertCircle, Plus, Edit3, Trash2, Clock } from 'lucide-react';
import { cn, formatDateLong } from '@/lib/utils';
import { SKILL_OPTIONS } from '@/lib/constants';

interface CalendarTaskDialogProps {
    date: Date | null;
    tasks: Task[];
    open: boolean;
    onClose: () => void;
    onAddTask: (date: string) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    onToggleTask: (task: Task) => void;
}

export function CalendarTaskDialog({
    date,
    tasks,
    open,
    onClose,
    onAddTask,
    onEditTask,
    onDeleteTask,
    onToggleTask
}: CalendarTaskDialogProps) {
    if (!date) return null;

    const dateStr = date.toISOString().split('T')[0];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            title={formatDateLong(date)}
            description="Missionen und Ziele für diesen Tag"
        >
            <div className="space-y-6 py-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[var(--foreground-muted)]">
                        {tasks.length} {tasks.length === 1 ? 'Mission' : 'Missionen'}
                    </h3>
                    <Button
                        size="sm"
                        onClick={() => onAddTask(dateStr)}
                        className="gap-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl h-9"
                    >
                        <Plus className="w-4 h-4" /> Mission hinzufügen
                    </Button>
                </div>

                <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {tasks.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-[var(--border)] rounded-3xl">
                            <Clock className="w-10 h-10 text-[var(--foreground-muted)] mx-auto mb-3 opacity-20" />
                            <p className="text-sm text-[var(--foreground-muted)] font-medium">Keine Missionen für diesen Tag geplant.</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <div
                                key={task.id}
                                className={cn(
                                    "group flex items-center gap-4 p-4 rounded-2xl border transition-all",
                                    task.status === 'completed'
                                        ? "bg-emerald-500/5 border-emerald-500/10 opacity-75"
                                        : "bg-[var(--background-surface)] border-[var(--border)] hover:border-indigo-500/30"
                                )}
                            >
                                <button
                                    onClick={() => onToggleTask(task)}
                                    className={cn(
                                        "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                                        task.status === 'completed'
                                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                            : "border-2 border-[var(--border-strong)] hover:border-indigo-500"
                                    )}
                                >
                                    {task.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className={cn(
                                            "font-bold truncate text-sm tracking-tight",
                                            task.status === 'completed' && "line-through text-[var(--foreground-muted)]"
                                        )}>
                                            {task.title}
                                        </p>
                                        {task.priority === 'high' && (
                                            <AlertCircle className="w-3 h-3 text-rose-500" />
                                        )}
                                    </div>
                                    {task.skillId && (
                                        <span className="text-[10px] font-black uppercase text-indigo-500/60 tracking-wider">
                                            {SKILL_OPTIONS.find(s => s.value === task.skillId)?.label}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-8 h-8 rounded-lg"
                                        onClick={() => onEditTask(task)}
                                    >
                                        <Edit3 className="w-4 h-4 text-[var(--foreground-muted)]" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-500/10"
                                        onClick={() => onDeleteTask(task.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Dialog>
    );
}

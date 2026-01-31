'use client';

import { useState, useMemo } from 'react';
import {
    ChevronLeft, ChevronRight, Calendar as CalendarIcon,
    Plus, CheckCircle2, AlertCircle
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { useLifeOSStore, useHydration } from '@/stores';
import {
    formatDate, getMonthStart, getMonthEnd,
    addDays, subtractDays, isToday, getToday,
    formatDateShort, cn
} from '@/lib/utils';
import { Task } from '@/types';

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const tasks = useLifeOSStore((s) => s.tasks);
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
                date,
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

    const monthName = currentDate.toLocaleString('de-DE', { month: 'long', year: 'numeric' });

    return (
        <PageContainer>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tighter">Zeit-Matrix</h1>
                    <p className="text-[var(--foreground-secondary)]">Plane deine Zukunft, archiviere deine Siege</p>
                </div>

                <div className="flex items-center gap-2 bg-[var(--background-elevated)] p-1 rounded-2xl border border-[var(--border)]">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-xl">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <button
                        onClick={goToToday}
                        className="px-4 py-1.5 text-sm font-bold text-[var(--foreground)] hover:bg-[var(--background-surface)] rounded-xl transition-colors"
                    >
                        {monthName}
                    </button>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-xl">
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-[var(--border)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xl shadow-black/20">
                {/* Weekday headers */}
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
                    <div key={day} className="bg-[var(--background-surface)] py-3 text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">{day}</span>
                    </div>
                ))}

                {/* Days */}
                {monthData.map((day, i) => (
                    <div
                        key={day.dateStr}
                        className={cn(
                            "min-h-[120px] bg-[var(--background-surface)] p-2 transition-all group hover:bg-[var(--background-elevated)]/50",
                            !day.isCurrentMonth && "bg-[var(--background-surface)]/30 opacity-40"
                        )}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={cn(
                                "w-7 h-7 flex items-center justify-center rounded-full text-sm font-black transition-all",
                                day.isToday
                                    ? "bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/30 scale-110"
                                    : "text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]"
                            )}>
                                {day.date.getDate()}
                            </span>
                            {day.tasks.length > 0 && (
                                <span className="text-[10px] font-black text-[var(--accent-primary)] bg-[var(--accent-primary-light)] px-1.5 py-0.5 rounded-md">
                                    {day.tasks.length}
                                </span>
                            )}
                        </div>

                        <div className="space-y-1">
                            {day.tasks.slice(0, 3).map(task => (
                                <div
                                    key={task.id}
                                    className={cn(
                                        "text-[9px] px-1.5 py-1 rounded-md border truncate font-bold uppercase tracking-tighter",
                                        task.status === 'completed'
                                            ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-500/70 line-through"
                                            : task.priority === 'high'
                                                ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
                                                : "bg-blue-500/10 border-blue-500/20 text-blue-500"
                                    )}
                                >
                                    {task.title}
                                </div>
                            ))}
                            {day.tasks.length > 3 && (
                                <p className="text-[8px] text-[var(--foreground-muted)] font-black text-center mt-1">
                                    + {day.tasks.length - 3} weitere
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="gradient" className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[var(--foreground)]">Fokus-Check</h3>
                            <p className="text-sm text-[var(--foreground-secondary)]">
                                Du hast diesen Monat <span className="font-bold text-[var(--accent-primary)]">{tasks.filter(t => t.scheduledDate?.startsWith(currentDate.toISOString().slice(0, 7))).length} Aufgaben</span> geplant.
                            </p>
                        </div>
                    </div>
                </Card>
                <Card variant="gradient" className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[var(--foreground)]">Erfolge</h3>
                            <p className="text-sm text-[var(--foreground-secondary)]">
                                {tasks.filter(t => t.scheduledDate?.startsWith(currentDate.toISOString().slice(0, 7)) && t.status === 'completed').length} Aufgaben erfolgreich abgeschlossen.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </PageContainer>
    );
}

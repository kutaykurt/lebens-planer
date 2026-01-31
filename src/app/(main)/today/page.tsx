'use client';

import { useState, useEffect } from 'react';
import {
    CheckCircle2, AlertCircle, Zap, Plus, Sparkles, Calendar,
    ArrowRight, Edit3, Trash2, Smile, Heart, Star, BookOpen, Repeat, Box, FastForward
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Dialog, DialogFooter, Input, Textarea, Checkbox, Select, toast, SwipeableItem } from '@/components/ui';
import {
    useLifeOSStore,
    useTodaysTasks,
    useOverdueTasks,
    useTodaysHabits,
    useTodaysEnergy,
    useTodaysDailyLog,
    useIsHabitCompleted,
    useHydration,
    useInboxTasks,
    usePreferences,
} from '@/stores';
import { formatDateLong, formatDate, getToday, cn } from '@/lib/utils';
import type { Task, Habit, EnergyLevel, DailyLog, MoodType, SkillType, RecurrencePattern, Tag } from '@/types';
import { ENERGY_LEVEL_EMOJIS, MOOD_EMOJIS } from '@/types';
import { FocusCockpit } from '@/components/features/FocusCockpit';
import { SmartBriefing } from '@/components/features/SmartBriefing';
import { WeekPlanner } from '@/components/features/WeekPlanner';
import { TagSelector } from '@/components/features/TagSelector';
import { StreakWidget } from '@/components/features/StreakWidget';

const SKILL_OPTIONS = [
    { value: 'mental', label: '🧠 Geist', color: 'bg-blue-500' },
    { value: 'physical', label: '💪 Körper', color: 'bg-red-500' },
    { value: 'social', label: '🤝 Sozial', color: 'bg-green-500' },
    { value: 'craft', label: '🛠️ Handwerk', color: 'bg-amber-500' },
    { value: 'soul', label: '✨ Seele', color: 'bg-purple-500' },
];

// ─── Energy Check-In Component ───────────────────────────────────────────────

function EnergyCheckIn({ compact = false }: { compact?: boolean }) {
    const todayEnergy = useTodaysEnergy();
    const logEnergy = useLifeOSStore((s) => s.logEnergy);
    const today = getToday();

    const handleLogEnergy = (level: EnergyLevel) => {
        logEnergy(today, level, todayEnergy?.mood || 'neutral');
        if (!todayEnergy) toast.success('Energie geloggt! ⚡');
    };

    const handleLogMood = (mood: MoodType) => {
        logEnergy(today, todayEnergy?.level || 3, mood);
        toast.success('Stimmung aktualisiert! ✨');
    };

    const energyLabels = {
        1: 'Erschöpft',
        2: 'Müde',
        3: 'Okay',
        4: 'Gut',
        5: 'Super!',
    };

    const moodOptions: { type: MoodType; label: string }[] = [
        { type: 'bad', label: 'Schlecht' },
        { type: 'low', label: 'Tief' },
        { type: 'neutral', label: 'Neutral' },
        { type: 'good', label: 'Gut' },
        { type: 'great', label: 'Sehr gut' },
    ];

    if (compact) {
        return (
            <Card variant="default" padding="sm" className="h-full flex flex-col justify-center">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider">Energie</span>
                        <div className="flex gap-1 mt-1">
                            {([1, 2, 3, 4, 5] as EnergyLevel[]).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => handleLogEnergy(level)}
                                    className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all",
                                        todayEnergy?.level === level ? "bg-[var(--accent-primary)] text-white scale-110 shadow-sm" : "bg-[var(--background-elevated)] hover:bg-[var(--background-subtle)]"
                                    )}
                                >
                                    {ENERGY_LEVEL_EMOJIS[level]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card variant="gradient" className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-[var(--foreground)]">
                            Zustand & Energie
                        </h2>
                        <p className="text-xs text-[var(--foreground-muted)]">
                            Wie geht es dir gerade?
                        </p>
                    </div>
                </div>
                {todayEnergy && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent-success-light)]">
                        <CheckCircle2 className="w-3 h-3 text-[var(--accent-success)]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-success)]">
                            Check-In erledigt
                        </span>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {/* Energy Level */}
                <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--foreground-muted)] mb-3">
                        Energie-Level
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                        {([1, 2, 3, 4, 5] as EnergyLevel[]).map((level) => (
                            <button
                                key={level}
                                onClick={() => handleLogEnergy(level)}
                                className={cn(
                                    'relative flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-300',
                                    'hover:scale-105 active:scale-95',
                                    todayEnergy?.level === level
                                        ? 'bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] shadow-lg shadow-[var(--accent-primary)]/30 text-white'
                                        : 'bg-[var(--background-surface)] hover:bg-[var(--background-elevated)] border border-[var(--border)]'
                                )}
                            >
                                <span className="text-xl">{ENERGY_LEVEL_EMOJIS[level]}</span>
                                <span className="text-[10px] font-semibold opacity-80">{energyLabels[level]}</span>
                                {todayEnergy?.level === level && (
                                    <div className="absolute inset-0 rounded-xl ring-2 ring-[var(--accent-primary)] ring-offset-2 ring-offset-[var(--background)] opacity-50" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mood Selection */}
                <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--foreground-muted)] mb-3">
                        Stimmung
                    </p>
                    <div className="flex justify-between items-center bg-[var(--background-surface)] p-2 rounded-2xl border border-[var(--border)]">
                        {moodOptions.map((option) => (
                            <button
                                key={option.type}
                                onClick={() => handleLogMood(option.type)}
                                className={cn(
                                    'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200',
                                    todayEnergy?.mood === option.type
                                        ? 'bg-[var(--accent-primary)] text-white scale-110 shadow-md shadow-[var(--accent-primary)]/20'
                                        : 'hover:bg-[var(--background-elevated)] grayscale hover:grayscale-0 opacity-60 hover:opacity-100'
                                )}
                            >
                                <span className="text-xl">{MOOD_EMOJIS[option.type]}</span>
                                <span className="text-[8px] font-bold uppercase tracking-tighter">
                                    {option.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}

// ─── Task Item Component ─────────────────────────────────────────────────────

function TaskItem({
    task,
    index,
    onEdit,
    onDelete
}: {
    task: Task;
    index: number;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}) {
    const completeTask = useLifeOSStore((s) => s.completeTask);
    const uncompleteTask = useLifeOSStore((s) => s.uncompleteTask);
    const tags = useLifeOSStore((s) => s.tags);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (task.status === 'completed') {
            uncompleteTask(task.id);
        } else {
            completeTask(task.id);
            toast.success('Aufgabe erledigt! ✨');
        }
    };

    const handleSwipeRight = () => {
        if (task.status !== 'completed') {
            completeTask(task.id);
            toast.success('Aufgabe erledigt! ✨');
        } else {
            uncompleteTask(task.id);
        }
    };

    const handleSwipeLeft = () => {
        onDelete(task.id);
    };

    return (
        <SwipeableItem
            className={cn("mb-2", task.status === 'completed' && "opacity-75")}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            leftActionColor="bg-emerald-500"
            rightActionColor="bg-red-500"
            leftActionIcon={<CheckCircle2 className="w-6 h-6 text-white" />}
            rightActionIcon={<Trash2 className="w-6 h-6 text-white" />}
        >
            <div
                className={cn(
                    'group flex items-center gap-4 py-3 px-4 transition-all duration-300 bg-[var(--background-surface)]',
                    'hover:bg-[var(--background-elevated)]'
                )}
            >
                {/* Checkbox */}
                <button
                    onClick={handleToggle}
                    className={cn(
                        'relative w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300',
                        'hover:scale-110 active:scale-95 shrink-0',
                        task.status === 'completed'
                            ? 'bg-gradient-to-br from-[var(--accent-success)] to-[#34d399] shadow-md shadow-[var(--accent-success)]/30'
                            : 'border-2 border-[var(--border-strong)] group-hover:border-[var(--accent-primary)] bg-[var(--background-surface)]'
                    )}
                >
                    {task.status === 'completed' && (
                        <CheckCircle2 className="w-4 h-4 text-white animate-checkmark" />
                    )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        {task.priority === 'high' && <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-error)] shrink-0" />}
                        {task.priority === 'low' && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />}
                        <span
                            className={cn(
                                'block text-[var(--foreground)] transition-all duration-300 font-medium',
                                task.status === 'completed' && 'line-through text-[var(--foreground-muted)]'
                            )}
                        >
                            {task.title}
                        </span>
                        {task.skillId && (
                            <span className="text-[10px] opacity-70 grayscale group-hover:grayscale-0 transition-all" title={task.skillId}>
                                {SKILL_OPTIONS.find(s => s.value === task.skillId)?.label.split(' ')[0]}
                            </span>
                        )}
                        {task.recurrence && task.recurrence !== 'none' && (
                            <Repeat className="w-3 h-3 text-blue-400 opacity-70" />
                        )}
                        {task.tagIds && task.tagIds.length > 0 && (
                            <div className="flex items-center gap-1 ml-1">
                                {task.tagIds.map(tagId => {
                                    const tag = tags.find(t => t.id === tagId);
                                    if (!tag) return null;
                                    return (
                                        <div
                                            key={tag.id}
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: tag.color }}
                                            title={tag.label}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {task.notes && (
                            <p className="text-sm text-[var(--foreground-muted)] truncate mt-0.5">
                                {task.notes}
                            </p>
                        )}
                        {task.subtasks && task.subtasks.length > 0 && (
                            <div className="flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                                <div className="w-12 h-1 rounded-full bg-[var(--background-elevated)] overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 transition-all duration-500"
                                        style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
                                    />
                                </div>
                                <span className="text-[10px] text-[var(--foreground-muted)] font-bold">
                                    {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    {task.scheduledDate && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-lg hover:bg-[var(--background-surface)]"
                            onClick={(e) => {
                                e.stopPropagation();
                                const updateTask = useLifeOSStore.getState().updateTask;
                                updateTask(task.id, { scheduledDate: null });
                                toast.success('In Inbox verschoben');
                            }}
                            title="In Inbox verschieben"
                        >
                            <Box className="w-4 h-4 text-[var(--foreground-muted)]" />
                        </Button>
                    )}
                    {!task.scheduledDate && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-lg hover:bg-[var(--background-surface)]"
                            onClick={(e) => {
                                e.stopPropagation();
                                const updateTask = useLifeOSStore.getState().updateTask;
                                updateTask(task.id, { scheduledDate: getToday() });
                                toast.success('Für heute geplant');
                            }}
                            title="Für heute planen"
                        >
                            <Calendar className="w-4 h-4 text-[var(--accent-primary)]" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-lg hover:bg-[var(--background-surface)]"
                        onClick={() => onEdit(task)}
                    >
                        <Edit3 className="w-4 h-4 text-[var(--foreground-muted)]" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-lg hover:bg-[var(--background-surface)] text-[var(--accent-error)]"
                        onClick={() => onDelete(task.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </SwipeableItem>
    );
}

// ─── Edit Task Dialog ────────────────────────────────────────────────────────

function EditTaskDialog({
    task,
    open,
    onClose
}: {
    task: Task | null;
    open: boolean;
    onClose: () => void
}) {
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [priority, setPriority] = useState<Task['priority']>('medium');
    const [skillId, setSkillId] = useState<SkillType | ''>('');
    const [recurrence, setRecurrence] = useState<RecurrencePattern>('none');
    const [newSubtask, setNewSubtask] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const updateTask = useLifeOSStore((s) => s.updateTask);
    const addSubtask = useLifeOSStore((s) => s.addSubtask);
    const toggleSubtask = useLifeOSStore((s) => s.toggleSubtask);
    const deleteSubtask = useLifeOSStore((s) => s.deleteSubtask);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setNotes(task.notes || '');
            setPriority(task.priority || 'medium');
            setSkillId(task.skillId || '');
            setRecurrence(task.recurrence || 'none');
            setSelectedTags(task.tagIds || []);
        }
    }, [task, open]);

    const handleAddSubtask = () => {
        if (task && newSubtask.trim()) {
            addSubtask(task.id, newSubtask.trim());
            setNewSubtask('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (task && title.trim()) {
            updateTask(task.id, {
                title: title.trim(),
                notes: notes.trim() || null,
                priority,
                skillId: skillId || undefined,
                recurrence,
                tagIds: selectedTags,
            });
            toast.success('Aufgabe aktualisiert! ✨');
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} title="Aufgabe bearbeiten">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Titel"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Was möchtest du erledigen?"
                    autoFocus
                    required
                />
                <Textarea
                    label="Notizen (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Details hinzufügen..."
                    className="min-h-[100px]"
                />
                <Select
                    label="Priorität"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    options={[
                        { value: 'low', label: 'Niedrig (Blau)' },
                        { value: 'medium', label: 'Mittel (Gelb/Standard)' },
                        { value: 'high', label: 'Hoch (Rot)' },
                    ]}
                />
                <Select
                    label="Skill (XP-Zuweisung)"
                    value={skillId}
                    onChange={(e) => setSkillId(e.target.value as any)}
                    options={[
                        { value: '', label: 'Keiner' },
                        ...SKILL_OPTIONS.map(o => ({ value: o.value, label: o.label }))
                    ]}
                />
                <Select
                    label="Wiederholung"
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value as any)}
                    options={[
                        { value: 'none', label: 'Einmalig' },
                        { value: 'daily', label: 'Täglich' },
                        { value: 'weekly', label: 'Wöchentlich' },
                        { value: 'monthly', label: 'Monatlich' },
                    ]}
                />

                <div className="pt-4 border-t border-[var(--border-subtle)]">
                    <label className="text-sm font-semibold text-[var(--foreground)] mb-3 block">Subtasks</label>
                    <div className="space-y-2 mb-4">
                        {task?.subtasks?.map(st => (
                            <div key={st.id} className="flex items-center gap-2 group">
                                <button
                                    type="button"
                                    onClick={() => toggleSubtask(task.id, st.id)}
                                    className={cn(
                                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                                        st.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-[var(--border-strong)]"
                                    )}
                                >
                                    {st.completed && <CheckCircle2 className="w-3 h-3" />}
                                </button>
                                <span className={cn("text-sm flex-1", st.completed && "line-through text-muted-foreground")}>{st.title}</span>
                                <button
                                    type="button"
                                    onClick={() => deleteSubtask(task.id, st.id)}
                                    className="p-1 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Neuer Subtask..."
                            value={newSubtask}
                            onChange={(e) => setNewSubtask(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                        />
                        <Button type="button" size="icon" onClick={handleAddSubtask} disabled={!newSubtask.trim()}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Abbrechen
                    </Button>
                    <Button type="submit" disabled={!title.trim()}>
                        Speichern
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

// ─── Daily Reflection Component ─────────────────────────────────────────────

function DailyReflection() {
    const dailyLog = useTodaysDailyLog();
    const [showDialog, setShowDialog] = useState(false);

    const hasData = dailyLog && (
        dailyLog.gratitude.some(g => g.trim()) ||
        dailyLog.focus ||
        dailyLog.win
    );

    return (
        <>
            <Card variant="elevated" className="mb-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-[var(--foreground)]">
                                Tages-Journal
                            </h2>
                            <p className="text-xs text-[var(--foreground-muted)]">
                                Halte deine Gedanken fest
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDialog(true)}
                        className="text-[var(--accent-primary)] hover:bg-[var(--accent-primary-light)] h-8"
                    >
                        {hasData ? 'Bearbeiten' : 'Ausfüllen'}
                    </Button>
                </div>

                {!hasData ? (
                    <div className="flex flex-col items-center py-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-[var(--background-subtle)] flex items-center justify-center mb-3">
                            <Star className="w-6 h-6 text-[var(--foreground-muted)] opacity-20" />
                        </div>
                        <p className="text-sm text-[var(--foreground-muted)] mb-4">
                            Wofür bist du heute dankbar?
                        </p>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowDialog(true)}
                        >
                            Journal starten
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {dailyLog.focus && (
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--foreground-muted)] mb-1">
                                    Heutiger Fokus
                                </p>
                                <p className="text-[var(--foreground)] font-medium">
                                    {dailyLog.focus}
                                </p>
                            </div>
                        )}

                        {dailyLog.gratitude.some((g: string) => g.trim()) && (
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--foreground-muted)] mb-1">
                                    Dankbarkeit
                                </p>
                                <div className="space-y-1">
                                    {dailyLog.gratitude.map((g: string, i: number) => g.trim() && (
                                        <div key={i} className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
                                            <Heart className="w-3 h-3 text-rose-400" />
                                            <span>{g}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {dailyLog.win && (
                            <div className="p-3 rounded-xl bg-[var(--accent-success-light)] border border-[var(--accent-success)]/10">
                                <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--accent-success)] mb-1">
                                    Highlight des Tages
                                </p>
                                <div className="flex gap-2">
                                    <Star className="w-4 h-4 text-amber-400 shrink-0" />
                                    <p className="text-sm text-[var(--foreground)] font-medium italic">
                                        "{dailyLog.win}"
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            <DailyReflectionDialog
                open={showDialog}
                onClose={() => setShowDialog(false)}
                initialData={dailyLog}
            />
        </>
    );
}

// ─── Daily Reflection Dialog ────────────────────────────────────────────────

function DailyReflectionDialog({
    open,
    onClose,
    initialData
}: {
    open: boolean;
    onClose: () => void;
    initialData?: DailyLog;
}) {
    const [gratitude, setGratitude] = useState(['', '', '']);
    const [focus, setFocus] = useState('');
    const [win, setWin] = useState('');
    const [notes, setNotes] = useState('');

    const saveDailyLog = useLifeOSStore((s) => s.saveDailyLog);
    const today = getToday();

    useEffect(() => {
        if (initialData) {
            setGratitude(initialData.gratitude || ['', '', '']);
            setFocus(initialData.focus || '');
            setWin(initialData.win || '');
            setNotes(initialData.notes || '');
        }
    }, [initialData, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveDailyLog({
            date: today,
            gratitude,
            focus: focus.trim() || null,
            win: win.trim() || null,
            notes: notes.trim() || null,
        });
        toast.success('Journal gespeichert! ✨');
        onClose();
    };

    const updateGratitude = (index: number, value: string) => {
        const newGratitude = [...gratitude];
        newGratitude[index] = value;
        setGratitude(newGratitude);
    };

    return (
        <Dialog open={open} onClose={onClose} title="Tages-Journal">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-sm font-semibold text-[var(--foreground)] mb-3 block">
                        Wofür bist du heute dankbar? (Top 3)
                    </label>
                    <div className="space-y-3">
                        {gratitude.map((g: string, i: number) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-[var(--foreground-muted)] font-mono text-xs w-4">{i + 1}.</span>
                                <Input
                                    value={g}
                                    onChange={(e) => updateGratitude(i, e.target.value)}
                                    placeholder="..."
                                    className="flex-1"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <Input
                    label="Was ist dein Hauptfokus für heute?"
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                    placeholder="Eins, das wirklich zählt..."
                />

                <Input
                    label="Dein größter Erfolg heute?"
                    value={win}
                    onChange={(e) => setWin(e.target.value)}
                    placeholder="Ein kleiner Sieg..."
                />

                <Textarea
                    label="Weitere Gedanken?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Frei schreiben..."
                />

                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Abbrechen
                    </Button>
                    <Button type="submit">
                        Speichern
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

// ─── Habit Item Component ────────────────────────────────────────────────────

function HabitItem({ habit, index }: { habit: Habit; index: number }) {
    const today = getToday();
    const isCompleted = useIsHabitCompleted(habit.id, today);
    const toggleHabit = useLifeOSStore((s) => s.toggleHabitForDate);

    const handleToggle = () => {
        toggleHabit(habit.id, today);
        if (!isCompleted) {
            toast.success('Gewohnheit abgehakt! 🎯');
        }
    };

    return (
        <div
            className={cn(
                'group flex items-center gap-4 py-4 px-1 transition-all duration-300',
                'border-b border-[var(--border-subtle)] last:border-0',
                'animate-fade-in-up'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <button
                onClick={handleToggle}
                className={cn(
                    'relative w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300',
                    'hover:scale-110 active:scale-95',
                    isCompleted
                        ? 'bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] shadow-md shadow-[var(--accent-primary)]/30'
                        : 'border-2 border-[var(--border-strong)] group-hover:border-[var(--accent-primary)] bg-[var(--background-surface)]'
                )}
            >
                {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-white animate-checkmark" />
                )}
            </button>

            <span
                className={cn(
                    'flex-1 text-[var(--foreground)] transition-all duration-300',
                    isCompleted && 'text-[var(--foreground-muted)]'
                )}
            >
                {habit.title}
            </span>
        </div>
    );
}

// ─── Quick Add Task Dialog ───────────────────────────────────────────────────

function QuickAddTask({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [title, setTitle] = useState('');
    const [skillId, setSkillId] = useState<SkillType | ''>('');
    const [recurrence, setRecurrence] = useState<RecurrencePattern>('none');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const addTask = useLifeOSStore((s) => s.addTask);
    const today = getToday();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            addTask({
                title: title.trim(),
                notes: null,
                scheduledDate: today,
                goalId: null,
                skillId: skillId || undefined,
                recurrence: recurrence,
                tagIds: selectedTags,
            });
            toast.success('Aufgabe hinzugefügt! 🎉');
            setTitle('');
            setSkillId('');
            setRecurrence('none');
            setSelectedTags([]);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} title="Neue Aufgabe">
            <form onSubmit={handleSubmit}>
                <Input
                    label="Was möchtest du erledigen?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="z.B. E-Mails beantworten"
                    autoFocus
                    required
                />
                <Select
                    label="Skill"
                    value={skillId}
                    onChange={(e) => setSkillId(e.target.value as any)}
                    options={[
                        { value: '', label: 'Keiner' },
                        ...SKILL_OPTIONS.map(o => ({ value: o.value, label: o.label }))
                    ]}
                    className="mt-4"
                />
                <Select
                    label="Wiederholung"
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value as any)}
                    options={[
                        { value: 'none', label: 'Einmalig' },
                        { value: 'daily', label: 'Täglich' },
                        { value: 'weekly', label: 'Wöchentlich' },
                        { value: 'monthly', label: 'Monatlich' },
                    ]}
                />

                <div>
                    <p className="text-xs font-bold text-[var(--foreground-muted)] mb-1">Tags</p>
                    <TagSelector
                        selectedTagIds={selectedTags}
                        onToggle={(id) => setSelectedTags(prev =>
                            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
                        )}
                    />
                </div>

                {/* Subtasks Section */}
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Abbrechen
                    </Button>
                    <Button type="submit" disabled={!title.trim()}>
                        Hinzufügen
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyTasksState({ onAddTask }: { onAddTask: () => void }) {
    return (
        <div className="py-10 text-center animate-fade-in">
            <div className="relative inline-block mb-5">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-success)]/10 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-[var(--accent-primary)]" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[var(--accent-warning)] to-amber-400 flex items-center justify-center animate-bounce">
                    <Plus className="w-4 h-4 text-white" />
                </div>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Bereit für den Tag?
            </h3>
            <p className="text-[var(--foreground-secondary)] mb-5 max-w-[240px] mx-auto">
                Füge deine erste Aufgabe hinzu und starte produktiv in den Tag.
            </p>
            <Button onClick={onAddTask} className="gap-2">
                <Plus className="w-4 h-4" />
                Erste Aufgabe erstellen
            </Button>
        </div>
    );
}

// ─── Character Card ─────────────────────────────────────────────────────────

function CharacterCard() {
    const skills = useLifeOSStore((s) => s.preferences.skills);

    return (
        <Card variant="elevated" className="mb-6 overflow-hidden border-t-4 border-t-[var(--accent-primary)]">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] flex items-center justify-center shadow-xl shadow-[var(--accent-primary)]/20 animate-float">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Dein Charakter</h2>
                    <p className="text-sm text-[var(--foreground-muted)]">Level & Skill-Fortschritt</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SKILL_OPTIONS.map((skill) => {
                    const progress = skills[skill.value as SkillType];
                    const xpGoal = progress.level * 100;
                    const percent = (progress.xp / xpGoal) * 100;

                    return (
                        <div key={skill.value} className="p-3 rounded-2xl bg-[var(--background-surface)] border border-[var(--border)] group hover:border-[var(--accent-primary)]/50 transition-all duration-300">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold flex items-center gap-2">
                                    {skill.label}
                                </span>
                                <span className="text-xs font-bold text-[var(--accent-primary)] bg-[var(--accent-primary-light)] px-2 py-0.5 rounded-full">
                                    Lvl {progress.level}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-[var(--background-elevated)] rounded-full overflow-hidden">
                                <div
                                    className={cn("h-full transition-all duration-1000", skill.color)}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-[10px] text-[var(--foreground-muted)] uppercase font-bold">Fortschritt</span>
                                <span className="text-[10px] text-[var(--foreground-muted)] font-bold">{progress.xp}/{xpGoal} XP</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function TodayPageSkeleton() {
    return (
        <PageContainer>
            <div className="animate-pulse">
                <div className="h-10 w-48 skeleton rounded-xl mb-2" />
                <div className="h-5 w-32 skeleton rounded-lg mb-8" />
                <div className="h-44 skeleton rounded-2xl mb-6" />
                <div className="h-64 skeleton rounded-2xl" />
            </div>
        </PageContainer>
    );
}

// ─── Main Today Page ─────────────────────────────────────────────────────────

export default function TodayPage() {
    const [view, setView] = useState<'day' | 'week'>('day');
    const [showAddTask, setShowAddTask] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const isHydrated = useHydration();

    const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);

    const allTodaysTasks = useTodaysTasks();
    const todaysTasks = selectedTagFilter
        ? allTodaysTasks.filter(t => t.tagIds?.includes(selectedTagFilter))
        : allTodaysTasks;

    const overdueTasksRaw = useOverdueTasks();
    const overdueTasks = selectedTagFilter
        ? overdueTasksRaw.filter(t => t.tagIds?.includes(selectedTagFilter))
        : overdueTasksRaw;

    const inboxTasks = useInboxTasks();
    const todaysHabits = useTodaysHabits();
    const deleteTask = useLifeOSStore((s) => s.deleteTask);
    const tags = useLifeOSStore((s) => s.tags);
    const preferences = usePreferences();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isHydrated) {
        return <TodayPageSkeleton />;
    }

    const confirmDelete = () => {
        if (deletingTaskId) {
            deleteTask(deletingTaskId);
            toast.success('Aufgabe gelöscht');
            setDeletingTaskId(null);
        }
    };

    const today = new Date();
    const pendingTasks = todaysTasks.filter((t) => t.status === 'pending');
    const completedTasks = todaysTasks.filter((t) => t.status === 'completed');
    const completionRate = todaysTasks.length > 0
        ? Math.round((completedTasks.length / todaysTasks.length) * 100)
        : 0;

    return (
        <PageContainer>
            {/* Date Header with Progress */}
            <div className="mb-8 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[var(--accent-primary)]/20">
                        <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
                            {formatDateLong(today)}
                        </h1>
                        <p className="text-[var(--foreground-secondary)]">
                            {todaysTasks.length === 0
                                ? 'Noch keine Aufgaben geplant'
                                : `${completedTasks.length} von ${todaysTasks.length} erledigt`}
                        </p>
                    </div>
                </div>

                {/* Progress bar */}
                {todaysTasks.length > 0 && (
                    <div className="mt-4">
                        <div className="h-2 rounded-full bg-[var(--background-elevated)] overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[#8b5cf6] transition-all duration-700 ease-out"
                                style={{ width: `${completionRate}%` }}
                            />
                        </div>
                        <p className="text-xs text-[var(--foreground-muted)] mt-2">
                            {completionRate}% geschafft
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex p-1 bg-[var(--background-elevated)] rounded-2xl mb-8 w-fit">
                <button
                    onClick={() => setView('day')}
                    className={cn(
                        "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                        view === 'day' ? "bg-[var(--background-surface)] text-[var(--accent-primary)] shadow-sm" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                    )}
                >
                    Heute
                </button>
                <button
                    onClick={() => setView('week')}
                    className={cn(
                        "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                        view === 'week' ? "bg-[var(--background-surface)] text-[var(--accent-primary)] shadow-sm" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                    )}
                >
                    Woche
                </button>
            </div>

            {view === 'day' ? (
                <div className="space-y-6">
                    {preferences.dashboard.widgets
                        .sort((a: any, b: any) => a.order - b.order)
                        .filter((w: any) => w.enabled)
                        .map((widget: any) => {
                            switch (widget.id) {
                                case 'smart_briefing':
                                    return <SmartBriefing key="smart_briefing" />;
                                case 'streak_widget':
                                    return <StreakWidget key="streak_widget" />;
                                case 'character_card':
                                    return <CharacterCard key="character_card" />;
                                case 'energy_checkin':
                                    return <EnergyCheckIn key="energy_checkin" />;
                                case 'focus_cockpit':
                                    return <FocusCockpit key="focus_cockpit" />;
                                case 'daily_reflection':
                                    return <DailyReflection key="daily_reflection" />;
                                case 'today_tasks':
                                    return (
                                        <div key="today_tasks" className="space-y-5">
                                            {/* Tag Filter */}
                                            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                                                <button
                                                    onClick={() => setSelectedTagFilter(null)}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                                                        selectedTagFilter === null
                                                            ? "bg-[var(--foreground)] text-[var(--background)]"
                                                            : "bg-[var(--background-elevated)] text-[var(--foreground-muted)] hover:bg-[var(--background-subtle)]"
                                                    )}
                                                >
                                                    Alle
                                                </button>
                                                {tags.map(tag => (
                                                    <button
                                                        key={tag.id}
                                                        onClick={() => setSelectedTagFilter(tag.id === selectedTagFilter ? null : tag.id)}
                                                        className={cn(
                                                            "px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5",
                                                            tag.id === selectedTagFilter
                                                                ? "bg-[var(--background-elevated)] border border-[var(--accent-primary)] text-[var(--foreground)]"
                                                                : "bg-[var(--background-elevated)] border border-transparent text-[var(--foreground-muted)] hover:bg-[var(--background-subtle)]"
                                                        )}
                                                    >
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
                                                        {tag.label}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Overdue Tasks implicitly tied to Task List for now */}
                                            {overdueTasks.length > 0 && (
                                                <Card variant="elevated" className="mb-0 border-l-4 border-l-[var(--accent-warning)] animate-fade-in-up">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-9 h-9 rounded-xl bg-[var(--accent-warning-light)] flex items-center justify-center">
                                                            <AlertCircle className="w-5 h-5 text-[var(--accent-warning)]" />
                                                        </div>
                                                        <div>
                                                            <h2 className="font-semibold text-[var(--foreground)]">
                                                                Überfällig
                                                            </h2>
                                                            <p className="text-xs text-[var(--foreground-muted)]">
                                                                {overdueTasks.length} Aufgabe{overdueTasks.length > 1 ? 'n' : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="pl-1">
                                                        {overdueTasks.map((task, i) => (
                                                            <TaskItem
                                                                key={task.id}
                                                                task={task}
                                                                index={i}
                                                                onEdit={setEditingTask}
                                                                onDelete={setDeletingTaskId}
                                                            />
                                                        ))}
                                                    </div>
                                                </Card>
                                            )}

                                            {/* Today's Tasks */}
                                            <Card variant="elevated" className="animate-fade-in-up">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-[var(--accent-primary-light)] flex items-center justify-center">
                                                            <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)]" />
                                                        </div>
                                                        <h2 className="font-semibold text-[var(--foreground)]">
                                                            Heute
                                                        </h2>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setShowAddTask(true)}
                                                        className="gap-1.5"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Hinzufügen
                                                    </Button>
                                                </div>

                                                {todaysTasks.length === 0 ? (
                                                    <EmptyTasksState onAddTask={() => setShowAddTask(true)} />
                                                ) : (
                                                    <div className="pl-1">
                                                        {todaysTasks.map((task, i) => (
                                                            <TaskItem
                                                                key={task.id}
                                                                task={task}
                                                                index={i}
                                                                onEdit={setEditingTask}
                                                                onDelete={setDeletingTaskId}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </Card>
                                        </div>
                                    );
                                case 'inbox':
                                    return inboxTasks.length > 0 ? (
                                        <Card key="inbox" variant="elevated" className="border-l-4 border-l-slate-400 animate-fade-in-up">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                                                    <Box className="w-5 h-5 text-slate-500" />
                                                </div>
                                                <div>
                                                    <h2 className="font-semibold text-[var(--foreground)]">Inbox</h2>
                                                    <p className="text-xs text-[var(--foreground-muted)]">Noch ohne Datum</p>
                                                </div>
                                            </div>
                                            <div className="pl-1">
                                                {inboxTasks.map((task, i) => (
                                                    <TaskItem
                                                        key={task.id}
                                                        task={task}
                                                        index={i}
                                                        onEdit={setEditingTask}
                                                        onDelete={setDeletingTaskId}
                                                    />
                                                ))}
                                            </div>
                                        </Card>
                                    ) : null;
                                case 'habits':
                                    return todaysHabits.length > 0 ? (
                                        <Card key="habits" variant="elevated" className="animate-fade-in-up">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-9 h-9 rounded-xl bg-[var(--accent-success-light)] flex items-center justify-center">
                                                    <Sparkles className="w-5 h-5 text-[var(--accent-success)]" />
                                                </div>
                                                <h2 className="font-semibold text-[var(--foreground)]">
                                                    Gewohnheiten
                                                </h2>
                                            </div>
                                            <div className="pl-1">
                                                {todaysHabits.map((habit, i) => (
                                                    <HabitItem key={habit.id} habit={habit} index={i} />
                                                ))}
                                            </div>
                                        </Card>
                                    ) : null;
                                default:
                                    return null;
                            }
                        })}
                </div>
            ) : (
                <WeekPlanner />
            )}

            {/* Quick Add Dialog */}
            <QuickAddTask open={showAddTask} onClose={() => setShowAddTask(false)} />

            {/* Edit Task Dialog */}
            <EditTaskDialog
                task={editingTask}
                open={!!editingTask}
                onClose={() => setEditingTask(null)}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deletingTaskId}
                onClose={() => setDeletingTaskId(null)}
                title="Aufgabe löschen?"
                description="Bist du sicher, dass du diese Aufgabe löschen möchtest?"
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

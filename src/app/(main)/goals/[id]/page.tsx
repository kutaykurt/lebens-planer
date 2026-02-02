'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft, Edit3, Trash2, CheckCircle2, Plus, Target,
    Heart, Briefcase, Sparkles, BookOpen, DollarSign,
    MoreVertical, Archive, RotateCcw
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Dialog, DialogFooter, Input, Textarea, Select, toast } from '@/components/ui';
import { TagSelector } from '@/components/features/TagSelector';
import { useLifeOSStore, useGoalById, useTasksByGoal, useHydration } from '@/stores';
import { cn, getToday, getRelativeDateLabel } from '@/lib/utils';
import type { GoalCategory, TimeHorizon, Task, Tag } from '@/types';
import { GOAL_CATEGORY_LABELS, TIME_HORIZON_LABELS } from '@/types';

// Category Icons
const CATEGORY_ICONS: Record<GoalCategory, typeof Target> = {
    health: Heart,
    career: Briefcase,
    relationships: Heart,
    personal: Sparkles,
    finance: DollarSign,
    learning: BookOpen,
    other: Target,
};

const CATEGORY_COLORS: Record<GoalCategory, string> = {
    health: 'from-rose-500 to-pink-500',
    career: 'from-blue-500 to-cyan-500',
    relationships: 'from-purple-500 to-violet-500',
    personal: 'from-indigo-500 to-purple-500',
    finance: 'from-emerald-500 to-teal-500',
    learning: 'from-amber-500 to-orange-500',
    other: 'from-slate-500 to-gray-500',
};

// ─── Task Item for Goal ─────────────────────────────────────────────────────

function TaskItem({
    task,
    onEdit,
    onDelete
}: {
    task: Task;
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

    return (
        <div className="group flex items-center gap-3 py-3 px-2 rounded-xl border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--background-elevated)] transition-all duration-200">
            <button
                onClick={handleToggle}
                className={cn(
                    'w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0',
                    'hover:scale-110 active:scale-95',
                    task.status === 'completed'
                        ? 'bg-gradient-to-br from-[var(--accent-success)] to-emerald-400'
                        : 'border-2 border-[var(--border-strong)] hover:border-[var(--accent-primary)]'
                )}
            >
                {task.status === 'completed' && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                )}
            </button>
            <div className="flex-1 min-w-0">
                <span className={cn(
                    'block transition-all duration-200',
                    task.status === 'completed' && 'line-through text-[var(--foreground-muted)]'
                )}>
                    {task.title}
                </span>
                {task.scheduledDate && (
                    <p className="text-xs text-[var(--foreground-muted)]">
                        {getRelativeDateLabel(task.scheduledDate)}
                    </p>
                )}
                {task.tagIds && task.tagIds.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
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

            {/* Actions */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
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
    const [scheduledDate, setScheduledDate] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const updateTask = useLifeOSStore((s) => s.updateTask);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setNotes(task.notes || '');
            setScheduledDate(task.scheduledDate || '');
            setSelectedTags(task.tagIds || []);
        }
    }, [task]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (task && title.trim()) {
            updateTask(task.id, {
                title: title.trim(),
                notes: notes.trim() || null,
                scheduledDate: scheduledDate || null,
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
                <Input
                    label="Geplant für"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                />
                <Textarea
                    label="Notizen (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Details hinzufügen..."
                    className="min-h-[100px]"
                />

                <Input
                    label="Geplantes Datum"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    type="date"
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

// ─── Add Task Dialog ─────────────────────────────────────────────────────────

function AddTaskDialog({
    open,
    onClose,
    goalId
}: {
    open: boolean;
    onClose: () => void;
    goalId: string;
}) {
    const [title, setTitle] = useState('');
    const [scheduledDate, setScheduledDate] = useState(getToday());
    const addTask = useLifeOSStore((s) => s.addTask);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            addTask({
                title: title.trim(),
                notes: null,
                scheduledDate: scheduledDate || null,
                goalId,
            });
            toast.success('Aufgabe hinzugefügt! 🎉');
            setTitle('');
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} title="Neue Aufgabe zum Ziel">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Was möchtest du erledigen?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="z.B. Erste 5km laufen"
                    autoFocus
                    required
                />
                <Input
                    label="Geplant für"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                />
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

// ─── Edit Goal Dialog ────────────────────────────────────────────────────────

function EditGoalDialog({
    open,
    onClose,
    goalId,
    currentTitle,
    currentDescription,
    currentCategory,
    currentTimeHorizon,
    currentProjectId,
    currentTagIds,
}: {
    open: boolean;
    onClose: () => void;
    goalId: string;
    currentTitle: string;
    currentDescription: string | null;
    currentCategory: GoalCategory;
    currentTimeHorizon: TimeHorizon;
    currentProjectId: string | null;
    currentTagIds: string[];
}) {
    const [title, setTitle] = useState(currentTitle);
    const [description, setDescription] = useState(currentDescription || '');
    const [category, setCategory] = useState(currentCategory);
    const [timeHorizon, setTimeHorizon] = useState(currentTimeHorizon);
    const [projectId, setProjectId] = useState(currentProjectId || '');
    const [selectedTags, setSelectedTags] = useState<string[]>(currentTagIds || []);

    const updateGoal = useLifeOSStore((s) => s.updateGoal);
    const allProjectsStore = useLifeOSStore((s) => s.projects);
    const projects = allProjectsStore.filter(p => p.status === 'active');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            updateGoal(goalId, {
                title: title.trim(),
                description: description.trim() || null,
                category,
                timeHorizon,
                projectId: projectId || null,
                tagIds: selectedTags,
            });
            toast.success('Ziel aktualisiert! ✨');
            onClose();
        }
    };

    const projectOptions = [
        { value: '', label: 'Kein Projekt' },
        ...projects.map(p => ({ value: p.id, label: p.title }))
    ];

    const categoryOptions = Object.entries(GOAL_CATEGORY_LABELS).map(([value, label]) => ({
        value,
        label,
    }));

    const timeHorizonOptions = Object.entries(TIME_HORIZON_LABELS).map(([value, label]) => ({
        value,
        label,
    }));

    return (
        <Dialog open={open} onClose={onClose} title="Ziel bearbeiten">
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Titel"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <Textarea
                    label="Beschreibung (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <Select
                    label="Projekt (optional)"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    options={projectOptions}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Kategorie"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as GoalCategory)}
                        options={categoryOptions}
                    />
                    <Select
                        label="Zeithorizont"
                        value={timeHorizon}
                        onChange={(e) => setTimeHorizon(e.target.value as TimeHorizon)}
                        options={timeHorizonOptions}
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold text-[var(--foreground)] mb-2 block">Tags</label>
                    <TagSelector
                        selectedTagIds={selectedTags}
                        onToggle={(id) => setSelectedTags(prev =>
                            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
                        )}
                    />
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

// ─── Loading Skeleton ───────────────────────────────────────────────────────

function GoalDetailSkeleton() {
    return (
        <PageContainer>
            <div className="animate-pulse">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 skeleton rounded-xl" />
                    <div className="h-6 w-32 skeleton rounded-lg" />
                </div>
                <div className="h-40 skeleton rounded-2xl mb-6" />
                <div className="h-64 skeleton rounded-2xl" />
            </div>
        </PageContainer>
    );
}

// ─── Goal Detail Page ────────────────────────────────────────────────────────

export default function GoalDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showEditGoal, setShowEditGoal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

    const isHydrated = useHydration();
    const goalId = params.id as string;
    const goal = useGoalById(goalId);
    const tasks = useTasksByGoal(goalId);
    const archiveGoal = useLifeOSStore((s) => s.archiveGoal);
    const completeGoal = useLifeOSStore((s) => s.completeGoal);
    const deleteTask = useLifeOSStore((s) => s.deleteTask);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isHydrated) {
        return <GoalDetailSkeleton />;
    }

    const confirmDeleteTask = () => {
        if (deletingTaskId) {
            deleteTask(deletingTaskId);
            toast.success('Aufgabe gelöscht');
            setDeletingTaskId(null);
        }
    };

    if (!goal) {
        return (
            <PageContainer>
                <div className="text-center py-20">
                    <p className="text-[var(--foreground-secondary)]">Ziel nicht gefunden</p>
                    <Link href="/goals">
                        <Button variant="ghost" className="mt-4">
                            Zurück zu Ziele
                        </Button>
                    </Link>
                </div>
            </PageContainer>
        );
    }

    const Icon = CATEGORY_ICONS[goal.category];
    const colorGradient = CATEGORY_COLORS[goal.category];
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    const handleArchive = () => {
        archiveGoal(goalId);
        toast.success('Ziel archiviert');
        router.push('/goals');
    };

    const handleComplete = () => {
        completeGoal(goalId);
        toast.success('Ziel erreicht! 🎉');
        router.push('/goals');
    };

    return (
        <PageContainer>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 animate-fade-in">
                <Link href="/goals" className="flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    <span>Zurück</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowEditGoal(true)}
                    >
                        <Edit3 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Goal Card */}
            <Card variant="elevated" className="mb-6 animate-fade-in-up">
                <div className="flex items-start gap-4 mb-4">
                    <div className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0',
                        'bg-gradient-to-br shadow-lg',
                        colorGradient
                    )}>
                        <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold text-[var(--foreground)] mb-1">
                            {goal.title}
                        </h1>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--background-elevated)] text-[var(--foreground-muted)]">
                                {GOAL_CATEGORY_LABELS[goal.category]}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--accent-primary-light)] text-[var(--accent-primary)]">
                                {TIME_HORIZON_LABELS[goal.timeHorizon]}
                            </span>
                        </div>
                    </div>
                </div>

                {goal.description && (
                    <p className="text-[var(--foreground-secondary)] leading-relaxed mb-4">
                        {goal.description}
                    </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-[var(--border-subtle)]">
                    <Button
                        variant="success"
                        onClick={handleComplete}
                        className="flex-1 gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Als erreicht markieren
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        <Archive className="w-4 h-4" />
                    </Button>
                </div>
            </Card>

            {/* Tasks Section */}
            <Card variant="elevated" className="animate-fade-in-up stagger-2">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-[var(--foreground)]">
                        Aufgaben
                    </h2>
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

                {tasks.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-[var(--foreground-muted)] mb-4">
                            Noch keine Aufgaben für dieses Ziel
                        </p>
                        <Button variant="secondary" onClick={() => setShowAddTask(true)} className="gap-2">
                            <Plus className="w-4 h-4" />
                            Erste Aufgabe
                        </Button>
                    </div>
                ) : (
                    <div>
                        {pendingTasks.length > 0 && (
                            <div className="mb-4">
                                <p className="text-xs font-medium text-[var(--foreground-muted)] mb-2">
                                    Offen ({pendingTasks.length})
                                </p>
                                {pendingTasks.map(task => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onEdit={setEditingTask}
                                        onDelete={setDeletingTaskId}
                                    />
                                ))}
                            </div>
                        )}
                        {completedTasks.length > 0 && (
                            <div>
                                <p className="text-xs font-medium text-[var(--foreground-muted)] mb-2">
                                    Erledigt ({completedTasks.length})
                                </p>
                                {completedTasks.map(task => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onEdit={setEditingTask}
                                        onDelete={setDeletingTaskId}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* Dialogs */}
            <AddTaskDialog
                open={showAddTask}
                onClose={() => setShowAddTask(false)}
                goalId={goalId}
            />

            {showEditGoal && (
                <EditGoalDialog
                    open={showEditGoal}
                    onClose={() => setShowEditGoal(false)}
                    goalId={goalId}
                    currentTitle={goal.title}
                    currentDescription={goal.description}
                    currentCategory={goal.category}
                    currentTimeHorizon={goal.timeHorizon}
                    currentProjectId={goal.projectId}
                    currentTagIds={goal.tagIds || []}
                />
            )}

            <EditTaskDialog
                task={editingTask}
                open={!!editingTask}
                onClose={() => setEditingTask(null)}
            />

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
                    <Button variant="destructive" onClick={confirmDeleteTask}>
                        Löschen
                    </Button>
                </DialogFooter>
            </Dialog>

            <Dialog
                open={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Ziel archivieren?"
                description="Das Ziel wird archiviert und nicht mehr angezeigt. Die zugehörigen Aufgaben bleiben erhalten."
            >
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
                        Abbrechen
                    </Button>
                    <Button variant="destructive" onClick={handleArchive}>
                        Archivieren
                    </Button>
                </DialogFooter>
            </Dialog>
        </PageContainer>
    );
}

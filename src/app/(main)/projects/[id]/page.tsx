'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ChevronLeft, Edit3, Trash2, CheckCircle2, Plus, Folder,
    Calendar, CheckSquare, Target, MoreVertical, Archive
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Dialog, DialogFooter, Input, Textarea, toast } from '@/components/ui';
import { useLifeOSStore, useHydration } from '@/stores';
import { cn, formatDate, getRelativeDateLabel } from '@/lib/utils';
import type { Project, Goal, Task } from '@/types';
import { GOAL_CATEGORY_LABELS, TIME_HORIZON_LABELS } from '@/types';
import { TagSelector } from '@/components/features/TagSelector';

// Reuse parts from Goals Page if possible, or duplicate for independence
// We need EditProjectDialog.

// ─── Edit Project Dialog ─────────────────────────────────────────────────────

function EditProjectDialog({
    open,
    onClose,
    project
}: {
    open: boolean;
    onClose: () => void;
    project: Project;
}) {
    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(project.description || '');
    const [deadline, setDeadline] = useState(project.deadline || '');
    const [selectedTags, setSelectedTags] = useState<string[]>(project.tagIds || []);
    const [status, setStatus] = useState<Project['status']>(project.status);

    const updateProject = useLifeOSStore((s) => s.updateProject);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            updateProject(project.id, {
                title: title.trim(),
                description: description.trim() || null,
                deadline: deadline || null,
                tagIds: selectedTags,
                status,
            });
            toast.success('Projekt aktualisiert! ✨');
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} title="Projekt bearbeiten">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Projektname"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <Textarea
                    label="Beschreibung"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px]"
                />
                <Input
                    label="Deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                />

                <div>
                    <p className="text-xs font-bold text-[var(--foreground-muted)] mb-1">Status</p>
                    <div className="flex gap-2">
                        {['active', 'on_hold', 'completed', 'archived'].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setStatus(s as any)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-bold capitalize border transition-all",
                                    status === s
                                        ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]"
                                        : "bg-transparent border-[var(--border-strong)] text-[var(--foreground-muted)]"
                                )}
                            >
                                {s.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
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

// ─── Project Detail Page ─────────────────────────────────────────────────────

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const isHydrated = useHydration();

    const project = useLifeOSStore((s) => s.projects.find(p => p.id === id));
    const projectGoals = useLifeOSStore((s) => s.goals.filter(g => g.projectId === id && g.status !== 'archived'));
    // Find tasks belonging to these goals
    const allTasks = useLifeOSStore((s) => s.tasks);
    const projectTasks = allTasks.filter(t => t.goalId && projectGoals.some(g => g.id === t.goalId) && t.status !== 'cancelled');

    const deleteProject = useLifeOSStore((s) => s.deleteProject);

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (!isHydrated) return null;

    if (!project) {
        return (
            <PageContainer>
                <div className="text-center py-20">
                    <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">Projekt nicht gefunden</h2>
                    <Button variant="ghost" onClick={() => router.push('/projects')}>
                        Zurück zur Übersicht
                    </Button>
                </div>
            </PageContainer>
        );
    }

    const handleDelete = () => {
        deleteProject(project.id);
        toast.success('Projekt gelöscht');
        router.push('/projects');
    };

    const completedTasksCount = projectTasks.filter(t => t.status === 'completed').length;
    const progress = projectTasks.length > 0 ? Math.round((completedTasksCount / projectTasks.length) * 100) : 0;

    return (
        <PageContainer>
            {/* Nav */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-1 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors mb-6"
            >
                <ChevronLeft className="w-4 h-4" />
                Zurück
            </button>

            {/* Header Card */}
            <Card variant="elevated" className="mb-8 animate-fade-in">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                            <Folder className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                                {project.title}
                            </h1>
                            {project.description && (
                                <p className="text-[var(--foreground-secondary)] max-w-2xl leading-relaxed mb-4">
                                    {project.description}
                                </p>
                            )}

                            <div className="flex items-center gap-3 text-sm text-[var(--foreground-muted)]">
                                {project.deadline && (
                                    <span className={cn(
                                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--background-subtle)]",
                                        new Date(project.deadline) < new Date() && "text-red-500 bg-red-500/10"
                                    )}>
                                        <Calendar className="w-3.5 h-3.5" />
                                        Destination: {formatDate(new Date(project.deadline))}
                                    </span>
                                )}
                                <span className={cn(
                                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full capitalize",
                                    project.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-[var(--background-subtle)]"
                                )}>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    {project.status.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setShowEditDialog(true)}>
                            <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => setShowDeleteConfirm(true)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Progress */}
                <div className="bg-[var(--background-subtle)] rounded-xl p-4 flex items-center gap-6">
                    <div className="flex-1">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-[var(--foreground)]">Gesamtfortschritt</span>
                            <span className="font-bold text-[var(--accent-primary)]">{progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-[var(--background-surface)] overflow-hidden">
                            <div
                                className="h-full bg-[var(--accent-primary)] transition-all duration-700 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                    <div className="flex gap-6 text-sm">
                        <div className="text-center">
                            <div className="font-bold text-xl text-[var(--foreground)]">{projectGoals.length}</div>
                            <div className="text-[var(--foreground-muted)] text-xs uppercase tracking-wider">Ziele</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-xl text-[var(--foreground)]">{projectTasks.length}</div>
                            <div className="text-[var(--foreground-muted)] text-xs uppercase tracking-wider">Aufgaben</div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Content: Goals List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[var(--foreground)]">Ziele im Projekt</h2>
                    {/* Add Goal Button logic could be simpler here: Show Add Goal Dialog with pre-selected project */}
                    <div className="text-sm text-[var(--foreground-muted)]">
                        Ziele können in der Ziel-Übersicht diesem Projekt zugewiesen werden.
                    </div>
                </div>

                {projectGoals.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-[var(--border-subtle)] rounded-2xl">
                        <p className="text-[var(--foreground-muted)] mb-2">Noch keine Ziele mit diesem Projekt verknüpft.</p>
                        <p className="text-xs text-[var(--foreground-muted)] opacity-70">
                            Gehe zu "Ziele", erstelle oder bearbeite ein Ziel und weise es diesem Projekt zu.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 bg-[var(--background-subtle)]/50 p-4 rounded-2xl">
                        {projectGoals.map(goal => (
                            <Card key={goal.id} variant="elevated" className="flex items-center justify-between p-4 group" hover>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 border rounded-full">
                                        <Target className="w-4 h-4 text-[var(--foreground-muted)]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[var(--foreground)] leading-tight">{goal.title}</h3>
                                        <p className="text-xs text-[var(--foreground-muted)]">{GOAL_CATEGORY_LABELS[goal.category]}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push(`/goals/${goal.id}`)}
                                >
                                    Öffnen
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Dialogs */}
            {showEditDialog && (
                <EditProjectDialog
                    open={showEditDialog}
                    onClose={() => setShowEditDialog(false)}
                    project={project}
                />
            )}

            <Dialog
                open={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Projekt löschen?"
                description="Möchtest du dieses Projekt wirklich löschen? Die verknüpften Ziele bleiben erhalten, verlieren aber ihre Projekt-Zuweisung."
            >
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>Abbrechen</Button>
                    <Button variant="destructive" onClick={handleDelete}>Löschen</Button>
                </DialogFooter>
            </Dialog>

        </PageContainer>
    );
}

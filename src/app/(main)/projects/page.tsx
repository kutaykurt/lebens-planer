'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Folder, ChevronRight, Calendar, BarChart3, Clock, CheckCircle2, Archive, MoreVertical } from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Dialog, DialogFooter, Input, Textarea, toast } from '@/components/ui';
import { useLifeOSStore, useHydration } from '@/stores';
import { cn, formatDate, getRelativeDateLabel } from '@/lib/utils';
import type { Project } from '@/types';
import { TagSelector } from '@/components/features/TagSelector';

// ─── Project Card Component ──────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const tags = useLifeOSStore((s) => s.tags);
    const goals = useLifeOSStore((s) => s.goals.filter(g => g.projectId === project.id));
    const tasks = useLifeOSStore((s) => s.tasks); // Ideally filter tasks by project's goals or direct project tasks

    // Calculate progress based on goals (rough approximation for now, or use goals completion)
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const progress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    return (
        <Link href={`/projects/${project.id}`}>
            <Card
                hover
                variant="elevated"
                className={cn(
                    'mb-4 animate-fade-in-up group',
                )}
                style={{ animationDelay: `${index * 75}ms` }}
            >
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                        <Folder className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent-primary)] transition-colors">
                                {project.title}
                            </h3>
                            {project.deadline && (
                                <span className={cn(
                                    "text-xs px-2 py-0.5 rounded-full bg-[var(--background-subtle)] text-[var(--foreground-muted)] flex items-center gap-1",
                                    new Date(project.deadline) < new Date() && "text-red-500 bg-red-500/10"
                                )}>
                                    <Clock className="w-3 h-3" />
                                    {getRelativeDateLabel(project.deadline)}
                                </span>
                            )}
                        </div>

                        {project.description && (
                            <p className="text-sm text-[var(--foreground-secondary)] line-clamp-2 mb-3">
                                {project.description}
                            </p>
                        )}

                        {/* Status & Progress */}
                        <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)] mb-3">
                            <div className="flex items-center gap-1.5">
                                <BarChart3 className="w-3.5 h-3.5" />
                                <span>{progress}% abgeschlossen</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{completedGoals}/{totalGoals} Ziele</span>
                            </div>
                        </div>

                        {/* Tags */}
                        {project.tagIds && project.tagIds.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {project.tagIds.map(tagId => {
                                    const tag = tags.find(t => t.id === tagId);
                                    if (!tag) return null;
                                    return (
                                        <div
                                            key={tag.id}
                                            className="px-2 py-0.5 rounded-md bg-[var(--background-subtle)] border border-[var(--border-subtle)] text-[10px] flex items-center gap-1.5 font-medium text-[var(--foreground-secondary)]"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
                                            {tag.label}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-[var(--foreground-muted)] shrink-0 group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" />
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-1 rounded-full bg-[var(--background-subtle)] overflow-hidden">
                    <div
                        className="h-full bg-[var(--accent-primary)] transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </Card>
        </Link>
    );
}

// ─── Add Project Dialog ──────────────────────────────────────────────────────

function AddProjectDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const addProject = useLifeOSStore((s) => s.addProject);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            addProject({
                title: title.trim(),
                description: description.trim() || null,
                deadline: deadline || null,
                status: 'active',
                tagIds: selectedTags,
                sortOrder: 0, // Store handles this
            });
            toast.success('Projekt erstellt! 🚀');
            setTitle('');
            setDescription('');
            setDeadline('');
            setSelectedTags([]);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} title="Neues Projekt erstellen">
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Projektname"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="z.B. Website Relaunch"
                    autoFocus
                    required
                />

                <Textarea
                    label="Beschreibung (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Worum geht es in diesem Projekt?"
                    className="min-h-[100px]"
                />

                <Input
                    label="Deadline (optional)"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                />

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
                        Projekt erstellen
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyProjectsState({ onAddProject }: { onAddProject: () => void }) {
    return (
        <Card variant="gradient" className="text-center py-14 animate-fade-in">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-6">
                <Folder className="w-12 h-12 text-indigo-500 animate-pulse-slow" />
            </div>

            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                Keine aktiven Projekte
            </h2>
            <p className="text-[var(--foreground-secondary)] mb-6 max-w-sm mx-auto leading-relaxed">
                Projekte helfen dir, größere Vorhaben in Ziele und Aufgaben zu strukturieren.
            </p>
            <Button onClick={onAddProject} size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Erstes Projekt starten
            </Button>
        </Card>
    );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function ProjectsPageSkeleton() {
    return (
        <PageContainer>
            <div className="animate-pulse">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="h-8 w-32 skeleton rounded-xl mb-2" />
                        <div className="h-4 w-48 skeleton rounded-lg" />
                    </div>
                    <div className="h-11 w-36 skeleton rounded-xl" />
                </div>
                <div className="h-32 skeleton rounded-2xl mb-4" />
                <div className="h-32 skeleton rounded-2xl mb-4" />
                <div className="h-32 skeleton rounded-2xl" />
            </div>
        </PageContainer>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ProjectsPage() {
    const [showAddProject, setShowAddProject] = useState(false);
    const [mounted, setMounted] = useState(false);
    const isHydrated = useHydration();
    const allProjects = useLifeOSStore((s) => s.projects);
    const projects = allProjects.filter(p => p.status === 'active');

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isHydrated) {
        return <ProjectsPageSkeleton />;
    }

    return (
        <PageContainer>
            {/* Header */}
            <div className="flex items-center justify-between mb-8 animate-fade-in">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Projekte</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1">
                        {projects.length === 0
                            ? 'Organisiere deine Vorhaben'
                            : `${projects.length} aktive Projekte`}
                    </p>
                </div>
                {projects.length > 0 && (
                    <Button onClick={() => setShowAddProject(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Neues Projekt
                    </Button>
                )}
            </div>

            {/* Content */}
            {projects.length === 0 ? (
                <EmptyProjectsState onAddProject={() => setShowAddProject(true)} />
            ) : (
                <div>
                    {projects.map((project, i) => (
                        <ProjectCard key={project.id} project={project} index={i} />
                    ))}
                </div>
            )}

            <AddProjectDialog open={showAddProject} onClose={() => setShowAddProject(false)} />
        </PageContainer>
    );
}

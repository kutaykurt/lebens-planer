'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Plus, Folder, ChevronRight, Calendar, BarChart3, Clock,
    CheckCircle2, Archive, MoreVertical, Target, Rocket,
    Briefcase, Sparkles, LayoutGrid, Zap, Activity, Trash2
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Dialog, DialogFooter, Input, Textarea, toast } from '@/components/ui';
import { useLifeOSStore, useHydration } from '@/stores';
import { cn, formatDate, getRelativeDateLabel } from '@/lib/utils';
import type { Project } from '@/types';
import { TagSelector } from '@/components/features/TagSelector';

// ─── Project Card Component ──────────────────────────────────────────────────

function ProjectCard({ project, index, onDelete }: { project: Project; index: number; onDelete: (userId: string) => void }) {
    const tags = useLifeOSStore((s) => s.tags);
    const allGoals = useLifeOSStore((s) => s.goals);
    const goals = allGoals.filter(g => g.projectId === project.id);

    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const progress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    return (
        <Link href={`/projects/${project.id}`}>
            <Card
                hover
                variant="glass"
                className={cn(
                    'mb-6 animate-fade-in-up group p-8 rounded-[2.5rem] border-white/10 relative overflow-hidden',
                    'hover:bg-white/10 dark:hover:bg-slate-900/40 transition-all duration-500'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
            >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-indigo-500/10 transition-colors duration-700" />

                <div className="flex flex-col md:flex-row md:items-start gap-8 relative z-10">
                    {/* Icon & Status */}
                    <div className="flex flex-col items-center gap-4 shrink-0">
                        <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 group-hover:rotate-6 transition-transform duration-500">
                            <Rocket className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Aktiv</span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                            <div>
                                <h3 className="text-2xl font-black text-[var(--foreground)] group-hover:text-indigo-500 transition-colors tracking-tighter uppercase italic">
                                    {project.title}
                                </h3>
                                <div className="flex items-center gap-3 mt-1">
                                    {project.deadline && (
                                        <div className={cn(
                                            "flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest",
                                            new Date(project.deadline) < new Date()
                                                ? "bg-rose-500/10 text-rose-500 border border-rose-500/10"
                                                : "bg-indigo-500/5 text-indigo-500 border border-indigo-500/10"
                                        )}>
                                            <Clock className="w-3.5 h-3.5" />
                                            Deadline: {getRelativeDateLabel(project.deadline)}
                                        </div>
                                    )}
                                    <div className="w-1 h-1 rounded-full bg-[var(--border)]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">
                                        Level: {progress}% Complete
                                    </span>
                                </div>
                            </div>

                            <div className="flex -space-x-2">
                                {goals.slice(0, 5).map((goal, i) => (
                                    <div
                                        key={goal.id}
                                        className="w-10 h-10 rounded-xl bg-[var(--background-elevated)] border-2 border-[var(--background-surface)] flex items-center justify-center shadow-lg"
                                        title={goal.title}
                                    >
                                        <Target className={cn("w-5 h-5", goal.status === 'completed' ? "text-emerald-500" : "text-indigo-400")} />
                                    </div>
                                ))}
                                {goals.length > 5 && (
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white border-2 border-[var(--background-surface)] flex items-center justify-center text-[10px] font-black shadow-lg">
                                        +{goals.length - 5}
                                    </div>
                                )}
                            </div>
                        </div>

                        {project.description && (
                            <p className="text-sm text-[var(--foreground-secondary)] font-medium leading-relaxed mb-6 line-clamp-2 italic">
                                "{project.description}"
                            </p>
                        )}

                        {/* Status & Progress Row */}
                        <div className="flex items-center gap-8 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] leading-none mb-1">Status</p>
                                    <p className="text-xs font-bold text-[var(--foreground)] leading-none">{completedGoals}/{totalGoals} Ziele</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <Activity className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] leading-none mb-1">Momentum</p>
                                    <p className="text-xs font-bold text-[var(--foreground)] leading-none">{progress > 70 ? 'High' : progress > 30 ? 'Normal' : 'Bootstrap'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        {project.tagIds && project.tagIds.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                                {project.tagIds.map(tagId => {
                                    const tag = tags.find(t => t.id === tagId);
                                    if (!tag) return null;
                                    return (
                                        <div
                                            key={tag.id}
                                            className="px-3 py-1 rounded-xl bg-[var(--background-elevated)] border border-[var(--border-subtle)] text-[10px] flex items-center gap-2 font-black uppercase tracking-widest text-[var(--foreground-secondary)] shadow-sm"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
                                            {tag.label}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Navigation Button */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete(project.id);
                            }}
                            className="w-12 h-12 rounded-2xl hover:bg-rose-500/20 text-rose-500 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                        <div className="hidden md:flex flex-col justify-center">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--background-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-xl">
                                <ChevronRight className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progressive Progress Bar */}
                <div className="mt-8 h-3 rounded-full bg-[var(--background-elevated)] overflow-hidden shadow-inner flex">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.4)]"
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
                progress: 0,
                tagIds: selectedTags,
                sortOrder: 0,
            });
            toast.success('System-Mission gestartet! 🚀');
            setTitle('');
            setDescription('');
            setDeadline('');
            setSelectedTags([]);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} title="Neue Mission starten">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Missions-Bezeichnung"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="z.B. OS Core Refactor"
                    autoFocus
                    required
                />

                <Textarea
                    label="Strategische Beschreibung"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Worum geht es in dieser Mission?"
                    className="min-h-[120px]"
                />

                <Input
                    label="Deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                />

                <div>
                    <label className="text-sm font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-3 block">Missions-Tags</label>
                    <TagSelector
                        selectedTagIds={selectedTags}
                        onToggle={(id) => setSelectedTags(prev =>
                            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
                        )}
                    />
                </div>

                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose} className="rounded-2xl h-12">
                        Abbrechen
                    </Button>
                    <Button type="submit" disabled={!title.trim()} className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl h-12 shadow-lg shadow-indigo-500/20 font-black uppercase tracking-widest">
                        Projekt starten
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ProjectsPage() {
    const [showAddProject, setShowAddProject] = useState(false);
    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
    const isHydrated = useHydration();
    const allProjects = useLifeOSStore((s) => s.projects);
    const projects = allProjects.filter(p => p.status === 'active');
    const deleteProject = useLifeOSStore((s) => s.deleteProject);

    const handleDeleteProject = (id: string) => {
        deleteProject(id);
        setDeletingProjectId(null);
        toast.success('System-Mission archiviert & gelöscht 🗑️');
    };

    if (!isHydrated) {
        return (
            <PageContainer>
                <div className="animate-pulse flex flex-col gap-8">
                    <div className="h-20 bg-[var(--background-elevated)] rounded-[2.5rem]" />
                    <div className="h-64 bg-[var(--background-elevated)] rounded-[2.5rem]" />
                    <div className="h-64 bg-[var(--background-elevated)] rounded-[2.5rem]" />
                </div>
            </PageContainer>
        );
    }

    const totalActive = projects.length;
    const avgProgress = projects.length > 0
        ? Math.round(projects.reduce((acc, p) => {
            const goals = useLifeOSStore.getState().goals.filter(g => g.projectId === p.id);
            return acc + (goals.length > 0 ? (goals.filter(g => g.status === 'completed').length / goals.length) * 100 : 0);
        }, 0) / projects.length)
        : 0;

    return (
        <PageContainer>
            {/* Header / Dashboard Area */}
            <div className="relative mb-16">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
                    <div>
                        <div className="flex items-center gap-6 mb-4">
                            <div className="w-16 h-16 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                                <Archive className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-[var(--foreground)] tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground-muted)]">
                                    Projekt-<span className="electric-text">Zentrum</span>
                                </h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Operation: Structural Growth</p>
                                <p className="text-[10px] text-[var(--foreground-muted)] font-medium mt-1">
                                    Bündle deine Aufgaben in klaren Missionen, um große Ziele Schritt für Schritt zu erreichen.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <Card variant="glass" className="p-6 rounded-[2rem] border-indigo-500/10 bg-indigo-500/5 backdrop-blur-xl">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500/60 mb-2">Aktiv</p>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black tracking-tighter">{totalActive}</span>
                                <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase mb-1.5">Missions</span>
                            </div>
                        </Card>

                        <Card variant="glass" className="p-6 rounded-[2rem] border-purple-500/10 bg-purple-500/5 backdrop-blur-xl hidden md:block">
                            <p className="text-[10px] font-black uppercase tracking-widest text-purple-500/60 mb-2">Progress</p>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black tracking-tighter text-glow-indigo">{avgProgress}%</span>
                                <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase mb-1.5">Avg.</span>
                            </div>
                        </Card>

                        <Button
                            onClick={() => setShowAddProject(true)}
                            className="h-auto aspect-square md:aspect-auto md:h-24 md:px-8 rounded-[2rem] bg-indigo-500 hover:bg-indigo-600 text-white flex flex-col items-center justify-center group shadow-2xl shadow-indigo-500/20"
                        >
                            <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
                            <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] mt-2">New Mission</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Project List */}
            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-[var(--border)] rounded-[4rem] bg-indigo-500/[0.02] relative group">
                    <div className="absolute inset-0 bg-indigo-500/[0.02] group-hover:bg-indigo-500/[0.04] transition-colors rounded-[4rem]" />
                    <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-500/10 flex items-center justify-center mb-8 relative z-10">
                        <Folder className="w-12 h-12 text-indigo-500 animate-pulse-slow" />
                    </div>
                    <h2 className="text-3xl font-black text-[var(--foreground)] mb-4 tracking-tighter uppercase italic relative z-10">
                        System-Status: <span className="text-indigo-500">Leer</span>
                    </h2>
                    <p className="text-[var(--foreground-secondary)] mb-10 text-center max-w-sm font-medium relative z-10">
                        Keine laufenden Missionen lokalisiert. Starte dein erstes Projekt, um die Handlungsebene zu füllen.
                    </p>
                    <Button
                        onClick={() => setShowAddProject(true)}
                        size="lg"
                        className="gap-3 bg-indigo-500 hover:bg-indigo-600 text-white px-10 rounded-2xl h-14 shadow-xl shadow-indigo-500/20 font-black uppercase tracking-widest relative z-10"
                    >
                        <Plus className="w-6 h-6" /> Erste Mission starten
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {projects.map((project, i) => (
                        <ProjectCard key={project.id} project={project} index={i} onDelete={setDeletingProjectId} />
                    ))}
                </div>
            )}

            <AddProjectDialog open={showAddProject} onClose={() => setShowAddProject(false)} />

            <Dialog
                open={!!deletingProjectId}
                onClose={() => setDeletingProjectId(null)}
                title="Mission löschen?"
                description="Diese Mission und alle assoziierten Ziele werden dauerhaft aus deinem System entfernt."
            >
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setDeletingProjectId(null)}>
                        Abbrechen
                    </Button>
                    <Button variant="destructive" onClick={() => deletingProjectId && handleDeleteProject(deletingProjectId)}>
                        Löschen
                    </Button>
                </DialogFooter>
            </Dialog>
        </PageContainer>
    );
}

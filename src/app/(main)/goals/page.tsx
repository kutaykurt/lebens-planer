'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Target, ChevronRight, Sparkles, Trophy, Rocket, Heart, Briefcase, BookOpen, DollarSign } from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Dialog, DialogFooter, Input, Select, Textarea, toast } from '@/components/ui';
import { useLifeOSStore, useActiveGoals, useHydration } from '@/stores';
import { cn } from '@/lib/utils';
import type { Goal, GoalCategory, TimeHorizon } from '@/types';
import { GOAL_CATEGORY_LABELS, TIME_HORIZON_LABELS } from '@/types';
import { TagSelector } from '@/components/features/TagSelector';

// Category Icons with colors
const CATEGORY_CONFIG: Record<GoalCategory, { icon: typeof Target; color: string; gradient: string }> = {
    health: { icon: Heart, color: 'text-rose-500', gradient: 'from-rose-500 to-pink-500' },
    career: { icon: Briefcase, color: 'text-blue-500', gradient: 'from-blue-500 to-cyan-500' },
    relationships: { icon: Heart, color: 'text-purple-500', gradient: 'from-purple-500 to-violet-500' },
    personal: { icon: Sparkles, color: 'text-indigo-500', gradient: 'from-indigo-500 to-purple-500' },
    finance: { icon: DollarSign, color: 'text-emerald-500', gradient: 'from-emerald-500 to-teal-500' },
    learning: { icon: BookOpen, color: 'text-amber-500', gradient: 'from-amber-500 to-orange-500' },
    other: { icon: Target, color: 'text-slate-500', gradient: 'from-slate-500 to-gray-500' },
};

// ─── Goal Card Component ─────────────────────────────────────────────────────

function GoalCard({ goal, index }: { goal: Goal; index: number }) {
    const config = CATEGORY_CONFIG[goal.category];
    const Icon = config.icon;

    return (
        <Link href={`/goals/${goal.id}`}>
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
                    <div className={cn(
                        'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0',
                        'bg-gradient-to-br shadow-lg',
                        config.gradient,
                        `shadow-${goal.category === 'health' ? 'rose' : goal.category === 'career' ? 'blue' : 'indigo'}-500/20`
                    )}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--foreground)] mb-1 group-hover:text-[var(--accent-primary)] transition-colors">
                            {goal.title}
                        </h3>
                        {goal.description && (
                            <p className="text-sm text-[var(--foreground-secondary)] line-clamp-2 mb-3">
                                {goal.description}
                            </p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--background-elevated)] text-[var(--foreground-muted)]">
                                {GOAL_CATEGORY_LABELS[goal.category]}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--accent-primary-light)] text-[var(--accent-primary)]">
                                {TIME_HORIZON_LABELS[goal.timeHorizon]}
                            </span>
                        </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-[var(--foreground-muted)] shrink-0 group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" />
                </div>
            </Card>
        </Link>
    );
}

// ─── Add Goal Dialog ─────────────────────────────────────────────────────────

function AddGoalDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<GoalCategory>('personal');
    const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('medium');
    const [projectId, setProjectId] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const addGoal = useLifeOSStore((s) => s.addGoal);
    const allProjects = useLifeOSStore((s) => s.projects);
    const projects = allProjects.filter(p => p.status === 'active');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            addGoal({
                title: title.trim(),
                description: description.trim() || null,
                category,
                timeHorizon,
                status: 'active',
                projectId: projectId || null,
                tagIds: selectedTags,
            });
            toast.success('Ziel erstellt! 🎯');
            setTitle('');
            setDescription('');
            setCategory('personal');
            setTimeHorizon('medium');
            setProjectId('');
            setSelectedTags([]);
            onClose();
        }
    };

    const categoryOptions = Object.entries(GOAL_CATEGORY_LABELS).map(([value, label]) => ({
        value,
        label,
    }));

    const timeHorizonOptions = Object.entries(TIME_HORIZON_LABELS).map(([value, label]) => ({
        value,
        label,
    }));

    const projectOptions = [
        { value: '', label: 'Kein Projekt' },
        ...projects.map(p => ({ value: p.id, label: p.title }))
    ];

    return (
        <Dialog open={open} onClose={onClose} title="Neues Ziel erstellen">
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Was ist dein Ziel?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="z.B. Marathonläufer werden"
                    autoFocus
                    required
                />

                <Textarea
                    label="Beschreibung (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Warum ist dir dieses Ziel wichtig?"
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
                        Ziel erstellen
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyGoalsState({ onAddGoal }: { onAddGoal: () => void }) {
    return (
        <Card variant="gradient" className="text-center py-14 animate-fade-in">
            <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-success)]/20 flex items-center justify-center">
                    <Rocket className="w-12 h-12 text-[var(--accent-primary)] animate-float" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Trophy className="w-4 h-4 text-white" />
                </div>
            </div>

            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                Definiere deine Ziele
            </h2>
            <p className="text-[var(--foreground-secondary)] mb-6 max-w-sm mx-auto leading-relaxed">
                Ziele geben deinem Alltag Richtung und Bedeutung.
                Sie helfen dir zu entscheiden, worauf du dich fokussieren sollst.
            </p>
            <Button onClick={onAddGoal} size="lg" className="gap-2">
                <Target className="w-5 h-5" />
                Erstes Ziel erstellen
            </Button>
        </Card>
    );
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function GoalsPageSkeleton() {
    return (
        <PageContainer>
            <div className="animate-pulse">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="h-8 w-24 skeleton rounded-xl mb-2" />
                        <div className="h-4 w-40 skeleton rounded-lg" />
                    </div>
                    <div className="h-11 w-32 skeleton rounded-xl" />
                </div>
                <div className="h-28 skeleton rounded-2xl mb-4" />
                <div className="h-28 skeleton rounded-2xl mb-4" />
                <div className="h-28 skeleton rounded-2xl" />
            </div>
        </PageContainer>
    );
}

// ─── Goals Page ──────────────────────────────────────────────────────────────

export default function GoalsPage() {
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [mounted, setMounted] = useState(false);
    const isHydrated = useHydration();
    const activeGoals = useActiveGoals();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isHydrated) {
        return <GoalsPageSkeleton />;
    }

    return (
        <PageContainer>
            {/* Header */}
            <div className="flex items-center justify-between mb-8 animate-fade-in">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Ziele</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1">
                        {activeGoals.length === 0
                            ? 'Noch keine Ziele definiert'
                            : `${activeGoals.length} aktive Ziele`}
                    </p>
                </div>
                {activeGoals.length > 0 && (
                    <Button onClick={() => setShowAddGoal(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Neues Ziel
                    </Button>
                )}
            </div>

            {/* Goals List or Empty State */}
            {activeGoals.length === 0 ? (
                <EmptyGoalsState onAddGoal={() => setShowAddGoal(true)} />
            ) : (
                <div>
                    {activeGoals.map((goal, i) => (
                        <GoalCard key={goal.id} goal={goal} index={i} />
                    ))}
                </div>
            )}

            <AddGoalDialog open={showAddGoal} onClose={() => setShowAddGoal(false)} />
        </PageContainer>
    );
}

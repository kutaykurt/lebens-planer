'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Plus, Target, ChevronRight, Trash2,
    Heart, Briefcase, BookOpen, DollarSign, Sparkles, Users
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Dialog, DialogFooter, Input, Select, Textarea, toast } from '@/components/ui';
import { useLifeOSStore, useActiveGoals, useHydration } from '@/stores';
import { cn } from '@/lib/utils';
import type { Goal, GoalCategory, TimeHorizon } from '@/types';
import { GOAL_CATEGORY_LABELS, TIME_HORIZON_LABELS } from '@/types';

// Category Icons with colors
const CATEGORY_CONFIG: Record<GoalCategory, { icon: any; color: string; bg: string }> = {
    health: { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    career: { icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    relationships: { icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    personal: { icon: Sparkles, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    finance: { icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    learning: { icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    other: { icon: Target, color: 'text-slate-500', bg: 'bg-slate-500/10' },
};

// ─── Goal Card Component ─────────────────────────────────────────────────────

function GoalCard({ goal, onDelete }: { goal: Goal; onDelete: (id: string) => void }) {
    const config = CATEGORY_CONFIG[goal.category];
    const Icon = config.icon;

    return (
        <Card className="p-5 group hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    config.bg
                )}>
                    <Icon className={cn("w-6 h-6", config.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="font-bold text-[var(--foreground)] text-lg mb-1 group-hover:text-[var(--accent-primary)] transition-colors">
                                {goal.title}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={cn(
                                    "text-xs font-medium px-2 py-0.5 rounded-full",
                                    config.bg, config.color
                                )}>
                                    {GOAL_CATEGORY_LABELS[goal.category]}
                                </span>
                                <span className="text-xs text-[var(--foreground-muted)]">
                                    {TIME_HORIZON_LABELS[goal.timeHorizon]}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onDelete(goal.id);
                                }}
                                className="h-8 w-8 text-rose-500 hover:bg-rose-500/10"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            <Link href={`/goals/${goal.id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {goal.description && (
                        <p className="text-sm text-[var(--foreground-muted)] mt-3 line-clamp-2">
                            {goal.description}
                        </p>
                    )}

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-[var(--foreground-muted)]">Fortschritt</span>
                            <span className="text-xs font-bold text-[var(--foreground)]">{goal.progress || 0}%</span>
                        </div>
                        <div className="h-2 bg-[var(--background-elevated)] rounded-full overflow-hidden">
                            <div
                                className={cn("h-full rounded-full transition-all duration-500",
                                    goal.progress >= 100 ? "bg-emerald-500" : "bg-[var(--accent-primary)]"
                                )}
                                style={{ width: `${goal.progress || 0}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

// ─── Add Goal Dialog ─────────────────────────────────────────────────────────

function AddGoalDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<GoalCategory>('personal');
    const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('medium');

    const addGoal = useLifeOSStore((s) => s.addGoal);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            addGoal({
                title: title.trim(),
                description: description.trim() || null,
                category,
                timeHorizon,
                status: 'active',
                progress: 0,
                projectId: null,
                tagIds: [],
            });
            toast.success('Ziel erstellt! 🎯');
            setTitle('');
            setDescription('');
            setCategory('personal');
            setTimeHorizon('medium');
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} title="Neues Ziel erstellen">
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Titel"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="z.B. Gesünder leben"
                    autoFocus
                    required
                />

                <Textarea
                    label="Beschreibung (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Was möchtest du erreichen?"
                    className="min-h-[100px]"
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Kategorie"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as GoalCategory)}
                        options={Object.entries(GOAL_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))}
                    />

                    <Select
                        label="Zeithorizont"
                        value={timeHorizon}
                        onChange={(e) => setTimeHorizon(e.target.value as TimeHorizon)}
                        options={Object.entries(TIME_HORIZON_LABELS).map(([value, label]) => ({ value, label }))}
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

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function GoalsPage() {
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);
    const isHydrated = useHydration();
    const activeGoals = useActiveGoals();
    const deleteGoal = useLifeOSStore((s) => s.deleteGoal);

    const handleDeleteGoal = (id: string) => {
        deleteGoal(id);
        setDeletingGoalId(null);
        toast.success('Ziel gelöscht');
    };

    // Group goals by category
    const goalsByCategory = activeGoals.reduce((acc, goal) => {
        if (!acc[goal.category]) acc[goal.category] = [];
        acc[goal.category].push(goal);
        return acc;
    }, {} as Record<GoalCategory, Goal[]>);

    if (!isHydrated) {
        return (
            <PageContainer>
                <div className="animate-pulse space-y-6">
                    <div className="h-20 bg-[var(--background-elevated)] rounded-2xl" />
                    <div className="h-32 bg-[var(--background-elevated)] rounded-2xl" />
                    <div className="h-32 bg-[var(--background-elevated)] rounded-2xl" />
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
                        Meine Ziele
                    </h1>
                    <p className="text-[var(--foreground-muted)] mt-1">
                        {activeGoals.length} aktive Ziele
                    </p>
                </div>
                <Button onClick={() => setShowAddGoal(true)} className="gap-2">
                    <Plus className="w-5 h-5" />
                    Neues Ziel
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-8">
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                    const count = goalsByCategory[key as GoalCategory]?.length || 0;
                    const Icon = config.icon;
                    return (
                        <Card key={key} className="p-3 text-center">
                            <div className={cn("w-8 h-8 rounded-lg mx-auto mb-1.5 flex items-center justify-center", config.bg)}>
                                <Icon className={cn("w-4 h-4", config.color)} />
                            </div>
                            <p className="text-xl font-bold text-[var(--foreground)]">{count}</p>
                            <p className="text-[10px] text-[var(--foreground-muted)] truncate">{GOAL_CATEGORY_LABELS[key as GoalCategory]}</p>
                        </Card>
                    );
                })}
            </div>

            {/* Goals List */}
            {activeGoals.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--accent-primary)]/10 flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-[var(--accent-primary)]" />
                    </div>
                    <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">
                        Noch keine Ziele
                    </h2>
                    <p className="text-[var(--foreground-muted)] mb-6 max-w-sm mx-auto">
                        Erstelle dein erstes Ziel und beginne, deine Träume zu verfolgen.
                    </p>
                    <Button onClick={() => setShowAddGoal(true)} className="gap-2">
                        <Plus className="w-5 h-5" />
                        Erstes Ziel erstellen
                    </Button>
                </Card>
            ) : (
                <div className="space-y-4 mb-32">
                    {activeGoals.map((goal) => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onDelete={setDeletingGoalId}
                        />
                    ))}
                </div>
            )}

            <AddGoalDialog open={showAddGoal} onClose={() => setShowAddGoal(false)} />

            {/* Delete Confirmation */}
            <Dialog
                open={!!deletingGoalId}
                onClose={() => setDeletingGoalId(null)}
                title="Ziel löschen?"
                description="Dieses Ziel wird dauerhaft gelöscht."
            >
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setDeletingGoalId(null)}>
                        Abbrechen
                    </Button>
                    <Button variant="destructive" onClick={() => deletingGoalId && handleDeleteGoal(deletingGoalId)}>
                        Löschen
                    </Button>
                </DialogFooter>
            </Dialog>
        </PageContainer>
    );
}

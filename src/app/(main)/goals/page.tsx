'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Plus, Target, ChevronRight, Sparkles, Trophy, Rocket,
    Heart, Briefcase, BookOpen, DollarSign, Star, Compass,
    Shield, Zap, Activity, LayoutGrid
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Dialog, DialogFooter, Input, Select, Textarea, toast } from '@/components/ui';
import { useLifeOSStore, useActiveGoals, useHydration } from '@/stores';
import { cn } from '@/lib/utils';
import type { Goal, GoalCategory, TimeHorizon } from '@/types';
import { GOAL_CATEGORY_LABELS, TIME_HORIZON_LABELS } from '@/types';
import { TagSelector } from '@/components/features/TagSelector';

// Category Icons with colors
const CATEGORY_CONFIG: Record<GoalCategory, { icon: any; color: string; gradient: string; glow: string }> = {
    health: { icon: Heart, color: 'text-rose-500', gradient: 'from-rose-500 to-pink-500', glow: 'shadow-rose-500/20' },
    career: { icon: Briefcase, color: 'text-blue-500', gradient: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/20' },
    relationships: { icon: Heart, color: 'text-purple-500', gradient: 'from-purple-500 to-violet-500', glow: 'shadow-purple-500/20' },
    personal: { icon: Sparkles, color: 'text-indigo-500', gradient: 'from-indigo-500 to-purple-500', glow: 'shadow-indigo-500/20' },
    finance: { icon: DollarSign, color: 'text-emerald-500', gradient: 'from-emerald-500 to-teal-500', glow: 'shadow-emerald-500/20' },
    learning: { icon: BookOpen, color: 'text-amber-500', gradient: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/20' },
    other: { icon: Target, color: 'text-slate-500', gradient: 'from-slate-500 to-gray-500', glow: 'shadow-slate-500/20' },
};

// ─── Goal Card Component ─────────────────────────────────────────────────────

function GoalCard({ goal, index }: { goal: Goal; index: number }) {
    const config = CATEGORY_CONFIG[goal.category];
    const Icon = config.icon;

    return (
        <Link href={`/goals/${goal.id}`}>
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
                <div className={cn(
                    "absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-32 -mt-32 transition-colors duration-700 pointer-events-none opacity-10",
                    config.gradient.replace('from-', 'bg-').split(' ')[0]
                )} />

                <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
                    {/* Icon & Category Indicator */}
                    <div className="flex flex-col items-center gap-4 shrink-0">
                        <div className={cn(
                            'w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:rotate-6',
                            'bg-gradient-to-br',
                            config.gradient,
                            config.glow
                        )}>
                            <Icon className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
                        </div>
                        <div className={cn(
                            "px-3 py-1 rounded-full border bg-opacity-10",
                            config.color.replace('text-', 'text-'),
                            config.color.replace('text-', 'bg-'),
                            config.color.replace('text-', 'border-') + "/20"
                        )}>
                            <span className="text-[9px] font-black uppercase tracking-widest">{GOAL_CATEGORY_LABELS[goal.category]}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <h3 className="text-3xl font-black text-[var(--foreground)] tracking-tighter uppercase italic group-hover:text-indigo-500 transition-colors">
                                    {goal.title}
                                </h3>
                                <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                        <Compass className="w-3.5 h-3.5 text-indigo-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                                            Horizon: {TIME_HORIZON_LABELS[goal.timeHorizon]}
                                        </span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-[var(--border)]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] opacity-60">
                                        Strategy: Long Game
                                    </span>
                                </div>
                            </div>
                        </div>

                        {goal.description && (
                            <p className="text-sm text-[var(--foreground-secondary)] font-medium leading-relaxed mb-6 line-clamp-2 md:pr-12 italic opacity-80">
                                "{goal.description}"
                            </p>
                        )}

                        {/* Visual Progress or Sub-elements indicator */}
                        <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
                            {goal.tagIds?.map(tagId => (
                                <span key={tagId} className="px-2.5 py-1 rounded-lg bg-[var(--background-elevated)] border border-[var(--border-subtle)] text-[9px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">
                                    #{tagId.slice(0, 8)}
                                </span>
                            ))}
                            {!goal.tagIds?.length && (
                                <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[var(--foreground-muted)] opacity-50">
                                    <Zap className="w-3 h-3" /> System Ready
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:flex flex-col justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--background-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-xl">
                            <ChevronRight className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Decorative border bottom */}
                <div className={cn(
                    "absolute bottom-0 left-0 w-full h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left",
                    "bg-gradient-to-r",
                    config.gradient
                )} />
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
            toast.success('Ziel im Sektor initialisiert! 🎯');
            setTitle('');
            setDescription('');
            setCategory('personal');
            setTimeHorizon('medium');
            setProjectId('');
            setSelectedTags([]);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} title="Sektor-Ziel initialisieren">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Ziel-Bezeichnung"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="z.B. Physische Exzellenz"
                    autoFocus
                    required
                />

                <Textarea
                    label="Missions-Briefing"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Warum ist dieses Ziel für dein System essenziell?"
                    className="min-h-[120px]"
                />

                <Select
                    label="Übergeordnetes Projekt"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    options={[
                        { value: '', label: 'Keine Projektzuordnung' },
                        ...projects.map(p => ({ value: p.id, label: p.title }))
                    ]}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Sektor (Kategorie)"
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

                <div>
                    <label className="text-sm font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-3 block">Assoziierte Tags</label>
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
                        Ziel synchronisieren
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function GoalsPage() {
    const [showAddGoal, setShowAddGoal] = useState(false);
    const isHydrated = useHydration();
    const activeGoals = useActiveGoals();

    if (!isHydrated) {
        return (
            <PageContainer>
                <div className="animate-pulse space-y-8">
                    <div className="h-24 bg-[var(--background-elevated)] rounded-[2.5rem]" />
                    <div className="h-32 bg-[var(--background-elevated)] rounded-[2.5rem]" />
                    <div className="h-32 bg-[var(--background-elevated)] rounded-[2.5rem]" />
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            {/* Header / North Star Navigator */}
            <div className="relative mb-16">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
                    <div>
                        <div className="flex items-center gap-6 mb-4">
                            <div className="w-16 h-16 rounded-[2.5rem] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-[var(--foreground)] tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground-muted)]">
                                    North-<span className="text-purple-500">Star</span>
                                </h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500">Operation: Future Vision</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <Card variant="glass" className="p-6 rounded-[2rem] border-purple-500/10 bg-purple-500/5 backdrop-blur-xl">
                            <p className="text-[10px] font-black uppercase tracking-widest text-purple-500/60 mb-2">Navigator</p>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black tracking-tighter">{activeGoals.length}</span>
                                <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase mb-1.5">Ziele</span>
                            </div>
                        </Card>

                        <Card variant="glass" className="p-6 rounded-[2rem] border-rose-500/10 bg-rose-500/5 backdrop-blur-xl hidden md:block">
                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-500/60 mb-2">Momentum</p>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black tracking-tighter text-glow-rose">Elite</span>
                                <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase mb-1.5">Focus</span>
                            </div>
                        </Card>

                        <Button
                            onClick={() => setShowAddGoal(true)}
                            className="h-auto aspect-square md:aspect-auto md:h-24 md:px-8 rounded-[2rem] bg-purple-500 hover:bg-purple-600 text-white flex flex-col items-center justify-center group shadow-2xl shadow-purple-500/20"
                        >
                            <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
                            <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] mt-2">Add Vision</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Goals List or Empty State */}
            {activeGoals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-[var(--border)] rounded-[4rem] bg-purple-500/[0.02] relative group">
                    <div className="absolute inset-0 bg-purple-500/[0.02] group-hover:bg-purple-500/[0.04] transition-colors rounded-[4rem]" />
                    <div className="w-24 h-24 rounded-[2.5rem] bg-purple-500/10 flex items-center justify-center mb-8 relative z-10">
                        <Rocket className="w-12 h-12 text-purple-500 animate-float" />
                    </div>
                    <h2 className="text-3xl font-black text-[var(--foreground)] mb-4 tracking-tighter uppercase italic relative z-10">
                        Sektor: <span className="text-purple-500">Undefiniert</span>
                    </h2>
                    <p className="text-[var(--foreground-secondary)] mb-10 text-center max-w-sm font-medium relative z-10">
                        Keine Langzeitziele lokalisiert. Definiere deine Vision, um dem System Richtung zu geben.
                    </p>
                    <Button
                        onClick={() => setShowAddGoal(true)}
                        size="lg"
                        className="gap-3 bg-purple-500 hover:bg-purple-600 text-white px-10 rounded-2xl h-14 shadow-xl shadow-purple-500/20 font-black uppercase tracking-widest relative z-10"
                    >
                        <Plus className="w-6 h-6" /> Vision initialisieren
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {activeGoals.map((goal, i) => (
                        <GoalCard key={goal.id} goal={goal} index={i} />
                    ))}
                </div>
            )}

            <AddGoalDialog open={showAddGoal} onClose={() => setShowAddGoal(false)} />
        </PageContainer>
    );
}

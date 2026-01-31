'use client';

import { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, Star, Calendar, TrendingUp, Brain, Sparkles, PenLine } from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Dialog, DialogFooter, Textarea, toast } from '@/components/ui';
import {
    useLifeOSStore,
    useCurrentWeekReflection,
    useAllReflections,
    useWeekSummary,
    useHydration,
} from '@/stores';
import { formatDate, getWeekStart, getWeekEnd, formatDateShort, cn } from '@/lib/utils';
import type { WeeklyReflection, WeekSummary as WeekSummaryType } from '@/types';
import { WheelOfLife } from '@/components/features/WheelOfLife';


// ─── Satisfaction Rating ─────────────────────────────────────────────────────

function SatisfactionRating({
    value,
    onChange
}: {
    value: number;
    onChange: (value: number) => void;
}) {
    const labels = ['Schlecht', 'Mäßig', 'Okay', 'Gut', 'Großartig'];

    return (
        <div className="space-y-4">
            <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                        key={rating}
                        type="button"
                        onClick={() => onChange(rating)}
                        className={cn(
                            'relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300',
                            'hover:scale-110 active:scale-95',
                            value >= rating
                                ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30'
                                : 'bg-[var(--background-elevated)] border border-[var(--border)] hover:border-[var(--accent-warning)]'
                        )}
                    >
                        <Star
                            className={cn(
                                'w-7 h-7 transition-all duration-200',
                                value >= rating ? 'text-white fill-white' : 'text-[var(--foreground-muted)]'
                            )}
                        />
                    </button>
                ))}
            </div>
            <p className="text-center text-sm font-medium text-[var(--foreground-secondary)]">
                {labels[value - 1]}
            </p>
        </div>
    );
}

// ─── Week Summary Display ────────────────────────────────────────────────────

function WeekSummaryDisplay({ summary }: { summary: WeekSummaryType }) {
    const stats = [
        {
            label: 'Aufgaben',
            value: `${summary.tasksCompleted}/${summary.tasksTotal}`,
            icon: TrendingUp,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            label: 'Gewohnheiten',
            value: `${summary.habitsCompletionRate}%`,
            icon: Sparkles,
            color: 'from-emerald-500 to-teal-500',
        },
        {
            label: 'Ø Energie',
            value: summary.averageEnergyLevel?.toFixed(1) ?? '–',
            icon: Star,
            color: 'from-amber-400 to-orange-500',
        },
        {
            label: 'Aktive Ziele',
            value: summary.activeGoalsCount.toString(),
            icon: Brain,
            color: 'from-purple-500 to-violet-500',
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 mb-6">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.label}
                        className="p-4 rounded-2xl bg-[var(--background-elevated)] border border-[var(--border)]"
                    >
                        <div className={cn(
                            'w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center mb-2',
                            stat.color
                        )}>
                            <Icon className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-[var(--foreground)]">
                            {stat.value}
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)]">
                            {stat.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Reflection Dialog ───────────────────────────────────────────────────────

function ReflectionDialog({
    open,
    onClose,
    weekStart,
    weekEnd,
    existingReflection,
}: {
    open: boolean;
    onClose: () => void;
    weekStart: string;
    weekEnd: string;
    existingReflection?: WeeklyReflection;
}) {
    const [step, setStep] = useState(1);
    const [satisfaction, setSatisfaction] = useState(existingReflection?.satisfactionRating ?? 3);
    const [wentWell, setWentWell] = useState(existingReflection?.wentWell ?? '');
    const [challenges, setChallenges] = useState(existingReflection?.challenges ?? '');
    const [nextWeekFocus, setNextWeekFocus] = useState(existingReflection?.nextWeekFocus ?? '');

    const saveReflection = useLifeOSStore((s) => s.saveReflection);
    const weekSummary = useWeekSummary(new Date(weekStart));

    const handleSubmit = () => {
        saveReflection({
            weekStart,
            weekEnd,
            satisfactionRating: satisfaction,
            wentWell: wentWell.trim() || null,
            challenges: challenges.trim() || null,
            nextWeekFocus: nextWeekFocus.trim() || null,
            goalAdjustmentNeeded: false,
            additionalNotes: null,
            weekSummary,
        });
        toast.success('Reflexion gespeichert! 📝');
        onClose();
    };

    const steps = [
        { title: 'Zufriedenheit', subtitle: 'Wie bewertest du diese Woche?' },
        { title: 'Erfolge', subtitle: 'Was lief gut?' },
        { title: 'Herausforderungen', subtitle: 'Was war schwierig?' },
        { title: 'Fokus', subtitle: 'Dein Fokus für nächste Woche' },
    ];

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <WeekSummaryDisplay summary={weekSummary} />
                        <SatisfactionRating value={satisfaction} onChange={setSatisfaction} />
                    </div>
                );
            case 2:
                return (
                    <Textarea
                        label="Was lief gut diese Woche?"
                        value={wentWell}
                        onChange={(e) => setWentWell(e.target.value)}
                        placeholder="Worauf bist du stolz? Was hat dich gefreut?"
                        className="min-h-[140px]"
                    />
                );
            case 3:
                return (
                    <Textarea
                        label="Was war herausfordernd?"
                        value={challenges}
                        onChange={(e) => setChallenges(e.target.value)}
                        placeholder="Womit hast du gekämpft? Was hat nicht funktioniert?"
                        className="min-h-[140px]"
                    />
                );
            case 4:
                return (
                    <Textarea
                        label="Worauf möchtest du dich nächste Woche fokussieren?"
                        value={nextWeekFocus}
                        onChange={(e) => setNextWeekFocus(e.target.value)}
                        placeholder="Eine Priorität oder ein Thema für nächste Woche"
                        className="min-h-[140px]"
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            title={steps[step - 1].title}
            description={steps[step - 1].subtitle}
            size="md"
        >
            {/* Progress */}
            <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4].map((s) => (
                    <div
                        key={s}
                        className={cn(
                            'h-1.5 flex-1 rounded-full transition-all duration-300',
                            s <= step
                                ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[#8b5cf6]'
                                : 'bg-[var(--background-elevated)]'
                        )}
                    />
                ))}
            </div>

            {renderStep()}

            <DialogFooter>
                {step > 1 && (
                    <Button type="button" variant="ghost" onClick={() => setStep(step - 1)}>
                        Zurück
                    </Button>
                )}
                {step < 4 ? (
                    <Button onClick={() => setStep(step + 1)}>
                        Weiter
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} variant="success" className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        Speichern
                    </Button>
                )}
            </DialogFooter>
        </Dialog>
    );
}

// ─── Reflection Card ─────────────────────────────────────────────────────────

function ReflectionCard({ reflection, index }: { reflection: WeeklyReflection; index: number }) {
    return (
        <Card
            variant="elevated"
            hover
            className={cn('mb-3 animate-fade-in-up')}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary-light)] flex items-center justify-center">
                        <PenLine className="w-5 h-5 text-[var(--accent-primary)]" />
                    </div>
                    <div>
                        <p className="font-medium text-[var(--foreground)]">
                            {formatDateShort(new Date(reflection.weekStart))} – {formatDateShort(new Date(reflection.weekEnd))}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        'w-3.5 h-3.5',
                                        star <= reflection.satisfactionRating
                                            ? 'text-amber-400 fill-amber-400'
                                            : 'text-[var(--foreground-subtle)]'
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--foreground-muted)]" />
            </div>
        </Card>
    );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyReflectState({ onStartReflection }: { onStartReflection: () => void }) {
    return (
        <Card variant="gradient" className="text-center py-14 animate-fade-in">
            <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-info)]/20 flex items-center justify-center">
                    <Brain className="w-12 h-12 text-[var(--accent-primary)] animate-float" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[var(--accent-primary)]/30">
                    <Star className="w-4 h-4 text-white" />
                </div>
            </div>

            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                Zeit für Reflexion
            </h2>
            <p className="text-[var(--foreground-secondary)] mb-6 max-w-sm mx-auto leading-relaxed">
                Wöchentliche Reflexion hilft dir, bewusster zu leben und aus deinen Erfahrungen zu lernen.
            </p>
            <Button onClick={onStartReflection} size="lg" className="gap-2">
                <PenLine className="w-5 h-5" />
                Erste Reflexion starten
            </Button>
        </Card>
    );
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function ReflectPageSkeleton() {
    return (
        <PageContainer>
            <div className="animate-pulse">
                <div className="h-8 w-32 skeleton rounded-xl mb-2" />
                <div className="h-4 w-48 skeleton rounded-lg mb-8" />
                <div className="h-56 skeleton rounded-2xl mb-6" />
                <div className="h-20 skeleton rounded-2xl mb-3" />
                <div className="h-20 skeleton rounded-2xl" />
            </div>
        </PageContainer>
    );
}

// ─── Reflect Page ────────────────────────────────────────────────────────────

export default function ReflectPage() {
    const [showReflection, setShowReflection] = useState(false);
    const [mounted, setMounted] = useState(false);
    const isHydrated = useHydration();
    const currentReflection = useCurrentWeekReflection();
    const allReflections = useAllReflections();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isHydrated) {
        return <ReflectPageSkeleton />;
    }

    const today = new Date();
    const weekStart = formatDate(getWeekStart(today));
    const weekEnd = formatDate(getWeekEnd(today));

    const pastReflections = allReflections.filter((r) => r.weekStart !== weekStart);

    return (
        <PageContainer>
            {/* Header */}
            <div className="mb-8 animate-fade-in">
                <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Reflexion</h1>
                <p className="text-[var(--foreground-secondary)] mt-1">
                    Lerne aus deinen Erfahrungen
                </p>
            </div>

            <WheelOfLife />

            {/* Current Week Card */}
            <Card variant="elevated" glow={currentReflection ? 'none' : 'primary'} className="mb-6 animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[var(--accent-primary)]/20">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-[var(--foreground)]">Diese Woche</h2>
                            <p className="text-sm text-[var(--foreground-secondary)]">
                                {formatDateShort(new Date(weekStart))} – {formatDateShort(new Date(weekEnd))}
                            </p>
                        </div>
                    </div>
                    {currentReflection ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent-success-light)]">
                            <Sparkles className="w-4 h-4 text-[var(--accent-success)]" />
                            <span className="text-sm font-medium text-[var(--accent-success)]">
                                Abgeschlossen
                            </span>
                        </div>
                    ) : (
                        <Button onClick={() => setShowReflection(true)} className="gap-2">
                            <PenLine className="w-4 h-4" />
                            Starten
                        </Button>
                    )}
                </div>

                {currentReflection && (
                    <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        'w-5 h-5',
                                        star <= currentReflection.satisfactionRating
                                            ? 'text-amber-400 fill-amber-400'
                                            : 'text-[var(--foreground-subtle)]'
                                    )}
                                />
                            ))}
                        </div>
                        {currentReflection.nextWeekFocus && (
                            <div className="p-3 rounded-xl bg-[var(--background-elevated)]">
                                <p className="text-xs text-[var(--foreground-muted)] mb-1">
                                    Fokus nächste Woche
                                </p>
                                <p className="text-[var(--foreground)]">
                                    {currentReflection.nextWeekFocus}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* Past Reflections */}
            {pastReflections.length > 0 && (
                <div className="animate-fade-in-up stagger-2">
                    <h2 className="font-semibold text-[var(--foreground)] mb-4">
                        Vergangene Reflexionen
                    </h2>
                    <div>
                        {pastReflections.map((reflection, i) => (
                            <ReflectionCard key={reflection.id} reflection={reflection} index={i} />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {allReflections.length === 0 && !currentReflection && (
                <EmptyReflectState onStartReflection={() => setShowReflection(true)} />
            )}

            <ReflectionDialog
                open={showReflection}
                onClose={() => setShowReflection(false)}
                weekStart={weekStart}
                weekEnd={weekEnd}
                existingReflection={currentReflection}
            />
        </PageContainer>
    );
}

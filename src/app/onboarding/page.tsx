'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Target, CheckSquare, Repeat, ArrowRight, Sparkles, Brain, Zap } from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';
import { useLifeOSStore, useHydration } from '@/stores';
import { cn } from '@/lib/utils';

// ─── Onboarding Steps ────────────────────────────────────────────────────────

const STEPS = [
    {
        id: 'welcome',
        emoji: '🌱',
        title: 'Willkommen bei Life OS',
        description: 'Dein persönliches System für ein bewussteres Leben – komplett privat und offline.',
        color: 'from-indigo-500 to-purple-500',
    },
    {
        id: 'name',
        icon: Brain,
        title: 'Dein Profil',
        description: 'Wie dürfen wir dich nennen?',
        color: 'from-pink-500 to-rose-500',
    },
    {
        id: 'goals',
        icon: Target,
        title: 'Ziele definieren',
        description: 'Setze dir langfristige Ziele, um deinem Alltag Richtung zu geben.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        id: 'habits',
        icon: Repeat,
        title: 'Gewohnheiten aufbauen',
        description: 'Kleine tägliche Gewohnheiten führen zu großen Veränderungen.',
        color: 'from-emerald-500 to-teal-500',
    },
    {
        id: 'ready',
        icon: Sparkles,
        title: 'Bereit zum Start!',
        description: 'Du hast alles, was du brauchst. Lass uns loslegen!',
        color: 'from-amber-400 to-orange-500',
    },
];

// ─── Loading State ───────────────────────────────────────────────────────────

function OnboardingSkeleton() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
            <div className="w-full max-w-md animate-pulse">
                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-2 skeleton rounded-full" />
                    ))}
                </div>
                <div className="h-96 skeleton rounded-3xl" />
            </div>
        </div>
    );
}

// ─── Onboarding Page ─────────────────────────────────────────────────────────

export default function OnboardingPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const isHydrated = useHydration();
    const [currentStep, setCurrentStep] = useState(0);
    const [name, setName] = useState('');
    const [firstGoal, setFirstGoal] = useState('');
    const [firstHabit, setFirstHabit] = useState('');

    const addGoal = useLifeOSStore((s) => s.addGoal);
    const addHabit = useLifeOSStore((s) => s.addHabit);
    const updatePreferences = useLifeOSStore((s) => s.updatePreferences);
    const completeOnboarding = useLifeOSStore((s) => s.completeOnboarding);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isHydrated) {
        return <OnboardingSkeleton />;
    }

    const isLastStep = currentStep === STEPS.length - 1;
    const step = STEPS[currentStep];

    const handleNext = () => {
        if (step.id === 'name') {
            if (name.trim()) {
                updatePreferences({ name: name.trim() });
            } else {
                return; // Prevent next if empty? Or optional? Let's make it optional but default to 'User' is already set.
                // Actually better to enforce it if they are on this step.
            }
        }

        if (isLastStep) {
            // Save optional inputs
            if (firstGoal.trim()) {
                addGoal({
                    title: firstGoal.trim(),
                    description: null,
                    category: 'personal',
                    timeHorizon: 'medium',
                    status: 'active',
                });
            }

            if (firstHabit.trim()) {
                addHabit({
                    title: firstHabit.trim(),
                    description: null,
                    frequency: 'daily',
                    targetDays: null,
                    targetCount: null,
                    goalId: null,
                });
            }

            completeOnboarding();
            router.push('/today');
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleSkip = () => {
        completeOnboarding();
        router.push('/today');
    };

    // Progress dots
    const ProgressDots = () => (
        <div className="flex justify-center gap-2 mb-8">
            {STEPS.map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        'h-2 rounded-full transition-all duration-500 ease-out',
                        index === currentStep
                            ? 'w-10 bg-gradient-to-r from-[var(--accent-primary)] to-[#8b5cf6]'
                            : index < currentStep
                                ? 'w-2 bg-[var(--accent-primary)]'
                                : 'w-2 bg-[var(--border)]'
                    )}
                />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--background)]">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-[var(--accent-primary)]/10 blur-3xl" />
                <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-[var(--accent-success)]/10 blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <ProgressDots />

                <Card variant="glass" padding="lg" className="text-center animate-fade-in-scale">
                    {/* Icon */}
                    <div className={cn(
                        'w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center',
                        'bg-gradient-to-br shadow-2xl',
                        step.color
                    )}>
                        {step.emoji ? (
                            <span className="text-5xl">{step.emoji}</span>
                        ) : step.icon ? (
                            <step.icon className="w-12 h-12 text-white" />
                        ) : null}
                    </div>

                    {/* Content */}
                    <h1 className="text-2xl font-bold text-[var(--foreground)] mb-3 tracking-tight">
                        {step.title}
                    </h1>
                    <p className="text-[var(--foreground-secondary)] mb-8 leading-relaxed">
                        {step.description}
                    </p>

                    {/* Step Inputs */}
                    {step.id === 'name' && (
                        <div className="mb-6">
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Dein Name"
                                className="text-center text-lg h-12"
                                autoFocus
                            />
                        </div>
                    )}

                    {/* Optional Inputs on relevant steps */}
                    {step.id === 'goals' && (
                        <div className="mb-6">
                            <Input
                                value={firstGoal}
                                onChange={(e) => setFirstGoal(e.target.value)}
                                placeholder="z.B. Gesünder leben"
                                className="text-center"
                            />
                            <p className="text-xs text-[var(--foreground-muted)] mt-2">
                                Optional – du kannst später mehr hinzufügen
                            </p>
                        </div>
                    )}

                    {step.id === 'habits' && (
                        <div className="mb-6">
                            <Input
                                value={firstHabit}
                                onChange={(e) => setFirstHabit(e.target.value)}
                                placeholder="z.B. 10 Minuten meditieren"
                                className="text-center"
                            />
                            <p className="text-xs text-[var(--foreground-muted)] mt-2">
                                Optional – starte klein und einfach
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <Button onClick={handleNext} size="lg" className="w-full gap-2">
                            {isLastStep ? 'Los geht\'s!' : 'Weiter'}
                            <ArrowRight className="w-4 h-4" />
                        </Button>

                        {currentStep === 0 && (
                            <button
                                onClick={handleSkip}
                                className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] transition-colors py-2"
                            >
                                Überspringen
                            </button>
                        )}
                    </div>
                </Card>

                {/* Privacy Note */}
                {currentStep === 0 && (
                    <div className="mt-8 text-center animate-fade-in-up stagger-3">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--background-surface)] border border-[var(--border)]">
                            <div className="w-6 h-6 rounded-full bg-[var(--accent-success-light)] flex items-center justify-center">
                                <Zap className="w-3.5 h-3.5 text-[var(--accent-success)]" />
                            </div>
                            <span className="text-sm text-[var(--foreground-secondary)]">
                                100% offline & privat
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import {
    Trophy, Zap, Target, Star,
    Calendar, Flame, CheckCircle2,
    Lock, Sparkles, ArrowRight
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, toast } from '@/components/ui';
import { useLifeOSStore, useHydration } from '@/stores';
import { type Challenge } from '@/types';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

const CHALLENGE_PRESETS: Partial<Challenge>[] = [
    {
        id: '30_day_focus',
        title: '30 Tage Fokus-Meister',
        description: 'Schließe 30 Tage in Folge mindestens 3 Aufgaben ab.',
        targetCount: 30,
        xpReward: 5000,
        type: 'tasks'
    },
    {
        id: '15_day_energy',
        title: 'Energie-Harmonie',
        description: 'Logge deine Energie für 15 Tage, um Muster zu erkennen.',
        targetCount: 15,
        xpReward: 2000,
        type: 'energy'
    },
    {
        id: 'habit_warrior_21',
        title: 'Habit Warrior',
        description: 'Erreiche 21 Tage Konsistenz bei deinen Haupt-Habits.',
        targetCount: 21,
        xpReward: 3500,
        type: 'habits'
    }
];

export default function ChallengesPage() {
    const isHydrated = useHydration();
    const activeChallenges = useLifeOSStore((s) => s.preferences.activeChallenges) || [];
    const startChallenge = useLifeOSStore((s) => s.startChallenge);

    if (!isHydrated) return null;

    const handleStartChallenge = (preset: Partial<Challenge>) => {
        const isAlreadyActive = activeChallenges.some(c => c.id === preset.id);
        if (isAlreadyActive) {
            toast.error('Diese Challenge läuft bereits!');
            return;
        }

        const newChallenge: Challenge = {
            id: preset.id!,
            title: preset.title!,
            description: preset.description!,
            targetCount: preset.targetCount!,
            currentCount: 0,
            xpReward: preset.xpReward!,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            isActive: true,
            type: preset.type as any
        };

        startChallenge(newChallenge);
        toast.success(`Challenge "${newChallenge.title}" gestartet! 🚀`);
    };

    return (
        <PageContainer>
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-black uppercase tracking-widest mb-4">
                    <Flame className="w-3 h-3" />
                    Special Events
                </div>
                <h1 className="text-5xl font-black text-[var(--foreground)] tracking-tight">30-Tage <span className="text-rose-500">Challenges</span></h1>
                <p className="text-[var(--foreground-secondary)] text-lg mt-2">Beweise deine Disziplin und verdiene massive Belohnungen.</p>
            </div>

            <div className="space-y-12">
                {/* Active Challenges */}
                {activeChallenges.filter(c => c.isActive).length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" /> Aktive Quests
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeChallenges.filter(c => c.isActive).map(challenge => (
                                <Card key={challenge.id} className="p-6 border-2 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-xl font-black text-[var(--foreground)]">{challenge.title}</h3>
                                            <p className="text-sm text-[var(--foreground-secondary)]">{challenge.description}</p>
                                        </div>
                                        <div className="p-2 rounded-xl bg-amber-500/10">
                                            <Trophy className="w-6 h-6 text-amber-500" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                            <span className="text-[var(--foreground-muted)]">Fortschritt</span>
                                            <span className="text-amber-500">{challenge.currentCount} / {challenge.targetCount}</span>
                                        </div>
                                        <div className="h-3 bg-[var(--background-subtle)] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000"
                                                style={{ width: `${(challenge.currentCount / challenge.targetCount) * 100}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <p className="text-[10px] text-[var(--foreground-muted)] uppercase font-bold">Endet am {challenge.endDate}</p>
                                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-black">
                                                +{challenge.xpReward} XP
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* Available Challenges */}
                <section>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Star className="w-5 h-5 text-indigo-500" /> Verfügbare Challenges
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {CHALLENGE_PRESETS.map(preset => {
                            const isActive = activeChallenges.some(c => c.id === preset.id && c.isActive);
                            return (
                                <Card key={preset.id} className={cn(
                                    "p-6 flex flex-col group",
                                    isActive && "opacity-50 pointer-events-none"
                                )}>
                                    <div className="w-12 h-12 rounded-2xl bg-[var(--background-elevated)] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                                        {preset.type === 'tasks' ? '🎯' : preset.type === 'habits' ? '🔥' : '⚡'}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{preset.title}</h3>
                                    <p className="text-sm text-[var(--foreground-secondary)] flex-1 leading-relaxed">
                                        {preset.description}
                                    </p>
                                    <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                                        <div className="text-xs font-black text-emerald-500">+{preset.xpReward} XP</div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="font-bold text-xs gap-2 group"
                                            onClick={() => handleStartChallenge(preset)}
                                        >
                                            Starten <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </section>
            </div>
        </PageContainer>
    );
}

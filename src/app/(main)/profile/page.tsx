'use client';

import { useMemo } from 'react';
import {
    Trophy, Star, Target, Sparkles, Award, Lock, ShoppingBag, ArrowRight
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { useLifeOSStore, useHydration } from '@/stores';
import { cn } from '@/lib/utils';
import { ACHIEVEMENTS, SHOP_ITEMS, type Achievement, type AchievementId } from '@/types';
import { WheelOfLife } from '@/components/features/WheelOfLife';
import { SkillTree } from '@/components/features/SkillTree';

function AchievementCard({ achievement, unlocked }: { achievement: Achievement; unlocked: boolean }) {
    return (
        <Card
            className={cn(
                "p-4 flex flex-col items-center text-center relative overflow-hidden transition-all duration-300",
                unlocked
                    ? "border-[var(--accent-primary)]/50 bg-gradient-to-br from-[var(--accent-primary)]/10 to-transparent hover:scale-105 hover:shadow-lg"
                    : "opacity-60 grayscale border-dashed bg-[var(--background-subtle)]"
            )}
        >
            {/* Icon */}
            <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3 transition-transform duration-500",
                unlocked ? "bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 text-white shadow-lg scale-110" : "bg-[var(--background-elevated)]"
            )}>
                {unlocked ? achievement.icon : <Lock className="w-6 h-6 text-[var(--foreground-muted)]" />}
            </div>

            {/* Content */}
            <h3 className="font-bold text-[var(--foreground)] mb-1">{achievement.title}</h3>
            <p className="text-xs text-[var(--foreground-secondary)] mb-3 line-clamp-2">{achievement.description}</p>

            {/* XP Badge */}
            <div className={cn(
                "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                unlocked ? "bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]" : "bg-[var(--background-elevated)] text-[var(--foreground-muted)]"
            )}>
                +{achievement.xpReward} XP
            </div>

            {/* Shine effect if unlocked */}
            {unlocked && (
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-white opacity-20 rotate-45 blur-xl pointer-events-none animate-pulse" />
            )}
        </Card>
    );
}

export default function ProfilePage() {
    const isHydrated = useHydration();

    const preferences = useLifeOSStore((s) => s.preferences);
    const xp = preferences.xp;
    const unlockedIds = preferences.unlockedAchievements || [];

    const XP_PER_LEVEL = 500;
    const level = Math.floor(xp / XP_PER_LEVEL) + 1;
    const progress = ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;
    const remainingXp = XP_PER_LEVEL - (xp % XP_PER_LEVEL);

    // Group achievements
    const unlockedAchievements = ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id));
    const lockedAchievements = ACHIEVEMENTS.filter(a => !unlockedIds.includes(a.id));
    const completionRate = Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100);

    if (!isHydrated) return null;

    return (
        <PageContainer>
            <div className="mb-10 text-center">
                {/* Avatar / Level Header */}
                <div className="relative w-32 h-32 mx-auto mb-6 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] to-purple-600 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-1000 animate-pulse-slow"></div>
                    <div className="relative w-full h-full rounded-full bg-[var(--background-elevated)] border-4 border-[var(--background)] flex items-center justify-center shadow-2xl overflow-hidden">
                        <span className="text-6xl filter drop-shadow-lg">🧙‍♂️</span>
                        {/* Level Badge */}
                        <div className="absolute bottom-0 right-0 w-10 h-10 bg-[var(--accent-primary)] rounded-full flex items-center justify-center font-black text-white border-4 border-[var(--background)] z-10">
                            {level}
                        </div>
                    </div>
                </div>

                <h1 className="text-4xl font-black text-[var(--foreground)] tracking-tighter mb-2">Dein Charakter</h1>
                <p className="text-[var(--foreground-secondary)] text-lg mb-8">Level {level} • {xp} XP Total</p>

                {/* XP Bar */}
                <div className="max-w-md mx-auto mb-12">
                    <div className="flex justify-between text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
                        <span>Level {level}</span>
                        <span>{progress.toFixed(0)}%</span>
                        <span>Level {level + 1}</span>
                    </div>
                    <div className="h-4 bg-[var(--background-subtle)] rounded-full overflow-hidden relative shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-purple-500 relative transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                        </div>
                    </div>
                    <p className="text-xs text-[var(--foreground-muted)] cool-gray-500 mt-2">
                        Noch <span className="text-[var(--accent-primary)] font-bold">{remainingXp} XP</span> bis zum nächsten Level
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Skills & Attributes */}
                <div className="md:col-span-2 space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Wheel of Life Overview */}
                        <div className="lg:col-span-1">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Target className="w-5 h-5 text-blue-500" />
                                Skill-Balance
                            </h2>
                            <WheelOfLife />
                        </div>

                        {/* Detailized Skill Tree */}
                        <div className="lg:col-span-2">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                Advanced Skill Tree
                            </h2>
                            <Card className="p-8">
                                <SkillTree />
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Inventory Section */}
                <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--foreground)]">
                            <ShoppingBag className="w-5 h-5 text-indigo-500" /> Ausrüstung & Inventar
                        </h2>
                        <Button variant="ghost" size="sm" className="text-xs font-black uppercase tracking-wider" onClick={() => window.location.href = '/shop'}>
                            Zum Shop <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>

                    {preferences.inventory && preferences.inventory.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                            {preferences.inventory.map(itemId => {
                                const item = SHOP_ITEMS.find(i => i.id === itemId);
                                if (!item) return null;
                                return (
                                    <Card key={itemId} className="p-4 flex flex-col items-center justify-center gap-2 group hover:border-[var(--accent-primary)] transition-all cursor-pointer">
                                        <div className="text-3xl group-hover:scale-125 transition-transform duration-500">{item.icon}</div>
                                        <p className="text-[10px] font-bold text-[var(--foreground)] truncate w-full text-center">{item.title}</p>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="p-12 border-dashed flex flex-col items-center text-center">
                            <ShoppingBag className="w-12 h-12 text-[var(--foreground-muted)] mb-4 opacity-20" />
                            <p className="text-[var(--foreground-muted)] mb-4">Dein Rucksack ist noch leer.</p>
                            <Button variant="primary" size="sm" onClick={() => window.location.href = '/shop'}>Erstes Item kaufen</Button>
                        </Card>
                    )}
                </div>

                {/* Achievements Section */}
                <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            Achievements
                        </h2>
                        <span className="text-sm font-bold px-3 py-1 bg-[var(--background-subtle)] rounded-full text-[var(--foreground-secondary)]">
                            {unlockedAchievements.length} / {ACHIEVEMENTS.length}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {ACHIEVEMENTS.map(ach => (
                            <AchievementCard
                                key={ach.id}
                                achievement={ach}
                                unlocked={unlockedIds.includes(ach.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}

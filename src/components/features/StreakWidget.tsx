'use client';

import { useMemo } from 'react';
import { useLifeOSStore } from '@/stores';
import { Card } from '@/components/ui';
import { Flame, Trophy, TrendingUp } from 'lucide-react';
import { cn, formatDate, parseDate, subtractDays, getToday } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { Habit } from '@/types';

export function StreakWidget() {
    const habits = useLifeOSStore((s) => s.habits);
    const habitLogs = useLifeOSStore((s) => s.habitLogs);
    const completedOnboarding = useLifeOSStore((s) => s.preferences.hasCompletedOnboarding);

    const bestStreakData = useMemo(() => {
        const activeHabits = habits.filter(h => h.isActive !== false && !h.isArchived); // Handle undefined as true

        let bestHabit: Habit | null = null;
        let maxStreak = 0;
        const todayStr = getToday();

        activeHabits.forEach(habit => {
            // Calculate streak
            const logs = habitLogs
                .filter((l) => l.habitId === habit.id && l.completed)
                .sort((a, b) => b.date.localeCompare(a.date));

            let currentStreak = 0;
            if (logs.length > 0) {
                let expectedDate = todayStr;

                // If not logged today, check if logged yesterday
                if (logs[0].date !== expectedDate) {
                    const yesterday = formatDate(subtractDays(parseDate(todayStr), 1));
                    if (logs[0].date === yesterday) {
                        expectedDate = yesterday;
                    } else {
                        // Streak broken
                        expectedDate = '';
                    }
                }

                if (expectedDate) {
                    for (const log of logs) {
                        if (log.date === expectedDate) {
                            currentStreak++;
                            expectedDate = formatDate(subtractDays(parseDate(expectedDate), 1));
                        } else {
                            break;
                        }
                    }
                }
            }

            if (currentStreak >= maxStreak) {
                maxStreak = currentStreak;
                bestHabit = habit;
            }
        });

        return { habit: bestHabit, streak: maxStreak };
    }, [habits, habitLogs]);

    const preferences = useLifeOSStore((s) => s.preferences);
    const masterStreak = preferences.masterStreak;
    const streakFreezes = preferences.streakFreezes;

    if (!completedOnboarding || (!bestStreakData.habit && masterStreak.current === 0)) return null;

    const habit = bestStreakData.habit as Habit | null;
    const streak = bestStreakData.streak;

    return (
        <Card variant="elevated" className="relative overflow-hidden group">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-indigo-50/30 pointer-events-none" />

            <div className="flex flex-col p-4 gap-4">
                {/* Master Streak (Top) */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
                                <Trophy className="w-5 h-5" />
                            </div>
                            {masterStreak.current > 0 && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-[var(--foreground)] leading-none text-base">
                                    {masterStreak.current} <span className="text-xs font-normal text-[var(--foreground-muted)] uppercase tracking-wider">Master-Streak</span>
                                </h3>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="flex gap-0.5">
                                    {[...Array(3)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "w-4 h-1 rounded-full transition-all",
                                                i < streakFreezes ? "bg-cyan-500" : "bg-[var(--background-subtle)]"
                                            )}
                                            title="Streak Freeze"
                                        />
                                    ))}
                                </div>
                                <span className="text-[9px] font-black uppercase text-[var(--foreground-muted)] tracking-tighter">
                                    {streakFreezes} Freezes
                                </span>
                            </div>
                        </div>
                    </div>
                    {masterStreak.best > masterStreak.current && (
                        <div className="text-[10px] font-bold text-[var(--foreground-muted)] bg-[var(--background-subtle)] px-2 py-0.5 rounded-full">
                            Best: {masterStreak.best}
                        </div>
                    )}
                </div>

                {/* Habit Streak (Bottom - Divider) */}
                {habit && streak > 0 && (
                    <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Flame className={cn("w-4 h-4 text-orange-500", streak > 3 && "animate-pulse")} />
                            <span className="text-sm font-bold text-[var(--foreground)]">{streak} <span className="text-[10px] text-[var(--foreground-muted)] uppercase">{habit.title}</span></span>
                        </div>
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                    </div>
                )}
            </div>
        </Card>
    );
}

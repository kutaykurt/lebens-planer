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

    if (!completedOnboarding || !bestStreakData.habit) return null;

    const { habit, streak } = bestStreakData;

    if (streak === 0) return null; // Don't show if 0 streak

    return (
        <Card variant="elevated" className="relative overflow-hidden group">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform duration-300">
                            <Flame className={cn(
                                "w-6 h-6",
                                streak > 0 && "animate-pulse"
                            )} />
                        </div>
                        {streak > 7 && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white"
                            >
                                HOT
                            </motion.div>
                        )}
                    </div>

                    {/* Text */}
                    <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <h3 className="font-bold text-[var(--foreground)] text-lg leading-none">
                                {streak} <span className="text-sm font-normal text-[var(--foreground-muted)]">Tage</span>
                            </h3>
                            {streak > 3 && (
                                <TrendingUp className="w-3 h-3 text-emerald-500" />
                            )}
                        </div>
                        <p className="text-xs text-[var(--foreground-muted)] font-medium line-clamp-1">
                            {habit.title}
                        </p>
                    </div>
                </div>

                {/* Trophy/Rank (Decorative) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Trophy className="w-5 h-5 text-amber-500" />
                </div>
            </div>
        </Card>
    );
}

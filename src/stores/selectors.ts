import { useMemo } from 'react';
import { useLifeOSStore } from './lifeOSStore';
import { formatDate, subtractDays, getWeekStart, getWeekEnd, parseDate } from '@/lib/utils';
import type { Task, Goal, Habit, HabitLog, EnergyLog, DailyLog } from '@/types';

// ─── Helper to get stable date ───────────────────────────────────────────────

function getStableToday(): string {
    if (typeof window === 'undefined') {
        return '2026-01-31'; // SSR fallback
    }
    return formatDate(new Date());
}

// ─── Task Selectors ──────────────────────────────────────────────────────────

/**
 * Get tasks for a specific date
 */
export const useTasksByDate = (date: string): Task[] => {
    const tasks = useLifeOSStore((state) => state.tasks);

    return useMemo(() => {
        return tasks
            .filter((t) => t.scheduledDate === date && t.status !== 'cancelled')
            .sort((a, b) => {
                if (a.status !== b.status) {
                    return a.status === 'pending' ? -1 : 1;
                }
                return a.sortOrder - b.sortOrder;
            });
    }, [tasks, date]);
};

/**
 * Get today's tasks
 */
export const useTodaysTasks = (): Task[] => {
    const today = getStableToday();
    return useTasksByDate(today);
};

/**
 * Get overdue tasks (before today and pending)
 */
export const useOverdueTasks = (): Task[] => {
    const tasks = useLifeOSStore((state) => state.tasks);
    const today = getStableToday();

    return useMemo(() => {
        return tasks
            .filter((t) =>
                t.scheduledDate &&
                t.scheduledDate < today &&
                t.status === 'pending'
            )
            .sort((a, b) => a.scheduledDate!.localeCompare(b.scheduledDate!));
    }, [tasks, today]);
};

/**
 * Get inbox tasks (no scheduled date)
 */
export const useInboxTasks = (): Task[] => {
    const tasks = useLifeOSStore((state) => state.tasks);

    return useMemo(() => {
        return tasks
            .filter((t) => !t.scheduledDate && t.status === 'pending')
            .sort((a, b) => a.sortOrder - b.sortOrder);
    }, [tasks]);
};

/**
 * Get pending tasks count
 */
export const usePendingTasksCount = (): number => {
    const tasks = useLifeOSStore((state) => state.tasks);
    return useMemo(() => tasks.filter((t) => t.status === 'pending').length, [tasks]);
};

/**
 * Get tasks linked to a goal
 */
export const useTasksByGoal = (goalId: string): Task[] => {
    const tasks = useLifeOSStore((state) => state.tasks);

    return useMemo(() => {
        return tasks
            .filter((t) => t.goalId === goalId && t.status !== 'cancelled')
            .sort((a, b) => a.sortOrder - b.sortOrder);
    }, [tasks, goalId]);
};

// ─── Goal Selectors ──────────────────────────────────────────────────────────

/**
 * Get active goals (not archived, not completed)
 */
export const useActiveGoals = (): Goal[] => {
    const goals = useLifeOSStore((state) => state.goals);

    return useMemo(() => {
        return goals
            .filter((g) => g.status === 'active')
            .sort((a, b) => a.sortOrder - b.sortOrder);
    }, [goals]);
};

/**
 * Get goals by category
 */
export const useGoalsByCategory = (category: string): Goal[] => {
    const goals = useLifeOSStore((state) => state.goals);

    return useMemo(() => {
        return goals
            .filter((g) => g.category === category && g.status !== 'archived')
            .sort((a, b) => a.sortOrder - b.sortOrder);
    }, [goals, category]);
};

/**
 * Get goal by ID
 */
export const useGoalById = (id: string): Goal | undefined => {
    const goals = useLifeOSStore((state) => state.goals);
    return useMemo(() => goals.find((g) => g.id === id), [goals, id]);
};

/**
 * Get active goals count
 */
export const useActiveGoalsCount = (): number => {
    const goals = useLifeOSStore((state) => state.goals);
    return useMemo(() => goals.filter((g) => g.status === 'active').length, [goals]);
};

// ─── Habit Selectors ─────────────────────────────────────────────────────────

/**
 * Get active habits
 */
export const useActiveHabits = (): Habit[] => {
    const habits = useLifeOSStore((state) => state.habits);
    return useMemo(() => habits.filter((h) => h.isActive && !h.isArchived), [habits]);
};

/**
 * Get habit by ID
 */
export const useHabitById = (id: string): Habit | undefined => {
    const habits = useLifeOSStore((state) => state.habits);
    return useMemo(() => habits.find((h) => h.id === id), [habits, id]);
};

/**
 * Get habit logs for a specific habit
 */
export const useHabitLogs = (habitId: string): HabitLog[] => {
    const habitLogs = useLifeOSStore((state) => state.habitLogs);

    return useMemo(() => {
        return habitLogs
            .filter((l) => l.habitId === habitId)
            .sort((a, b) => b.date.localeCompare(a.date));
    }, [habitLogs, habitId]);
};

/**
 * Check if habit is completed for a date
 */
export const useIsHabitCompleted = (habitId: string, date: string): boolean => {
    const habitLogs = useLifeOSStore((state) => state.habitLogs);

    return useMemo(() => {
        const log = habitLogs.find(
            (l) => l.habitId === habitId && l.date === date
        );
        return log?.completed ?? false;
    }, [habitLogs, habitId, date]);
};

/**
 * Get habits that should be done today
 */
export const useTodaysHabits = (): Habit[] => {
    const habits = useLifeOSStore((state) => state.habits);

    return useMemo(() => {
        const today = new Date();
        const dayOfWeek = today.getDay();

        return habits.filter((h) => {
            if (!h.isActive || h.isArchived) return false;

            switch (h.frequency) {
                case 'daily':
                    return true;
                case 'specific_days':
                    return h.targetDays?.includes(dayOfWeek) ?? false;
                case 'times_per_week':
                    return true;
                default:
                    return false;
            }
        });
    }, [habits]);
};

/**
 * Calculate current streak for a habit
 */
export const useHabitStreak = (habitId: string): number => {
    const habitLogs = useLifeOSStore((state) => state.habitLogs);

    return useMemo(() => {
        const logs = habitLogs
            .filter((l) => l.habitId === habitId && l.completed)
            .sort((a, b) => b.date.localeCompare(a.date));

        if (logs.length === 0) return 0;

        const today = getStableToday();
        let streak = 0;
        let expectedDate = today;

        // If not completed today, check if it was completed yesterday
        if (logs[0].date !== expectedDate) {
            expectedDate = formatDate(subtractDays(parseDate(today), 1));
            if (logs[0].date !== expectedDate) {
                return 0;
            }
        }

        for (const log of logs) {
            if (log.date === expectedDate) {
                streak++;
                expectedDate = formatDate(subtractDays(parseDate(expectedDate), 1));
            } else {
                break;
            }
        }

        return streak;
    }, [habitLogs, habitId]);
};

/**
 * Get habit completion rate for the last N days
 */
export const useHabitCompletionRate = (habitId: string, days: number = 30): number => {
    const habitLogs = useLifeOSStore((state) => state.habitLogs);

    return useMemo(() => {
        const today = new Date();
        const startDate = subtractDays(today, days - 1);
        const startDateStr = formatDate(startDate);

        const logs = habitLogs.filter(
            (l) => l.habitId === habitId && l.date >= startDateStr && l.completed
        );

        return (logs.length / days) * 100;
    }, [habitLogs, habitId, days]);
};

// ─── Daily Journal Selectors ──────────────────────────────────────────────────
/**
 * Get daily log for a specific date
 */
export const useDailyLogByDate = (date: string): DailyLog | undefined => {
    const dailyLogs = useLifeOSStore((state) => state.dailyLogs);
    return useMemo(() => dailyLogs.find((l) => l.date === date), [dailyLogs, date]);
};

/**
 * Get today's daily log
 */
export const useTodaysDailyLog = (): DailyLog | undefined => {
    const today = getStableToday();
    return useDailyLogByDate(today);
};

// ─── Energy Selectors ────────────────────────────────────────────────────────

/**
 * Get energy log for a specific date
 */
export const useEnergyByDate = (date: string): EnergyLog | undefined => {
    const energyLogs = useLifeOSStore((state) => state.energyLogs);
    return useMemo(() => energyLogs.find((l) => l.date === date), [energyLogs, date]);
};

/**
 * Get today's energy log
 */
export const useTodaysEnergy = (): EnergyLog | undefined => {
    const today = getStableToday();
    return useEnergyByDate(today);
};

/**
 * Get energy logs for the last N days
 */
export const useRecentEnergyLogs = (days: number = 7): EnergyLog[] => {
    const energyLogs = useLifeOSStore((state) => state.energyLogs);

    return useMemo(() => {
        const today = new Date();
        const startDate = subtractDays(today, days - 1);
        const startDateStr = formatDate(startDate);

        return energyLogs
            .filter((l) => l.date >= startDateStr)
            .sort((a, b) => b.date.localeCompare(a.date));
    }, [energyLogs, days]);
};

/**
 * Get average energy level for date range
 */
export const useAverageEnergy = (startDate: string, endDate: string): number | null => {
    const energyLogs = useLifeOSStore((state) => state.energyLogs);

    return useMemo(() => {
        const logs = energyLogs.filter(
            (l) => l.date >= startDate && l.date <= endDate
        );

        if (logs.length === 0) return null;

        const sum = logs.reduce((acc, l) => acc + l.level, 0);
        return sum / logs.length;
    }, [energyLogs, startDate, endDate]);
};

// ─── Reflection Selectors ────────────────────────────────────────────────────

/**
 * Get reflection for a specific week
 */
export const useReflectionForWeek = (weekStart: string) => {
    const reflections = useLifeOSStore((state) => state.reflections);
    return useMemo(() => reflections.find((r) => r.weekStart === weekStart), [reflections, weekStart]);
};

/**
 * Get current week's reflection
 */
export const useCurrentWeekReflection = () => {
    const today = new Date();
    const weekStart = formatDate(getWeekStart(today));
    return useReflectionForWeek(weekStart);
};

/**
 * Get all reflections sorted by date
 */
export const useAllReflections = () => {
    const reflections = useLifeOSStore((state) => state.reflections);

    return useMemo(() => {
        return [...reflections].sort((a, b) => b.weekStart.localeCompare(a.weekStart));
    }, [reflections]);
};

// ─── Combined Selectors ─────────────────────────────────────────────────────

/**
 * Get week summary for a specific week
 */
export const useWeekSummary = (weekStart: Date) => {
    const tasks = useLifeOSStore((state) => state.tasks);
    const habits = useLifeOSStore((state) => state.habits);
    const habitLogs = useLifeOSStore((state) => state.habitLogs);
    const energyLogs = useLifeOSStore((state) => state.energyLogs);
    const goals = useLifeOSStore((state) => state.goals);

    return useMemo(() => {
        const weekStartStr = formatDate(weekStart);
        const weekEndStr = formatDate(getWeekEnd(weekStart));

        // Tasks completed this week
        const tasksThisWeek = tasks.filter(
            (t) => t.scheduledDate && t.scheduledDate >= weekStartStr && t.scheduledDate <= weekEndStr
        );
        const tasksCompleted = tasksThisWeek.filter((t) => t.status === 'completed').length;
        const tasksTotal = tasksThisWeek.filter((t) => t.status !== 'cancelled').length;

        // Habit completion rate
        const activeHabits = habits.filter((h) => h.isActive && !h.isArchived);
        const habitLogDays = 7;
        const possibleHabitCompletions = activeHabits.length * habitLogDays;
        const actualHabitCompletions = habitLogs.filter(
            (l) => l.date >= weekStartStr && l.date <= weekEndStr && l.completed
        ).length;
        const habitsCompletionRate = possibleHabitCompletions > 0
            ? (actualHabitCompletions / possibleHabitCompletions) * 100
            : 0;

        // Average energy
        const weekEnergyLogs = energyLogs.filter(
            (l) => l.date >= weekStartStr && l.date <= weekEndStr
        );
        const averageEnergyLevel = weekEnergyLogs.length > 0
            ? weekEnergyLogs.reduce((sum, l) => sum + l.level, 0) / weekEnergyLogs.length
            : null;

        // Active goals count
        const activeGoalsCount = goals.filter((g) => g.status === 'active').length;

        return {
            tasksCompleted,
            tasksTotal,
            habitsCompletionRate: Math.round(habitsCompletionRate),
            averageEnergyLevel,
            activeGoalsCount,
        };
    }, [tasks, habits, habitLogs, energyLogs, goals, weekStart]);
};

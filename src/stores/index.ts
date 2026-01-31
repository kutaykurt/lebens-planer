export { useLifeOSStore, useHydration, usePreferences, useHasCompletedOnboarding } from './lifeOSStore';
export * from './uiStore';
export type { LifeOSStore } from './lifeOSStore';

export {
    // Task Selectors
    useTasksByDate,
    useTodaysTasks,
    useOverdueTasks,
    useInboxTasks,
    usePendingTasksCount,
    useTasksByGoal,

    // Goal Selectors
    useActiveGoals,
    useGoalsByCategory,
    useGoalById,
    useActiveGoalsCount,

    // Habit Selectors
    useActiveHabits,
    useHabitById,
    useHabitLogs,
    useIsHabitCompleted,
    useTodaysHabits,
    useHabitStreak,
    useHabitCompletionRate,

    // Energy Selectors
    useEnergyByDate,
    useTodaysEnergy,
    useRecentEnergyLogs,
    useAverageEnergy,

    // Reflection Selectors
    useReflectionForWeek,
    useCurrentWeekReflection,
    useAllReflections,

    // Daily Journal Selectors
    useDailyLogByDate,
    useTodaysDailyLog,

    // Combined
    useWeekSummary,
} from './selectors';

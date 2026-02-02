import { Task, EnergyLog, HabitLog, Transaction, Budget, DailyLog } from '@/types';

export interface Insight {
    id: string;
    title: string;
    description: string;
    type: 'positive' | 'warning' | 'info';
    icon: 'Activity' | 'Zap' | 'TrendingUp' | 'Target' | 'AlertCircle' | 'Wallet' | 'Smile' | 'Shield' | 'Coffee' | 'Rocket';
    value?: string;
}

export interface QuarterlyReport {
    title: string;
    taskGrowth: number; // % comparison to prev quarter
    energyTrend: 'up' | 'down' | 'stable';
    topHabit: string;
    savingRate: number; // %
}

export function generateSmartInsights(
    tasks: Task[],
    energyLogs: EnergyLog[],
    habitLogs: HabitLog[],
    transactions: Transaction[],
    dailyLogs: DailyLog[]
): Insight[] {
    const insights: Insight[] = [];

    // 1. Energy vs Task Completion
    const highEnergyDays = energyLogs.filter(e => e.level >= 4).map(e => e.date);
    const lowEnergyDays = energyLogs.filter(e => e.level <= 2).map(e => e.date);

    if (highEnergyDays.length > 0 && lowEnergyDays.length > 0) {
        const tasksOnHighEnergy = tasks.filter(t => t.completedAt && highEnergyDays.includes(t.completedAt.split('T')[0])).length;
        const avgOnHigh = tasksOnHighEnergy / highEnergyDays.length;

        const tasksOnLowEnergy = tasks.filter(t => t.completedAt && lowEnergyDays.includes(t.completedAt.split('T')[0])).length;
        const avgOnLow = tasksOnLowEnergy / lowEnergyDays.length;

        if (avgOnHigh > avgOnLow * 1.2) {
            const diff = Math.round(((avgOnHigh - avgOnLow) / (avgOnLow || 1)) * 100);
            insights.push({
                id: 'energy-productivity',
                title: 'Energie-Fokus',
                description: `An Tagen mit hoher Energie erledigst du im Schnitt ${diff}% mehr Aufgaben. Nutze "High-Energy" Fenster für komplexe Projekte.`,
                type: 'positive',
                icon: 'Zap'
            });
        }
    }

    // 2. Habit Consistency vs Mood
    const completedHabitDates = new Set(habitLogs.filter(h => h.completed).map(h => h.date));
    const moodOnActiveHabitDays = energyLogs.filter(e => completedHabitDates.has(e.date));
    const avgMoodActive = moodOnActiveHabitDays.length > 0
        ? moodOnActiveHabitDays.reduce((acc, curr) => acc + (curr.mood === 'great' ? 5 : curr.mood === 'good' ? 4 : curr.mood === 'neutral' ? 3 : curr.mood === 'low' ? 2 : 1), 0) / moodOnActiveHabitDays.length
        : 0;

    if (avgMoodActive > 3.5) {
        insights.push({
            id: 'habit-mood',
            title: 'Gewohnheits-Glück',
            description: 'Deine Stimmung ist an Tagen, an denen du deine wichtigsten Gewohnheiten durchziehst, signifikant besser.',
            type: 'positive',
            icon: 'Smile'
        });
    }

    // 3. Finance & Energy (Stress Detection)
    const expenseDays = transactions.filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.date] = (acc[t.date] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

    const highSpendDays = Object.keys(expenseDays).filter(date => expenseDays[date] > 50);
    if (highSpendDays.length > 0) {
        const energyOnHighSpend = energyLogs.filter(e => highSpendDays.includes(e.date));
        const avgEnergyHighSpend = energyOnHighSpend.length > 0
            ? energyOnHighSpend.reduce((acc, curr) => acc + curr.level, 0) / energyOnHighSpend.length
            : 0;

        if (avgEnergyHighSpend < 2.5 && avgEnergyHighSpend > 0) {
            insights.push({
                id: 'finance-stress',
                title: 'Ausgaben-Warnung',
                description: 'Hohe Ausgaben korrelieren bei dir oft mit niedrigerem Energie-Level. Achte auf "Impuls-Käufe" bei Stress.',
                type: 'warning',
                icon: 'Wallet'
            });
        }
    }

    // 4. Peak Performance Window
    const completionHours = tasks.filter(t => t.completedAt).map(t => new Date(t.completedAt!).getHours());
    if (completionHours.length >= 5) {
        const hourCounts = completionHours.reduce((acc, h) => {
            acc[h] = (acc[h] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        const peakHour = Object.keys(hourCounts).reduce((a, b) => hourCounts[parseInt(a)] > hourCounts[parseInt(b)] ? a : b);
        const peakHourInt = parseInt(peakHour);

        insights.push({
            id: 'peak-performance',
            title: 'Deine Prime-Time',
            description: `Du bist zwischen ${peakHourInt}:00 und ${peakHourInt + 1}:00 Uhr am produktivsten. Plane deine wichtigsten Tasks in dieses Fenster.`,
            type: 'info',
            icon: 'TrendingUp'
        });
    }

    // 5. Best Day Advice (Personalized Recommendation)
    const dayTasks = tasks.filter(t => t.completedAt).reduce((acc, t) => {
        const day = new Date(t.completedAt!).getDay();
        acc[day] = (acc[day] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    if (Object.keys(dayTasks).length > 3) {
        const bestDayIdx = parseInt(Object.keys(dayTasks).reduce((a, b) => dayTasks[parseInt(a)] > dayTasks[parseInt(b)] ? a : b));
        const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
        const today = new Date().getDay();
        const tomorrow = (today + 1) % 7;

        if (tomorrow === bestDayIdx) {
            insights.unshift({
                id: 'tomorrow-best-day',
                title: 'Morgen ist dein Power-Tag!',
                description: `Statistisch gesehen ist der ${dayNames[tomorrow]} dein produktivster Tag. Plane morgen ein großes Projekt ein!`,
                type: 'positive',
                icon: 'Rocket'
            });
        }
    }

    // Default if no insights
    if (insights.length === 0) {
        insights.push({
            id: 'start-logging',
            title: 'Keine Daten, keine Insights',
            description: 'Logge mehr Aufgaben, Energie und Gewohnheiten, um tiefere Einblicke in dein Verhalten zu erhalten.',
            type: 'info',
            icon: 'Activity'
        });
    }

    return insights;
}

export function generateQuarterlyReport(
    tasks: Task[],
    energyLogs: EnergyLog[],
    transactions: Transaction[]
): QuarterlyReport {
    // Simplified logic for MVP
    const now = new Date();
    const currentQuarter = Math.floor(now.getMonth() / 3) + 1;

    return {
        title: `Q${currentQuarter} Abschlussbericht`,
        taskGrowth: 15, // Mocked for now
        energyTrend: 'up',
        topHabit: 'Morgen-Routine',
        savingRate: 22
    };
}

export interface WeeklyBriefing {
    tasksCompleted: number;
    completionRate: number;
    topCategory: string;
    avgEnergy: number;
    habitConsistency: number; // %
    totalExpenses: number;
    totalIncome: number;
    bestDay: string;
    recommendation: string;
}

export function generateWeeklyBriefing(
    tasks: Task[],
    energyLogs: EnergyLog[],
    habitLogs: HabitLog[],
    transactions: Transaction[]
): WeeklyBriefing {
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    });

    // 1. Tasks
    const weeklyTasks = tasks.filter(t => t.completedAt && last7Days.includes(t.completedAt.split('T')[0]));
    const weeklyTotal = tasks.filter(t => t.createdAt && last7Days.includes(t.createdAt.split('T')[0])).length || 1;
    const completionRate = Math.round((weeklyTasks.length / weeklyTotal) * 100);

    // 2. Energy
    const weeklyEnergy = energyLogs.filter(e => last7Days.includes(e.date));
    const avgEnergy = weeklyEnergy.length > 0
        ? weeklyEnergy.reduce((acc, curr) => acc + curr.level, 0) / weeklyEnergy.length
        : 0;

    // 3. Habits
    const weeklyHabitLogs = habitLogs.filter(h => last7Days.includes(h.date));
    const habitConsistency = weeklyHabitLogs.length > 0
        ? Math.round((weeklyHabitLogs.filter(h => h.completed).length / weeklyHabitLogs.length) * 100)
        : 0;

    // 4. Finance
    const weeklyTransactions = transactions.filter(t => last7Days.includes(t.date));
    const totalExpenses = weeklyTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const totalIncome = weeklyTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);

    // 5. Best Day (Task completion)
    const dayCounts: Record<string, number> = {};
    weeklyTasks.forEach(t => {
        const day = new Date(t.completedAt!).toLocaleDateString('de-DE', { weekday: 'long' });
        dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    const bestDay = Object.keys(dayCounts).reduce((a, b) => dayCounts[a] > dayCounts[b] ? a : b, 'Keine Daten');

    // 6. Recommendation logic
    let recommendation = "Großartige Woche! Behalte diesen Rhythmus bei.";
    if (habitConsistency < 50) recommendation = "Versuche nächste Woche, dich mehr auf deine Gewohnheiten zu konzentrieren. Sie sind das Fundament deines Erfolgs.";
    else if (avgEnergy < 3) recommendation = "Dein Energie-Level war diese Woche niedrig. Achte auf mehr Erholungspausen und ausreichend Schlaf.";
    else if (totalExpenses > totalIncome && totalIncome > 0) recommendation = "Deine Ausgaben übersteigen deine Einnahmen. Prüfe deine Budgets für die nächste Woche.";

    return {
        tasksCompleted: weeklyTasks.length,
        completionRate,
        topCategory: 'Fokus', // Hardcoded for now or derived?
        avgEnergy: Number(avgEnergy.toFixed(1)),
        habitConsistency,
        totalExpenses,
        totalIncome,
        bestDay,
        recommendation
    };
}

'use client';

import { useEffect, useRef } from 'react';
import { useLifeOSStore, usePreferences } from '@/stores';
import { NotificationService } from '@/lib/notifications';
import { getToday } from '@/lib/utils';

export function NotificationTrigger() {
    const preferences = usePreferences();
    const updatePreferences = useLifeOSStore((s) => s.updatePreferences);
    const tasks = useLifeOSStore((s) => s.tasks);
    const habits = useLifeOSStore((s) => s.habits);
    const habitLogs = useLifeOSStore((s) => s.habitLogs);
    const lastCheck = useRef<number>(0);

    useEffect(() => {
        // Only run if notifications are enabled and supported
        if (!preferences.notifications?.enabled || !NotificationService.isSupported()) return;

        const checkTriggers = () => {
            if (!preferences.notifications) return;
            const now = new Date();
            const hour = now.getHours();
            const today = getToday();
            const dayOfWeek = now.getDay();

            // Avoid running too often (once per 5 mins is enough for background checks)
            // But on mount we check immediately
            const currentTimestamp = now.getTime();
            // if (currentTimestamp - lastCheck.current < 300000) return;
            lastCheck.current = currentTimestamp;

            // 1. Morning Briefing (08:00 - 11:00)
            if (preferences.notifications.morningBriefing && hour >= 8 && hour < 11) {
                if (preferences.lastSentNotifications.morningBriefing !== today) {
                    const todayTasks = tasks.filter(t => t.scheduledDate === today && t.status === 'pending');
                    NotificationService.send('Guten Morgen! ☀️', {
                        body: todayTasks.length > 0
                            ? `Du hast heute ${todayTasks.length} Aufgaben geplant. Bereit für den Tag?`
                            : 'Dein Tag ist noch leer. Zeit für eine kurze Planung?',
                    });
                    updatePreferences({
                        lastSentNotifications: {
                            ...preferences.lastSentNotifications,
                            morningBriefing: today
                        }
                    });
                }
            }

            // 2. Evening Reflection (21:00 - 23:00)
            if (preferences.notifications.eveningReflection && hour >= 21) {
                if (preferences.lastSentNotifications.eveningReflection !== today) {
                    const isSunday = now.getDay() === 0;
                    NotificationService.send(
                        isSunday ? 'Zeit für deine Wochen-Reflexion! 📊' : 'Zeit für einen Rückblick? 🌙',
                        {
                            body: isSunday
                                ? 'Die Woche ist fast vorbei. Schließe sie mit einer Reflexion ab.'
                                : 'Wie war dein Tag? Nimm dir 2 Minuten für deine Reflexion.',
                        }
                    );
                    updatePreferences({
                        lastSentNotifications: {
                            ...preferences.lastSentNotifications,
                            eveningReflection: today
                        }
                    });
                }
            }

            // 3. Deadline Warning (14:00 - 16:00)
            if (preferences.notifications.taskDeadlines && hour >= 14 && hour < 16) {
                if (preferences.lastSentNotifications.deadlineWarning !== today) {
                    const todayTasks = tasks.filter(t => t.scheduledDate === today && t.status === 'pending');
                    if (todayTasks.length > 0) {
                        NotificationService.send('Fokus-Check! 🎯', {
                            body: `Du hast noch ${todayTasks.length} offene Aufgaben für heute. Endspurt!`,
                        });
                    }
                    updatePreferences({
                        lastSentNotifications: {
                            ...preferences.lastSentNotifications,
                            deadlineWarning: today
                        }
                    });
                }
            }

            // 4. Streak Warning (18:00 - 20:00)
            if (preferences.notifications.streakWarnings && hour >= 18 && hour < 20) {
                if (preferences.lastSentNotifications.streakWarning !== today) {
                    const activeHabitsToday = habits.filter(h => {
                        if (h.frequency === 'daily') return true;
                        if (h.frequency === 'specific_days' && h.targetDays?.includes(dayOfWeek)) return true;
                        return false;
                    });

                    const incompleteHabits = activeHabitsToday.filter(h => {
                        return !habitLogs.some(l => l.habitId === h.id && l.date === today && l.completed);
                    });

                    if (incompleteHabits.length > 0) {
                        NotificationService.send('Streak-Gefahr! 🔥', {
                            body: `Du hast noch ${incompleteHabits.length} Habits offen. Rette deine Serie!`,
                        });
                    }

                    updatePreferences({
                        lastSentNotifications: {
                            ...preferences.lastSentNotifications,
                            streakWarning: today
                        }
                    });
                }
            }
        };

        // Run immediately
        checkTriggers();

        // Check every 15 minutes
        const interval = setInterval(checkTriggers, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, [preferences.notifications, preferences.lastSentNotifications, tasks, habits, habitLogs, updatePreferences]);

    return null; // Invisible component
}

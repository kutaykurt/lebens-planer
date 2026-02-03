import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useUIStore } from './uiStore';
import { indexedDBStorage } from '@/lib/db';
import { generateId, getCurrentTimestamp, formatDate, getToday, getWeekStart, getWeekEnd, getNextOccurrence } from '@/lib/utils';
import type {
    Goal,
    Task,
    Habit,
    HabitLog,
    EnergyLog,
    WeeklyReflection,
    UserPreferences,
    EnergyLevel,
    MoodType,
    WeekSummary,
    DailyLog,
    MediaItem,
    Note,
    Transaction,
    Budget,
    Tag,
    Project,
    MonthlyReflection,
    YearlyReflection,
    AchievementId,
    SkillType,
    Challenge,
    Interaction,
    Contact,
} from '@/types';
import { ACHIEVEMENTS, SHOP_ITEMS } from '@/types';

// ─── State Interface ─────────────────────────────────────────────────────────

interface LifeOSState {
    // Entities
    projects: Project[];
    goals: Goal[];
    tasks: Task[];
    habits: Habit[];
    habitLogs: HabitLog[];
    energyLogs: EnergyLog[];
    reflections: WeeklyReflection[];
    monthlyReflections: MonthlyReflection[];
    yearlyReflections: YearlyReflection[];
    dailyLogs: DailyLog[];
    mediaItems: MediaItem[];
    notes: Note[];
    transactions: Transaction[];
    budgets: Budget[];
    tags: Tag[];
    contacts: Contact[];

    // Preferences
    preferences: UserPreferences;

    // Meta
    schemaVersion: number;
    lastUpdated: string;

    // Hydration
    _hasHydrated: boolean;
}

// ─── Actions Interface ───────────────────────────────────────────────────────

interface LifeOSActions {
    setHasHydrated: (state: boolean) => void;

    // Projects
    addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | '_version' | 'completedAt' | 'tagIds'> & { tagIds?: string[] }) => string;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;

    // Goals
    addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | '_version' | 'sortOrder' | 'completedAt' | 'archivedAt' | 'tagIds' | 'projectId'> & { tagIds?: string[], projectId?: string | null }) => string;
    updateGoal: (id: string, updates: Partial<Goal>) => void;
    completeGoal: (id: string) => void;
    archiveGoal: (id: string) => void;
    deleteGoal: (id: string) => void;
    reorderGoals: (goalIds: string[]) => void;

    // Tasks
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | '_version' | 'sortOrder' | 'completedAt' | 'status' | 'priority' | 'skillId' | 'subtasks' | 'recurrence' | 'tagIds'> & {
        priority?: Task['priority'],
        skillId?: Task['skillId'],
        subtasks?: Task['subtasks'],
        recurrence?: Task['recurrence'],
        tagIds?: string[]
    }) => string;
    updateTask: (id: string, updates: Partial<Task>) => void;
    completeTask: (id: string) => void;
    uncompleteTask: (id: string) => void;
    deleteTask: (id: string) => void;
    toggleSubtask: (taskId: string, subtaskId: string) => void;
    addSubtask: (taskId: string, title: string) => void;
    deleteSubtask: (taskId: string, subtaskId: string) => void;

    // Media Vault
    addMediaItem: (item: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt' | '_version'>) => string;
    updateMediaItem: (id: string, updates: Partial<MediaItem>) => void;
    deleteMediaItem: (id: string) => void;

    // Wiki / Notes
    addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | '_version' | 'tagIds'> & { tagIds?: string[] }) => string;
    updateNote: (id: string, updates: Partial<Note>) => void;
    deleteNote: (id: string) => void;

    // Finance
    addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | '_version'>) => string;
    deleteTransaction: (id: string) => void;
    updateBudget: (budget: Budget) => void;

    moveTaskToDate: (id: string, date: string | null) => void;
    reorderTasks: (taskIds: string[]) => void;

    // Habits
    addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | '_version' | 'isActive' | 'isArchived' | 'archivedAt' | 'tagIds'> & { tagIds?: string[] }) => string;
    updateHabit: (id: string, updates: Partial<Habit>) => void;
    archiveHabit: (id: string) => void;
    deleteHabit: (id: string) => void;
    toggleHabitForDate: (habitId: string, date: string) => void;

    // Energy
    logEnergy: (date: string, level: EnergyLevel, mood?: MoodType, note?: string) => void;

    // Reflections
    saveReflection: (reflection: Omit<WeeklyReflection, 'id' | 'createdAt' | 'updatedAt' | '_version'>) => void;
    saveMonthlyReflection: (reflection: Omit<MonthlyReflection, 'id' | 'createdAt' | 'updatedAt' | '_version'>) => void;
    saveYearlyReflection: (reflection: Omit<YearlyReflection, 'id' | 'createdAt' | 'updatedAt' | '_version'>) => void;

    // Daily Journal
    saveDailyLog: (log: Omit<DailyLog, 'id' | 'createdAt' | 'updatedAt' | '_version'>) => void;
    updateWaterIntake: (date: string, amount: number) => void;

    // Personal CRM (Contacts)
    addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | '_version' | 'interactions' | 'lastContacted'>) => string;
    updateContact: (id: string, updates: Partial<Contact>) => void;
    deleteContact: (id: string) => void;
    addInteraction: (contactId: string, interaction: Omit<Interaction, 'id'>) => void;

    // Tags
    addTag: (tag: Omit<Tag, 'id'>) => string;
    updateTag: (id: string, updates: Partial<Tag>) => void;
    deleteTag: (id: string) => void;

    // Preferences
    updatePreferences: (updates: Partial<UserPreferences>) => void;
    completeOnboarding: () => void;
    checkAchievement: (id: AchievementId) => void;

    // Security
    isLocked: boolean;
    unlockApp: () => void;
    lockApp: () => void;

    // Gamification
    refreshMasterStreak: () => void;
    buyStreakFreeze: () => { success: boolean; error?: string };
    addXP: (amount: number, skillId?: SkillType) => void;
    buyItem: (itemId: string) => { success: boolean; error?: string };
    equipItem: (itemId: string, category: keyof UserPreferences['equippedItems']) => void;
    startChallenge: (challenge: Challenge) => void;
    updateChallengeProgress: (type: Challenge['type'], amount: number) => void;

    // Data Management
    exportAllData: () => string;
    importData: (jsonData: string) => { success: boolean; error?: string };
    clearAllData: () => void;
}

export type LifeOSStore = LifeOSState & LifeOSActions;

// ─── Initial State ───────────────────────────────────────────────────────────

const defaultPreferences: UserPreferences = {
    name: 'User',
    theme: 'light',
    defaultView: 'today',
    hasCompletedOnboarding: false,
    weekStartsOn: 1, // Monday
    xp: 0,
    skills: {
        mental: { level: 1, xp: 0 },
        physical: { level: 1, xp: 0 },
        social: { level: 1, xp: 0 },
        craft: { level: 1, xp: 0 },
        soul: { level: 1, xp: 0 },
    },
    notifications: {
        enabled: false,
        morningBriefing: true,
        eveningReflection: true,
        taskDeadlines: true,
        habitReminders: true,
        streakWarnings: true,
    },
    appearance: {
        accentColor: '#6366f1',
        themePreset: 'none',
        compactMode: true,
        fontSize: 'medium',
    },
    dashboard: {
        widgets: [
            { id: 'smart_briefing', enabled: true, order: 0 },
            { id: 'smart_insight_widget', enabled: true, order: 1 },
            { id: 'streak_widget', enabled: true, order: 2 },
            { id: 'character_card', enabled: true, order: 3 },
            { id: 'focus_cockpit', enabled: true, order: 4 },
            { id: 'energy_checkin', enabled: true, order: 5 },
            { id: 'daily_reflection', enabled: true, order: 5 },
            { id: 'finance_widget', enabled: true, order: 6 },
            { id: 'today_tasks', enabled: true, order: 7 },
            { id: 'inbox', enabled: true, order: 8 },
            { id: 'habits', enabled: true, order: 9 },
        ]
    },
    lastSentNotifications: {},
    unlockedAchievements: [],
    masterStreak: {
        current: 0,
        best: 0,
        lastUpdate: null,
    },
    streakFreezes: 1,
    security: {
        enabled: false,
        pin: null,
        lockAfterMinutes: 0
    },
    inventory: [],
    equippedItems: {},
    activeChallenges: [],
};

const initialState: LifeOSState = {
    projects: [],
    goals: [],
    tasks: [],
    habits: [],
    habitLogs: [],
    energyLogs: [],

    reflections: [],
    monthlyReflections: [],
    yearlyReflections: [],
    dailyLogs: [],
    mediaItems: [],
    notes: [],
    transactions: [],
    budgets: [],
    tags: [
        { id: 'tag-work', label: 'Arbeit', color: '#3b82f6' },
        { id: 'tag-private', label: 'Privat', color: '#10b981' },
        { id: 'tag-important', label: 'Wichtig', color: '#ef4444' },
    ],
    preferences: defaultPreferences,
    contacts: [],
    schemaVersion: 1,
    lastUpdated: getCurrentTimestamp(),
    _hasHydrated: false,
};

// ─── Store Creation ──────────────────────────────────────────────────────────

export const useLifeOSStore = create<LifeOSStore>()(
    persist(
        immer((set, get) => ({
            ...initialState,
            isLocked: false,

            setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),

            // ─── Projects ──────────────────────────────────────────────

            addProject: (projectData) => {
                const id = generateId();
                const now = getCurrentTimestamp();

                set((state) => {
                    const maxOrder = state.projects.length > 0
                        ? Math.max(...state.projects.map(p => p.sortOrder))
                        : 0;

                    state.projects.push({
                        ...projectData,
                        id,
                        status: 'active',
                        completedAt: null,
                        tagIds: projectData.tagIds || [],
                        sortOrder: maxOrder + 1,
                        createdAt: now,
                        updatedAt: now,
                        _version: 1,
                    });
                    state.lastUpdated = now;
                });

                return id;
            },

            updateProject: (id, updates) => {
                set((state) => {
                    const index = state.projects.findIndex((p) => p.id === id);
                    if (index !== -1) {
                        const project = state.projects[index];

                        // Check for completion
                        if (updates.status === 'completed' && project.status !== 'completed') {
                            updates.completedAt = getCurrentTimestamp();
                        } else if (updates.status && updates.status !== 'completed') {
                            updates.completedAt = null;
                        }

                        state.projects[index] = {
                            ...project,
                            ...updates,
                            updatedAt: getCurrentTimestamp(),
                        };
                        state.lastUpdated = getCurrentTimestamp();
                    }
                });
            },

            deleteProject: (id) => {
                set((state) => {
                    // Delete project
                    state.projects = state.projects.filter((p) => p.id !== id);

                    // Update goals to remove project association
                    state.goals.forEach(goal => {
                        if (goal.projectId === id) {
                            goal.projectId = null;
                        }
                    });

                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            // ─── Goals ───────────────────────────────────────────────

            addGoal: (goalData) => {
                const id = generateId();
                const now = getCurrentTimestamp();

                set((state) => {
                    const maxOrder = state.goals.length > 0
                        ? Math.max(...state.goals.map(g => g.sortOrder))
                        : 0;

                    state.goals.push({
                        ...goalData,
                        id,
                        sortOrder: maxOrder + 1,
                        completedAt: null,
                        archivedAt: null,
                        projectId: goalData.projectId || null,
                        tagIds: goalData.tagIds || [],
                        createdAt: now,
                        updatedAt: now,
                        _version: 1,
                    });
                    state.lastUpdated = now;
                });

                return id;
            },

            updateGoal: (id, updates) => {
                set((state) => {
                    const index = state.goals.findIndex((g) => g.id === id);
                    if (index !== -1) {
                        state.goals[index] = {
                            ...state.goals[index],
                            ...updates,
                            updatedAt: getCurrentTimestamp(),
                        };
                        state.lastUpdated = getCurrentTimestamp();
                    }
                });
            },

            completeGoal: (id) => {
                set((state) => {
                    const index = state.goals.findIndex((g) => g.id === id);
                    if (index !== -1) {
                        const goal = state.goals[index];
                        state.goals[index].status = 'completed';
                        state.goals[index].completedAt = getCurrentTimestamp();
                        state.goals[index].updatedAt = getCurrentTimestamp();

                        // Rewards
                        state.preferences.xp += 50;
                        if (goal.skillId) {
                            const skill = state.preferences.skills[goal.skillId];
                            skill.xp += 100;
                            if (skill.xp >= skill.level * 100) {
                                skill.xp -= (skill.level * 100);
                                skill.level += 1;
                            }
                        }

                        state.lastUpdated = getCurrentTimestamp();
                    }
                });
            },

            archiveGoal: (id) => {
                set((state) => {
                    const index = state.goals.findIndex((g) => g.id === id);
                    if (index !== -1) {
                        state.goals[index].status = 'archived';
                        state.goals[index].archivedAt = getCurrentTimestamp();
                        state.goals[index].updatedAt = getCurrentTimestamp();
                        state.lastUpdated = getCurrentTimestamp();
                    }
                });
            },

            deleteGoal: (id: string) => {
                set((state) => {
                    state.goals = state.goals.filter((g) => g.id !== id);
                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            reorderGoals: (goalIds) => {
                set((state) => {
                    goalIds.forEach((id, index) => {
                        const goalIndex = state.goals.findIndex((g) => g.id === id);
                        if (goalIndex !== -1) {
                            state.goals[goalIndex].sortOrder = index;
                        }
                    });
                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            // ─── Tasks ───────────────────────────────────────────────

            addTask: (taskData) => {
                const id = generateId();
                const now = getCurrentTimestamp();

                set((state) => {
                    const maxOrder = state.tasks.length > 0
                        ? Math.max(...state.tasks.map(t => t.sortOrder))
                        : 0;

                    state.tasks.push({
                        ...taskData,
                        id,
                        status: 'pending',
                        priority: taskData.priority || 'medium',
                        subtasks: taskData.subtasks || [],
                        recurrence: taskData.recurrence || 'none',
                        completedAt: null,
                        sortOrder: maxOrder + 1,
                        tagIds: taskData.tagIds || [],
                        createdAt: now,
                        updatedAt: now,
                        _version: 1,
                    });
                    state.lastUpdated = now;
                });

                return id;
            },

            updateTask: (id, updates) => {
                set((state) => {
                    const index = state.tasks.findIndex((t) => t.id === id);
                    if (index !== -1) {
                        state.tasks[index] = {
                            ...state.tasks[index],
                            ...updates,
                            updatedAt: getCurrentTimestamp(),
                        };
                        state.lastUpdated = getCurrentTimestamp();
                    }
                });
            },

            completeTask: (id) => {
                set((state) => {
                    const index = state.tasks.findIndex((t) => t.id === id);
                    if (index !== -1) {
                        const task = state.tasks[index];
                        state.tasks[index].status = 'completed';
                        state.tasks[index].completedAt = getCurrentTimestamp();
                        state.tasks[index].updatedAt = getCurrentTimestamp();

                        // Rewards
                        state.preferences.xp += 10;
                        if (task.skillId) {
                            const skill = state.preferences.skills[task.skillId];
                            skill.xp += 20;
                            if (skill.xp >= skill.level * 100) {
                                skill.xp -= (skill.level * 100);
                                skill.level += 1;
                            }
                        }

                        // Achievement Checks
                        const check = (achievementId: AchievementId) => {
                            if (!state.preferences.unlockedAchievements) state.preferences.unlockedAchievements = [];
                            if (!state.preferences.unlockedAchievements.includes(achievementId)) {
                                const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
                                if (ach) {
                                    state.preferences.unlockedAchievements.push(achievementId);
                                    state.preferences.xp += ach.xpReward;
                                }
                            }
                        };

                        check('first_task');

                        // Count completed tasks
                        const completedCount = state.tasks.filter(t => t.status === 'completed').length;
                        if (completedCount >= 10) check('task_master_10');
                        if (completedCount >= 100) check('task_master_100');

                        // Level check
                        const level = Math.floor(state.preferences.xp / 500) + 1;
                        if (level >= 5) check('level_5');

                        state.lastUpdated = getCurrentTimestamp();

                        // Handle Recurrence
                        if (task.recurrence && task.recurrence !== 'none') {
                            const nextDate = getNextOccurrence(task.scheduledDate, task.recurrence);
                            const newTaskId = generateId();
                            const now = getCurrentTimestamp();
                            state.tasks.push({
                                ...task,
                                id: newTaskId,
                                status: 'pending',
                                scheduledDate: nextDate,
                                completedAt: null,
                                createdAt: now,
                                updatedAt: now,
                                _version: 1,
                                subtasks: (task.subtasks || []).map(s => ({ ...s, completed: false })),
                            });
                        }
                    }
                });
            },

            uncompleteTask: (id) => {
                set((state) => {
                    const index = state.tasks.findIndex((t) => t.id === id);
                    if (index !== -1) {
                        state.tasks[index].status = 'pending';
                        state.tasks[index].completedAt = null;
                        state.tasks[index].updatedAt = getCurrentTimestamp();
                        state.lastUpdated = getCurrentTimestamp();
                    }
                });
            },

            deleteTask: (id: string) => {
                set((state) => {
                    state.tasks = state.tasks.filter((t) => t.id !== id);
                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            moveTaskToDate: (id, date) => {
                set((state) => {
                    const index = state.tasks.findIndex((t) => t.id === id);
                    if (index !== -1) {
                        state.tasks[index].scheduledDate = date;
                        state.tasks[index].updatedAt = getCurrentTimestamp();
                        state.lastUpdated = getCurrentTimestamp();
                    }
                });
            },

            reorderTasks: (taskIds) => {
                set((state) => {
                    taskIds.forEach((id, index) => {
                        const taskIndex = state.tasks.findIndex((t) => t.id === id);
                        if (taskIndex !== -1) {
                            state.tasks[taskIndex].sortOrder = index;
                        }
                    });
                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            toggleSubtask: (taskId, subtaskId) => {
                set((state) => {
                    const task = state.tasks.find((t) => t.id === taskId);
                    if (task) {
                        const subtask = task.subtasks.find((s) => s.id === subtaskId);
                        if (subtask) {
                            subtask.completed = !subtask.completed;
                            task.updatedAt = getCurrentTimestamp();
                            state.lastUpdated = getCurrentTimestamp();

                            // Visual reward for subtask completion (small XP?)
                            if (subtask.completed) state.preferences.xp += 2;
                        }
                    }
                });
            },

            addSubtask: (taskId, title) => {
                set((state) => {
                    const task = state.tasks.find((t) => t.id === taskId);
                    if (task) {
                        task.subtasks.push({
                            id: generateId(),
                            title: title.trim(),
                            completed: false,
                        });
                        task.updatedAt = getCurrentTimestamp();
                        state.lastUpdated = getCurrentTimestamp();
                    }
                });
            },

            deleteSubtask: (taskId, subtaskId) => {
                set((state) => {
                    const task = state.tasks.find((t) => t.id === taskId);
                    if (task) {
                        task.subtasks = task.subtasks.filter((s) => s.id !== subtaskId);
                        task.updatedAt = getCurrentTimestamp();
                        state.lastUpdated = getCurrentTimestamp();
                    }
                });
            },

            // ─── Media Vault ─────────────────────────────────────────

            addMediaItem: (itemData) => {
                const id = generateId();
                const now = getCurrentTimestamp();
                set((state) => {
                    state.mediaItems.push({
                        ...itemData,
                        id,
                        createdAt: now,
                        updatedAt: now,
                        _version: 1,
                    });
                    state.lastUpdated = now;
                });
                return id;
            },

            updateMediaItem: (id, updates) => {
                set((state) => {
                    const index = state.mediaItems.findIndex((i) => i.id === id);
                    if (index !== -1) {
                        const wasCompleted = state.mediaItems[index].status === 'completed';
                        state.mediaItems[index] = {
                            ...state.mediaItems[index],
                            ...updates,
                            updatedAt: getCurrentTimestamp(),
                        };

                        if (!wasCompleted && updates.status === 'completed') {
                            state.preferences.xp += 15;
                        }
                    }
                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            deleteMediaItem: (id) => {
                set((state) => {
                    state.mediaItems = state.mediaItems.filter((i) => i.id !== id);
                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            // ─── Wiki / Notes ───────────────────────────────────────────

            addNote: (noteData) => {
                const id = generateId();
                const now = getCurrentTimestamp();

                set((state) => {
                    state.notes.push({
                        ...noteData,
                        id,
                        isPinned: noteData.isPinned || false,
                        pages: noteData.pages || [''],
                        tagIds: noteData.tagIds || [],
                        createdAt: now,
                        updatedAt: now,
                        _version: 1,
                    });
                    state.lastUpdated = now;
                });

                return id;
            },

            updateNote: (id, updates) => {
                set((state) => {
                    const index = state.notes.findIndex((n) => n.id === id);
                    if (index !== -1) {
                        state.notes[index] = {
                            ...state.notes[index],
                            ...updates,
                            updatedAt: getCurrentTimestamp(),
                        };
                        state.lastUpdated = getCurrentTimestamp();
                    }
                });
            },

            deleteNote: (id) => {
                set((state) => {
                    state.notes = state.notes.filter((n) => n.id !== id);
                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            // ─── Finance ───────────────────────────────────────────────

            addTransaction: (data) => {
                const id = generateId();
                const now = getCurrentTimestamp();

                set((state) => {
                    state.transactions.push({
                        ...data,
                        id,
                        createdAt: now,
                        updatedAt: now,
                        _version: 1,
                    });

                    // Award XP for financial management
                    state.preferences.xp += 10;

                    state.lastUpdated = now;
                });

                return id;
            },

            deleteTransaction: (id) => {
                set((state) => {
                    state.transactions = state.transactions.filter((t) => t.id !== id);
                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            updateBudget: (budget) => {
                set((state) => {
                    const index = state.budgets.findIndex((b) => b.category === budget.category);
                    if (index !== -1) {
                        state.budgets[index] = budget;
                    } else {
                        state.budgets.push(budget);
                    }
                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            // ─── Habits ──────────────────────────────────────────────

            addHabit: (habitData) => {
                const id = generateId();
                const now = getCurrentTimestamp();

                set((state) => {
                    state.habits.push({
                        ...habitData,
                        id,
                        isActive: true,
                        isArchived: false,
                        archivedAt: null,
                        tagIds: habitData.tagIds || [],
                        createdAt: now,
                        updatedAt: now,
                        _version: 1,
                    });
                    state.lastUpdated = now;

                    // Achievement: First Habit
                    const check = (achievementId: AchievementId) => {
                        if (!state.preferences.unlockedAchievements) state.preferences.unlockedAchievements = [];
                        if (!state.preferences.unlockedAchievements.includes(achievementId)) {
                            const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
                            if (ach) {
                                state.preferences.unlockedAchievements.push(achievementId);
                                state.preferences.xp += ach.xpReward;
                            }
                        }
                    };
                    check('habit_starter');
                });

                return id;
            },

            updateHabit: (id, updates) => {
                set((state) => {
                    const index = state.habits.findIndex((h) => h.id === id);
                    if (index !== -1) {
                        state.habits[index] = {
                            ...state.habits[index],
                            ...updates,
                            updatedAt: getCurrentTimestamp(),
                        };
                        state.lastUpdated = getCurrentTimestamp();
                    }
                });
            },

            archiveHabit: (id) => {
                set((state) => {
                    const index = state.habits.findIndex((h) => h.id === id);
                    if (index !== -1) {
                        state.habits[index].isArchived = true;
                        state.habits[index].isActive = false;
                        state.habits[index].archivedAt = getCurrentTimestamp();
                        state.habits[index].updatedAt = getCurrentTimestamp();
                        state.lastUpdated = getCurrentTimestamp();
                    }
                });
            },

            deleteHabit: (id: string) => {
                set((state) => {
                    state.habits = state.habits.filter((h) => h.id !== id);
                    state.habitLogs = state.habitLogs.filter((l) => l.habitId !== id);
                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            toggleHabitForDate: (habitId, date) => {
                set((state) => {
                    const existingIndex = state.habitLogs.findIndex(
                        (l) => l.habitId === habitId && l.date === date
                    );

                    if (existingIndex !== -1) {
                        state.habitLogs[existingIndex].completed = !state.habitLogs[existingIndex].completed;
                        state.habitLogs[existingIndex].updatedAt = getCurrentTimestamp();
                        if (state.habitLogs[existingIndex].completed) {
                            state.preferences.xp += 20;
                        }
                    } else {
                        state.habitLogs.push({
                            id: generateId(),
                            habitId,
                            date,
                            completed: true,
                            createdAt: getCurrentTimestamp(),
                            updatedAt: getCurrentTimestamp(),
                            _version: 1,
                        });
                        state.preferences.xp += 20;
                    }
                    state.lastUpdated = getCurrentTimestamp();

                    // Calculate stats for achievements
                    const check = (achievementId: AchievementId) => {
                        if (!state.preferences.unlockedAchievements) state.preferences.unlockedAchievements = [];
                        if (!state.preferences.unlockedAchievements.includes(achievementId)) {
                            const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
                            if (ach) {
                                state.preferences.unlockedAchievements.push(achievementId);
                                state.preferences.xp += ach.xpReward;
                            }
                        }
                    };

                    // Check streaks for the specific habit
                    const habitLogsForHabit = state.habitLogs.filter(l => l.habitId === habitId && l.completed);
                    // Sort logs by date to determine streak
                    habitLogsForHabit.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                    let currentStreak = 0;
                    if (habitLogsForHabit.length > 0) {
                        let lastDate = new Date(habitLogsForHabit[0].date);
                        currentStreak = 1;

                        for (let i = 1; i < habitLogsForHabit.length; i++) {
                            const currentDate = new Date(habitLogsForHabit[i].date);
                            const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                            if (diffDays === 1) {
                                currentStreak++;
                            } else if (diffDays > 1) {
                                currentStreak = 1; // Reset streak if there's a gap
                            }
                            lastDate = currentDate;
                        }
                    }

                    if (currentStreak >= 7) check('habit_streak_7');
                    if (currentStreak >= 30) check('habit_streak_30');
                });
            },

            // ─── Energy ──────────────────────────────────────────────

            logEnergy: (date, level, mood, note) => {
                set((state) => {
                    const existingIndex = state.energyLogs.findIndex((l) => l.date === date);

                    if (existingIndex !== -1) {
                        state.energyLogs[existingIndex] = {
                            ...state.energyLogs[existingIndex],
                            level,
                            mood: mood ?? null,
                            note: note ?? null,
                            updatedAt: getCurrentTimestamp(),
                        };
                    } else {
                        state.energyLogs.push({
                            id: generateId(),
                            date,
                            level,
                            mood: mood ?? null,
                            note: note ?? null,
                            createdAt: getCurrentTimestamp(),
                            updatedAt: getCurrentTimestamp(),
                            _version: 1,
                        });
                    }
                    state.lastUpdated = getCurrentTimestamp();

                    if (level === 5) {
                        const check = (achievementId: AchievementId) => {
                            if (!state.preferences.unlockedAchievements) state.preferences.unlockedAchievements = [];
                            if (!state.preferences.unlockedAchievements.includes(achievementId)) {
                                const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
                                if (ach) {
                                    state.preferences.unlockedAchievements.push(achievementId);
                                    state.preferences.xp += ach.xpReward;
                                }
                            }
                        };
                        check('energy_pro_5');
                    }
                });
            },

            // ─── Reflections ─────────────────────────────────────────

            saveReflection: (reflectionData) => {
                const now = getCurrentTimestamp();
                set((state) => {
                    const existingIndex = state.reflections.findIndex(
                        (r) => r.weekStart === reflectionData.weekStart
                    );

                    if (existingIndex !== -1) {
                        state.reflections[existingIndex] = {
                            ...state.reflections[existingIndex],
                            ...reflectionData,
                            updatedAt: now,
                        };
                    } else {
                        state.reflections.push({
                            ...reflectionData,
                            id: generateId(),
                            createdAt: now,
                            updatedAt: now,
                            _version: 1,
                        });
                    }
                    state.lastUpdated = now;
                });
            },

            saveMonthlyReflection: (reflectionData) => {
                const now = getCurrentTimestamp();
                set((state) => {
                    const existingIndex = state.monthlyReflections.findIndex(
                        (r) => r.month === reflectionData.month
                    );

                    if (existingIndex !== -1) {
                        state.monthlyReflections[existingIndex] = {
                            ...state.monthlyReflections[existingIndex],
                            ...reflectionData,
                            updatedAt: now,
                        };
                    } else {
                        state.monthlyReflections.push({
                            ...reflectionData,
                            id: generateId(),
                            createdAt: now,
                            updatedAt: now,
                            _version: 1,
                        });
                    }
                    state.lastUpdated = now;
                });
            },

            saveYearlyReflection: (reflectionData) => {
                const now = getCurrentTimestamp();
                set((state) => {
                    const existingIndex = state.yearlyReflections.findIndex(
                        (r) => r.year === reflectionData.year
                    );

                    if (existingIndex !== -1) {
                        state.yearlyReflections[existingIndex] = {
                            ...state.yearlyReflections[existingIndex],
                            ...reflectionData,
                            updatedAt: now,
                        };
                    } else {
                        state.yearlyReflections.push({
                            ...reflectionData,
                            id: generateId(),
                            createdAt: now,
                            updatedAt: now,
                            _version: 1,
                        });
                    }
                    state.lastUpdated = now;
                });
            },

            saveDailyLog: (logData) => {
                set((state) => {
                    const existingIndex = state.dailyLogs.findIndex((l) => l.date === logData.date);
                    const now = getCurrentTimestamp();

                    if (existingIndex !== -1) {
                        state.dailyLogs[existingIndex] = {
                            ...state.dailyLogs[existingIndex],
                            ...logData,
                            updatedAt: now,
                        };
                    } else {
                        state.dailyLogs.push({
                            ...logData,
                            id: generateId(),
                            createdAt: now,
                            updatedAt: now,
                            _version: 1,
                        });

                        // Achievement: First Journal
                        const check = (achievementId: AchievementId) => {
                            if (!state.preferences.unlockedAchievements) state.preferences.unlockedAchievements = [];
                            if (!state.preferences.unlockedAchievements.includes(achievementId)) {
                                const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
                                if (ach) {
                                    state.preferences.unlockedAchievements.push(achievementId);
                                    state.preferences.xp += ach.xpReward;
                                }
                            }
                        };
                        check('journal_starter');

                        // XP
                        state.preferences.xp += 50;
                    }
                    state.lastUpdated = now;
                });
            },

            updateWaterIntake: (date, amount) => {
                set((state) => {
                    const index = state.dailyLogs.findIndex((l) => l.date === date);
                    const now = getCurrentTimestamp();

                    if (index !== -1) {
                        state.dailyLogs[index] = {
                            ...state.dailyLogs[index],
                            waterIntake: Math.max(0, amount),
                            updatedAt: now,
                        };
                    } else {
                        state.dailyLogs.push({
                            id: generateId(),
                            date,
                            gratitude: [],
                            focus: null,
                            win: null,
                            notes: null,
                            waterIntake: Math.max(0, amount),
                            createdAt: now,
                            updatedAt: now,
                            _version: 1,
                        });
                    }
                    state.lastUpdated = now;
                });
            },

            // ─── Personal CRM (Contacts) ───────────────────────────────

            addContact: (contactData) => {
                const id = generateId();
                const now = getCurrentTimestamp();

                set((state) => {
                    state.contacts.push({
                        ...contactData,
                        id,
                        interactions: [],
                        lastContacted: null,
                        createdAt: now,
                        updatedAt: now,
                        _version: 1,
                    });
                    state.lastUpdated = now;

                    // Achievement check? (Socialite)
                    state.preferences.xp += 20;
                });

                return id;
            },

            updateContact: (id, updates) => {
                set((state) => {
                    const index = state.contacts.findIndex((c) => c.id === id);
                    if (index !== -1) {
                        state.contacts[index] = {
                            ...state.contacts[index],
                            ...updates,
                            updatedAt: getCurrentTimestamp(),
                        };
                        state.lastUpdated = getCurrentTimestamp();
                    }
                });
            },

            deleteContact: (id) => {
                set((state) => {
                    state.contacts = state.contacts.filter((c) => c.id !== id);
                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            addInteraction: (contactId, interactionData) => {
                set((state) => {
                    const contact = state.contacts.find((c) => c.id === contactId);
                    if (contact) {
                        const interaction = {
                            ...interactionData,
                            id: generateId(),
                        };
                        contact.interactions.push(interaction);

                        // Update lastContacted if this is the newest
                        if (!contact.lastContacted || interaction.date > contact.lastContacted) {
                            contact.lastContacted = interaction.date;
                        }

                        contact.updatedAt = getCurrentTimestamp();
                        state.lastUpdated = getCurrentTimestamp();

                        // XP for social interaction
                        state.preferences.xp += 15;

                        // Skill Progress
                        const socialSkill = state.preferences.skills.social;
                        socialSkill.xp += 30;
                        if (socialSkill.xp >= socialSkill.level * 100) {
                            socialSkill.xp -= (socialSkill.level * 100);
                            socialSkill.level += 1;
                        }
                    }
                });
            },

            // ─── Tags ───────────────────────────────────────────────

            addTag: (tagData) => {
                const id = generateId();
                const now = getCurrentTimestamp();

                set((state) => {
                    state.tags.push({
                        ...tagData,
                        id,
                    });
                    state.lastUpdated = now;
                });

                return id;
            },

            updateTag: (id, updates) => {
                set((state) => {
                    const index = state.tags.findIndex((t) => t.id === id);
                    if (index !== -1) {
                        state.tags[index] = {
                            ...state.tags[index],
                            ...updates,
                        };
                        state.lastUpdated = getCurrentTimestamp();
                    }
                });
            },

            deleteTag: (id) => {
                set((state) => {
                    state.tags = state.tags.filter((t) => t.id !== id);

                    // Cleanup tags from entities
                    state.tasks.forEach(task => {
                        task.tagIds = task.tagIds.filter(tid => tid !== id);
                    });
                    state.goals.forEach(goal => {
                        goal.tagIds = goal.tagIds.filter(tid => tid !== id);
                    });
                    state.habits.forEach(habit => {
                        habit.tagIds = habit.tagIds.filter(tid => tid !== id);
                    });

                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            // ─── Preferences ─────────────────────────────────────────

            updatePreferences: (updates) => {
                set((state) => {
                    state.preferences = { ...state.preferences, ...updates };
                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            completeOnboarding: () => {
                set((state) => {
                    state.preferences.hasCompletedOnboarding = true;
                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            checkAchievement: (id) => {
                set((state) => {
                    if (!state.preferences.unlockedAchievements) {
                        state.preferences.unlockedAchievements = [];
                    }

                    if (state.preferences.unlockedAchievements.includes(id)) {
                        return; // Already unlocked
                    }

                    const achievement = ACHIEVEMENTS.find(a => a.id === id);
                    if (!achievement) return;

                    // Calculate potential level up
                    const XP_PER_LEVEL = 500;
                    const oldLevel = Math.floor(state.preferences.xp / XP_PER_LEVEL) + 1;

                    // Unlock
                    state.preferences.unlockedAchievements.push(id);
                    // Grant XP
                    state.preferences.xp += achievement.xpReward;

                    const newLevel = Math.floor(state.preferences.xp / XP_PER_LEVEL) + 1;

                    // Trigger Celebrations (Side Effect, but okay insideimmer/state update loop as it triggers another store)
                    // We need to use setTimeout to avoid state update conflicts if sync
                    setTimeout(() => {
                        const trigger = useUIStore.getState().triggerCelebration;

                        // Achievement Celebration
                        trigger('achievement', achievement);

                        // Level Up Celebration (chained?)
                        if (newLevel > oldLevel) {
                            setTimeout(() => {
                                trigger('level_up', { level: newLevel });
                            }, 3000); // Wait for achievement animation (approx)
                        }
                    }, 0);

                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            // ─── Security ──────────────────────────────────────────────

            unlockApp: () => set({ isLocked: false }),
            lockApp: () => set({ isLocked: true }),

            // ─── Data Management ─────────────────────────────────────

            exportAllData: () => {
                const state = get();

                const exportData = {
                    meta: {
                        exportedAt: getCurrentTimestamp(),
                        schemaVersion: state.schemaVersion,
                        appVersion: '1.0.0',
                    },
                    data: {
                        projects: state.projects,
                        goals: state.goals,
                        tasks: state.tasks,
                        habits: state.habits,
                        habitLogs: state.habitLogs,
                        energyLogs: state.energyLogs,
                        reflections: state.reflections,
                        monthlyReflections: state.monthlyReflections,
                        yearlyReflections: state.yearlyReflections,
                        dailyLogs: state.dailyLogs,
                        mediaItems: state.mediaItems,
                        tags: state.tags,
                        preferences: state.preferences,
                    },
                    stats: {
                        totalGoals: state.goals.length,
                        totalTasks: state.tasks.length,
                        totalTasksCompleted: state.tasks.filter((t) => t.status === 'completed').length,
                        totalHabits: state.habits.length,
                        totalHabitLogs: state.habitLogs.length,
                        totalReflections: state.reflections.length + state.monthlyReflections.length + state.yearlyReflections.length,
                        dateRange: {
                            earliest: state.tasks.length > 0
                                ? state.tasks.reduce((min, t) => t.createdAt < min ? t.createdAt : min, state.tasks[0].createdAt)
                                : getCurrentTimestamp(),
                            latest: state.lastUpdated,
                        },
                    },
                };

                return JSON.stringify(exportData, null, 2);
            },

            importData: (jsonData) => {
                try {
                    const parsed = JSON.parse(jsonData);

                    // Basic validation
                    if (!parsed.data || !parsed.meta) {
                        return { success: false, error: 'Ungültiges Dateiformat' };
                    }

                    set((state) => {
                        state.projects = parsed.data.projects ?? [];
                        state.goals = parsed.data.goals ?? [];
                        state.tasks = parsed.data.tasks ?? [];
                        state.habits = parsed.data.habits ?? [];
                        state.habitLogs = parsed.data.habitLogs ?? [];
                        state.energyLogs = parsed.data.energyLogs ?? [];
                        state.reflections = parsed.data.reflections ?? [];
                        state.monthlyReflections = parsed.data.monthlyReflections ?? [];
                        state.yearlyReflections = parsed.data.yearlyReflections ?? [];
                        state.dailyLogs = parsed.data.dailyLogs ?? [];
                        state.mediaItems = parsed.data.mediaItems ?? [];
                        state.tags = parsed.data.tags ?? [];
                        if (parsed.data.preferences) {
                            state.preferences = { ...defaultPreferences, ...parsed.data.preferences };
                        }
                        state.lastUpdated = getCurrentTimestamp();
                    });

                    return { success: true };
                } catch (error) {
                    return {
                        success: false,
                        error: error instanceof Error ? error.message : 'Unbekannter Fehler beim Import'
                    };
                }
            },

            refreshMasterStreak: () => {
                const state = get();
                const today = formatDate(new Date());
                const yesterday = formatDate(new Date(Date.now() - 86400000));

                const { masterStreak, streakFreezes } = state.preferences;

                // If already updated today or up to yesterday, avoid redundant checks
                if (masterStreak.lastUpdate === yesterday || masterStreak.lastUpdate === today) {
                    return;
                }

                set((state) => {
                    let currentUpdateDate = masterStreak.lastUpdate
                        ? new Date(new Date(masterStreak.lastUpdate).getTime() + 86400000)
                        : new Date(yesterday);

                    // Cap the catch-up to avoid infinite loops if date is very old
                    let safetyCounter = 0;
                    const yesterdayDate = new Date(yesterday);

                    while (currentUpdateDate <= yesterdayDate && safetyCounter < 30) {
                        const dateStr = formatDate(currentUpdateDate);

                        // Check if all active habits for this date were completed
                        const activeHabitsForDate = state.habits.filter(h => h.isActive && !h.isArchived);
                        const logsForDate = state.habitLogs.filter(l => l.date === dateStr);

                        const allHabitsDone = activeHabitsForDate.length > 0 &&
                            activeHabitsForDate.every(h => logsForDate.find(l => l.habitId === h.id && l.completed));

                        if (allHabitsDone) {
                            state.preferences.masterStreak.current += 1;
                            if (state.preferences.masterStreak.current > state.preferences.masterStreak.best) {
                                state.preferences.masterStreak.best = state.preferences.masterStreak.current;
                            }
                        } else {
                            if (state.preferences.streakFreezes > 0) {
                                state.preferences.streakFreezes -= 1;
                                // Streak preserved
                            } else {
                                state.preferences.masterStreak.current = 0;
                            }
                        }

                        state.preferences.masterStreak.lastUpdate = dateStr;
                        currentUpdateDate = new Date(currentUpdateDate.getTime() + 86400000);
                        safetyCounter++;
                    }

                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            buyStreakFreeze: () => {
                const state = get();
                const COST = 1000;

                if (state.preferences.xp < COST) {
                    return { success: false, error: `Du brauchst ${COST} XP für einen Streak Freeze.` };
                }

                set((state) => {
                    state.preferences.xp -= COST;
                    state.preferences.streakFreezes += 1;
                    state.lastUpdated = getCurrentTimestamp();
                });

                return { success: true };
            },

            addXP: (amount, skillId) => {
                set((state) => {
                    const XP_PER_LEVEL = 500;
                    const oldLevel = Math.floor(state.preferences.xp / XP_PER_LEVEL) + 1;

                    state.preferences.xp += amount;

                    if (skillId && state.preferences.skills[skillId]) {
                        const skill = state.preferences.skills[skillId];
                        skill.xp += (amount * 2);
                        if (skill.xp >= skill.level * 100) {
                            skill.xp -= (skill.level * 100);
                            skill.level += 1;
                        }
                    }

                    const newLevel = Math.floor(state.preferences.xp / XP_PER_LEVEL) + 1;
                    if (newLevel > oldLevel) {
                        setTimeout(() => {
                            useUIStore.getState().triggerCelebration('level_up', { level: newLevel });
                        }, 0);
                    }

                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            buyItem: (itemId) => {
                const state = get();
                const item = SHOP_ITEMS.find(i => i.id === itemId);
                if (!item) return { success: false, error: 'Item nicht gefunden.' };
                if (state.preferences.xp < item.price) return { success: false, error: 'Nicht genügend XP.' };
                if (state.preferences.inventory.includes(itemId)) return { success: false, error: 'Du besitzt dieses Item bereits.' };

                set((state) => {
                    state.preferences.xp -= item.price;
                    if (!state.preferences.inventory) state.preferences.inventory = [];
                    state.preferences.inventory.push(itemId);
                    state.lastUpdated = getCurrentTimestamp();
                });
                return { success: true };
            },

            equipItem: (itemId, category) => {
                set((state) => {
                    if (state.preferences.inventory.includes(itemId)) {
                        if (!state.preferences.equippedItems) state.preferences.equippedItems = {};
                        state.preferences.equippedItems[category] = itemId;
                        state.lastUpdated = getCurrentTimestamp();
                    }
                });
            },

            startChallenge: (challenge) => {
                set((state) => {
                    if (!state.preferences.activeChallenges) state.preferences.activeChallenges = [];
                    state.preferences.activeChallenges.push(challenge);
                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            updateChallengeProgress: (type, amount) => {
                set((state) => {
                    if (!state.preferences.activeChallenges) return;
                    state.preferences.activeChallenges.forEach(c => {
                        if (c.isActive && c.type === type) {
                            c.currentCount += amount;
                            if (c.currentCount >= c.targetCount) {
                                c.isActive = false;
                                state.preferences.xp += c.xpReward;
                                // Level Up Check already in addXP, but since we modify xp directly here:
                                const XP_PER_LEVEL = 500;
                                const newLevel = Math.floor(state.preferences.xp / XP_PER_LEVEL) + 1;
                                setTimeout(() => {
                                    const trigger = useUIStore.getState().triggerCelebration;
                                    trigger('achievement', {
                                        id: c.id as any,
                                        title: 'Challenge Abgeschlossen!',
                                        description: c.title,
                                        icon: '🏆',
                                        xpReward: c.xpReward
                                    });
                                    // if (newLevel > oldLevel) ... (simplified for now)
                                }, 0);
                            }
                        }
                    });
                    state.lastUpdated = getCurrentTimestamp();
                });
            },

            clearAllData: () => {
                set((state) => {
                    state.projects = [];
                    state.goals = [];
                    state.tasks = [];
                    state.habits = [];
                    state.habitLogs = [];
                    state.energyLogs = [];
                    state.reflections = [];
                    state.monthlyReflections = [];
                    state.yearlyReflections = [];
                    state.dailyLogs = [];
                    state.mediaItems = [];
                    state.tags = [];
                    state.preferences = defaultPreferences;
                    state.lastUpdated = getCurrentTimestamp();
                });
            },
        })),
        {
            name: 'life-os-storage',
            storage: createJSONStorage(() => indexedDBStorage),
            merge: (persistedState: any, currentState: any) => {
                // Return default state if no persisted state
                if (!persistedState) return currentState;

                // Deep merge preferences to ensure new fields like 'notifications'
                // are populated even for existing users
                return {
                    ...currentState,
                    ...persistedState,
                    preferences: {
                        ...currentState.preferences,
                        ...(persistedState.preferences || {}),
                        notifications: {
                            ...currentState.preferences.notifications,
                            ...(persistedState.preferences?.notifications || {}),
                        },
                        lastSentNotifications: {
                            ...currentState.preferences.lastSentNotifications,
                            ...(persistedState.preferences?.lastSentNotifications || {}),
                        },
                        appearance: {
                            ...currentState.preferences.appearance,
                            ...(persistedState.preferences?.appearance || {}),
                        },
                        dashboard: {
                            ...currentState.preferences.dashboard,
                            ...(persistedState.preferences?.dashboard || {}),
                        }
                    }
                };
            },
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
            partialize: (state) => ({
                projects: state.projects,
                goals: state.goals,
                tasks: state.tasks,
                habits: state.habits,
                habitLogs: state.habitLogs,
                energyLogs: state.energyLogs,
                reflections: state.reflections,
                monthlyReflections: state.monthlyReflections,
                yearlyReflections: state.yearlyReflections,
                dailyLogs: state.dailyLogs,
                mediaItems: state.mediaItems,
                notes: state.notes,
                transactions: state.transactions,
                budgets: state.budgets,
                contacts: state.contacts,
                tags: state.tags,
                preferences: state.preferences,
                schemaVersion: state.schemaVersion,
                lastUpdated: state.lastUpdated,
            }),
        }
    )
);

// ─── Hydration Hook ──────────────────────────────────────────────────────────

export const useHydration = () => {
    return useLifeOSStore((state) => state._hasHydrated);
};

export const useWaterIntake = () => {
    const today = getToday();
    const water = useLifeOSStore((state) =>
        state.dailyLogs.find(l => l.date === today)?.waterIntake || 0
    );
    const updateWater = useLifeOSStore((state) => state.updateWaterIntake);

    return {
        amount: water,
        addWater: (amount: number) => updateWater(today, amount)
    };
};

// ─── Helper Selectors ────────────────────────────────────────────────────────

export const usePreferences = () => {
    return useLifeOSStore((state) => state.preferences);
};

export const useHasCompletedOnboarding = () => {
    return useLifeOSStore((state) => state.preferences.hasCompletedOnboarding);
};

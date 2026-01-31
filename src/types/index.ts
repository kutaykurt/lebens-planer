// ============================================
// LIFE OS - Type Definitions
// ============================================

// ─── Tag ─────────────────────────────────────────────────────────────────────

export interface Tag {
  id: string;
  label: string;
  color: string; // CSS color string (e.g., #HEX)
}

// ─── Project ─────────────────────────────────────────────────────────────────

export type ProjectStatus = 'active' | 'completed' | 'on_hold' | 'archived';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  deadline: string | null; // YYYY-MM-DD
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  tagIds: string[];
  sortOrder: number;
  _version: number;
}

// ─── Goal ────────────────────────────────────────────────────────────────────

export type GoalCategory =
  | 'health'        // Gesundheit & Fitness
  | 'career'        // Karriere & Beruf
  | 'relationships' // Beziehungen & Familie
  | 'personal'      // Persönliche Entwicklung
  | 'finance'       // Finanzen
  | 'learning'      // Lernen & Bildung
  | 'other';        // Sonstiges

export type TimeHorizon =
  | 'short'         // Wochen bis 3 Monate
  | 'medium'        // 3-12 Monate
  | 'long'          // 1-5 Jahre
  | 'ongoing';      // Fortlaufend

export type GoalStatus =
  | 'active'        // Wird aktiv verfolgt
  | 'paused'        // Temporär pausiert
  | 'completed'     // Erfolgreich abgeschlossen
  | 'archived';     // Nicht mehr relevant (Soft Delete)

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  category: GoalCategory;
  timeHorizon: TimeHorizon;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  archivedAt: string | null;
  sortOrder: number;
  projectId: string | null;
  skillId?: SkillType;
  tagIds: string[];
  _version: number;
}

export type SkillType = 'mental' | 'physical' | 'social' | 'craft' | 'soul';

export interface SkillProgress {
  level: number;
  xp: number;
}

// ─── Task ────────────────────────────────────────────────────────────────────

export type TaskStatus =
  | 'pending'       // Offen
  | 'completed'     // Erledigt
  | 'cancelled';    // Abgebrochen (Soft Delete)

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'none';

export interface Task {
  id: string;
  title: string;
  notes: string | null;
  scheduledDate: string | null; // YYYY-MM-DD
  goalId: string | null;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  sortOrder: number;
  skillId?: SkillType;
  subtasks: Subtask[];
  recurrence: RecurrencePattern;
  tagIds: string[];
  _version: number;
}

// ─── Habit ───────────────────────────────────────────────────────────────────

export type HabitFrequency =
  | 'daily'           // Jeden Tag
  | 'times_per_week'  // X-mal pro Woche
  | 'specific_days';  // Bestimmte Tage (Mo, Mi, Fr etc.)

export interface Habit {
  id: string;
  title: string;
  description: string | null;
  frequency: HabitFrequency;
  targetDays: number[] | null;   // 0-6 (So-Sa) für 'specific_days'
  targetCount: number | null;    // Für 'times_per_week'
  goalId: string | null;
  isActive: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  tagIds: string[];
  _version: number;
}

// ─── HabitLog ────────────────────────────────────────────────────────────────

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  _version: number;
}

// ─── EnergyLog ───────────────────────────────────────────────────────────────

export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export type MoodType =
  | 'great'       // 😊
  | 'good'        // 🙂
  | 'neutral'     // 😐
  | 'low'         // 😔
  | 'bad';        // 😢

export interface EnergyLog {
  id: string;
  date: string; // YYYY-MM-DD
  level: EnergyLevel;
  mood: MoodType | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
}

// ─── WeeklyReflection ────────────────────────────────────────────────────────

export interface WeekSummary {
  tasksCompleted: number;
  tasksTotal: number;
  habitsCompletionRate: number; // 0-100
  averageEnergyLevel: number | null;
  activeGoalsCount: number;
}

export interface WeeklyReflection {
  id: string;
  weekStart: string; // YYYY-MM-DD (Montag)
  weekEnd: string;   // YYYY-MM-DD (Sonntag)
  satisfactionRating: number; // 1-5
  wentWell: string | null;
  challenges: string | null;
  nextWeekFocus: string | null;
  goalAdjustmentNeeded: boolean;
  additionalNotes: string | null;
  weekSummary: WeekSummary;
  createdAt: string;
  updatedAt: string;
  _version: number;
}

// ─── MonthlyReflection ──────────────────────────────────────────────────────

export interface MonthlyReflection {
  id: string;
  month: string; // YYYY-MM
  satisfactionRating: number; // 1-10
  highlights: string[];
  challenges: string | null;
  keyLearnings: string | null;
  focusNextMonth: string | null;
  statsSnapshot: {
    tasksCompleted: number;
    habitsRate: number;
    avgEnergy: number;
  };
  createdAt: string;
  updatedAt: string;
  _version: number;
}

// ─── YearlyReflection ───────────────────────────────────────────────────────

export interface YearlyReflection {
  id: string;
  year: number; // YYYY
  satisfactionRating: number; // 1-10
  biggestWins: string[];
  challenges: string | null;
  lifeLessons: string | null;
  focusNextYear: string | null;
  moodGrid: Record<string, number>; // date -> mood level
  createdAt: string;
  updatedAt: string;
  _version: number;
}

// ─── Daily Journal Log ───────────────────────────────────────────────────────

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  gratitude: string[]; // 3 items
  focus: string | null;
  win: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
}

// ─── User Preferences ────────────────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemePreset = 'none' | 'forest' | 'ocean' | 'sunset' | 'midnight';
export type FontSize = 'small' | 'medium' | 'large';

export type DashboardWidget =
  | 'smart_briefing'
  | 'streak_widget'
  | 'character_card'
  | 'focus_cockpit'
  | 'energy_checkin'
  | 'daily_reflection'
  | 'today_tasks'
  | 'inbox'
  | 'habits';

export interface UserPreferences {
  name: string; // Benutzername für Begrüßung
  theme: ThemeMode;
  defaultView: 'today' | 'goals' | 'habits';
  hasCompletedOnboarding: boolean;
  weekStartsOn: 0 | 1; // 0 = Sonntag, 1 = Montag
  xp: number;
  skills: Record<SkillType, SkillProgress>;
  notifications: {
    enabled: boolean;
    morningBriefing: boolean;
    eveningReflection: boolean;
    taskDeadlines: boolean;
    habitReminders: boolean;
    streakWarnings: boolean;
  };
  appearance: {
    accentColor: string;
    themePreset: ThemePreset;
    compactMode: boolean;
    fontSize: FontSize;
  };
  dashboard: {
    widgets: {
      id: DashboardWidget;
      enabled: boolean;
      order: number;
    }[];
  };
  lastSentNotifications: {
    morningBriefing?: string;
    eveningReflection?: string;
    deadlineWarning?: string;
    streakWarning?: string;
  };
  unlockedAchievements: string[];
  security: {
    enabled: boolean;
    pin: string | null; // Einfacher 4-stelliger Code
    lockAfterMinutes: number; // 0 = Sofort
  };
}

// ─── Gamification ────────────────────────────────────────────────────────────

export type AchievementId =
  | 'first_task'
  | 'task_master_10'
  | 'task_master_100'
  | 'habit_starter'
  | 'habit_streak_7'
  | 'habit_streak_30'
  | 'energy_pro_5'
  | 'journal_starter'
  | 'level_5';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string; // Emoji
  xpReward: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_task', title: 'Erster Schritt', description: 'Erledige deine erste Aufgabe.', icon: '🦶', xpReward: 100 },
  { id: 'task_master_10', title: 'Produktiv', description: 'Erledige 10 Aufgaben.', icon: '📝', xpReward: 200 },
  { id: 'task_master_100', title: 'Maschine', description: 'Erledige 100 Aufgaben.', icon: '🦾', xpReward: 1000 },
  { id: 'habit_starter', title: 'Gewohnheitstier', description: 'Schließe eine Gewohnheit ab.', icon: '🌱', xpReward: 100 },
  { id: 'habit_streak_7', title: 'Dranbleiber', description: 'Erreiche einen 7-Tage Streak.', icon: '🔥', xpReward: 500 },
  { id: 'habit_streak_30', title: 'Unaufhaltbar', description: 'Erreiche einen 30-Tage Streak.', icon: '🚀', xpReward: 2000 },
  { id: 'energy_pro_5', title: 'Volle Energie', description: 'Fühle dich "Fantastisch" (Level 5).', icon: '⚡', xpReward: 150 },
  { id: 'journal_starter', title: 'Selbstreflexion', description: 'Schreibe deinen ersten Tagebucheintrag.', icon: '📔', xpReward: 150 },
  { id: 'level_5', title: 'High Five', description: 'Erreiche Level 5.', icon: '🖐️', xpReward: 500 },
];

// ─── UI State ────────────────────────────────────────────────────────────────

export type ViewType = 'today' | 'goals' | 'habits' | 'reflect' | 'settings';

export type ModalType =
  | 'addGoal'
  | 'editGoal'
  | 'addTask'
  | 'editTask'
  | 'addHabit'
  | 'editHabit'
  | 'energyCheckIn'
  | 'reflection'
  | 'confirmDelete'
  | 'export'
  | 'import';

// ─── Export Format ───────────────────────────────────────────────────────────

export interface LifeOSExport {
  meta: {
    exportedAt: string;
    schemaVersion: number;
    appVersion: string;
  };
  data: {
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
    preferences: UserPreferences;
  };
  stats: {
    totalGoals: number;
    totalTasks: number;
    totalTasksCompleted: number;
    totalHabits: number;
    totalHabitLogs: number;
    totalReflections: number;
    dateRange: {
      earliest: string;
      latest: string;
    };
  };
}

// ─── Category Labels & Icons ─────────────────────────────────────────────────

export const GOAL_CATEGORY_LABELS: Record<GoalCategory, string> = {
  health: 'Gesundheit & Fitness',
  career: 'Karriere & Beruf',
  relationships: 'Beziehungen & Familie',
  personal: 'Persönliche Entwicklung',
  finance: 'Finanzen',
  learning: 'Lernen & Bildung',
  other: 'Sonstiges',
};

export const GOAL_CATEGORY_ICONS: Record<GoalCategory, string> = {
  health: '🏃',
  career: '💼',
  relationships: '❤️',
  personal: '🌱',
  finance: '💰',
  learning: '📚',
  other: '✨',
};

export const TIME_HORIZON_LABELS: Record<TimeHorizon, string> = {
  short: 'Kurzfristig (Wochen bis 3 Monate)',
  medium: 'Mittelfristig (3-12 Monate)',
  long: 'Langfristig (1-5 Jahre)',
  ongoing: 'Fortlaufend',
};

export const ENERGY_LEVEL_LABELS: Record<EnergyLevel, string> = {
  1: 'Erschöpft',
  2: 'Niedrig',
  3: 'Normal',
  4: 'Gut',
  5: 'Ausgezeichnet',
};

export const ENERGY_LEVEL_EMOJIS: Record<EnergyLevel, string> = {
  1: '😫',
  2: '😔',
  3: '😐',
  4: '🙂',
  5: '😊',
};

export const MOOD_EMOJIS: Record<MoodType, string> = {
  great: '😊',
  good: '🙂',
  neutral: '😐',
  low: '😔',
  bad: '😢',
};

// ─── Media Vault ─────────────────────────────────────────────────────────────

export type MediaType = 'book' | 'movie' | 'series' | 'game';
export type MediaStatus = 'backlog' | 'in_progress' | 'completed' | 'abandoned';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  status: MediaStatus;
  rating?: number; // 1-5
  progress?: number; // 0-100% or pages/hours
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
}


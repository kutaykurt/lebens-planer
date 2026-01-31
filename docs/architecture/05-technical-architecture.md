# Life OS – Phase 5: Technische Architektur

> Erstellt: 2026-01-31
> Status: Abgeschlossen

---

## 5.1 Technologie-Stack (Final)

### Core Technologies

| Kategorie | Technologie | Version | Begründung |
|-----------|-------------|---------|------------|
| **Framework** | Next.js | 16.x | App Router, React 19, Server Components |
| **Sprache** | TypeScript | 5.x | Type Safety, bessere DX, weniger Runtime-Fehler |
| **Runtime** | React | 19.x | Concurrent Features, Suspense |
| **State** | Zustand | 5.x | Minimal, TypeScript-first, Persistenz-ready |
| **Styling** | Tailwind CSS | 4.x | Utility-first, Dark Mode, Responsive |
| **Icons** | Lucide React | latest | Konsistent, Tree-shakable, MIT |
| **Persistenz** | idb (IndexedDB) | latest | Promise-basierte IndexedDB Wrapper |
| **IDs** | uuid | latest | UUID v4 für Offline-Generierung |
| **Dates** | date-fns | latest | Modular, klein, immutable |
| **Forms** | React Hook Form | latest | Performance, Validation |
| **Validation** | Zod | latest | TypeScript-first Schema Validation |

### Development Tools

| Kategorie | Technologie | Begründung |
|-----------|-------------|------------|
| **Bundler** | Next.js (Turbopack) | Built-in, schnell |
| **Linting** | ESLint | Standard, integriert |
| **Formatting** | Prettier | Konsistenter Code |
| **Testing** | Vitest + Testing Library | Schnell, React-kompatibel |
| **E2E Testing** | Playwright | Cross-browser, modern |
| **Git Hooks** | Husky + lint-staged | Pre-commit Checks |

---

## 5.2 Ordnerstruktur

### Projekt-Root

```
life-os/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions für Tests
├── docs/
│   └── architecture/              # Diese Dokumentation
│       ├── README.md
│       ├── 01-product-domain.md
│       ├── 02-feature-architecture.md
│       ├── 03-data-state.md
│       ├── 04-ux-flow.md
│       ├── 05-technical-architecture.md
│       ├── 06-development-plan.md
│       └── 07-portfolio-relevance.md
├── public/
│   ├── icons/                     # PWA Icons
│   ├── manifest.json              # PWA Manifest
│   └── offline.html               # Offline Fallback
├── src/
│   ├── app/                       # Next.js App Router
│   ├── components/                # React Components
│   ├── features/                  # Feature-basierte Module
│   ├── hooks/                     # Custom React Hooks
│   ├── lib/                       # Utilities & Konfiguration
│   ├── stores/                    # Zustand Stores
│   ├── types/                     # TypeScript Typen
│   └── styles/                    # Globale Styles
├── tests/
│   ├── unit/                      # Unit Tests
│   ├── integration/               # Integration Tests
│   └── e2e/                       # End-to-End Tests
├── .env.example                   # Environment Template
├── .eslintrc.js
├── .prettierrc
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

### Source-Ordner Detail

```
src/
├── app/                           # Next.js App Router (Pages)
│   ├── (main)/                    # Layout Group für Haupt-App
│   │   ├── layout.tsx             # Haupt-Layout mit Navigation
│   │   ├── page.tsx               # Home → Redirect zu /today
│   │   ├── today/
│   │   │   └── page.tsx           # Heute-Ansicht
│   │   ├── goals/
│   │   │   ├── page.tsx           # Ziele-Liste
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Ziel-Detail
│   │   ├── habits/
│   │   │   ├── page.tsx           # Gewohnheiten-Liste
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Gewohnheit-Detail
│   │   ├── reflect/
│   │   │   ├── page.tsx           # Reflexions-Übersicht
│   │   │   └── [weekStart]/
│   │   │       └── page.tsx       # Einzelne Reflexion
│   │   └── settings/
│   │       └── page.tsx           # Einstellungen
│   ├── onboarding/
│   │   └── page.tsx               # Onboarding-Flow
│   ├── globals.css                # Tailwind Imports + Custom CSS
│   ├── layout.tsx                 # Root Layout (Providers)
│   └── not-found.tsx              # 404 Page
│
├── components/                    # Wiederverwendbare UI-Komponenten
│   ├── ui/                        # Primitive UI-Bausteine
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Dialog.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Tabs.tsx
│   │   ├── Toast.tsx
│   │   └── index.ts               # Barrel Export
│   ├── layout/                    # Layout-Komponenten
│   │   ├── Header.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Sidebar.tsx
│   │   └── PageContainer.tsx
│   ├── shared/                    # Feature-übergreifende Komponenten
│   │   ├── EmptyState.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── EnergyPicker.tsx
│   │   ├── DatePicker.tsx
│   │   ├── WeekCalendar.tsx
│   │   └── ConfirmDialog.tsx
│   └── icons/                     # Custom Icons (falls nötig)
│       └── LifeOSLogo.tsx
│
├── features/                      # Feature-Module (Domain-Logik + UI)
│   ├── goals/
│   │   ├── components/
│   │   │   ├── GoalCard.tsx
│   │   │   ├── GoalForm.tsx
│   │   │   ├── GoalList.tsx
│   │   │   └── GoalDetailView.tsx
│   │   ├── hooks/
│   │   │   └── useGoals.ts
│   │   ├── utils/
│   │   │   └── goalHelpers.ts
│   │   └── index.ts               # Public API
│   │
│   ├── tasks/
│   │   ├── components/
│   │   │   ├── TaskItem.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   └── QuickAddTask.tsx
│   │   ├── hooks/
│   │   │   └── useTasks.ts
│   │   ├── utils/
│   │   │   └── taskHelpers.ts
│   │   └── index.ts
│   │
│   ├── habits/
│   │   ├── components/
│   │   │   ├── HabitCard.tsx
│   │   │   ├── HabitForm.tsx
│   │   │   ├── HabitList.tsx
│   │   │   ├── HabitStreak.tsx
│   │   │   └── HabitCalendar.tsx
│   │   ├── hooks/
│   │   │   └── useHabits.ts
│   │   ├── utils/
│   │   │   ├── habitHelpers.ts
│   │   │   └── streakCalculator.ts
│   │   └── index.ts
│   │
│   ├── energy/
│   │   ├── components/
│   │   │   ├── EnergyCheckIn.tsx
│   │   │   └── EnergyHistory.tsx
│   │   ├── hooks/
│   │   │   └── useEnergy.ts
│   │   └── index.ts
│   │
│   ├── reflection/
│   │   ├── components/
│   │   │   ├── ReflectionFlow.tsx
│   │   │   ├── ReflectionCard.tsx
│   │   │   ├── ReflectionHistory.tsx
│   │   │   └── WeekSummary.tsx
│   │   ├── hooks/
│   │   │   └── useReflections.ts
│   │   └── index.ts
│   │
│   ├── today/
│   │   ├── components/
│   │   │   ├── TodayView.tsx
│   │   │   ├── OverdueTasks.tsx
│   │   │   └── TodayHeader.tsx
│   │   └── index.ts
│   │
│   └── settings/
│       ├── components/
│       │   ├── SettingsView.tsx
│       │   ├── ExportData.tsx
│       │   ├── ImportData.tsx
│       │   └── ThemeToggle.tsx
│       └── index.ts
│
├── hooks/                         # Globale Custom Hooks
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   ├── useDebounce.ts
│   ├── useToast.ts
│   └── useOfflineDetection.ts
│
├── lib/                           # Core Utilities
│   ├── db/                        # Datenbank-Abstraktionsschicht
│   │   ├── client.ts              # IndexedDB Client
│   │   ├── migrations.ts          # Schema-Migrationen
│   │   ├── repositories/          # Data Access Layer
│   │   │   ├── goalRepository.ts
│   │   │   ├── taskRepository.ts
│   │   │   ├── habitRepository.ts
│   │   │   ├── habitLogRepository.ts
│   │   │   ├── energyLogRepository.ts
│   │   │   └── reflectionRepository.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── dates.ts               # Date-Utilities (Wrapper um date-fns)
│   │   ├── ids.ts                 # UUID Generierung
│   │   ├── validation.ts          # Zod Schemas
│   │   └── export.ts              # Datenexport-Logik
│   └── constants.ts               # App-weite Konstanten
│
├── stores/                        # Zustand Stores
│   ├── lifeOSStore.ts             # Haupt-Store (persistiert)
│   ├── uiStore.ts                 # UI State (nicht persistiert)
│   ├── middleware/
│   │   └── persistMiddleware.ts   # IndexedDB Persistenz
│   └── selectors/
│       ├── taskSelectors.ts
│       ├── habitSelectors.ts
│       └── insightSelectors.ts
│
├── types/                         # TypeScript Definitionen
│   ├── entities.ts                # Goal, Task, Habit, etc.
│   ├── stores.ts                  # Store Types
│   ├── ui.ts                      # UI State Types
│   └── index.ts                   # Barrel Export
│
└── styles/
    └── animations.css             # Custom Animations
```

---

## 5.3 Modul-Architektur

### Schichten-Modell

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Pages (app/*)          Components (components/*)     │  │
│  │  - Routing              - Reine UI                    │  │
│  │  - Layout               - Props-basiert               │  │
│  │  - Data Fetching        - Keine Business-Logik        │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                │
│                            ▼                                │
├─────────────────────────────────────────────────────────────┤
│                       FEATURE LAYER                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  features/goals/    features/tasks/    features/...   │  │
│  │  - Feature-UI       - Domain-Logik     - Lokaler State│  │
│  │  - Hooks            - Validation       - Side Effects │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                │
│                            ▼                                │
├─────────────────────────────────────────────────────────────┤
│                       STATE LAYER                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  stores/lifeOSStore.ts          stores/uiStore.ts     │  │
│  │  - Globaler State               - UI State            │  │
│  │  - Actions                      - Modal State         │  │
│  │  - Selectors                    - Nicht persistiert   │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                │
│                            ▼                                │
├─────────────────────────────────────────────────────────────┤
│                       DATA LAYER                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  lib/db/repositories/           lib/db/client.ts      │  │
│  │  - CRUD Operationen             - IndexedDB Wrapper   │  │
│  │  - Queries                      - Transaktionen       │  │
│  │  - Migrationen                  - Error Handling      │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                │
│                            ▼                                │
├─────────────────────────────────────────────────────────────┤
│                       STORAGE                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                     IndexedDB                         │  │
│  │              (Browser-lokale Datenbank)               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Dependency Rules

| Von | Darf importieren |
|-----|------------------|
| **Pages** | Components, Features, Stores, Hooks, Types |
| **Components/UI** | Nur Types, Styles, andere UI-Komponenten |
| **Features** | Components, Stores, Lib, Hooks, Types |
| **Stores** | Lib, Types |
| **Lib** | Nur externe Dependencies, Types |
| **Types** | Nichts (nur Typen) |

**Verboten:**
- Page → Page Import
- Component/UI → Feature Import
- Lib → Store Import (keine zirkulären Deps)
- Zirkuläre Importe jeglicher Art

---

## 5.4 Component-Design

### Component-Kategorien

| Kategorie | Pfad | Charakteristik | Beispiel |
|-----------|------|----------------|----------|
| **Primitives** | `components/ui/` | Generisch, Props-gesteuert, kein State | `Button`, `Input` |
| **Shared** | `components/shared/` | Wiederverwendbar, leichter State | `EnergyPicker`, `DatePicker` |
| **Feature** | `features/*/components/` | Domain-spezifisch, Store-Zugriff | `GoalCard`, `TaskList` |
| **Page** | `app/**/page.tsx` | Routing, Composition | `TodayPage` |

### Component-Template

```typescript
// components/ui/Button.tsx

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// 1. Variants mit class-variance-authority
const buttonVariants = cva(
  // Base classes
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        ghost: 'hover:bg-gray-100',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// 2. Props Interface
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

// 3. Component mit forwardRef
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin mr-2">⏳</span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
```

### Feature-Component-Template

```typescript
// features/tasks/components/TaskItem.tsx

'use client';

import { memo } from 'react';
import { Checkbox } from '@/components/ui';
import { useTaskActions } from '../hooks/useTasks';
import { formatRelativeDate } from '@/lib/utils/dates';
import type { Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export const TaskItem = memo(function TaskItem({ task, onEdit }: TaskItemProps) {
  const { completeTask } = useTaskActions();

  const handleComplete = () => {
    completeTask(task.id);
  };

  const handleClick = () => {
    onEdit?.(task);
  };

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Aufgabe: ${task.title}`}
    >
      <Checkbox
        checked={task.status === 'completed'}
        onCheckedChange={handleComplete}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Aufgabe als erledigt markieren: ${task.title}`}
      />
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          'truncate',
          task.status === 'completed' && 'line-through text-gray-500'
        )}>
          {task.title}
        </p>
        
        {task.scheduledDate && (
          <p className="text-sm text-gray-500">
            {formatRelativeDate(task.scheduledDate)}
          </p>
        )}
      </div>
      
      {task.goalId && (
        <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded">
          Ziel verknüpft
        </span>
      )}
    </div>
  );
});
```

---

## 5.5 State Management (Zustand)

### Haupt-Store Implementierung

```typescript
// stores/lifeOSStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createIndexedDBStorage } from './middleware/indexedDBStorage';
import type { Goal, Task, Habit, HabitLog, EnergyLog, WeeklyReflection } from '@/types';
import { generateId, getCurrentTimestamp } from '@/lib/utils';

// State Interface
interface LifeOSState {
  // Entities
  goals: Goal[];
  tasks: Task[];
  habits: Habit[];
  habitLogs: HabitLog[];
  energyLogs: EnergyLog[];
  reflections: WeeklyReflection[];
  
  // Meta
  schemaVersion: number;
  lastUpdated: string;
  
  // Hydration Status
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// Actions Interface
interface LifeOSActions {
  // Goals
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | '_version'>) => string;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  archiveGoal: (id: string) => void;
  
  // Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | '_version'>) => string;
  updateTask: (id: string, updates: Partial<Task>) => void;
  completeTask: (id: string) => void;
  uncompleteTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  // Habits
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | '_version'>) => string;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  archiveHabit: (id: string) => void;
  toggleHabitForDate: (habitId: string, date: string) => void;
  
  // Energy
  logEnergy: (date: string, level: number, mood?: string, note?: string) => void;
  
  // Reflection
  saveReflection: (reflection: Omit<WeeklyReflection, 'id' | 'createdAt' | 'updatedAt' | '_version'>) => void;
  
  // Data Management
  exportAllData: () => string;
  importData: (jsonData: string) => { success: boolean; error?: string };
  clearAllData: () => void;
}

type LifeOSStore = LifeOSState & LifeOSActions;

// Initial State
const initialState: LifeOSState = {
  goals: [],
  tasks: [],
  habits: [],
  habitLogs: [],
  energyLogs: [],
  reflections: [],
  schemaVersion: 1,
  lastUpdated: getCurrentTimestamp(),
  _hasHydrated: false,
  setHasHydrated: () => {},
};

// Store Creation
export const useLifeOSStore = create<LifeOSStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      // ─── Goals ─────────────────────────────────────────────
      addGoal: (goalData) => {
        const id = generateId();
        const now = getCurrentTimestamp();
        
        set((state) => {
          state.goals.push({
            ...goalData,
            id,
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

      // ─── Tasks ─────────────────────────────────────────────
      addTask: (taskData) => {
        const id = generateId();
        const now = getCurrentTimestamp();
        
        set((state) => {
          state.tasks.push({
            ...taskData,
            id,
            status: 'pending',
            completedAt: null,
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
            state.tasks[index].status = 'completed';
            state.tasks[index].completedAt = getCurrentTimestamp();
            state.tasks[index].updatedAt = getCurrentTimestamp();
            state.lastUpdated = getCurrentTimestamp();
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

      deleteTask: (id) => {
        set((state) => {
          const index = state.tasks.findIndex((t) => t.id === id);
          if (index !== -1) {
            state.tasks[index].status = 'cancelled';
            state.tasks[index].updatedAt = getCurrentTimestamp();
            state.lastUpdated = getCurrentTimestamp();
          }
        });
      },

      // ─── Habits ────────────────────────────────────────────
      addHabit: (habitData) => {
        const id = generateId();
        const now = getCurrentTimestamp();
        
        set((state) => {
          state.habits.push({
            ...habitData,
            id,
            isActive: true,
            isArchived: false,
            createdAt: now,
            updatedAt: now,
            archivedAt: null,
            _version: 1,
          });
          state.lastUpdated = now;
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

      toggleHabitForDate: (habitId, date) => {
        set((state) => {
          const existingIndex = state.habitLogs.findIndex(
            (l) => l.habitId === habitId && l.date === date
          );

          if (existingIndex !== -1) {
            // Toggle existing
            state.habitLogs[existingIndex].completed = 
              !state.habitLogs[existingIndex].completed;
            state.habitLogs[existingIndex].updatedAt = getCurrentTimestamp();
          } else {
            // Create new
            state.habitLogs.push({
              id: generateId(),
              habitId,
              date,
              completed: true,
              createdAt: getCurrentTimestamp(),
              updatedAt: getCurrentTimestamp(),
              _version: 1,
            });
          }
          state.lastUpdated = getCurrentTimestamp();
        });
      },

      // ─── Energy ────────────────────────────────────────────
      logEnergy: (date, level, mood, note) => {
        set((state) => {
          const existingIndex = state.energyLogs.findIndex((l) => l.date === date);

          if (existingIndex !== -1) {
            // Update existing
            state.energyLogs[existingIndex] = {
              ...state.energyLogs[existingIndex],
              level,
              mood: mood ?? null,
              note: note ?? null,
              updatedAt: getCurrentTimestamp(),
            };
          } else {
            // Create new
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
        });
      },

      // ─── Reflections ───────────────────────────────────────
      saveReflection: (reflectionData) => {
        set((state) => {
          const existingIndex = state.reflections.findIndex(
            (r) => r.weekStart === reflectionData.weekStart
          );

          if (existingIndex !== -1) {
            // Update existing
            state.reflections[existingIndex] = {
              ...state.reflections[existingIndex],
              ...reflectionData,
              updatedAt: getCurrentTimestamp(),
            };
          } else {
            // Create new
            state.reflections.push({
              ...reflectionData,
              id: generateId(),
              createdAt: getCurrentTimestamp(),
              updatedAt: getCurrentTimestamp(),
              _version: 1,
            });
          }
          state.lastUpdated = getCurrentTimestamp();
        });
      },

      // ─── Data Management ───────────────────────────────────
      exportAllData: () => {
        const state = get();
        const exportData = {
          meta: {
            exportedAt: getCurrentTimestamp(),
            schemaVersion: state.schemaVersion,
            appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
          },
          data: {
            goals: state.goals,
            tasks: state.tasks,
            habits: state.habits,
            habitLogs: state.habitLogs,
            energyLogs: state.energyLogs,
            reflections: state.reflections,
          },
        };
        return JSON.stringify(exportData, null, 2);
      },

      importData: (jsonData) => {
        try {
          const parsed = JSON.parse(jsonData);
          // TODO: Validate with Zod
          
          set((state) => {
            state.goals = parsed.data.goals ?? [];
            state.tasks = parsed.data.tasks ?? [];
            state.habits = parsed.data.habits ?? [];
            state.habitLogs = parsed.data.habitLogs ?? [];
            state.energyLogs = parsed.data.energyLogs ?? [];
            state.reflections = parsed.data.reflections ?? [];
            state.lastUpdated = getCurrentTimestamp();
          });
          
          return { success: true };
        } catch (error) {
          return { success: false, error: String(error) };
        }
      },

      clearAllData: () => {
        set((state) => {
          state.goals = [];
          state.tasks = [];
          state.habits = [];
          state.habitLogs = [];
          state.energyLogs = [];
          state.reflections = [];
          state.lastUpdated = getCurrentTimestamp();
        });
      },
    })),
    {
      name: 'life-os-storage',
      storage: createJSONStorage(() => createIndexedDBStorage()),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        goals: state.goals,
        tasks: state.tasks,
        habits: state.habits,
        habitLogs: state.habitLogs,
        energyLogs: state.energyLogs,
        reflections: state.reflections,
        schemaVersion: state.schemaVersion,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);

// Hydration Hook
export const useHydration = () => {
  return useLifeOSStore((state) => state._hasHydrated);
};
```

### Selektoren

```typescript
// stores/selectors/taskSelectors.ts

import { useLifeOSStore } from '../lifeOSStore';
import { formatDate, isBeforeToday, parseDate } from '@/lib/utils/dates';
import type { Task } from '@/types';

// Selector für heutige Aufgaben
export const useTodaysTasks = (): Task[] => {
  const today = formatDate(new Date());
  
  return useLifeOSStore((state) =>
    state.tasks
      .filter((t) => t.scheduledDate === today && t.status === 'pending')
      .sort((a, b) => a.sortOrder - b.sortOrder)
  );
};

// Selector für überfällige Aufgaben
export const useOverdueTasks = (): Task[] => {
  const today = formatDate(new Date());
  
  return useLifeOSStore((state) =>
    state.tasks
      .filter((t) => 
        t.scheduledDate && 
        t.scheduledDate < today && 
        t.status === 'pending'
      )
      .sort((a, b) => a.scheduledDate!.localeCompare(b.scheduledDate!))
  );
};

// Selector für Aufgaben nach Datum
export const useTasksByDate = (date: string): Task[] => {
  return useLifeOSStore((state) =>
    state.tasks
      .filter((t) => t.scheduledDate === date)
      .sort((a, b) => {
        // Pending vor Completed
        if (a.status !== b.status) {
          return a.status === 'pending' ? -1 : 1;
        }
        return a.sortOrder - b.sortOrder;
      })
  );
};

// Selector für Inbox (ungeplante Aufgaben)
export const useInboxTasks = (): Task[] => {
  return useLifeOSStore((state) =>
    state.tasks
      .filter((t) => !t.scheduledDate && t.status === 'pending')
      .sort((a, b) => a.sortOrder - b.sortOrder)
  );
};
```

---

## 5.6 Fehlerbehandlung

### Error Boundary

```typescript
// components/ErrorBoundary.tsx

'use client';

import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service in production
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">
            Etwas ist schiefgelaufen
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ein unerwarteter Fehler ist aufgetreten.
          </p>
          <Button onClick={this.handleReset}>
            Erneut versuchen
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Async Error Handling

```typescript
// lib/utils/errors.ts

// Custom Error Types
export class StorageError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'StorageError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DataIntegrityError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = 'DataIntegrityError';
  }
}

// Error Handler
export function handleError(error: unknown): { message: string; recoverable: boolean } {
  if (error instanceof StorageError) {
    return {
      message: 'Daten konnten nicht gespeichert werden. Bitte versuche es erneut.',
      recoverable: true,
    };
  }
  
  if (error instanceof ValidationError) {
    return {
      message: error.message,
      recoverable: true,
    };
  }
  
  if (error instanceof DataIntegrityError) {
    return {
      message: 'Dateninkonsistenz erkannt. Bitte exportiere deine Daten als Backup.',
      recoverable: false,
    };
  }
  
  // Unknown error
  console.error('Unhandled error:', error);
  return {
    message: 'Ein unbekannter Fehler ist aufgetreten.',
    recoverable: false,
  };
}

// Safe async wrapper
export async function safeAsync<T>(
  fn: () => Promise<T>
): Promise<{ data: T; error: null } | { data: null; error: string }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    const { message } = handleError(error);
    return { data: null, error: message };
  }
}
```

---

## 5.7 Testing-Strategie

### Test-Pyramide

```
         ┌───────────┐
         │   E2E     │  ~10 Tests (kritische User Flows)
         │(Playwright)│ 
        ─┴───────────┴─
       ┌───────────────┐
       │ Integration   │  ~50 Tests (Feature-Module)
       │   (Vitest)    │
      ─┴───────────────┴─
     ┌───────────────────┐
     │     Unit Tests    │  ~100+ Tests (Utils, Selectors, Hooks)
     │     (Vitest)      │
    ─┴───────────────────┴─
```

### Unit Test Beispiel

```typescript
// tests/unit/utils/streakCalculator.test.ts

import { describe, it, expect } from 'vitest';
import { calculateStreak } from '@/features/habits/utils/streakCalculator';
import type { HabitLog } from '@/types';

describe('calculateStreak', () => {
  it('returns 0 for empty logs', () => {
    expect(calculateStreak([])).toBe(0);
  });

  it('returns 1 for single completed log today', () => {
    const today = '2026-01-31';
    const logs: HabitLog[] = [
      { id: '1', habitId: 'h1', date: today, completed: true, createdAt: '', updatedAt: '', _version: 1 },
    ];
    expect(calculateStreak(logs, today)).toBe(1);
  });

  it('returns consecutive days count', () => {
    const logs: HabitLog[] = [
      { id: '1', habitId: 'h1', date: '2026-01-31', completed: true, createdAt: '', updatedAt: '', _version: 1 },
      { id: '2', habitId: 'h1', date: '2026-01-30', completed: true, createdAt: '', updatedAt: '', _version: 1 },
      { id: '3', habitId: 'h1', date: '2026-01-29', completed: true, createdAt: '', updatedAt: '', _version: 1 },
    ];
    expect(calculateStreak(logs, '2026-01-31')).toBe(3);
  });

  it('breaks streak on missed day', () => {
    const logs: HabitLog[] = [
      { id: '1', habitId: 'h1', date: '2026-01-31', completed: true, createdAt: '', updatedAt: '', _version: 1 },
      // 2026-01-30 fehlt
      { id: '2', habitId: 'h1', date: '2026-01-29', completed: true, createdAt: '', updatedAt: '', _version: 1 },
    ];
    expect(calculateStreak(logs, '2026-01-31')).toBe(1);
  });
});
```

### Component Test Beispiel

```typescript
// tests/integration/features/tasks/TaskItem.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskItem } from '@/features/tasks/components/TaskItem';
import type { Task } from '@/types';

const mockTask: Task = {
  id: 'task-1',
  title: 'Test Aufgabe',
  notes: null,
  scheduledDate: '2026-01-31',
  goalId: null,
  status: 'pending',
  completedAt: null,
  sortOrder: 0,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  _version: 1,
};

describe('TaskItem', () => {
  it('renders task title', () => {
    render(<TaskItem task={mockTask} />);
    expect(screen.getByText('Test Aufgabe')).toBeInTheDocument();
  });

  it('shows unchecked checkbox for pending task', () => {
    render(<TaskItem task={mockTask} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('shows checked checkbox for completed task', () => {
    const completedTask = { ...mockTask, status: 'completed' as const };
    render(<TaskItem task={completedTask} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onEdit when clicked', () => {
    const onEdit = vi.fn();
    render(<TaskItem task={mockTask} onEdit={onEdit} />);
    fireEvent.click(screen.getByText('Test Aufgabe'));
    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });
});
```

### E2E Test Beispiel

```typescript
// tests/e2e/flows/daily-usage.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Daily Usage Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear IndexedDB before each test
    await page.goto('/');
    await page.evaluate(() => indexedDB.deleteDatabase('life-os-storage'));
    await page.reload();
  });

  test('complete daily flow', async ({ page }) => {
    // 1. Navigate to Today view
    await page.goto('/today');
    await expect(page.getByText(/Heute/)).toBeVisible();

    // 2. Log energy level
    await page.getByRole('button', { name: /🙂/ }).click();
    await expect(page.getByText(/Energie geloggt/)).toBeVisible();

    // 3. Add a task
    await page.getByRole('button', { name: /Aufgabe hinzufügen/ }).click();
    await page.getByPlaceholder(/Titel/).fill('E-Mails checken');
    await page.getByRole('button', { name: /Speichern/ }).click();
    await expect(page.getByText('E-Mails checken')).toBeVisible();

    // 4. Complete the task
    await page.getByRole('checkbox').first().click();
    await expect(page.getByRole('checkbox').first()).toBeChecked();

    // 5. Verify data persists after reload
    await page.reload();
    await expect(page.getByText('E-Mails checken')).toBeVisible();
    await expect(page.getByRole('checkbox').first()).toBeChecked();
  });
});
```

---

## 5.8 Build & Deployment

### Build-Konfiguration

```typescript
// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Strict Mode für bessere Entwicklung
  reactStrictMode: true,
  
  // Optimierungen
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // PWA Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Static Export für Offline-First (optional)
  output: 'export',
  
  // Trailing Slash für Static Hosting
  trailingSlash: true,
};

export default nextConfig;
```

### PWA Manifest

```json
// public/manifest.json
{
  "name": "Life OS",
  "short_name": "LifeOS",
  "description": "Persönliches Lebens-Management-System",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Deployment-Optionen

| Plattform | Eignung | Kosten |
|-----------|---------|--------|
| **Vercel** | Optimal für Next.js | Free Tier ausreichend |
| **Netlify** | Gut für Static Export | Free Tier ausreichend |
| **GitHub Pages** | Gut für Static Export | Kostenlos |
| **Self-Hosted** | Volle Kontrolle | Variable |

---

## 5.9 Performance-Budgets

### Core Web Vitals Ziele

| Metrik | Ziel | Grund |
|--------|------|-------|
| **LCP** | < 2.5s | Schneller erster Eindruck |
| **FID** | < 100ms | Reaktive Interaktionen |
| **CLS** | < 0.1 | Visuelle Stabilität |
| **TTI** | < 3.5s | Interaktivität |

### Bundle-Größen-Budget

| Chunk | Max. Größe | Inhalt |
|-------|------------|--------|
| **Initial JS** | < 100KB gzipped | React, Framework, Layout |
| **Route Chunk** | < 50KB gzipped | Einzelne Seite |
| **Shared Chunk** | < 30KB gzipped | Gemeinsam genutzte Komponenten |

### Optimierungsstrategien

1. **Code Splitting**: Next.js automatisch + dynamische Imports
2. **Tree Shaking**: Nur genutzte Exports
3. **Image Optimization**: next/image für Icons
4. **Font Optimization**: next/font für Google Fonts
5. **Lazy Loading**: Modals und Dialoge erst bei Bedarf

---

## Zusammenfassung Phase 5

### Definierte Artefakte

1. ✅ **Vollständige Ordnerstruktur** (>50 Dateien geplant)
2. ✅ **Schichten-Architektur** (Presentation → Feature → State → Data)
3. ✅ **Component-Design Patterns** mit Templates
4. ✅ **Zustand Store Implementation** (vollständiger Code)
5. ✅ **Fehlerbehandlungs-Strategie** mit Error Boundaries
6. ✅ **Testing-Strategie** mit Test-Pyramide
7. ✅ **Build & Deployment Konfiguration**
8. ✅ **Performance-Budgets**

### Nächste Phase

**Phase 6: Entwicklungsplan** wird definieren:
- Sprint-Planung
- Meilensteine
- Definition of Done
- Risiken & Mitigationen

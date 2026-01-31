# Life OS – Phase 3: Daten & State-Architektur

> Erstellt: 2026-01-31
> Status: In Bearbeitung

---

## 3.1 Datenmodell-Philosophie

### Leitprinzipien

| Prinzip | Erklärung |
|---------|-----------|
| **Immutabilität** | Historische Daten werden nicht überschrieben, sondern versioniert |
| **Normalisierung** | Keine Duplikate, Referenzen über IDs |
| **Erweiterbarkeit** | Schema kann ohne Datenverlust erweitert werden |
| **Selbstbeschreibend** | Jeder Datensatz enthält Metadaten (Erstellzeit, Version) |
| **Offline-First** | Primärer Speicher ist lokal, Sync ist optionale Erweiterung |
| **Soft Deletes** | Daten werden nicht physisch gelöscht, sondern markiert |

---

## 3.2 Entitäten-Definition

### Entity: Goal (Ziel)

```typescript
interface Goal {
  // Identifikation
  id: string;                    // UUID v4
  
  // Kern-Daten
  title: string;                 // Pflichtfeld, max 200 Zeichen
  description: string | null;    // Optional, max 2000 Zeichen
  category: GoalCategory;        // Enum
  timeHorizon: TimeHorizon;      // Enum
  
  // Status
  status: GoalStatus;            // 'active' | 'paused' | 'completed' | 'archived'
  
  // Metadaten
  createdAt: string;             // ISO 8601, UTC
  updatedAt: string;             // ISO 8601, UTC
  completedAt: string | null;    // ISO 8601, UTC
  archivedAt: string | null;     // ISO 8601, UTC
  
  // Sortierung
  sortOrder: number;             // Für manuelle Reihenfolge
  
  // Schema-Version
  _version: number;              // Für Migrationen
}

type GoalCategory = 
  | 'health'        // Gesundheit & Fitness
  | 'career'        // Karriere & Beruf
  | 'relationships' // Beziehungen & Familie
  | 'personal'      // Persönliche Entwicklung
  | 'finance'       // Finanzen
  | 'learning'      // Lernen & Bildung
  | 'other';        // Sonstiges

type TimeHorizon = 
  | 'short'         // Wochen bis 3 Monate
  | 'medium'        // 3-12 Monate
  | 'long'          // 1-5 Jahre
  | 'ongoing';      // Fortlaufend (z.B. "Gesund bleiben")

type GoalStatus = 
  | 'active'        // Wird aktiv verfolgt
  | 'paused'        // Temporär pausiert
  | 'completed'     // Erfolgreich abgeschlossen
  | 'archived';     // Nicht mehr relevant (Soft Delete)
```

### Entity: Task (Aufgabe)

```typescript
interface Task {
  // Identifikation
  id: string;                    // UUID v4
  
  // Kern-Daten
  title: string;                 // Pflichtfeld, max 500 Zeichen
  notes: string | null;          // Optional, max 2000 Zeichen
  
  // Planung
  scheduledDate: string | null;  // YYYY-MM-DD (lokale Zeit), null = Inbox
  
  // Beziehungen
  goalId: string | null;         // Referenz auf Goal (optional)
  
  // Status
  status: TaskStatus;
  completedAt: string | null;    // ISO 8601, UTC
  
  // Metadaten
  createdAt: string;             // ISO 8601, UTC
  updatedAt: string;             // ISO 8601, UTC
  
  // Sortierung
  sortOrder: number;             // Innerhalb eines Tages
  
  // Schema-Version
  _version: number;
}

type TaskStatus = 
  | 'pending'       // Offen
  | 'completed'     // Erledigt
  | 'cancelled';    // Abgebrochen (Soft Delete)
```

### Entity: Habit (Gewohnheit)

```typescript
interface Habit {
  // Identifikation
  id: string;                    // UUID v4
  
  // Kern-Daten
  title: string;                 // Pflichtfeld, max 200 Zeichen
  description: string | null;    // Optional
  
  // Frequenz-Konfiguration
  frequency: HabitFrequency;
  targetDays: number[] | null;   // 0-6 (So-Sa) für 'specific_days'
  targetCount: number | null;    // Für 'times_per_week'
  
  // Beziehungen
  goalId: string | null;         // Referenz auf Goal (optional)
  
  // Status
  isActive: boolean;             // false = pausiert oder archiviert
  isArchived: boolean;           // Soft Delete
  
  // Metadaten
  createdAt: string;             // ISO 8601, UTC
  updatedAt: string;             // ISO 8601, UTC
  archivedAt: string | null;
  
  // Abgeleitete Statistiken (nicht gespeichert, berechnet)
  // currentStreak: number;
  // longestStreak: number;
  // completionRateThisWeek: number;
  
  // Schema-Version
  _version: number;
}

type HabitFrequency = 
  | 'daily'           // Jeden Tag
  | 'times_per_week'  // X-mal pro Woche (z.B. 3x)
  | 'specific_days';  // Bestimmte Tage (z.B. Mo, Mi, Fr)
```

### Entity: HabitLog (Gewohnheits-Eintrag)

```typescript
interface HabitLog {
  // Identifikation
  id: string;                    // UUID v4
  
  // Beziehungen
  habitId: string;               // Referenz auf Habit
  
  // Kern-Daten
  date: string;                  // YYYY-MM-DD (lokale Zeit)
  completed: boolean;            // true = erledigt
  
  // Metadaten
  createdAt: string;             // ISO 8601, UTC
  updatedAt: string;             // ISO 8601, UTC
  
  // Schema-Version
  _version: number;
}

// Constraint: Pro habitId + date nur ein Eintrag
```

### Entity: EnergyLog (Energie-Check-In)

```typescript
interface EnergyLog {
  // Identifikation
  id: string;                    // UUID v4
  
  // Kern-Daten
  date: string;                  // YYYY-MM-DD (lokale Zeit)
  level: EnergyLevel;            // 1-5
  mood: MoodType | null;         // Optional
  note: string | null;           // Optional, max 500 Zeichen
  
  // Metadaten
  createdAt: string;             // ISO 8601, UTC
  updatedAt: string;             // ISO 8601, UTC
  
  // Schema-Version
  _version: number;
}

type EnergyLevel = 1 | 2 | 3 | 4 | 5;

type MoodType = 
  | 'great'       // 😊
  | 'good'        // 🙂
  | 'neutral'     // 😐
  | 'low'         // 😔
  | 'bad';        // 😢
```

### Entity: WeeklyReflection (Wochen-Reflexion)

```typescript
interface WeeklyReflection {
  // Identifikation
  id: string;                    // UUID v4
  
  // Kern-Daten
  weekStart: string;             // YYYY-MM-DD (Montag der Woche)
  weekEnd: string;               // YYYY-MM-DD (Sonntag der Woche)
  
  // Reflexions-Antworten
  satisfactionRating: number;    // 1-5
  wentWell: string | null;       // Freitext
  challenges: string | null;     // Freitext
  nextWeekFocus: string | null;  // Freitext
  goalAdjustmentNeeded: boolean; // Ja/Nein
  additionalNotes: string | null;// Freitext
  
  // Snapshot der Woche (zum Zeitpunkt der Reflexion)
  weekSummary: WeekSummary;
  
  // Metadaten
  createdAt: string;             // ISO 8601, UTC
  updatedAt: string;             // ISO 8601, UTC
  
  // Schema-Version
  _version: number;
}

interface WeekSummary {
  tasksCompleted: number;
  tasksTotal: number;
  habitsCompletionRate: number;  // 0-100%
  averageEnergyLevel: number | null;
  activeGoalsCount: number;
}
```

---

## 3.3 Entitäten-Beziehungen (ER-Diagramm)

```
┌─────────────────┐
│      Goal       │
│─────────────────│
│ id (PK)         │
│ title           │
│ category        │
│ status          │
└────────┬────────┘
         │
         │ 1:N (optional)
         │
    ┌────┴────┬─────────────┐
    │         │             │
    ▼         ▼             ▼
┌────────┐ ┌────────┐ ┌────────────┐
│  Task  │ │ Habit  │ │            │
│────────│ │────────│ │            │
│id (PK) │ │id (PK) │ │            │
│goalId  │ │goalId  │ │            │
│(FK,opt)│ │(FK,opt)│ │            │
└────────┘ └───┬────┘ │            │
               │      │            │
               │ 1:N  │            │
               ▼      │            │
         ┌──────────┐ │            │
         │ HabitLog │ │            │
         │──────────│ │            │
         │ id (PK)  │ │            │
         │ habitId  │ │            │
         │ (FK)     │ │            │
         │ date     │ │            │
         └──────────┘ │            │
                      │            │
    ┌─────────────────┴────────────┘
    │
    ▼
┌─────────────────────┐
│     EnergyLog       │
│─────────────────────│
│ id (PK)             │
│ date (unique)       │
│ level               │
└─────────────────────┘

┌─────────────────────┐
│  WeeklyReflection   │
│─────────────────────│
│ id (PK)             │
│ weekStart (unique)  │
│ weekSummary         │
└─────────────────────┘
```

### Beziehungs-Regeln

| Beziehung | Typ | Regel |
|-----------|-----|-------|
| Goal → Task | 1:N | Optional. Task kann ohne Goal existieren |
| Goal → Habit | 1:N | Optional. Habit kann ohne Goal existieren |
| Habit → HabitLog | 1:N | Pflicht. HabitLog gehört immer zu Habit |
| HabitLog.habitId + date | Unique | Pro Tag nur ein Log pro Habit |
| EnergyLog.date | Unique | Pro Tag nur ein Energie-Log |
| WeeklyReflection.weekStart | Unique | Pro Woche nur eine Reflexion |

---

## 3.4 Schema-Versionierung

### Warum Versionierung?

- App wird über Jahre genutzt
- Schema wird sich ändern
- Alte Daten müssen migriert werden

### Versionierungs-Strategie

```typescript
interface SchemaVersion {
  current: number;           // Aktuelle App-Version
  migrations: Migration[];   // Liste aller Migrationen
}

interface Migration {
  fromVersion: number;
  toVersion: number;
  migrate: (data: unknown) => unknown;
  description: string;
}

// Beispiel-Migration
const migration_1_to_2: Migration = {
  fromVersion: 1,
  toVersion: 2,
  description: 'Add mood field to EnergyLog',
  migrate: (data) => ({
    ...data,
    mood: null, // Neues Feld mit Default
  }),
};
```

### Migrations-Ablauf

1. App startet, liest `_version` aus jedem Datensatz
2. Vergleicht mit aktueller Schema-Version
3. Wendet alle notwendigen Migrationen an
4. Speichert migrierte Daten zurück

---

## 3.5 State-Management-Strategie

### Entscheidung: Zustand vs Redux vs eigene Lösung

| Option | Pro | Contra | Entscheidung |
|--------|-----|--------|--------------|
| **Redux** | Etabliert, DevTools | Boilerplate, Overkill für lokale App | ❌ |
| **Zustand** | Minimal, einfach, performant | Weniger bekannt | ✅ Gewählt |
| **React Context** | Built-in | Performance bei großen State | ❌ |
| **Jotai/Recoil** | Atomic | Zu fein-granular | ❌ |

**Begründung für Zustand:**
- Minimal Boilerplate
- Einfache Persistenz-Integration
- Ausgezeichnete TypeScript-Unterstützung
- Gute Performance bei mittleren Datenmengen
- Zukunftssicher für Sync-Erweiterung

### State-Kategorien

```
┌─────────────────────────────────────────────────────────┐
│                    STATE-ARCHITEKTUR                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │           PERSISTENTER STATE                    │    │
│  │  (In IndexedDB gespeichert)                     │    │
│  │  ─────────────────────────────────────────────  │    │
│  │  • Goals[]                                      │    │
│  │  • Tasks[]                                      │    │
│  │  • Habits[]                                     │    │
│  │  • HabitLogs[]                                  │    │
│  │  • EnergyLogs[]                                 │    │
│  │  • WeeklyReflections[]                          │    │
│  │  • UserPreferences                              │    │
│  └─────────────────────────────────────────────────┘    │
│                          │                              │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐    │
│  │           ABGELEITETER STATE                    │    │
│  │  (Berechnet, nicht gespeichert)                 │    │
│  │  ─────────────────────────────────────────────  │    │
│  │  • todaysTasks: Task[]                          │    │
│  │  • overdueTasks: Task[]                         │    │
│  │  • activeGoals: Goal[]                          │    │
│  │  • todaysHabits: Habit[]                        │    │
│  │  • habitStreaks: Map<habitId, number>           │    │
│  │  • weeklyProgress: WeekSummary                  │    │
│  └─────────────────────────────────────────────────┘    │
│                          │                              │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐    │
│  │           UI STATE                              │    │
│  │  (Temporär, nicht gespeichert)                  │    │
│  │  ─────────────────────────────────────────────  │    │
│  │  • currentView: 'today' | 'goals' | 'habits'    │    │
│  │  • selectedDate: Date                           │    │
│  │  • isModalOpen: boolean                         │    │
│  │  • editingItem: Goal | Task | Habit | null      │    │
│  │  • isSaving: boolean                            │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Store-Struktur (Zustand)

```typescript
// Haupt-Store (persistiert)
interface LifeOSStore {
  // Daten
  goals: Goal[];
  tasks: Task[];
  habits: Habit[];
  habitLogs: HabitLog[];
  energyLogs: EnergyLog[];
  reflections: WeeklyReflection[];
  
  // Einstellungen
  preferences: UserPreferences;
  
  // Actions - Goals
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  archiveGoal: (id: string) => void;
  
  // Actions - Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  // Actions - Habits
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  archiveHabit: (id: string) => void;
  toggleHabitForDate: (habitId: string, date: string) => void;
  
  // Actions - Energy
  logEnergy: (log: Omit<EnergyLog, 'id' | 'createdAt' | 'updatedAt'>) => void;
  
  // Actions - Reflection
  saveReflection: (reflection: Omit<WeeklyReflection, 'id' | 'createdAt' | 'updatedAt'>) => void;
  
  // Hydration
  _hasHydrated: boolean;
}

// UI-Store (nicht persistiert)
interface UIStore {
  currentView: ViewType;
  selectedDate: Date;
  isModalOpen: boolean;
  modalType: ModalType | null;
  editingItemId: string | null;
  
  // Actions
  setView: (view: ViewType) => void;
  setSelectedDate: (date: Date) => void;
  openModal: (type: ModalType, itemId?: string) => void;
  closeModal: () => void;
}

type ViewType = 'today' | 'goals' | 'habits' | 'tasks' | 'reflect' | 'settings';
type ModalType = 'addGoal' | 'editGoal' | 'addTask' | 'editTask' | 'addHabit' | 'editHabit' | 'energyCheckIn' | 'reflection';
```

### Computed/Derived State (Selektoren)

```typescript
// Diese werden NICHT gespeichert, sondern berechnet
const selectors = {
  // Aufgaben für heute
  getTodaysTasks: (state: LifeOSStore): Task[] => {
    const today = formatDate(new Date());
    return state.tasks.filter(
      t => t.scheduledDate === today && t.status === 'pending'
    );
  },
  
  // Überfällige Aufgaben
  getOverdueTasks: (state: LifeOSStore): Task[] => {
    const today = formatDate(new Date());
    return state.tasks.filter(
      t => t.scheduledDate && t.scheduledDate < today && t.status === 'pending'
    );
  },
  
  // Aktive Ziele
  getActiveGoals: (state: LifeOSStore): Goal[] => {
    return state.goals.filter(g => g.status === 'active');
  },
  
  // Gewohnheiten für heute
  getTodaysHabits: (state: LifeOSStore): Habit[] => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0-6
    
    return state.habits.filter(h => {
      if (!h.isActive || h.isArchived) return false;
      if (h.frequency === 'daily') return true;
      if (h.frequency === 'specific_days') {
        return h.targetDays?.includes(dayOfWeek);
      }
      // 'times_per_week' - immer anzeigen
      return true;
    });
  },
  
  // Streak für eine Gewohnheit
  getHabitStreak: (state: LifeOSStore, habitId: string): number => {
    const logs = state.habitLogs
      .filter(l => l.habitId === habitId && l.completed)
      .sort((a, b) => b.date.localeCompare(a.date)); // Neueste zuerst
    
    let streak = 0;
    let expectedDate = formatDate(new Date());
    
    for (const log of logs) {
      if (log.date === expectedDate) {
        streak++;
        expectedDate = formatDate(subtractDays(new Date(expectedDate), 1));
      } else {
        break;
      }
    }
    
    return streak;
  },
  
  // Wochen-Zusammenfassung
  getWeekSummary: (state: LifeOSStore, weekStart: Date): WeekSummary => {
    // ... Berechnung basierend auf Tasks, Habits, EnergyLogs
  },
};
```

---

## 3.6 Offline-First Persistenz

### Technologie-Wahl: IndexedDB

| Option | Kapazität | Sync-fähig | Komplexität | Entscheidung |
|--------|-----------|------------|-------------|--------------|
| **localStorage** | ~5MB | Einfach | Niedrig | ❌ Zu klein |
| **IndexedDB** | ~50%+ Disk | Gut | Mittel | ✅ Gewählt |
| **SQLite (WASM)** | Unbegrenzt | Komplex | Hoch | ❌ Overkill |

### Persistenz-Architektur

```
┌─────────────────────────────────────────────────────────┐
│                     REACT APP                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │                 ZUSTAND STORE                     │  │
│  │  (In-Memory State)                                │  │
│  └───────────────────────┬───────────────────────────┘  │
│                          │                              │
│                          ▼                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │              PERSISTENCE LAYER                    │  │
│  │  (Abstraktion über Storage)                       │  │
│  │  ─────────────────────────────────────────────    │  │
│  │  • save(key, data)                                │  │
│  │  • load(key): data                                │  │
│  │  • delete(key)                                    │  │
│  │  • exportAll(): JSON                              │  │
│  │  • importAll(JSON)                                │  │
│  └───────────────────────┬───────────────────────────┘  │
│                          │                              │
│                          ▼                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │             INDEXED-DB ADAPTER                    │  │
│  │  (idb library wrapper)                            │  │
│  │  ─────────────────────────────────────────────    │  │
│  │  Database: 'life-os-db'                           │  │
│  │  Object Stores:                                   │  │
│  │    • goals                                        │  │
│  │    • tasks                                        │  │
│  │    • habits                                       │  │
│  │    • habitLogs (index: habitId, date)             │  │
│  │    • energyLogs (index: date)                     │  │
│  │    • reflections (index: weekStart)               │  │
│  │    • preferences                                  │  │
│  │    • meta (schema version, etc.)                  │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │     BROWSER DISK       │
              │     (IndexedDB)        │
              └────────────────────────┘
```

### Speicher-Strategie

```typescript
// Wann wird gespeichert?
const persistenceStrategy = {
  // Sofort speichern bei:
  immediate: [
    'goalCreated',
    'goalUpdated',
    'goalArchived',
    'taskCreated',
    'taskCompleted',
    'taskDeleted',
    'habitCreated',
    'habitToggled',
    'energyLogged',
    'reflectionSaved',
  ],
  
  // Batch-Speicherung: Nie (immer sofort)
  // Grund: Offline-First bedeutet sofortige Persistenz
  
  // Recovery: Bei jedem App-Start
  onStartup: [
    'checkDataIntegrity',
    'migrateIfNeeded',
    'hydrateStore',
  ],
};
```

### Datenintegritäts-Prüfung

```typescript
async function checkDataIntegrity(): Promise<IntegrityReport> {
  const report: IntegrityReport = {
    isHealthy: true,
    issues: [],
    repairs: [],
  };
  
  // 1. Orphaned HabitLogs (habitId zeigt auf nicht-existierenden Habit)
  const habitIds = new Set(habits.map(h => h.id));
  const orphanedLogs = habitLogs.filter(l => !habitIds.has(l.habitId));
  if (orphanedLogs.length > 0) {
    report.issues.push(`${orphanedLogs.length} orphaned HabitLogs`);
    // Auto-Repair: Löschen oder archivieren
  }
  
  // 2. Doppelte Einträge (gleiche ID)
  // 3. Fehlende Pflichtfelder
  // 4. Ungültige Datumswerte
  // 5. Schema-Version mismatch
  
  return report;
}
```

### Datenverlust-Prävention

| Szenario | Prävention |
|----------|------------|
| **Browser schließt während Speicherung** | Atomic writes, Rollback bei Fehler |
| **Browser-Cache gelöscht** | Warnung beim Start, Export-Empfehlung |
| **Private Mode** | Erkennung + prominente Warnung |
| **Storage-Quota überschritten** | Warnung bei 80%, erzwungener Export bei 95% |
| **Korrupte Daten** | Integrity-Check bei Start, Auto-Repair |

---

## 3.7 Datenexport-Format

### JSON-Export-Struktur

```typescript
interface LifeOSExport {
  // Metadaten
  meta: {
    exportedAt: string;          // ISO 8601
    schemaVersion: number;
    appVersion: string;
    exportFormat: 'full' | 'partial';
  };
  
  // Daten
  data: {
    goals: Goal[];
    tasks: Task[];
    habits: Habit[];
    habitLogs: HabitLog[];
    energyLogs: EnergyLog[];
    reflections: WeeklyReflection[];
    preferences: UserPreferences;
  };
  
  // Statistiken (informativ, nicht import-relevant)
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
```

---

## 3.8 Performance-Überlegungen

### Erwartete Datenmengen (nach 1 Jahr Nutzung)

| Entity | Pro Tag | Pro Woche | Pro Jahr | Größe/Eintrag | Gesamt |
|--------|---------|-----------|----------|---------------|--------|
| Goals | - | 0.2 | ~10 (kumulativ) | ~300 Bytes | ~3 KB |
| Tasks | 3 | 21 | ~1000 | ~200 Bytes | ~200 KB |
| Habits | - | 0.5 | ~25 (kumulativ) | ~250 Bytes | ~6 KB |
| HabitLogs | 5 | 35 | ~1800 | ~100 Bytes | ~180 KB |
| EnergyLogs | 1 | 7 | ~365 | ~150 Bytes | ~55 KB |
| Reflections | - | 1 | ~52 | ~1000 Bytes | ~52 KB |
| **TOTAL** | | | | | **~500 KB** |

**Fazit:** Nach einem Jahr ca. 500 KB – kein Performance-Problem für IndexedDB.

### Optimierungen

1. **Lazy Loading von Logs**: HabitLogs nur für sichtbaren Zeitraum laden
2. **Indices in IndexedDB**: Für häufige Queries (date, habitId)
3. **Computed Values cachen**: Mit useMemo/useCallback
4. **Virtualisierung**: Bei >100 Items in Listen

---

## 3.9 Zukünftige Sync-Fähigkeit (Vorbereitung)

### Design für optionalen Sync

```typescript
// Jede Entity hat zusätzliche Sync-Felder (zunächst ungenutzt)
interface SyncMetadata {
  _localId: string;           // Lokale UUID
  _remoteId: string | null;   // Server-ID (wenn synchronisiert)
  _syncStatus: SyncStatus;
  _lastSyncedAt: string | null;
  _conflictData: unknown | null;
}

type SyncStatus = 
  | 'local_only'       // Nur lokal, nie synchronisiert
  | 'synced'           // Synchron mit Server
  | 'pending_upload'   // Lokale Änderung, noch nicht hochgeladen
  | 'pending_download' // Server-Änderung, noch nicht angewendet
  | 'conflict';        // Konflikt erkannt

// Diese Felder sind im MVP nicht implementiert,
// aber das Schema ist darauf vorbereitet
```

---

## Zusammenfassung Phase 3

### Gewählte Technologien

| Bereich | Entscheidung | Begründung |
|---------|--------------|------------|
| **State Management** | Zustand | Minimal, TypeScript-first, Persistenz-ready |
| **Persistenz** | IndexedDB | Kapazität, Offline-First, Zukunftssicher |
| **Schema** | Versioniert | Langzeit-Nutzung, Migrationsfähigkeit |
| **ID-Generierung** | UUID v4 | Offline-kompatibel, Sync-ready |

### Nächste Phase

**Phase 4: UX & Flow** wird definieren:
- Komplette User Journeys
- Wireframes für Kernscreens
- Interaktionsmuster
- Fehlerbehandlungs-UX

# Life OS – Phase 6: Entwicklungsplan

> Erstellt: 2026-01-31
> Status: Abgeschlossen

---

## 6.1 Projekt-Übersicht

### Geschätzte Gesamtdauer

| Szenario | Dauer | Annahme |
|----------|-------|---------|
| **Vollzeit** (40h/Woche) | 4-6 Wochen | Fokussierte Entwicklung |
| **Teilzeit** (20h/Woche) | 8-10 Wochen | Neben anderem Projekt |
| **Nebenbei** (10h/Woche) | 12-16 Wochen | Neben Vollzeitjob |

### Gesamtaufwand-Schätzung

| Phase | Aufwand | Kumulativ |
|-------|---------|-----------|
| P1: Foundation | 15-20h | 15-20h |
| P2: Core Entities | 25-35h | 40-55h |
| P3: Daily Usage | 20-30h | 60-85h |
| P4: Reflection | 15-20h | 75-105h |
| P5: Polish | 20-30h | 95-135h |
| **Gesamt** | **95-135h** | |

---

## 6.2 Phasen-Roadmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ENTWICKLUNGS-ROADMAP                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ZEIT ─────────────────────────────────────────────────────────────────►    │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   PHASE 1    │  │   PHASE 2    │  │   PHASE 3    │  │   PHASE 4    │     │
│  │  Foundation  │──│Core Entities │──│ Daily Usage  │──│  Reflection  │     │
│  │   15-20h     │  │   25-35h     │  │   20-30h     │  │   15-20h     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                 │                 │                 │             │
│         ▼                 ▼                 ▼                 ▼             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         PHASE 5: Polish (20-30h)                     │   │
│  │            Parallel zu Phase 3-4, dann dediziert am Ende             │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  MEILENSTEINE:                                                              │
│  ────────────────────────────────────────────────────────────────────────   │
│         M1              M2              M3              M4       M5         │
│     Tech Demo       Entities       Daily Flow      Full MVP    Launch       │
│                       Ready          Works          Ready       Ready       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6.3 Phase 1: Foundation (15-20 Stunden)

### Ziel
Technisches Fundament aufbauen. Alle Infrastruktur-Entscheidungen umsetzen.

### Tasks

| # | Task | Aufwand | Priorität | Abhängigkeit |
|---|------|---------|-----------|--------------|
| 1.1 | Projekt-Setup verifizieren (Next.js, TypeScript) | 1h | P0 | - |
| 1.2 | Tailwind CSS konfigurieren (Dark Mode, Custom Colors) | 2h | P0 | 1.1 |
| 1.3 | TypeScript Types definieren (`types/*.ts`) | 3h | P0 | 1.1 |
| 1.4 | Basis UI-Komponenten (`Button`, `Input`, `Card`, `Checkbox`) | 4h | P0 | 1.2 |
| 1.5 | IndexedDB Setup mit `idb` Library | 3h | P0 | 1.1 |
| 1.6 | Zustand Store Grundstruktur | 3h | P0 | 1.3, 1.5 |
| 1.7 | Persist Middleware für IndexedDB | 2h | P0 | 1.6 |
| 1.8 | Layout-Komponenten (`Header`, `BottomNav`, `PageContainer`) | 3h | P1 | 1.4 |

### Deliverables

- [ ] App startet ohne Fehler
- [ ] Dark Mode funktioniert
- [ ] Alle Basis-UI-Komponenten existieren
- [ ] Store speichert und lädt Daten aus IndexedDB
- [ ] Daten überleben Browser-Neustart

### Definition of Done

```
✓ npm run dev startet ohne Errors
✓ npm run build produziert erfolgreichen Build
✓ npm run lint zeigt keine Errors
✓ Manueller Test: Daten in Store schreiben → Browser schließen → Öffnen → Daten da
```

---

## 6.4 Phase 2: Core Entities (25-35 Stunden)

### Ziel
Alle Kern-Entitäten (Goals, Tasks, Habits) implementieren inkl. CRUD.

### Sprint 2.1: Goals (8-12h)

| # | Task | Aufwand | Priorität |
|---|------|---------|-----------|
| 2.1.1 | Goal Store Actions (`addGoal`, `updateGoal`, `archiveGoal`) | 2h | P0 |
| 2.1.2 | Goal Selectors (`useActiveGoals`, `useGoalById`) | 1h | P0 |
| 2.1.3 | `GoalForm` Komponente | 3h | P0 |
| 2.1.4 | `GoalCard` Komponente | 2h | P0 |
| 2.1.5 | `GoalList` Komponente mit Kategorien | 2h | P0 |
| 2.1.6 | Goals Page (`/goals`) | 2h | P1 |
| 2.1.7 | Goal Detail Page (`/goals/[id]`) | 2h | P2 |

### Sprint 2.2: Tasks (8-12h)

| # | Task | Aufwand | Priorität |
|---|------|---------|-----------|
| 2.2.1 | Task Store Actions (vollständig) | 2h | P0 |
| 2.2.2 | Task Selectors (`useTodaysTasks`, `useOverdueTasks`, `useInboxTasks`) | 2h | P0 |
| 2.2.3 | `TaskItem` Komponente (mit Checkbox-Animation) | 2h | P0 |
| 2.2.4 | `TaskList` Komponente | 1h | P0 |
| 2.2.5 | `TaskForm` Komponente | 2h | P0 |
| 2.2.6 | `QuickAddTask` Modal | 2h | P1 |
| 2.2.7 | Datum-Auswahl in TaskForm | 1h | P1 |

### Sprint 2.3: Habits (9-11h)

| # | Task | Aufwand | Priorität |
|---|------|---------|-----------|
| 2.3.1 | Habit Store Actions | 2h | P0 |
| 2.3.2 | HabitLog Store Actions (`toggleHabitForDate`) | 1h | P0 |
| 2.3.3 | Streak Calculator Utility | 2h | P0 |
| 2.3.4 | Habit Selectors | 1h | P0 |
| 2.3.5 | `HabitCard` Komponente | 2h | P0 |
| 2.3.6 | `HabitForm` Komponente | 2h | P0 |
| 2.3.7 | Habits Page (`/habits`) | 2h | P1 |
| 2.3.8 | `HabitCalendar` (Monatsansicht) | 2h | P2 |

### Deliverables

- [ ] Goals CRUD vollständig funktionsfähig
- [ ] Tasks CRUD vollständig funktionsfähig
- [ ] Habits CRUD mit Tracking funktionsfähig
- [ ] Streak-Berechnung korrekt
- [ ] Alle Formulare haben Validierung

### Definition of Done

```
✓ Kann Goal erstellen, bearbeiten, archivieren
✓ Kann Task erstellen, erledigen, verschieben, löschen
✓ Kann Habit erstellen, täglich tracken
✓ Streak wird korrekt berechnet und angezeigt
✓ Unit Tests für Streak Calculator bestehen
```

---

## 6.5 Phase 3: Daily Usage (20-30 Stunden)

### Ziel
Die "Heute"-Ansicht als primärer Einstiegspunkt vollständig implementieren.

### Sprint 3.1: Today View (12-16h)

| # | Task | Aufwand | Priorität |
|---|------|---------|-----------|
| 3.1.1 | `TodayView` Komponente (Hauptlayout) | 3h | P0 |
| 3.1.2 | `TodayHeader` mit Datum und Navigation | 2h | P0 |
| 3.1.3 | Integration: Heutige Aufgaben | 2h | P0 |
| 3.1.4 | Integration: Überfällige Aufgaben | 2h | P0 |
| 3.1.5 | Integration: Heutige Gewohnheiten | 2h | P0 |
| 3.1.6 | "Verschieben auf Heute" für Überfällige | 1h | P1 |
| 3.1.7 | Today Page (`/today`) | 1h | P0 |
| 3.1.8 | Swipe-Navigation zwischen Tagen | 2h | P2 |

### Sprint 3.2: Energy Check-In (5-8h)

| # | Task | Aufwand | Priorität |
|---|------|---------|-----------|
| 3.2.1 | EnergyLog Store Actions | 1h | P0 |
| 3.2.2 | `EnergyCheckIn` Komponente | 2h | P0 |
| 3.2.3 | Integration in Today View | 1h | P0 |
| 3.2.4 | Energie-Historie (letzte 7 Tage) | 2h | P2 |
| 3.2.5 | Mood-Auswahl (optional) | 1h | P3 |

### Sprint 3.3: Onboarding (3-6h)

| # | Task | Aufwand | Priorität |
|---|------|---------|-----------|
| 3.3.1 | Onboarding-Flow (4 Screens) | 3h | P1 |
| 3.3.2 | Erstes Ziel erstellen | 1h | P1 |
| 3.3.3 | Erste Gewohnheit erstellen | 1h | P1 |
| 3.3.4 | Skip-Option implementieren | 0.5h | P1 |
| 3.3.5 | Onboarding nur beim ersten Start | 0.5h | P1 |

### Deliverables

- [ ] Today View zeigt alle relevanten Daten
- [ ] Energie-Check-In funktioniert
- [ ] Onboarding führt neuen User durch
- [ ] Navigation zwischen Tagen möglich

### Definition of Done

```
✓ Kann App öffnen und sehe sofort heutige Aufgaben + Gewohnheiten
✓ Kann Energie loggen mit einem Tap
✓ Kann Aufgabe mit einem Tap als erledigt markieren
✓ Kann Gewohnheit mit einem Tap tracken
✓ Onboarding erscheint nur beim ersten Start
✓ E2E Test: "Daily Usage Flow" besteht
```

---

## 6.6 Phase 4: Reflection (15-20 Stunden)

### Ziel
Wochen-Reflexion als Feedback-Loop implementieren.

### Sprint 4.1: Reflection Flow (10-14h)

| # | Task | Aufwand | Priorität |
|---|------|---------|-----------|
| 4.1.1 | WeeklyReflection Store Actions | 2h | P0 |
| 4.1.2 | Week Summary Calculator | 2h | P0 |
| 4.1.3 | `ReflectionFlow` (5-Step Wizard) | 4h | P0 |
| 4.1.4 | Zufriedenheits-Rating Komponente | 1h | P0 |
| 4.1.5 | Freitext-Fragen Komponenten | 2h | P0 |
| 4.1.6 | Reflexion speichern | 1h | P0 |
| 4.1.7 | Bestätigungs-Feedback | 1h | P1 |

### Sprint 4.2: Reflection History (5-6h)

| # | Task | Aufwand | Priorität |
|---|------|---------|-----------|
| 4.2.1 | `ReflectionCard` Komponente | 1h | P0 |
| 4.2.2 | `ReflectionHistory` (Liste) | 2h | P0 |
| 4.2.3 | Reflection Page (`/reflect`) | 1h | P0 |
| 4.2.4 | Reflexion bearbeiten (bis Mittwoch) | 1h | P2 |
| 4.2.5 | Reflexions-Detail-Ansicht | 1h | P2 |

### Deliverables

- [ ] Wochen-Reflexion durchführbar (5 Schritte)
- [ ] Wochen-Statistiken automatisch berechnet
- [ ] Vergangene Reflexionen einsehbar

### Definition of Done

```
✓ Kann Wochen-Reflexion starten und abschließen
✓ Sehe automatisch berechnete Wochen-Statistiken
✓ Reflexion wird gespeichert und ist später abrufbar
✓ Kann vergangene Reflexionen lesen
```

---

## 6.7 Phase 5: Polish (20-30 Stunden)

### Ziel
MVP-Qualität erreichen. Feinschliff, Performance, Edge Cases.

### Sprint 5.1: Data Export/Import (5-7h)

| # | Task | Aufwand | Priorität |
|---|------|---------|-----------|
| 5.1.1 | Export-Funktion (JSON) | 2h | P0 |
| 5.1.2 | Export-Funktion (CSV) | 2h | P2 |
| 5.1.3 | Import-Funktion mit Validierung | 2h | P1 |
| 5.1.4 | Settings Page (`/settings`) | 1h | P0 |
| 5.1.5 | "Alle Daten löschen" mit Bestätigung | 1h | P1 |

### Sprint 5.2: UI Polish (8-12h)

| # | Task | Aufwand | Priorität |
|---|------|---------|-----------|
| 5.2.1 | Micro-Animations (Checkbox, Toggle, etc.) | 3h | P1 |
| 5.2.2 | Loading Skeletons | 2h | P1 |
| 5.2.3 | Empty States für alle Screens | 2h | P1 |
| 5.2.4 | Toast Notifications | 2h | P1 |
| 5.2.5 | Konfetti bei "Alles erledigt" | 1h | P3 |
| 5.2.6 | Theme Toggle (Dark/Light) | 2h | P2 |

### Sprint 5.3: Edge Cases & Errors (4-6h)

| # | Task | Aufwand | Priorität |
|---|------|---------|-----------|
| 5.3.1 | Error Boundary global | 1h | P0 |
| 5.3.2 | Offline-Erkennung + Banner | 1h | P1 |
| 5.3.3 | Private Mode Warnung | 1h | P1 |
| 5.3.4 | Storage Quota Warnung | 1h | P2 |
| 5.3.5 | Daten-Integritäts-Check beim Start | 2h | P2 |

### Sprint 5.4: Testing & Launch (3-5h)

| # | Task | Aufwand | Priorität |
|---|------|---------|-----------|
| 5.4.1 | Unit Tests für kritische Utils | 2h | P1 |
| 5.4.2 | E2E Test: Complete Daily Flow | 1h | P1 |
| 5.4.3 | Performance-Check (Lighthouse) | 1h | P1 |
| 5.4.4 | README.md für Repository | 1h | P0 |

### Deliverables

- [ ] Datenexport funktioniert
- [ ] UI fühlt sich polished an
- [ ] Fehler werden graceful behandelt
- [ ] Tests bestehen
- [ ] Lighthouse Score > 90

### Definition of Done (MVP Complete)

```
✓ Alle P0 und P1 Tasks abgeschlossen
✓ Kann vollständig offline nutzen
✓ Datenexport funktioniert
✓ Keine offensichtlichen Bugs
✓ Lighthouse Performance > 90
✓ npm run build erfolgreich
✓ Deployed auf Vercel/Netlify
```

---

## 6.8 Meilensteine

### M1: Tech Demo (Ende Phase 1)

| Kriterium | Status |
|-----------|--------|
| App startet | ☐ |
| Dark Mode funktioniert | ☐ |
| Daten werden persistiert | ☐ |
| Basis-UI existiert | ☐ |

**Datum:** ~20h nach Start

---

### M2: Entities Ready (Ende Phase 2)

| Kriterium | Status |
|-----------|--------|
| Goals CRUD | ☐ |
| Tasks CRUD | ☐ |
| Habits CRUD + Tracking | ☐ |
| Streak-Berechnung | ☐ |

**Datum:** ~55h nach Start

---

### M3: Daily Flow Works (Ende Phase 3)

| Kriterium | Status |
|-----------|--------|
| Today View komplett | ☐ |
| Energie-Check-In | ☐ |
| Onboarding | ☐ |
| Tägliche Nutzung möglich | ☐ |

**Datum:** ~85h nach Start

---

### M4: Full MVP Ready (Ende Phase 4)

| Kriterium | Status |
|-----------|--------|
| Wochen-Reflexion | ☐ |
| Alle Core Features | ☐ |
| Grundlegende Tests | ☐ |

**Datum:** ~105h nach Start

---

### M5: Launch Ready (Ende Phase 5)

| Kriterium | Status |
|-----------|--------|
| Datenexport | ☐ |
| UI Polish | ☐ |
| Error Handling | ☐ |
| Deployed | ☐ |
| Portfolio-ready | ☐ |

**Datum:** ~135h nach Start

---

## 6.9 Risiken & Mitigationen

### Identifizierte Risiken

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| **IndexedDB Komplexität** | Mittel | Hoch | `idb` Library nutzen, früh testen |
| **State Management zu komplex** | Niedrig | Mittel | Zustand ist einfach, bei Problemen vereinfachen |
| **Scope Creep** | Hoch | Hoch | P0/P1 Fokus, P2/P3 nur wenn Zeit |
| **Streak-Logik Bugs** | Mittel | Mittel | Unit Tests vor Implementierung schreiben |
| **Browser-Kompatibilität** | Niedrig | Mittel | Nur moderne Browser targeten |
| **Motivation verlieren** | Mittel | Hoch | Kleine Meilensteine, sichtbarer Fortschritt |

### Entscheidungs-Log

| Datum | Entscheidung | Begründung | Alternativen |
|-------|--------------|------------|--------------|
| 2026-01-31 | Zustand statt Redux | Weniger Boilerplate, ausreichend für lokale App | Redux, Jotai |
| 2026-01-31 | IndexedDB statt localStorage | Größere Kapazität, strukturierte Queries | localStorage, SQLite |
| 2026-01-31 | Tailwind CSS | Utility-first, Dark Mode built-in | CSS Modules, styled-components |
| 2026-01-31 | Kein Backend | Offline-First Architektur, Privacy | Supabase, Firebase |

---

## 6.10 Tägliches Arbeitsprotokoll (Template)

```markdown
## [DATUM]

### Was ich heute gemacht habe
- [ ] Task 1
- [ ] Task 2

### Probleme/Blocker
- Problem X: Lösung Y

### Morgen
- Task A
- Task B

### Zeit heute: Xh
### Gesamt bisher: Yh
```

---

## 6.11 Beispiel: Erste Woche

### Tag 1 (3-4h)

| Zeit | Task |
|------|------|
| 1h | Projekt-Setup verifizieren, Dependencies installieren |
| 1h | Tailwind konfigurieren (Colors, Dark Mode) |
| 1h | TypeScript Types für Goal, Task, Habit schreiben |
| 1h | Button, Input, Card Komponenten erstellen |

### Tag 2 (3-4h)

| Zeit | Task |
|------|------|
| 1h | Checkbox Komponente mit Animation |
| 2h | IndexedDB Setup mit idb |
| 1h | Zustand Store Grundstruktur |

### Tag 3 (3-4h)

| Zeit | Task |
|------|------|
| 2h | Persist Middleware implementieren |
| 1h | Testen: Daten schreiben, Browser schließen, laden |
| 1h | Layout Komponenten (Header, BottomNav) |

### Tag 4 (3-4h)

| Zeit | Task |
|------|------|
| 1h | PageContainer, Navigation-Links |
| 2h | Goal Store Actions implementieren |
| 1h | Goal Selectors |

### Tag 5 (3-4h)

| Zeit | Task |
|------|------|
| 3h | GoalForm Komponente mit Validierung |
| 1h | GoalCard Komponente |

**Ende Woche 1:** ~15-20h, M1 (Tech Demo) erreicht

---

## Zusammenfassung Phase 6

### Entwicklungsplan-Artefakte

1. ✅ **Zeit-Schätzungen** (95-135h gesamt)
2. ✅ **5 Entwicklungsphasen** mit klaren Zielen
3. ✅ **~70 granulare Tasks** mit Aufwände
4. ✅ **5 Meilensteine** mit Kriterien
5. ✅ **Definition of Done** pro Phase
6. ✅ **Risiken & Mitigationen**
7. ✅ **Beispiel-Zeitplan** für erste Woche

### Nächste Phase

**Phase 7: Bewerbungsrelevanz** wird aufbereiten:
- Senior-Skills, die demonstriert werden
- Talking Points für Interviews
- Trade-offs erklärt
- Portfolio-Präsentation

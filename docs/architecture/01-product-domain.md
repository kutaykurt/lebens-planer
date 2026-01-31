# Life OS – Phase 1: Produkt & Domain-Analyse

> Erstellt: 2026-01-31
> Status: Abgeschlossen

---

## 1.1 Kernproblem-Definition

### Das zentrale Problem

**Menschen verlieren den Überblick über ihr eigenes Leben.**

Sie haben:
- Ziele in Notiz-Apps
- Aufgaben in To-Do-Listen
- Termine in Kalendern
- Gewohnheiten in Habit-Trackern
- Reflexionen in Journalen
- Finanzen in Spreadsheets

**Das Ergebnis:** Fragmentierte Selbstorganisation ohne Kohärenz.

### Warum ist das ein echtes Problem?

1. **Kognitive Last**: Nutzer müssen sich merken, wo welche Information liegt
2. **Fehlende Verbindungen**: Ziele sind nicht mit Aufgaben verknüpft, Gewohnheiten nicht mit Outcomes
3. **Keine Langzeit-Perspektive**: Tools optimieren für heute, nicht für "in 5 Jahren"
4. **Reflexions-Lücke**: Keine systematische Verbindung zwischen Handlung und Ergebnis
5. **Tool-Fatigue**: Zu viele Apps führen zu Aufgeben

### Warum scheitern bestehende Lösungen?

| Lösung | Problem |
|--------|---------|
| **Notion** | Zu flexibel, erfordert Setup-Kompetenz, Überforderung, Online-Abhängig |
| **Todoist/TickTick** | Nur Aufgaben, keine Ziele, keine Reflexion |
| **Habitica/Streaks** | Gamification lenkt ab, keine Ziel-Verbindung |
| **Journaling-Apps** | Isoliert, keine Struktur, keine Insights |
| **Obsidian** | Für Power-User, steile Lernkurve |
| **Google Calendar** | Nur Zeit, keine Intentionen |

**Kern-Einsicht:** Bestehende Tools sind entweder zu spezialisiert (ein Bereich) oder zu generisch (alles möglich, nichts vorgegeben).

---

## 1.2 Nutzertypen (Personas)

### Persona A: "Der Überforderte" (Primär-Zielgruppe)

- **Alter:** 25-45
- **Situation:** Zu viele Verpflichtungen, verliert Überblick
- **Bisherige Tools:** Hat 3-5 Apps ausprobiert, alle aufgegeben
- **Bedürfnis:** "Ich will einfach wissen, was ich tun soll"
- **Angst:** Versagen, etwas Wichtiges vergessen
- **Verhalten:** Startet motiviert, verliert nach 2 Wochen Interesse

### Persona B: "Der Ambitionierte"

- **Alter:** 20-35
- **Situation:** Klare Ziele, aber Schwierigkeiten bei der Umsetzung
- **Bisherige Tools:** Nutzt aktiv 2-3 Apps, unzufrieden mit Fragmentierung
- **Bedürfnis:** "Ich will sehen, ob ich auf Kurs bin"
- **Angst:** Zeit verschwenden, nicht vorankommen
- **Verhalten:** Diszipliniert, aber braucht Feedback-Loop

### Persona C: "Der Reflektierende"

- **Alter:** 30-50
- **Situation:** Lebensmitte, Neuorientierung
- **Bisherige Tools:** Journal, vielleicht Therapie
- **Bedürfnis:** "Ich will verstehen, wie ich ticke"
- **Angst:** Die falschen Prioritäten setzen
- **Verhalten:** Weniger aktiv, mehr nachdenkend

**Design-Implikation:** Das System muss für Persona A konzipiert sein (niedrigste Einstiegshürde), aber Tiefe für B und C bieten.

---

## 1.3 Domänen-Zerlegung

Life OS wird in **7 klar getrennte Domänen** unterteilt:

### Domäne 1: Ziele (Goals)

| Aspekt | Definition |
|--------|------------|
| **Zweck** | Richtung geben, Prioritäten setzen |
| **Zeithorizont** | Monate bis Jahre |
| **Verantwortung** | Definition von "Wohin will ich?" |
| **Beziehungen** | Ziele → Projekte → Aufgaben |
| **Metriken** | Fortschritt, Aktualität, Alignment |

### Domäne 2: Aufgaben (Tasks)

| Aspekt | Definition |
|--------|------------|
| **Zweck** | Konkrete Handlungen erfassen |
| **Zeithorizont** | Sofort bis Wochen |
| **Verantwortung** | Definition von "Was muss ich tun?" |
| **Beziehungen** | Aufgaben ← Ziele, Projekte |
| **Metriken** | Erledigt, Überfällig, Aufwand |

**Design-Entscheidung:** Aufgaben sind bewusst NICHT der Mittelpunkt. Sie sind Mittel zum Zweck.

### Domäne 3: Gewohnheiten (Habits)

| Aspekt | Definition |
|--------|------------|
| **Zweck** | Langfristige Verhaltensänderung |
| **Zeithorizont** | Täglich/wöchentlich, läuft über Monate |
| **Verantwortung** | Definition von "Wer will ich werden?" |
| **Beziehungen** | Gewohnheiten ← Ziele |
| **Metriken** | Streak, Erfolgsrate, Trend |

**Wichtig:** Gewohnheiten sind KEINE Aufgaben. Sie haben andere Psychologie (Konsistenz > Erledigung).

### Domäne 4: Zeit (Time)

| Aspekt | Definition |
|--------|------------|
| **Zweck** | Bewusste Allokation von Zeit |
| **Zeithorizont** | Tag, Woche |
| **Verantwortung** | Definition von "Wofür nutze ich meine Zeit?" |
| **Beziehungen** | Zeit ← Aufgaben, Gewohnheiten, Ziele |
| **Metriken** | Geplant vs. tatsächlich, Verteilung |

**Kein Kalender:** Life OS trackt Zeit-Blöcke als Intention, nicht als externes Kalender-Tool.

### Domäne 5: Energie (Energy)

| Aspekt | Definition |
|--------|------------|
| **Zweck** | Selbstwahrnehmung, Kapazitätsplanung |
| **Zeithorizont** | Täglich |
| **Verantwortung** | Definition von "Wie geht es mir?" |
| **Beziehungen** | Energie → Aufgabenplanung |
| **Metriken** | Level über Zeit, Korrelationen |

**Rationale:** Produktivitäts-Systeme ignorieren, dass Menschen keine Maschinen sind.

### Domäne 6: Reflexion (Reflection)

| Aspekt | Definition |
|--------|------------|
| **Zweck** | Lernen aus Erfahrung |
| **Zeithorizont** | Täglich, wöchentlich, monatlich, jährlich |
| **Verantwortung** | Definition von "Was habe ich gelernt?" |
| **Beziehungen** | Reflexion ← alle anderen Domänen |
| **Metriken** | Vollständigkeit, Einsichten über Zeit |

**Design-Entscheidung:** Geführte Reflexion mit Prompts, nicht freies Journaling.

### Domäne 7: Insights (Analytics)

| Aspekt | Definition |
|--------|------------|
| **Zweck** | Muster erkennen, Entscheidungen verbessern |
| **Zeithorizont** | Aggregiert über Wochen bis Jahre |
| **Verantwortung** | Definition von "Was sagen die Daten?" |
| **Beziehungen** | Insights ← alle anderen Domänen |
| **Metriken** | N/A (ist selbst die Metrik-Ebene) |

**Wichtig:** Insights sind passiv, nicht gamifiziert. Keine Punkte, keine Badges.

---

## 1.4 Domänen-Beziehungsmodell

```
                    ┌─────────────┐
                    │   ZIELE     │
                    │  (Richtung) │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌───────────┐    ┌───────────┐    ┌───────────┐
    │ AUFGABEN  │    │GEWOHNHEITEN│    │  PROJEKTE │
    │(Aktionen) │    │ (Routinen) │    │ (Bündel)  │
    └─────┬─────┘    └─────┬─────┘    └───────────┘
          │                │
          ▼                ▼
    ┌─────────────────────────────────┐
    │            ZEIT                 │
    │     (Wo geht Energie hin?)      │
    └─────────────────────────────────┘
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
    ┌───────────┐       ┌───────────┐
    │  ENERGIE  │       │ REFLEXION │
    │  (Input)  │       │ (Output)  │
    └───────────┘       └───────────┘
                    │
                    ▼
            ┌───────────────┐
            │   INSIGHTS    │
            │  (Erkenntnis) │
            └───────────────┘
```

---

## 1.5 Was Life OS NICHT ist (Anti-Scope)

### Bewusst ausgeschlossen:

| Feature | Grund für Ausschluss |
|---------|---------------------|
| **Kalender-Integration** | Erhöht Komplexität, erfordert externe APIs, verletzt Offline-First |
| **Team-Features** | Fokus auf individuelles Management |
| **Gamification (Punkte, Badges)** | Extrinsische Motivation, lenkt vom Kern ab |
| **Finanz-Tracking** | Eigene Domäne, zu komplex, bessere Speziallösungen existieren |
| **Notizen/Zettelkasten** | Nicht unser Kernproblem, würde Feature-Creep verursachen |
| **Social Features** | Privacy-First widerspricht Sharing |
| **KI-Vorschläge** | Externe Abhängigkeit, nicht offline-fähig |
| **Pomodoro/Timer** | Tactical-Tool, nicht strategisch |
| **Projekt-Management (Gantt etc.)** | Zu komplex für Einzelperson |

### Philosophische Grenzen:

- Life OS **ersetzt keinen Therapeuten**
- Life OS **macht nicht produktiver** – es macht bewusster
- Life OS **ist kein Selbstoptimierungs-Tool** – es ist ein Selbstverständnis-Tool
- Life OS **urteilt nicht** über Nutzung oder Nicht-Nutzung

---

## 1.6 Kern-Value-Proposition

> **"Life OS verbindet deine langfristigen Ziele mit deinem heutigen Tag – offline, privat, und ohne Überforderung."**

---

## 1.7 Erfolgs-Kriterien für das Produkt

Das Produkt ist erfolgreich, wenn:

1. **Ein Nutzer nach 3 Minuten** sein erstes Ziel und eine zugehörige Gewohnheit erstellt hat
2. **Ein Nutzer nach 2 Wochen** die App noch öffnet (Retention)
3. **Ein Nutzer nach 3 Monaten** eine Wochen-Reflexion durchführt und dabei Einsichten gewinnt
4. **Die App funktioniert** vollständig ohne Internetverbindung
5. **Ein Nutzer seine Daten exportieren** und komplett löschen kann

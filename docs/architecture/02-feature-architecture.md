# Life OS – Phase 2: Feature-Architektur

> Erstellt: 2026-01-31
> Status: Abgeschlossen

---

## 2.1 Feature-Hierarchie (Priorisierung)

### Tier 1: Core Features (MVP)

Diese Features sind **zwingend erforderlich** für ein funktionsfähiges Produkt:

| # | Feature | Domäne | Begründung |
|---|---------|--------|------------|
| 1 | **Ziel erstellen & verwalten** | Goals | Ohne Ziele keine Richtung – Kern des Systems |
| 2 | **Aufgaben erstellen & abhaken** | Tasks | Grundlegende Handlungsfähigkeit |
| 3 | **Gewohnheiten definieren & tracken** | Habits | Langfrist-Perspektive, unterscheidet Life OS von To-Do-Apps |
| 4 | **Tages-Ansicht** | Time | "Was mache ich heute?" – täglicher Einstiegspunkt |
| 5 | **Einfache Wochen-Reflexion** | Reflection | Feedback-Loop, ohne den System sinnlos ist |
| 6 | **Energie-Check-In** | Energy | Selbstwahrnehmung, beeinflusst Planung |
| 7 | **Offline-Persistence** | Infrastructure | Privacy-First & Offline-First Kernversprechen |
| 8 | **Daten-Export** | Infrastructure | User-Ownership, DSGVO-Konformität |

### Tier 2: Erweiterte Features (V1.0)

Nach stabilem MVP:

| # | Feature | Domäne | Begründung |
|---|---------|--------|------------|
| 9 | **Projekte (Ziel-Untergliederung)** | Goals | Komplexere Ziele brauchen Struktur |
| 10 | **Monats-Reflexion** | Reflection | Größerer Zeitrahmen = tiefere Einsichten |
| 11 | **Ziel-Aufgaben-Verknüpfung** | Goals/Tasks | Explizite Verbindung statt implizit |
| 12 | **Gewohnheits-Statistiken** | Habits/Insights | Motivation durch Sichtbarkeit |
| 13 | **Tags/Labels** | All | Flexible Kategorisierung |
| 14 | **Schnelle Erfassung (Quick Add)** | Tasks | Reduktion von Friction |
| 15 | **Wochen-Planung** | Time | Vorausschau statt nur Rückblick |

### Tier 3: Nice-to-Have (V2.0+)

Spätere Erweiterungen:

| # | Feature | Domäne | Begründung |
|---|---------|--------|------------|
| 16 | **Jahres-Reflexion** | Reflection | Langzeit-Perspektive |
| 17 | **Korrelations-Insights** | Insights | "Wenn Energie niedrig, dann..." |
| 18 | **Ziel-Vorlagen** | Goals | Schnellerer Start für neue User |
| 19 | **Daten-Import** | Infrastructure | Migration von anderen Tools |
| 20 | **Mehrere Lebens-Bereiche** | Goals | Arbeit/Privat/Gesundheit getrennt |
| 21 | **Widget-Dashboard** | UI | Personalisierte Startseite |
| 22 | **Sync (optional)** | Infrastructure | Geräte-übergreifend |
| 23 | **Dark/Light Theme Toggle** | UI | Accessibility |

---

## 2.2 Detaillierte Feature-Spezifikation (Core Features)

---

### Feature 1: Ziel erstellen & verwalten

#### Use Cases

| UC# | Beschreibung |
|-----|--------------|
| UC1.1 | Nutzer erstellt ein neues Ziel mit Titel und optionaler Beschreibung |
| UC1.2 | Nutzer ordnet Ziel einer Kategorie zu (Gesundheit, Karriere, Beziehungen, Persönlich, Finanzen, Lernen) |
| UC1.3 | Nutzer setzt optionalen Zeithorizont (ohne fixes Datum) |
| UC1.4 | Nutzer markiert Ziel als "aktiv" oder "pausiert" |
| UC1.5 | Nutzer archiviert oder löscht Ziel |
| UC1.6 | Nutzer bearbeitet bestehendes Ziel |

#### Edge Cases

| EC# | Situation | Handling |
|-----|-----------|----------|
| EC1.1 | Nutzer erstellt Ziel ohne Titel | Validation: Titel ist Pflichtfeld |
| EC1.2 | Nutzer hat 20+ aktive Ziele | Warnung: "Viele aktive Ziele können überwältigen" |
| EC1.3 | Nutzer löscht Ziel mit verknüpften Aufgaben | Aufgaben bleiben, verlieren aber Ziel-Referenz |
| EC1.4 | Nutzer archiviert Ziel versehentlich | Archiv einsehbar, Wiederherstellen möglich |

#### Typische Nutzer-Fehler

| Fehler | Prävention |
|--------|------------|
| Zu vage Ziele ("Glücklicher sein") | Tooltip: "Woran würdest du erkennen, dass du das Ziel erreicht hast?" |
| Zu viele Ziele gleichzeitig | Max. 5 aktive Ziele empfohlen (soft limit) |
| Nie Ziele überprüfen | Wochen-Reflexion fragt explizit nach Zielen |

#### UX-Prinzipien

- **Wenig Pflichtfelder**: Nur Titel ist erforderlich
- **Progressive Disclosure**: Erweiterte Optionen sind eingeklappt
- **Keine Deadline-Pressure**: Zeithorizont ist "ungefähr", kein fixes Datum
- **Kategorien sind vorgegeben**: Reduziert Entscheidungsparalyse

---

### Feature 2: Aufgaben erstellen & abhaken

#### Use Cases

| UC# | Beschreibung |
|-----|--------------|
| UC2.1 | Nutzer erstellt Aufgabe mit Titel |
| UC2.2 | Nutzer setzt optionales Datum (Heute, Morgen, Diese Woche, Später, Spezifisch) |
| UC2.3 | Nutzer verknüpft Aufgabe optional mit Ziel |
| UC2.4 | Nutzer markiert Aufgabe als erledigt |
| UC2.5 | Nutzer verschiebt Aufgabe auf anderen Tag |
| UC2.6 | Nutzer löscht Aufgabe |
| UC2.7 | Nutzer sieht überfällige Aufgaben |

#### Edge Cases

| EC# | Situation | Handling |
|-----|-----------|----------|
| EC2.1 | Aufgabe ohne Datum | Landet in "Inbox/Ungeplant" |
| EC2.2 | 50+ offene Aufgaben | UI zeigt Gruppierung, keine Warnung (Realität) |
| EC2.3 | Aufgabe wird erledigt, war aber überfällig | Trotzdem als erledigt zählen, kein Shame |
| EC2.4 | Nutzer will erledigte Aufgabe wieder öffnen | Möglich über "Erledigt"-Ansicht |

#### Typische Nutzer-Fehler

| Fehler | Prävention |
|--------|------------|
| Alles auf "Heute" setzen | Sanfte Empfehlung: "Du hast bereits 8 Aufgaben für heute" |
| Aufgaben nie erledigen | Wochen-Reflexion zeigt offene Aufgaben |
| Zu große Aufgaben | Keine erzwungene Zerlegung, aber Tooltip-Hinweis |

#### UX-Prinzipien

- **Single Tap Complete**: Checkbox prominent
- **Keine Prioritäten-Komplexität**: Keine P1/P2/P3 – stattdessen Zeitzuordnung
- **Keine Subtasks im MVP**: Reduktion von Komplexität
- **Überfällige sind neutral**: Kein rotes Schuld-Design

---

### Feature 3: Gewohnheiten definieren & tracken

#### Use Cases

| UC# | Beschreibung |
|-----|--------------|
| UC3.1 | Nutzer erstellt Gewohnheit mit Titel |
| UC3.2 | Nutzer wählt Frequenz (Täglich, X-mal pro Woche, Bestimmte Tage) |
| UC3.3 | Nutzer verknüpft Gewohnheit optional mit Ziel |
| UC3.4 | Nutzer markiert Gewohnheit für heute als erledigt |
| UC3.5 | Nutzer sieht aktuelle Streak |
| UC3.6 | Nutzer pausiert Gewohnheit temporär |
| UC3.7 | Nutzer beendet/archiviert Gewohnheit |

#### Edge Cases

| EC# | Situation | Handling |
|-----|-----------|----------|
| EC3.1 | Nutzer vergisst einen Tag | Streak bricht, aber keine Bestrafung – "Fang wieder an" |
| EC3.2 | Nutzer trackt nachträglich | Möglich für bis zu 7 Tage rückwirkend |
| EC3.3 | Gewohnheit "3x pro Woche" – wie tracken? | Woche zeigt 0/3, 1/3 etc. |
| EC3.4 | Nutzer hat 15 tägliche Gewohnheiten | Warnung: "Jede neue Gewohnheit braucht Energie" |

#### Typische Nutzer-Fehler

| Fehler | Prävention |
|--------|------------|
| Zu viele Gewohnheiten starten | Limit-Empfehlung: 3 neue gleichzeitig |
| Unrealistische Frequenz | Keine tägliche Frequenz für komplexe Gewohnheiten empfohlen |
| Streak-Obsession | Streak ist sichtbar, aber nicht zentral |

#### UX-Prinzipien

- **Habits ≠ Tasks**: Visuell unterschiedlich (z.B. Kreis statt Checkbox)
- **Streak ohne Shame**: Gebrochene Streaks werden nicht betont
- **Einfache Frequenz-Auswahl**: Vordefinierte Optionen, kein Custom-Cron
- **Trend > Perfektion**: Wochen-Erfolgsrate wichtiger als Streak

---

### Feature 4: Tages-Ansicht

#### Use Cases

| UC# | Beschreibung |
|-----|--------------|
| UC4.1 | Nutzer öffnet App und sieht heutige Aufgaben |
| UC4.2 | Nutzer sieht heutige Gewohnheiten |
| UC4.3 | Nutzer sieht Energie-Level (wenn eingetragen) |
| UC4.4 | Nutzer kann Energie-Check-In direkt machen |
| UC4.5 | Nutzer sieht überfällige Aufgaben oben |
| UC4.6 | Nutzer kann zwischen Tagen navigieren |

#### Edge Cases

| EC# | Situation | Handling |
|-----|-----------|----------|
| EC4.1 | Kein Eintrag für heute | Leerer Tag mit Einladung: "Was nimmst du dir heute vor?" |
| EC4.2 | Sehr viele Einträge | Aufgaben kollabierbar, Gewohnheiten kompakt |
| EC4.3 | Nutzer öffnet App um Mitternacht | "Heute" basiert auf lokaler Zeit |

#### UX-Prinzipien

- **Today First**: Standardansicht ist immer "Heute"
- **Morgen-Schwerpunkt**: Fokus auf Tag, nicht auf Backlog
- **Schneller Start**: Keine Konfiguration nötig, sofort nutzbar
- **Positive Framing**: "3 von 5 erledigt" statt "2 offen"

---

### Feature 5: Einfache Wochen-Reflexion

#### Use Cases

| UC# | Beschreibung |
|-----|--------------|
| UC5.1 | Nutzer wird am Sonntag/Montag erinnert (optional) |
| UC5.2 | Nutzer beantwortet 3-5 geführte Fragen |
| UC5.3 | Nutzer sieht Zusammenfassung der Woche (Aufgaben, Gewohnheiten) |
| UC5.4 | Nutzer kann freien Kommentar hinzufügen |
| UC5.5 | Nutzer speichert Reflexion |
| UC5.6 | Nutzer kann vergangene Reflexionen einsehen |

#### Reflexions-Fragen (MVP)

1. **Wie zufrieden bist du mit dieser Woche?** (1-5 Skala)
2. **Was lief gut?** (Freitext, optional)
3. **Was war herausfordernd?** (Freitext, optional)
4. **Worauf fokussierst du dich nächste Woche?** (Freitext, optional)
5. **Möchtest du ein Ziel anpassen?** (Ja/Nein → Link zu Zielen)

#### Edge Cases

| EC# | Situation | Handling |
|-----|-----------|----------|
| EC5.1 | Nutzer überspringt Woche | Kein Problem, nächste Woche wieder möglich |
| EC5.2 | Nutzer will Reflexion bearbeiten | Bis Mittwoch der Folgewoche möglich |
| EC5.3 | Keine Daten vorhanden | Reflexion trotzdem möglich (nur Fragen, keine Statistik) |

#### UX-Prinzipien

- **Kurz & Fokussiert**: Max. 5 Minuten
- **Vorgefertigte Struktur**: Keine leere Seite
- **Rückblick + Vorausschau**: Beides in einer Session
- **Keine Pflicht**: Überspringen ist okay

---

### Feature 6: Energie-Check-In

#### Use Cases

| UC# | Beschreibung |
|-----|--------------|
| UC6.1 | Nutzer loggt Energie-Level (1-5) |
| UC6.2 | Nutzer wählt optional Stimmung (Emoji-basiert) |
| UC6.3 | Nutzer kann kurze Notiz hinzufügen |
| UC6.4 | Nutzer sieht Energie-Verlauf der letzten Tage |

#### Energie-Skala

| Level | Beschreibung |
|-------|--------------|
| 1 | Erschöpft – brauche Ruhe |
| 2 | Niedrig – nur das Nötigste |
| 3 | Normal – durchschnittlicher Tag |
| 4 | Gut – motiviert und fokussiert |
| 5 | Ausgezeichnet – voller Energie |

#### Edge Cases

| EC# | Situation | Handling |
|-----|-----------|----------|
| EC6.1 | Mehrere Check-Ins am Tag | Nur letzter zählt (oder Durchschnitt) |
| EC6.2 | Nie Check-In gemacht | Feature bleibt verfügbar, keine Bestrafung |

#### UX-Prinzipien

- **Ultra-schnell**: Ein Tap für Level, fertig
- **Optional aber wertvoll**: Korrelation zu Produktivität wird sichtbar
- **Kein Tracking-Zwang**: Keine Erinnerungen im MVP

---

### Feature 7: Offline-Persistence

#### Use Cases

| UC# | Beschreibung |
|-----|--------------|
| UC7.1 | Alle Daten werden lokal gespeichert |
| UC7.2 | App funktioniert ohne Internetverbindung |
| UC7.3 | Daten bleiben nach Browser-Schließung erhalten |
| UC7.4 | Daten überleben (normales) Browser-Update |

#### Edge Cases

| EC# | Situation | Handling |
|-----|-----------|----------|
| EC7.1 | Browser-Storage wird geleert | Warnung beim Start, wenn Daten fehlen |
| EC7.2 | Private/Incognito Mode | Warnung: "Daten werden nicht gespeichert" |
| EC7.3 | Storage-Limit erreicht | Automatische Warnung bei 80% Auslastung |

#### Technische Entscheidung

- **IndexedDB** als primärer Speicher (größere Kapazität als localStorage)
- **Abstraktionsschicht** für zukünftige Sync-Fähigkeit
- **Versionierte Speicherung** für Schema-Migrationen

---

### Feature 8: Daten-Export

#### Use Cases

| UC# | Beschreibung |
|-----|--------------|
| UC8.1 | Nutzer exportiert alle Daten als JSON |
| UC8.2 | Nutzer exportiert alle Daten als CSV (strukturiert) |
| UC8.3 | Nutzer kann einzelne Bereiche exportieren |
| UC8.4 | Export enthält Zeitstempel und Schema-Version |

#### Edge Cases

| EC# | Situation | Handling |
|-----|-----------|----------|
| EC8.1 | Sehr viele Daten (Jahre) | Export kann dauern, Progress-Indikator |
| EC8.2 | Export schlägt fehl | Retry-Option, keine Datenverluste |

#### UX-Prinzipien

- **User Ownership**: Daten gehören dem Nutzer
- **Lesbare Formate**: JSON ist strukturiert, CSV für Spreadsheets
- **Einfacher Zugang**: In Settings, nicht versteckt

---

## 2.3 Feature-Abhängigkeiten

```
┌─────────────────────────────────────────────────────────┐
│                    INFRASTRUKTUR                        │
│  ┌─────────────────┐       ┌─────────────────┐          │
│  │ Offline-Persist │◄──────│  Daten-Export   │          │
│  └────────┬────────┘       └─────────────────┘          │
│           │                                             │
└───────────┼─────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│                    KERN-ENTITÄTEN                       │
│  ┌─────────┐   ┌─────────┐   ┌─────────────┐            │
│  │  Ziele  │   │ Aufgaben│   │ Gewohnheiten│            │
│  └────┬────┘   └────┬────┘   └──────┬──────┘            │
│       │             │               │                   │
└───────┼─────────────┼───────────────┼───────────────────┘
        │             │               │
        └─────────────┼───────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    AGGREGATION                          │
│  ┌─────────────┐          ┌─────────────────┐           │
│  │ Tages-View  │◄─────────│ Energie-Check   │           │
│  └──────┬──────┘          └─────────────────┘           │
│         │                                               │
└─────────┼───────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│                    REFLEXION                            │
│  ┌───────────────────┐                                  │
│  │ Wochen-Reflexion  │                                  │
│  └───────────────────┘                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 2.4 MVP-Definition (Minimum Viable Product)

### Was ist im MVP enthalten:

| Feature | Status | Begründung |
|---------|--------|------------|
| Ziel erstellen & verwalten | ✅ MVP | Kernversprechen |
| Aufgaben erstellen & abhaken | ✅ MVP | Grundnutzen |
| Gewohnheiten tracken | ✅ MVP | Differenzierungsmerkmal |
| Tages-Ansicht | ✅ MVP | Primärer Nutzungseinstieg |
| Wochen-Reflexion | ✅ MVP | Feedback-Loop |
| Energie-Check-In | ✅ MVP | Selbstwahrnehmung |
| Offline-Persistence | ✅ MVP | Kernversprechen |
| Daten-Export | ✅ MVP | User-Ownership |

### Was ist NICHT im MVP:

- Projekte (Ziel-Untergliederung)
- Ziel-Aufgaben-Verknüpfung (implizit vorhanden, UI kommt später)
- Statistiken/Insights
- Tags/Labels
- Quick-Add
- Wochen-Planung
- Sync

---

## 2.5 Akzeptanzkriterien für MVP

Das MVP ist "fertig", wenn:

1. **Nutzer kann** Ziel erstellen, bearbeiten, archivieren
2. **Nutzer kann** Aufgabe erstellen, erledigen, löschen, Datum zuweisen
3. **Nutzer kann** Gewohnheit erstellen, täglich tracken, Streak sehen
4. **Nutzer sieht** auf Startseite: heutige Aufgaben + Gewohnheiten
5. **Nutzer kann** Wochen-Reflexion durchführen (geführt)
6. **Nutzer kann** Energie-Level loggen
7. **Alle Daten** bleiben nach Browser-Neustart erhalten
8. **Nutzer kann** alle Daten als JSON exportieren
9. **App funktioniert** vollständig offline

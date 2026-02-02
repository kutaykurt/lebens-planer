# Implementation Plan: Life OS - Final Polish & Feature Expansion

This plan outlines the steps to transform the current Life OS dashboard into a comprehensive, fully functional ecosystem.

## Phase 1: Gamification Loop & Inventory (XP Shop)
Completes the "RPG" feeling by giving XP a real purpose.
- [ ] **Data Model**: Update `UserPreferences` in `lifeOSStore.ts` to include `inventory` (items bought) and `equippedItems`.
- [ ] **XP Shop Page (`/shop`)**:
    - [ ] Create a premium interface for buying virtual "Gear" (Avatars, Theme Presets, Title Badges).
    - [ ] Implementation of the `buyItem` and `equipItem` logic in the store.
- [ ] **Character Statistics**: Enhance the `CharacterCard` to show equipped items and their bonuses (e.g., "+10% Mental XP").

## Phase 2: Personal CRM (Social Intelligence)
Expands the "Social" skill category.
- [ ] **Contacts Store**: Add a new `contacts` array to the `LifeOSState`.
- [ ] **CRM Dashboard (`/social`)**: 
    - [ ] List of important contacts with a "Last Contacted" timer.
    - [ ] Quick-log for interactions (e.g., "Had coffee with X").
    - [ ] Automated reminders for birthdays or "Stay in Touch" intervals.

## Phase 3: Nutrition & Meal Planner (Physical Health)
Expands the "Physical" skill category.
- [ ] **Meal Planner View (`/nutrition`)**:
    - [ ] Weekly meal grid (Breakfast, Lunch, Dinner).
    - [ ] Global Recipe library (Personal externa Wiki for food).
- [ ] **Grocery List Integration**: Automatically add missing ingredients to the "Inbox" tasks as checkboxes.

## Phase 4: Ambient Focus & Soundboard
Enhances the "Deep Work" and "Focus Cockpit" experience.
- [ ] **Focus Player**: Create a persistent audio player component in the `FocusCockpit`.
- [ ] **Sound Presets**: Lo-Fi Beats, Binaural Beats, Forest/Rain, White Noise.
- [ ] **Integration**: Timer-linked audio (starts when Pomodoro starts).

## Phase 5: Smart Onboarding & Polish
Ensures the app is "ready to use" for anyone.
- [ ] **Setup Wizard**: A step-by-step walkthrough for new users (Set Name -> Initial Goals -> Choose Habits).
- [ ] **Empty States**: Ensure every sub-page (Wiki, Vault, CRM) has a premium "Get Started" state.
- [ ] **Final UX Sweep**: Consistent transitions, keyboard shortcuts (`Cmd/Ctrl + K` for Quick Add), and haptic feedback simulations.

---

## Technical Considerations
1. **Migration**: Ensure `indexedDBStorage` handles the new data arrays without losing existing user data.
2. **Icons**: Use `lucide-react` consistently for all new modules.
3. **Responsive**: Every new page must follow the "Mobile First" approach introduced in previous updates.

import { create } from 'zustand';

interface UIState {
    isQuickAddOpen: boolean;
    openQuickAdd: () => void;
    closeQuickAdd: () => void;

    // Future modals can go here
    activeModal: string | null;
    openModal: (id: string) => void;
    closeModal: () => void;

    // Celebration
    celebration: { type: 'achievement' | 'level_up'; data: any } | null;
    triggerCelebration: (type: 'achievement' | 'level_up', data: any) => void;
    clearCelebration: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isQuickAddOpen: false,
    openQuickAdd: () => set({ isQuickAddOpen: true }),
    closeQuickAdd: () => set({ isQuickAddOpen: false }),

    activeModal: null,
    openModal: (id) => set({ activeModal: id }),
    closeModal: () => set({ activeModal: null }),

    celebration: null,
    triggerCelebration: (type, data) => set({ celebration: { type, data } }),
    clearCelebration: () => set({ celebration: null }),
}));

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckSquare, Zap, Repeat, FileText, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUIStore, useLifeOSStore } from '@/stores';
import { cn } from '@/lib/utils';
import { getToday } from '@/lib/utils';

export function FloatingActionMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const openQuickAdd = useUIStore((s) => s.openQuickAdd);

    // Quick actions
    const logEnergy = useLifeOSStore((s) => s.logEnergy);
    const today = getToday();

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleAction = (action: string) => {
        setIsOpen(false);
        switch (action) {
            case 'task':
                openQuickAdd();
                break;
            case 'habit':
                router.push('/habits'); // Could open a habit dialog later
                break;
            case 'note':
                // Maybe focus daily log? Or just route for now
                router.push('/today');
                break;
            case 'energy':
                // Route to today where energy scanner is usually at top, or maybe trigger scroll?
                // Ideally open a modal. But for now route.
                router.push('/today');
                break;
        }
    };

    const actions = [
        { id: 'energy', icon: Zap, label: 'Energie', color: 'bg-amber-500', delay: 0.05 },
        { id: 'note', icon: FileText, label: 'Notiz', color: 'bg-blue-500', delay: 0.1 },
        { id: 'habit', icon: Repeat, label: 'Habit', color: 'bg-emerald-500', delay: 0.15 },
        { id: 'task', icon: CheckSquare, label: 'Task', color: 'bg-[var(--accent-primary)]', delay: 0.2 },
    ];

    return (
        <div className="fixed bottom-24 right-5 z-40 flex flex-col items-end gap-3 pointer-events-none">

            <AnimatePresence>
                {isOpen && (
                    <div className="flex flex-col items-end gap-3 pointer-events-auto pb-3">
                        {actions.map((action) => (
                            <motion.button
                                key={action.id}
                                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                                transition={{ duration: 0.2, delay: action.delay }}
                                onClick={() => handleAction(action.id)}
                                className="flex items-center gap-3 group"
                            >
                                <span className={cn(
                                    "px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg backdrop-blur-md bg-white/80 dark:bg-black/60 text-[var(--foreground)] opacity-0 group-hover:opacity-100 transition-opacity",
                                    "hidden sm:block" // Hide label on mobile to keep cleaner or show if wanted
                                )}>
                                    {action.label}
                                </span>
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/20 hover:scale-110 active:scale-95 transition-all",
                                    action.color
                                )}>
                                    <action.icon className="w-6 h-6" />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <button
                onClick={toggleOpen}
                className={cn(
                    "pointer-events-auto w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-[var(--accent-primary)]/30 transition-all duration-300 hover:scale-105 active:scale-95",
                    "bg-[var(--accent-primary)] text-white",
                    isOpen ? "rotate-45 bg-red-500 shadow-red-500/30" : ""
                )}
            >
                <Plus className="w-8 h-8" />
            </button>

            {/* Backdrop for closing */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1] pointer-events-auto"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}

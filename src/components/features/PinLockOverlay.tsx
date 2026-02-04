'use client';

import { useState, useEffect } from 'react';
import { Lock, Unlock, Delete, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { useLifeOSStore } from '@/stores';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export function PinLockOverlay() {
    const preferences = useLifeOSStore((s) => s.preferences);
    const isLocked = useLifeOSStore((s) => s.isLocked);
    const unlockApp = useLifeOSStore((s) => s.unlockApp);
    const lockApp = useLifeOSStore((s) => s.lockApp);

    const [input, setInput] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    // Initial Lock Check
    useEffect(() => {
        // If security enabled and we just loaded, lock it!
        // This effect runs on mount.
        if (preferences.security?.enabled && !isLocked) {
            // Logic: If user refreshed, we want to lock?
            // Since isLocked is volatile (false on load), we need to trigger lock if enabled.
            // BUT: We need to avoid locking if we just unlocked.
            // Actually, volatile means it resets on refresh. So we should lock on mount if enabled.
            lockApp();
        }
    }, []); // Run once on mount

    // However, the above logic causes a lock even if we navigate clientside?
    // No, PinLockOverlay is likely in the RootLayout, so it mounts once.

    const handleInput = (num: string) => {
        if (input.length < 4) {
            const refined = input + num;
            setInput(refined);
            setError(false);

            if (refined.length === 4) {
                verify(refined);
            }
        }
    };

    const handleDelete = () => {
        setInput(prev => prev.slice(0, -1));
        setError(false);
    };

    const verify = (code: string) => {
        if (code === preferences.security?.pin) {
            setSuccess(true);
            setTimeout(() => {
                unlockApp();
                setInput('');
                setSuccess(false);
            }, 500);
        } else {
            setError(true);
            setTimeout(() => {
                setInput('');
                setError(false);
            }, 400);
        }
    };

    if (!isLocked || !preferences.security?.enabled) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                className="fixed inset-0 z-[100] bg-[var(--background)]/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
            >
                <div className="w-full max-w-xs flex flex-col items-center gap-8">

                    {/* Icon */}
                    <div className="relative mb-4">
                        <div className={cn(
                            "w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500",
                            success ? "bg-emerald-500 shadow-emerald-500/50" : error ? "bg-red-500 shadow-red-500/50" : "bg-[var(--background-elevated)] shadow-2xl"
                        )}>
                            {success ? (
                                <Unlock className="w-10 h-10 text-white animate-bounce" />
                            ) : error ? (
                                <Lock className="w-10 h-10 text-white animate-shake" />
                            ) : (
                                <Lock className="w-10 h-10 text-[var(--accent-primary)]" />
                            )}
                        </div>
                    </div>

                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Lebensplaner gesperrt</h2>
                        <p className="text-[var(--foreground-muted)]">Bitte PIN eingeben</p>
                    </div>

                    {/* Dots */}
                    <div className="flex gap-4 mb-4">
                        {[0, 1, 2, 3].map(i => (
                            <div
                                key={i}
                                className={cn(
                                    "w-4 h-4 rounded-full transition-all duration-300",
                                    i < input.length
                                        ? success ? "bg-emerald-500 scale-110" : error ? "bg-red-500" : "bg-[var(--foreground)] scale-100"
                                        : "bg-[var(--background-elevated)] border border-[var(--border)]"
                                )}
                            />
                        ))}
                    </div>

                    {/* Numpad */}
                    <div className="grid grid-cols-3 gap-6 w-full">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <button
                                key={num}
                                onClick={() => handleInput(num.toString())}
                                className="w-16 h-16 rounded-full text-2xl font-bold bg-[var(--background-surface)] hover:bg-[var(--background-elevated)] active:scale-95 transition-all outline-none border border-[var(--border)] flex items-center justify-center"
                            >
                                {num}
                            </button>
                        ))}
                        <div />
                        <button
                            onClick={() => handleInput('0')}
                            className="w-16 h-16 rounded-full text-2xl font-bold bg-[var(--background-surface)] hover:bg-[var(--background-elevated)] active:scale-95 transition-all outline-none border border-[var(--border)] flex items-center justify-center"
                        >
                            0
                        </button>
                        <button
                            onClick={handleDelete}
                            className="w-16 h-16 rounded-full text-xl flex items-center justify-center text-red-500 hover:bg-red-500/10 active:scale-95 transition-all outline-none"
                        >
                            <Delete className="w-6 h-6" />
                        </button>
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
    );
}

'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useUIStore } from '@/stores';
import { Trophy, ArrowUpCircle } from 'lucide-react';
import { Card, Button } from '@/components/ui';

export function CelebrationOverlay() {
    const celebration = useUIStore((s) => s.celebration);
    const clearCelebration = useUIStore((s) => s.clearCelebration);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (celebration) {
            // Trigger Confetti
            if (celebration.type === 'achievement' || celebration.type === 'level_up') {
                const duration = 3000;
                const end = Date.now() + duration;

                const frame = () => {
                    confetti({
                        particleCount: 5,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: ['#6366f1', '#ec4899', '#ffb703']
                    });
                    confetti({
                        particleCount: 5,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: ['#6366f1', '#ec4899', '#ffb703']
                    });

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                };
                frame();

                // Auto close after 5s
                const timer = setTimeout(() => {
                    clearCelebration();
                }, 5000);

                return () => clearTimeout(timer);
            }
        }
    }, [celebration, clearCelebration]);

    if (!celebration) return null;

    const { type, data } = celebration;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <AnimatePresence>
                <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 50 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-full max-w-sm"
                >
                    <Card variant="glass" className="relative overflow-hidden border-2 border-[var(--accent-primary)] shadow-2xl shadow-[var(--accent-primary)]/30">
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />

                        <div className="p-8 text-center flex flex-col items-center relative z-10">

                            {type === 'achievement' && (
                                <>
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 mb-6 flex items-center justify-center shadow-lg animate-bounce-slow">
                                        <span className="text-5xl">{data.icon}</span>
                                    </div>

                                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--accent-primary)] mb-2">
                                        Achievement Unlocked!
                                    </h3>
                                    <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2 tracking-tight">
                                        {data.title}
                                    </h2>
                                    <p className="text-[var(--foreground-secondary)] mb-6">
                                        {data.description}
                                    </p>

                                    <div className="px-4 py-2 bg-[var(--background-elevated)] rounded-full border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] font-bold text-sm flex items-center gap-2">
                                        <Trophy className="w-4 h-4" />
                                        +{data.xpReward} XP
                                    </div>
                                </>
                            )}

                            {type === 'level_up' && (
                                <>
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 flex items-center justify-center shadow-lg animate-pulse-slow">
                                        <ArrowUpCircle className="w-12 h-12 text-white" />
                                    </div>

                                    <h3 className="text-xs font-black uppercase tracking-widest text-purple-500 mb-2">
                                        Level Up!
                                    </h3>
                                    <h2 className="text-4xl font-black text-[var(--foreground)] mb-2 tracking-tight">
                                        Level {data.level}
                                    </h2>
                                    <p className="text-[var(--foreground-secondary)] mb-6">
                                        Du wirst immer besser!
                                    </p>

                                    <div className="w-full h-2 bg-[var(--background-subtle)] rounded-full overflow-hidden mb-2">
                                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-full animate-shimmer" />
                                    </div>
                                </>
                            )}

                            <Button
                                className="mt-8 w-full bg-gradient-to-r from-indigo-500 to-purple-600 border-none hover:opacity-90 transition-opacity"
                                onClick={clearCelebration}
                                variant="primary"
                            >
                                Nice! 🎉
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

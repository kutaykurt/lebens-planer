'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Play, Pause, RotateCcw, Maximize2, Minimize2,
    Volume2, VolumeX, Music, Wind, Coffee, CloudRain,
    Sparkles, X
} from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const MODES: Record<TimerMode, { label: string; time: number; color: string }> = {
    work: { label: 'Fokus', time: 25 * 60, color: 'from-rose-500 to-orange-500' },
    shortBreak: { label: 'Pause', time: 5 * 60, color: 'from-emerald-400 to-teal-500' },
    longBreak: { label: 'Lange Pause', time: 15 * 60, color: 'from-blue-400 to-indigo-500' },
};

export function FocusCockpit({ compact = false }: { compact?: boolean }) {
    const [mode, setMode] = useState<TimerMode>('work');
    const [timeLeft, setTimeLeft] = useState(MODES.work.time);
    const [isActive, setIsActive] = useState(false);
    const [isZenMode, setIsZenMode] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [activeSound, setActiveSound] = useState<'rain' | 'lofi' | 'nature' | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            // Play sound?
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(MODES[mode].time);
    };

    const switchMode = (newMode: TimerMode) => {
        setMode(newMode);
        setTimeLeft(MODES[newMode].time);
        setIsActive(false);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (compact) {
        return (
            <Card variant="default" padding="sm" className="h-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md", isActive ? "animate-pulse bg-red-500" : "bg-indigo-500")}>
                        {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider">{MODES[mode].label}</p>
                        <p className="text-lg font-black text-[var(--foreground)] leading-none tabular-nums">{formatTime(timeLeft)}</p>
                    </div>
                </div>
                <Button size="sm" variant="ghost" onClick={toggleTimer} className="h-8 w-8 p-0 rounded-full">
                    {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
            </Card>
        );
    }

    const progress = (1 - timeLeft / MODES[mode].time) * 100;

    return (
        <>
            <Card variant="elevated" className="mb-6 overflow-hidden relative group">
                {/* Background Decor */}
                <div className={cn(
                    "absolute inset-0 opacity-5 transition-colors duration-1000 bg-gradient-to-br",
                    MODES[mode].color
                )} />

                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[var(--background-elevated)] flex items-center justify-center">
                                <RotateCcw className="w-5 h-5 text-[var(--foreground-muted)]" />
                            </div>
                            <div>
                                <h2 className="font-bold text-[var(--foreground)]">Deep Work</h2>
                                <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-widest font-bold">
                                    {MODES[mode].label}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsZenMode(true)}
                                className="text-[var(--foreground-muted)] hover:text-[var(--accent-primary)]"
                            >
                                <Maximize2 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        {/* Circular Timer Visual */}
                        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                            <svg className="w-full h-full -rotate-90">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    className="text-[var(--background-elevated)]"
                                />
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    strokeDasharray={552.92}
                                    strokeDashoffset={552.92 * (1 - progress / 100)}
                                    strokeLinecap="round"
                                    className={cn(
                                        "transition-all duration-1000 text-[var(--accent-primary)]",
                                        mode === 'work' ? "text-rose-500" : "text-emerald-500"
                                    )}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-4xl font-black text-[var(--foreground)] tracking-tighter">
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4 mb-8">
                            <Button
                                variant="secondary"
                                size="lg"
                                className="rounded-2xl w-14 h-14"
                                onClick={resetTimer}
                            >
                                <RotateCcw className="w-5 h-5" />
                            </Button>

                            <Button
                                size="lg"
                                className={cn(
                                    "rounded-2xl w-20 h-20 shadow-xl transition-all duration-300 transform active:scale-95",
                                    isActive ? "bg-[var(--background-elevated)] text-[var(--foreground)]" : "bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6]"
                                )}
                                onClick={toggleTimer}
                            >
                                {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                            </Button>

                            <div className="flex flex-col gap-2">
                                {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => switchMode(m)}
                                        className={cn(
                                            "w-3 h-3 rounded-full transition-all duration-300",
                                            mode === m ? "scale-125 opacity-100 bg-[var(--accent-primary)]" : "opacity-30 bg-[var(--foreground-muted)] hover:opacity-100"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Ambient Sounds */}
                        <div className="w-full flex justify-between items-center px-4 py-3 rounded-2xl bg-[var(--background-elevated)]">
                            <Music className="w-4 h-4 text-[var(--foreground-muted)]" />
                            <div className="flex gap-4">
                                <button onClick={() => setActiveSound(activeSound === 'rain' ? null : 'rain')} className={cn("transition-colors", activeSound === 'rain' ? "text-blue-500" : "text-[var(--foreground-muted)]")}>
                                    <CloudRain className="w-5 h-5" />
                                </button>
                                <button onClick={() => setActiveSound(activeSound === 'lofi' ? null : 'lofi')} className={cn("transition-colors", activeSound === 'lofi' ? "text-amber-500" : "text-[var(--foreground-muted)]")}>
                                    <Coffee className="w-5 h-5" />
                                </button>
                                <button onClick={() => setActiveSound(activeSound === 'nature' ? null : 'nature')} className={cn("transition-colors", activeSound === 'nature' ? "text-emerald-500" : "text-[var(--foreground-muted)]")}>
                                    <Wind className="w-5 h-5" />
                                </button>
                            </div>
                            <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-[var(--foreground-muted)]">
                                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Zen Mode Overlay */}
            {isZenMode && (
                <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
                    {/* Animated Stars Background */}
                    <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
                        <div className="stars" />
                    </div>

                    <button
                        onClick={() => setIsZenMode(false)}
                        className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors p-2"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="relative text-center space-y-12">
                        <div className="space-y-4">
                            <p className="text-neutral-500 uppercase tracking-[0.5em] text-sm animate-pulse">
                                {MODES[mode].label}
                            </p>
                            <h1 className="text-[12rem] font-black text-white leading-none tracking-tighter">
                                {formatTime(timeLeft)}
                            </h1>
                        </div>

                        <div className="flex items-center justify-center gap-12">
                            <button onClick={resetTimer} className="text-neutral-600 hover:text-white transition-all hover:scale-110">
                                <RotateCcw className="w-10 h-10" />
                            </button>
                            <button
                                onClick={toggleTimer}
                                className="w-32 h-32 rounded-full border-2 border-neutral-700 hover:border-white text-white flex items-center justify-center transition-all hover:scale-110"
                            >
                                {isActive ? <Pause className="w-12 h-12 fill-current" /> : <Play className="w-12 h-12 fill-current ml-2" />}
                            </button>
                            <div className="flex flex-col gap-4">
                                {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => switchMode(m)}
                                        className={cn(
                                            "w-2 h-2 rounded-full transition-all duration-300",
                                            mode === m ? "scale-150 bg-white" : "bg-neutral-800"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-8 justify-center text-neutral-500">
                            <CloudRain className={cn("w-6 h-6", activeSound === 'rain' && "text-blue-500")} />
                            <Coffee className={cn("w-6 h-6", activeSound === 'lofi' && "text-amber-500")} />
                            <Wind className={cn("w-6 h-6", activeSound === 'nature' && "text-emerald-400")} />
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .stars {
                    width: 1px;
                    height: 1px;
                    background: transparent;
                    box-shadow: 1744px 122px #FFF , 134px 1321px #FFF , 92px 859px #FFF;
                    animation: animStar 50s linear infinite;
                }
                @keyframes animStar {
                    from { transform: translateY(0px) }
                    to { transform: translateY(-2000px) }
                }
                @keyframes float {
                    0% { transform: translateY(0px) }
                    50% { transform: translateY(-10px) }
                    100% { transform: translateY(0px) }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </>
    );
}

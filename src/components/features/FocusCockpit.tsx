'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Play, Pause, RotateCcw, Maximize2, X, Zap,
    Target, Coffee, Clock
} from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const MODES: Record<TimerMode, { label: string; time: number; color: string; icon: any }> = {
    work: { label: 'Fokus', time: 25 * 60, color: 'from-rose-500 to-orange-500', icon: Target },
    shortBreak: { label: 'Pause', time: 5 * 60, color: 'from-emerald-400 to-teal-500', icon: Coffee },
    longBreak: { label: 'Lange Pause', time: 15 * 60, color: 'from-blue-400 to-indigo-500', icon: Clock },
};

export function FocusCockpit({ compact = false }: { compact?: boolean }) {
    const [mode, setMode] = useState<TimerMode>('work');
    const [timeLeft, setTimeLeft] = useState(MODES.work.time);
    const [isActive, setIsActive] = useState(false);
    const [isZenMode, setIsZenMode] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
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
            <Card variant="elevated" className="overflow-hidden relative group rounded-[1.5rem] border-none shadow-2xl shadow-indigo-500/5 self-start w-full">
                {/* Background Decor */}
                <div className={cn(
                    "absolute inset-0 opacity-5 transition-colors duration-1000 bg-gradient-to-br",
                    MODES[mode].color
                )} />

                <div className="relative p-3 flex items-center justify-between gap-5">
                    {/* Left: Info */}
                    <div className="flex items-center gap-2.5 min-w-[100px]">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                            <Zap className="w-4 h-4 fill-current" />
                        </div>
                        <div>
                            <h2 className="text-[13px] font-black text-[var(--foreground)] tracking-tight italic leading-none mb-1">Fokus-Modus</h2>
                            <p className="text-[7px] text-[var(--foreground-muted)] uppercase tracking-[0.2em] font-black leading-none px-1 py-0.5 bg-indigo-500/5 rounded shadow-sm">
                                {MODES[mode].label}
                            </p>
                        </div>
                    </div>

                    {/* Middle: Timer - Horizontal Layout */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90">
                                <circle
                                    cx="40"
                                    cy="40"
                                    r="34"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    className="text-[var(--background-elevated)]"
                                />
                                <circle
                                    cx="40"
                                    cy="40"
                                    r="34"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    strokeDasharray={213.63}
                                    strokeDashoffset={213.63 * (1 - progress / 100)}
                                    strokeLinecap="round"
                                    className={cn(
                                        "transition-all duration-1000",
                                        mode === 'work' ? "text-indigo-500" : "text-emerald-500"
                                    )}
                                />
                            </svg>
                            <span className="absolute text-sm font-black text-[var(--foreground)] tabular-nums italic">
                                {formatTime(timeLeft)}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1">
                            {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => {
                                const Icon = MODES[m].icon;
                                return (
                                    <button
                                        key={m}
                                        onClick={() => switchMode(m)}
                                        className={cn(
                                            "w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300",
                                            mode === m
                                                ? "bg-indigo-500 text-white shadow-glow-indigo"
                                                : "bg-white/5 text-[var(--foreground-muted)] hover:bg-white/10"
                                        )}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-lg w-9 h-9 bg-[var(--background-elevated)] hover:bg-[var(--background-subtle)] border-none p-0"
                            onClick={resetTimer}
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>

                        <Button
                            size="lg"
                            onClick={toggleTimer}
                            className={cn(
                                "rounded-xl w-14 h-11 shadow-lg transition-all duration-300 transform active:scale-95 border-none",
                                isActive
                                    ? "bg-rose-500 text-white shadow-glow-error"
                                    : "bg-indigo-500 text-white shadow-glow-indigo"
                            )}
                        >
                            {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsZenMode(true)}
                            className="w-8 h-8 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5 ml-2"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Zen Mode Overlay */}
            {isZenMode && (
                <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
                    <button
                        onClick={() => setIsZenMode(false)}
                        className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors p-4"
                    >
                        <X className="w-10 h-10" />
                    </button>

                    <div className="relative text-center space-y-16">
                        <div className="space-y-6">
                            <p className="text-neutral-500 uppercase tracking-[0.8em] text-sm animate-pulse font-black">
                                {MODES[mode].label}
                            </p>
                            <h1 className="text-[14rem] font-black text-white leading-none tracking-tighter tabular-nums drop-shadow-2xl">
                                {formatTime(timeLeft)}
                            </h1>
                        </div>

                        <div className="flex items-center justify-center gap-16">
                            <button onClick={resetTimer} className="text-neutral-600 hover:text-white transition-all hover:scale-110">
                                <RotateCcw className="w-12 h-12" />
                            </button>
                            <button
                                onClick={toggleTimer}
                                className="w-40 h-40 rounded-full border-4 border-neutral-800 hover:border-white text-white flex items-center justify-center transition-all hover:scale-110 bg-white/5 backdrop-blur-md"
                            >
                                {isActive ? <Pause className="w-16 h-16 fill-current" /> : <Play className="w-16 h-16 fill-current ml-2" />}
                            </button>
                            <div className="flex flex-col gap-6">
                                {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => switchMode(m)}
                                        className={cn(
                                            "w-3 h-3 rounded-full transition-all duration-300",
                                            mode === m ? "scale-150 bg-white shadow-[0_0_20px_white]" : "bg-neutral-800"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

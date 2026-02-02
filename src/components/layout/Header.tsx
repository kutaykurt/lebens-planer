'use client';

import Link from 'next/link';
import { Settings, Plus, Sparkles, Terminal, Activity, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui';
import { useLifeOSStore } from '@/stores';
import { cn } from '@/lib/utils';

interface HeaderProps {
    title?: string;
    subtitle?: string;
    showQuickAdd?: boolean;
    onQuickAdd?: () => void;
}

export function Header({ title, subtitle, showQuickAdd = true, onQuickAdd }: HeaderProps) {
    const xp = useLifeOSStore((s) => s.preferences.xp) || 0;
    const XP_PER_LEVEL = 500;
    const level = Math.floor(xp / XP_PER_LEVEL) + 1;
    const progress = ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;

    return (
        <header suppressHydrationWarning className="sticky top-0 z-50 safe-top no-print">
            {/* Premium light silver glass background */}
            <div suppressHydrationWarning className="absolute inset-0 bg-[#ececec]/90 backdrop-blur-2xl border-b border-zinc-300 shadow-lg shadow-black/5" />

            <div suppressHydrationWarning className="relative flex items-center justify-between h-20 px-6 max-w-7xl mx-auto">
                {/* Left: Branding */}
                <Link href="/today" className="flex items-center gap-4 group">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center shadow-xl shadow-black/40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-white/5">
                            <Terminal className="w-6 h-6 text-white text-glow" />
                        </div>
                        <div className="absolute -inset-1 bg-white/5 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    <div className="flex flex-col">
                        <h1 className="text-xl font-black text-[#1e3a8a] tracking-tighter uppercase italic leading-none">
                            Life-<span className="text-[#3b82f6]">OS</span>
                        </h1>
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#1e3a8a]/60 mt-0.5">Quantum Interface</p>
                    </div>
                </Link>

                {/* Right: Actions & XP */}
                <div className="flex items-center gap-4">
                    {/* Level Meta Display */}
                    <Link href="/profile" className="group/level">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/5 hover:bg-black/10 border border-zinc-300 transition-all duration-300 relative overflow-hidden">
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1e3a8a]">Lvl {level}</span>
                                    <Sparkles className="w-3 h-3 text-amber-600 animate-pulse" />
                                </div>
                                <div className="w-16 h-1.5 bg-black/10 rounded-full mt-1 overflow-hidden shadow-inner border border-zinc-300">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#3b82f6] to-[#1e3a8a] transition-all duration-1000"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {showQuickAdd && (
                        <Button
                            onClick={onQuickAdd}
                            className="bg-black text-white hover:bg-zinc-800 rounded-2xl h-12 px-6 shadow-xl shadow-black/10 border-none group/add transition-all"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                            <span className="hidden sm:inline font-black uppercase tracking-widest text-[10px] ml-2">Initialisieren</span>
                        </Button>
                    )}

                    <Link href="/settings">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-12 h-12 rounded-2xl bg-black/5 border border-zinc-300 text-[#1e3a8a] hover:bg-black/10 hover:rotate-90 transition-all duration-500"
                        >
                            <Settings className="w-6 h-6" />
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}

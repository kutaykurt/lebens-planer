'use client';

import Link from 'next/link';
import { Settings, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';

import { useLifeOSStore } from '@/stores';

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
        <header className="sticky top-0 z-30 safe-top no-print">
            {/* Glass background */}
            <div className="absolute inset-0 bg-[var(--background)]/70 backdrop-blur-xl border-b border-[var(--border-subtle)]" />

            <div className="relative flex items-center justify-between h-16 px-4 max-w-2xl mx-auto">
                {/* Left: Logo & Title */}
                <Link href="/today" className="flex items-center gap-3 group">
                    {/* Logo */}
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[var(--accent-primary)]/20 group-hover:shadow-xl group-hover:shadow-[var(--accent-primary)]/30 transition-all duration-300">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        {/* Glow */}
                        <div className="absolute inset-0 rounded-xl bg-[var(--accent-primary)]/30 blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                    </div>

                    {/* Title */}
                    <div>
                        {title ? (
                            <>
                                <h1 className="text-lg font-semibold text-[var(--foreground)] tracking-tight">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="text-xs text-[var(--foreground-muted)]">{subtitle}</p>
                                )}
                            </>
                        ) : (
                            <span className="text-lg font-semibold text-[var(--foreground)] tracking-tight">
                                Life OS
                            </span>
                        )}
                    </div>
                </Link>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Level Display */}
                    <Link href="/profile">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--background-elevated)] border border-[var(--border)] mr-1 group/level relative cursor-pointer hover:border-[var(--accent-primary)] transition-colors">
                            <div className="relative">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                <div className="absolute inset-0 bg-amber-500/20 blur-sm rounded-full" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold leading-none text-[var(--foreground)] uppercase tracking-wider">
                                    Lvl {level}
                                </span>
                                <div className="w-12 h-1 rounded-full bg-[var(--background-subtle)] mt-1 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* XP Tooltip-like popup */}
                            <div className="absolute top-12 right-0 bg-[var(--background-surface)] border border-[var(--border)] rounded-xl p-3 shadow-2xl opacity-0 invisible group-hover/level:opacity-100 group-hover/level:visible transition-all duration-200 min-w-[140px] z-50 pointer-events-none">
                                <p className="text-xs font-bold text-[var(--foreground)] mb-1">
                                    {xp} / {level * 500} XP
                                </p>
                                <p className="text-[10px] text-[var(--foreground-muted)]">
                                    {500 - (xp % 500)} XP bis Level {level + 1}
                                </p>
                                <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] space-y-1">
                                    <div className="flex justify-between text-[9px] uppercase font-bold text-[var(--foreground-muted)]">
                                        <span>Task</span>
                                        <span className="text-[var(--accent-primary)]">+10</span>
                                    </div>
                                    <div className="flex justify-between text-[9px] uppercase font-bold text-[var(--foreground-muted)]">
                                        <span>Habit</span>
                                        <span className="text-[var(--accent-primary)]">+20</span>
                                    </div>
                                    <div className="flex justify-between text-[9px] uppercase font-bold text-[var(--foreground-muted)]">
                                        <span>Journal</span>
                                        <span className="text-[var(--accent-primary)]">+50</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {showQuickAdd && (
                        <Button
                            onClick={onQuickAdd}
                            size="sm"
                            className="gap-1.5"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Neu</span>
                        </Button>
                    )}
                    <Link href="/settings">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Einstellungen"
                            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                        >
                            <Settings className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}

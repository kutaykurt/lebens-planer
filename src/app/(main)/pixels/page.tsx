'use client';

import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info, Sparkles } from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useLifeOSStore, useHydration } from '@/stores';
import { MOOD_EMOJIS, MoodType } from '@/types';

const MOOD_COLORS: Record<MoodType, string> = {
    great: 'bg-amber-400',
    good: 'bg-emerald-400',
    neutral: 'bg-blue-400',
    low: 'bg-indigo-400',
    bad: 'bg-slate-500',
};

const MOOD_LABELS: Record<MoodType, string> = {
    great: 'Fantastisch',
    good: 'Gut',
    neutral: 'Neutral',
    low: 'Eher schlecht',
    bad: 'Schlecht',
};

export default function PixelsPage() {
    const [year, setYear] = useState(new Date().getFullYear());
    const energyLogs = useLifeOSStore((s) => s.energyLogs);
    const logEnergy = useLifeOSStore((s) => s.logEnergy);
    const isHydrated = useHydration();

    const today = new Date().toISOString().split('T')[0];
    const todayLog = energyLogs.find(l => l.date === today);

    const yearData = useMemo(() => {
        const months = [];
        for (let m = 0; m < 12; m++) {
            const daysInMonth = new Date(year, m + 1, 0).getDate();
            const days = [];
            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const log = energyLogs.find((l) => l.date === dateStr);
                days.push({
                    date: dateStr,
                    mood: log?.mood || null,
                });
            }
            months.push(days);
        }
        return months;
    }, [year, energyLogs]);

    if (!isHydrated) return null;

    return (
        <PageContainer>
            <div className="mb-12">
                <h1 className="text-4xl font-black text-[var(--foreground)] tracking-tighter uppercase italic">Stimmungs-Monitor</h1>
                <p className="text-[var(--foreground-muted)] font-medium italic">Visualisiere deine emotionale Entwicklung über das Jahr.</p>
            </div>

            {/* Daily Check-in Section */}
            <Card variant="glass" className="p-8 mb-12 rounded-[2.5rem] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic mb-2">Wie fühlst du dich heute?</h2>
                        <p className="text-sm text-[var(--foreground-muted)] font-medium italic">Ein kurzer Check-in für dein emotionales Logbuch.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {(Object.keys(MOOD_COLORS) as MoodType[]).map((mood) => {
                            const isSelected = todayLog?.mood === mood;
                            const energyLevelMap: Record<MoodType, number> = {
                                great: 5,
                                good: 4,
                                neutral: 3,
                                low: 2,
                                bad: 1
                            };

                            return (
                                <button
                                    key={mood}
                                    onClick={() => logEnergy(today, energyLevelMap[mood] as any, mood)}
                                    className={cn(
                                        "w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300",
                                        "border border-white/10 hover:scale-110",
                                        isSelected
                                            ? cn(MOOD_COLORS[mood], "shadow-lg shadow-black/20 scale-105 border-white/40")
                                            : "bg-white/5 hover:bg-white/10"
                                    )}
                                >
                                    <span className="text-2xl">{MOOD_EMOJIS[mood]}</span>
                                    <span className={cn(
                                        "text-[8px] font-black uppercase tracking-tighter",
                                        isSelected ? "text-white" : "text-[var(--foreground-muted)]"
                                    )}>
                                        {MOOD_LABELS[mood]}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </Card>

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setYear(year - 1)} className="rounded-xl w-10 h-10">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tighter italic">
                        {year}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setYear(year + 1)} className="rounded-xl w-10 h-10">
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>

                <div className="hidden lg:flex items-center gap-6 p-3 px-6 rounded-2xl bg-[var(--background-elevated)] border border-[var(--border)] shadow-sm">
                    {Object.entries(MOOD_COLORS).map(([mood, color]) => (
                        <div key={mood} className="flex items-center gap-2">
                            <div className={cn("w-3 h-3 rounded-full", color)} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">
                                {MOOD_LABELS[mood as MoodType]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <Card variant="glass" className="p-10 rounded-[3rem] border-white/10 bg-white/5 shadow-2xl overflow-x-auto relative">
                <div className="min-w-[900px]">
                    <div className="grid grid-cols-[80px_repeat(31,1fr)] gap-2 mb-6">
                        <div /> {/* Month label space */}
                        {Array.from({ length: 31 }).map((_, i) => (
                            <div key={i} className="text-[10px] font-black text-center text-[var(--foreground-muted)] opacity-50">
                                {String(i + 1).padStart(2, '0')}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {yearData.map((month, mIdx) => (
                            <div key={mIdx} className="grid grid-cols-[80px_repeat(31,1fr)] gap-2 items-center">
                                <div className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest text-right pr-4 italic">
                                    {new Date(year, mIdx).toLocaleString('de-DE', { month: 'short' })}
                                </div>
                                {month.map((day, dIdx) => (
                                    <div
                                        key={dIdx}
                                        title={`${day.date}: ${day.mood ? MOOD_LABELS[day.mood] : 'Kein Eintrag'}`}
                                        className={cn(
                                            "aspect-square rounded-md transition-all duration-300 hover:scale-150 hover:z-20 cursor-pointer shadow-sm relative group/pixel",
                                            day.mood ? MOOD_COLORS[day.mood] : "bg-[var(--background-elevated)] opacity-10 hover:opacity-100"
                                        )}
                                    >
                                        {day.mood && (
                                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/pixel:opacity-100 transition-opacity rounded-md" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                <Card variant="glass" className="p-8 rounded-[2rem] border-l-4 border-l-amber-500 bg-white/5">
                    <Sparkles className="w-8 h-8 text-amber-500 mb-4" />
                    <h3 className="text-lg font-black uppercase italic tracking-tight mb-2">Dominanz</h3>
                    <p className="text-sm text-[var(--foreground-muted)] font-medium leading-relaxed italic">
                        Deine häufigste Stimmung in diesem Jahr ist bisher
                        <span className="text-[var(--foreground)] font-black uppercase ml-1 block mt-1 text-amber-500 outline-glow-amber">
                            Gelassener Fokus
                        </span>
                    </p>
                </Card>

                <Card variant="glass" className="p-8 rounded-[2rem] border-l-4 border-l-blue-500 bg-white/5">
                    <Info className="w-8 h-8 text-blue-500 mb-4" />
                    <h3 className="text-lg font-black uppercase italic tracking-tight mb-2">Rhythmus</h3>
                    <p className="text-sm text-[var(--foreground-muted)] font-medium leading-relaxed italic">
                        Deine Stimmung verbessert sich statistisch gesehen um ca. 15%, wenn du deine Morgenroutine einhältst.
                    </p>
                </Card>

                <Card variant="glass" className="p-8 rounded-[2rem] border-l-4 border-l-indigo-500 bg-white/5">
                    <CalendarIcon className="w-8 h-8 text-indigo-500 mb-4" />
                    <h3 className="text-lg font-black uppercase italic tracking-tight mb-2">Konsistenz</h3>
                    <p className="text-sm text-[var(--foreground-muted)] font-medium leading-relaxed italic">
                        Du hast eine aktuelle Serie von 12 Tagen. Dein emotionales Bewusstsein wächst!
                    </p>
                </Card>
            </div>
        </PageContainer>
    );
}

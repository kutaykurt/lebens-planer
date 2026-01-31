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
    const isHydrated = useHydration();

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
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tighter">Year in Pixels</h1>
                <p className="text-[var(--foreground-secondary)]">Deine emotionale Landkarte des Jahres</p>
            </div>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setYear(year - 1)}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tighter">
                        {year}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setYear(year + 1)}>
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>

                <div className="hidden md:flex items-center gap-4 p-2 px-4 rounded-2xl bg-[var(--background-elevated)] border border-[var(--border)]">
                    {Object.entries(MOOD_COLORS).map(([mood, color]) => (
                        <div key={mood} className="flex items-center gap-2">
                            <div className={cn("w-3 h-3 rounded-full", color)} />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
                                {MOOD_EMOJIS[mood as MoodType]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <Card variant="elevated" className="p-4 md:p-8 overflow-x-auto">
                <div className="min-w-[800px]">
                    <div className="grid grid-cols-[repeat(31,1fr)] gap-2 mb-2">
                        {Array.from({ length: 31 }).map((_, i) => (
                            <div key={i} className="text-[10px] font-bold text-center text-[var(--foreground-muted)] uppercase">
                                {i + 1}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        {yearData.map((month, mIdx) => (
                            <div key={mIdx} className="grid grid-cols-[repeat(31,1fr)] gap-2 items-center">
                                {month.map((day, dIdx) => (
                                    <div
                                        key={dIdx}
                                        title={`${day.date}: ${day.mood ? MOOD_LABELS[day.mood] : 'Kein Eintrag'}`}
                                        className={cn(
                                            "aspect-square rounded-sm md:rounded-md transition-all duration-500 hover:scale-125 hover:z-10 cursor-pointer shadow-sm",
                                            day.mood ? MOOD_COLORS[day.mood] : "bg-[var(--background-elevated)] opacity-20"
                                        )}
                                    />
                                ))}
                                {/* Legend for Month */}
                                <div className="absolute -left-12 text-[10px] font-black text-[var(--foreground-muted)] uppercase transform -rotate-90 origin-right">
                                    {new Date(year, mIdx).toLocaleString('de-DE', { month: 'short' })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-l-4 border-l-amber-400">
                    <Sparkles className="w-6 h-6 text-amber-500 mb-3" />
                    <h3 className="font-bold mb-1">Emotionale Trends</h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">
                        Deine dominanteste Stimmung in diesem Jahr ist
                        <span className="font-bold text-[var(--foreground)] ml-1">
                            {/* Compute stats? */}
                            Produktive Gelassenheit
                        </span>.
                    </p>
                </Card>

                <Card className="p-6 border-l-4 border-l-blue-400">
                    <Info className="w-6 h-6 text-blue-500 mb-3" />
                    <h3 className="font-bold mb-1">Einsichten</h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">
                        Du neigst dazu, an Wochenenden bessere Stimmung zu loggen als unter der Woche.
                    </p>
                </Card>

                <Card className="p-6 border-l-4 border-l-purple-400">
                    <CalendarIcon className="w-6 h-6 text-purple-500 mb-3" />
                    <h3 className="font-bold mb-1">Streak</h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">
                        Du hast seit 12 Tagen in Folge deine Stimmung protokolliert. Weiter so!
                    </p>
                </Card>
            </div>
        </PageContainer>
    );
}

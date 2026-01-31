'use client';

import { useLifeOSStore } from '@/stores';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { SkillType } from '@/types';

const SKILLS_CONFIG: Record<SkillType, { label: string; color: string; icon: string }> = {
    mental: { label: 'Geist', color: '#3b82f6', icon: '🧠' },
    physical: { label: 'Körper', color: '#ef4444', icon: '💪' },
    social: { label: 'Sozial', color: '#10b981', icon: '🤝' },
    craft: { label: 'Handwerk', color: '#f59e0b', icon: '🛠️' },
    soul: { label: 'Seele', color: '#8b5cf6', icon: '✨' },
};

export function WheelOfLife() {
    const skills = useLifeOSStore((s) => s.preferences.skills);

    // Scale levels (1-10) for the chart. Our levels might be 1-100, so we normalize.
    // For now, let's just use minLevel 1, maxLevel 20 as a range for the wheel.
    const MAX_VAL = 10;

    const categories = Object.keys(SKILLS_CONFIG) as SkillType[];
    const numPoints = categories.length;
    const size = 300;
    const center = size / 2;
    const radius = 100;

    const points = categories.map((cat, i) => {
        const value = Math.min(skills[cat].level, MAX_VAL);
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const x = center + (radius * (value / MAX_VAL)) * Math.cos(angle);
        const y = center + (radius * (value / MAX_VAL)) * Math.sin(angle);
        return { x, y, angle };
    });

    const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

    // Guide lines (concentric pentagons)
    const guides = [0.2, 0.4, 0.6, 0.8, 1].map(scale => {
        return categories.map((_, i) => {
            const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
            const x = center + radius * scale * Math.cos(angle);
            const y = center + radius * scale * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');
    });

    return (
        <Card variant="elevated" className="p-6 mb-8 overflow-hidden bg-[var(--background-surface)]">
            <div className="flex flex-col items-center">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-[var(--foreground)]">Lebensrad</h3>
                    <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-widest font-black">Dein Skill-Gleichgewicht</p>
                </div>

                <div className="relative w-[300px] h-[300px]">
                    <svg width={size} height={size} className="overflow-visible">
                        {/* Background pentagons */}
                        {guides.map((g, i) => (
                            <polygon
                                key={i}
                                points={g}
                                fill="none"
                                stroke="var(--border)"
                                strokeWidth="1"
                                className="opacity-50"
                            />
                        ))}

                        {/* Axis lines */}
                        {categories.map((_, i) => {
                            const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
                            const x = center + radius * Math.cos(angle);
                            const y = center + radius * Math.sin(angle);
                            return (
                                <line
                                    key={i}
                                    x1={center} y1={center} x2={x} y2={y}
                                    stroke="var(--border)"
                                    strokeWidth="1"
                                    strokeDasharray="4,4"
                                />
                            );
                        })}

                        {/* Data polygon */}
                        <polygon
                            points={polygonPoints}
                            fill="rgba(59, 130, 246, 0.2)"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            className="transition-all duration-1000 ease-in-out"
                        />

                        {/* Labels */}
                        {categories.map((cat, i) => {
                            const { label, icon } = SKILLS_CONFIG[cat];
                            const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
                            const x = center + (radius + 35) * Math.cos(angle);
                            const y = center + (radius + 20) * Math.sin(angle);

                            return (
                                <g key={cat} className="text-[10px] font-bold">
                                    <text
                                        x={x} y={y}
                                        textAnchor="middle"
                                        fill="var(--foreground)"
                                        className="uppercase tracking-tighter"
                                    >
                                        {icon} {label}
                                    </text>
                                    <text
                                        x={x} y={y + 12}
                                        textAnchor="middle"
                                        fill="var(--accent-primary)"
                                        className="text-[8px]"
                                    >
                                        Lvl {skills[cat].level}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                <div className="mt-8 grid grid-cols-5 gap-2 w-full">
                    {categories.map(cat => (
                        <div key={cat} className="flex flex-col items-center">
                            <div
                                className="w-2 h-2 rounded-full mb-1"
                                style={{ backgroundColor: SKILLS_CONFIG[cat].color }}
                            />
                            <span className="text-[8px] font-black uppercase text-[var(--foreground-muted)]">{SKILLS_CONFIG[cat].label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}

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
        <div className="relative w-full h-full flex items-center justify-center p-4">
            <svg
                viewBox={`0 0 ${size} ${size}`}
                className="w-full h-full max-h-[300px] overflow-visible"
            >
                {/* Background pentagons */}
                {guides.map((g, i) => (
                    <polygon
                        key={i}
                        points={g}
                        fill="none"
                        stroke="var(--border)"
                        strokeWidth="1.5"
                        className="opacity-40"
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
                            strokeWidth="1.5"
                            className="opacity-60"
                        />
                    );
                })}

                {/* Data polygon */}
                <polygon
                    points={polygonPoints}
                    fill="rgba(99, 102, 241, 0.2)"
                    stroke="rgb(99, 102, 241)"
                    strokeWidth="3"
                    className="transition-all duration-1000 ease-in-out drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]"
                />

                {/* Labels */}
                {categories.map((cat, i) => {
                    const { label, icon } = SKILLS_CONFIG[cat];
                    const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
                    const x = center + (radius + 45) * Math.cos(angle);
                    const y = center + (radius + 25) * Math.sin(angle);

                    // Offset text if it's on the left/right
                    const textAnchor = Math.abs(Math.cos(angle)) < 0.1 ? "middle" : (Math.cos(angle) > 0 ? "start" : "end");

                    return (
                        <g key={cat} className="text-[11px] font-black">
                            <text
                                x={x} y={y}
                                textAnchor={textAnchor}
                                fill="var(--foreground)"
                                className="uppercase tracking-tighter italic"
                            >
                                {icon} {label}
                            </text>
                            <text
                                x={x} y={y + 14}
                                textAnchor={textAnchor}
                                fill="rgb(99, 102, 241)"
                                className="text-[9px] font-bold"
                            >
                                LVL {skills[cat].level}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

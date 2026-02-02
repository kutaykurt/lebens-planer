'use client';

import { useLifeOSStore } from '@/stores';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { SkillType } from '@/types';
import { Lock, Sparkles, Star, Zap, Target } from 'lucide-react';

interface SkillNode {
    id: string;
    label: string;
    icon: string;
    description: string;
    requiredLevel: number;
    posX: number;
    posY: number;
}

const TREE_CONFIG: Record<SkillType, { label: string; color: string; icon: string; nodes: SkillNode[] }> = {
    mental: {
        label: 'Geist',
        color: '#3b82f6',
        icon: '🧠',
        nodes: [
            { id: 'm1', label: 'Fokus', icon: '🎯', description: 'Gesteigerte Konzentration', requiredLevel: 1, posX: 0, posY: 0 },
            { id: 'm2', label: 'Achtsamkeit', icon: '🧘', description: 'Klarheit im Moment', requiredLevel: 5, posX: -40, posY: 60 },
            { id: 'm3', label: 'Weisheit', icon: '📖', description: 'Tiefes Verständnis', requiredLevel: 10, posX: 40, posY: 60 },
            { id: 'm4', label: 'Meister-Denker', icon: '⚛️', description: 'Komplexe Problemlösung', requiredLevel: 20, posX: 0, posY: 120 },
        ]
    },
    physical: {
        label: 'Körper',
        color: '#ef4444',
        icon: '💪',
        nodes: [
            { id: 'p1', label: 'Energie', icon: '⚡', description: 'Tägliche Vitalität', requiredLevel: 1, posX: 0, posY: 0 },
            { id: 'p2', label: 'Stärke', icon: '🏋️', description: 'Physische Kraft', requiredLevel: 5, posX: -40, posY: 60 },
            { id: 'p3', label: 'Ausdauer', icon: '🏃', description: 'Langes Durchhalten', requiredLevel: 10, posX: 40, posY: 60 },
            { id: 'p4', label: 'Athlet', icon: '🏆', description: 'Peak Performance', requiredLevel: 20, posX: 0, posY: 120 },
        ]
    },
    social: {
        label: 'Sozial',
        color: '#10b981',
        icon: '🤝',
        nodes: [
            { id: 's1', label: 'Empathie', icon: '❤️', description: 'Gefühle verstehen', requiredLevel: 1, posX: 0, posY: 0 },
            { id: 's2', label: 'Charisma', icon: '✨', description: 'Andere begeistern', requiredLevel: 5, posX: -40, posY: 60 },
            { id: 's3', label: 'Führung', icon: '👑', description: 'Teams leiten', requiredLevel: 10, posX: 40, posY: 60 },
            { id: 's4', label: 'Netzwerker', icon: '🕸️', description: 'Einflussreiche Kontakte', requiredLevel: 20, posX: 0, posY: 120 },
        ]
    },
    craft: {
        label: 'Handwerk',
        color: '#f59e0b',
        icon: '🛠️',
        nodes: [
            { id: 'c1', label: 'Schöpfung', icon: '🎨', description: 'Etwas Neues bauen', requiredLevel: 1, posX: 0, posY: 0 },
            { id: 'c2', label: 'Disziplin', icon: '📐', description: 'Präzise Ausführung', requiredLevel: 5, posX: -40, posY: 60 },
            { id: 'c3', label: 'Meisterschaft', icon: '📜', description: 'Perfektionierung', requiredLevel: 10, posX: 40, posY: 60 },
            { id: 'c4', label: 'Innovator', icon: '💡', description: 'Neue Wege gehen', requiredLevel: 20, posX: 0, posY: 120 },
        ]
    },
    soul: {
        label: 'Seele',
        color: '#8b5cf6',
        icon: '✨',
        nodes: [
            { id: 'so1', label: 'Präsenz', icon: '🕯️', description: 'Im Einklang sein', requiredLevel: 1, posX: 0, posY: 0 },
            { id: 'so2', label: 'Harmonie', icon: '🌊', description: 'Innere Balance', requiredLevel: 5, posX: -40, posY: 60 },
            { id: 'so3', label: 'Intuition', icon: '🔮', description: 'Innere Stimme', requiredLevel: 10, posX: 40, posY: 60 },
            { id: 'so4', label: 'Erwacht', icon: '🌌', description: 'Höhere Bestimmung', requiredLevel: 20, posX: 0, posY: 120 },
        ]
    }
};

export function SkillTree() {
    const skills = useLifeOSStore((s) => s.preferences.skills);
    const accentColor = useLifeOSStore((s) => s.preferences.appearance.accentColor) || 'var(--accent-primary)';

    return (
        <div className="space-y-12">
            {(Object.keys(TREE_CONFIG) as SkillType[]).map((skillType) => {
                const config = TREE_CONFIG[skillType];
                const currentLevel = skills[skillType].level;

                return (
                    <div key={skillType} className="relative">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--background-elevated)] border border-[var(--border)] flex items-center justify-center text-2xl shadow-lg">
                                {config.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[var(--foreground)]">{config.label}</h3>
                                <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-widest font-black">
                                    Aktuelles Level: <span className="text-[var(--accent-primary)]">{currentLevel}</span>
                                </p>
                            </div>
                        </div>

                        <div className="relative h-[200px] flex justify-center">
                            {/* SVG Connections Layer */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                                <defs>
                                    <linearGradient id={`grad-${skillType}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor={config.color} stopOpacity="0.5" />
                                        <stop offset="100%" stopColor={config.color} stopOpacity="0.1" />
                                    </linearGradient>
                                </defs>
                                {config.nodes.map((node, i) => {
                                    if (i === 0) return null; // Root has no parent connection here

                                    // Connection to parent (we simplify the tree structure for visualization)
                                    let parentNode = config.nodes[0];
                                    if (i === 3) parentNode = config.nodes[1]; // Special case for bottom node

                                    const isUnlocked = currentLevel >= node.requiredLevel;

                                    return (
                                        <line
                                            key={`line-${node.id}`}
                                            x1={`calc(50% + ${parentNode.posX}px)`}
                                            y1={parentNode.posY + 25}
                                            x2={`calc(50% + ${node.posX}px)`}
                                            y2={node.posY + 25}
                                            stroke={isUnlocked ? config.color : 'var(--border)'}
                                            strokeWidth={isUnlocked ? "2" : "1"}
                                            strokeDasharray={isUnlocked ? "0" : "4,4"}
                                            className="transition-all duration-1000"
                                        />
                                    );
                                })}
                            </svg>

                            {/* Nodes Layer */}
                            {config.nodes.map((node) => {
                                const isUnlocked = currentLevel >= node.requiredLevel;
                                const isNext = currentLevel < node.requiredLevel &&
                                    (config.nodes.find(n => n.requiredLevel < node.requiredLevel && currentLevel >= n.requiredLevel) || node.requiredLevel === 1);

                                return (
                                    <div
                                        key={node.id}
                                        className={cn(
                                            "absolute w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group cursor-help",
                                            isUnlocked
                                                ? "bg-gradient-to-br shadow-xl scale-110 z-10"
                                                : "bg-[var(--background-surface)] border-2 border-dashed border-[var(--border)] opacity-60",
                                            isUnlocked && "hover:scale-125"
                                        )}
                                        style={{
                                            transform: `translate(${node.posX}px, ${node.posY}px)`,
                                            backgroundColor: isUnlocked ? config.color : undefined,
                                            boxShadow: isUnlocked ? `0 0 20px ${config.color}66` : undefined
                                        }}
                                    >
                                        <span className={cn("text-2xl transition-transform", isUnlocked ? "text-white" : "grayscale opacity-50")}>
                                            {isUnlocked ? node.icon : <Lock className="w-5 h-5" />}
                                        </span>

                                        {/* Tooltip */}
                                        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-40 bg-[var(--background-surface)] border border-[var(--border)] rounded-xl p-3 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                                            <p className="font-bold text-xs mb-1">{node.label}</p>
                                            <p className="text-[10px] text-[var(--foreground-muted)] mb-2">{node.description}</p>
                                            <div className="flex items-center justify-between mt-1 pt-1 border-t border-[var(--border-subtle)]">
                                                <span className="text-[9px] font-black uppercase text-[var(--foreground-muted)]">Req Lvl</span>
                                                <span className={cn("text-[9px] font-bold", isUnlocked ? "text-emerald-500" : "text-rose-500")}>
                                                    {node.requiredLevel}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Particle effect for unlocked */}
                                        {isUnlocked && (
                                            <div className="absolute inset-0 rounded-2xl animate-pulse ring-4 ring-white/20 pointer-events-none" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

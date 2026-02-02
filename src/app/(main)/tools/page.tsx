'use client';

import Link from 'next/link';
import {
    LayoutGrid, Library, Focus, Sparkles,
    ArrowRight, Settings, ExternalLink, Calendar,
    Activity, Database, Brain, Wallet, ShoppingBag,
    Trophy, Zap, Shield, Rocket, Globe, Terminal
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

const TOOLS = [
    {
        title: 'Capital Node',
        description: 'Finanzielle Parameter & Asset-Management.',
        icon: Wallet,
        href: '/finance',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        gradient: 'from-emerald-500/20 to-teal-500/20'
    },
    {
        title: 'Neural Wiki',
        description: 'Externes Gedächtnis für Wissen & Konzepte.',
        icon: Brain,
        href: '/wiki',
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        gradient: 'from-indigo-500/20 to-purple-500/20'
    },
    {
        title: 'Review System',
        description: 'Iterative Analyse von Zeit-Zyklen.',
        icon: Calendar,
        href: '/review',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        gradient: 'from-purple-500/20 to-pink-500/20'
    },
    {
        title: 'Media Vault',
        description: 'Archiv für digitale & analoge Ressourcen.',
        icon: Library,
        href: '/vault',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        gradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
        title: 'Data Core',
        description: 'Tiefen-Analyse systemischer Muster.',
        icon: Activity,
        href: '/analytics',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        gradient: 'from-emerald-500/20 to-teal-400/20'
    },
    {
        title: 'System Settings',
        description: 'Kern-Konfiguration & Daten-Sicherung.',
        icon: Settings,
        href: '/settings',
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
        gradient: 'from-amber-500/20 to-orange-500/20'
    },
    {
        title: 'Pixel Grid',
        description: 'Chromatisches Stimmungs-Protokoll.',
        icon: LayoutGrid,
        href: '/pixels',
        color: 'text-pink-500',
        bg: 'bg-pink-500/10',
        gradient: 'from-pink-500/20 to-rose-500/20'
    },
    {
        title: 'Briefing Engine',
        description: 'Automatisierte Erfolgs-Berichte.',
        icon: Sparkles,
        href: '/briefing',
        color: 'text-sky-400',
        bg: 'bg-sky-500/10',
        gradient: 'from-sky-500/20 to-indigo-500/20'
    },
    {
        title: 'XP Repository',
        description: 'Belohnungs-Zentrum für System-Fortschritt.',
        icon: ShoppingBag,
        href: '/shop',
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        gradient: 'from-indigo-500/20 to-violet-500/20'
    },
    {
        title: 'Challenges',
        description: 'High-Level Missionen & Sonderschichten.',
        icon: Trophy,
        href: '/challenges',
        color: 'text-rose-500',
        bg: 'bg-rose-500/10',
        gradient: 'from-rose-500/20 to-orange-500/20'
    }
];

export default function ToolsHubPage() {
    return (
        <PageContainer>
            {/* Header / Subsystem Registry */}
            <div className="relative mb-20">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
                    <div>
                        <div className="flex items-center gap-6 mb-4">
                            <div className="w-16 h-16 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                                <Terminal className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-[var(--foreground)] tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground-muted)]">
                                    Subsystem-<span className="text-indigo-500">Registry</span>
                                </h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Operation: Module Access / Tools Hub</p>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-8">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Active Modules</p>
                            <p className="text-2xl font-black italic tracking-tighter">10 / 12 Loaded</p>
                        </div>
                        <div className="w-px h-12 bg-[var(--border)]" />
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <Shield className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                {TOOLS.map((tool, i) => {
                    const Icon = tool.icon;
                    return (
                        <Link key={tool.title} href={tool.href} className="group">
                            <Card variant="glass" className={cn(
                                "p-10 rounded-[3rem] border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500 h-full relative overflow-hidden",
                                "flex flex-col items-start"
                            )} style={{ animationDelay: `${i * 50}ms` }}>
                                {/* Hover background glow */}
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none",
                                    tool.gradient
                                )} />

                                <div className="flex items-start justify-between w-full relative z-10 mb-8">
                                    <div className={cn("w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500", tool.bg)}>
                                        <Icon className={cn("w-8 h-8", tool.color)} />
                                    </div>
                                    <div className="w-10 h-10 rounded-2xl bg-[var(--background-elevated)] border border-[var(--border)] flex items-center justify-center rotate-45 group-hover:bg-indigo-500 group-hover:rotate-0 transition-all duration-500 shadow-lg">
                                        <ArrowRight className="w-5 h-5 text-indigo-500 group-hover:text-white -rotate-45 group-hover:rotate-0 transition-all" />
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black text-[var(--foreground)] tracking-tighter uppercase italic mb-3 group-hover:text-indigo-500 transition-colors">
                                        {tool.title}
                                    </h3>
                                    <p className="text-sm text-[var(--foreground-muted)] font-medium leading-relaxed italic opacity-80">
                                        {tool.description}
                                    </p>
                                </div>

                                {/* Bottom decorative line */}
                                <div className={cn(
                                    "absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left",
                                    tool.gradient.replace('/20', '')
                                )} />
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Coming Soon / Prototype Section */}
            <div className="mt-12 relative">
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--border)]" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--foreground-muted)]">Future Prototypes</h2>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--border)]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-40 grayscale">
                    <Card variant="glass" className="p-8 border-dashed border-white/20 bg-transparent rounded-[2.5rem] flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--background-elevated)] flex items-center justify-center">
                            <Settings className="w-7 h-7 text-[var(--foreground-muted)]" />
                        </div>
                        <div>
                            <h4 className="font-black text-lg tracking-tight uppercase italic flex items-center gap-2">
                                Neural Network <Sparkles className="w-4 h-4" />
                            </h4>
                            <p className="text-xs font-medium opacity-60">AI Integration & Smart Automation</p>
                        </div>
                    </Card>
                    <Card variant="glass" className="p-8 border-dashed border-white/20 bg-transparent rounded-[2.5rem] flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--background-elevated)] flex items-center justify-center">
                            <Globe className="w-7 h-7 text-[var(--foreground-muted)]" />
                        </div>
                        <div>
                            <h4 className="font-black text-lg tracking-tight uppercase italic">Sync Sphere</h4>
                            <p className="text-xs font-medium opacity-60">Cross-Platform Cluster Sync</p>
                        </div>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}

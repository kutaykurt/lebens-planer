'use client';

import Link from 'next/link';
import {
    LayoutGrid, Library, Focus, Sparkles,
    ArrowRight, Settings, ExternalLink, Calendar,
    Activity
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

const TOOLS = [
    {
        title: 'Review & Reflect',
        description: 'Monats- und Jahresrückblicke durchführen.',
        icon: Calendar,
        href: '/review',
        color: 'text-purple-500',
        bg: 'bg-purple-500/10'
    },
    {
        title: 'Media Vault',
        description: 'Bücher, Filme und Spiele verwalten.',
        icon: Library,
        href: '/vault',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
    {
        title: 'Deep Analytics',
        description: 'Zusammenhänge und Muster verstehen.',
        icon: Activity,
        href: '/analytics',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10'
    },
    {
        title: 'Year in Pixels',
        description: 'Deine Stimmung im Jahresüberblick.',
        icon: LayoutGrid,
        href: '/pixels',
        color: 'text-amber-500',
        bg: 'bg-amber-500/10'
    },
    {
        title: 'Fokus Modus',
        description: 'Deep Work mit Pomodoro & Ambient Sounds.',
        icon: Focus,
        href: '/today',
        color: 'text-rose-500',
        bg: 'bg-rose-500/10'
    }
];

export default function ToolsHubPage() {
    return (
        <PageContainer>
            <div className="mb-10">
                <h1 className="text-4xl font-black text-[var(--foreground)] tracking-tighter mb-2">Tools Hub</h1>
                <p className="text-[var(--foreground-secondary)] text-lg">Zusätzliche Funktionen für dein Life OS</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <Link key={tool.title} href={tool.href}>
                            <Card className="p-6 group hover:border-[var(--accent-primary)] transition-all duration-300 h-full border-t-4 border-t-transparent hover:border-t-[var(--accent-primary)]">
                                <div className="flex items-start justify-between">
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", tool.bg)}>
                                        <Icon className={cn("w-7 h-7", tool.color)} />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-[var(--background-elevated)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                        <ArrowRight className="w-4 h-4 text-[var(--accent-primary)]" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">{tool.title}</h3>
                                <p className="text-[var(--foreground-secondary)]">{tool.description}</p>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-12">
                <h2 className="text-sm font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-6">Coming Soon</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50 grayscale">
                    <Card className="p-4 border-dashed">
                        <h4 className="font-bold flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Personal Wiki
                        </h4>
                    </Card>
                    <Card className="p-4 border-dashed">
                        <h4 className="font-bold flex items-center gap-2">
                            <Library className="w-4 h-4" /> Finance Tracker
                        </h4>
                    </Card>
                    <Card className="p-4 border-dashed">
                        <h4 className="font-bold flex items-center gap-2">
                            <Settings className="w-4 h-4" /> Soundboard
                        </h4>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}

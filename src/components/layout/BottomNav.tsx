'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Target, Repeat, LayoutGrid, Calendar, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/today', label: 'Heute', icon: Home },
    { href: '/calendar', label: 'Matrix', icon: Calendar },
    { href: '/projects', label: 'Missionen', icon: Folder },
    { href: '/goals', label: 'Sektoren', icon: Target },
    { href: '/habits', label: 'Routinen', icon: Repeat },
    { href: '/tools', label: 'Zentrale', icon: LayoutGrid },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav suppressHydrationWarning className="fixed bottom-0 left-0 right-0 z-50 safe-bottom no-print">
            {/* High-tech floating dock container */}
            <div suppressHydrationWarning className="max-w-xl mx-auto px-4 pb-6">
                <div suppressHydrationWarning className="relative flex items-center justify-around h-20 px-2 bg-[#0a0a0a] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl shadow-black overflow-hidden">

                    {/* Background glow effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />

                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'relative flex flex-col items-center justify-center gap-1.5 min-w-[5rem] py-2 px-3 transition-all duration-500 group',
                                    isActive
                                        ? 'text-white'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                )}
                            >
                                {/* Active background pill */}
                                {isActive && (
                                    <div className="absolute inset-x-2 inset-y-1 bg-white/5 rounded-2xl animate-fade-in transition-all duration-500" />
                                )}

                                {/* Icon container */}
                                <div className={cn(
                                    'relative z-10 flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500',
                                    isActive ? 'bg-zinc-800 text-white shadow-lg shadow-white/10 -translate-y-2' : 'group-hover:translate-y-[-2px]'
                                )}>
                                    <Icon className={cn("w-6 h-6 transition-all duration-500", isActive && "text-glow")} strokeWidth={isActive ? 2.5 : 2} />

                                    {/* Active indicator ring */}
                                    {isActive && (
                                        <div className="absolute -inset-1 border border-white/10 rounded-2xl animate-ping opacity-20 pointer-events-none" />
                                    )}
                                </div>

                                {/* Label */}
                                <span
                                    className={cn(
                                        'relative z-10 text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-500',
                                        isActive ? 'text-zinc-200 italic' : 'text-zinc-600 font-bold group-hover:text-zinc-400'
                                    )}
                                >
                                    {item.label}
                                </span>

                                {/* Bottom dot indicator */}
                                <div className={cn(
                                    "absolute bottom-2 w-1 h-1 rounded-full bg-white transition-all duration-500",
                                    isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                                )} />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}

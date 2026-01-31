'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Target, Repeat, LayoutGrid, BookOpen, Calendar, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/today', label: 'Heute', icon: Home },
    { href: '/calendar', label: 'Kalender', icon: Calendar },
    { href: '/projects', label: 'Projekte', icon: Folder },
    { href: '/goals', label: 'Ziele', icon: Target },
    { href: '/habits', label: 'Habits', icon: Repeat },
    { href: '/tools', label: 'Tools', icon: LayoutGrid },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom no-print">
            {/* Glass background */}
            <div className="absolute inset-0 bg-[var(--background-surface)]/80 backdrop-blur-xl border-t border-[var(--border)]" />

            <div className="relative flex items-center justify-around h-20 max-w-lg mx-auto px-2">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'relative flex flex-col items-center justify-center gap-1 min-w-[4.5rem] py-2 px-3 rounded-2xl transition-all duration-300',
                                isActive
                                    ? 'text-[var(--accent-primary)]'
                                    : 'text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]'
                            )}
                        >
                            {/* Active background pill */}
                            {isActive && (
                                <div className="absolute inset-1 bg-[var(--accent-primary-light)] rounded-2xl animate-fade-in-scale" />
                            )}

                            {/* Icon container */}
                            <div className={cn(
                                'relative z-10 flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300',
                                isActive && 'scale-110'
                            )}>
                                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                            </div>

                            {/* Label */}
                            <span
                                className={cn(
                                    'relative z-10 text-xs font-medium transition-all duration-300',
                                    isActive && 'font-semibold'
                                )}
                            >
                                {item.label}
                            </span>

                            {/* Active indicator dot */}
                            {isActive && (
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-fade-in" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

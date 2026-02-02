'use client';

import {
    ShoppingBag, Star, Zap, Shield, Sparkles,
    Gift, Crown, Check, AlertCircle, ArrowRight
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, toast } from '@/components/ui';
import { useLifeOSStore, useHydration } from '@/stores';
import { SHOP_ITEMS, type ShopItem, type ItemRarity } from '@/types';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

const RARITY_COLORS: Record<ItemRarity, string> = {
    common: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    rare: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    epic: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    legendary: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
};

export default function ShopPage() {
    const isHydrated = useHydration();
    const { xp, inventory } = useLifeOSStore((s) => s.preferences);
    const buyItem = useLifeOSStore((s) => s.buyItem);

    if (!isHydrated) return null;

    const handleBuy = (item: ShopItem) => {
        const result = buyItem(item.id);
        if (result.success) {
            confetti({
                particleCount: 100,
                spread: 50,
                origin: { y: 0.8 },
                colors: item.rarity === 'legendary' ? ['#fbbf24', '#ffffff'] : ['#6366f1', '#ffffff']
            });
            toast.success(`${item.title} gekauft! ✨`);
        } else {
            toast.error(result.error || 'Fehler beim Kauf.');
        }
    };

    return (
        <PageContainer>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-black uppercase tracking-widest mb-4">
                        <ShoppingBag className="w-3 h-3" />
                        XP Shop
                    </div>
                    <h1 className="text-5xl font-black text-[var(--foreground)] tracking-tight">Belohnungs-<span className="text-[var(--accent-primary)]">Marktplatz</span></h1>
                    <p className="text-[var(--foreground-secondary)] text-lg mt-2">Investiere deine hart verdienten XP in exklusive Items.</p>
                </div>

                <Card className="px-6 py-4 bg-[var(--background) border-2 border-[var(--accent-primary)]/50 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-[var(--accent-primary)]" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase text-[var(--foreground-muted)] tracking-wider">Dein Kontostand</p>
                        <p className="text-2xl font-black text-[var(--foreground)]">{xp} <span className="text-[var(--accent-primary)]">XP</span></p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {SHOP_ITEMS.map((item) => {
                    const isOwned = inventory.includes(item.id);
                    const canAfford = xp >= item.price;

                    return (
                        <Card key={item.id} className={cn(
                            "group relative flex flex-col p-6 transition-all duration-300",
                            isOwned ? "opacity-90 border-emerald-500/30" : "hover:border-[var(--accent-primary)]"
                        )}>
                            {/* Rarity Tag */}
                            <div className={cn(
                                "absolute top-4 right-4 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter border",
                                RARITY_COLORS[item.rarity]
                            )}>
                                {item.rarity}
                            </div>

                            {/* Icon */}
                            <div className="w-20 h-20 mx-auto my-6 rounded-3xl bg-[var(--background-elevated)] flex items-center justify-center text-4xl shadow-lg ring-1 ring-white/5 group-hover:scale-110 transition-transform duration-500">
                                {item.icon}
                            </div>

                            <div className="flex-1 text-center space-y-2">
                                <h3 className="text-xl font-bold text-[var(--foreground)]">{item.title}</h3>
                                <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed">
                                    {item.description}
                                </p>
                            </div>

                            <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] space-y-4">
                                <div className="flex items-center justify-center gap-2">
                                    <Zap className="w-3 h-3 text-[var(--accent-primary)]" />
                                    <span className="text-lg font-black">{item.price} XP</span>
                                </div>

                                <Button
                                    variant={isOwned ? "success" : "primary"}
                                    disabled={isOwned || !canAfford}
                                    className="w-full font-black uppercase tracking-wider text-xs py-3"
                                    onClick={() => handleBuy(item)}
                                >
                                    {isOwned ? (
                                        <span className="flex items-center gap-2">Owned <Check className="w-4 h-4" /></span>
                                    ) : (
                                        <span>Jetzt Kaufen</span>
                                    )}
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Special Section */}
            <div className="mt-16">
                <Card className="p-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-20 h-20 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Crown className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1 space-y-2 text-center md:text-left">
                            <h2 className="text-2xl font-black">Sammle mehr Abzeichen!</h2>
                            <p className="text-[var(--foreground-secondary)]">Besondere Errungenschaften schalten exklusive Shop-Rabatte und geheime Items frei.</p>
                        </div>
                        <Button variant="outline" className="gap-2 shadow-sm font-bold" onClick={() => window.location.href = '/profile'}>
                            Mein Fortschritt <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </Card>
            </div>
        </PageContainer>
    );
}

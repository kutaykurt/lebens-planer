'use client';

import { useState, useMemo } from 'react';
import {
    Wallet, Plus, ArrowUpRight, ArrowDownLeft,
    PieChart, History, Filter, Trash2,
    ChevronRight, CreditCard, PiggyBank, TrendingUp,
    AlertCircle, LayoutGrid, Zap, Shield, Globe, Activity
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Input, Select, Dialog, DialogFooter } from '@/components/ui';
import { cn, formatDate } from '@/lib/utils';
import { useLifeOSStore, useHydration } from '@/stores';
import { Transaction, TransactionType } from '@/types';

const CATEGORIES = [
    'Essen & Trinken', 'Miete & Wohnen', 'Transport',
    'Entertainment', 'Shopping', 'Gesundheit',
    'Bildung', 'Gehalt', 'Sonstiges'
];

export default function FinancePage() {
    const isHydrated = useHydration();
    const transactions = useLifeOSStore((s) => s.transactions);
    const addTransaction = useLifeOSStore((s) => s.addTransaction);
    const deleteTransaction = useLifeOSStore((s) => s.deleteTransaction);

    const [showAdd, setShowAdd] = useState(false);
    const [type, setType] = useState<TransactionType>('expense');
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);

    // Stats
    const stats = useMemo(() => {
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        return transactions.reduce((acc, t) => {
            const tDate = new Date(t.date);
            const isThisMonth = tDate.getMonth() === thisMonth && tDate.getFullYear() === thisYear;

            if (t.type === 'income') {
                acc.totalIncome += t.amount;
                if (isThisMonth) acc.monthlyIncome += t.amount;
            } else {
                acc.totalExpense += t.amount;
                if (isThisMonth) acc.monthlyExpense += t.amount;
            }
            return acc;
        }, { totalIncome: 0, totalExpense: 0, monthlyIncome: 0, monthlyExpense: 0 });
    }, [transactions]);

    const balance = stats.totalIncome - stats.totalExpense;

    const categoryData = useMemo(() => {
        const now = new Date();
        const thisMonth = now.getMonth();
        const data: Record<string, number> = {};

        transactions
            .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === thisMonth)
            .forEach(t => {
                data[t.category] = (data[t.category] || 0) + t.amount;
            });

        return Object.entries(data).sort((a, b) => b[1] - a[1]);
    }, [transactions]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && amount) {
            addTransaction({
                title,
                amount: parseFloat(amount),
                type,
                category,
                date: formatDate(new Date()),
                note: null
            });
            setTitle('');
            setAmount('');
            setShowAdd(false);
        }
    };

    if (!isHydrated) {
        return (
            <PageContainer>
                <div className="animate-pulse space-y-8">
                    <div className="h-40 bg-[var(--background-elevated)] rounded-[2.5rem]" />
                    <div className="grid grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-[var(--background-elevated)] rounded-2xl" />)}
                    </div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            {/* Header / Capital Command */}
            <div className="relative mb-16">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
                    <div>
                        <div className="flex items-center gap-6 mb-4">
                            <div className="w-16 h-16 rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                                <Wallet className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-[var(--foreground)] tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground-muted)]">
                                    Capital-<span className="text-emerald-500">Node</span>
                                </h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Operation: Wealth Accumulation</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button onClick={() => setShowAdd(true)} className="h-20 px-10 rounded-[2rem] bg-emerald-500 hover:bg-emerald-600 text-white flex flex-col items-center justify-center group shadow-2xl shadow-emerald-500/20">
                            <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] mt-1">Add Entry</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
                {/* Balance Card */}
                <Card variant="glass" className="md:col-span-6 p-10 bg-gradient-to-br from-indigo-500 to-purple-600 border-none text-white rounded-[3.5rem] relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 opacity-70">
                            <Shield className="w-4 h-4" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Net Worth Status</p>
                        </div>
                        <h2 className="text-6xl font-black tracking-tighter mb-8 italic">{balance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</h2>
                        <div className="flex items-center gap-8">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Growth Index</p>
                                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-md">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-xs font-black">+4.2%</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Risk Factor</p>
                                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-md">
                                    <Zap className="w-4 h-4" />
                                    <span className="text-xs font-black">MINIMAL</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Monthly Income/Expense Cards */}
                <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <Card variant="glass" className="p-8 rounded-[2.5rem] border-white/10 bg-white/5 flex flex-col justify-between group">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <ArrowUpRight className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-1">Inflow (Month)</p>
                                <h3 className="text-3xl font-black text-emerald-500 tracking-tighter">
                                    + {stats.monthlyIncome.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                                </h3>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase text-[var(--foreground-muted)] tracking-widest">Efficiency 100%</span>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                    </Card>

                    <Card variant="glass" className="p-8 rounded-[2.5rem] border-white/10 bg-white/5 flex flex-col justify-between group">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                                <ArrowDownLeft className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-1">Outflow (Month)</p>
                                <h3 className="text-3xl font-black text-rose-500 tracking-tighter">
                                    - {stats.monthlyExpense.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                                </h3>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase text-[var(--foreground-muted)] tracking-widest">Burn Rate</span>
                            <div className="w-20 h-1.5 bg-[var(--background-elevated)] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-rose-500"
                                    style={{ width: `${Math.min((stats.monthlyExpense / 3000) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-32">
                {/* Ledger / Transactions */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                            <History className="w-6 h-6 text-indigo-500" /> Transaktions-Log
                        </h2>
                        <Button variant="ghost" className="text-[10px] font-black tracking-widest uppercase hover:bg-indigo-500/10 text-indigo-500">
                            Export System <Globe className="w-3 h-3 ml-2" />
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {transactions.slice().sort((a, b) => b.date.localeCompare(a.date)).map(t => (
                            <Card key={t.id} variant="glass" className="p-6 rounded-[2rem] border-white/10 bg-white/5 hover:bg-white/10 transition-all group/item">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                                            t.type === 'income' ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                                        )}>
                                            {t.type === 'income' ? <ArrowUpRight className="w-7 h-7" /> : <ArrowDownLeft className="w-7 h-7" />}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black tracking-tight uppercase italic">{t.title}</h4>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/10">{t.category}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] opacity-60">{t.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className={cn("text-xl font-black italic tracking-tighter", t.type === 'income' ? "text-emerald-500" : "text-[var(--foreground)]")}>
                                            {t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                                        </span>
                                        <button
                                            onClick={() => deleteTransaction(t.id)}
                                            className="opacity-0 group-hover/item:opacity-100 p-3 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Distributions */}
                <div className="lg:col-span-4 space-y-8">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                        <PieChart className="w-6 h-6 text-amber-500" /> Budget-Matrix
                    </h2>

                    <Card variant="glass" className="p-8 rounded-[3rem] border-white/10 bg-white/5">
                        <div className="space-y-8">
                            {categoryData.map(([cat, val]) => (
                                <div key={cat} className="group">
                                    <div className="flex justify-between text-[11px] font-black uppercase mb-2 tracking-wide">
                                        <span className="text-[var(--foreground)]">{cat}</span>
                                        <span className="text-amber-500">{val.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-[var(--background-elevated)] overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 via-amber-500 to-indigo-500 bg-[length:200%_100%] animate-shimmer"
                                            style={{ width: `${(val / stats.monthlyExpense) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {categoryData.length === 0 && (
                                <div className="py-20 text-center opacity-40">
                                    <Activity className="w-12 h-12 mx-auto mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Warte auf Datenfluss...</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card variant="glass" className="p-8 bg-indigo-500/5 border-dashed border-indigo-500/20 rounded-[3rem] relative group cursor-pointer overflow-hidden">
                        <div className="absolute inset-0 bg-indigo-500/[0.02] group-hover:bg-indigo-500/[0.04] transition-colors" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg">
                                    <PiggyBank className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight uppercase italic">Smart Vault</h3>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500">Asset Management</p>
                                </div>
                            </div>
                            <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed italic opacity-70">
                                Verlinke deine Ersparnisse mit deinen Zielen, um automatisch das Compound-Wachstums-Modell zu aktivieren.
                            </p>
                            <Button variant="ghost" className="w-full mt-6 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all">
                                Vault öffnen <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Transaction Dialog */}
            <Dialog open={showAdd} onClose={() => setShowAdd(false)} title="Buchung initialisieren">
                <form onSubmit={handleAdd} className="space-y-8">
                    <div className="flex bg-[var(--background-elevated)] p-1.5 rounded-[2rem] border border-[var(--border)] shadow-inner">
                        <button
                            type="button"
                            onClick={() => setType('expense')}
                            className={cn(
                                "flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all",
                                type === 'expense' ? "bg-rose-500 text-white shadow-xl" : "text-[var(--foreground-muted)]"
                            )}
                        >
                            Abfluss (-)
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('income')}
                            className={cn(
                                "flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all",
                                type === 'income' ? "bg-emerald-500 text-white shadow-xl" : "text-[var(--foreground-muted)]"
                            )}
                        >
                            Zufluss (+)
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Betrag (€)"
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0,00"
                            className="text-4xl font-black italic tracking-tighter"
                            autoFocus
                            required
                        />
                        <Select
                            label="Sektor-ID"
                            options={CATEGORIES.map(c => ({ value: c, label: c }))}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </div>

                    <Input
                        label="Log-Bezeichnung (Händler / Quelle)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="z.B. Terminal 04, Passive Income..."
                        required
                    />

                    <div className="p-6 bg-indigo-500/5 rounded-[2rem] border border-indigo-500/10 flex items-start gap-5">
                        <AlertCircle className="w-6 h-6 text-indigo-500 font-bold shrink-0 mt-1" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">Strategischer Hinweis</p>
                            <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed italic opacity-80">
                                Finanzielle Achtsamkeit erhöht deinen <span className="font-bold text-[var(--foreground)]">Craft-Skill</span> und synchronisiert <span className="font-bold text-[var(--foreground)]">15 XP</span> in dein System.
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" className="rounded-2xl h-12" onClick={() => setShowAdd(false)}>Abbrechen</Button>
                        <Button type="submit" disabled={!amount || !title} className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl h-12 shadow-xl shadow-indigo-500/20 font-black uppercase tracking-widest">
                            Log Speichern
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </PageContainer>
    );
}

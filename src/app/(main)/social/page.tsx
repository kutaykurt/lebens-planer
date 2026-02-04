'use client';

import { useState } from 'react';
import {
    Users,
    Plus,
    Search,
    MessageSquare,
    Phone,
    Calendar,
    MoreVertical,
    Clock,
    UserPlus,
    UserCircle,
    Heart,
    Briefcase,
    GraduationCap,
    Smile,
    Trash2,
    Mail,
    Edit3
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Input, toast, Dialog, DialogFooter } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useContacts } from '@/stores/selectors';
import { useLifeOSStore } from '@/stores/lifeOSStore';
import { AddContactDialog } from '@/components/features/AddContactDialog';
import type { ContactCategory, Contact } from '@/types';

const CATEGORY_COLORS: Record<ContactCategory, string> = {
    family: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    friend: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    mentor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    colleague: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    professional: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    other: 'text-slate-500 bg-slate-500/10 border-slate-500/20'
};

const CATEGORY_ICONS: Record<ContactCategory, any> = {
    family: Heart,
    friend: Smile,
    mentor: GraduationCap,
    colleague: Briefcase,
    professional: Briefcase,
    other: UserCircle
};

export default function SocialPage() {
    const contacts = useContacts();
    const { deleteContact, addInteraction } = useLifeOSStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ContactCategory | 'all'>('all');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [deletingContact, setDeletingContact] = useState<{ id: string; name: string } | null>(null);

    const filteredContacts = contacts.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleLogInteraction = (contactId: string, name: string) => {
        const now = new Date().toISOString().split('T')[0];
        addInteraction(contactId, {
            date: now,
            type: 'message',
            note: 'Schneller Check-in'
        });
        toast.success(`Interaktion für ${name} geloggt! 📈`);
    };

    const handleDelete = (id: string) => {
        deleteContact(id);
        setDeletingContact(null);
        toast.error('Kontakt gelöscht.');
    };

    return (
        <PageContainer>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-[var(--foreground)] tracking-tighter mb-2 flex items-center gap-3">
                        <Users className="w-10 h-10 text-[var(--accent-primary)]" />
                        Personal CRM
                    </h1>
                    <p className="text-[var(--foreground-secondary)] text-lg">
                        Pflege deine wichtigsten Beziehungen und bleibe in Kontakt.
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="gap-2 h-12 px-6 rounded-2xl shadow-xl shadow-indigo-500/20"
                >
                    <UserPlus className="w-5 h-5" />
                    Kontakt hinzufügen
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)]" />
                    <Input
                        placeholder="Kontakte durchsuchen..."
                        className="pl-12 h-12 bg-[var(--background-surface)] border-[var(--border)] focus:ring-2 focus:ring-indigo-500/20 rounded-2xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="h-12 px-4 rounded-2xl bg-[var(--background-surface)] border border-[var(--border)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 min-w-[140px]"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as any)}
                    >
                        <option value="all">Alle Kategorien</option>
                        <option value="family">Familie</option>
                        <option value="friend">Freunde</option>
                        <option value="mentor">Mentoren</option>
                        <option value="colleague">Kollegen</option>
                        <option value="professional">Geschäftlich</option>
                    </select>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <Card variant="glass" padding="sm" className="flex items-center gap-4 border-indigo-500/10">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Gesamt</p>
                        <p className="text-xl font-black">{contacts.length}</p>
                    </div>
                </Card>
                <Card variant="glass" padding="sm" className="flex items-center gap-4 border-amber-500/10">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Fällig</p>
                        <p className="text-xl font-black">
                            {contacts.filter(c => !c.lastContacted).length}
                        </p>
                    </div>
                </Card>
                <Card variant="glass" padding="sm" className="flex items-center gap-4 border-rose-500/10">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Geburtstage</p>
                        <p className="text-xl font-black">
                            {contacts.filter(c => c.birthday).length}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Contacts Grid */}
            {filteredContacts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContacts.map(contact => {
                        const CategoryIcon = CATEGORY_ICONS[contact.category];
                        return (
                            <Card
                                key={contact.id}
                                hover
                                variant="elevated"
                                padding="none"
                                className="group h-full flex flex-col overflow-hidden animate-fade-in-up"
                            >
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform relative overflow-hidden">
                                                <span className="text-xl font-black z-10">{contact.name.charAt(0)}</span>
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg leading-tight group-hover:text-[var(--accent-primary)] transition-colors">{contact.name}</h3>
                                                <div className={cn(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase mt-1 border",
                                                    CATEGORY_COLORS[contact.category]
                                                )}>
                                                    <CategoryIcon className="w-3 h-3" />
                                                    {contact.category}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setDeletingContact({ id: contact.id, name: contact.name })}
                                                className="p-2 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-colors"
                                                title="Löschen"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Info Section */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-sm text-[var(--foreground-secondary)]">
                                            <div className="w-8 h-8 rounded-lg bg-[var(--background-elevated)] flex items-center justify-center">
                                                <Clock className="w-4 h-4 text-indigo-500" />
                                            </div>
                                            <span>Zuletzt: {contact.lastContacted || 'Noch nie'}</span>
                                        </div>
                                        {contact.birthday && (
                                            <div className="flex items-center gap-3 text-sm text-[var(--foreground-secondary)]">
                                                <div className="w-8 h-8 rounded-lg bg-[var(--background-elevated)] flex items-center justify-center">
                                                    <Calendar className="w-4 h-4 text-rose-500" />
                                                </div>
                                                <span>Geburtstag: {contact.birthday}</span>
                                            </div>
                                        )}
                                        {contact.notes && (
                                            <div className="pt-3 border-t border-[var(--border-subtle)]">
                                                <p className="text-xs text-[var(--foreground-muted)] line-clamp-2 italic">
                                                    "{contact.notes}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="p-4 bg-[var(--background-subtle)] border-t border-[var(--border-subtle)] flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleLogInteraction(contact.id, contact.name)}
                                        className="flex-1 gap-2 rounded-xl h-10 hover:bg-white dark:hover:bg-black shadow-sm font-bold text-[10px] uppercase tracking-wider"
                                    >
                                        <MessageSquare className="w-4 h-4" /> Log
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex-1 gap-2 rounded-xl h-10 hover:bg-white dark:hover:bg-black shadow-sm text-indigo-500 font-bold text-[10px] uppercase tracking-wider"
                                    >
                                        <Phone className="w-4 h-4" /> Kontakt
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-[var(--background-surface)] rounded-[3rem] border-2 border-dashed border-[var(--border)]">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center mb-6">
                        <Users className="w-10 h-10 text-indigo-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 tracking-tight uppercase">Keine Kontakte gefunden</h3>
                    <p className="text-[var(--foreground-muted)] mb-8 text-center max-w-[300px]">
                        Beginne damit, deine ersten Mitstreiter in deinen Lebensplaner aufzunehmen.
                    </p>
                    <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="gap-3 h-12 px-8 rounded-2xl bg-indigo-500"
                    >
                        <Plus className="w-5 h-5" /> Ersten Kontakt erstellen
                    </Button>
                </div>
            )}

            <AddContactDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
            />

            <Dialog
                open={!!deletingContact}
                onClose={() => setDeletingContact(null)}
                title="Kontakt löschen?"
                description={`Möchtest du ${deletingContact?.name} wirklich aus deinem Netzwerk entfernen?`}
            >
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setDeletingContact(null)}>
                        Abbrechen
                    </Button>
                    <Button variant="destructive" onClick={() => deletingContact && handleDelete(deletingContact.id)}>
                        Löschen
                    </Button>
                </DialogFooter>
            </Dialog>
        </PageContainer>
    );
}

'use client';

import { useState } from 'react';
import {
    Book, Film, Gamepad2, Tv, Plus, Search,
    Filter, Star, Clock, CheckCircle2, MoreVertical,
    Trash2, Edit3, Heart
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Input, Select, Dialog, DialogFooter } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useLifeOSStore, useHydration } from '@/stores';
import { MediaItem, MediaType, MediaStatus } from '@/types';

const TYPE_ICONS: Record<MediaType, any> = {
    book: Book,
    movie: Film,
    series: Tv,
    game: Gamepad2,
};

const STATUS_LABELS: Record<MediaStatus, string> = {
    backlog: 'Backlog',
    in_progress: 'Wird geschaut/gelesen',
    completed: 'Abgeschlossen',
    abandoned: 'Abgebrochen',
};

export default function MediaVaultPage() {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<MediaType | 'all'>('all');
    const [showAdd, setShowAdd] = useState(false);
    const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [type, setType] = useState<MediaType>('book');
    const [status, setStatus] = useState<MediaStatus>('backlog');

    const mediaItems = useLifeOSStore((s) => s.mediaItems);
    const addMediaItem = useLifeOSStore((s) => s.addMediaItem);
    const updateMediaItem = useLifeOSStore((s) => s.updateMediaItem);
    const deleteMediaItem = useLifeOSStore((s) => s.deleteMediaItem);
    const isHydrated = useHydration();

    const filteredItems = mediaItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            addMediaItem({
                title: title.trim(),
                type,
                status,
                notes: null,
            });
            setTitle('');
            setShowAdd(false);
        }
    };

    if (!isHydrated) return null;

    return (
        <PageContainer>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tighter">Media Vault</h1>
                <p className="text-[var(--foreground-secondary)]">Verwalte deine Bücher, Filme und Spiele</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                    <Input
                        placeholder="Suchen..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as any)}
                        options={[
                            { value: 'all', label: 'Alle Medien' },
                            { value: 'book', label: 'Bücher' },
                            { value: 'movie', label: 'Filme' },
                            { value: 'series', label: 'Serien' },
                            { value: 'game', label: 'Spiele' },
                        ]}
                    />
                    <Button onClick={() => setShowAdd(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Neu
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => {
                    const Icon = TYPE_ICONS[item.type];
                    return (
                        <Card key={item.id} className="p-4 group hover:border-[var(--accent-primary)] transition-all duration-300">
                            <div className="flex gap-4">
                                <div className="w-12 h-16 rounded-lg bg-[var(--background-elevated)] flex items-center justify-center shrink-0">
                                    <Icon className="w-6 h-6 text-[var(--foreground-muted)]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-[var(--foreground)] truncate">{item.title}</h3>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setDeletingMediaId(item.id)}
                                                className="p-1 hover:text-red-500 text-[var(--foreground-muted)]"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-[var(--foreground-muted)] mb-3">
                                        {item.type} • {STATUS_LABELS[item.status]}
                                    </p>

                                    <div className="flex gap-2">
                                        {(['backlog', 'in_progress', 'completed'] as MediaStatus[]).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => updateMediaItem(item.id, { status: s })}
                                                className={cn(
                                                    "px-2 py-1 rounded-md text-[10px] font-bold transition-all",
                                                    item.status === s
                                                        ? "bg-[var(--accent-primary)] text-white"
                                                        : "bg-[var(--background-elevated)] text-[var(--foreground-muted)] hover:bg-[var(--border-subtle)]"
                                                )}
                                            >
                                                {STATUS_LABELS[s].split(' ')[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Dialog open={showAdd} onClose={() => setShowAdd(false)} title="Medium hinzufügen">
                <form onSubmit={handleAdd} className="space-y-4">
                    <Input
                        label="Titel"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Typ"
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                            options={[
                                { value: 'book', label: 'Buch' },
                                { value: 'movie', label: 'Film' },
                                { value: 'series', label: 'Serie' },
                                { value: 'game', label: 'Spiel' },
                            ]}
                        />
                        <Select
                            label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                            options={[
                                { value: 'backlog', label: 'Backlog' },
                                { value: 'in_progress', label: 'Gerade dabei' },
                                { value: 'completed', label: 'Abgeschlossen' },
                            ]}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>Abbrechen</Button>
                        <Button type="submit">Hinzufügen</Button>
                    </DialogFooter>
                </form>
            </Dialog>

            <Dialog
                open={!!deletingMediaId}
                onClose={() => setDeletingMediaId(null)}
                title="Medium löschen?"
                description="Möchtest du dieses Medium wirklich aus deinem Vault entfernen?"
            >
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setDeletingMediaId(null)}>Abbrechen</Button>
                    <Button variant="destructive" onClick={() => {
                        if (deletingMediaId) {
                            deleteMediaItem(deletingMediaId);
                            setDeletingMediaId(null);
                        }
                    }}>Löschen</Button>
                </DialogFooter>
            </Dialog>
        </PageContainer >
    );
}

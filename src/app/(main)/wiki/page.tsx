'use client';

import { useState, useMemo } from 'react';
import {
    Library, Plus, Search, Pin, Trash2, Edit3,
    ChevronLeft, Tag as TagIcon, X, Maximize2, Archive,
    Share2, ExternalLink, Eye, Layout
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Input, Textarea, Dialog, DialogFooter } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useLifeOSStore, useHydration } from '@/stores';
import { Note } from '@/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import dynamic from 'next/dynamic';

const WikiGraph = dynamic(() => import('@/components/features/WikiGraph').then(mod => mod.WikiGraph), {
    ssr: false,
    loading: () => <div className="w-full h-[500px] bg-[var(--background-surface)] rounded-3xl animate-pulse flex items-center justify-center text-[var(--foreground-muted)] uppercase text-[10px] font-black tracking-[0.2em]">Neural Network Initializing...</div>
});

export default function WikiPage() {
    const [search, setSearch] = useState('');
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'graph'>('grid');
    const [editMode, setEditMode] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const notes = useLifeOSStore((s) => s.notes);
    const tags = useLifeOSStore((s) => s.tags);
    const addNote = useLifeOSStore((s) => s.addNote);
    const updateNote = useLifeOSStore((s) => s.updateNote);
    const deleteNote = useLifeOSStore((s) => s.deleteNote);
    const isHydrated = useHydration();

    const filteredNotes = useMemo(() => {
        return notes.filter(n =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.content.toLowerCase().includes(search.toLowerCase())
        ).sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
    }, [notes, search]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            addNote({
                title: title.trim(),
                content: content.trim(),
                isPinned: false,
                tagIds: selectedTags,
            });
            resetForm();
            setShowAdd(false);
        }
    };

    const handleUpdate = () => {
        if (activeNote && title.trim()) {
            updateNote(activeNote.id, {
                title: title.trim(),
                content: content.trim(),
                tagIds: selectedTags,
            });
            setEditMode(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setSelectedTags([]);
    };

    const openNote = (note: Note) => {
        setActiveNote(note);
        setTitle(note.title);
        setContent(note.content);
        setSelectedTags(note.tagIds);
        setEditMode(false);
    };

    // Custom Markdown component for wiki-links
    const MarkdownComponents = {
        text: ({ value }: { value: string }) => {
            const parts = value.split(/(\[\[.*?\]\])/g);
            return (
                <>
                    {parts.map((part, i) => {
                        if (part.startsWith('[[') && part.endsWith(']]')) {
                            const linkTitle = part.slice(2, -2);
                            const targetNote = notes.find(n => n.title.toLowerCase() === linkTitle.toLowerCase());
                            return (
                                <button
                                    key={i}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (targetNote) openNote(targetNote);
                                    }}
                                    className={cn(
                                        "px-1 rounded bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 transition-colors font-bold",
                                        !targetNote && "opacity-50 line-through decoration-rose-500"
                                    )}
                                >
                                    {linkTitle}
                                </button>
                            );
                        }
                        return part;
                    })}
                </>
            );
        }
    };

    if (!isHydrated) return null;

    return (
        <PageContainer width="full">
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-black uppercase tracking-widest mb-4">
                        <Share2 className="w-3 h-3" />
                        Second Brain
                    </div>
                    <h1 className="text-5xl font-black text-[var(--foreground)] tracking-tight">Personal <span className="text-indigo-500">Wiki</span></h1>
                    <p className="text-[var(--foreground-secondary)] text-lg">Vernetzte Gedanken und Wissen.</p>
                </div>

                <div className="flex gap-2">
                    <div className="bg-[var(--background-subtle)] p-1 rounded-xl flex gap-1">
                        <Button
                            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                            size="sm"
                            className="rounded-lg"
                            onClick={() => setViewMode('grid')}
                        >
                            <Layout className="w-4 h-4 mr-2" /> Grid
                        </Button>
                        <Button
                            variant={viewMode === 'graph' ? 'primary' : 'ghost'}
                            size="sm"
                            className="rounded-lg"
                            onClick={() => setViewMode('graph')}
                        >
                            <Share2 className="w-4 h-4 mr-2" /> Graph
                        </Button>
                    </div>
                    <Button onClick={() => { resetForm(); setShowAdd(true); }} className="gap-2 h-10 px-6 rounded-xl shadow-lg shadow-indigo-500/20">
                        <Plus className="w-5 h-5" />
                        <span>Neue Notiz</span>
                    </Button>
                </div>
            </div>

            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)]" />
                <Input
                    placeholder="Wissen durchsuchen..."
                    className="pl-12 h-14 bg-[var(--background-surface)] border-[var(--border)] rounded-2xl text-lg shadow-sm focus:shadow-md transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {viewMode === 'graph' ? (
                <div className="animate-in fade-in zoom-in duration-500">
                    <WikiGraph notes={notes} onNodeClick={openNote} activeNoteId={activeNote?.id} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[280px] gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
                    {filteredNotes.map((note, index) => {
                        const isLarge = note.isPinned || index === 0;
                        const isWide = note.content.length > 600 && !isLarge;

                        return (
                            <Card
                                key={note.id}
                                className={cn(
                                    "group p-8 cursor-pointer hover:border-indigo-500/50 transition-all duration-500 relative flex flex-col h-full overflow-hidden border-2 shadow-sm rounded-[2rem]",
                                    isLarge ? "lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-[var(--background-surface)] to-[var(--background-elevated)]" :
                                        isWide ? "lg:col-span-2 bg-[var(--background-surface)]" : "bg-[var(--background-surface)]",
                                    note.isPinned && "border-amber-500/30 shadow-amber-500/5"
                                )}
                                onClick={() => openNote(note)}
                            >
                                {/* Background Accent for Large Cards */}
                                {isLarge && (
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
                                )}

                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-2">
                                        {note.isPinned && (
                                            <div className="flex items-center gap-1 text-amber-500">
                                                <Pin className="w-3 h-3 fill-current" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Wichtig</span>
                                            </div>
                                        )}
                                        <h3 className={cn(
                                            "font-black text-[var(--foreground)] leading-[1.1] group-hover:text-indigo-500 transition-colors tracking-tight",
                                            isLarge ? "text-3xl" : "text-xl line-clamp-2"
                                        )}>
                                            {note.title}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            updateNote(note.id, { isPinned: !note.isPinned });
                                        }}
                                        className={cn(
                                            "p-2 rounded-xl transition-all",
                                            note.isPinned ? "text-amber-500 bg-amber-500/10" : "text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 hover:bg-[var(--background-elevated)]"
                                        )}
                                    >
                                        <Pin className={cn("w-4 h-4", note.isPinned && "fill-current")} />
                                    </button>
                                </div>

                                <p className={cn(
                                    "text-[var(--foreground-secondary)] font-medium leading-relaxed flex-1 mb-8",
                                    isLarge ? "text-lg line-clamp-6" : "text-sm line-clamp-4"
                                )}>
                                    {note.content.replace(/\[\[(.*?)\]\]/g, '$1') || <span className="italic opacity-50">Kein Inhalt vorhanden...</span>}
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex flex-wrap gap-2">
                                        {note.tagIds.slice(0, 3).map(tagId => {
                                            const tag = tags.find(t => t.id === tagId);
                                            if (!tag) return null;
                                            return (
                                                <span
                                                    key={tag.id}
                                                    className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border"
                                                    style={{ backgroundColor: `${tag.color}10`, color: tag.color, borderColor: `${tag.color}30` }}
                                                >
                                                    {tag.label}
                                                </span>
                                            );
                                        })}
                                        {note.tagIds.length > 3 && (
                                            <span className="text-[10px] font-black text-[var(--foreground-muted)] self-center">
                                                +{note.tagIds.length - 3}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow-emerald" title="Zuletzt bearbeitet" />
                                        <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-tight">
                                            {new Date(note.updatedAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}

                    {filteredNotes.length === 0 && (
                        <div className="col-span-full py-40 text-center animate-fade-in">
                            <div className="relative inline-block mb-10">
                                <div className="w-32 h-32 bg-indigo-500/5 rounded-[3rem] flex items-center justify-center mx-auto border-4 border-dashed border-indigo-500/20 rotate-12 transition-transform hover:rotate-0">
                                    <Library className="w-16 h-16 text-indigo-500/20" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                                    <Plus className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <h3 className="text-4xl font-black text-[var(--foreground)] mb-4 tracking-tight">Dein Gehirn ist hungrig</h3>
                            <p className="text-[var(--foreground-secondary)] max-w-sm mx-auto text-lg font-medium leading-relaxed">Fang an, Wissen zu sammeln und verbinde deine Gedanken in deinem digitalen Garten.</p>
                            <Button size="lg" className="mt-10 px-10 rounded-2xl shadow-xl shadow-indigo-500/20" onClick={() => setShowAdd(true)}>Erste Notiz anlegen</Button>
                        </div>
                    )}
                </div>
            )}

            {/* Note Detail / Edit Dialog */}
            <Dialog
                open={!!activeNote}
                onClose={() => setActiveNote(null)}
                title={editMode ? "Wissen bearbeiten" : activeNote?.title || ""}
                className="max-w-4xl"
            >
                <div className="space-y-6">
                    {editMode ? (
                        <>
                            <Input
                                label="Titel"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Thema der Notiz"
                                className="text-lg font-bold"
                                required
                            />
                            <Textarea
                                label="Inhalt (Markdown)"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[400px] text-base font-mono leading-relaxed"
                            />
                        </>
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none min-h-[300px] p-6 rounded-2xl bg-[var(--background-elevated)] border border-[var(--border)] overflow-auto">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                                    h1: ({ children }) => <h1 className="text-2xl font-black mb-4 mt-6">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>,
                                    ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-2">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-2">{children}</ol>,
                                    li: ({ children }) => <li className="text-[var(--foreground-secondary)]">{children}</li>,
                                    code: ({ children }) => <code className="bg-[var(--background-subtle)] px-1.5 py-0.5 rounded text-indigo-500 font-mono text-sm">{children}</code>,
                                    blockquote: ({ children }) => <blockquote className="border-l-4 border-indigo-500 pl-4 italic opacity-80 mb-4">{children}</blockquote>,
                                    a: ({ href, children }) => {
                                        if (href?.startsWith('[[') && href.endsWith(']]')) {
                                            const linkTitle = href.slice(2, -2);
                                            const target = notes.find(n => n.title.toLowerCase() === linkTitle.toLowerCase());
                                            return (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (target) openNote(target);
                                                    }}
                                                    className={cn(
                                                        "text-indigo-500 font-bold hover:underline",
                                                        !target && "opacity-50 line-through decoration-rose-500"
                                                    )}
                                                >
                                                    {children}
                                                </button>
                                            );
                                        }
                                        return <a href={href} className="text-indigo-500 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
                                    }
                                }}
                            >
                                {(activeNote?.content || "").replace(/\[\[(.*?)\]\]/g, '[$1]([[$1]])')}
                            </ReactMarkdown>
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)]">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {tags.map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    disabled={!editMode}
                                    onClick={() => setSelectedTags(prev =>
                                        prev.includes(tag.id) ? prev.filter(id => id !== tag.id) : [...prev, tag.id]
                                    )}
                                    className={cn(
                                        "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2",
                                        selectedTags.includes(tag.id)
                                            ? "border-current shadow-sm"
                                            : "border-transparent bg-[var(--background-elevated)] opacity-60 hover:opacity-100",
                                        !editMode && "cursor-default"
                                    )}
                                    style={{ color: tag.color }}
                                >
                                    {tag.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-[var(--border-subtle)]">
                        <Button
                            variant="ghost"
                            className="text-[var(--accent-error)] gap-2 hover:bg-[var(--accent-error)]/10"
                            onClick={() => {
                                if (activeNote && typeof window !== 'undefined' && window.confirm('Möchtest du diese Notiz wirklich löschen?')) {
                                    deleteNote(activeNote.id);
                                    setActiveNote(null);
                                }
                            }}
                        >
                            <Trash2 className="w-4 h-4" />
                            Löschen
                        </Button>
                        <div className="flex gap-3">
                            {!editMode ? (
                                <>
                                    <Button variant="ghost" onClick={() => setActiveNote(null)}>Schließen</Button>
                                    <Button onClick={() => setEditMode(true)} className="gap-2">
                                        <Edit3 className="w-4 h-4" /> Bearbeiten
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="ghost" onClick={() => setEditMode(false)}>Abbrechen</Button>
                                    <Button onClick={handleUpdate} disabled={!title.trim()}>Speichern</Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Dialog>

            {/* Add Note Dialog */}
            <Dialog open={showAdd} onClose={() => setShowAdd(false)} title="Wissen festhalten">
                <form onSubmit={handleAdd} className="space-y-6">
                    <Input
                        label="Titel"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Was hast du gelernt?"
                        className="text-lg font-bold"
                        autoFocus
                        required
                    />
                    <Textarea
                        label="Inhalt (Markdown)"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Schreibe deine Gedanken hier nieder. Nutze [[Titel]] für internen Verlinkungen..."
                        className="min-h-[300px] text-base leading-relaxed"
                    />
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)]">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {tags.map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => setSelectedTags(prev =>
                                        prev.includes(tag.id) ? prev.filter(id => id !== tag.id) : [...prev, tag.id]
                                    )}
                                    className={cn(
                                        "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2",
                                        selectedTags.includes(tag.id)
                                            ? "border-current shadow-sm"
                                            : "border-transparent bg-[var(--background-elevated)] opacity-60 hover:opacity-100"
                                    )}
                                    style={{ color: tag.color }}
                                >
                                    {tag.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>Verwerfen</Button>
                        <Button type="submit" disabled={!title.trim()}>Speichern</Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </PageContainer>
    );
}

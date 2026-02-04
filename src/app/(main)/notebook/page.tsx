'use client';

import { useState, useEffect, useMemo, memo, useRef, useCallback } from 'react';
import { PageContainer } from '@/components/layout';
import { useLifeOSStore, useHydration } from '@/stores';
import { cn } from '@/lib/utils';
import {
    Save, Book, PenTool, Plus, Search,
    Pin, PinOff, Trash2, ChevronRight,
    FileText, Clock, ChevronLeft, List as ListIcon,
    Hash
} from 'lucide-react';
import { NotebookEditor, NotebookToolbar } from '@/components/features/NotebookEditor';
import { toast } from '@/components/ui/Toast';

const NotebookStyles = () => (
    <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Caveat:wght@400..700&family=Patrick+Hand&family=Special+Elite&family=Indie+Flower&family=Shadows+Into+Light&family=Architects+Daughter&family=Gloria+Hallelujah&family=Coming+Soon&family=Kalam:wght@300;400;700&display=swap');

        /* ═══════════════════════════════════════════════════════════════════════
           NOTEBOOK PAPER STYLES
           ═══════════════════════════════════════════════════════════════════════ */
        
        :root {
            --notebook-paper: #fcfaf2;
            --notebook-lines: #e5e7eb;
            --notebook-text: #1a1a1a;
            --notebook-margin: #fca5a5;
            --notebook-shadow-color: rgba(0,0,0,0.08);
            --notebook-spiral-color: #d1d5db;
        }

        .dark {
            --notebook-paper: #1a1a1a;
            --notebook-lines: #2d2d2d;
            --notebook-text: #e2e8f0;
            --notebook-margin: #4a2b2b;
            --notebook-shadow-color: rgba(0,0,0,0.5);
            --notebook-spiral-color: #444;
        }

        .notebook-paper-container {
            width: 700px;
            height: 880px; /* 26 Zeilen × 32px = 832px + 48px für Seitenzahl */
            position: relative;
            overflow: hidden !important;
            background-color: var(--notebook-paper);
            background-image: linear-gradient(var(--notebook-lines) 1px, transparent 1px);
            background-size: 100% 32px;
            border-radius: 1.5rem;
            border: 1px solid var(--notebook-lines);
            box-shadow: 
                0 1px 1px var(--notebook-shadow-color), 
                0 8px 0 -4px var(--notebook-paper), 
                0 8px 1px -3px var(--notebook-shadow-color), 
                0 16px 0 -8px var(--notebook-paper), 
                0 16px 1px -7px var(--notebook-shadow-color);
            flex-shrink: 0;
            transition: background-color 0.3s ease;
        }

        .notebook-editor-container {
            position: absolute;
            top: 0;
            left: 56px;
            right: 16px;
            height: 832px; /* 26 Zeilen × 32px */
            overflow: hidden !important;
            padding-top: 0;
        }

        .notebook-editor-prose {
            font-family: 'EB Garamond', serif;
            font-size: 18px;
            line-height: 32px;
            color: var(--notebook-text);
            caret-color: var(--notebook-text);
            outline: none;
            overflow: hidden !important;
            height: 100%;
        }

        .notebook-editor-prose .ProseMirror {
            outline: none !important;
            min-height: 100%;
        }

        .notebook-editor-prose p {
            margin: 0 !important;
            padding: 0;
            min-height: 32px;
            line-height: 32px !important;
        }

        .notebook-editor-prose h2 {
            font-size: 22px !important;
            font-weight: 700 !important;
            line-height: 32px !important;
            margin: 0 !important;
            color: var(--notebook-text);
        }

        .notebook-editor-prose ul,
        .notebook-editor-prose ol {
            margin: 0 !important;
            padding-left: 1.5rem !important;
        }

        .notebook-editor-prose li {
            line-height: 32px !important;
            min-height: 32px;
        }

        .notebook-editor-prose .tab-char {
            display: inline-block;
            width: 40px;
        }

        /* Placeholder */
        .notebook-editor-prose p.is-empty:first-child::before {
            content: attr(data-placeholder);
            color: #94a3b8;
            pointer-events: none;
            font-style: italic;
            opacity: 0.5;
        }

        /* Spiralbindung */
        .notebook-spiral {
            position: absolute;
            left: 10px;
            top: 0;
            bottom: 0;
            width: 18px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 20px 0;
            pointer-events: none;
            z-index: 10;
        }

        .notebook-spiral-hole {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--notebook-spiral-color) 0%, var(--notebook-lines) 100%);
            border: 1px solid var(--notebook-lines);
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);
        }

        /* Roter Randstrich */
        .notebook-margin-line {
            position: absolute;
            left: 48px;
            top: 0;
            bottom: 0;
            width: 1px;
            background-color: var(--notebook-margin);
            pointer-events: none;
            z-index: 5;
        }

        /* Seitenzahl unten rechts */
        .notebook-page-number {
            position: absolute;
            bottom: 12px;
            right: 20px;
            font-family: 'EB Garamond', serif;
            font-size: 14px;
            font-style: italic;
            color: var(--foreground-muted);
            pointer-events: none;
            z-index: 10;
        }
    `}</style>
);

// --- Sub-components to help React 19 / Turbopack optimization ---

const NoteCard = memo(({
    note,
    isSelected,
    onClick,
    onTogglePin,
    onDelete
}: {
    note: any;
    isSelected: boolean;
    onClick: () => void;
    onTogglePin: (id: string, current: boolean) => void;
    onDelete: (id: string) => void;
}) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "p-4 rounded-2xl transition-all border group relative cursor-pointer",
                isSelected
                    ? "bg-[var(--background-surface)] border-amber-500 shadow-lg scale-[1.02] dark:border-amber-400"
                    : "bg-[var(--background-surface)]/40 border-[var(--border)] hover:border-amber-500/30 hover:bg-[var(--background-surface)]/60"
            )}
        >
            <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className={cn(
                    "text-xs font-black truncate flex-1 uppercase tracking-tight italic",
                    isSelected ? "text-amber-800" : "text-zinc-700"
                )}>
                    {note.title || 'Unbenannt'}
                </h3>
                {note.isPinned && <Pin className="w-3 h-3 text-amber-500 fill-current shrink-0" />}
            </div>

            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-zinc-100/50">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between group/meta">
                        <div className="flex items-center gap-1.5 text-amber-600/70">
                            <Plus className="w-2.5 h-2.5" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Erstellt:</span>
                        </div>
                        <span className="text-[9px] font-bold text-zinc-500 tabular-nums">
                            {new Date(note.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div className="flex items-center justify-between group/meta">
                        <div className="flex items-center gap-1.5 text-blue-600/70">
                            <Clock className="w-2.5 h-2.5" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Bearbeitet:</span>
                        </div>
                        <span className="text-[9px] font-bold text-zinc-500 tabular-nums">
                            {new Date(note.updatedAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400">
                    <FileText className="w-2.5 h-2.5" />
                    <span className="text-[9px] uppercase font-black tracking-widest">
                        {(note.pages?.length || 1)} {(note.pages?.length || 1) === 1 ? 'Seite' : 'Seiten'}
                    </span>
                </div>
            </div>

            <div className="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                <button onClick={(e) => { e.stopPropagation(); onTogglePin(note.id, note.isPinned); }} className="p-1 hover:bg-amber-50 rounded text-amber-600">
                    {note.isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(note.id); }} className="p-1 hover:bg-rose-50 rounded text-rose-600">
                    <Trash2 className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
});
NoteCard.displayName = 'NoteCard';

const TableOfContents = memo(({
    items,
    currentPageIndex,
    onPageChange
}: {
    items: any[];
    currentPageIndex: number;
    onPageChange: (idx: number) => void;
}) => {
    return (
        <div className="bg-[var(--background-surface)]/60 backdrop-blur-md p-8 rounded-[2rem] border border-[var(--border)] h-full flex flex-col shadow-sm overflow-hidden text-[var(--foreground)]">
            <div className="flex items-center gap-2 mb-8 border-b border-zinc-200 pb-4 shrink-0 px-1">
                <div className="p-2 bg-zinc-100 rounded-xl">
                    <ListIcon className="w-4 h-4 text-zinc-600" />
                </div>
                <h3 className="font-black uppercase italic tracking-tight">Inhalt</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 custom-scrollbar mb-4 text-zinc-800 px-1">
                {items.length > 0 ? (
                    items.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => onPageChange(item.pageIndex)}
                            className={cn(
                                "w-full text-left group transition-all",
                                item.level === 1 ? "pl-0" : "pl-4"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <Hash className={cn(
                                    "w-3.5 h-3.5 mt-1 shrink-0",
                                    item.level === 1 ? "text-amber-500" : "text-zinc-300"
                                )} />
                                <div>
                                    <div className={cn(
                                        "transition-all leading-tight text-zinc-800",
                                        item.level === 1 ? "text-xs font-black uppercase italic group-hover:text-amber-600" : "text-[11px] font-bold group-hover:text-amber-900"
                                    )}>
                                        {item.text}
                                    </div>
                                    <div className="text-[9px] font-black uppercase tracking-tighter opacity-30 group-hover:opacity-100 transition-opacity mt-1">
                                        Seite {item.pageIndex + 1}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="text-center py-10 opacity-20 italic text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                        Nutze H1 / H2<br />für das Verzeichnis
                    </div>
                )}
            </div>
        </div>
    );
});
TableOfContents.displayName = 'TableOfContents';

export default function NotebookPage() {
    const isHydrated = useHydration();
    const notes = useLifeOSStore((s) => s.notes);
    const addNote = useLifeOSStore((s) => s.addNote);
    const updateNote = useLifeOSStore((s) => s.updateNote);
    const deleteNote = useLifeOSStore((s) => s.deleteNote);

    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [localTitle, setLocalTitle] = useState('');

    // Editor instance for toolbar
    const [editor, setEditor] = useState<any>(null);

    // Multi-page state
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [localPages, setLocalPages] = useState<string[]>(['']);
    const [focusPos, setFocusPos] = useState<'start' | 'end'>('end');

    // Sort and filter notes
    const filteredNotes = useMemo(() => {
        let result = [...notes].filter(n => n.title !== 'Notebook_Main' && n.type === 'notebook');

        if (searchQuery) {
            result = result.filter(n =>
                n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (n.pages || [n.content]).some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        return result.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
    }, [notes, searchQuery]);

    const activeNote = useMemo(() =>
        notes.find(n => n.id === selectedNoteId),
        [notes, selectedNoteId]);

    // Initialize first note or selection
    useEffect(() => {
        if (isHydrated && filteredNotes.length === 0 && searchQuery === '') {
            handleCreateNote();
        } else if (isHydrated && !selectedNoteId && filteredNotes.length > 0) {
            setSelectedNoteId(filteredNotes[0].id);
        }
    }, [isHydrated, selectedNoteId, filteredNotes, searchQuery]);

    // Track if we're syncing from store (to prevent auto-save loop)
    const isSyncingFromStore = useRef(false);

    // Sync local state with active note
    useEffect(() => {
        if (activeNote) {
            isSyncingFromStore.current = true;
            setLocalTitle(activeNote.title || 'Unbenannte Notiz');
            const p = activeNote.pages && activeNote.pages.length > 0
                ? activeNote.pages
                : [activeNote.content || ''];
            setLocalPages(p);
            setCurrentPageIndex(0);
            // Reset sync flag after state updates are applied
            setTimeout(() => {
                isSyncingFromStore.current = false;
            }, 0);
        } else {
            setLocalTitle('');
            setLocalPages(['']);
            setCurrentPageIndex(0);
        }
    }, [activeNote?.id]); // Only re-sync when note ID changes, not on every update

    const handleCreateNote = () => {
        const id = addNote({
            title: 'Unbenannte Notiz',
            content: '',
            type: 'notebook',
            pages: [''],
            tagIds: [],
            isPinned: false
        });
        setSelectedNoteId(id);
        return id;
    };

    // Immediate auto-save (no delay) - saves on every change
    useEffect(() => {
        // Don't save if we're syncing from store (prevents infinite loop)
        if (isSyncingFromStore.current) return;
        if (!selectedNoteId || localPages.length === 0) return;

        // Save immediately
        updateNote(selectedNoteId, {
            title: localTitle || 'Unbenannte Notiz',
            type: 'notebook',
            pages: localPages,
            content: localPages.join('\n\n')
        });
    }, [localPages, localTitle, selectedNoteId, updateNote]);

    // Also save on page unload/close
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (selectedNoteId && localPages.length > 0) {
                updateNote(selectedNoteId, {
                    title: localTitle || 'Unbenannte Notiz',
                    type: 'notebook',
                    pages: localPages,
                    content: localPages.join('\n\n')
                });
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [selectedNoteId, localTitle, localPages, updateNote]);

    const handleSave = () => {
        if (selectedNoteId) {
            updateNote(selectedNoteId, {
                title: localTitle || 'Unbenannte Notiz',
                type: 'notebook',
                pages: localPages,
                content: localPages.join('\n\n')
            });
            toast.success('Notiz gespeichert');
        }
    };

    const handlePageChange = (index: number) => {
        setFocusPos('start');
        setCurrentPageIndex(index);
    };

    const handlePageFull = useCallback((overflowContent?: string) => {
        const nextPageIndex = currentPageIndex + 1;

        // Wenn wir Inhalt mitnehmen, Cursor ans Ende des mitgenommenen Teils setzen
        setFocusPos(overflowContent ? 'end' : 'start');

        if (nextPageIndex < localPages.length) {
            // Seite existiert bereits -> Vorne anhängen
            const newPages = [...localPages];
            if (overflowContent) {
                newPages[nextPageIndex] = overflowContent + newPages[nextPageIndex];
            }
            setLocalPages(newPages);
            setCurrentPageIndex(nextPageIndex);
        } else {
            // Neue Seite anlegen
            const newPages = [...localPages, overflowContent || ''];
            setLocalPages(newPages);
            setCurrentPageIndex(nextPageIndex);
        }
    }, [localPages, currentPageIndex]);

    const handleBackspaceAtStart = useCallback(() => {
        if (currentPageIndex > 0) {
            setFocusPos('end');
            setCurrentPageIndex(currentPageIndex - 1);
        }
    }, [currentPageIndex]);

    const handleAddPage = () => {
        const newPages = [...localPages, ''];
        setLocalPages(newPages);
        setCurrentPageIndex(newPages.length - 1);
        toast.info('Neue Seite hinzugefügt');
    };

    const handleDeletePage = (pageIndex: number) => {
        if (localPages.length <= 1) {
            toast.error('Die letzte Seite kann nicht gelöscht werden');
            return;
        }
        if (confirm(`Seite ${pageIndex + 1} wirklich löschen?`)) {
            const newPages = localPages.filter((_, i) => i !== pageIndex);
            setLocalPages(newPages);
            // Adjust current page index if needed
            if (currentPageIndex >= newPages.length) {
                setCurrentPageIndex(newPages.length - 1);
            } else if (currentPageIndex > pageIndex) {
                setCurrentPageIndex(currentPageIndex - 1);
            }
            toast.success('Seite gelöscht');
        }
    };

    const updateCurrentPageContent = (newContent: string) => {
        const newPages = [...localPages];
        newPages[currentPageIndex] = newContent;
        setLocalPages(newPages);
    };

    const handleDelete = (id: string) => {
        if (confirm('Diese Notiz wirklich löschen?')) {
            deleteNote(id);
            if (activeNote?.id === id) {
                setSelectedNoteId(null);
            }
            toast.success('Notiz gelöscht');
        }
    };

    const togglePin = (id: string, current: boolean) => {
        updateNote(id, { isPinned: !current });
    };


    // Table of Contents logic
    const tableOfContents = useMemo(() => {
        const toc: { text: string; level: number; pageIndex: number }[] = [];
        localPages.forEach((page, pIdx) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(page, 'text/html');
            const headings = doc.querySelectorAll('h1, h2');
            headings.forEach(h => {
                toc.push({
                    text: h.textContent || '',
                    level: parseInt(h.tagName.substring(1)),
                    pageIndex: pIdx
                });
            });
        });
        return toc;
    }, [localPages]);

    if (!isHydrated) return null;

    return (
        <PageContainer width="full" className="pb-32 h-[calc(100vh-120px)] overflow-hidden">
            <NotebookStyles />
            <div className="flex flex-col h-full gap-6">
                {/* Header Area - Title & Global Controls */}
                {activeNote && (
                    <div className="flex flex-col gap-4 px-1 shrink-0">
                        <div className="flex items-center justify-between">
                            <input
                                type="text"
                                value={localTitle}
                                onChange={(e) => setLocalTitle(e.target.value)}
                                placeholder="Titel der Notiz..."
                                className="text-4xl font-black bg-transparent border-none focus:ring-0 text-zinc-900 p-0 tracking-tighter uppercase italic w-full"
                            />
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-8 py-3 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-zinc-800 transition-all shadow-xl active:scale-95 shrink-0"
                            >
                                <Save className="w-5 h-5" /> Alles Speichern
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-2xl border border-zinc-200 shadow-sm">
                                    <button
                                        disabled={currentPageIndex === 0}
                                        onClick={() => handlePageChange(currentPageIndex - 1)}
                                        className="p-1 hover:bg-zinc-100 rounded-lg disabled:opacity-20 transition-all"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 min-w-[80px] text-center text-zinc-500">
                                        Seite {currentPageIndex + 1} / {localPages.length}
                                    </span>
                                    <button
                                        disabled={currentPageIndex === localPages.length - 1}
                                        onClick={() => handlePageChange(currentPageIndex + 1)}
                                        className="p-1 hover:bg-zinc-100 rounded-lg disabled:opacity-20 transition-all"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddPage}
                                    className="flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all active:scale-95 shadow-sm"
                                >
                                    <Plus className="w-3 h-3" /> Neue Seite
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="flex-1 flex gap-8 min-h-0 overflow-hidden items-start">
                    {/* Sidebar - Note List */}
                    <div className="w-72 flex flex-col h-full bg-[var(--background-surface)]/60 backdrop-blur-md rounded-[2rem] border border-[var(--border)] shrink-0 shadow-sm overflow-hidden transition-all hover:bg-[var(--background-surface)]/80">
                        <div className="p-6 flex flex-col gap-6 h-full">
                            <div className="flex items-center justify-between px-1 border-b border-zinc-100 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-amber-100 rounded-xl">
                                        <PenTool className="w-4 h-4 text-amber-700" />
                                    </div>
                                    <h2 className="text-xl font-black uppercase italic tracking-tighter text-zinc-800">Notizen</h2>
                                </div>
                                <button
                                    onClick={handleCreateNote}
                                    className="p-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all shadow-md active:scale-90"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="relative px-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Durchsuchen..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-100/50 border border-zinc-200/50 rounded-2xl text-[11px] font-bold uppercase tracking-wider focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all outline-none"
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-3 px-1 custom-scrollbar pt-2">
                                {filteredNotes.map(note => (
                                    <NoteCard
                                        key={note.id}
                                        note={note}
                                        isSelected={selectedNoteId === note.id}
                                        onClick={() => setSelectedNoteId(note.id)}
                                        onTogglePin={togglePin}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Central Editor Area */}
                    <div className="flex-1 flex flex-col h-full overflow-visible gap-4 relative z-0">
                        <div className="shrink-0 relative z-50">
                            <NotebookToolbar editor={editor} />
                        </div>
                        {activeNote ? (
                            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar flex justify-center">
                                <div className="notebook-paper-container mb-20">
                                    {/* Spiralbindung */}
                                    <div className="notebook-spiral">
                                        {Array.from({ length: 22 }).map((_, i) => (
                                            <div key={i} className="notebook-spiral-hole" />
                                        ))}
                                    </div>

                                    {/* Roter Randstrich */}
                                    <div className="notebook-margin-line" />

                                    {/* Editor Container */}
                                    <div className="notebook-editor-container">
                                        <NotebookEditor
                                            key={`${selectedNoteId}-${currentPageIndex}`}
                                            content={localPages[currentPageIndex]}
                                            onChange={updateCurrentPageContent}
                                            onEditorReady={setEditor}
                                            placeholder="Schreibe hier..."
                                            onPageFull={handlePageFull}
                                            onBackspaceAtStart={handleBackspaceAtStart}
                                            maxLines={26}
                                            focusPos={focusPos}
                                        />
                                    </div>

                                    {/* Seitenzahl unten rechts */}
                                    <div className="notebook-page-number">
                                        Seite {currentPageIndex + 1}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-20 scale-150 pt-20">
                                <Book className="w-24 h-24 mb-4" />
                                <p className="text-xl font-black uppercase italic tracking-widest text-zinc-900">Wähle deine Notizen</p>
                            </div>
                        )}
                    </div>

                    {/* Table of Contents - RHS */}
                    {activeNote && (
                        <div className="w-64 flex flex-col h-full shrink-0 overflow-hidden relative z-10">
                            <TableOfContents
                                items={tableOfContents}
                                currentPageIndex={currentPageIndex}
                                onPageChange={handlePageChange}
                            />

                            <div className="mt-4 pt-6 border-t border-zinc-100 shrink-0 px-1 bg-white/40 backdrop-blur-sm rounded-[2rem] p-4 border border-zinc-200">
                                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 text-center">Schnellauswahl</div>
                                <div className="grid grid-cols-4 gap-2">
                                    {localPages.map((_, i) => (
                                        <div key={i} className="relative group">
                                            <button
                                                onClick={() => handlePageChange(i)}
                                                className={cn(
                                                    "w-full h-9 rounded-xl flex items-center justify-center text-[10px] font-black transition-all",
                                                    currentPageIndex === i
                                                        ? "bg-amber-100 text-amber-700 border border-amber-200 shadow-sm scale-110"
                                                        : "bg-zinc-100 text-zinc-400 border border-transparent hover:bg-zinc-200"
                                                )}
                                            >
                                                {i + 1}
                                            </button>
                                            {/* Delete button - only show if more than 1 page */}
                                            {localPages.length > 1 && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeletePage(i); }}
                                                    className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 text-[8px]"
                                                    title={`Seite ${i + 1} löschen`}
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}

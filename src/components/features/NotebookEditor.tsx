'use client';

import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Underline } from '@tiptap/extension-underline';
import { FontFamily } from '@tiptap/extension-font-family';
import {
    Bold, Italic, Underline as UnderlineIcon,
    Highlighter, List, ListOrdered,
    Undo, Redo, Heading2,
    Type as TextIcon,
} from 'lucide-react';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Node } from '@tiptap/core';

// ─── TAB NODE ────────────────────────────────────────────────────────────────
const TabNode = Node.create({
    name: 'tab',
    group: 'inline',
    inline: true,
    selectable: true,
    atom: true,
    parseHTML() {
        return [{ tag: 'span[data-tab]' }];
    },
    renderHTML() {
        return ['span', { 'data-tab': 'true', 'class': 'tab-char' }, '\u00A0'];
    },
    addCommands() {
        return {
            insertTab: () => ({ commands }: { commands: any }) => {
                return commands.insertContent({ type: this.name });
            },
        } as any;
    },
});

const TabKeyExtension = Extension.create({
    name: 'tabKey',
    addKeyboardShortcuts() {
        return {
            Tab: () => (this.editor as any).commands.insertTab(),
        };
    },
});

// ─── TOOLBAR ─────────────────────────────────────────────────────────────────
export function NotebookToolbar({ editor }: { editor: any }) {
    const [lastFontFamily, setLastFontFamily] = useState("'EB Garamond', serif");

    const fonts = [
        { name: 'EB Garamond', value: "'EB Garamond', serif" },
        { name: 'Caveat', value: "'Caveat', cursive" },
        { name: 'Patrick Hand', value: "'Patrick Hand', cursive" },
        { name: 'Special Elite', value: "'Special Elite', cursive" },
        { name: 'Indie Flower', value: "'Indie Flower', cursive" },
        { name: 'Shadows Into Light', value: "'Shadows Into Light', cursive" },
        { name: 'Architects Daughter', value: "'Architects Daughter', cursive" },
        { name: 'Gloria Hallelujah', value: "'Gloria Hallelujah', cursive" },
        { name: 'Coming Soon', value: "'Coming Soon', cursive" },
        { name: 'Kalam', value: "'Kalam', cursive" },
    ];

    const [, setUpdate] = useState(0);
    useEffect(() => {
        if (!editor) return;
        const handler = () => setUpdate(v => v + 1);
        editor.on('transaction', handler);
        return () => editor.off('transaction', handler);
    }, [editor]);

    if (!editor) {
        return <div className="h-[52px] w-full bg-white/50 border border-zinc-200 rounded-2xl animate-pulse" />;
    }

    const Btn = ({ onClick, active, children, title }: any) => (
        <button
            onMouseDown={(e) => { e.preventDefault(); onClick(); }}
            title={title}
            className={`p-2 rounded-lg transition-all ${active ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-100'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="flex flex-wrap items-center gap-1 p-1.5 bg-white/90 backdrop-blur border border-zinc-200/50 rounded-2xl shadow-sm w-fit mx-auto">
            <select
                onChange={(e) => { setLastFontFamily(e.target.value); editor.chain().focus().setFontFamily(e.target.value).run(); }}
                value={editor.getAttributes('textStyle').fontFamily || lastFontFamily}
                className="text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1.5 outline-none cursor-pointer min-w-[140px]"
            >
                {fonts.map(f => (
                    <option
                        key={f.value}
                        value={f.value}
                        style={{ fontFamily: f.value }}
                    >
                        {f.name}
                    </option>
                ))}
            </select>

            <div className="w-px h-6 bg-zinc-200 mx-1" />

            <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Überschrift">
                <Heading2 className="w-4 h-4" />
            </Btn>
            <Btn onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')} title="Text">
                <TextIcon className="w-4 h-4" />
            </Btn>

            <div className="w-px h-6 bg-zinc-200 mx-1" />

            <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Fett">
                <Bold className="w-4 h-4" />
            </Btn>
            <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Kursiv">
                <Italic className="w-4 h-4" />
            </Btn>
            <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Unterstrichen">
                <UnderlineIcon className="w-4 h-4" />
            </Btn>

            <div className="w-px h-6 bg-zinc-200 mx-1" />

            <Btn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Markieren">
                <Highlighter className="w-4 h-4" />
            </Btn>

            <div className="w-px h-6 bg-zinc-200 mx-1" />

            <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Liste">
                <List className="w-4 h-4" />
            </Btn>
            <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Nummeriert">
                <ListOrdered className="w-4 h-4" />
            </Btn>

            <div className="w-px h-6 bg-zinc-200 mx-1" />

            <Btn onClick={() => editor.chain().focus().undo().run()} title="Rückgängig">
                <Undo className="w-4 h-4" />
            </Btn>
            <Btn onClick={() => editor.chain().focus().redo().run()} title="Wiederholen">
                <Redo className="w-4 h-4" />
            </Btn>
        </div>
    );
}

// ─── EDITOR ──────────────────────────────────────────────────────────────────
interface NotebookEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    onEditorReady?: (editor: any) => void;
    onPageFull?: (overflowContent?: string) => void;
    onBackspaceAtStart?: () => void;
    maxLines?: number;
    focusPos?: 'start' | 'end';
}

const LINE_HEIGHT = 32; // Pixel pro Zeile

export function NotebookEditor({
    content,
    onChange,
    placeholder,
    onEditorReady,
    onPageFull,
    onBackspaceAtStart,
    maxLines = 26,
    focusPos = 'end',
}: NotebookEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const hasTriggeredRef = useRef(false);

    // Berechne maximale Höhe basierend auf Zeilen
    const maxHeight = maxLines * LINE_HEIGHT;

    const editor = useEditor({
        immediatelyRender: false,
        autofocus: focusPos === 'start' ? 'start' : 'end',
        extensions: [
            StarterKit.configure({
                heading: { levels: [2] },
                bulletList: false,
                orderedList: false,
            }),
            BulletList.configure({ HTMLAttributes: { class: 'list-disc ml-4' } }),
            OrderedList.configure({ HTMLAttributes: { class: 'list-decimal ml-4' } }),
            ListItem,
            Underline,
            TextStyle,
            Color,
            FontFamily,
            TabNode,
            TabKeyExtension,
            Highlight.configure({ multicolor: true }),
            Placeholder.configure({
                placeholder: placeholder || 'Schreibe hier...',
                emptyNodeClass: 'is-empty',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);

            // Prüfe Überlauf
            if (containerRef.current && onPageFull && !hasTriggeredRef.current) {
                const proseMirror = containerRef.current.querySelector('.ProseMirror') as HTMLElement;
                if (proseMirror) {
                    const currentHeight = proseMirror.scrollHeight;
                    if (currentHeight > maxHeight) {
                        hasTriggeredRef.current = true;

                        // Wir extrahieren den letzten Absatz/Knoten
                        const doc = editor.state.doc;
                        const lastNode = doc.lastChild;

                        if (lastNode && doc.childCount > 1) {
                            // Berechne HTML des letzten Knotens (sehr vereinfacht)
                            // In einer perfekten Welt würden wir einen HTML-Serializer nutzen
                            const overflowHtml = lastNode.type.name === 'paragraph'
                                ? `<p>${lastNode.textContent}</p>`
                                : lastNode.type.name === 'heading'
                                    ? `<h2>${lastNode.textContent}</h2>`
                                    : `<p>${lastNode.textContent}</p>`;

                            // Entferne den letzten Knoten aus diesem Editor
                            editor.commands.deleteRange({
                                from: doc.content.size - lastNode.nodeSize,
                                to: doc.content.size
                            });

                            // Triggere Seitenwechsel mit dem "mitgenommenen" Inhalt
                            setTimeout(() => {
                                onPageFull(overflowHtml);
                            }, 50);
                        } else {
                            // Nur eine Zeile, aber sie ist zu hoch (z.B. sehr viel Text in einem P)
                            // Hier können wir nicht einfach löschen ohne Datenverlust
                            setTimeout(() => {
                                onPageFull();
                            }, 50);
                        }
                    }
                }
            }
        },
        editorProps: {
            attributes: {
                class: 'notebook-editor-prose focus:outline-none',
            },
            handleKeyDown: (view, event) => {
                if (event.key === 'Backspace') {
                    const { selection } = view.state;
                    // Wenn Cursor ganz am Anfang ist
                    if (selection.empty && selection.from === 1) {
                        if (onBackspaceAtStart) {
                            onBackspaceAtStart();
                            return true;
                        }
                    }
                }
                return false;
            }
        },
    });

    // Reset trigger wenn Content sich ändert (Seitenwechsel)
    useEffect(() => {
        hasTriggeredRef.current = false;
    }, [content]);

    // Sync content when it changes externally
    useEffect(() => {
        if (editor && content !== editor.getHTML() && !editor.isFocused) {
            editor.commands.setContent(content, { emitUpdate: false });
            // Bei Wechsel den Fokus setzen
            if (focusPos === 'start') {
                editor.commands.focus('start');
            } else {
                editor.commands.focus('end');
            }
        }
    }, [content, editor, focusPos]);

    // Notify parent when editor is ready
    useEffect(() => {
        if (editor && onEditorReady) {
            onEditorReady(editor);
        }
    }, [editor, onEditorReady]);

    if (!editor) return null;

    return (
        <div
            ref={containerRef}
            style={{
                overflow: 'hidden',
                height: `${maxHeight}px`,
                maxHeight: `${maxHeight}px`,
            }}
        >
            <EditorContent editor={editor} />
        </div>
    );
}

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
    Undo, Redo, Palette, Heading2,
    Type as TextIcon,
    Indent, Smile, ChevronRight
} from 'lucide-react';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { useEffect, useState, useCallback } from 'react';
import { Node } from '@tiptap/core';

const TabNode = Node.create({
    name: 'tab',
    group: 'inline',
    inline: true,
    selectable: true,
    atom: true, // Deletes as single unit

    parseHTML() {
        return [{ tag: 'span[data-tab]' }];
    },

    renderHTML() {
        return ['span', {
            'data-tab': 'true',
            'class': 'tab-char'
        }, '\u00A0']; // Non-breaking space as content
    },

    addCommands() {
        return {
            insertTab: () => ({ commands }: { commands: any }) => {
                return commands.insertContent({ type: this.name });
            },
        } as any;
    },
});

// Custom Tab Keyboard Shortcut Extension
const TabKeyExtension = Extension.create({
    name: 'tabKey',
    addKeyboardShortcuts() {
        return {
            Tab: () => {
                return (this.editor as any).commands.insertTab();
            },
        };
    },
});

// Import React for hooks
import React from 'react';

export function NotebookToolbar({ editor }: { editor: any }) {
    const [highlightColor, setHighlightColor] = useState('#fef08a');
    const [textColor, setTextColor] = useState('#000000');
    // Track last used styles to persist them when content is empty
    const [lastStyles, setLastStyles] = useState({
        fontFamily: "'EB Garamond', serif",
        heading: 0, // 0 means paragraph
    });

    const fonts = [
        { name: 'EB Garamond', value: "'EB Garamond', serif" },
        { name: 'Caveat (Handschrift)', value: "'Caveat', cursive" },
        { name: 'Special Elite (Schreibmaschine)', value: "'Special Elite', cursive" },
        { name: 'Playfair Display', value: "'Playfair Display', serif" },
        { name: 'Roboto Mono', value: "'Roboto Mono', monospace" },
        { name: 'Patrick Hand', value: "'Patrick Hand', cursive" },
    ];

    // Force re-render on editor transactions to update toolbar state
    const [, setUpdateCounter] = useState(0);
    const forceUpdate = useCallback(() => setUpdateCounter(v => v + 1), []);

    useEffect(() => {
        if (!editor) return;

        const handleTransaction = () => {
            forceUpdate();
        };

        editor.on('transaction', handleTransaction);
        return () => {
            editor.off('transaction', handleTransaction);
        };
    }, [editor, forceUpdate]);

    // Sync toolbar state with current selection/cursor position
    useEffect(() => {
        if (!editor) return;

        // Highlight color
        const highlightAttr = editor.getAttributes('highlight').color;
        if (highlightAttr) {
            setHighlightColor(highlightAttr);
        }

        // Text color
        const colorAttr = editor.getAttributes('textStyle').color;
        if (colorAttr) {
            setTextColor(colorAttr);
        }

        // Persistent Styles Sync
        const fontAttr = editor.getAttributes('textStyle').fontFamily;
        const currentHeading = editor.isActive('heading', { level: 1 }) ? 1 : (editor.isActive('heading', { level: 2 }) ? 2 : 0);

        if (fontAttr || currentHeading !== undefined) {
            setLastStyles(prev => ({
                fontFamily: fontAttr || prev.fontFamily,
                heading: currentHeading !== undefined ? currentHeading : prev.heading
            }));
        }
    }, [editor?.state.selection]);

    // Apply persistent styles when editor is focused but empty
    useEffect(() => {
        if (!editor || !editor.isFocused) return;

        const currentFont = editor.getAttributes('textStyle').fontFamily;
        if (!currentFont && lastStyles.fontFamily) {
            editor.chain().focus().setFontFamily(lastStyles.fontFamily).run();
        }
    }, [editor?.isFocused, editor?.state.selection, lastStyles.fontFamily]);

    if (!editor) {
        return <div className="h-[60px] w-full bg-white/50 border border-zinc-200 rounded-3xl animate-pulse" />;
    }

    const ToolbarButton = ({
        onClick,
        isActive = false,
        children,
        title,
        className = ""
    }: {
        onClick: () => void;
        isActive?: boolean;
        children: React.ReactNode;
        title: string;
        className?: string;
    }) => (
        <button
            onMouseDown={(e) => {
                e.preventDefault();
                onClick();
            }}
            title={title}
            className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${isActive
                ? 'bg-zinc-900 text-white shadow-[0_8px_16px_rgba(0,0,0,0.2)] scale-105 active:scale-95'
                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 active:scale-95'
                } ${className}`}
        >
            {children}
        </button>
    );

    return (
        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white/80 backdrop-blur-xl border border-zinc-200/50 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.05)] w-fit mx-auto animate-in fade-in slide-in-from-top-4 duration-700 relative z-[60]">
            {/* Font Selector - Premium Styled */}
            <div className="flex items-center gap-1 px-1">
                <div className="relative group">
                    <select
                        onChange={(e) => {
                            const newFont = e.target.value;
                            setLastStyles(prev => ({ ...prev, fontFamily: newFont }));
                            editor.chain().focus().setFontFamily(newFont).run();
                        }}
                        className="text-[11px] font-black uppercase tracking-[0.15em] bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-2.5 outline-none cursor-pointer hover:bg-zinc-100/80 hover:border-zinc-300 transition-all font-sans min-w-[150px] appearance-none"
                        value={editor.getAttributes('textStyle').fontFamily || lastStyles.fontFamily}
                    >
                        {fonts.map(f => (
                            <option key={f.value} value={f.value}>{f.name}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 group-hover:text-zinc-600 transition-colors">
                        <ChevronRight className="w-3 h-3 rotate-90" />
                    </div>
                </div>
            </div>

            <div className="w-px h-8 bg-zinc-200/60 mx-1" />

            {/* Document Structure Section */}
            <div className="flex items-center gap-1 bg-zinc-50/50 p-1 rounded-2xl border border-zinc-100/50">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Überschrift (Groß)"
                >
                    <Heading2 className="w-4.5 h-4.5" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    isActive={editor.isActive('paragraph')}
                    title="Standard Text"
                >
                    <TextIcon className="w-4.5 h-4.5" />
                </ToolbarButton>
            </div>

            <div className="w-px h-8 bg-zinc-200/60 mx-1" />

            {/* Formatting Section */}
            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Fett (Strg+B)"
                >
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Kursiv (Strg+I)"
                >
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="Unterstrichen (Strg+U)"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </ToolbarButton>
            </div>

            <div className="w-px h-8 bg-zinc-200/60 mx-1" />

            {/* Color & Highlight Section */}
            <div className="flex items-center gap-1 bg-amber-50/30 p-1 rounded-2xl border border-amber-100/20">
                <div className="flex items-center gap-1 px-1 group">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHighlight({ color: highlightColor }).run()}
                        isActive={editor.isActive('highlight')}
                        title="Hintergrund markieren"
                        className={editor.isActive('highlight') ? '!bg-amber-400 !text-zinc-900 border-amber-500 shadow-amber-200' : ''}
                    >
                        <Highlighter className="w-4 h-4" />
                    </ToolbarButton>
                    <div className="relative w-6 h-8 flex items-center justify-center">
                        <input
                            type="color"
                            onChange={(e) => {
                                const newColor = e.target.value;
                                setHighlightColor(newColor);
                                if (editor.isActive('highlight')) {
                                    editor.chain().focus().setHighlight({ color: newColor }).run();
                                }
                            }}
                            value={highlightColor}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            title="Markierfarbe ändern"
                        />
                        <div
                            className="w-4 h-4 rounded-full border border-zinc-300 shadow-sm"
                            style={{ backgroundColor: highlightColor }}
                        />
                    </div>
                </div>

                <div className="w-px h-6 bg-amber-200/30 mx-0.5" />

                <div className="flex items-center gap-1 px-1 group">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <Palette className="w-4 h-4 text-zinc-400 peer-hover:text-zinc-900 transition-colors" />
                        <input
                            type="color"
                            onInput={(e) => {
                                const newColor = (e.target as HTMLInputElement).value;
                                setTextColor(newColor);
                                editor.chain().focus().setColor(newColor).run();
                            }}
                            value={textColor}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            title="Textfarbe ändern"
                        />
                        <div
                            className="absolute bottom-1 w-5 h-1 rounded-full shadow-inner"
                            style={{ backgroundColor: textColor }}
                        />
                    </div>
                </div>
            </div>

            <div className="w-px h-8 bg-zinc-200/60 mx-1" />

            {/* Lists Section */}
            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Aufzählungsliste"
                >
                    <List className="w-4.5 h-4.5" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Nummerierte Liste"
                >
                    <ListOrdered className="w-4.5 h-4.5" />
                </ToolbarButton>
            </div>

            <div className="w-px h-8 bg-zinc-200/60 mx-1" />

            {/* Emoji Section */}
            <div className="relative group/emoji">
                <ToolbarButton
                    onClick={() => { }}
                    title="Emoji einfügen"
                >
                    <Smile className="w-4.5 h-4.5" />
                </ToolbarButton>
                <div className="absolute top-full right-0 mt-2 p-3 bg-white border border-zinc-200 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover/emoji:opacity-100 group-hover/emoji:visible transition-all duration-200 z-[1000] min-w-[200px]">
                    <div className="grid grid-cols-6 gap-2">
                        {['😊', '😂', '🥰', '😍', '🤔', '🙄', '🤫', '🥳', '😎', '🤩', '😭', '🤯', '✨', '🎉', '🔥', '❤️', '👍', '🙏', '💡', '📅', '🚀', '✅', '⭐', '📍'].map(emoji => (
                            <button
                                key={emoji}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    editor.chain().focus().insertContent(emoji).run();
                                }}
                                className="text-xl hover:scale-125 transition-transform p-1 rounded-lg hover:bg-zinc-50"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-px h-8 bg-zinc-200/60 mx-1" />

            {/* History Section */}
            <div className="flex items-center gap-0.5 ml-1">
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    title="Rückgängig (Strg+Z)"
                    className="!p-2 hover:bg-rose-50 hover:text-rose-600"
                >
                    <Undo className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    title="Wiederholen (Strg+Y)"
                    className="!p-2 hover:bg-emerald-50 hover:text-emerald-600"
                >
                    <Redo className="w-4 h-4" />
                </ToolbarButton>
            </div>
        </div>
    );
}

interface NotebookEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    onEditorReady?: (editor: any) => void;
    extensions?: any[];
}

export function NotebookEditor({ content, onChange, placeholder, onEditorReady, extensions }: NotebookEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        autofocus: 'start',
        extensions: extensions || [
            StarterKit.configure({
                heading: {
                    levels: [2],
                },
                bulletList: false,
                orderedList: false,
            }),
            BulletList.configure({
                HTMLAttributes: {
                    class: 'list-disc ml-4 space-y-1',
                },
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: 'list-decimal ml-4 space-y-1',
                },
            }),
            ListItem,
            Underline,
            TextStyle,
            Color,
            FontFamily,
            TabNode,
            TabKeyExtension,
            Highlight.configure({ multicolor: true }),
            Placeholder.configure({
                placeholder: placeholder || 'Schreibe hier deine Gedanken auf...',
                emptyNodeClass: 'is-empty',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: 'focus:outline-none min-h-[70vh] notebook-font text-zinc-900',
                style: 'font-size: 19px;',
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            if (!editor.isFocused) {
                editor.commands.setContent(content, { emitUpdate: false });
            }
        }
    }, [content, editor]);

    useEffect(() => {
        if (editor && onEditorReady) {
            onEditorReady(editor);
        }
    }, [editor, onEditorReady]);

    if (!editor) return null;

    return <EditorContent editor={editor} className="notebook-editor-content" />;
}

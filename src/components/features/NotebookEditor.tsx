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
    Undo, Redo, Palette, Heading1, Heading2,
    Type as TextIcon,
    Indent
} from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';

// Custom Tab Extension
const TabExtension = Extension.create({
    name: 'tabKey',
    addOptions() {
        return {
            size: 4,
        }
    },
    addKeyboardShortcuts() {
        return {
            Tab: () => {
                const size = this.options.size;
                const spaces = '\u00A0'.repeat(size);
                return this.editor.commands.insertContent(spaces);
            },
        };
    },
});

export function NotebookToolbar({ editor }: { editor: any }) {
    const [tabSize, setTabSize] = useState(4);
    const [highlightColor, setHighlightColor] = useState('#fef08a');

    const fonts = [
        { name: 'EB Garamond', value: "'EB Garamond', serif" },
        { name: 'Caveat (Handschrift)', value: "'Caveat', cursive" },
        { name: 'Special Elite (Schreibmaschine)', value: "'Special Elite', cursive" },
        { name: 'Playfair Display', value: "'Playfair Display', serif" },
        { name: 'Roboto Mono', value: "'Roboto Mono', monospace" },
        { name: 'Patrick Hand', value: "'Patrick Hand', cursive" },
    ];

    // Update highlight color state when editor selection changes
    useEffect(() => {
        if (!editor) return;
        const color = editor.getAttributes('highlight').color;
        if (color) {
            setHighlightColor(color);
        }
    }, [editor?.state.selection]);

    // Update tab size in extension options safely
    useEffect(() => {
        if (editor && !editor.isDestroyed) {
            const extension = editor.extensionManager.extensions.find((ext: any) => ext.name === 'tabKey');
            if (extension) {
                extension.options.size = tabSize;
            }
        }
    }, [tabSize, editor]);

    if (!editor) {
        return <div className="h-[53px] w-full bg-white/50 border border-zinc-200 rounded-2xl animate-pulse" />;
    }

    const ToolbarButton = ({
        onClick,
        isActive = false,
        children,
        title
    }: {
        onClick: () => void;
        isActive?: boolean;
        children: React.ReactNode;
        title: string;
    }) => (
        <button
            onClick={onClick}
            title={title}
            className={`p-2 rounded-lg transition-all ${isActive
                ? 'bg-zinc-800 text-white shadow-md'
                : 'text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800'
                }`}
        >
            {children}
        </button>
    );

    return (
        <div className="flex flex-wrap items-center gap-1 p-1.5 bg-white border border-zinc-200 rounded-2xl shadow-sm">
            {/* Font Selector */}
            <div className="flex items-center gap-1 px-1">
                <select
                    onChange={(e) => {
                        editor.chain().focus().setFontFamily(e.target.value).run();
                    }}
                    className="text-[10px] font-black uppercase tracking-widest bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-zinc-100 transition-all font-sans min-w-[120px]"
                    value={editor.getAttributes('textStyle').fontFamily || "'EB Garamond', serif"}
                >
                    {fonts.map(f => (
                        <option key={f.value} value={f.value}>{f.name}</option>
                    ))}
                </select>
            </div>

            <div className="w-px h-6 bg-zinc-200 mx-1" />

            {/* Tab Distance */}
            <div className="flex items-center gap-1 px-2 group" title="Tab-Abstand">
                <Indent className="w-3.5 h-3.5 text-zinc-400" />
                <select
                    onChange={(e) => setTabSize(parseInt(e.target.value))}
                    className="text-[10px] font-black bg-transparent outline-none cursor-pointer text-zinc-600 hover:text-zinc-900 font-sans"
                    value={tabSize}
                >
                    <option value="2">2x</option>
                    <option value="4">4x</option>
                    <option value="6">6x</option>
                    <option value="8">8x</option>
                </select>
            </div>

            <div className="w-px h-6 bg-zinc-200 mx-1" />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                title="Überschrift 1"
            >
                <Heading1 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                title="Überschrift 2"
            >
                <Heading2 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setParagraph().run()}
                isActive={editor.isActive('paragraph')}
                title="Normaler Text"
            >
                <TextIcon className="w-4 h-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-zinc-200 mx-1" />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Fett"
            >
                <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Kursiv"
            >
                <Italic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                title="Unterstrichen"
            >
                <UnderlineIcon className="w-4 h-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-zinc-200 mx-1" />

            {/* Highlight with Color Picker */}
            <div className="flex items-center gap-1 px-1">
                <button
                    onClick={() => editor.chain().focus().toggleHighlight({ color: highlightColor }).run()}
                    className={`p-2 rounded-lg transition-all ${editor.isActive('highlight')
                        ? 'bg-zinc-800 text-white shadow-md'
                        : 'text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800'}`}
                    title="Markieren"
                >
                    <Highlighter className="w-4 h-4" />
                </button>
                <input
                    type="color"
                    onChange={(e) => {
                        const newColor = e.target.value;
                        setHighlightColor(newColor);
                        if (editor.isActive('highlight')) {
                            editor.chain().focus().toggleHighlight({ color: newColor }).run();
                        }
                    }}
                    value={highlightColor}
                    className="w-4 h-8 p-0 border-none bg-transparent cursor-pointer"
                    title="Markierfarbe"
                />
            </div>

            <div className="flex items-center gap-2 border-l border-zinc-200 ml-1 pl-2">
                <Palette className="w-4 h-4 text-zinc-400" />
                <input
                    type="color"
                    onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
                    value={editor.getAttributes('textStyle').color || '#000000'}
                    className="w-4 h-8 p-0 border-none bg-transparent cursor-pointer"
                    title="Textfarbe"
                />
            </div>

            <div className="w-px h-6 bg-zinc-200 mx-1" />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Aufzählung"
            >
                <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Nummerierung"
            >
                <ListOrdered className="w-4 h-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-zinc-200 mx-1" />

            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Rückgängig">
                <Undo className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Wiederholen">
                <Redo className="w-4 h-4" />
            </ToolbarButton>
        </div>
    );
}

interface NotebookEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    onEditorReady?: (editor: any) => void;
}

export function NotebookEditor({ content, onChange, placeholder, onEditorReady }: NotebookEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2],
                },
            }),
            Underline,
            TextStyle,
            Color,
            FontFamily,
            TabExtension,
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
                style: 'padding-left: 82px; padding-right: 60px; font-size: 19px;',
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

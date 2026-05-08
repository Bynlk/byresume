'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    label?: string
    placeholder?: string
}

export default function RichTextEditor({
    value,
    onChange,
    label,
    placeholder = ''
}: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                link: false,
                underline: false,
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm dark:prose-invert max-w-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                </label>
            )}
            <div className="border border-input rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:border-transparent transition-all">
                {/* Toolbar */}
                <div className="bg-muted/50 border-b border-input p-1 flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={cn(
                            "p-1.5 rounded-sm hover:bg-muted text-muted-foreground transition-colors",
                            editor.isActive('bold') && "bg-background text-foreground shadow-sm"
                        )}
                        title="加粗"
                        aria-label="加粗"
                        aria-pressed={editor.isActive('bold')}
                    >
                        <Bold size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={cn(
                            "p-1.5 rounded-sm hover:bg-muted text-muted-foreground transition-colors",
                            editor.isActive('italic') && "bg-background text-foreground shadow-sm"
                        )}
                        title="斜体"
                        aria-label="斜体"
                        aria-pressed={editor.isActive('italic')}
                    >
                        <Italic size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={cn(
                            "p-1.5 rounded-sm hover:bg-muted text-muted-foreground transition-colors",
                            editor.isActive('underline') && "bg-background text-foreground shadow-sm"
                        )}
                        title="下划线"
                        aria-label="下划线"
                        aria-pressed={editor.isActive('underline')}
                    >
                        <UnderlineIcon size={16} />
                    </button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={cn(
                            "p-1.5 rounded-sm hover:bg-muted text-muted-foreground transition-colors",
                            editor.isActive('bulletList') && "bg-background text-foreground shadow-sm"
                        )}
                        title="无序列表"
                        aria-label="无序列表"
                        aria-pressed={editor.isActive('bulletList')}
                    >
                        <List size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={cn(
                            "p-1.5 rounded-sm hover:bg-muted text-muted-foreground transition-colors",
                            editor.isActive('orderedList') && "bg-background text-foreground shadow-sm"
                        )}
                        title="有序列表"
                        aria-label="有序列表"
                        aria-pressed={editor.isActive('orderedList')}
                    >
                        <ListOrdered size={16} />
                    </button>
                </div>
                <EditorContent editor={editor} className="cursor-text" />
            </div>
        </div>
    )
}

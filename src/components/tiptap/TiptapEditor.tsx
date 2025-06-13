import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';

import TiptapToolbar from './TiptapToolbar';

interface TiptapEditorProps {
    initialContent?: string | JSONContent;
    onChange: (content: JSONContent) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ initialContent, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            ImageExtension.configure({
                inline: true,
                allowBase64: true,
            }),
            LinkExtension.configure({
                openOnClick: true,
                autolink: true,
            }),
            Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
            Blockquote,
            CodeBlock,
            BulletList,
            OrderedList,
            ListItem,

        ],
        content: initialContent || '<p></p>',
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[150px] p-2 border border-solid border-gray-300 rounded',
            },
        },
    });

    useEffect(() => {
        if (editor && initialContent) {
            const currentEditorContent = editor.getJSON();
            const initialContentAsJSON = typeof initialContent === 'string'
                ? { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: initialContent }] }] } // Simple conversion for string to JSONContent
                : initialContent;
            if (JSON.stringify(currentEditorContent) !== JSON.stringify(initialContentAsJSON)) {
                editor.commands.setContent(initialContent);
            }
        }
    }, [editor, initialContent]);


    return (
        <div style={{ border: '1px solid #d9d9d9', borderRadius: '4px', minHeight: '200px' }}>
            <TiptapToolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default TiptapEditor;
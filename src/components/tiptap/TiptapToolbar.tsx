// components/Tiptap/TiptapToolbar.tsx
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button, Space, Tooltip} from 'antd';
import {
    BoldOutlined, ItalicOutlined, StrikethroughOutlined, CodeOutlined,
    UnorderedListOutlined, OrderedListOutlined, BlockOutlined, ClearOutlined,
    RedoOutlined, UndoOutlined, FormatPainterOutlined 
} from '@ant-design/icons';
import { BsTypeH1, BsTypeH2, BsTypeH3, BsTypeH4, BsTypeH5, BsTypeH6 } from "react-icons/bs";
import { GrBlockQuote } from "react-icons/gr";



interface TiptapToolbarProps {
    editor: Editor | null;
}

type TiptapHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;


const TiptapToolbar: React.FC<TiptapToolbarProps> = ({ editor }) => {
    if (!editor) {
        return null; 
    }

    const removeLink = () => {
        editor.chain().focus().unsetLink().run();
    };

    return (
        <div style={{ marginBottom: '8px', borderBottom: '1px solid #e8e8e8', padding: '8px', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center' }}>
            <Space wrap align="baseline">
                <Tooltip title="Negrita">
                    <Button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        disabled={!editor.can().chain().focus().toggleBold().run()}
                        type={editor.isActive('bold') ? 'primary' : 'default'}
                        icon={<BoldOutlined />}
                        size="small"
                    />
                </Tooltip>
                <Tooltip title="Itálica">
                    <Button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        disabled={!editor.can().chain().focus().toggleItalic().run()}
                        type={editor.isActive('italic') ? 'primary' : 'default'}
                        icon={<ItalicOutlined />}
                        size="small"
                    />
                </Tooltip>
                <Tooltip title="Tachado">
                    <Button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        disabled={!editor.can().chain().focus().toggleStrike().run()}
                        type={editor.isActive('strike') ? 'primary' : 'default'}
                        icon={<StrikethroughOutlined />}
                        size="small"
                    />
                </Tooltip>
                <Tooltip title="Código">
                    <Button
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        disabled={!editor.can().chain().focus().toggleCode().run()}
                        type={editor.isActive('code') ? 'primary' : 'default'}
                        icon={<CodeOutlined />}
                        size="small"
                    />
                </Tooltip>
                <Tooltip title="Bloque de Código">
                    <Button
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        type={editor.isActive('codeBlock') ? 'primary' : 'default'}
                        icon={<BlockOutlined />}
                        size="small"
                    />
                </Tooltip>
                <Tooltip title="Bloque de Cita">
                    <Button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        type={editor.isActive('blockquote') ? 'primary' : 'default'}
                        icon={<GrBlockQuote />}
                        size="small"
                    />
                </Tooltip>
                <Tooltip title="Lista sin ordenar">
                    <Button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        type={editor.isActive('bulletList') ? 'primary' : 'default'}
                        icon={<UnorderedListOutlined />}
                        size="small"
                    />
                </Tooltip>
                <Tooltip title="Lista ordenada">
                    <Button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        type={editor.isActive('orderedList') ? 'primary' : 'default'}
                        icon={<OrderedListOutlined />}
                        size="small"
                    />
                </Tooltip>
                {editor.isActive('link') && (
                    <Tooltip title="Remover Enlace">
                        <Button
                            onClick={removeLink}
                            icon={<ClearOutlined />}
                            size="small"
                        />
                    </Tooltip>
                )}

                {/* Heading Buttons */}
                {[1, 2, 3, 4, 5, 6].map(level => (
                    <Tooltip key={level} title={`Título ${level}`}>
                        <Button
                            onClick={() => editor.chain().focus().toggleHeading({ level: level as TiptapHeadingLevel  }).run()}
                            type={editor.isActive('heading', { level }) ? 'primary' : 'default'}
                            icon={
                                level === 1 ? <BsTypeH1 /> :
                                level === 2 ? <BsTypeH2 /> :
                                level === 3 ? <BsTypeH3 /> :
                                level === 4 ? <BsTypeH4 /> :
                                level === 5 ? <BsTypeH5 /> :
                                <BsTypeH6 />
                            }
                            size="small"
                        />
                    </Tooltip>
                ))}

                <Tooltip title="Limpiar Formato">
                    <Button
                        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                        icon={<FormatPainterOutlined />}
                        size="small"
                    />
                </Tooltip>
                <Tooltip title="Deshacer">
                    <Button
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().chain().focus().undo().run()}
                        icon={<UndoOutlined />}
                        size="small"
                    />
                </Tooltip>
                <Tooltip title="Rehacer">
                    <Button
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().chain().focus().redo().run()}
                        icon={<RedoOutlined />}
                        size="small"
                    />
                </Tooltip>
            </Space>
        </div>
    );
};

export default TiptapToolbar;
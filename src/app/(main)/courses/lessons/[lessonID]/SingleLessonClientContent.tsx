'use client'
import React, { useEffect } from "react";
import { useGetLesson } from "@/hooks/useCourses";
import { Spin, Alert, Typography, Divider, List, Button, Space, Carousel, Tag } from 'antd';
import {
    FilePdfOutlined, FileExcelOutlined, FilePptOutlined, FileWordOutlined,
    FileImageOutlined, FileOutlined, DownloadOutlined, VideoCameraOutlined,
    ContainerOutlined, LinkOutlined 
} from '@ant-design/icons';
import YouTube from 'react-youtube'; 
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit'; 
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link'; 
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote'; 
import CodeBlock from '@tiptap/extension-code-block';
import BulletList from '@tiptap/extension-bullet-list'; 
import OrderedList from '@tiptap/extension-ordered-list'; 
import ListItem from '@tiptap/extension-list-item';
import { Video, Archivo } from "@/services/courseServices";
import './lesson.css';

const { Title, Paragraph, Text } = Typography;

interface SingleLessonClientContentProps {
    lessonID: number
}

const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FilePdfOutlined style={{ color: '#E53E3E' }} />;
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return <FileExcelOutlined style={{ color: '#276D40' }} />;
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return <FilePptOutlined style={{ color: '#D04423' }} />;
    if (fileType.includes('word') || fileType.includes('document')) return <FileWordOutlined style={{ color: '#2B579A' }} />;
    if (fileType.includes('image')) return <FileImageOutlined style={{ color: '#4A5568' }} />;
    return <FileOutlined style={{ color: '#A0AEC0' }} />;
};

const SingleLessonClientContent: React.FC<SingleLessonClientContentProps> = ({lessonID}) => {
    const {data: lesson, isLoading, isError, error} = useGetLesson(lessonID);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
            }),
            ImageExtension.configure({
                inline: true,
            }),
            LinkExtension.configure({
                openOnClick: true,
            }),
            Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }), 
            Blockquote,
            CodeBlock,
            BulletList,
            OrderedList,
            ListItem,
        ],
        content: lesson?.contenido || '', 
        editable: false, 
    }, [lesson?.contenido]);

    useEffect(() => {
        if (editor && lesson?.contenido) {
            let parsedContent;
            try {
                parsedContent = typeof lesson.contenido === 'string' ? JSON.parse(lesson.contenido) : lesson.contenido;
            } catch (e) {
                parsedContent = lesson.contenido;
                console.warn("Lesson content is not valid JSON string or already an object:", e);
            }
            if (JSON.stringify(editor.getJSON()) !== JSON.stringify(parsedContent)) {
                 editor.commands.setContent(parsedContent, false);
            }
        }
    }, [editor, lesson?.contenido]);

if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <Title level={4} style={{ marginTop: '20px' }}>Cargando lección...</Title>
            </div>
        );
    }

    if (isError) {
        return (
            <div style={{ padding: '50px', maxWidth: '900px', margin: '0 auto' }}>
                <Alert
                    message="Error al cargar la lección"
                    description={`No se pudo cargar la lección con ID ${lessonID}. ${error?.message || 'Por favor, inténtelo de nuevo.'}`}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    if (!lesson) {
        return (
            <div style={{ padding: '50px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                <Alert
                    message="Lección no encontrada"
                    description={`La lección con ID ${lessonID} no existe o no se pudo cargar.`}
                    type="warning"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
            <Title level={2} style={{ marginBottom: '15px' }}>{lesson.titulo}</Title>
            {lesson.tipo && (
                <Tag color="blue" style={{ marginBottom: '20px' }}>
                    {lesson.tipo}
                </Tag>
            )}

            <Divider orientation="left">
                <Space><VideoCameraOutlined /> Videos</Space>
            </Divider>
            {lesson.videos && lesson.videos.length > 0 ? (
                <Carousel autoplay dotPosition="bottom" style={{ marginBottom: '30px' }}>
                    {lesson.videos.map((video: Video) => (
                        <div key={video.id} style={{ display: 'flex', justifyContent: 'center' }}>
                            <YouTube
                                videoId={video.video_id}
                                opts={{
                                    height: '390',
                                    width: '640',
                                    playerVars: {
                                        autoplay: 0, // No autoplay by default
                                    },
                                }}
                                // Make it responsive
                                className="youtube-player-responsive"
                            />
                        </div>
                    ))}
                </Carousel>
            ) : (
                <Paragraph type="secondary">No hay videos para esta lección.</Paragraph>
            )}

            <Divider orientation="left">
                <Space><ContainerOutlined /> Contenido de la Lección</Space>
            </Divider>
            {/* Tiptap Rich Text Content */}
            {lesson.contenido ? (
                 <div className="lesson-content-richtext" style={{ marginBottom: '30px', background: '#f8f8f8', padding: '20px', borderRadius: '8px' }}>
                    {editor && <EditorContent editor={editor} />}
                 </div>
            ) : (
                <Paragraph type="secondary">Esta lección no tiene contenido de texto.</Paragraph>
            )}

            <Divider orientation="left">
                <Space><LinkOutlined /> Archivos Adjuntos</Space>
            </Divider>
            {lesson.archivos && lesson.archivos.length > 0 ? (
                <List
                    itemLayout="horizontal"
                    dataSource={lesson.archivos}
                    renderItem={(archivo: Archivo) => (
                        <List.Item
                            actions={[
                                <Button
                                    key="download"
                                    type="link"
                                    icon={<DownloadOutlined />}
                                    href={archivo.url}
                                    download={archivo.nombre} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    Descargar
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={getFileIcon(archivo.tipo)}
                                title={<a href={archivo.url} target="_blank" rel="noopener noreferrer">{archivo.nombre}</a>}
                                description={<Text type="secondary">{archivo.tipo}</Text>}
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <Paragraph type="secondary">No hay archivos adjuntos para esta lección.</Paragraph>
            )}
        </div>
    );
};

export default SingleLessonClientContent;
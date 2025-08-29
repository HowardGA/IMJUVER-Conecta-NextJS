'use client';

import React, { useState, useEffect } from 'react';
import {
    Form, Input, Button, Select, Upload, Space, Typography, notification, Spin, Divider, Tag, App
} from 'antd';
import {
    SaveOutlined, PlusOutlined, UploadOutlined, YoutubeOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import TiptapEditor from '@/components/tiptap/TiptapEditor';
import { UploadFile } from 'antd/es/upload/interface';

import { useCreateLesson, useGetModulesByCourse } from '@/hooks/useCourses';
import { CreateLessonFormData } from '@/services/courseServices';
import { JSONContent } from '@tiptap/react';

const { Title, Text } = Typography;
const { Option } = Select;

const getYouTubeId = (url: string) => {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?$/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : null;
};

interface AddLessonClientProps {
    courseId: number;
}

const AddLessonClient: React.FC<AddLessonClientProps> = ({ courseId }) => {
    const [form] = Form.useForm<CreateLessonFormData>();
    const [youtubeInput, setYoutubeInput] = useState<string>('');
    const [videoIds, setVideoIds] = useState<string[]>([]);
    const router = useRouter();

    const [api, contextHolder] = notification.useNotification();

    const createLessonMutation = useCreateLesson(courseId);
    const { data: modules, isLoading: modulesLoading, isError: modulesError } = useGetModulesByCourse(courseId);
    const [editorContent, setEditorContent] = useState<JSONContent | null>(null);

    useEffect(() => {
        if (modules && modules.length > 0 && !form.getFieldValue('mod_id')) {
            form.setFieldsValue({ mod_id: modules[0].mod_id });
        }
    }, [modules, form]);

    useEffect(() => {
        if (createLessonMutation.isPending) {
            api.info({ key: 'creatingLesson', message: 'Creando lección...', description: 'Por favor, espere mientras se guarda la lección.', duration: 0 });
        } else if (createLessonMutation.isSuccess) {
            api.success({ key: 'creatingLesson', message: 'Lección creada con éxito', description: 'La lección ha sido guardada exitosamente.', duration: 5 });
            form.resetFields();
            setVideoIds([]);
            setYoutubeInput('');
            setEditorContent(null);
            router.push(`/courses/${courseId}`);
        } else if (createLessonMutation.isError) {
            const errorMsg = (createLessonMutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error desconocido al crear la lección.';
            api.error({ key: 'creatingLesson', message: 'Error al crear lección', description: errorMsg, duration: 5 });
        }
    }, [createLessonMutation.isPending, createLessonMutation.isSuccess, createLessonMutation.isError, createLessonMutation.error, api, form, router, courseId]);


    const handleAddYouTubeVideo = () => {
        const id = getYouTubeId(youtubeInput);
        if (id && !videoIds.includes(id)) {
            setVideoIds(prev => [...prev, id]);
            setYoutubeInput('');
            api.info({ message: 'Video Añadido', description: `Video ID: ${id}` });
        } else if (id && videoIds.includes(id)) {
            api.warning({ message: 'Video Repetido', description: 'Este video ya ha sido añadido.' });
        } else {
            api.error({ message: 'URL Inválida', description: 'Por favor, ingrese una URL de YouTube válida.' });
        }
    };

    const handleRemoveYouTubeVideo = (idToRemove: string) => {
        setVideoIds(prev => prev.filter(id => id !== idToRemove));
        api.info({ message: 'Video Eliminado', description: `Video ID: ${idToRemove}` });
    };

    const onFinish = async (values: CreateLessonFormData) => {
        const actualFiles: File[] = values.archivos
            ? ((values.archivos as unknown) as UploadFile[]).map((file: UploadFile) => file.originFileObj as File)
            : [];

        const formData = new FormData();
        formData.append('titulo', values.titulo);
        formData.append('mod_id', values.mod_id.toString());
        formData.append('contenido', JSON.stringify(editorContent)); 
        formData.append('youtube_videos', JSON.stringify(videoIds));

        actualFiles.forEach((file) => {
            if (file) {
                formData.append('archivos', file); 
            }
        });

        console.log("Submitting FormData:", formData);
        createLessonMutation.mutate(formData);
    };

    const normFile = (e: { fileList?: UploadFile[] } | UploadFile[]): UploadFile[] => {
        if (Array.isArray(e)) {
            return e;
        }
        
        return e?.fileList || [];
    };


    if (modulesLoading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /><Text>Cargando módulos...</Text></div>;
    }

    if (modulesError) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Text type="danger">Error al cargar módulos.</Text></div>;
    }

    if (!modules || modules.length === 0) {
        return (
            <div style={{ padding: '50px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                <Title level={4}>No hay módulos disponibles</Title>
                <Text>Por favor, cree al menos un módulo para este curso antes de agregar lecciones.</Text>
                <Button type="primary" style={{ marginTop: '20px' }} onClick={() => router.push(`/main/courses/${courseId}`)}>
                    Volver al Curso
                </Button>
            </div>
        );
    }

    return (
        <App>
            {contextHolder}
            <div style={{  padding: '20px', 
        maxWidth: '900px', 
        margin: '20px auto', 
        backgroundColor: '#fff', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        boxSizing: 'border-box', 
        width: 'calc(100% - 40px)',  }}>
                <Title level={2} style={{ marginBottom: '30px', textAlign: 'center' }}>Agregar Nueva Lección</Title>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ 
                        contenido: { type: 'doc', content: [] },
                        youtube_videos: [],
                        archivos: [], 
                    }}
                    scrollToFirstError
                >
                    <Form.Item
                        name="mod_id"
                        label="Seleccionar Módulo"
                        rules={[{ required: true, message: 'Por favor, seleccione un módulo' }]}
                    >
                        <Select placeholder="Selecciona un módulo">
                            {modules?.map(module => (
                                <Option key={module.mod_id} value={module.mod_id}>
                                    {module.titulo} (Orden: {module.orden})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="titulo"
                        label="Título de la Lección"
                        rules={[{ required: true, message: 'Por favor, ingrese el título de la lección' }]}
                    >
                        <Input placeholder="Ej: Variables y Tipos de Datos" />
                    </Form.Item>

                    <Divider orientation="left">Contenido de la Lección (Texto)</Divider>
                    <Form.Item label="Editor de Contenido">
                         <TiptapEditor
                            initialContent={form.getFieldValue('contenido') || { type: 'doc', content: [] }} // Provide a default if form field is empty
                            onChange={setEditorContent}
                        />
                    </Form.Item>

                    <Divider orientation="left">Videos de YouTube</Divider>
                    <Form.Item label="Añadir Video de YouTube">
                        <Space>
                            <Input
                                placeholder="Pegar URL o ID de YouTube"
                                value={youtubeInput}
                                onChange={(e) => setYoutubeInput(e.target.value)}
                                style={{ width: 300 }}
                                prefix={<YoutubeOutlined />}
                            />
                            <Button type="dashed" onClick={handleAddYouTubeVideo} icon={<PlusOutlined />}>
                                Añadir
                            </Button>
                        </Space>
                        {videoIds.length > 0 && (
                            <div style={{ marginTop: '10px' }}>
                                <Text strong>Videos Añadidos:</Text>
                                <Space wrap style={{ marginTop: '5px' }}>
                                    {videoIds.map(id => (
                                        <Tag
                                            key={id}
                                            closable
                                            onClose={() => handleRemoveYouTubeVideo(id)}
                                            icon={<YoutubeOutlined />}
                                        >
                                            {id}
                                        </Tag>
                                    ))}
                                </Space>
                            </div>
                        )}
                    </Form.Item>

                    <Divider orientation="left">Archivos Adjuntos</Divider>
                    <Form.Item
                        name="archivos" 
                        label="Subir Archivos (PDF, PPT, Excel, etc.)"
                        valuePropName="fileList"
                        getValueFromEvent={normFile} 
                    >
                        <Upload
                            name="archivos" 
                            multiple={true}
                            beforeUpload={() => false} 
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar"
                            listType="text"
                        >
                            <Button icon={<UploadOutlined />}>Seleccionar Archivos</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item style={{ marginTop: '30px', textAlign: 'center' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            icon={<SaveOutlined />}
                            loading={createLessonMutation.isPending}
                        >
                            {createLessonMutation.isPending ? 'Creando Lección...' : 'Crear Lección'}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </App>
    );
};

export default AddLessonClient;
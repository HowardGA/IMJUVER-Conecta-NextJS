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

import { useCreateLesson, useGetModulesByCourse } from '@/hooks/useCourses';
import { CreateLessonFormData } from '@/services/courseServices'; 

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
    const [editorContent, setEditorContent] = useState<Record<string, any>>({});
    // Effect to set initial module ID once modules are loaded
    useEffect(() => {
        if (modules && modules.length > 0 && !form.getFieldValue('mod_id')) {
            form.setFieldsValue({ mod_id: modules[0].mod_id });
        }
    }, [modules, form]);

    const handleAddYouTubeVideo = () => {
        const id = getYouTubeId(youtubeInput);
        if (id && !videoIds.includes(id)) {
            setVideoIds(prev => [...prev, id]);
            setYoutubeInput('');
            api.info({ message: 'Video Añadido', description: `Video ID: ${id}` }); // <--- Use api.info
        } else if (id && videoIds.includes(id)) {
            api.warning({ message: 'Video Repetido', description: 'Este video ya ha sido añadido.' }); // <--- Use api.warning
        } else {
            api.error({ message: 'URL Inválida', description: 'Por favor, ingrese una URL de YouTube válida.' }); // <--- Use api.error
        }
    };

    const handleRemoveYouTubeVideo = (idToRemove: string) => {
        setVideoIds(prev => prev.filter(id => id !== idToRemove));
        api.info({ message: 'Video Eliminado', description: `Video ID: ${idToRemove}` }); // <--- Use api.info
    };

    const onFinish = async (values: CreateLessonFormData) => {
        const actualFiles = values.archivos ? values.archivos.map((file: any) => file.originFileObj || file) : [];

        const lessonData: CreateLessonFormData = {
            ...values,
            contenido: editorContent,
            youtube_videos: videoIds,
            archivos: actualFiles,
        };
        createLessonMutation.mutate(lessonData);
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
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
            <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
                <Title level={2} style={{ marginBottom: '30px', textAlign: 'center' }}>Agregar Nueva Lección</Title>
             
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    // initialValues handled by useEffect
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
                    <Form.Item label="Editor de Contenido" name="contenido">
                         <TiptapEditor
                            initialContent={form.getFieldValue('contenido')}
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
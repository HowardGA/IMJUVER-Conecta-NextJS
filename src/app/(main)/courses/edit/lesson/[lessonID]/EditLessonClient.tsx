'use client';

import React, { useState, useEffect } from 'react';
import {
  Form, Input, Button, Upload, Space, Typography, notification, Divider, Tag, App
} from 'antd';
import {
  SaveOutlined, PlusOutlined, UploadOutlined, YoutubeOutlined,
} from '@ant-design/icons';
import TiptapEditor from '@/components/tiptap/TiptapEditor';
import { UploadFile } from 'antd/es/upload/interface';
import { useUpdateLesson } from '@/hooks/useCourses';
import { Archivo, Lesson } from '@/services/courseServices';
import { JSONContent } from '@tiptap/react';
import { useGetLesson } from '@/hooks/useCourses';

const { Title, Text } = Typography;

const getYouTubeId = (url: string) => {
  const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?$/;
  const match = url.match(regExp);
  return (match && match[1].length === 11) ? match[1] : null;
};

interface EditLessonClientProps {
  lessonId: string;
}

const EditLessonClient: React.FC<EditLessonClientProps> = ({ lessonId }) => {
  const [form] = Form.useForm();
  const { data: lesson, isLoading, isError, error } = useGetLesson(parseInt(lessonId));
 const [youtubeInput, setYoutubeInput] = useState<string>('');
  const [videoIds, setVideoIds] = useState<string[]>([]); 
  const [existingFiles, setExistingFiles] = useState<Archivo[]>([]); 
  const [editorContent, setEditorContent] = useState<JSONContent | null>(null);
  const [api, contextHolder] = notification.useNotification();
  const updateLessonMutation = useUpdateLesson(parseInt(lessonId));

  useEffect(() => {
    if (lesson) {
      form.setFieldsValue({
        titulo: lesson.titulo,
      });
      setVideoIds(lesson.videos?.map(v => v.video_id) || []);
      setExistingFiles(lesson.archivos || []);
      console.log('EditLessonClient: Raw lesson.contenido from API (type & value):', typeof lesson.contenido, lesson.contenido);
      try {
      let contentForEditor: JSONContent;

        if (typeof lesson.contenido === 'string') {
          contentForEditor = JSON.parse(lesson.contenido);
          console.log('EditLessonClient: Parsed string content:', contentForEditor);
        } else if (lesson.contenido) {
          contentForEditor = lesson.contenido;
          console.log('EditLessonClient: Content already an object:', contentForEditor);
        } else {
          contentForEditor = { type: 'doc', content: [] };
          console.log('EditLessonClient: No content, providing empty doc.');
        }
        setEditorContent(contentForEditor);
      } catch (e) {
        console.error("Error parsing lesson content on load:", e);
        setEditorContent({ type: 'doc', content: [] });
      }
    }
  }, [lesson, form]);

   if (isLoading) {
    return (
      <App>
        <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <Title level={2}>Cargando Lección...</Title>
        </div>
      </App>
    );
  }

  if (isError) {
    console.error("Error fetching lesson:", error);
    return (
      <App>
        <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <Title level={2} type="danger">Error al cargar la lección</Title>
          <Text>{error?.message || 'Un error desconocido ha ocurrido.'}</Text>
        </div>
      </App>
    );
  }

  if (!lesson) {
    return (
      <App>
        <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <Title level={2}>Lección no encontrada</Title>
          <Text>No se pudo encontrar la lección con ID: {lessonId}</Text>
        </div>
      </App>
    );
  }

  console.log(lesson)
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

  const onFinish = async (values:Lesson) => {
    const actualFiles: File[] = values.archivos
      ? ((values.archivos as unknown) as UploadFile[]).map((file: UploadFile) => file.originFileObj as File)
      : [];

    const formData = new FormData();
    console.log(editorContent)
    formData.append('titulo', values.titulo);
    formData.append('contenido', JSON.stringify(editorContent)); 
    formData.append('youtube_videos', JSON.stringify(videoIds));
    formData.append('lec_id', lessonId.toString());
    formData.append('existing_files', JSON.stringify(existingFiles));

    actualFiles.forEach((file) => {
      if (file) {
        formData.append('archivos', file); 
      }
    });

    updateLessonMutation.mutate(formData);
    api.success({ message: 'Lección actualizada con exito'});
  };

  const normFile = (e: { fileList?: UploadFile[] } | UploadFile[]): UploadFile[] => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList || [];
  };

  return (
    <App>
      {contextHolder}
     <div style={{
          padding: '20px', 
          maxWidth: '900px',
          margin: '20px auto',
          backgroundColor: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          boxSizing: 'border-box', 
          width: 'calc(100% - 40px)',
      }}>
        <Title level={2} style={{ marginBottom: '20px', textAlign: 'center', fontSize: '1.8em' }}> 
          Editar Lección
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="titulo"
            label="Título de la Lección"
            rules={[{ required: true, message: 'Por favor, ingrese el título de la lección' }]}
          >
            <Input placeholder="Ej: Variables y Tipos de Datos" />
          </Form.Item>

          <Divider orientation="left" style={{ margin: '30px 0' }}>Contenido de la Lección (Texto)</Divider> 
          <Form.Item label="Editor de Contenido">
            <TiptapEditor
              initialContent={editorContent || { type: 'doc', content: [] }}
              onChange={setEditorContent}
            />
          </Form.Item>

          <Divider orientation="left" style={{ margin: '30px 0' }}>Videos de YouTube</Divider> 
          <Form.Item label="Añadir Video de YouTube">
            <Space
                direction={window.innerWidth < 576 ? "vertical" : "horizontal"} 
                size="small" 
                style={{ width: '100%' }} 
            >
              <Input
                placeholder="Pegar URL o ID de YouTube"
                value={youtubeInput}
                onChange={(e) => setYoutubeInput(e.target.value)}
                style={{ width: '100%' }}
                prefix={<YoutubeOutlined />}
              />
              <Button type="dashed" onClick={handleAddYouTubeVideo} icon={<PlusOutlined />} block={window.innerWidth < 576}>
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

          <Divider orientation="left" style={{ margin: '30px 0' }}>Archivos Adjuntos</Divider>
          <Form.Item
            name="archivos" 
            label="Subir Archivos (PDF, PPT, Excel, etc.)"
            valuePropName="fileList"
            getValueFromEvent={normFile} 
            extra={existingFiles.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <Text strong>Archivos existentes:</Text>
                <ul>
                  {existingFiles.map(file => (
                   <li key={file.id} style={{ wordBreak: 'break-word' }}>
                      <a href={file.url} target="_blank" rel="noopener noreferrer">
                        {file.nombre}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          >
            <Upload
              name="archivos" 
              multiple={true}
              beforeUpload={() => false} 
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar"
              listType="text"
            >
              <Button icon={<UploadOutlined />} block>Seleccionar Archivos</Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginTop: '40px', textAlign: 'center' }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SaveOutlined />}
              loading={updateLessonMutation.isPending}
              block
            >
              {updateLessonMutation.isPending ? 'Actualizando Lección...' : 'Actualizar Lección'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </App>
  );
};

export default EditLessonClient;
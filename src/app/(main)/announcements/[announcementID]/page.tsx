'use client';

import { useParams } from 'next/navigation';
import { useGetSingleAnnouncement, useDeleteAnnouncement } from "@/hooks/announcementHooks";
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { useUser } from '@/components/providers/UserProvider'; 
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import TiptapEditor from '@/components/tiptap/TiptapEditor';
import {
  Typography, Spin, Alert, Button, Divider,
  Row, Col, Badge, Modal, Form, Input,
  Checkbox, Select, DatePicker, Card, Space, Carousel
} from 'antd';
const { Title, Text } = Typography;
import { useGetAllAnnouncementCategories, useUpdateAnnouncement } from '@/hooks/announcementHooks';
import { CategoriaPublicacion, Imagen as ImageInterface, Recurso as ResourceInterface } from '@/interfaces/announcementInterface';
import { FileOutlined, PictureOutlined } from '@ant-design/icons';
import { UpdatePublicacionDto } from '@/interfaces/announcementInterface';
import { useMessage } from '@/components/providers/MessageProvider';

const { Option } = Select;

const formatDateTimeSpanish = (dateString: string | undefined): string => {
  if (!dateString) return 'Sin fecha';
  return dayjs(dateString).format('DD/MM/YYYY HH:mm');
};

declare module 'antd/lib/upload/interface' {
  interface UploadFile {
    img_id?: number;
    rec_id?: number;
  }
}

const SingleAnnouncement: React.FC = () => {
  const params = useParams();
  const id = params?.announcementID ? parseInt(params.announcementID as string, 10) : undefined;
  const { user } = useUser();
  const { data: announcement, isLoading, error, refetch } = useGetSingleAnnouncement(id ?? 0);
  const { mutateAsync: deleteAnnouncement } = useDeleteAnnouncement();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState<JSONContent | null>(null);
  const { data: categories } = useGetAllAnnouncementCategories();
  const updateMutation = useUpdateAnnouncement();
  const message = useMessage(); // Initialize useMessage hook

  // Initialize form fields when announcement data is loaded or when modal is opened
  useEffect(() => {
    if (announcement) {
      form.setFieldsValue({
        titulo: announcement.titulo,
        contenido: JSON.parse(announcement.contenido as string),
        cat_pub_id: announcement.cat_pub_id,
        fecha_evento: announcement.fecha_evento ? dayjs(announcement.fecha_evento) : null,
        visible: announcement.visible,
        destacado: announcement.destacado,
      });
      setEditorContent(JSON.parse(announcement.contenido as string));
    }
  }, [announcement, form]);

    const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({ inline: true }),
      LinkExtension.configure({ openOnClick: true }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Blockquote,
      CodeBlock,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: announcement?.contenido ? JSON.parse(announcement.contenido as string) : '',
    editable: false
  }, [announcement?.contenido]);

  const openEditModal = () => {
    // Populate the form with current announcement data
    if (announcement) {
      form.setFieldsValue({
        titulo: announcement.titulo,
        contenido: JSON.parse(announcement.contenido as string),
        cat_pub_id: announcement.cat_pub_id,
        fecha_evento: announcement.fecha_evento ? dayjs(announcement.fecha_evento) : null,
        visible: announcement.visible,
        destacado: announcement.destacado,
      });
      setEditorContent(JSON.parse(announcement.contenido as string));
    }
    setIsModalOpen(true);
  };

const handleUpdate = async (values: UpdatePublicacionDto) => {
    try {
        interface ApiUpdatePayload {
            titulo?: string;
            contenido?: string;
            cat_pub_id?: number;
            visible?: boolean;     
            destacado?: boolean;
            fecha_evento?: string;
        }
        const updatePayload: ApiUpdatePayload = { 
            titulo: values.titulo,
            contenido: JSON.stringify(editorContent),
            cat_pub_id: values.cat_pub_id,
            visible: values.visible,     
            destacado: values.destacado    
        };

        if (values.fecha_evento) {
                updatePayload.fecha_evento = values.fecha_evento; 
        }


        if (!announcement?.pub_id) {
            console.error("Announcement ID is missing");
            message.error("ID del anuncio no encontrado.");
            return;
        }

        await updateMutation.mutateAsync({
            id: announcement.pub_id,
            data: updatePayload // Pass the plain object directly
        });

        setIsModalOpen(false);
        refetch();
        message.success("Anuncio actualizado exitosamente!");
    } catch (error) {
        console.error('Update failed:', error);
        Modal.error({
            title: 'Error al actualizar',
            content: `No se pudo actualizar el anuncio: ${error instanceof Error ? error.message : 'Error desconocido'}`
        });
    }
};

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  if (isLoading) return <Spin tip="Cargando..." style={{ display: 'block', margin: '50px auto' }} />;
  if (error) return <Alert message="Error al cargar el anuncio." description={error.message} type="error" showIcon />;

  if (!announcement) return null;

  return (
    <>
      <Row gutter={24} align="top" style={{ minHeight: '400px', padding: '24px' }}>
        <Col xs={24} sm={24} md={10} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          {/* Image Carousel/Slider */}
          <Badge.Ribbon text={formatDateTimeSpanish(announcement.fecha_evento ?? '')} color="volcano">
            {announcement.imagenes && announcement.imagenes.length > 0 ? (
              <Carousel arrows infinite>
                {announcement.imagenes.map((img: ImageInterface) => (
                  <div key={img.img_id}>
                    <img
                      src={img.url}
                      alt={`Imagen de ${announcement.titulo}`}
                      style={{
                        width: '100%',
                        maxHeight: '400px',
                        objectFit: 'contain',
                        borderRadius: 8,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        display: 'block',
                        margin: 'auto'
                      }}
                    />
                  </div>
                ))}
              </Carousel>
            ) : (
              <div style={{
                width: '100%', height: '400px', backgroundColor: '#f0f0f0',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                borderRadius: 8, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', color: '#888'
              }}>
                <PictureOutlined style={{ fontSize: '48px' }} />
                <Text style={{ marginLeft: '10px' }}>No hay imágenes</Text>
              </div>
            )}
          </Badge.Ribbon>

          {/* List of Resources */}
          {announcement.recursos && announcement.recursos.length > 0 && (
            <Card title="Recursos Adicionales" style={{ marginTop: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {announcement.recursos.map((res: ResourceInterface) => (
                  <Button
                    key={res.rec_id}
                    type="link"
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<FileOutlined />}
                    style={{ justifyContent: 'flex-start', paddingLeft: 0 }}
                  >
                    {res.titulo || `Descargar ${res.url.substring(res.url.lastIndexOf('/') + 1)}`}
                  </Button>
                ))}
              </Space>
            </Card>
          )}
        </Col>

        <Col xs={24} sm={24} md={14} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          {(user?.rol_id === 1 || user?.rol_id === 3 || user?.rol_id === 6) && (
            <div style={{ marginTop: 0, textAlign: 'end', paddingRight: '1rem' }}>
              <Button type="primary" onClick={openEditModal} style={{ marginRight: 16 }}>
                Editar
              </Button>
              <Button type="default" danger onClick={() => deleteAnnouncement(announcement.pub_id)}>
                Eliminar
              </Button>
            </div>
          )}
          <Title level={2} style={{ marginBottom: 16 }}>
            {announcement.titulo}
          </Title>

          <Divider />

          <div style={{ minHeight: 150, marginBottom: 24, overflowY: 'auto',  padding: '20px', 
        maxWidth: '900px', 
        margin: '20px auto', 
        backgroundColor: '#fff', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        boxSizing: 'border-box', 
        width: 'calc(100% - 40px)',  }}>
            <EditorContent editor={editor} />
          </div>

          <Divider />

          <Space size="middle" direction="horizontal">
            <Text strong>Publicado por: </Text>
            <Text>{announcement.autor?.nombre || 'N/A'}</Text>
            <Text strong>Fecha de Creación: </Text>
            <Text>{formatDateTimeSpanish(announcement.fecha_creacion)}</Text>
            <Text strong>Última Modificación: </Text>
            <Text>{formatDateTimeSpanish(announcement.fecha_modificacion)}</Text>
          </Space>
        </Col>
      </Row>

      {/* --- Edit Modal --- */}
      <Modal
        title="Editar Anuncio"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Actualizar"
        cancelText="Cancelar"
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          style={{ overflowY: 'auto', maxHeight: '70vh' }}
        >
          <Form.Item
            name="titulo"
            label="Título"
            rules={[{ required: true, message: 'Por favor ingrese el título del anuncio!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="contenido"
            label="Contenido"
            rules={[{ required: true, message: 'Por favor ingrese el contenido del anuncio!' }]}
          >
            <TiptapEditor
              initialContent={editorContent || { type: 'doc', content: [] }}
              onChange={setEditorContent}
            />
          </Form.Item>

          <Form.Item
            name="cat_pub_id"
            label="Categoría"
            rules={[{ required: true, message: 'Por favor seleccione una categoría!' }]}
          >
            <Select placeholder="Seleccione una categoría">
              {categories?.map((cat: CategoriaPublicacion) => (
                <Option key={cat.cat_pub_id} value={cat.cat_pub_id}>
                  {cat.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="fecha_evento"
            label="Fecha del Evento (Opcional)"
          >
            <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>

          <Form.Item name="visible" valuePropName="checked">
            <Checkbox>Visible al público</Checkbox>
          </Form.Item>

          <Form.Item name="destacado" valuePropName="checked">
            <Checkbox>Anuncio Destacado</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SingleAnnouncement;
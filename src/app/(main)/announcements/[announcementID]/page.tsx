'use client';
import { useParams } from 'next/navigation';
import { useGetSingleAnnouncement } from "@/hooks/announcementHooks";
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
import { formatDateTimeSpanish } from '@/utils';
import { useUser } from '@/components/providers/UserProvider';
import { useState } from 'react';
import dayjs from 'dayjs';
import TiptapEditor from '@/components/tiptap/TiptapEditor';
import {Image, Typography, Spin, Alert, Button, Divider, 
        Row, Col, Badge, Modal, Form, Input, Upload, 
        Checkbox, Select, DatePicker,} from 'antd';
const { Title } = Typography;
import { UploadChangeParam } from 'antd/es/upload';
import { useGetAllAnnouncementCategories, useUpdateAnnouncement } from '@/hooks/announcementHooks';
import { CategoriaPublicacion } from '@/interfaces/announcementInterface';
import { UploadOutlined } from '@ant-design/icons';
import { UpdatePublicacionDto } from '@/interfaces/announcementInterface';
const {Option} = Select;


const SingleAnnouncement: React.FC = () => {
  const params = useParams();
  const id = params?.announcementID ? parseInt(params.announcementID as string, 10) : undefined;
    const {user} = useUser();
  const { data: announcement, isLoading, error } = useGetSingleAnnouncement(id ?? 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [form] = Form.useForm();
const [editorContent, setEditorContent] = useState<JSONContent | null>(null);
  const { data: categories } = useGetAllAnnouncementCategories();
const updateMutation = useUpdateAnnouncement();


const openEditModal = () => {
  form.setFieldsValue({
    
  });
  setIsModalOpen(true);
};

const handleUpdate = async (values: UpdatePublicacionDto) => {
  try {
    const formData = new FormData();

    formData.append('titulo', values.titulo ?? '');
    formData.append('contenido', JSON.stringify(values.contenido || editorContent));
    formData.append('cat_pub_id', values.cat_pub_id? values.cat_pub_id.toString() : '');
    formData.append('visible', values.visible ? 'true' : 'false');
    formData.append('destacado', values.destacado ? 'true' : 'false');

    if (values.fecha_evento) {
      formData.append('fecha_evento', values.fecha_evento);
    }

    if (values.imagen) {
      formData.append('imagen', values.imagen);
    }

    if (values.recurso) {
      formData.append('recurso', values.recurso);
    }

  if (!announcement?.pub_id ) {
  console.error("Announcement ID is missing");
  return; // or throw an error
}

  await updateMutation.mutateAsync({ 
    id: announcement.pub_id, 
    data: formData 
  });

    setIsModalOpen(false);
  } catch (error) {
    console.error('Update failed:', error);
  }
};

const handleCancel = () => {
  setIsModalOpen(false);
};

const onUploadChangeImage = (info: UploadChangeParam) => {
  if (info.file.originFileObj) {
    form.setFieldsValue({ imagen: info.file.originFileObj });
  }
};

  const onUploadChangeFile = (info: UploadChangeParam) => {
  if (info.file.originFileObj) {
    form.setFieldsValue({ recurso: info.file.originFileObj });
  }
};

  const validateImage = (file:File) => {
  const isImage = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);
  if (!isImage) {
    //error message
  }
  return isImage || Upload.LIST_IGNORE;
};

const validateDocument = (file: File) => {
  const isValidType = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation' 
  ].includes(file.type);

  if (!isValidType) {
  }
  return isValidType || Upload.LIST_IGNORE;
};

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
    content: announcement?.contenido ? JSON.parse(announcement.contenido) : '',
    editable: false
  }, [announcement?.contenido]);

  if (isLoading) return <Spin tip="Cargando..." />;
  if (error) return <Alert message="Error al cargar el anuncio." type="error" />;

  if (!announcement) return null;

 return (
    <>
  <Row gutter={24} align="middle" style={{ minHeight: '400px' }}>
    <Col
      xs={24}
      sm={24}
      md={10}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
        <Badge.Ribbon text={formatDateTimeSpanish(announcement.fecha_evento ?? '')} color="volcano">
        <Image
            src={announcement.imagen_url}
            alt="imagen de publicación"
            style={{
            maxWidth: '100%',
            maxHeight: '400px',
            objectFit: 'contain',
            borderRadius: 8,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}
        />
      </Badge.Ribbon>
    </Col>

    <Col
      xs={24}
      sm={24}
      md={14}
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
        {user?.rol_id === 1 && (
            <div style={{ marginTop: 24, textAlign: 'end', paddingRight:'4rem' }}>
                <Button type="primary" onClick={openEditModal} style={{ marginRight: 16 }}>
                Editar
                </Button>
                <Button type="default" danger onClick={() => console.log('Eliminar anuncio')}>
                Eliminar
                </Button>
            </div>
            )}
      <Title level={2} style={{ marginBottom: 16 }}>
        {announcement.titulo}
      </Title>

      <Divider />

      <div style={{ minHeight: 150, marginBottom: 24 }}>
        <EditorContent editor={editor} />
      </div>

      <Divider />

      {announcement.recurso_url && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button
            type="primary"
            href={announcement.recurso_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Descargar recurso
          </Button>
        </div>
      )}
    </Col>
  </Row>
        <Modal
        title="Editar Anuncio"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Actualizar"
        cancelText="Cancelar"
        >
        <Form 
            form={form} 
            layout="vertical" 
            onFinish={handleUpdate}
            initialValues={{
                titulo: announcement.titulo,
                contenido: JSON.parse(announcement.contenido),
                cat_pub_id: announcement.cat_pub_id,
                fecha_evento: announcement.fecha_evento ? dayjs(announcement.fecha_evento) : null,
                visible: announcement.visible,
                destacado: announcement.destacado,
            }}
                        style={{overflowY:'auto', maxHeight:'38rem'}}

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
                initialContent={form.getFieldValue('contenido') || { type: 'doc', content: [] }} 
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

         <Form.Item label="Flyer Actual">
  <Image src={announcement.imagen_url} width={150} alt='Flyer'/>
</Form.Item>

<Form.Item name="imagen" label="Actualizar Flyer (opcional)">
  <Upload
    listType="picture"
    maxCount={1}
    beforeUpload={validateImage}
    accept=".png,.jpg,.jpeg"
    onChange={onUploadChangeImage}
  >
    <Button icon={<UploadOutlined />}>Reemplazar Imagen</Button>
  </Upload>
</Form.Item>


    <Form.Item name="recurso" label="Recurso">
      <Upload
        listType="text"
        maxCount={1}
        beforeUpload={validateDocument}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
        onChange={onUploadChangeFile}
      >
        <Button type="primary" icon={<UploadOutlined />}>
          Remplazar Archivo
        </Button>
      </Upload>
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

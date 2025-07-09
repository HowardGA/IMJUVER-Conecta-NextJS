// src/app/announcements/components/CreateAnnouncementModal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Checkbox, Button, message, Spin, Upload } from 'antd';
import { useCreateAnnouncement, useGetAllAnnouncementCategories } from '@/hooks/announcementHooks'; 
import { CreatePublicacionDto, CategoriaPublicacion } from '@/interfaces/announcementInterface'; 
import TiptapEditor from '@/components/tiptap/TiptapEditor';
import { JSONContent } from '@tiptap/react';
import { UploadOutlined } from '@ant-design/icons';
import { useUser } from '@/components/providers/UserProvider';
import { UploadChangeParam } from 'antd/es/upload';


const { Option } = Select;

interface CreateAnnouncementModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm(); 
  const {user} = useUser();
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useGetAllAnnouncementCategories();
const [editorContent, setEditorContent] = useState<JSONContent | null>(null);
  const [api, contextHolder] = message.useMessage();
  

  const createMutation = useCreateAnnouncement();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue({
        visible: true, 
        destacado: false,
      });
    }
  }, [visible, form]);

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
    api.error('Solo se permiten imágenes PNG, JPG o JPEG.');
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
    api.error('Solo se permiten archivos de Microsoft Office o PDF.');
  }
  return isValidType || Upload.LIST_IGNORE;
};

  const handleFormSubmit = async (values:CreatePublicacionDto) => {
  try {
    const formData = new FormData();

    // Append primitive values
    formData.append('titulo', values.titulo);
    formData.append('contenido', JSON.stringify(values.contenido || editorContent));
    formData.append('cat_pub_id', values.cat_pub_id.toString());
    if (user?.usu_id !== undefined) {
      formData.append('autor_id', user.usu_id.toString());
    }
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

    // Now send FormData via Axios
    await createMutation.mutateAsync(formData); 

    api.success('Anuncio creado exitosamente!');
    onSuccess();
    onClose();

  } catch (error) {
    api.error(`Error al crear anuncio: ${error || 'Error desconocido'}`);
    console.error('Error creating announcement:', error);
  }
};


  if (categoriesError) {
    api.error("No se pudieron cargar las categorías.");
    console.error("Category loading error:", categoriesError);
  }

  return (
    <Modal
      title="Crear Nuevo Anuncio"
      open={visible} 
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose} disabled={createMutation.isPending}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={form.submit} 
          loading={createMutation.isPending}
        >
          Crear Anuncio
        </Button>,
      ]}
      centered
      maskClosable={!createMutation.isPending} 
      destroyOnHidden 
      style={{ height:'45rem'}}
    >
      {contextHolder}
      <Spin spinning={categoriesLoading}>
        <Form
          form={form}
          layout="vertical"
          name="create_announcement_form"
          onFinish={handleFormSubmit}
          initialValues={{
            visible: true,
            destacado: false,
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

          <Form.Item name="imagen" label="Flyer">
      <Upload
        listType="picture"
        maxCount={1}
        beforeUpload={validateImage}
        accept=".png,.jpg,.jpeg"
        onChange={onUploadChangeImage}
      >
        <Button type="primary" icon={<UploadOutlined />}>
          Agregar Imagen
        </Button>
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
          Agregar Archivo
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
      </Spin>
    </Modal>
  );
};

export default CreateAnnouncementModal;
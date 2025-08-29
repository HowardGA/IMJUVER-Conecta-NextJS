import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Checkbox, Button, message, Spin, Upload } from 'antd';
import { useCreateAnnouncement, useGetAllAnnouncementCategories } from '@/hooks/announcementHooks';
import { CategoriaPublicacion, CreatePublicacionDto } from '@/interfaces/announcementInterface';
import TiptapEditor from '@/components/tiptap/TiptapEditor';
import { JSONContent } from '@tiptap/react';
import { FileOutlined, PictureOutlined } from '@ant-design/icons';
import { useUser } from '@/components/providers/UserProvider';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import type { RcFile } from 'antd/lib/upload/interface';
import Image from 'next/image';


const { Option } = Select;

interface CreateAnnouncementModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const { user } = useUser();
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useGetAllAnnouncementCategories();
  const [editorContent, setEditorContent] = useState<JSONContent | null>(null);
  const [api, contextHolder] = message.useMessage();

  const createMutation = useCreateAnnouncement();

  const [imageList, setImageList] = useState<UploadFile[]>([]);
  const [resourceList, setResourceList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  useEffect(() => {
    if (visible) {
      // Reset form fields
      form.resetFields();
      form.setFieldsValue({
        visible: true,
        destacado: false,
      });
      setEditorContent(null);
      setImageList([]);
      setResourceList([]);
    } else {
      imageList.forEach(file => {
        if (file.url && file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url);
        }
        if (file.preview && file.preview.startsWith('blob:')) {
          URL.revokeObjectURL(file.preview);
        }
      });
      resourceList.forEach(file => {
        if (file.url && file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url);
        }
      });
    }
  }, [visible, form]); 

  const handleImageUploadChange = async (info: UploadChangeParam<UploadFile>) => {
    let newFileList = [...info.fileList]; 
    newFileList = await Promise.all(newFileList.map(async (file) => {
      if (!file.url && !file.preview && file.originFileObj) {
        file.preview = URL.createObjectURL(file.originFileObj as RcFile);
      }
      return file;
    }));
    setImageList(newFileList); 
  };

  const handleResourceUploadChange = (info: UploadChangeParam<UploadFile>) => {
    const newFileList = [...info.fileList]; 
    setResourceList(newFileList); 
  };
  const validateImage = (file: RcFile) => {
    const isImage = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);
    if (!isImage) {
      api.error('Solo se permiten imágenes PNG, JPG o JPEG.');
      return Upload.LIST_IGNORE;
    }
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      api.error('La imagen debe ser menor a 20MB.');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const validateDocument = (file: RcFile) => {
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
      return Upload.LIST_IGNORE;
    }
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      api.error('El archivo debe ser menor a 20MB.');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleFormSubmit = async (values: CreatePublicacionDto) => {
    try {
      const formData = new FormData();

      formData.append('titulo', values.titulo);
      formData.append('contenido', JSON.stringify(editorContent));
      formData.append('cat_pub_id', values.cat_pub_id.toString());
      if (user?.usu_id !== undefined) {
        formData.append('autor_id', user.usu_id.toString());
      }
      formData.append('visible', values.visible ? 'true' : 'false');
      formData.append('destacado', values.destacado ? 'true' : 'false');

      if (values.fecha_evento) {
        formData.append('fecha_evento', new Date(values.fecha_evento).toISOString());
      }

      imageList.forEach(uploadFile => {
        if (uploadFile.originFileObj) {
          formData.append('imagen', uploadFile.originFileObj as File);
        }
      });

      resourceList.forEach(uploadFile => {
        if (uploadFile.originFileObj) {
          formData.append('recurso', uploadFile.originFileObj as File);
        }
      });

      await createMutation.mutateAsync(formData);

      api.success('Anuncio creado exitosamente!');
      onSuccess();
      onClose();

    } catch (error) {
      api.error(`Error al crear anuncio: ${error instanceof Error ? error.message : 'Error desconocido'}`);
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
      width={700} 
      style={{ top: 20 }}
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

          <Form.Item
            name="imagenes" 
            label="Imágenes (Flyer, galería, etc.)"
          >
            <Upload
              listType="picture-card"
              multiple={true}
              beforeUpload={validateImage}
              accept=".png,.jpg,.jpeg"
              onChange={handleImageUploadChange} 
              fileList={imageList}
              onPreview={handlePreview}
            >
              <div>
                <PictureOutlined />
                <div style={{ marginTop: 8 }}>Subir imágenes</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            name="recursos" 
            label="Recursos Adicionales (PDFs, Docs, etc.)"
          >
            <Upload
              listType="text"
              multiple={true}
              beforeUpload={validateDocument}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              onChange={handleResourceUploadChange} 
              fileList={resourceList} 
            >
              <Button icon={<FileOutlined />}>
                Agregar Archivos
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

      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
       <div style={{ width: '100%', height: 'auto', position: 'relative' }}> {/* Or a fixed height, e.g., '300px' */}
          <Image
            alt="preview"
            src={previewImage}
            fill 
            style={{ objectFit: 'contain' }} 
          />
        </div>
      </Modal>
    </Modal>
  );
}

export default CreateAnnouncementModal;
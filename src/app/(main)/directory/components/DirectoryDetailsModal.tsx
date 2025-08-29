import { Modal, Descriptions, Button, Form, Input, Select, Popconfirm } from 'antd';
import { useUpdateDirectorio, useDeleteDirectorio } from '@/hooks/directorioHooks';
import { Directorio, UpdateDirectorioDto } from '@/interfaces/directorioInterface';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { useMessage } from '@/components/providers/MessageProvider';

const { TextArea } = Input;
const { Item } = Descriptions;

interface CategoryOption {
  label: string;
  value: number;
}

interface DirectoryDetailsModalProps {
  contact: Directorio | null;
  onClose: () => void;
}

export default function DirectoryDetailsModal({ contact, onClose }: DirectoryDetailsModalProps) {
  const [form] = Form.useForm<UpdateDirectorioDto>();
  const [isEditing, setIsEditing] = useState(false);
  const updateMutation = useUpdateDirectorio();
  const deleteMutation = useDeleteDirectorio();
  const message = useMessage();

  const { data: categories } = useQuery<CategoryOption[]>({
    queryKey: ['directorio-categories'],
    queryFn: () => apiClient.get('/directorio/categorias').then(res => res.data),
  });

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const updateData: UpdateDirectorioDto = {
        ...values,
        dir_id: contact!.dir_id,
      };
      
      updateMutation.mutate(updateData, {
        onSuccess: () => {
          message.success('Entrada actualizada correctamente');
          setIsEditing(false);
        },
        onError: () => {
          message.error('Error al actualizar la entrada');
        }
      });
    } catch (error) {
      console.error('Error de validación:', error);
    }
  };
  if (!contact) return null;

  return (
    <Modal
      title={isEditing ? `Editar: ${contact.nombre}` : contact.nombre}
      open={true}
      onCancel={onClose}
       footer={[
        <Popconfirm
          key="delete-popconfirm"
          title="Confirmar eliminación"
          description="¿Estás seguro de que deseas eliminar esta entrada?"
          onConfirm={() => {
            if (!contact?.dir_id) {
              message.error('ID de la entrada no encontrado para eliminar.');
              return;
            }
            deleteMutation.mutate(contact.dir_id, {
              onSuccess: () => {
                message.success('Entrada eliminada correctamente');
                onClose();
              },
              onError: (error) => {
                message.error(`Error al eliminar la entrada: ${error.message || 'Error desconocido'}`);
              }
            });
          }}
          okText="Eliminar"
          cancelText="Cancelar"
          okButtonProps={{ danger: true }}
          placement="topRight"
        >
          <Button
            danger
            loading={deleteMutation.isPending}
            style={{ float: 'left' }} 
          >
            Eliminar
          </Button>
        </Popconfirm>,
        <Button key="cancel" onClick={() => {
            if (isEditing) {
                setIsEditing(false);
                form.resetFields(); 
            } else {
                onClose();
            }
        }}>
          {isEditing ? 'Cancelar edición' : 'Cerrar'}
        </Button>,
        <Button
          key="edit-save"
          type="primary"
          onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
          loading={updateMutation.isPending}
        >
          {isEditing ? 'Guardar cambios' : 'Editar'}
        </Button>,
      ]}
      width={800}
      style={{ top: 20 }}
    >
      {isEditing ? (
        <Form
          form={form}
          initialValues={{
            nombre: contact.nombre,
            descripcion: contact.descripcion,
            cat_dir_id: contact.cat_dir_id,
            telefono: contact.telefono,
            horarios: contact.horarios,
            url: contact.url,
          }}
          layout="vertical"
        >
          <Form.Item<UpdateDirectorioDto> 
            name="nombre" 
            label="Nombre" 
            rules={[{ required: true, message: 'El nombre es requerido' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<UpdateDirectorioDto> 
            name="descripcion" 
            label="Descripción" 
            rules={[{ required: true, message: 'La descripción es requerida' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item<UpdateDirectorioDto> 
            name="cat_dir_id" 
            label="Categoría" 
            rules={[{ required: true, message: 'La categoría es requerida' }]}
          >
            <Select>
              {categories?.map((category) => (
                <Select.Option key={category.value} value={category.value}>
                  {category.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<UpdateDirectorioDto> 
            name="telefono" 
            label="Teléfono" 
            rules={[{ required: true, message: 'El teléfono es requerido' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<UpdateDirectorioDto> 
            name="horarios" 
            label="Horarios" 
            rules={[{ required: true, message: 'Los horarios son requeridos' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<UpdateDirectorioDto> 
            name="url" 
            label="Enlace (URL)"
          >
            <Input />
          </Form.Item>
        </Form>
      ) : (
        <Descriptions
         column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
         bordered
        size="small">
          <Item label="Descripción" style={{ wordBreak: 'break-word' }}>{contact.descripcion}</Item>
          <Item label="Categoría">{contact.categoria.nombre}</Item>
          <Item label="Teléfono">{contact.telefono}</Item>
          <Item label="Horarios" style={{ wordBreak: 'break-word' }}>{contact.horarios}</Item>
          {contact.url && (
            <Descriptions.Item label="Enlace" style={{ wordBreak: 'break-word' }}>
              <a href={contact.url} target="_blank" rel="noopener noreferrer">
                {contact.url}
              </a>
            </Descriptions.Item>
          )}
        </Descriptions>
      )}
    </Modal>
  );
}
import { Modal, Descriptions, Button, Form, Input, DatePicker, Select, Popconfirm, Tag } from 'antd';
import { useUpdateOffer, useDeleteOffer } from '@/hooks/ofertasHooks';
import { Oferta, UpdateOfertaDto } from '@/interfaces/ofertaInterface';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { useMessage } from '@/components/providers/MessageProvider';
const { TextArea } = Input;
const { Item } = Descriptions;

interface CategoriesResponse {
  label:string;
  value:number;
}

interface JobDetailsModalProps {
  offer: Oferta | null;
  onClose: () => void;
}

export default function JobDetailsModal({ offer, onClose }: JobDetailsModalProps) {
  const [form] = Form.useForm<UpdateOfertaDto>();
  const [isEditing, setIsEditing] = useState(false);
  const updateMutation = useUpdateOffer();
  const deleteMutation = useDeleteOffer();
  const messageApi = useMessage();

  const { data: categoriesResponse } = useQuery<CategoriesResponse[]>({
    queryKey: ['categories'],
    queryFn: () => apiClient.get('/ofertas/categorias-ofertas').then(res => res.data),
  });

  const categories = categoriesResponse || [];

const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const updateData: UpdateOfertaDto = {
        ...values,
        of_id: offer!.of_id,
        fecha_vigencia: values.fecha_vigencia
          ? dayjs(values.fecha_vigencia).format('YYYY-MM-DD')
          : offer!.fecha_vigencia,
      };

      updateMutation.mutate(updateData, {
        onSuccess: () => {
          messageApi.success('Oferta actualizada exitosamente');
          setIsEditing(false);
        },
        onError: () => {
          messageApi.error('Error actualizando la oferta');
        }
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

const handleDelete = () => {
        deleteMutation.mutate(offer!.of_id, {
          onSuccess: () => {
            messageApi.success('Oferta eliminada exitosamente');
            onClose();
          },
          onError: () => {
            messageApi.error('Error eliminando la oferta');
          }
        });
  };

  if (!offer) return null;

  return (
    <Modal
      title={offer.titulo}
      open={true}
      onCancel={onClose}
      footer={[
        <Popconfirm
            key="delete-popconfirm" 
            title="¿Eliminar oferta?"
            description="¿Está seguro que quiere eliminar esta oferta? Esta acción no se puede deshacer."
            onConfirm={handleDelete}
            onCancel={() => {}}
            okText="Sí, Eliminar"
            cancelText="No"
            okButtonProps={{ loading: deleteMutation.isPending }}
            placement="topRight"
          
          >
            <Button
              key="delete"
              danger
            >
              Eliminar
            </Button>
          </Popconfirm>,
        <Button
          key="edit"
          type="primary"
          onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
          loading={updateMutation.isPending}
        >
          {isEditing ? 'Guardar Cambios' : 'Editar'}
        </Button>,
      ]}
    >
      {isEditing ? (
        <Form
          form={form}
          initialValues={{
            ...offer,
            fecha_vigencia: dayjs(offer.fecha_vigencia),
          }}
          layout="vertical"
        >
          <Form.Item<UpdateOfertaDto>
            name="titulo"
            label="Titulo"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<UpdateOfertaDto>
            name="descripcion"
            label="Descripción"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item<UpdateOfertaDto>
            name="cat_of_id"
            label="Categoría"
            rules={[{ required: true }]}
          >
            <Select>
              {categories.map((category) => (
                <Select.Option key={category.value} value={category.value}>
                  {category.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<UpdateOfertaDto>
            name="fecha_vigencia"
            label="Vencimiento"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item<UpdateOfertaDto>
            name="activo"
            label="Estatus"
          >
           <Select>
              <Select.Option value={true}>Activo</Select.Option>
              <Select.Option value={false}>Deshabilitado</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      ) : (
        <Descriptions  column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }} bordered size='small'> 
          <Item label="Descripción">{offer.descripcion}</Item>
          <Item label="Categoría">{offer.categoria.nombre}</Item>
          <Item label="Vencimiento">
            {dayjs(offer.fecha_vigencia).format('MMM D, YYYY')}
          </Item>
          <Item label="Estatus">
            <Tag color={offer.activo ? 'green' : 'red'}>
              {offer.activo ? 'Activo' : 'Inactivo'}
            </Tag>
          </Item>
        </Descriptions>
      )}
    </Modal>
  );
}
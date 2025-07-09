import { Modal, Descriptions, Button, Form, Input, DatePicker, Select, message, Tag } from 'antd';
import { useUpdateOffer, useDeleteOffer } from '@/hooks/ofertasHooks';
import { Oferta, UpdateOfertaDto } from '@/interfaces/ofertaInterface';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

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
          message.success('Job updated successfully');
          setIsEditing(false);
        },
        onError: () => {
          message.error('Error updating job');
        }
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this job?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        deleteMutation.mutate(offer!.of_id, {
          onSuccess: () => {
            message.success('Job deleted successfully');
            onClose();
          },
          onError: () => {
            message.error('Error deleting job');
          }
        });
      },
    });
  };

  if (!offer) return null;

  return (
    <Modal
      title={offer.titulo}
      open={true}
      onCancel={onClose}
      footer={[
        <Button 
          key="delete" 
          danger 
          onClick={handleDelete}
          loading={deleteMutation.isPending}
        >
          Delete
        </Button>,
        <Button 
          key="edit" 
          type="primary" 
          onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
          loading={updateMutation.isPending}
        >
          {isEditing ? 'Save Changes' : 'Edit'}
        </Button>,
      ]}
      width={800}
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
        <Descriptions column={1} bordered>
          <Item label="Descripción">{offer.descripcion}</Item>
          <Item label="Categoría">{offer.categoria.nombre}</Item>
          <Item label="Vencimiento">
            {dayjs(offer.fecha_vigencia).format('MMM D, YYYY')}
          </Item>
          <Item label="Estatus">
            <Tag color={offer.activo ? 'green' : 'red'}>
              {offer.activo ? 'Active' : 'Inactive'}
            </Tag>
          </Item>
        </Descriptions>
      )}
    </Modal>
  );
}
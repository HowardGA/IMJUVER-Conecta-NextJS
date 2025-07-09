import { Modal, Form, Input, Select, Button, message } from 'antd';
import { useCreateDirectorio } from '@/hooks/directorioHooks';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { CreateDirectorioDto } from '@/interfaces/directorioInterface';

const { TextArea } = Input;
const { Option } = Select;

interface CreateDirectoryModalProps {
  open: boolean;
  onCancel: () => void;
}

interface CategoryOption {
  label: string;
  value: number;
}

export default function CreateDirectoryModal({ open, onCancel }: CreateDirectoryModalProps) {
  const [form] = Form.useForm<CreateDirectorioDto>();
  const createMutation = useCreateDirectorio();

  const { data: categories } = useQuery<CategoryOption[]>({
    queryKey: ['directorio-categories'],
    queryFn: () => apiClient.get('/directorio/categorias').then(res => res.data),
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      createMutation.mutate(values, {
        onSuccess: () => {
          message.success('Entrada del directorio creada con éxito');
          onCancel();
          form.resetFields();
        },
        onError: () => {
          message.error('Error al crear entrada del directorio');
        }
      });
    } catch (error) {
      console.error('Error de validación:', error);
    }
  };

  return (
    <Modal
      title="Agregar nueva entrada al directorio"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={createMutation.isPending}
          onClick={handleSubmit}
        >
          Crear
        </Button>,
      ]}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item<CreateDirectorioDto>
          name="nombre"
          label="Nombre"
          rules={[{ required: true, message: 'El nombre es requerido' }]}
        >
          <Input placeholder="Ej: Oficina de Admisiones" />
        </Form.Item>

        <Form.Item<CreateDirectorioDto>
          name="descripcion"
          label="Descripción"
          rules={[{ required: true, message: 'La descripción es requerida' }]}
        >
          <TextArea rows={3} placeholder="Breve descripción de la oficina o persona" />
        </Form.Item>

        <Form.Item<CreateDirectorioDto>
          name="cat_dir_id"
          label="Categoría"
          rules={[{ required: true, message: 'Seleccione una categoría' }]}
        >
          <Select placeholder="Seleccione una categoría">
            {categories?.map((category) => (
              <Option key={category.value} value={category.value}>
                {category.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item<CreateDirectorioDto>
          name="telefono"
          label="Teléfono"
          rules={[{ required: true, message: 'El teléfono es requerido' }]}
        >
          <Input placeholder="Ej: +1 809-555-1234" />
        </Form.Item>

        <Form.Item<CreateDirectorioDto>
          name="horarios"
          label="Horarios de atención"
          rules={[{ required: true, message: 'Los horarios son requeridos' }]}
        >
          <Input placeholder="Ej: Lunes a Viernes, 8:00 AM - 5:00 PM" />
        </Form.Item>

        <Form.Item<CreateDirectorioDto>
          name="url"
          label="Enlace (URL)"
        >
          <Input placeholder="Ej: https://universidad.edu.do/admisiones" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
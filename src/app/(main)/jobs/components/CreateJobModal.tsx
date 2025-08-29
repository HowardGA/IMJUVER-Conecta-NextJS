import { Modal, Form, Input, DatePicker, Select, Button, Checkbox } from 'antd';
import { useCreateOffer } from '@/hooks/ofertasHooks';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import dayjs from 'dayjs';
import { CreateOfertaDto } from '@/interfaces/ofertaInterface';
import { useMessage } from '@/components/providers/MessageProvider';

const { TextArea } = Input;
const { Option } = Select;

interface CreateJobModalProps {
  open: boolean;
  onCancel: () => void;
}

interface CategoriesResponse {
  label:string;
  value:number;
}

export default function CreateJobModal({ open, onCancel }: CreateJobModalProps) {
  const [form] = Form.useForm<CreateOfertaDto>();
  const createMutation = useCreateOffer();
  const message = useMessage();

  const { data: categoriesResponse } = useQuery<CategoriesResponse[]>({
    queryKey: ['categories'],
    queryFn: () => apiClient.get('/categorias-ofertas').then(res => res.data),
  });

  const categories = categoriesResponse || [];

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      createMutation.mutate({
        ...values,
        fecha_vigencia: dayjs(values.fecha_vigencia).format('YYYY-MM-DD'),
        activo: values.activo ?? true,
        mujer: values.mujer
      }, {
        onSuccess: () => {
          message.success('Oferta creada exitosamente');
          onCancel();
          form.resetFields();
        },
        onError: () => {
          message.error('Error al crear la oferta');
        }
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Create New Job Offer"
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
      // Ant Design Modal handles responsiveness for width automatically for smaller screens
      // width={700} // This will be ignored on mobile, which is good.
    >
      <Form form={form} layout="vertical"> {/* layout="vertical" is good for mobile */}
        <Form.Item<CreateOfertaDto>
          name="titulo"
          label="Titulo"
          rules={[{ required: true, message: 'Titulo requerido!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<CreateOfertaDto>
          name="descripcion"
          label="Descripción"
          rules={[{ required: true, message: 'Descripción requerida!' }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item<CreateOfertaDto>
          name="cat_of_id"
          label="Categoría"
          rules={[{ required: true, message: 'Categoría requerida!' }]}
        >
          <Select placeholder="Selecciona una categoría">
            {categories.map((category) => (
              <Option key={category.value} value={category.value}>
                {category.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item<CreateOfertaDto>
          name="fecha_vigencia"
          label="Vencimiento"
          rules={[{ required: true, message: 'Fecha vencimiento requerida!' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            disabledDate={(current) => current && current < dayjs().startOf('day')}
            placeholder='Selecciona una fecha'
          />
        </Form.Item>

        <Form.Item<CreateOfertaDto>
          name="activo"
          label="Estatus"
          initialValue={true}
        >
          <Select>
            <Option value={true}>Activo</Option>
            <Option value={false}>Deshabilitado</Option>
          </Select>
        </Form.Item>
        <Form.Item<CreateOfertaDto>
          name="mujer"
          valuePropName="checked"
          initialValue={false}
        >
          <Checkbox>Oferta para mujeres</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
}
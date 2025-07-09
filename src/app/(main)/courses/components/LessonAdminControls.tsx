import { Button, Space, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface LessonAdminControlsProps {
  onUpdate: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

const LessonAdminControls: React.FC<LessonAdminControlsProps> = ({ 
  onUpdate, 
  onDelete,
  isLoading = false
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const handleDelete = () => {
    messageApi.loading({ content: 'Eliminando lección...', key: 'delete' });
    onDelete();
  };

  return (
    <Space style={{ marginBottom: 20 }}>
      {contextHolder}
      <Button 
        type="primary" 
        icon={<EditOutlined />} 
        onClick={onUpdate}
        loading={isLoading}
      >
        Editar Lección
      </Button>
      
      <Popconfirm
        title="¿Estás seguro de eliminar esta lección?"
        description="Esta acción no se puede deshacer."
        okText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
      >
        <Button 
          danger 
          icon={<DeleteOutlined />}
          loading={isLoading}
        >
          Eliminar Lección
        </Button>
      </Popconfirm>
    </Space>
  );
};

export default LessonAdminControls;
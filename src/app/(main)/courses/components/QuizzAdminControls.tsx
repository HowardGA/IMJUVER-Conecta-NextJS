import { Button, Space, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface QuizzAdminControlsProps {
  onUpdate: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

const QuizzAdminControls: React.FC<QuizzAdminControlsProps> = ({ 
  onUpdate, 
  onDelete,
  isLoading = false
}) => {
const [messageApi, contextHolder] = message.useMessage();
  const handleDelete = () => {
    messageApi.loading({ content: 'Eliminando cuestionario...', key: 'delete' });
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
        Editar Cuestionario
      </Button>
      
      <Popconfirm
        title="¿Estás seguro de eliminar este cuestionario?"
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
          Eliminar Cuestionario
        </Button>
      </Popconfirm>
    </Space>
  );
};

export default QuizzAdminControls;
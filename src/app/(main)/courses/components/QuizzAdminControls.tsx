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
    <Space
        direction={window.innerWidth < 576 ? "vertical" : "horizontal"}
        size="middle"
        style={{
            marginBottom: 20,
            width: '100%', 
            justifyContent: 'center',
            flexWrap: 'wrap', 
        }}
    >
      {contextHolder}
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={onUpdate}
        loading={isLoading}
        block={window.innerWidth < 576} 
        size="large"
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
          block={window.innerWidth < 576} 
          size="large" 
        >
          Eliminar Cuestionario
        </Button>
      </Popconfirm>
    </Space>
  );
};

export default QuizzAdminControls;
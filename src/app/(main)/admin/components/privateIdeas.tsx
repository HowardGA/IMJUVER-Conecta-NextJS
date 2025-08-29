'use client';

import React, { useState } from 'react';
import { Table, Button, Tag, Modal, Space, Spin, Alert, Popconfirm, Select, Breakpoint } from 'antd';
import {
  useGetPrivateIdeas,
  useDeleteIdea,
  useChangeStatus,
} from '@/hooks/ideasHooks'; 
import { Idea, EstadoPropuesta } from '@/interfaces/ideaInterfaces'; 
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useMessage } from '@/components/providers/MessageProvider'; 
import IdeaDetailsModal from './IdeaDetailsModal'; 
import dayjs from 'dayjs';

interface TableIdea extends Idea {
  key: number; 
}
const { Option } = Select;

export default function PrivateIdeasTable() {
  const { data: ideas, isLoading, isError, refetch } = useGetPrivateIdeas();
  const deleteMutation = useDeleteIdea();
  const updateStatusMutation = useChangeStatus();
  const messageApi = useMessage(); 
  const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
  const [ideaToChangeStatus, setIdeaToChangeStatus] = useState<Idea | null>(null);
  const [newSelectedStatus, setNewSelectedStatus] = useState<EstadoPropuesta | undefined>(undefined);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  const handleViewDetails = (idea: Idea) => {
    setSelectedIdea(idea);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    console.log(isDetailsModalOpen)
    setIsDetailsModalOpen(false);
    setSelectedIdea(null);
    refetch(); 
  };

 const getEstadoIdeaOptions = () => {
    return Object.values(EstadoPropuesta);
  };
  // Function to handle idea deletion
  const handleConfirmDelete = (ideaId: number) => {
    deleteMutation.mutate(ideaId, {
      onSuccess: () => {
        messageApi.success('Idea eliminada exitosamente');
        refetch();
      },
      onError: (err) => {
        messageApi.error(`Error al eliminar idea: ${err.message}`);
      },
    });
  };

 const handleOpenStatusChangeModal = (idea: Idea) => {
    setIdeaToChangeStatus(idea);
    setNewSelectedStatus(idea.estado);
    setIsStatusChangeModalOpen(true);
  };
  const handleConfirmStatusChange = () => {
    if (!ideaToChangeStatus || !newSelectedStatus) return; // Should not happen

    updateStatusMutation.mutate(
      { ideaId: ideaToChangeStatus.idea_id, newState: newSelectedStatus },
      {
        onSuccess: () => {
          messageApi.success(`Estado cambiado a "${newSelectedStatus}" exitosamente`);
          setIsStatusChangeModalOpen(false); // Close the modal
          setIdeaToChangeStatus(null);
          setNewSelectedStatus(undefined);
          refetch();
        },
        onError: (err) => {
          messageApi.error(`Error al cambiar el estado: ${err.message}`);
        },
      }
    );
  };
  const handleCancelStatusChangeModal = () => {
    setIsStatusChangeModalOpen(false);
    setIdeaToChangeStatus(null);
    setNewSelectedStatus(undefined); 
  };

  const columns = [
    {
      title: 'Título',
      dataIndex: 'titulo',
      key: 'titulo',
    },
    {
      title: 'Autor (ID)',
      dataIndex: ['autor', 'usu_id'],
      key: 'autorId',
      render: (text: string, record: Idea) => `${record.autor?.nombre || 'N/A'} (${record.autor?.usu_id || 'N/A'})`
    },
    {
      title: 'Fecha Creación',
      dataIndex: 'fecha_creacion',
      key: 'fecha_creacion',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      responsive: ['md'] as Breakpoint[],
    },
    {
      title: 'Última Modificación',
      dataIndex: 'fecha_modificacion',
      key: 'fecha_modificacion',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      responsive: ['lg'] as Breakpoint[],
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado: EstadoPropuesta) => {
        let color: string;
        switch (estado) {
          case EstadoPropuesta.Recibida: color = 'blue'; break;
          case EstadoPropuesta.EnRevision: color = 'purple'; break;
          case EstadoPropuesta.Aprobada: color = 'green'; break;
          case EstadoPropuesta.Rechazada: color = 'red'; break;
          case EstadoPropuesta.Implementada: color = 'gold'; break;
          default: color = 'default';
        }
        return <Tag color={color}>{estado}</Tag>;
      },
    },
    {
      title: 'Visible',
      dataIndex: 'visible',
      key: 'visible',
      render: (visible: boolean) => (
        <Tag color={visible ? 'green' : 'red'}>{visible ? 'Sí' : 'No'}</Tag>
      ),
      responsive: ['md'] as Breakpoint[]
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: Idea, record: Idea) => (
         <Space size="small" wrap>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            size="small"
          >
            Ver
          </Button>

          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleOpenStatusChangeModal(record)}
          >
            Cambiar Estado
          </Button>

          <Popconfirm
            title="¿Eliminar idea?"
            description="¿Está seguro que desea eliminar esta idea? Esta acción no se puede deshacer."
            onConfirm={() => handleConfirmDelete(record.idea_id)}
            onCancel={() => messageApi.info('Eliminación de idea cancelada.')}
            okText="Sí, Eliminar"
            cancelText="No"
            okButtonProps={{ loading: deleteMutation.isPending }}
            placement="topRight"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  if (isLoading) {
    return <Spin/>
  }

  if (isError) {
    return (
    <Alert
      message="Error"
      description="Error al cargar las ideas. Por favor, intente nuevamente"
      type="error"
      showIcon
    />);
  }

  const dataSource: TableIdea[] = ideas?.map((idea) => ({
    ...idea,
    key: idea.idea_id, 
  })) || [];

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="key" 
       pagination={{ pageSize: 10, showSizeChanger: false }}
       scroll={{ x: 'max-content' }}
        bordered
         size="small"
      />

      {selectedIdea && (
        <IdeaDetailsModal
          idea={selectedIdea}
          onClose={handleCloseDetailsModal}
        />
      )}
       <Modal
        title={`Cambiar Estado de la Idea: ${ideaToChangeStatus?.titulo || ''}`}
        open={isStatusChangeModalOpen}
        onOk={handleConfirmStatusChange}
        onCancel={handleCancelStatusChangeModal}
        okText="Guardar Cambio"
        cancelText="Cancelar"
        confirmLoading={updateStatusMutation.isPending}
        centered
        width={500} 
        style={{ top: 20 }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <p>Selecciona el nuevo estado:</p>
          <Select
            style={{ width: '100%' }}
            placeholder="Seleccionar Nuevo Estado"
            value={newSelectedStatus}
            onChange={(value: EstadoPropuesta) => setNewSelectedStatus(value)}
            disabled={updateStatusMutation.isPending} // Disable while saving
          >
            {getEstadoIdeaOptions().map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </Space>
      </Modal>
    </div>
  );
}
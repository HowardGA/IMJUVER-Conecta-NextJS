'use client';

import React, { useState } from 'react';
import { Layout, Typography, Spin, Row, Col, Empty, Button, Divider, Modal, Form, Input, Radio } from 'antd';
import IdeaCreator from './components/IdeaCreator';
import IdeaWithComments from './components/IdeaWithComments';
import { Idea, CreateIdeaPayload, UpdateIdeaPayload, EstadoPropuesta } from '@/interfaces/ideaInterfaces'; 
import { useUser } from '@/components/providers/UserProvider';
import {
  useGetAllIdeas,
  useCreateIdea,
  useToggleLike,
  useDeleteIdea,
  useUpdateIdea,
  useChangeStatus
} from '@/hooks/ideasHooks';
import { useMessage } from '@/components/providers/MessageProvider';

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

interface IdeaCreatorPayload {
  titulo: string;
  contenido: string;
  is_public: boolean;
}

export default function IdeasPage() {
  const { user } = useUser();
  const isAdmin = user?.rol_id === 1; 
  const { data: ideasData, isLoading: isLoadingIdeas, isError: isIdeasError, error: ideasError } = useGetAllIdeas();
  const ideas = ideasData || [];
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [editForm] = Form.useForm();

  const createIdeaMutation = useCreateIdea();
  const deleteIdeaMutation = useDeleteIdea();
  const updateIdeaMutation = useUpdateIdea();
  const toggleLikeMutation = useToggleLike();
  const changeStatusMutation = useChangeStatus(); 
  const message = useMessage();


  const handleCreateIdea = async (creatorPayload: IdeaCreatorPayload) => {
    if (!user || user.usu_id === undefined || user.usu_id === null) {
      message.error('Debes de iniciar sesion para crear una propuesta');
      return;
    }
    const fullPayload: CreateIdeaPayload = {
      ...creatorPayload,
      autorId: user.usu_id,
    };
     try {
      await createIdeaMutation.mutateAsync(fullPayload);
      message.success('¡Propuesta creada exitosamente!');
    } catch (error) {
      console.error('Error creating idea:', error);
      message.error(`Error al crear la propuesta: ${error || 'Error desconocido'}`);
    }
  };

  const handleDeleteIdea = async (ideaId: number) => {
    try {
      await deleteIdeaMutation.mutateAsync(ideaId);
      message.success('¡Propuesta eliminada correctamente!');
    } catch (error) {
      console.error('Error deleting idea:', error);
      message.error(`Error al eliminar la propuesta: ${error || 'Error desconocido'}`);
    }
  };

  const handleEditIdea = (idea: Idea) => {
    setEditingIdea(idea);
    editForm.setFieldsValue({
      titulo: idea.titulo,
      contenido: idea.contenido,
      is_public: idea.is_public,
    });
    setIsEditModalVisible(true);
  };

  const handleUpdateStatus = async (ideaId: number, newStatus: EstadoPropuesta) => {
      try {
          await changeStatusMutation.mutateAsync({ ideaId, newState: newStatus });
          message.success('¡Estado de la propuesta actualizado!');
      } catch (error) {
          console.error('Error updating idea status:', error);
          message.error(`Error al actualizar el estado: ${error || 'Error desconocido'}`);
      }
  };

const handleUpdateIdea = async (payload: UpdateIdeaPayload) => {
    if (!editingIdea) {
      message.error('No hay propuesta seleccionada para actualizar.');
      return;
    }
    try {
      await updateIdeaMutation.mutateAsync({ ideaId: editingIdea.idea_id, payload }, {
        onSuccess: () => {
          message.success('¡Propuesta actualizada exitosamente!'); 
          setIsEditModalVisible(false);
          setEditingIdea(null);
        },
        onError: (error) => {
          console.error('Error updating idea:', error);
          message.error(`Error al actualizar la propuesta: ${error.message || 'Error desconocido'}`);
        }
      });
    } catch (error) {
      message.error('Ha ocurrido un error inesperado al actualizar la propuesta.');
      console.log(error);
    }
  };

  const handleToggleLike = async (ideaId: number, isLiked: boolean) => {
    await toggleLikeMutation.mutateAsync({ ideaId, isLiked });
  };

  if (isLoadingIdeas) {
    return (
      <Layout>
        <Content style={{ padding: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        </Content>
      </Layout>
    );
  }

  if (isIdeasError) {
     return (
      <Layout>
        <Content style={{ padding: '1rem' }}> 
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            <Title level={4}>Error loading ideas</Title>
            <p>{ideasError?.message || 'Error desconocido.'}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Content style={{ padding: '1rem',  backgroundImage: `url('/background/imjuver-pattern.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed', }}>
        <Row justify="center">
          <Col 
            xs={24}
            sm={22}
            md={18} 
            lg={14}
            xl={12} 
          >
            {user && (
              <IdeaCreator
                currentUserId={user.usu_id}
                onCreateIdea={handleCreateIdea}
                creatingIdea={createIdeaMutation.isPending}
              />
            )}

            <Divider orientation="left" style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
              Propuestas Recientes
            </Divider>

            {ideas.length === 0 ? (
              <Empty description="No hay propuestas de momento, se el primero!" />
            ) : (
              ideas.map(idea => (
                <IdeaWithComments
                  key={idea.idea_id}
                  idea={idea}
                  currentUserId={user?.usu_id || null}
                  onToggleLike={handleToggleLike} 
                  onDeleteIdea={handleDeleteIdea} 
                  onEditIdea={handleEditIdea} 
                  isAdmin={isAdmin} 
                  onUpdateStatus={handleUpdateStatus}
                  deletingIdea={deleteIdeaMutation.isPending && deleteIdeaMutation.variables === idea.idea_id}
                  togglingLike={toggleLikeMutation.isPending && toggleLikeMutation.variables?.ideaId === idea.idea_id}
                />
              ))
            )}
          </Col>
        </Row>
      </Content>

      <Modal
        title="Editar Propuesta"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateIdea}
          initialValues={editingIdea || {}}
        >
          <Form.Item
            name="titulo"
            label="Titulo de la Propuesta"
            rules={[{ required: true, message: 'Please input your idea title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contenido"
            label="Detalles de la Propuesta"
            rules={[{ required: true, message: 'Please describe your idea!' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="is_public" label="Visibilidad">
            <Radio.Group style={{ display: 'flex', flexDirection: 'column' }}>
              <Radio value={true}>Public</Radio>
              <Radio value={false}>Private</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={updateIdeaMutation.isPending}>
              Actualizar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}
'use client';

import React from 'react';
import { Card, Avatar, Button, Typography, Space, Popconfirm, Tag, Dropdown, Menu } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import moment from 'moment';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection'; 
import { Idea, Comment as CommentType, CreateCommentPayload, EstadoPropuesta } from '@/interfaces/ideaInterfaces';

const { Text } = Typography;

interface IdeaCardProps {
  idea: Idea;
  currentUserId: number | null;
  likedByMe: boolean;
  comments: CommentType[];
  loadingComments: boolean;
  addingComment: boolean;
  deletingCommentId: number | null;

  onToggleLike: (ideaId: number, isLiked: boolean) => void;
  onDeleteIdea: (idea: number) => void;
  onEditIdea: (idea: Idea) => void;
  onLoadComments: (ideaId: number) => void; 
  onAddComment: (ideaId: number, payload: CreateCommentPayload) => void;
  onDeleteComment: (commentId: number) => void; 
  deletingIdea: boolean;
  togglingLike: boolean;
  isAdmin: boolean; 
  onUpdateStatus: (ideaId: number, newStatus: EstadoPropuesta) => Promise<void>;
}

const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  currentUserId,
  likedByMe,
  comments,
  loadingComments,
  addingComment,
  deletingCommentId,
  onToggleLike,
  onDeleteIdea, 
  onEditIdea,
  onLoadComments,
  onAddComment,
  onDeleteComment,
  deletingIdea,
  togglingLike,
  isAdmin,
  onUpdateStatus,
}) => {
  const isAuthor = currentUserId !== null && idea.autor.usu_id === currentUserId;

  const getStatusTagColor = (status: Idea['estado']) => {
    switch (status) {
      case 'Recibida': return 'default';
      case 'EnRevision': return 'processing';
      case 'Aprobada': return 'success';
      case 'Rechazada': return 'error';
      case 'Implementada': return 'blue';
      default: return 'default';
    }
  };

  const statusMenu = (
    <Menu
      onClick={({ key }) => onUpdateStatus(idea.idea_id, key as EstadoPropuesta)}
      items={Object.values(EstadoPropuesta).map(status => ({
        key: status,
        label: status,
        disabled: status === idea.estado, 
      }))}
    />
  );

  return (
    <Card
      style={{ marginBottom: 20 }}
      actions={[
          <Space size="small" wrap key="actions" style={{ justifyContent: 'center', width: '100%' }}>
          {idea.is_public && (
            <LikeButton
              key="like-btn"
              ideaId={idea.idea_id}
              likedByMe={likedByMe}
              likeCount={idea._count?.likes || 0}
              loading={togglingLike}
              onToggleLike={onToggleLike}
              disabled={!currentUserId}
            />
          )}
          {isAdmin && (
            <Dropdown overlay={statusMenu} trigger={['click']} key="status-change-dropdown">
              <Button type="text" icon={<SettingOutlined />}>
                Cambiar Estado
              </Button>
            </Dropdown>
          )}

          {isAuthor && (
            <Button type="text" icon={<EditOutlined />} key="edit-btn" onClick={() => onEditIdea(idea)}>
              Editar
            </Button>
          )}
          {isAuthor && (
            <Popconfirm
              title="¿Estás seguro que quieres borrar esta propuesta?"
              onConfirm={() => onDeleteIdea(idea.idea_id)}
              okText="Si"
              cancelText="No"
              key="delete-popconfirm"
              disabled={deletingIdea}
            >
              <Button type="text" icon={<DeleteOutlined />} danger loading={deletingIdea}>
                Borrar
              </Button>
            </Popconfirm>
          )}
        </Space>
      ].filter(Boolean)}
    >
      <Card.Meta
        avatar={<Avatar icon={<UserOutlined />} alt={idea.autor.nombre || 'User'} size="large" />}
        title={<Text strong style={{ fontSize: '1.1em' }}>{idea.titulo}</Text>} 
        description={
           <Space direction="vertical" size={4} style={{ width: '100%' }}> 
            <Text type="secondary" style={{ fontSize: '0.85em' }}> 
              Por {idea.autor.nombre || `User ${idea.autor.usu_id}`} •{' '}
              {moment(idea.fecha_creacion).fromNow()}
            </Text>
            <div>
              <Tag color={getStatusTagColor(idea.estado)}>{idea.estado}</Tag>
              {!idea.is_public && <Tag color="warning">Privada</Tag>}
            </div>
          </Space>
        }
      />
      <div style={{ marginTop: 16 }}>
        <Text style={{ wordBreak: 'break-word' }}>{idea.contenido}</Text>
      </div>

      {idea.is_public && (
        <CommentSection
          ideaId={idea.idea_id}
          initialCommentCount={idea._count?.comentarios || 0}
          currentUserId={currentUserId}
          comments={comments}
          loadingComments={loadingComments}
          addingComment={addingComment}
          deletingCommentId={deletingCommentId}
          onLoadComments={onLoadComments} 
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment} 
        />
      )}
    </Card>
  );
};

export default IdeaCard;
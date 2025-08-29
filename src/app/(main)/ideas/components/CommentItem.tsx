import React from 'react';
import { Avatar, Button, Typography, Popconfirm, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Comment as CommentType } from '@/interfaces/ideaInterfaces'; 

const { Text } = Typography;

interface CommentItemProps {
  comment: CommentType;
  currentUserId: number | null;
  onDeleteComment: (commentId: number) => void;
  deleting: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onDeleteComment,
  deleting,
}) => {
 
  const isAuthor = currentUserId !== null && comment.autor.usu_id === currentUserId;

  return (
    <div 
     style={{
        display: 'flex',
        width: '100%',
        alignItems: 'flex-start',
        padding: '8px 0',
        borderBottom: '1px solid #f0f0f0', 
      }}
    >
      <Avatar icon={<UserOutlined />} style={{ marginRight: 12, flexShrink: 0 }} />
      <div style={{ flexGrow: 1, minWidth: 0  }}>
        <Space direction="vertical" size={2} style={{ width: '100%' }}>
          <Text strong style={{ fontSize: '0.95em' }}>{comment.autor?.nombre || `User ${comment.autor.usu_id}`}</Text> 
          <Text type="secondary" style={{ fontSize: '0.75em' }}>
            {moment(comment.fecha_creacion).fromNow()}
          </Text>
          <Text style={{ wordBreak: 'break-word' }}>{comment.contenido}</Text>
        </Space>
      </div>
      {isAuthor && (
        <Popconfirm
          title="Estas seguro de que quieres eliminar este comentario?"
          onConfirm={() =>  onDeleteComment(comment.comentario_id)}
          okText="Si"
          cancelText="No"
        >
          <Button type="link" danger disabled={deleting} style={{ flexShrink: 0, marginLeft: 8 }}>
            Eliminar
          </Button>
        </Popconfirm>
      )}
    </div>
  );
};

export default CommentItem;
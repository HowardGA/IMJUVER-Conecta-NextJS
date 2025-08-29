'use client';
import React, { useState } from 'react';
import { List, Input, Button, Form, Spin, Empty, Divider } from 'antd';
import CommentItem from './CommentItem';
import { Comment as CommentType, CreateCommentPayload } from '@/interfaces/ideaInterfaces';

const { TextArea } = Input;

interface CommentSectionProps {
  ideaId: number;
  initialCommentCount: number;
  currentUserId: number | null;
  comments: CommentType[];
  loadingComments: boolean;
  addingComment: boolean;
  deletingCommentId: number | null;
  onLoadComments: (ideaId: number) => void; 
  onAddComment: (ideaId: number, payload: CreateCommentPayload) => void;
  onDeleteComment: (commentId: number) => void; 
}

const CommentSection: React.FC<CommentSectionProps> = ({
  ideaId,
  initialCommentCount,
  currentUserId,
  comments,
  loadingComments,
  addingComment,
  deletingCommentId,
  onLoadComments,
  onAddComment,
  onDeleteComment,
}) => {
  const [form] = Form.useForm();
  const [commentsAreExpanded, setCommentsAreExpanded] = useState(false);

  const handleToggleCommentsVisibility = () => {
    onLoadComments(ideaId);
    setCommentsAreExpanded(prev => !prev);
  };

  const handleAddComment = (values: { contenido: string }) => {
    if (currentUserId === null) {
      console.warn('Cannot add comment: User not logged in.');
      return;
    }
    const payloadWithAutorId: CreateCommentPayload = {
      contenido: values.contenido,
      autorId: currentUserId,
    };
    onAddComment(ideaId, payloadWithAutorId);
    form.resetFields();
  };

  return (
    <div style={{ marginTop: 20 }}>
      <Button
        onClick={handleToggleCommentsVisibility}
        block
        loading={loadingComments && commentsAreExpanded}
        variant='solid'
        color='gold'
      >
        {commentsAreExpanded ? `Esconder Comentarios` : `Mostrar ${initialCommentCount} Comentarios`}
      </Button>

      {commentsAreExpanded && (
        <>
          <Divider style={{ margin: '20px 0' }}>Comentarios ({comments.length})</Divider>
          {loadingComments ? (
            <Spin tip="Loading comments..." style={{ display: 'block', textAlign: 'center', padding: '20px 0' }} />
          ) : (
            comments.length > 0 ? (
              <List
                dataSource={comments}
                itemLayout="vertical"
                renderItem={comment => (
                  <List.Item style={{ padding: '0' }}>
                    <CommentItem
                      comment={comment}
                      currentUserId={currentUserId}
                      onDeleteComment={onDeleteComment} 
                      deleting={deletingCommentId === comment.comentario_id}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No existen comentarios." image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ padding: '20px 0' }}  />
            )
          )}
          {currentUserId && (
            <Form form={form} onFinish={handleAddComment} style={{ marginTop: 16 }} layout="vertical">
              <Form.Item
                name="contenido"
                rules={[{ required: true, message: 'Please input your comment!' }]}
              >
                <TextArea rows={2} placeholder="Escribe tu comentario..." />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" loading={addingComment} type="primary" block>
                  Agregar Comentario
                </Button>
              </Form.Item>
            </Form>
          )}
        </>
      )}
    </div>
  );
};

export default CommentSection;
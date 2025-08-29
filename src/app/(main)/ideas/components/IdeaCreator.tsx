// components/IdeaCreator.tsx
'use client';

import React from 'react';
import { Form, Input, Button, Radio, Card, Typography } from 'antd';
import { CreateIdeaPayload } from '@/interfaces/ideaInterfaces';
const {Title} = Typography;
const { TextArea } = Input;

interface IdeaCreatorProps {
  currentUserId: number | null; // Null if no user logged in
  onCreateIdea: (payload: CreateIdeaPayload) => void; // Callback for creating a new idea
  creatingIdea: boolean; // Indicates if an idea is currently being submitted
}

const IdeaCreator: React.FC<IdeaCreatorProps> = ({ currentUserId, onCreateIdea, creatingIdea }) => {
  const [form] = Form.useForm();

  const onFinish = (values: CreateIdeaPayload) => {
    if (currentUserId === null) {
      alert('You must be logged in to create an idea.');
      return;
    }
    onCreateIdea(values);
    form.resetFields();
  };

  return (
    <Card title={<Title level={4}>Registra tu propuesta</Title>} style={{ marginBottom: 20 }}> 
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ is_public: true }}
      >
        <Form.Item
          name="titulo"
          label="Titulo de tu propuesta"
          rules={[{ required: true, message: 'Por favor ingresa un titulo!' }]}
        >
          <Input placeholder="E.j. Taller de manualidades" />
        </Form.Item>
        <Form.Item
          name="contenido"
          label="Detalles de tu propuesta"
          rules={[{ required: true, message: 'Debes de argumentar tu propuesta!' }]}
        >
          <TextArea rows={4} placeholder="Describe en detaller tu propuesta..." />
        </Form.Item>
        <Form.Item name="is_public" label="Visibilidad">
          <Radio.Group disabled={creatingIdea} style={{ display: 'flex', flexDirection: 'column' }}>
            <Radio value={true}>Publica (Es visible a la comunidad y se pueda interactuar con ella)</Radio>
            <Radio value={false}>Privada (Solo el IMJUVER la podra ver)</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={creatingIdea} disabled={!currentUserId || creatingIdea} block>
            Registrar Propuesta
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default IdeaCreator;
'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Checkbox } from 'antd';
import { useCreateManagerUser, useGetAllRoles } from '@/hooks/adminHooks';
import { useMessage } from '@/components/providers/MessageProvider';

const { Option } = Select;
const { Password } = Input;

interface CreateManagerUserModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateManagerUserModal({ open, onClose }: CreateManagerUserModalProps) {
  const [form] = Form.useForm();
  const createMutation = useCreateManagerUser();
  const { data: roles, isLoading: isLoadingRoles, isError: isErrorRoles } = useGetAllRoles();
  const messageApi = useMessage();

  useEffect(() => {
    if (open) {
      form.resetFields(); 
      form.setFieldsValue({ estado: true, isVerified: true }); 
    }
  }, [open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const newUserData = {
        ...values,
        isVerified: true,
      };

      createMutation.mutate(newUserData, {
        onSuccess: () => {
          messageApi.success('Usuario gestor creado exitosamente!');
          onClose(); // Close modal on success
        },
        onError: (error) => {
          messageApi.error(`Error al crear usuario: ${error.message}`);
        },
      });
    } catch (error) {
      console.error('Validation failed:', error);
      messageApi.error('Por favor, completa todos los campos requeridos.');
    }
  };

  return (
    <Modal
      title="Crear Usuario Gestor"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={createMutation.isPending}> 
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={createMutation.isPending}
          onClick={handleSubmit}
        >
          Crear Usuario
        </Button>,
      ]}
       centered
       maskClosable={!createMutation.isPending}
       destroyOnHidden
       style={{ top: 20 }} 
    >
      <Form
        form={form}
        layout="vertical"
        name="create_manager_user_form"
      >
        <Form.Item
          name="nombre"
          label="Nombre"
          rules={[{ required: true, message: 'Por favor ingresa el nombre!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Por favor ingresa el email!' }, { type: 'email', message: 'Email no válido!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Contraseña"
          rules={[{ required: true, message: 'Por favor ingresa la contraseña!' }, { min: 6, message: 'Contraseña debe tener al menos 6 caracteres!' }]}
        >
          <Password />
        </Form.Item>
        <Form.Item
          name="rol_id"
          label="Rol"
          rules={[{ required: true, message: 'Por favor selecciona un rol!' }]}
        >
          <Select placeholder="Selecciona un rol" loading={isLoadingRoles}>
            {isErrorRoles && <Option disabled>Error cargando roles</Option>}
            {roles?.map(role => (
              <Option key={role.rol_id} value={role.rol_id}>
                {role.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="estado" valuePropName="checked">
          <Checkbox>Activo</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
}
'use client';

import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import { Idea, EstadoPropuesta } from '@/interfaces/ideaInterfaces';
import dayjs from 'dayjs';

const { Item } = Descriptions;

interface IdeaDetailsModalProps {
  idea: Idea | null; 
  onClose: () => void; 
}

export default function IdeaDetailsModal({ idea, onClose }: IdeaDetailsModalProps) {
  if (!idea) {
    return null; 
  }

  const getEstadoColor = (estado: EstadoPropuesta) => {
    switch (estado) {
      case EstadoPropuesta.Recibida: return 'blue';
      case EstadoPropuesta.EnRevision: return 'purple';
      case EstadoPropuesta.Aprobada: return 'green';
      case EstadoPropuesta.Rechazada: return 'red';
      case EstadoPropuesta.Implementada: return 'gold';
      default: return 'default';
    }
  };

  return (
    <Modal
      title={`Detalles de la Idea: ${idea.titulo}`} 
      open={true} 
      onCancel={onClose} 
      footer={null} 
      width={700} 
      centered
      style={{ top: 20 }} 
    >
       <Descriptions
        bordered
        column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
        size="middle"
      >
        <Item label="ID">{idea.idea_id}</Item>
        <Item label="Título">{idea.titulo}</Item>
        <Item label="Descripción" span={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}>{idea.contenido}</Item>
        <Item label="Autor">
          {idea.autor?.nombre || 'N/A'} (ID: {idea.autor?.usu_id || 'N/A'})
        </Item>
        <Item label="Fecha de Creación">
          {dayjs(idea.fecha_creacion).format('DD/MM/YYYY HH:mm')}
        </Item>
        <Item label="Última Modificación">
          {dayjs(idea.fecha_modificacion).format('DD/MM/YYYY HH:mm')}
        </Item>
        <Item label="Estado">
          <Tag color={getEstadoColor(idea.estado)}>
            {idea.estado}
          </Tag>
        </Item>
        <Item label="Es Pública">
          <Tag color={idea.is_public ? 'green' : 'red'}>
            {idea.is_public ? 'Sí' : 'No'}
          </Tag>
        </Item>
        <Item label="Visible">
          <Tag color={idea.visible ? 'green' : 'red'}>
            {idea.visible ? 'Sí' : 'No'}
          </Tag>
        </Item>
      </Descriptions>
    </Modal>
  );
}
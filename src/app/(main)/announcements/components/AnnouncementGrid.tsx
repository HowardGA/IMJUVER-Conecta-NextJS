'use client';

import React from 'react';
import { Row, Col, Typography, Empty } from 'antd';
import AnnouncementCard from './AnnouncementCard';
import { Publicacion } from '@/interfaces/announcementInterface';
import { useRouter } from 'next/navigation';

const { Title } = Typography;
interface AnnouncementGridProps {
  announcements: Publicacion[]
}

const AnnouncementGrid: React.FC<AnnouncementGridProps> = (announcements) => {
  const router = useRouter();
  const upcomingEvents = announcements.announcements.filter((event) => {
  if (!event.fecha_evento) return false;
  return new Date(event.fecha_evento) > new Date();
});

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
        Próximos Eventos y Anuncios
      </Title>
      {upcomingEvents.length > 0 ? (
        <Row gutter={[24, 24]} justify="center">
          {upcomingEvents.map(event => (
            <Col
              key={event.pub_id}
              xs={24}
              sm={24} 
              md={12} 
              lg={8} 
              xl={6}
              style={{ display: 'flex', justifyContent: 'center' }} 
            >
              <AnnouncementCard
                title={event.titulo}
                imageUrl={event.imagen_url ?? ""}
                eventDate={new Date(event.fecha_evento!)}
                onClick={() => router.push(`/announcements/${event.pub_id}`)}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          description="No hay eventos o anuncios próximos por el momento."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: '60px' }}
        />
      )}
    </div>
  );
};

export default AnnouncementGrid;
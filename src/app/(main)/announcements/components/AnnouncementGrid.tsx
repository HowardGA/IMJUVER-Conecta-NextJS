import React from 'react';
import { Row, Col, Typography, Empty } from 'antd';
import AnnouncementCard from './AnnouncementCard';
import { Publicacion } from '@/interfaces/announcementInterface';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

interface AnnouncementGridProps {
  announcements: Publicacion[];
}

const AnnouncementGrid: React.FC<AnnouncementGridProps> = ({ announcements }) => { 
  const router = useRouter();

  const filteredAnnouncements = announcements.filter((event) => {
    if (!event.fecha_evento) {
      return true;
    }
    return new Date(event.fecha_evento) > new Date();
  });

  return (
    <div style={{ padding: '1rem' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '24px', fontSize: '1.8em' }}>
        Próximos Eventos y Anuncios
      </Title>
      {filteredAnnouncements.length > 0 ? ( 
        <Row gutter={[24, 24]} justify="center">
          {filteredAnnouncements.map(event => (
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
                imageUrl={event.main_image_data?.url ?? ""}
                eventDate={event.fecha_evento ? new Date(event.fecha_evento) : undefined}
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
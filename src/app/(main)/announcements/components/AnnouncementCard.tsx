'use client';

import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

interface AnnouncementCardProps {
  title: string;
  imageUrl: string;
  eventDate?: Date; 
  onClick?: () => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ title, imageUrl, eventDate, onClick }) => {
  const formattedDate = eventDate?.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card
      hoverable
      style={{ width: '100%', overflow: 'hidden' }}
      onClick={onClick}
      styles={{ body: {padding: 0 }}}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 200, 
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
        }}
      >
        <div
         style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)',
            zIndex: 1,
          }}
        />

        <div
            style={{
              position: 'absolute',
              top: 12, 
              right: 12, 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: 'black',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '11px', 
              fontWeight: 'bold',
              zIndex: 3,
            }}
        >
          {formattedDate}
        </div>

        <div style={{ position: 'relative', zIndex: 2, padding: 16, width: '100%' }}>
          <Title level={4} style={{ color: 'white', margin: 0, marginBottom: 4 }}>
            {title}
          </Title>
        </div>
      </div>
    </Card>
  );
};

export default AnnouncementCard;
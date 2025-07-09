import { Row, Col } from 'antd';
import DirectoryCard from './DirectoryCard';
import DirectoryDetailsModal from './DirectoryDetailsModal';
import { Directorio } from '@/interfaces/directorioInterface';
import { useState } from 'react';

interface DirectoryGridProps {
  directorio: Directorio[];
}

export default function DirectoryGrid({ directorio }: DirectoryGridProps) {
  const [selectedContact, setSelectedContact] = useState<Directorio | null>(null);

  return (
    <>
      <Row gutter={[16, 16]} justify='center' style={{padding: '2rem'}}>
        {directorio.map((contacto) => (
          <Col key={contacto.dir_id} xs={24} sm={12} lg={8}>
            <DirectoryCard 
              directorio={contacto} 
              onClick={() => setSelectedContact(contacto)} 
            />
          </Col>
        ))}
      </Row>

      <DirectoryDetailsModal
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
      />
    </>
  );
}
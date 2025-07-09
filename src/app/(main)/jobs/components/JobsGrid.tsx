import { Row, Col } from 'antd';
import JobCard from './JobCard';
import JobDetailsModal from './JobDetailsModal';
import { Oferta } from '@/interfaces/ofertaInterface';
import { useState } from 'react';

interface JobsGridProps {
  offers: Oferta[];
}

export default function JobsGrid({ offers }: JobsGridProps) {
  const [selectedOffer, setSelectedOffer] = useState<Oferta | null>(null);

  return (
    <>
      <Row gutter={[16, 16]} justify='center' style={{padding: '2rem'}}>
        {offers.map((offer) => (
          <Col key={offer.of_id} xs={24} sm={12} lg={8}>
            <JobCard 
              offer={offer} 
              onClick={() => setSelectedOffer(offer)} 
            />
          </Col>
        ))}
      </Row>

      <JobDetailsModal
        offer={selectedOffer}
        onClose={() => setSelectedOffer(null)}
      />
    </>
  );
}
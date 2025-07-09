'use client'
import { useState } from 'react';
import { Button, Card, Col, Row, Spin } from 'antd';
import { useGetAllOffers } from '@/hooks/ofertasHooks';
import JobFilters from './components/JobFilters';
import CreateJobModal from './components/CreateJobModal';
import JobsGrid from './components/JobsGrid';
import { Oferta } from '@/interfaces/ofertaInterface';
import Hero from '@/components/ui/Hero';
import JobsImg from '../../../../public/jobs.png';
import { PlusOutlined } from '@ant-design/icons';

export default function JobsPage() {
  const { data: offers, isLoading, error } = useGetAllOffers();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredOffers = selectedCategory
    ? offers?.filter((offer: Oferta) => offer.cat_of_id === selectedCategory)
    : offers;

  return (
    <>
    <Hero title="Ofertas y oportunidades de trabajo" subTitle="Estamos contigo para encontrar un trabajo indicado para tí" imageSrc={JobsImg}/>
      <Row justify='end' gutter={12} style={{padding: '2rem 4rem'}}>
        <Col>
            <JobFilters 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            />
        </Col>
        <Col>
        <Button 
          type="primary" 
          onClick={() => setIsCreateModalOpen(true)}
        >
            <PlusOutlined/>
          Crear nueva oferta
        </Button>
        </Col>
      </Row>

      

      {isLoading ? (
        <div className="text-center py-12">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Card className="text-center py-12">
          <p className="text-red-500">Error loading job listings</p>
        </Card>
      ) : (
        <JobsGrid offers={filteredOffers || []} />
      )}

      <CreateJobModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
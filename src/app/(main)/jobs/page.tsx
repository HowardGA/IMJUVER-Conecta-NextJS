'use client'
import { useState, useMemo } from 'react';
import { Button, Card, Col, Row, Spin } from 'antd';
import { useGetAllOffers } from '@/hooks/ofertasHooks';
import JobFilters from './components/JobFilters';
import CreateJobModal from './components/CreateJobModal';
import JobsGrid from './components/JobsGrid';
import { Oferta } from '@/interfaces/ofertaInterface';
import Hero from '@/components/ui/Hero';
import JobsImg from '../../../../public/jobs.png';
import { PlusOutlined } from '@ant-design/icons';
import { useUser } from '@/components/providers/UserProvider';

export default function JobsPage() {
  const { data: offers, isLoading, error } = useGetAllOffers();
  const {user} = useUser();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterMujerOnly, setFilterMujerOnly] = useState<boolean>(false);

 const filteredOffers = useMemo(() => {
    let currentFiltered = offers;
    if (selectedCategory !== null) {
      currentFiltered = currentFiltered?.filter(
        (offer: Oferta) => offer.cat_of_id === selectedCategory
      );
    }
    if (filterMujerOnly) {
      currentFiltered = currentFiltered?.filter(
        (offer: Oferta) => offer.mujer === true
      );
    }

    return currentFiltered || [];
  }, [offers, selectedCategory, filterMujerOnly]);


  return (
    <div style={{ backgroundImage: `url('/background/imjuver-pattern.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed', }}>
      <Hero title="Ofertas y oportunidades de trabajo" subTitle="Estamos contigo para encontrar un trabajo indicado para tí" imageSrc={JobsImg}/>

      <Row
        justify="space-between" 
        align="middle"
        gutter={[12, 12]}
        style={{ padding: '1rem', flexWrap: 'wrap' }} 
      >
        <Col xs={24} sm={12} md={12} lg={10}> 
            <JobFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            filterMujerOnly={filterMujerOnly}
            onFilterMujerOnlyChange={setFilterMujerOnly}
            />
        </Col>
        <Col xs={24} sm={12} md={12} lg={4} style={{ textAlign: 'right' }}> 
        {(user?.rol_id === 1 || user?.rol_id === 5 || user?.rol_id === 6 )&&
          <Button
            type="primary"
            onClick={() => setIsCreateModalOpen(true)}
            block 
          >
              <PlusOutlined/>
            Crear nueva oferta
          </Button>
        }
        </Col>
      </Row>

      {isLoading ? (
        <div className="text-center py-12">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Card className="text-center py-12">
          <p className="text-red-500">Error cargando las ofertas</p>
        </Card>
      ) : (
        <JobsGrid offers={filteredOffers || []} />
      )}

      <CreateJobModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
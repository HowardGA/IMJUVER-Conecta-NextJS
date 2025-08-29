'use client'
import { useState } from 'react';
import { Button, Card, Col, Row, Spin } from 'antd';
import { useDirectorio } from '@/hooks/directorioHooks';
import DirectoryFilters from './components/DirectoryFilters';
import CreateDirectoryModal from './components/CreateDirectoryModal';
import DirectoryGrid from './components/DirectoryGrid';
import { Directorio } from '@/interfaces/directorioInterface';
import Hero from '@/components/ui/Hero';
import DirImg from '../../../../public/directory.png';
import { PlusOutlined } from '@ant-design/icons';
import { useUser } from '@/components/providers/UserProvider';

export default function DirectoryOage() {
  const { data: offers, isLoading, error } = useDirectorio();
  const {user} = useUser();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredOffers = selectedCategory
    ? offers?.filter((directorio: Directorio) => directorio.cat_dir_id === selectedCategory)
    : offers;

  return (
    <div style={{ backgroundImage: `url('/background/imjuver-pattern.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed', }}>
    <Hero title="Directorio de personas y organizaciones" subTitle="Te conectamos con los sevicios y la ayuda que necesites" imageSrc={DirImg}/>
      <Row justify='end' gutter={[12, 12]} style={{padding: '1rem'}} wrap>
        <Col xs={24} sm={12} md={8} lg={6}>
            <DirectoryFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            />
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
        {(user?.rol_id === 1 || user?.rol_id === 6 || user?.rol_id === 4) &&
          <Button 
            type="primary" 
            onClick={() => setIsCreateModalOpen(true)}
          >
              <PlusOutlined/>
            Crear nuevo Contacto
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
          <p className="text-red-500">Error loading job listings</p>
        </Card>
      ) : (
        <DirectoryGrid directorio={filteredOffers || []} />
      )}

      <CreateDirectoryModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
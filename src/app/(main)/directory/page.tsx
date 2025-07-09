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

export default function DirectoryOage() {
  const { data: offers, isLoading, error } = useDirectorio();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredOffers = selectedCategory
    ? offers?.filter((directorio: Directorio) => directorio.cat_dir_id === selectedCategory)
    : offers;

  return (
    <>
    <Hero title="Directorio de personas y organizaciones" subTitle="Te conectamos con los sevicios y la ayuda que necesites" imageSrc={DirImg}/>
      <Row justify='end' gutter={12} style={{padding: '2rem 4rem'}}>
        <Col>
            <DirectoryFilters
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
          Crear nuevo Contacto
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
        <DirectoryGrid directorio={filteredOffers || []} />
      )}

      <CreateDirectoryModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
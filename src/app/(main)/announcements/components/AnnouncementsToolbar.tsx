'use client';
import React from 'react';
import { Row, Col, Button, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useGetAllAnnouncementCategories } from "@/hooks/announcementHooks"; 
import { CategoriaPublicacion } from '@/interfaces/announcementInterface'; 
import { useUser } from '@/components/providers/UserProvider';

const { Option } = Select;

interface AnnoucementsToolbarProps {
    onSearchChange: (searchTerm: string) => void;
    onCategoryChange: (categoryId: number | null) => void;
    onAddAnnouncementClick: () => void; 
}

const AnnoucementsToolbar: React.FC<AnnoucementsToolbarProps> = ({
    onSearchChange,
    onCategoryChange,
    onAddAnnouncementClick,
}) => {
    const { data: categories, isLoading: categoriesLoading } = useGetAllAnnouncementCategories();
    const {user} = useUser();

    const handleSearch = (value: string) => {
        onSearchChange(value);
    };

    const handleCategoryChange = (value: string) => {
        const categoryId = value === 'all' ? null : parseInt(value, 10);
        onCategoryChange(categoryId);
    };

    return (
        <Row
            style={{ width: '100%', padding: '1rem' }}
            align='middle'
            justify='space-between'
            gutter={[16, 16]} 
            wrap 
        > 

            <Col xs={24} sm={12} lg={8}> 
                <Input.Search
                    placeholder="Buscar anuncios..."
                    onSearch={handleSearch}
                    style={{ width: '100%' }}
                    allowClear
                />
            </Col>

            <Col xs={24} sm={12} lg={6}> 
                <Select
                    defaultValue="all"
                    style={{ width: '100%' }} 
                    onChange={handleCategoryChange}
                    loading={categoriesLoading}
                    placeholder="Seleccionar categoría"
                >
                    <Option value="all">Todas las Categorías</Option>
                    {categories?.map((category: CategoriaPublicacion) => (
                        <Option key={category.cat_pub_id} value={category.cat_pub_id.toString()}>
                            {category.nombre}
                        </Option>
                    ))}
                </Select>
            </Col>

        {(user?.rol_id === 1 || user?.rol_id === 3 || user?.rol_id === 6) && (
                <Col xs={24} lg={8}> 
                    <Button
                        type="primary"
                        onClick={onAddAnnouncementClick}
                        block 
                    >
                        <PlusOutlined />
                        Crear nuevo anuncio
                    </Button>
                </Col>
            )}
        </Row>
    );
}

export default AnnoucementsToolbar;
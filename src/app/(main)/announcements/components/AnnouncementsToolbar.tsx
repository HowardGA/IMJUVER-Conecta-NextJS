// src/app/announcements/components/AnnouncementsToolbar.tsx
'use client';
import React from 'react';
import { Row, Button, Input, Select, Space } from "antd";
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
        <Row style={{ width: '100%', padding: '1rem 4rem' }} align='middle' justify='space-between'>
            <Space>
                <Input.Search
                    placeholder="Buscar anuncios..."
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                    allowClear
                />

                <Select
                    defaultValue="all"
                    style={{ width: 200 }}
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
            </Space>

        {user?.rol_id === 1 &&
            <Button type="primary" onClick={onAddAnnouncementClick}>
                <PlusOutlined/>
                Crear nuevo anuncio
            </Button>
        }
        </Row>
    );
}

export default AnnoucementsToolbar;
'use client'
import React, {useState} from "react";
import { Col, Row, Input, Select, Button} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useGetCourseCategories } from "@/hooks/useCourses";

interface CourseToolbarProps {
    onSearch: (searchText: string) => void;
    onCategoryChange: (categoryId: number | null) => void;
    onAddCourse: () => void;
}
type CategorySelectOption = {
    value: number | null;
    label: string;
};

const CourseToolbar: React.FC<CourseToolbarProps> = ({onSearch, onCategoryChange, onAddCourse}) => {
    const {data: categories, isLoading} = useGetCourseCategories();
    const [searchText, setSearchText] = useState('');

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchText(value);
        onSearch(value);
    };

    const handleCategorySelectChange = (value: number | null) => {
        onCategoryChange(value);
    };

    const categoryOptions = React.useMemo<CategorySelectOption[]>(() => {
        const options: CategorySelectOption[] = [{
            value: null,
            label: 'Todos'
        }];

        if (categories && categories.length > 0) {
            options.push(...categories.map(category => ({
                value: category.cat_cursos_id,
                label: category.nombre
            })));
        }
        return options;
    }, [categories]);

    return(
        <Row justify="center" gutter={[16, 16]} style={{ padding: '20px' }}>
            <Col xs={24} sm={12} md={8}>
                <Input placeholder="Busca por nombre" prefix={<SearchOutlined/>} onChange={handleSearchInputChange} value={searchText} allowClear/>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Select
                    placeholder="Filtrar por categoría"
                    style={{ width: '100%' }}
                    onChange={handleCategorySelectChange}
                    loading={isLoading} 
                    options={categoryOptions}
                    allowClear
                />
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Button onClick={onAddCourse}>
                    <Row align="middle" gutter={4}>
                        <PlusOutlined/>
                        <Col>Crear Curso</Col>
                    </Row>
                </Button>
            </Col>
        </Row>
    );
}

export default CourseToolbar;
import { Select } from 'antd';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

const { Option } = Select;

interface JobFiltersProps {
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

interface CategoriesResponse {
  label:string;
  value:number;
}

export default function JobFilters({
  selectedCategory,
  onCategoryChange,
}: JobFiltersProps) {
  const { data: categoriesResponse } = useQuery<CategoriesResponse[]>({
    queryKey: ['categories'],
    queryFn: () => apiClient.get('/ofertas/categorias-ofertas').then(res => res.data),
  });

  const categories = categoriesResponse || [];

  return (
      <Select
        value={selectedCategory}
        onChange={onCategoryChange}
        style={{ width: 200 }}
        placeholder="Todas las categorias"
        allowClear
      >
        {categories.map((category:CategoriesResponse) => (
          <Option key={category.value} value={category.value}>
            {category.label}
          </Option>
        ))}
      </Select>
  );
}
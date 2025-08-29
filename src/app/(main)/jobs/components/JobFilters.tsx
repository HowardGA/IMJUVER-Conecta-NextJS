import { Select, Space, Checkbox } from 'antd';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

const { Option } = Select;

interface JobFiltersProps {
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  filterMujerOnly: boolean;
  onFilterMujerOnlyChange: (checked: boolean) => void;

}

interface CategoriesResponse {
  label:string;
  value:number;
}

export default function JobFilters({
  selectedCategory,
  onCategoryChange,
  filterMujerOnly,
  onFilterMujerOnlyChange,
}: JobFiltersProps) {
  const { data: categoriesResponse } = useQuery<CategoriesResponse[]>({
    queryKey: ['categories'],
    queryFn: () => apiClient.get('/ofertas/categorias-ofertas').then(res => res.data),
  });

  const categories = categoriesResponse || [];

  return (
     <Space direction="vertical" size="small" style={{ width: '100%' }}> 
      <Select
        value={selectedCategory}
        onChange={onCategoryChange}
        style={{ width: '100%' }} 
        placeholder="Todas las categorias"
        allowClear
      >
        {categories.map((category: CategoriesResponse) => (
          <Option key={category.value} value={category.value}>
            {category.label}
          </Option>
        ))}
      </Select>

      <Checkbox
        checked={filterMujerOnly}
        onChange={(e) => onFilterMujerOnlyChange(e.target.checked)}
      >
        Solo para mujeres
      </Checkbox>
    </Space>
  );
}
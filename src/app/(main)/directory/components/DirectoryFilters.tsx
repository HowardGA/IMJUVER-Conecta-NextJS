import { Select } from 'antd';
import { useDirectorioCategories } from '@/hooks/directorioHooks';
const { Option } = Select;

interface JobFiltersProps {
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

interface CategoriesResponse {
  label:string;
  value:number;
}

export default function DirectoryFilters({
  selectedCategory,
  onCategoryChange,
}: JobFiltersProps) {
  const { data: categoriesResponse } = useDirectorioCategories();

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
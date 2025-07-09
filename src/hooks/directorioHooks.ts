import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { Directorio, CreateDirectorioDto, UpdateDirectorioDto } from '@/interfaces/directorioInterface';

// Get all directory entries
export const useDirectorio = () => {
  return useQuery<Directorio[]>({
    queryKey: ['directorio'],
    queryFn: async () => {
      const { data } = await apiClient.get('/directorio/');
      return data;
    },
  });
};

// Get single directory entry
export const useDirectorioEntry = (id: number) => {
  return useQuery<Directorio>({
    queryKey: ['directorio', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/directorio/single/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Create directory entry
export const useCreateDirectorio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newEntry: CreateDirectorioDto) => 
      apiClient.post('/directorio/', newEntry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['directorio'] });
    },
  });
};

// Update directory entry
export const useUpdateDirectorio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ dir_id, ...data }: UpdateDirectorioDto) => 
      apiClient.put(`/directorio/${dir_id}`, data),
    onSuccess: (_, { dir_id }) => {
      queryClient.invalidateQueries({ queryKey: ['directorio'] });
      queryClient.invalidateQueries({ queryKey: ['directorio', dir_id] });
    },
  });
};

// Delete directory entry
export const useDeleteDirectorio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => 
      apiClient.delete(`/directorio/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['directorio'] });
    },
  });
};

// Get directory categories
export const useDirectorioCategories = () => {
  return useQuery({
    queryKey: ['directorio-categories'],
    queryFn: async () => {
      const { data } = await apiClient.get('/directorio/categorias');
      return data;
    },
  });
};
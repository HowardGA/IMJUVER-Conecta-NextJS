import apiClient from '@/lib/apiClient';
import apiClientForm from '@/lib/apiClientForm';
import {
  Publicacion,
  GetPublicacionesFilters,
  CategoriaPublicacion, 
} from '@/interfaces/announcementInterface';
import { BackendUpdatePayload} from '../hooks/announcementHooks' 

export const createAnnouncement = async (formData: FormData): Promise<Publicacion> => {
  const response = await apiClientForm.post<Publicacion>(
    '/announcements/',
    formData,
    {  
        withCredentials: true } 
  );
  return response.data;
};


export const updateAnnouncement = async (
  id: number,
  data: BackendUpdatePayload
): Promise<Publicacion> => {
    const response = await apiClient.patch<Publicacion>(`/announcements/${id}`, data);
    return response.data;
};

export const softDeleteAnnouncement = async (id: number): Promise<{ message: string; announcement: Publicacion }> => {
    const response = await apiClient.delete<{ message: string; announcement: Publicacion }>(`/announcements/${id}`);
    return response.data;
};

export const deleteAnnouncement = async (id: number): Promise<{ message: string; announcement: Publicacion }> => {
    const response = await apiClient.delete<{ message: string; announcement: Publicacion }>(`/announcements/delete/${id}`);
    return response.data;
};

export const getAnnouncements = async (filters?: GetPublicacionesFilters): Promise<Publicacion[]> => {
    console.log(filters)
    const response = await apiClient.get<Publicacion[]>('/announcements/all', {
      params: filters, 
    });
    return response.data;
};

export const getAnnouncementById = async (id: number): Promise<Publicacion> => {
    const response = await apiClient.get<Publicacion>(`/announcements/${id}`);
    return response.data;
};

export const getAnnouncementCategories = async (): Promise<CategoriaPublicacion[]> => {
    const response = await apiClient.get<CategoriaPublicacion[]>(`/announcements/category`);
    return response.data;
};

export const getFeaturedAnnouncements = async (): Promise<Publicacion[]> => {
    const response = await apiClient.get('/announcements/featured'); 
    return response.data;
};
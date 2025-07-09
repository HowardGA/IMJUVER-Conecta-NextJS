import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Publicacion,
  GetPublicacionesFilters,
  CategoriaPublicacion,
} from '@/interfaces/announcementInterface'; 
import { createAnnouncement, getAnnouncementById,
        getAnnouncements, deleteAnnouncement,
        softDeleteAnnouncement, updateAnnouncement, getAnnouncementCategories,
      getFeaturedAnnouncements } from "@/services/announcementServices";
import { useQueryClient } from "@tanstack/react-query";


export const useGetAllAnnouncements = (filters?: GetPublicacionesFilters) => {
  return useQuery<Publicacion[], Error>({
    queryKey: ['announcements', filters],
    queryFn: () => getAnnouncements(filters),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetSingleAnnouncement = (id: number) => {
 return useQuery<Publicacion, Error>({
    queryKey: ['announcement', id],
    queryFn: () => {
      if (id === null || id === undefined) {
        throw new Error("Announcement ID is required for useGetSingleAnnouncement");
      }
      return getAnnouncementById(id);
    },
    enabled: !!id, 
  });
};


export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation<Publicacion, Error, { id: number; data: FormData }>({
    mutationFn: ({ id, data }) => updateAnnouncement(id, data),
    onSuccess: (updatedAnnouncement) => {
      queryClient.invalidateQueries({ queryKey: ['announcement', updatedAnnouncement.pub_id] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: (error) => {
      console.error("Error updating announcement:", error);
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string; announcement: Publicacion }, Error, number>({
    mutationFn: deleteAnnouncement, // This maps to your hard delete service
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['announcement', id] }); 
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: (error) => {
      console.error("Error deleting announcement:", error);
    },
  });
};

export const useSoftDeleteAnnouncement = () => {
 const queryClient = useQueryClient();
  return useMutation<{ message: string; announcement: Publicacion }, Error, number>({
    mutationFn: softDeleteAnnouncement,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['announcement', data.announcement.pub_id] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: (error) => {
      console.error("Error soft-deleting announcement:", error);
    },
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation<Publicacion, Error, FormData>({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: (error) => {
      console.error("Error creating announcement:", error);
    },
  });
};

export const useGetAllAnnouncementCategories = () => {
  return useQuery<CategoriaPublicacion[], Error>({
    queryKey: ['announcementsCat'],
    queryFn: () => getAnnouncementCategories(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetFeaturedAnnouncements = () => {
    return useQuery<Publicacion[], Error>({
        queryKey: ['featuredAnnouncements'],
        queryFn: getFeaturedAnnouncements,
        staleTime: 1000 * 60 * 5, 
    });
};
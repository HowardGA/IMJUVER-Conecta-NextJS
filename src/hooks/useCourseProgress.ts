import { useQuery, useMutation } from '@tanstack/react-query';
import { getCourseProgress, addProgress, getAllCourseProgress, getCurrentProgress,
   getCoursePercentage, getNextContent, getContenidoIdByType, markProgressCompleted } from '@/services/courseProgressServices';
import { NextContentResponse, ContenidoIdLookupResponse } from '@/interfaces/courseProgressInterface';
import { queryClient } from '@/components/providers/QueryProvider';

export const useCourseProgress = (courseId: number) => {
  return useQuery({
    queryKey: ['courseProgress', courseId],
    queryFn: () => getCourseProgress(courseId),
    retry: 1
  });
};

export const useAddProgress = () => {
  return useMutation({
    mutationFn: (contenidoId: number) => addProgress(contenidoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseProgress'] });
      queryClient.invalidateQueries({ queryKey: ['currentProgress'] });
      queryClient.invalidateQueries({ queryKey: ['currentCoursePercentage'] });
    }
  });
};

export const useAllCourseProgress = () => {
  return useQuery({
    queryKey: ['allCourseProgress'],
    queryFn: getAllCourseProgress,
    retry: 1,
    refetchOnWindowFocus: true
  });
};

export const useMarkProgressCompleted = () => {
  return useMutation({
    mutationFn: (contenidoId: number) => markProgressCompleted(contenidoId),
  });
};

export const useCurrentProgress = (courseId: number) => {
  return useQuery({
    queryKey: ['currentProgress', courseId],
    queryFn: () => getCurrentProgress(courseId),
    retry: 1
  });
};

export const useCoursePercentage = (courseId: number) => {
  return useQuery({
    queryKey: ['currentCoursePercentage', courseId],
    queryFn: () => getCoursePercentage(courseId),
    retry: 1,
    refetchOnWindowFocus: true
  });
};

export const useNextContent = (contenidoId: number) => {
  return useQuery<NextContentResponse, Error>({
    queryKey: ['next-content', contenidoId],
    queryFn: () => getNextContent(contenidoId),
    enabled: !!contenidoId, 
  });
};

export const useContenidoIdByType = (tipo: 'Leccion' | 'Cuestionario', id: number) => {
  return useQuery<ContenidoIdLookupResponse, Error>({
    queryKey: ['contenido-id-by-type', tipo, id],
    queryFn: () => getContenidoIdByType(tipo, id),
    enabled: !!tipo && !!id,
  });
};
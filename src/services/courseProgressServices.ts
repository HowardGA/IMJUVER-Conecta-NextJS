import { 
    CourseProgressResponse, 
    AllCourseProgressResponse,
    AddProgressResponse, 
    LastContentProgressResponse,
    coursePercentageProgress,
    NextContentResponse,
    ContenidoIdLookupResponse
} from "@/interfaces/courseProgressInterface";

import apiClient from "@/lib/apiClient";

export const getCourseProgress = async (courseId: number): Promise<CourseProgressResponse> => {
    const response = await apiClient.get(`/progress/course/${courseId}`);
    return response.data;
}

export const getAllCourseProgress = async (): Promise<AllCourseProgressResponse> => {
    const response = await apiClient.get(`/progress/all`);
    return response.data;
}

export const addProgress = async (contenidoId: number): Promise<AddProgressResponse> => {
    const response = await apiClient.post(`/progress/add/${contenidoId}`);
    return response.data;
}

export const getCurrentProgress = async (courseId: number): Promise<LastContentProgressResponse> => {
    const response = await apiClient.get(`/progress/current-course/${courseId}`);
    return response.data;
}

export const getCoursePercentage= async (courseId: number): Promise<coursePercentageProgress> => {
    const response = await apiClient.get(`/progress/course/${courseId}/percentage`);
    return response.data;
}

export const getNextContent = async (contenidoId: number): Promise<NextContentResponse> => {
  const response = await apiClient.get(`/progress/next/${contenidoId}`);
  return response.data;
};

export const getContenidoIdByType = async ( tipo: 'Leccion' | 'Cuestionario', id: number): Promise<ContenidoIdLookupResponse> => {
  const response = await apiClient.get(`/progress/contenido-id`, {
    params: { tipo, id },
  });
  return response.data;
};

export const markProgressCompleted = async (contenidoId: number) => {
  const response = await apiClient.patch(`/progress/completed/${contenidoId}`);
  return response.data;
}



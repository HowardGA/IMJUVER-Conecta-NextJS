export interface CourseProgressResponse {
  courseId: number;
  totalContents: number;
  completedContents: number;
  percentage: number;
}

export interface AllCourseProgressItem {
  courseId: number;
  courseTitle: string;
  totalContents: number;
  completedContents: number;
  percentage: number;
}

export type AllCourseProgressResponse = AllCourseProgressItem[];

export interface AddProgressRequest {
  usu_id: number;
  completado: boolean;
}

export interface AddProgressResponse {
  message: string;
  progressId: number;
}

export interface LastContentProgressResponse {
  contenidoId: number;
  moduloId: number;
  orden: number;
  tipo: string; 
  titulo?: string; 
  lec_id?: number;
  quiz_id?: number;
}

export interface coursePercentageProgress {
  courseId: number;
  totalContents: number,
  completedContents: number,
  percentage: number,
}

export interface NextContentResponse {
  contenidoId: number;
  moduloId: number;
  orden: number;
  tipo: 'leccion' | 'Cuestionario';
  titulo?: string;
  quizId?: number,
  leccionId?: number
  fin?: boolean; 
}

export interface ContenidoIdLookupResponse {
  contenidoId: number;
}



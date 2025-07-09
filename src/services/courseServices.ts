import apiClient from '../lib/apiClient';
import { JSONContent } from '@tiptap/react'; 


export interface Modulos {
    mod_id:number,
    titulo: string,
    descripcion: string,
    orden: number,
    contenido? : ModuloContenido[]
}

export interface ModuloContenido {
    id: number,
    leccion?: Lesson,
    tipo: string,
    orden: number;
    quiz?: Quiz
}

export interface Quiz {
    quiz_id?: number;
    titulo: string;
    descripcion: string;
    preguntas?: Preguntas[];
    mod_id?: number;
}

export interface Preguntas {
    pregunta_id?: number;
    texto_pregunta: string;
    tipo_pregunta: string;
    quiz_id?: number;
    respuestas?: Respuestas[];
}

export interface Respuestas {
    respuesta_id?: number;
    texto_respuesta: string;
    correcta: boolean;
    pregunta_id?: number
}

interface Portada {
    url: string
}

export interface Category {
    cat_cursos_id: number,
    nombre: string,
    descripcion: string,
}

export interface Course { 
    curs_id: number,
    titulo: string,
    descripcion: string,
    cat_cursos_id: number,
    duracion: number,
    nivel: string,
    constancia: boolean,
    publicado: boolean,
    categoria?: Category,
    modulos: Modulos[],
    portada: Portada
}

export interface Lesson { 
    lec_id: number;
    titulo: string;
    tipo?: string,
    contenido?: string
    videos?: Video[],
    archivos?: Archivo[],
}

export interface Video {
    id: number,
    lec_id: number,
    video_id: string
}

export interface Archivo {
    id: number,
    lec_id: number,
    url: string,
    nombre: string,
    tipo: string
}

export interface CreateCourseFormData {
    titulo: string;
    descripcion: string;
    cat_cursos_id: number;
    duracion: number; 
    nivel: string;
    portada: File;
    modulos: ModuleFormData[];
}

export interface ModuleFormData {
    titulo: string;
    descripcion: string;
}

export interface CreateLessonFormData {
    titulo: string;
    contenido: JSONContent | null; 
    mod_id: number;
    youtube_videos: string[];
    archivos: File[]; 
}

export interface QuizQuestionForTaking {
    pregunta_id: number;
    texto_pregunta: string;
    tipo_pregunta: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
    respuestas: {
        respuesta_id: number;
        texto_respuesta: string;
    }[];
}

export interface QuizForTaking {
    quiz_id: number;
    titulo: string;
    descripcion: string;
    preguntas: QuizQuestionForTaking[];
}

export interface UserSelectedAnswer {
    pregunta_id: number;
    selected_respuesta_ids: number[];
}

export interface QuizSubmissionPayload {
    quiz_id: number;
    answers: UserSelectedAnswer[];
}

export const createCourse = (courseData: FormData) => {
    return apiClient.post('/course', courseData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const getAllCourses = async (): Promise<Course[]> => {
    const response = await apiClient.get('/course');
    return response.data;
}

export const getSingleCourse = async (courseID:number): Promise<Course> => {
    const response = await apiClient.get(`/course/${courseID}/full`);
    return response.data;
}

export const getLesson = async (lessonID:number): Promise<Lesson> => {
    const response = await apiClient.get(`/course/lessons/${lessonID}`);
    console.log(response)
    return response.data;
}

export const getCourseCategories = async(): Promise<Category[]> => {
    const response = await apiClient.get(`/courseCategory`);
    return response.data;
}

export const createLesson = (lessonData: FormData) => {
   return apiClient.post('/course/lessons', lessonData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const getModulesByCourse = async(courseID:number): Promise<Modulos[]> => {
    const response = await apiClient.get(`/course/${courseID}/modules`);
    return response.data;
}

export const createQuiz = async (quizData:Quiz) => {
    return apiClient.post('/course/quiz', quizData);
}

export const updateQuiz = async (quizData:Quiz, quizzId: number) => {
    return await apiClient.put(`/course/quiz/${quizzId}`, quizData)
}

export const getQuizById = async (quizId: number): Promise<QuizForTaking> => {
    const response = await apiClient.get(`/course/quiz/${quizId}`);
    return response.data;
};

export const submitQuizAnswers = async (quizId: number, payload: QuizSubmissionPayload) => {
    const response = await apiClient.post(`/course/quiz/${quizId}/submit`, payload);
    return response.data;
};

export const updateLesson = (lessonData: FormData, lessonId:number) => {
    console.log(lessonData)
   return apiClient.put(`/course/lessons/${lessonId}`, lessonData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const deleteLesson = async (lessonId: number) => {
    return apiClient.delete(`/course/lesson/${lessonId}`);
}

export const deleteQuiz = async (quizId: number) => {
    return apiClient.delete(`/course/quiz/${quizId}`);
}
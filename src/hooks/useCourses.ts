'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios'; 
import {
    getAllCourses,
    getSingleCourse,
    getLesson,
    getCourseCategories,
    createCourse,
    createLesson,
    getModulesByCourse,
    createQuiz,
    getQuizById,
    submitQuizAnswers
} from '@/services/courseServices';
import { useRouter } from 'next/navigation';
import {
    CreateCourseFormData,
    CreateLessonFormData,
    Quiz,
    QuizSubmissionPayload,
    QuizForTaking,
    Course,      
    Category,     
    Lesson,       
    Modulos,      
    // Assuming JSONContent is imported from '@tiptap/react' where CreateLessonFormData is defined
    // If not, you might need to define a simple type for it or import it here too.
    // type JSONContent = Record<string, any>; // Fallback if not globally available
} from '@/services/courseServices';


interface CreateCourseSuccessData {
    message: string;
    curso: Course; 
}

interface CreateLessonSuccessData {
    message: string;
    lesson: Lesson;
}

interface CreateQuizSuccessData {
    message?: string; 
    courseId: number; 
    quizId: number; 
}

interface SubmitQuizSuccessData {
    message: string;
    score?: number;
    quizSubmissionId?: number;
}


export const useGetCourses = () => {
    return useQuery<Course[], AxiosError>({
        queryKey: ['courses'],
        queryFn: () => getAllCourses(),
    });
};

export const useGetSingleCourse = (courseID: number) => {
    return useQuery<Course, AxiosError>({ 
        queryKey: ['singleCourse', courseID],
        queryFn: () => getSingleCourse(courseID),
        enabled: !!courseID && !isNaN(courseID),
    });
};

export const useGetLesson = (lessonID: number) => {
    return useQuery<Lesson, AxiosError>({
        queryKey: ['singleCourse', lessonID],
        queryFn: () => getLesson(lessonID),
        enabled: !!lessonID && !isNaN(lessonID),
    });
};

export const useGetCourseCategories = () => {
    return useQuery<Category[], AxiosError>({
        queryKey: ['courseCategories'],
        queryFn: () => getCourseCategories(),
    });
};

export const useCreateCourse = () => {
    const router = useRouter();

    return useMutation<CreateCourseSuccessData, AxiosError, CreateCourseFormData>({
        mutationFn: async (courseData: CreateCourseFormData) => {
            const formData = new FormData();
            formData.append('titulo', courseData.titulo);
            formData.append('descripcion', courseData.descripcion);
            formData.append('cat_cursos_id', courseData.cat_cursos_id.toString());
            formData.append('duracion', courseData.duracion.toString());
            formData.append('nivel', courseData.nivel);
            formData.append('portada', courseData.portada);
            
            formData.append('modulos', JSON.stringify(courseData.modulos));

            const response = await createCourse(formData);
            return response.data;
        },
        onSuccess: (data) => {
            router.push(`/main/courses/${data.curso.curs_id}`);
        },
        onError: (error: AxiosError) => { 
            console.error('Error creating course:', error);
        },
    });
};

export const useCreateLesson = (courseId: number) => {
    const router = useRouter();
    return useMutation<CreateLessonSuccessData, AxiosError, CreateLessonFormData>({
        mutationFn: async (lessonData: CreateLessonFormData) => {
            const formData = new FormData();
            formData.append('titulo', lessonData.titulo);
            formData.append('contenido', JSON.stringify(lessonData.contenido));
            formData.append('mod_id', lessonData.mod_id.toString());
            formData.append('youtube_videos', JSON.stringify(lessonData.youtube_videos));

            if (lessonData.archivos && lessonData.archivos.length > 0) {
                lessonData.archivos.forEach((file) => {
                    formData.append('archivos', file);
                });
            }
            const response = await createLesson(formData);
            return response.data;
        },
        onSuccess: (data) => {
            router.push(`/main/courses/${courseId}/lessons/${data.lesson.lec_id}`);
        },
        onError: (error: AxiosError) => {
             console.error('Error creating lesson:', error);
        }
    });
};

export const useGetModulesByCourse = (courseID: number) => {
    return useQuery<Modulos[], AxiosError>({
        queryKey: ['modulesByCourse', courseID],
        queryFn: () => getModulesByCourse(courseID),
        enabled: !!courseID && !isNaN(courseID),
    });
};

export const useCreateQuiz = () => {
    const router = useRouter();
    return useMutation<CreateQuizSuccessData, AxiosError, Quiz>({
        mutationFn: async (quizData: Quiz) => {
            const response = await createQuiz(quizData);
            return response.data;
        },
        onSuccess: (data) => {
            router.push(`/main/courses/${data.courseId}`);
        },
        onError: (error: AxiosError) => {
            console.error('Error creating quiz:', error);
        }
    })
}

export const useQuizDetails = (quizId: number) => {
    return useQuery<QuizForTaking, AxiosError>({
        queryKey: ['quizDetails', quizId],
        queryFn: () => getQuizById(quizId),
        enabled: !!quizId, 
    });
};

export const useSubmitQuiz = () => {
    return useMutation<SubmitQuizSuccessData, AxiosError, QuizSubmissionPayload>({
        mutationFn: (payload: QuizSubmissionPayload) => submitQuizAnswers(payload.quiz_id, payload),
        onSuccess: (data) => {
            console.log('Quiz submitted successfully!', data);
            // router.push(`/quiz/${data.quizSubmissionId}/results`); 
        },
        onError: (error: AxiosError) => {
            console.error('Error submitting quiz:', error);
        }
    });
};
'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
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
import { CreateCourseFormData, CreateLessonFormData, Quiz, QuizSubmissionPayload, QuizForTaking } from '@/services/courseServices';

export const useGetCourses = () => {
    return useQuery({
        queryKey: ['courses'],
        queryFn: () => getAllCourses(),
    });
};

export const useGetSingleCourse = (courseID:number) => {
    return useQuery({
        queryKey: ['singleCourse',courseID],
        queryFn: () => getSingleCourse(courseID),
        enabled: !!courseID && !isNaN(courseID),
    });
};

export const useGetLesson = (lessonID:number) => {
    return useQuery({
        queryKey: ['singleCourse',lessonID],
        queryFn: () => getLesson(lessonID),
        enabled: !!lessonID && !isNaN(lessonID),
    });
};

export const useGetCourseCategories = () => {
    return useQuery({
        queryKey: ['courseCategories'],
        queryFn: () => getCourseCategories(),
    });
};

export const useCreateCourse = () => {
    const router = useRouter();

    return useMutation<any, Error, CreateCourseFormData>({ 
        mutationFn: async (courseData: CreateCourseFormData) => {
            const formData = new FormData();
            formData.append('titulo', courseData.titulo);
            formData.append('descripcion', courseData.descripcion);
            formData.append('cat_cursos_id', courseData.cat_cursos_id.toString());
            formData.append('duracion', courseData.duracion.toString());
            formData.append('nivel', courseData.nivel);
            formData.append('portada', courseData.portada);
            formData.append('modulos', JSON.stringify(courseData.modulos));

            const response = await createCourse(formData as any); 
            return response.data;
        },
        onSuccess: (data) => {
            router.push(`/main/courses/${data.curso.curs_id}`);
        },
        onError: (error: any) => {
            console.error('Error creating course:', error);
        },
    });
};

export const useCreateLesson = (courseId: number) => {
    const router = useRouter();

    return useMutation<any, Error, CreateLessonFormData>({
        mutationFn: async (lessonData: CreateLessonFormData) => {
        const formData = new FormData();
            formData.append('titulo', lessonData.titulo);
            formData.append('contenido', JSON.stringify(lessonData.contenido)); 
            formData.append('mod_id', lessonData.mod_id.toString());
            formData.append('youtube_videos', JSON.stringify(lessonData.youtube_videos)); 

            if (lessonData.archivos && lessonData.archivos.length > 0) {
                lessonData.archivos.forEach((file) => {
                    console.log('Appending file:', file); // <--- ADD THIS
                    if (!(file instanceof File)) {
                        console.error('Non-File object found in archivos:', file);
                    }
                    formData.append('archivos', file);
                });
            }
            const response = await createLesson(formData);
            return response.data;
        },
        onSuccess: (data) => {
            router.push(`/main/courses/${courseId}/lessons/${data.lesson.lec_id}`); 
        },
    });
};

export const useGetModulesByCourse = (courseID:number) => {
    return useQuery({
        queryKey: ['modulesByCourse',courseID],
        queryFn: () => getModulesByCourse(courseID),
        enabled: !!courseID && !isNaN(courseID),
    });
};

export const useCreateQuiz = () => {
    const router = useRouter();
    return useMutation<any, Error, Quiz>({ 
        mutationFn: async (quizData: Quiz) => {
            const response = await createQuiz(quizData);
            return response.data;
        },
         onSuccess: (data) => {
            router.push(`/main/courses/${data.courseId}`);
        },
    })
}

export const useQuizDetails = (quizId: number) => {
    return useQuery<QuizForTaking, Error>({
        queryKey: ['quizDetails', quizId],
        queryFn: () => getQuizById(quizId),
        enabled: !!quizId, // Only fetch if quizId is available
    });
};

export const useSubmitQuiz = () => {
    // You might want to invalidate the quiz details cache after submission
    // Or navigate to a results page
    return useMutation<any, Error, QuizSubmissionPayload>({ // `any` for response, refine later
        mutationFn: (payload: QuizSubmissionPayload) => submitQuizAnswers(payload.quiz_id, payload),
        onSuccess: (data) => {
            console.log('Quiz submitted successfully!', data);
            // Example: Redirect to a results page, or show a success message
            // router.push(`/quiz/${data.quizId}/results`); // If you have a results page
        },
        onError: (error) => {
            console.error('Error submitting quiz:', error);
            // Show error message to user
        }
    });
};
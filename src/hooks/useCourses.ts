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

    return useMutation<CreateCourseSuccessData, AxiosError, FormData>({
        mutationFn: async (courseData: FormData) => {
           const response = await createCourse(courseData); // createCourse expects FormData
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
    return useMutation<CreateLessonSuccessData, AxiosError, FormData>({
        mutationFn: async (lessonData: FormData) => {
          const response = await createLesson(lessonData);
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
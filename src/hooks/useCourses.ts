'use client';

import { useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
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
    submitQuizAnswers,
    updateLesson,
    updateQuiz,
    deleteLesson,
    deleteQuiz
} from '@/services/courseServices';
import { MessageInstance } from 'antd/es/message/interface';
import { useRouter } from 'next/navigation';
import {
    Quiz,
    QuizSubmissionPayload,
    QuizForTaking,
    Course,      
    Category,     
    Lesson,       
    Modulos,      
} from '@/services/courseServices';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { queryClient } from '@/components/providers/QueryProvider';

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
    totalQuestions?: number;
}

declare module '@tanstack/react-query' {
  interface UseMutationOptions<
    TData = unknown,
    TError = Error,
    TVariables = void,
    TContext = unknown
  > {
    onSuccessCallback?: (data: TData, variables: TVariables, context: TContext) => void;
    onErrorCallback?: (error: TError, variables: TVariables, context: TContext) => void;
    messageApi?: MessageInstance;
  }
}


export const useGetCourses = () => {
    return useQuery<Course[], AxiosError>({
        queryKey: ['courses'],
        queryFn: () => getAllCourses(),
        refetchOnWindowFocus: true,  
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

export const useCreateCourse = (routerInstance: AppRouterInstance) => {
    return useMutation<CreateCourseSuccessData, AxiosError, FormData>({
        mutationFn: async (courseData: FormData) => {
           const response = await createCourse(courseData); 
            return response.data;
        },
        onSuccess: (data) => {
            routerInstance.push(`/courses/${data.curso.curs_id}`);
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
            router.push(`/courses/${courseId}/lessons/${data.lesson.lec_id}`);
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
            router.push(`/courses/${data.courseId}`);
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

export const useUpdateQuiz = (quizIdFromHook: number) => {
    return useMutation({
        mutationFn: async (quizData:Quiz) => {
            const response = await updateQuiz(quizData, quizIdFromHook);
            return response.data;
        },
        onSuccess: () => {
            //invalidate quiz queries
        },
         onError: (error: AxiosError) => {
            console.error('Error creating quiz:', error);
        }
    })
}

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

export const useUpdateLesson = (lessonId: number) => {
    const router = useRouter();
    return useMutation({
        mutationFn: async (lessonData: FormData) => {
            const response = await updateLesson(lessonData, lessonId);
            return response.data;
        },
        onSuccess: () => {
            router.push('/courses')
        },
        onError: (error: AxiosError) => {
            console.error('Error updating lesson:', error);
        }
    });
};

export const useDeleteLesson = (options?: UseMutationOptions<void, Error, number, unknown>) => {
     const router = useRouter();
    return useMutation({ 
        mutationFn: async (lessonId: number) => {
            await deleteLesson(lessonId);
        },
        onSuccess: (data, variables, context) => {
            console.log(`Lesson ${variables} deleted successfully.`);
            queryClient.invalidateQueries({ queryKey: ['lesson', variables] }); 
            options?.messageApi?.success('Lección eliminada con éxito');
            options?.onSuccessCallback?.(data, variables, context);
            router.push(`/courses`);
        },
        onError: (error) => {
            console.error('Error deleting lesson:', error);
            options?.messageApi?.error(`Error al eliminar la lección: ${error.message}`); 
        },
    });
};

export const useDeleteQuiz = (options?: UseMutationOptions<void, Error, number, unknown>) => {
     const router = useRouter();
    return useMutation({ 
        mutationFn: async (quizId: number) => {
            await deleteQuiz(quizId);
        },
        onSuccess: (data, variables, context) => { 
            console.log(`Quiz ${variables} deleted successfully.`);
            queryClient.invalidateQueries({ queryKey: ['quizDetails', variables] });
            options?.messageApi?.success('Cuestionario eliminado con éxito');
            options?.onSuccessCallback?.(data, variables, context);
            router.push(`/courses`);
        },
        onError: (error) => {
            console.error('Error deleting quiz:', error);
            options?.messageApi?.error(`Error al eliminar el cuestionario: ${error.message}`);
        },
    });
};
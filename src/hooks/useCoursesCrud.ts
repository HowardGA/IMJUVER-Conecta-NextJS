import { useMutation } from '@tanstack/react-query';
import {
  deleteLesson,
  deleteQuiz,
  deleteModule,
  deleteCourse,
} from '@/services/courseCrudSerevice';
import { message } from 'antd';
import { useRouter } from "next/navigation";
import { queryClient } from '@/components/providers/QueryProvider';

export const useDeleteLesson = () =>{
  const router = useRouter();

  useMutation({
    mutationKey: ['deleteLesson'],
    mutationFn: deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      message.success('Lección eliminada con éxito');
      router.push('/courses');
    },
    onError: () => message.error('Error al eliminar la lección'),
  });
};

export const useDeleteQuiz = () =>{
  const router = useRouter();

  useMutation({
    mutationKey: ['deleteQuiz'],
    mutationFn: deleteQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      message.success('Cuestionario eliminado con éxito');
      router.push('/courses');
    },
    onError: () => message.error('Error al eliminar el cuestionario'),
  });
};

export const useDeleteModule = () =>{
  const router = useRouter();

  useMutation({
    mutationKey: ['deleteModule'],
    mutationFn: deleteModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      message.success('Módulo eliminado con éxito');
      router.push('/courses');
    },
    onError: () => {
      message.error('Error al eliminar el módulo');
    },
  });
};

export const useDeleteCourse = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ['deleteCourse'],
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      message.success('Curso eliminado con éxito');
      router.push('/courses');
    },
    onError: () => {
      message.error('Error al eliminar el curso');
    },
  });
};

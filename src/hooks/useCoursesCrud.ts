import { useMutation } from '@tanstack/react-query';
import {
  deleteLesson,
  deleteQuiz,
  deleteModule,
  deleteCourse,
} from '@/services/courseCrudSerevice';
import { message } from 'antd';
import { useRouter } from "next/navigation";

export const useDeleteLesson = () =>{
  const router = useRouter();

  useMutation({
    mutationKey: ['deleteLesson'],
    mutationFn: deleteLesson,
    onSuccess: () => {
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
      message.success('Curso eliminado con éxito');
      router.push('/courses');
    },
    onError: () => {
      message.error('Error al eliminar el curso');
    },
  });
};

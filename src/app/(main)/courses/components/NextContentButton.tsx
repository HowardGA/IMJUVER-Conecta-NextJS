'use client';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useNextContent, useAddProgress } from '@/hooks/useCourseProgress';

interface NextContentButtonProps {
  currentContenidoId: number;
  contentId: number//this is the quiz or lec id
}

const NextContentButton: React.FC<NextContentButtonProps> = ({ currentContenidoId, contentId }) => {
  const router = useRouter();
  const { data: nextContent, isLoading, error } = useNextContent(currentContenidoId);
  const {mutate: addProgress} = useAddProgress();

  const handleNext = () => {
    if (!nextContent) {
      console.warn('No hay siguiente contenido disponible.');
      return;
    }

    if (nextContent.fin) {
      router.push('/courses/completed');
      return;
    }

    if (nextContent.tipo === 'leccion') {
      addProgress(currentContenidoId);
      router.push(`/courses/lessons/${contentId-1}`);
    } else if (nextContent.tipo === 'Cuestionario') {
      addProgress(currentContenidoId);
      router.push(`/courses/quizzes/${contentId+2}`);
    } else {
      console.warn(`Tipo de contenido desconocido: ${nextContent.tipo}`);
    }
  };

  return (
    <Button type="primary" loading={isLoading} onClick={handleNext} disabled={!!error}>
      Siguiente
    </Button>
  );
};

export default NextContentButton;

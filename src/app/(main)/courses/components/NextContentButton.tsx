// NextContentButton.tsx
'use client';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useNextContent, useMarkProgressCompleted } from '@/hooks/useCourseProgress';

interface NextContentButtonProps {
  currentContenidoId: number; 
  courseId: number; 
  disabled?: boolean; 
  realCourseID?: number;
}

const NextContentButton: React.FC<NextContentButtonProps> = ({ currentContenidoId, courseId, disabled = false, realCourseID }) => {
  const router = useRouter();
  const { data: nextContentData, isLoading: isNextContentLoading, error: nextContentError } = useNextContent(currentContenidoId);
  const { mutate: markCompletedMutation, isPending: isMarkingCompleted } = useMarkProgressCompleted();

  const handleNext = async () => {
    if (isNextContentLoading || isMarkingCompleted) {
        return;
    }

    try {
      await markCompletedMutation(currentContenidoId);
      console.log(`Content ${currentContenidoId} marked as completed.`);
    } catch (completionError) {
      console.error('Error marking current content as completed:', completionError);
    }
    if (!nextContentData || nextContentError) {
      console.warn('No hay siguiente contenido disponible o hubo un error al cargarlo.');
      router.push(`/courses/${courseId}/finished`);
      return;
    }

    if (nextContentData.fin) {
      console.log(realCourseID)
      router.push(`/courses/${realCourseID}/completed`);
      return;
    }

    let nextRoute = '';
    if (nextContentData.tipo === 'leccion') {
      if (nextContentData.leccionId) {
        nextRoute = `/courses/lessons/${nextContentData.leccionId}`;
      } else {
        console.error('Next content is a lesson but missing lec_id:', nextContentData);
        return;
      }
    } else if (nextContentData.tipo === 'Cuestionario') { 
      if (nextContentData.quizId) {
        nextRoute = `/courses/quizzes/${nextContentData.quizId}`;
      } else {
        console.error('Next content is a quiz but missing quiz_id:', nextContentData);
        return;
      }
    } else {
      console.warn(`Tipo de contenido desconocido para el siguiente: ${nextContentData.tipo}`);
      return;
    }

    if (nextRoute) {
      router.push(nextRoute);
    }
  };

  return (
    <Button
      type="primary"
      loading={isNextContentLoading || isMarkingCompleted}
      onClick={handleNext}
      disabled={disabled || !!nextContentError || isNextContentLoading || isMarkingCompleted}
    >
      Siguiente
    </Button>
  );
};

export default NextContentButton;
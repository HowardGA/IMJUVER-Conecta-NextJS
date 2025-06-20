import { useRouter } from 'next/navigation';
import { useCurrentProgress } from '@/hooks/useCourseProgress'; 
import { Button, Col, Row } from 'antd';
import React from 'react';
import { CourseProgressResponse } from '@/interfaces/courseProgressInterface';
import { AxiosError } from 'axios';

interface CourseStartButtonProps {
    courseId: number;
    progressPercentage?: CourseProgressResponse
}

const CourseStartButton: React.FC<CourseStartButtonProps> = ({ courseId, progressPercentage }) => {
    const router = useRouter();
    const { data: currentProgress, isLoading, error } = useCurrentProgress(courseId);
    const axiosError = error as AxiosError;


const handleStartCourse = () => {
  if (isLoading) {
    console.warn("Still loading progress...");
    return;
  }
  if (error) {
    const status = axiosError.response?.status;
    console.log("Error status:", status);
    if (status === 401) {
      console.warn("Unauthorized — redirecting to login");
      router.push('/login');
      return;
    }
    if (status === 404) {
      console.warn("No progress — starting fresh");
      return;
    }
    console.error("Unexpected error fetching current progress:", error);
    return;
  }
  if (!currentProgress || !currentProgress.tipo || !currentProgress.contenidoId) {
    console.warn("No se pudo determinar el contenido de inicio.", currentProgress);
    return;
  }
  if (currentProgress.tipo === 'leccion') {
    router.push(`/courses/lessons/${currentProgress.lec_id}`);
  } else if (currentProgress.tipo === 'Cuestionario') {
    router.push(`/courses/quizzes/${currentProgress.quiz_id}`);
  } else {
    console.warn("Tipo de contenido no reconocido");
  }
};


  return (
    <Button
      type="primary"
      color="cyan"
      loading={isLoading}
      onClick={handleStartCourse}
    >
      <Row align="middle" gutter={4}>
        <Col>
          {progressPercentage?.percentage && progressPercentage.percentage > 0
            ? 'Continuar Curso'
            : 'Comenzar Curso'}
        </Col>
      </Row>
    </Button>
  );
};

export default CourseStartButton;

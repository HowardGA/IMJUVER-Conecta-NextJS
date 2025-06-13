import React from 'react';
import AddLessonClient from './AddLessonClient';

interface AddLessonPageProps {
  params: {
    courseID: string;
  };
}

export default function AddLessonPage({ params }: AddLessonPageProps) {
  const courseId = parseInt(params.courseID);
  console.log(courseId)

  if (isNaN(courseId)) {
    return <p>ID de curso inválido.</p>;
  }

  return <AddLessonClient courseId={courseId} />;
}
import React from 'react';
import EditLessonClient from './EditLessonClient';

interface EditLessonPageProps {
  params: Promise<{
    lessonID: string; 
  }>;
}

export default async function EditLessonPage({ params }: EditLessonPageProps) {
  const { lessonID } = await params; 
  return (
    <EditLessonClient 
       lessonId={lessonID}
    />
  );
}
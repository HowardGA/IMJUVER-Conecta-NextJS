import React from 'react';
import EditQuizClient from './EditQuizClient';

interface EditLessonPageProps {
  params: Promise<{
    quizzID: string; 
  }>;
}

export default async function EditLessonPage({ params }: EditLessonPageProps) {
  const { quizzID } = await params; 
  return (
    <EditQuizClient 
       quizId={parseInt(quizzID)}
    />
  );
}
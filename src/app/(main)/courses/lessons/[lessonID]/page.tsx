import React from 'react';
import SingleLessonClientContent from './SingleLessonClientContent';

interface SingleLessonPageProps {
  params: {
    lessonID: string; 
  };
}

export default async function SingleLessonPage({ params }: SingleLessonPageProps) {
  const lessonId = parseInt(params.lessonID);
      console.log(lessonId)

  return <SingleLessonClientContent lessonID={lessonId} />;
}
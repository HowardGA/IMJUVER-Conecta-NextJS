import React from 'react';
import SingleLessonClientContent from './SingleLessonClientContent';

interface SingleLessonPageProps {
  params:Promise<{
    lessonID: string; 
  }>;
}

export default async function SingleLessonPage({ params }: SingleLessonPageProps) {
  const {lessonID} = await params;

  return <SingleLessonClientContent lessonID={parseInt(lessonID)} />;
}
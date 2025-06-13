import React from 'react';
import AddLessonClient from './AddQuizClient';

interface AddQuizProps {
   params: Promise<{
    courseID: string;
  }>;
  }

export default async function  AddQuizPage({ params }: AddQuizProps) {
  const { courseID } = await params;
  return <AddLessonClient courseId={parseInt(courseID)} />;
}
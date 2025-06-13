import React from 'react';
import AddLessonClient from './AddLessonClient';

interface AddLessonPageProps {
   params: Promise<{
    courseID: string;
  }>;
  }

export default async function  AddLessonPage({ params }: AddLessonPageProps) {
  const { courseID } = await params;

  return <AddLessonClient courseId={parseInt(courseID)} />;
}
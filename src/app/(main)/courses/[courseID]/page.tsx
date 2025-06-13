import React from 'react';
import SingleCourseClientContent from './SingleCourseClientContent';

interface SingleCoursePageProps {
  params: {
    courseID: string; 
  };
}


export default async function SingleCoursePage({ params }: SingleCoursePageProps) {
  const courseId = parseInt(params.courseID);
  return <SingleCourseClientContent courseId={courseId} />;
}
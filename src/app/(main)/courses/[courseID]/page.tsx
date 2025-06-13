import React from 'react';
import SingleCourseClientContent from './SingleCourseClientContent';

interface SingleCoursePageProps {
  params:Promise<{
    courseID: string; 
  }>;
}


export default async function SingleCoursePage({ params }: SingleCoursePageProps) {
  const {courseID} = await params;
  return <SingleCourseClientContent courseId={parseInt(courseID)} />;
}
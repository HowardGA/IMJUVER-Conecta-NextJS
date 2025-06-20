import apiClient from "@/lib/apiClient";

export const deleteLesson = async (lessonId: number): Promise<void> => {
  await apiClient.delete(`/course-crud/lesson/${lessonId}`);
};

export const deleteQuiz = async (quizId: number): Promise<void> => {
  await apiClient.delete(`/course-crud/quiz/${quizId}`);
};

export const deleteModule = async (moduleId: number): Promise<void> => {
  await apiClient.delete(`/course-crud/module/${moduleId}`);
};

export const deleteCourse = async (courseId: number): Promise<void> => {
  await apiClient.delete(`/course-crud/course/${courseId}`);
};
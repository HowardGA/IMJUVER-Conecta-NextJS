'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Spin, Alert, Form, Result, Typography, message } from 'antd';
import { useQuizDetails, useSubmitQuiz, useDeleteQuiz } from '@/hooks/useCourses'; 
import QuizQuestionTaking from '../../components/QuizQuestionTaking'; 
import { UserSelectedAnswer, QuizSubmissionPayload } from '@/services/courseServices'; 
import NextContentButton from '../../components/NextContentButton';
import { useContenidoIdByType } from '@/hooks/useCourseProgress';
import { useUser } from "@/components/providers/UserProvider";
import QuizzAdminControls from '../../components/QuizzAdminControls';

const { Title, Text } = Typography;

const QuizTakingPage: React.FC = () => {
    const {user} = useUser();
    const router = useRouter();
    const params = useParams();
    const quizIdParam = params.quizID;
    const parsedQuizId = quizIdParam ? parseInt(quizIdParam as string) : 0;
    const { data } = useContenidoIdByType('Cuestionario', parsedQuizId);
    const { data: quiz, isLoading, isError, error } = useQuizDetails(parsedQuizId);
    const [userAnswers, setUserAnswers] = useState<UserSelectedAnswer[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const {mutate: deleteQuiz} = useDeleteQuiz({ messageApi: messageApi});

    const submitQuizMutation = useSubmitQuiz();

    useEffect(() => {
        if (quiz) {
            const initialAnswers: UserSelectedAnswer[] = quiz.preguntas.map(q => ({
                pregunta_id: q.pregunta_id,
                selected_respuesta_ids: [], 
            }));
            setUserAnswers(initialAnswers);
        }
    }, [quiz]); 

    const handleUpdate = () => {
        router.push(`/courses/edit/quiz/${parsedQuizId}`);
    };
    
    const handleDelete = async () => {
        deleteQuiz(parsedQuizId);
    };

    const handleAnswerChange = (pregunta_id: number, selected_respuesta_ids: number[]) => {
        setUserAnswers(prevAnswers => {
            const existingAnswerIndex = prevAnswers.findIndex(ans => ans.pregunta_id === pregunta_id);

            if (existingAnswerIndex > -1) {
                // Update existing answer
                const updatedAnswers = [...prevAnswers];
                updatedAnswers[existingAnswerIndex] = {
                    pregunta_id,
                    selected_respuesta_ids,
                };
                return updatedAnswers;
            } else {
                return [...prevAnswers, { pregunta_id, selected_respuesta_ids }];
            }
        });
    };

    const handleSubmit = async () => {
        if (!quiz) return;
        const allQuestionsAnswered = quiz.preguntas.every(q =>
            userAnswers.some(ua => ua.pregunta_id === q.pregunta_id && ua.selected_respuesta_ids.length > 0)
        );

        if (!allQuestionsAnswered) {
            alert('Por favor, responde todas las preguntas antes de enviar.');
            return;
        }

        const payload: QuizSubmissionPayload = {
            quiz_id: quiz.quiz_id,
            answers: userAnswers,
        };

        try {
            await submitQuizMutation.mutateAsync(payload);
        } catch (submitError) {
            console.error("Submission failed:", submitError);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Spin size="large"/>
            </div>
        );
    }

    if (isError) {
        return (
            <Result
                status="error"
                title="Error al cargar el cuestionario"
                subTitle={error?.message || 'Hubo un problema al intentar obtener el cuestionario.'}
                extra={<Button type="primary" onClick={() => router.back()}>Volver</Button>}
            />
        );
    }

    if (!quiz) {
        return (
            <Result
                status="404"
                title="Cuestionario no encontrado"
                subTitle="El cuestionario que buscas no existe o no está disponible."
                extra={<Button type="primary" onClick={() => router.push('/main/courses')}>Ir a Cursos</Button>}
            />
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {contextHolder}
             {user?.rol_id === 1 &&
                <QuizzAdminControls 
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                // isLoading={isProcessing}
            />}
            <Title level={2}>{quiz.titulo}</Title>
             {data?.contenidoId && (
                <NextContentButton currentContenidoId={data.contenidoId} contentId={parsedQuizId} />
            )}
            <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>{quiz.descripcion}</Text>

            <Form layout="vertical">
                {quiz.preguntas.map((question, index) => (
                    <QuizQuestionTaking
                        key={question.pregunta_id}
                        question={question}
                        questionIndex={index}
                        onAnswerChange={handleAnswerChange}
                        // Find the current selected answers for this specific question
                        currentSelectedAnswerIds={
                            userAnswers.find(ans => ans.pregunta_id === question.pregunta_id)?.selected_respuesta_ids || []
                        }
                    />
                ))}

                <Form.Item style={{ marginTop: '30px' }}>
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleSubmit}
                        loading={submitQuizMutation.isPending}
                        disabled={submitQuizMutation.isPending || !userAnswers.length}
                    >
                        Enviar Cuestionario
                    </Button>
                </Form.Item>

                {submitQuizMutation.isSuccess && (
                    <Alert
                        message="Cuestionario enviado exitosamente!"
                        description={`Tu puntuación: ${submitQuizMutation.data.score}/${submitQuizMutation.data.totalQuestions}`}
                        type="success"
                        showIcon
                        closable
                        style={{ marginTop: '20px' }}
                    />
                )}
                {submitQuizMutation.isError && (
                    <Alert
                        message="Error al enviar el cuestionario"
                        description={submitQuizMutation.error?.message || 'Hubo un problema al enviar tus respuestas.'}
                        type="error"
                        showIcon
                        closable
                        style={{ marginTop: '20px' }}
                    />
                )}
            </Form>
        </div>
    );
};

export default QuizTakingPage;
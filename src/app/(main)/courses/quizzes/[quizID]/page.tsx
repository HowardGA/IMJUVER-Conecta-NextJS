'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Spin, Alert, Form, Result, Typography, Flex } from 'antd';
import { useQuizDetails, useSubmitQuiz, useDeleteQuiz } from '@/hooks/useCourses'; 
import QuizQuestionTaking from '../../components/QuizQuestionTaking'; 
import { UserSelectedAnswer, QuizSubmissionPayload } from '@/services/courseServices'; 
import NextContentButton from '../../components/NextContentButton';
import { useContenidoIdByType, useAddProgress } from '@/hooks/useCourseProgress';
import { useUser } from "@/components/providers/UserProvider";
import QuizzAdminControls from '../../components/QuizzAdminControls';
import { useMessage } from '@/components/providers/MessageProvider';

const { Title, Text } = Typography;

const QuizTakingPage: React.FC = () => {
    const {user} = useUser();
    const router = useRouter();
    const params = useParams();
    const quizIdParam = params.quizID;
    const parsedQuizId = quizIdParam ? parseInt(quizIdParam as string) : 0;
    const { data: contenidoModuloData, isLoading: isContenidoLoading } = useContenidoIdByType('Cuestionario', parsedQuizId); 
    const { mutate: addProgressMutation } = useAddProgress();
    const { data: quiz, isLoading, isError, error } = useQuizDetails(parsedQuizId);
    const [userAnswers, setUserAnswers] = useState<UserSelectedAnswer[]>([]);
    const {mutate: deleteQuiz} = useDeleteQuiz();
    const [quizPassed, setQuizPassed] = useState<boolean>(false);
    const PASSING_THRESHOLD = 0.80; // 80%
    const messageApi = useMessage();

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

     useEffect(() => {
        if (!isContenidoLoading && contenidoModuloData?.contenidoId) {
            addProgressMutation(contenidoModuloData.contenidoId);
        }
    }, [contenidoModuloData?.contenidoId, isContenidoLoading, addProgressMutation]);

     useEffect(() => {
        if (submitQuizMutation.isSuccess && submitQuizMutation.data) {
            const { score, totalQuestions } = submitQuizMutation.data;
            if (
                typeof score === 'number' &&
                typeof totalQuestions === 'number' &&
                totalQuestions > 0 &&
                (score / totalQuestions) >= PASSING_THRESHOLD
            ) {
                setQuizPassed(true);
                messageApi.success('¡Cuestionario aprobado! Puedes continuar.');
            } else {
                setQuizPassed(false);
                messageApi.warning(`Necesitas al menos un ${PASSING_THRESHOLD * 100}% para aprobar. Inténtalo de nuevo.`);
            }
        }
    }, [submitQuizMutation.isSuccess, submitQuizMutation.data, messageApi]);

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
    const isNextButtonDisabled = !quizPassed;
    return (
        <div style={{
                    maxWidth: '900px', 
                    margin: '20px auto', 
                    padding: '16px', 
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    backgroundColor: '#fff',
                    boxSizing: 'border-box', 
                    width: 'calc(100% - 32px)', 
                }}>             
                 <Flex
                justify="space-between"
                align="center"
                wrap="wrap" 
                gap={16} 
                style={{ marginBottom: '24px' }}
            >
                {user?.rol_id === 1 && (
                    <QuizzAdminControls
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                )}
                {contenidoModuloData?.contenidoId && (
                    <NextContentButton
                        currentContenidoId={contenidoModuloData.contenidoId}
                        courseId={parsedQuizId} 
                        disabled={isNextButtonDisabled}
                        realCourseID={quiz.curso_id} 
                    />
                )}
            </Flex>
            <Title level={2} style={{ marginBottom: '8px', fontSize: '1.8em' }}>{quiz.titulo}</Title>
            <Text type="secondary" style={{ marginBottom: '24px', display: 'block', fontSize: '1em' }}>{quiz.descripcion}</Text>

            <Form layout="vertical">
                {quiz.preguntas.map((question, index) => (
                    <QuizQuestionTaking
                        key={question.pregunta_id}
                        question={question}
                        questionIndex={index}
                        onAnswerChange={handleAnswerChange}
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
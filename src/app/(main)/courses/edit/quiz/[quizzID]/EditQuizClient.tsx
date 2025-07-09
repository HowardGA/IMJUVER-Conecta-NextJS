'use client';

import React, { useEffect } from 'react';
import {
    Form, Typography, Button, Divider,
    Input, App , notification
} from 'antd';
import { SaveOutlined, PlusOutlined } from '@ant-design/icons';
import { Quiz } from '@/services/courseServices'; 
import QuestionItem from '../../../components/QuestionItem';
import { useQuizDetails, useUpdateQuiz } from '@/hooks/useCourses'; 
import { useRouter } from 'next/navigation'; 

interface EditQuizClientProps {
    quizId: number; 
}

const { Title, Text } = Typography;

const EditQuizClient: React.FC<EditQuizClientProps> = ({ quizId }) => {
    const [form] = Form.useForm<Quiz>();
    const router = useRouter();
    const [messageApi, contextHolder] = notification.useNotification();
    const { data: quizData, isLoading: isQuizLoading, isError: isQuizError, error: quizError } = useQuizDetails(quizId);
    const { mutate: updateQuizMutation, isPending: isUpdatingQuiz, isSuccess: quizUpdateSuccess, isError: quizUpdateError, error: quizUpdateErrorMessage } = useUpdateQuiz(quizId);

    useEffect(() => {
        if (quizData) {
            console.log(quizData)
            form.setFieldsValue({
                titulo: quizData.titulo,
                descripcion: quizData.descripcion,
                preguntas: quizData.preguntas?.map(q => ({
                    ...q,
                    respuestas: q.respuestas?.map(a => ({ ...a })) || []
                })) || []
            });
            console.log("Quiz data loaded and form set:", quizData);
        }
    }, [quizData, form]);

    useEffect(() => {
        if (isUpdatingQuiz) {
            messageApi.info({
                key: 'updatingQuiz',
                message: 'Actualizando cuestionario...',
                description: 'Por favor, espere mientras se guardan los cambios.',
                duration: 0,
            });
        } else if (quizUpdateSuccess) {
            messageApi.success({
                key: 'updatingQuiz',
                message: 'Cuestionario actualizado con éxito',
                description: 'Los cambios han sido guardados exitosamente.',
                duration: 5,
            });
          
        } else if (quizUpdateError) {
            const errorMsg = quizUpdateErrorMessage?.message || 'Error desconocido al actualizar el cuestionario.';
            messageApi.error({
                key: 'updatingQuiz',
                message: 'Error al actualizar cuestionario',
                description: errorMsg,
                duration: 5,
            });
        }
    }, [isUpdatingQuiz, quizUpdateSuccess, quizUpdateError, quizUpdateErrorMessage, messageApi, router]);

    const reorderQuestions = (currentIndex: number, newIndex: number) => {
        const currentQuestions = form.getFieldValue('preguntas');
        if (!currentQuestions) return;

        const updatedQuestions = [...currentQuestions];
        const [movedItem] = updatedQuestions.splice(currentIndex, 1);
        updatedQuestions.splice(newIndex, 0, movedItem);

        form.setFieldsValue({ preguntas: updatedQuestions });
    };

    const onFinish = async (values: Quiz) => {
        try {
            console.log("Submitting quiz update data:", values);
            updateQuizMutation(values); 
        } catch (error) {
            console.error("Synchronous error during form submission:", error);
        }
    };

    if (isQuizLoading) {
        return (
            <App>
                <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <Title level={2}>Cargando Cuestionario...</Title>
                </div>
            </App>
        );
    }

    if (isQuizError || !quizData) {
        console.error("Error loading quiz or modules:", quizError );
        return (
            <App>
                <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <Title level={2} type="danger">Error al cargar el cuestionario</Title>
                    <Text>{quizError?.message || 'No se pudo encontrar el cuestionario o los módulos.'}</Text>
                </div>
            </App>
        );
    }

    return (
        <App>
            {contextHolder}
            <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <Title level={2} style={{ marginBottom: '30px', textAlign: 'center' }}>Editar Cuestionario</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    <Divider orientation="left">Información general</Divider>
                    <Form.Item
                        name="titulo"
                        label="Ingresa el título del cuestionario"
                        rules={[{ required: true, message: 'Se debe de ingresar un título' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="descripcion"
                        label="Ingresa una descripción breve"
                        rules={[{ required: true, message: 'Se debe de ingresar una descripción' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Divider orientation="left">Preguntas y respuestas</Divider>
                    <Form.List name="preguntas">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name }, index) => (
                                    <QuestionItem
                                        key={key}
                                        name={name}
                                        index={index}
                                        remove={remove}
                                        reorderQuestions={reorderQuestions}
                                        fieldsLength={fields.length}
                                        form={form} // Pass form instance
                                    />
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add({
                                        texto_pregunta: '',
                                        tipo_pregunta: 'SINGLE_CHOICE', 
                                        respuestas: [{ texto_respuesta: '', correcta: false }]
                                    })} block icon={<PlusOutlined />}>
                                        Agregar Pregunta
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.Item style={{ marginTop: '30px', textAlign: 'center' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            icon={<SaveOutlined />}
                            loading={isUpdatingQuiz}
                        >
                            Actualizar Cuestionario
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </App>
    );
}

export default EditQuizClient;
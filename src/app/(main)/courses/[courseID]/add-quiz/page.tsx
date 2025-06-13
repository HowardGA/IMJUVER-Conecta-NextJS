'use client'
import React, {useState, useEffect} from 'react';
import {
    Form, notification, Typography, Button, Select, Divider,
    Input
} from 'antd';
import { SaveOutlined, PlusOutlined } from '@ant-design/icons';
import { Quiz } from '@/services/courseServices';
import QuestionItem from '../../components/QuestionItem';
import { useGetModulesByCourse, useCreateQuiz } from '@/hooks/useCourses';

interface AddQuizClientProps {
     params: {
        courseID: string; 
    };
}

const {Title, Text} = Typography;
const { Option } = Select;

const AddQuizClient: React.FC<AddQuizClientProps>= ({params}) => {
    const [form] = Form.useForm<Quiz>();
    const [api, contextHolder] = notification.useNotification();
    const courseId = parseInt(params.courseID);
    const { data: modules, isLoading: modulesLoading, isError: modulesError } = useGetModulesByCourse(courseId);
    const createQuizMutation = useCreateQuiz();
    const reorderQuestions = (currentIndex: number, newIndex: number) => {
        const currentQuestions = form.getFieldValue('preguntas');
        if (!currentQuestions) return;

        const updateQuestions = [...currentQuestions];
        const [movedItem] = updateQuestions.splice(currentIndex, 1);
        updateQuestions.splice(newIndex, 0, movedItem);

        form.setFieldsValue({ preguntas: updateQuestions});
    };

    const onFinish = async (values:Quiz) => {
        try{
            const quizData = {...values, courseId: courseId}
            console.log(quizData)
            await createQuizMutation.mutate(quizData); 
        }catch(error){
            console.error(error)
        }
    }

    return(
        <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
            <Title level={2} style={{ marginBottom: '30px', textAlign: 'center' }}>Nuevo Cuestionario</Title>
             <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ 
                   preguntas: [{ 
                        texto_pregunta: '', 
                        tipo_pregunta:'',
                        respuestas: [{texto_respuesta: '', correcta: false}] 
                    }] 
                }}
                scrollToFirstError
            >
            {contextHolder}
            <Divider orientation="left">Seleccion de módulo</Divider>
             <Form.Item
                        name="mod_id"
                        label="Selecciona el módulo al que le asignaras el cuestionario"
                        rules={[{ required: true, message: 'Por favor, seleccione un módulo' }]}
                    >
                        <Select placeholder="Selecciona un módulo">
                            {modules?.map(module => (
                                <Option key={module.mod_id} value={module.mod_id}>
                                    {module.titulo} (Orden: {module.orden})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                <Divider orientation="left">Información general</Divider>
                    <Form.Item
                        name="titulo"
                        label="Ingresa el título del cuestionario"
                        rules={[{ required: true, message: 'Se debe de ingresar un título' }]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="descripcion"
                        label="Ingresa una descripción breve"
                        rules={[{ required: true, message: 'Se debe de ingresar una descripción' }]}
                    >
                        <Input/>
                    </Form.Item>
                <Divider orientation="left">Preguntas y respuestas</Divider>
                <Form.List name="preguntas">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }, index) => (
                                <QuestionItem
                                    key={key} 
                                    name={name} 
                                    index={index}
                                    remove={remove}
                                    reorderQuestions={reorderQuestions}
                                    fieldsLength={fields.length}
                                    form={form} 
                                />
                            ))}
                            <Form.Item>
                                <Button variant="solid" color='orange' onClick={() => add()} block icon={<PlusOutlined />}>
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
                    >
                        Crear cuestionario
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default AddQuizClient;
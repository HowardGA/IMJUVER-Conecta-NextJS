'use client'
import React, { useEffect } from 'react'; 
import {
    Form, notification, Typography, Button, Select, Divider,
    Input
} from 'antd';
import { SaveOutlined, PlusOutlined } from '@ant-design/icons';
import { Quiz } from '@/services/courseServices'; 
import QuestionItem from '../../components/QuestionItem';
import { useGetModulesByCourse, useCreateQuiz } from '@/hooks/useCourses';

interface AddQuizClientProps {
        courseId: number;
}

const { Title } = Typography;
const { Option } = Select;

const AddQuizClient: React.FC<AddQuizClientProps> = ({ courseId }) => {
    const [form] = Form.useForm<Quiz>();
    const [messageApi, contextHolder] = notification.useNotification(); 

    const { data: modules, isLoading: modulesLoading, isError: modulesError } = useGetModulesByCourse(courseId);
    const { mutate: createQuizMutation, isPending: isCreatingQuiz, isSuccess: quizCreationSuccess, isError: quizCreationError, error: quizCreationErrorMessage } = useCreateQuiz();

    useEffect(() => {
        if (modulesLoading) {
            messageApi.info({
                key: 'modulesLoading', 
                message: 'Cargando módulos...',
                description: 'Estamos obteniendo la lista de módulos para este curso.',
                duration: 0,
            });
        } else if (modulesError) {
            messageApi.error({
                key: 'modulesLoading', 
                message: 'Error al cargar módulos',
                description: 'No se pudieron cargar los módulos. Intente recargar la página.',
                duration: 5, 
            });
        } else {
            messageApi.destroy('modulesLoading');
        }
    }, [modulesLoading, modulesError, messageApi]);

    useEffect(() => {
        if (isCreatingQuiz) {
            messageApi.info({
                key: 'creatingQuiz',
                message: 'Creando cuestionario...',
                description: 'Por favor, espere mientras se guarda el cuestionario.',
                duration: 0,
            });
        } else if (quizCreationSuccess) {
            messageApi.success({
                key: 'creatingQuiz',
                message: 'Cuestionario creado con éxito',
                description: 'El cuestionario ha sido guardado exitosamente.',
                duration: 5,
            });
            form.resetFields(); 
        } else if (quizCreationError) {
            const errorMsg = 'Error desconocido al crear el cuestionario.';
            messageApi.error({
                key: 'creatingQuiz',
                message: 'Error al crear cuestionario',
                description: errorMsg,
                duration: 5,
            });
        }
    }, [isCreatingQuiz, quizCreationSuccess, quizCreationError, quizCreationErrorMessage, messageApi, form]);


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
            const quizData = { ...values, courseId: courseId };
            console.log(quizData); 
            createQuizMutation(quizData);
        } catch (error) {
            console.error("Synchronous error during form submission:", error);
        }
    };

    return (
    <div style={{
        padding: '20px', 
        maxWidth: '900px', 
        margin: '20px auto', 
        backgroundColor: '#fff', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        boxSizing: 'border-box', 
        width: 'calc(100% - 40px)', 
    }}>
        {contextHolder}
        <Title level={2} style={{ marginBottom: '20px', textAlign: 'center', fontSize: '1.8em' }}>
            Nuevo Cuestionario
        </Title>
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
                preguntas: [{
                    texto_pregunta: '',
                    tipo_pregunta: '',
                    respuestas: [{ texto_respuesta: '', correcta: false }]
                }]
            }}
            scrollToFirstError
        >
            <Divider orientation="left" style={{ margin: '30px 0' }}>Selección de módulo</Divider>
            <Form.Item
                name="mod_id"
                label="Selecciona el módulo al que le asignarás el cuestionario"
                rules={[{ required: true, message: 'Por favor, seleccione un módulo' }]}
            >
                <Select
                    placeholder="Selecciona un módulo"
                    loading={modulesLoading}
                    disabled={modulesLoading || modulesError}
                    showSearch 
                    optionFilterProp="children" 
                >
                    {modules?.map(module => (
                        <Option key={module.mod_id} value={module.mod_id}>
                            {module.titulo} (Orden: {module.orden})
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Divider orientation="left" style={{ margin: '30px 0' }}>Información general</Divider>
            <Form.Item
                name="titulo"
                label="Ingresa el título del cuestionario"
                rules={[{ required: true, message: 'Se debe de ingresar un título' }]}
            >
                <Input placeholder="Título del cuestionario" /> 
            </Form.Item>
            <Form.Item
                name="descripcion"
                label="Ingresa una descripción breve"
                rules={[{ required: true, message: 'Se debe de ingresar una descripción' }]}
            >
                <Input.TextArea rows={3} placeholder="Descripción breve del cuestionario" /> 
            </Form.Item>
            <Divider orientation="left" style={{ margin: '30px 0' }}>Preguntas y respuestas</Divider>
            <Form.List name="preguntas">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }, index) => ( 
                            <QuestionItem
                                key={key}
                                name={name}
                                index={index}
                                remove={() => remove(name)} 
                                reorderQuestions={reorderQuestions}
                                fieldsLength={fields.length}
                                form={form}
                                {...restField} 
                            />
                        ))}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add({
                                    texto_pregunta: '',
                                    tipo_pregunta: 'SINGLE_CHOICE', 
                                    respuestas: [{ texto_respuesta: '', correcta: false }]
                                })}
                                block 
                                icon={<PlusOutlined />}
                                style={{ height: '48px', marginTop: '20px' }} 
                            >
                                Agregar Pregunta
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Form.Item style={{ marginTop: '40px', textAlign: 'center' }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    icon={<SaveOutlined />}
                    loading={isCreatingQuiz}
                    block 
                >
                    Crear cuestionario
                </Button>
            </Form.Item>
        </Form>
    </div>
);
}

export default AddQuizClient;
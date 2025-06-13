'use client';

import React, { useEffect } from 'react';
import {
    Form, Input, Button, Select, Upload,
    InputNumber, Space, Typography, notification,
    Spin, Divider, Row, Col, App,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined, UploadOutlined, SaveOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/es/upload/interface';
import { useGetCourseCategories, useCreateCourse } from '@/hooks/useCourses';
import { CreateCourseFormData, ModuleFormData } from '@/services/courseServices';


const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;


const CreateCourseClient: React.FC = () => {
    const [form] = Form.useForm<CreateCourseFormData>();
    const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useGetCourseCategories();

    const createCourseMutation = useCreateCourse();
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (createCourseMutation.isPending) {
            api.info({ key: 'creatingCourse', message: 'Creando curso...', description: 'Por favor, espere mientras se guarda el curso.', duration: 0 });
        } else if (createCourseMutation.isSuccess) {
            api.success({ key: 'creatingCourse', message: 'Curso creado con éxito', description: 'El curso ha sido guardado exitosamente.', duration: 5 });
            form.resetFields();
        } else if (createCourseMutation.isError) {
            // Safely access error message from AxiosError
            const errorMsg =  'Error desconocido al crear el curso.'; 
            api.error({ key: 'creatingCourse', message: 'Error al crear curso', description: errorMsg, duration: 5 });
        }
    }, [createCourseMutation.isPending, createCourseMutation.isSuccess, createCourseMutation.isError, createCourseMutation.error, api, form]);


    const onFinish = async (values: CreateCourseFormData) => {
        const uploadedFiles = values.portada as unknown as UploadFile[];
        const actualFile: File | undefined = uploadedFiles[0]?.originFileObj;

        if (!actualFile) {
            api.error({
                message: 'Error de Validación',
                description: 'Por favor, suba una imagen de portada válida para el curso.',
            });
            return;
        }

        if (!values.modulos || values.modulos.length === 0) {
            api.error({
                message: 'Error de Validación',
                description: 'Debe agregar al menos un módulo al curso.',
            });
            return;
        }
        const formData = new FormData();
        formData.append('titulo', values.titulo); // Use values directly
        formData.append('descripcion', values.descripcion);
        formData.append('cat_cursos_id', values.cat_cursos_id.toString());
        formData.append('duracion', values.duracion.toString());
        formData.append('nivel', values.nivel);
        formData.append('portada', actualFile); // Use actualFile directly

        values.modulos.forEach((module, index) => { // Use values.modulos directly
            // For complex objects like `modulos`, it's often better to stringify the whole array
            // or send individual properties based on what your backend expects from FormData.
            // If your backend expects `modulos` as a JSON string, then append it once:
            // formData.append('modulos', JSON.stringify(values.modulos));
            // If it expects individual fields like below, ensure it handles arrays correctly.
            formData.append(`modulos[${index}].titulo`, module.titulo);
            formData.append(`modulos[${index}].descripcion`, module.descripcion);
        });

        // --- FIX: Removed 'as any' since createCourseMutation expects FormData ---
        createCourseMutation.mutate(formData);
    };

    const normFile = (e: { fileList?: UploadFile[] } | UploadFile[]): UploadFile[] => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList || [];
    };

    const reorderModules = (currentIndex: number, newIndex: number) => {
        const currentModules: ModuleFormData[] | undefined = form.getFieldValue('modulos');
        if (!currentModules) return;

        const updatedModules = [...currentModules];
        const [movedItem] = updatedModules.splice(currentIndex, 1);
        updatedModules.splice(newIndex, 0, movedItem);

        form.setFieldsValue({ modulos: updatedModules });
    };


    if (categoriesLoading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /><Text>Cargando categorías...</Text></div>;
    }

    if (categoriesError) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Text type="danger">Error al cargar categorías.</Text></div>;
    }


    return (
        <App>
            {contextHolder}
            <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
                <Title level={2} style={{ marginBottom: '30px', textAlign: 'center' }}>Crear Nuevo Curso</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ modulos: [{ titulo: '', descripcion: '' }] }}
                    scrollToFirstError
                >
                    <Divider orientation="left">Información Básica del Curso</Divider>
                    <Form.Item
                        name="titulo"
                        label="Título del Curso"
                        rules={[{ required: true, message: 'Por favor, ingrese el título del curso' }]}
                    >
                        <Input placeholder="Ej: Introducción a la Programación" />
                    </Form.Item>

                    <Form.Item
                        name="descripcion"
                        label="Descripción del Curso"
                        rules={[{ required: true, message: 'Por favor, ingrese la descripción del curso' }]}
                    >
                        <TextArea rows={4} placeholder="Describa brevemente el contenido del curso..." />
                    </Form.Item>

                    <Form.Item
                        name="cat_cursos_id"
                        label="Categoría"
                        rules={[{ required: true, message: 'Por favor, seleccione una categoría' }]}
                    >
                        <Select placeholder="Selecciona una categoría">
                            {categories?.map(category => (
                                <Option key={category.cat_cursos_id} value={category.cat_cursos_id}>
                                    {category.nombre}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="duracion"
                        label="Duración (en horas)"
                        rules={[{ required: true, message: 'Por favor, ingrese la duración del curso' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} placeholder="Ej: 40" />
                    </Form.Item>

                    <Form.Item
                        name="nivel"
                        label="Nivel"
                        rules={[{ required: true, message: 'Por favor, seleccione el nivel del curso' }]}
                    >
                        <Select placeholder="Selecciona el nivel">
                            <Option value="Básico">Básico</Option>
                            <Option value="Intermedio">Intermedio</Option>
                            <Option value="Avanzado">Avanzado</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="portada"
                        label="Imagen de Portada"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[{ required: true, message: 'Por favor, suba una imagen de portada' }]}
                    >
                        <Upload
                            name="portada"
                            listType="picture"
                            maxCount={1}
                            beforeUpload={() => false}
                            accept="image/*"
                        >
                            <Button variant="solid" color='lime' icon={<UploadOutlined />}>Seleccionar Archivo</Button>
                        </Upload>
                    </Form.Item>

                    <Divider orientation="left">Módulos del Curso</Divider>
                    <Form.List name="modulos">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <Space key={key} direction="vertical" style={{ width: '100%', border: '2px dashed var(--ant-color-info )', padding: '16px', marginBottom: '16px', borderRadius: '4px', position: 'relative',  }}>
                                        <Row gutter={16} align="middle" style={{ width: '100%' }}>
                                            <Col span={20}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'titulo']}
                                                    label={`Título del Módulo ${index + 1}`}
                                                    rules={[{ required: true, message: 'Título del módulo requerido' }]}
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    <Input placeholder="Ej: Introducción a JavaScript" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                                {fields.length > 1 && (
                                                    <>
                                                        <Button
                                                            type="text"
                                                            icon={<UpOutlined />}
                                                            onClick={() => reorderModules(index, index - 1)}
                                                            disabled={index === 0}
                                                            title="Mover arriba"
                                                        />
                                                        <Button
                                                            type="text"
                                                            icon={<DownOutlined />}
                                                            onClick={() => reorderModules(index, index + 1)}
                                                            disabled={index === fields.length - 1}
                                                            title="Mover abajo"
                                                        />
                                                        <MinusCircleOutlined
                                                            onClick={() => remove(name)}
                                                            style={{ fontSize: '20px', color: '#ff4d4f', cursor: 'pointer' }}
                                                            title="Eliminar módulo"
                                                        />
                                                    </>
                                                )}
                                            </Col>
                                        </Row>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'descripcion']}
                                            label="Descripción del Módulo"
                                            rules={[{ required: true, message: 'Descripción del módulo requerida' }]}
                                            style={{ width: '100%' }}
                                        >
                                            <TextArea rows={2} placeholder="Describa el contenido de este módulo..." />
                                        </Form.Item>
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button variant="solid" color='orange' onClick={() => add()} block icon={<PlusOutlined />}>
                                        Agregar Módulo
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
                            loading={createCourseMutation.isPending}
                        >
                            {createCourseMutation.isPending ? 'Creando Curso...' : 'Crear Curso'}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </App>
    );
};

export default CreateCourseClient;
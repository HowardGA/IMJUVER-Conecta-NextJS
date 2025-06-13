'use client'
import React, {useEffect} from "react";
import Hero from "@/components/ui/Hero";
import SingleCourseImg from '../../../../../public/single-course.png';
import { useGetSingleCourse } from "@/hooks/useCourses";
import { Spin, Alert, Typography, Row, Col, Space, Collapse, Tag, List, Button } from 'antd';
import { BookOutlined, ClockCircleOutlined, TrophyOutlined, GoldOutlined,PlusOutlined } from '@ant-design/icons';
import Image from 'next/image'; 
import Link from 'next/link';
import { ModuloContenido,Modulos } from "@/services/courseServices";
import { useUser } from "@/components/providers/UserProvider";
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

interface SingleCourseClientContentProps {
    courseId: number; 
}


const SingleCourseClientContent: React.FC<SingleCourseClientContentProps> = ({courseId}) => {
    const {data: course, isLoading, isError, error} = useGetSingleCourse(courseId);
    const {user} = useUser();

    console.log(user)

    useEffect(() => {
        if (isError) {
            console.error(`Error fetching course ${courseId}:`, error);
        }
    }, [isError, error, courseId]);

     if (isLoading) {
        return (
            <>
                <Hero
                    title="Descubre el potencial que hay en ti"
                    subTitle="Avanza con nosotros y transforma tu futuro"
                    imageSrc={SingleCourseImg}
                />
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                    <Title level={4} style={{ marginTop: '20px' }}>Cargando detalles del curso...</Title>
                </div>
            </>
        );
    }

    if (isError) {
        return (
            <>
                <Hero
                    title="Descubre el potencial que hay en ti"
                    subTitle="Avanza con nosotros y transforma tu futuro"
                    imageSrc={SingleCourseImg}
                />
                <div style={{ padding: '50px', maxWidth: '900px', margin: '0 auto' }}>
                    <Alert
                        message="Error al cargar el curso"
                        description={`No se pudo cargar el curso con ID ${courseId}. ${error?.message || 'Por favor, inténtelo de nuevo.'}`}
                        type="error"
                        showIcon
                    />
                </div>
            </>
        );
    }

    if (!course) {
        return (
            <>
                <Hero
                    title="Descubre el potencial que hay en ti"
                    subTitle="Avanza con nosotros y transforma tu futuro"
                    imageSrc={SingleCourseImg}
                />
                <div style={{ padding: '50px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <Alert
                        message="Curso no encontrado"
                        description={`El curso con ID ${courseId} no existe o no se pudo cargar.`}
                        type="warning"
                        showIcon
                    />
                </div>
            </>
        );
    }
    console.log(course)
    return (
        <>
            <Hero
                title="Descubre el potencial que hay en ti"
                subTitle="Avanza con nosotros y transforma tu futuro"
                imageSrc={SingleCourseImg}
            />

            <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
                {course.portada?.url && (
                    <div style={{ position: 'relative', width: '100%', height: '380px', borderRadius: '8px', overflow: 'hidden', marginBottom: '30px' }}>
                        <Image
                            src={course.portada.url}
                            alt={course.titulo}
                            fill 
                            style={{ objectFit: 'cover' }} 
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
                            priority 
                        />
                    </div>
                )}

                <Title level={2} style={{ marginBottom: '15px' }}>{course.titulo}</Title>

                <Row gutter={[24, 16]} justify="space-around" style={{ marginBottom: '30px' }}>
                    <Col>
                        <Space direction="vertical" align="center" size={0}>
                            <ClockCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                            <Text strong>Duración</Text>
                            <Text type="secondary">{course.duracion} horas</Text>
                        </Space>
                    </Col>
                    <Col>
                        <Space direction="vertical" align="center" size={0}>
                            <BookOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                            <Text strong>Módulos</Text>
                            <Text type="secondary">{course.modulos?.length || 0}</Text>
                        </Space>
                    </Col>
                    <Col>
                        <Space direction="vertical" align="center" size={0}>
                            <GoldOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                            <Text strong>Nivel</Text>
                            <Text type="secondary">{course.nivel}</Text>
                        </Space>
                    </Col>
                    <Col>
                        <Space direction="vertical" align="center" size={0}>
                            <TrophyOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                            <Text strong>Certificado</Text>
                            <Text type="secondary">{course.constancia ? 'Sí' : 'No'}</Text>
                        </Space>
                    </Col>
                </Row>

                {course.categoria?.nombre && (
                    <div style={{ marginBottom: '20px' }}>
                        <Tag color="blue" style={{ fontSize: '14px', padding: '5px 10px' }}>
                            {course.categoria.nombre}
                        </Tag>
                    </div>
                )}
                 {(user?.rol_id === 1 )&&
                 <>
                        <Link
                        href={`/main/courses/${courseId}/add-lesson`}
                        passHref
                        style={{ textDecoration: 'none', color: 'inherit' }} 
                    >
                        <Button variant="solid" color='volcano'>
                            <Row align="middle" gutter={4}>
                                <PlusOutlined/>
                                <Col>Crear Lecciones</Col>
                            </Row>
                        </Button>
                    </Link>

                    <Link
                        href={`/main/courses/${courseId}/add-quiz`}
                        passHref
                        style={{ textDecoration: 'none', color: 'inherit' }} 
                    >
                        <Button variant="solid" color='lime' style={{marginLeft: '1rem'}}>
                            <Row align="middle" gutter={4}>
                                <PlusOutlined/>
                                <Col>Crear Cuestionario</Col>
                            </Row>
                        </Button>
                    </Link>
                </>
                }


                <Title level={3} style={{ marginTop: '20px', marginBottom: '10px' }}>Descripción del Curso</Title>
                <Paragraph>{course.descripcion}</Paragraph>

                <Title level={3} style={{ marginTop: '40px', marginBottom: '20px' }}>Contenido del Curso</Title>
                {course.modulos && course.modulos.length > 0 ? (
                    <Collapse accordion expandIconPosition="end">
                        {course.modulos
                            .sort((a, b) => a.orden - b.orden) 
                            .map((modulo: Modulos) => (
                                <Panel
                                    header={`${modulo.orden}. ${modulo.titulo}`}
                                    key={modulo.mod_id}
                                    extra={<Text type="secondary">{modulo.contenido?.length || 0} Contenido</Text>}
                                >
                                    <Paragraph style={{ marginBottom: '15px' }}>{modulo.descripcion}</Paragraph>
                                    {modulo.contenido && modulo.contenido.length > 0 ? (
                                        <List
                                            size="small"
                                            bordered
                                            dataSource={modulo.contenido.sort((a, b) => a.orden - b.orden)}
                                            renderItem={(item: ModuloContenido) => (
                                                <List.Item>
                                                    {item.tipo === 'Leccion' && item.leccion ? ( 
                                                    <Link
                                                        href={`/main/courses/lessons/${item.leccion.lec_id}`}
                                                        passHref
                                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                                    >
                                                        <Text>{item.orden}. {item.leccion.titulo} (Lección)</Text>
                                                    </Link>
                                                    ) : item.tipo === 'Cuestionario' && item.quiz ? ( 
                                                    <Link
                                                        href={`/main/courses/quizzes/${item.quiz.quiz_id}`}
                                                        passHref
                                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                                    >
                                                        <Text>{item.orden}. {item.quiz.titulo} (Cuestionario)</Text>
                                                    </Link>
                                                    ) : (
                                                    <Text type="secondary">Contenido desconocido o no disponible.</Text>
                                                    )}
                                                </List.Item>
                                            )}
                                        />
                                    ) : (
                                        <Text type="secondary">No hay contenido en este módulo.</Text>
                                    )}
                                </Panel>
                            ))}
                    </Collapse>
                ) : (
                    <Paragraph>No hay módulos disponibles para este curso.</Paragraph>
                )}
            </div>
        </>
    );
}

export default SingleCourseClientContent;
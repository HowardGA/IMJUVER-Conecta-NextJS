'use client'
import React, {useEffect} from "react";
import Hero from "@/components/ui/Hero";
import SingleCourseImg from '../../../../../public/single-course.png';
import { useGetSingleCourse } from "@/hooks/useCourses";
import { Spin, Alert, Typography, Row, Col, Space, Collapse, Tag, List, Button, Popconfirm, Flex, } from 'antd';
import { BookOutlined, ClockCircleOutlined, GoldOutlined,PlusOutlined } from '@ant-design/icons';
import Image from 'next/image'; 
import Link from 'next/link';
import { ModuloContenido,Modulos } from "@/services/courseServices";
import { useUser } from "@/components/providers/UserProvider";
import { useCoursePercentage } from "@/hooks/useCourseProgress";
import CourseStartButton from "../components/CourseStartButton";
import { useDeleteCourse } from "@/hooks/useCoursesCrud";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

interface SingleCourseClientContentProps {
    courseId: number; 
}


const SingleCourseClientContent: React.FC<SingleCourseClientContentProps> = ({courseId}) => {
    const {data: course, isLoading, isError, error} = useGetSingleCourse(courseId);
    const {data: coursePercentage, isLoading: isCoursePercentageLoafing} = useCoursePercentage(courseId);
    const { mutate: deleteCourse, isPending:isDeletingPending } = useDeleteCourse();
    const {user} = useUser();
    console.log(user)

    useEffect(() => {
        if (isError) {
            console.error(`Error fetching course ${courseId}:`, error);
        }
    }, [isError, error, courseId]);

     if (isLoading && isCoursePercentageLoafing) {
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
  <div style={{
            padding: '20px',
            maxWidth: '900px',
            margin: '20px auto', 
            backgroundColor: '#fff', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            boxSizing: 'border-box', 
            width: 'calc(100% - 40px)', 
        }}>                    <Alert
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
  <div style={{
            padding: '20px',
            maxWidth: '900px',
            margin: '20px auto', 
            backgroundColor: '#fff', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            boxSizing: 'border-box', 
            width: 'calc(100% - 40px)', 
        }}>                    <Alert
                        message="Curso no encontrado"
                        description={`El curso con ID ${courseId} no existe o no se pudo cargar.`}
                        type="warning"
                        showIcon
                    />
                </div>
            </>
        );
    }
   return (
       <div style={{ backgroundImage: `url('/background/imjuver-pattern.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed', }}>
        {/* Hero component is assumed to be responsive internally */}
        <Hero
            title="Descubre el potencial que hay en ti"
            subTitle="Avanza con nosotros y transforma tu futuro"
            imageSrc={SingleCourseImg}
        />

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
            {course.portada?.url && (
                <div style={{
                    position: 'relative',
                    width: '100%',
               
                    paddingBottom: '56.25%', 
                    height: 0, 
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '30px',
                }}>
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

            <Title level={2} style={{ marginBottom: '15px', fontSize: '2em' }}>{course.titulo}</Title> 

            <Row
                gutter={[16, 16]} 
                justify="center" 
                style={{ marginBottom: '30px' }}
            >
                <Col xs={12} sm={6} md={6}> 
                    <Space direction="vertical" align="center" size={0} style={{ width: '100%' }}>
                        <ClockCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                        <Text strong>Duración</Text>
                        <Text type="secondary">{course.duracion} horas</Text>
                    </Space>
                </Col>
                <Col xs={12} sm={6} md={6}>
                    <Space direction="vertical" align="center" size={0} style={{ width: '100%' }}>
                        <BookOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                        <Text strong>Módulos</Text>
                        <Text type="secondary">{course.modulos?.length || 0}</Text>
                    </Space>
                </Col>
                <Col xs={12} sm={6} md={6}>
                    <Space direction="vertical" align="center" size={0} style={{ width: '100%' }}>
                        <GoldOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                        <Text strong>Nivel</Text>
                        <Text type="secondary">{course.nivel}</Text>
                    </Space>
                </Col>
            </Row>

            {course.categoria?.nombre && (
                <div style={{ marginBottom: '20px', textAlign: 'center', display:'flex', flexDirection:"row" }}> 
                    <Tag color="blue" style={{ fontSize: '14px', padding: '5px 10px' }}>
                        {course.categoria.nombre}
                    </Tag>
                </div>
            )}

            {(user?.rol_id === 1) &&
                <Flex
                    wrap="wrap" 
                    gap={16} 
                    justify="flex-start" 
                    style={{ marginBottom: '20px' }} 
                >
                    <Link
                        href={`/courses/${courseId}/add-lesson`}
                        passHref
                    >
                        <Button type="primary" variant="solid" color="magenta" > 
                            <Row align="middle" gutter={4}>
                                <PlusOutlined />
                                <Col>Crear Lecciones</Col>
                            </Row>
                        </Button>
                    </Link>

                    <Link
                        href={`/courses/${courseId}/add-quiz`}
                        passHref
                    >
                        <Button type="primary" variant="solid" color="orange"> 
                            <Row align="middle" gutter={4}>
                                <PlusOutlined />
                                <Col>Crear Cuestionario</Col>
                            </Row>
                        </Button>
                    </Link>

                    <Popconfirm
                        title="¿Estás seguro de que quieres eliminar este curso?"
                        onConfirm={() => deleteCourse(courseId)}
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button danger loading={isDeletingPending}>
                            Eliminar Curso
                        </Button>
                    </Popconfirm>
                </Flex>
            }

            {/* Course Start Button - Make it block on small screens */}
            <div style={{ marginBottom: '30px' }}>
                <CourseStartButton courseId={course.curs_id} progressPercentage={coursePercentage}/> 
            </div>


            <Title level={3} style={{ marginTop: '20px', marginBottom: '10px', fontSize: '1.5em' }}>Descripción del Curso</Title> {/* Adjusted font size */}
            <Paragraph>{course.descripcion}</Paragraph>

            <Title level={3} style={{ marginTop: '40px', marginBottom: '20px', fontSize: '1.5em' }}>Contenido del Curso</Title> {/* Adjusted font size */}
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
                                                {item.tipo === 'leccion' && item.leccion ? (
                                                    <Link
                                                        href={`/courses/lessons/${item.leccion.lec_id}`}
                                                        passHref
                                                        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }} // Ensure link takes full width
                                                    >
                                                        <Text style={{ wordBreak: 'break-word' }}>{item.leccion.titulo} (Lección)</Text> {/* Word break for long titles */}
                                                    </Link>
                                                ) : item.tipo === 'Cuestionario' && item.quiz ? (
                                                    <Link
                                                        href={`/courses/quizzes/${item.quiz.quiz_id}`}
                                                        passHref
                                                        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }} // Ensure link takes full width
                                                    >
                                                        <Text style={{ wordBreak: 'break-word' }}>{item.quiz.titulo} (Cuestionario)</Text> {/* Word break for long titles */}
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
    </div>
);
}

export default SingleCourseClientContent;
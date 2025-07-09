'use client';

import React from 'react';
import { Carousel, Card, Typography, Image, Space, Col, Row, Alert } from 'antd';
import { Publicacion } from '@/interfaces/announcementInterface';
import { motion, Variants, Transition } from 'framer-motion';
import dayjs from 'dayjs'; 

const { Title, Paragraph, Text } = Typography;

interface FeaturedAnnouncementsCarouselProps {
    announcements: Publicacion[];
    isLoading: boolean;
    error: Error | null;
}

const carouselItemVariants: Variants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        } as Transition
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.5,
            ease: "easeIn" 
        } as Transition
    },
};
const FeaturedAnnouncementsCarousel: React.FC<FeaturedAnnouncementsCarouselProps> = ({ announcements, isLoading, error }) => {
    if (isLoading) {
        return <p style={{ textAlign: 'center', padding: '20px' }}>Cargando anuncios destacados...</p>;
    }

    if (error) {
        return <Alert message="Error al cargar anuncios destacados" description={error.message} type="error" showIcon />;
    }

    if (!announcements || announcements.length === 0) {
        return null; // Don't render carousel if no featured announcements
    }

    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: true,
    };

    return (
        <div style={{ marginBottom: '40px' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Anuncios Destacados</Title>
            <Carousel {...carouselSettings}>
                {announcements.map((announcement) => (
                    <motion.div
                        key={announcement.pub_id}
                        variants={carouselItemVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit" 
                        style={{ padding: '0 20px' }} 
                    >
                        <Card
                            hoverable
                            style={{ width: '100%', maxWidth: '800px', margin: 'auto', display: 'flex', flexDirection: 'column' }}
                            bodyStyle={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                        >
                            <Row gutter={[16, 16]} align="middle">
                                <Col xs={24} md={10}>
                                    {announcement.imagen_url && (
                                        <Image
                                            src={announcement.imagen_url}
                                            alt={announcement.titulo}
                                            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
                                            preview={false} // Disable image preview on click
                                        />
                                    )}
                                </Col>
                                <Col xs={24} md={14}>
                                    <Title level={3} ellipsis={{ rows: 2 }}>{announcement.titulo}</Title>
                                    <Paragraph type="secondary">
                                        Categoría: {announcement.categoria?.nombre || 'General'}
                                    </Paragraph>
                                    {announcement.fecha_evento && (
                                        <Paragraph strong>
                                            Fecha del evento: {dayjs(announcement.fecha_evento).format('DD/MM/YYYY HH:mm')}
                                        </Paragraph>
                                    )}
                                    <Paragraph ellipsis={{ rows: 3 }}>
                                        {/* Assuming 'contenido' is a JSON object with a text field or similar.
                                            If it's a rich text editor output, you might need dangerouslySetInnerHTML or a parser. */}
                                        {typeof announcement.contenido === 'object' && announcement.contenido !== null && 'text' in announcement.contenido ? (announcement.contenido as { text: string }).text : ''}
                                    </Paragraph>
                                    <Space size="small">
                                        <Text type="secondary">Publicado por: {announcement.autor?.nombre}</Text>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                    </motion.div>
                ))}
            </Carousel>
        </div>
    );
};

export default FeaturedAnnouncementsCarousel;
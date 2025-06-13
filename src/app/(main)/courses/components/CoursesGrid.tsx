'use client';
import React, { useState } from 'react';
import { Row, Col, Pagination, Empty } from 'antd';
import CoursesCard from './CoursesCard';
import { Course } from '@/services/courseServices';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface CoursesGridProps {
    courses: Course[];
    pageSize?: number;
}

const CoursesGrid: React.FC<CoursesGridProps> = ({ courses, pageSize = 8 }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentCourses = courses.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
            },
        },
    };
    if (!courses || courses.length === 0) {
        return (
            <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                <Empty
                    description="No hay cursos disponibles en este momento."
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <motion.div
                key={currentPage} 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <Row gutter={[24, 24]} justify="center">
                    {currentCourses.map((course) => (
                        <Col
                            key={course.curs_id}
                            xs={24}
                            sm={12}
                            md={8}
                            lg={6}
                        >
                            <motion.div variants={itemVariants}>
                                <Link href={`/courses/${course.curs_id}`} passHref style={{ textDecoration: 'none' }}>
                                <CoursesCard
                                    courseID={course.curs_id}
                                    title={course.titulo}
                                    lessonQty={course.modulos ? course.modulos.length : 0}
                                    time={course.duracion}
                                    imageUrl={course.portada.url}
                                    level={course.nivel}
                                    category={course.categoria?.nombre}
                                />
                                </Link>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </motion.div>
            {courses.length > pageSize && (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={courses.length}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        showQuickJumper={false}
                    />
                </div>
            )}
        </div>
    );
};

export default CoursesGrid;
'use client'
import { Card, Col, Row, Space, Typography,Badge } from "antd";
import { BookOutlined, ClockCircleOutlined } from '@ant-design/icons';
import React from 'react';
import Image from "next/image";

interface CoursesCardProps {
    title: string,
    lessonQty: number,
    time: number,
    courseID: number,
    imageUrl: string,
    level: string,
    category?: string
}

const {Text} = Typography

const CoursesCard: React.FC<CoursesCardProps> = ({title, lessonQty, time, imageUrl, level, category}) => {
 return(
    <Badge.Ribbon text={level} color="volcano">
        <Card
            hoverable
            style={{ width: '100%', maxWidth: 272 }}
            cover={
                <div style={{
                    height: '180px',
                    position: 'relative',
                    overflow: 'hidden', 
                }}>
                    <Image
                        alt="course card image"
                        src={imageUrl}
                        fill 
                        style={{
                            objectFit: 'cover',
                        }}
                        sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, 272px"
                        priority 
                    />
                </div>
            }
        >
            <div style={{ minHeight: '48px', marginBottom: '8px' }}>
                <Text
                    style={{
                        fontSize:'1.1rem',
                        fontWeight: 'bold',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word' 
                    }}
                >
                    {title}
                </Text>
            </div>
            <Card.Meta description={category}/>

            <Row
                justify="space-between"
                align="middle"
                gutter={[8, 8]} 
                style={{ marginTop: '16px' }}
            >
                <Col xs={24} sm={12}>
                    <Space size="small">
                        <BookOutlined style={{ color: 'var(--ant-color-text-secondary)', fontSize: '16px' }} />
                        <Text type="secondary">{lessonQty} Módulos</Text>
                    </Space>
                </Col>
                <Col xs={24} sm={12}>
                    <Space size="small">
                        <ClockCircleOutlined style={{ color: 'var(--ant-color-text-secondary)', fontSize: '16px' }} />
                        <Text type="secondary">{time} h</Text>
                    </Space>
                </Col>
            </Row>
        </Card>
    </Badge.Ribbon>
);
}

export default CoursesCard;
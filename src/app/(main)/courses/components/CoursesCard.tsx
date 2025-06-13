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
                style={{ width: 272 }}
                cover={
                    <Image
                        alt="course card image"
                        src={imageUrl}
                        style={{
                            height: '180px',  
                            objectFit: 'cover',
                            width: '100%',
                        }}
                    />
                }
            >
                <div style={{ minHeight: '48px', marginBottom: '8px' }}>
                    <Text style={{fontSize:'1.1rem', fontWeight: 'bold', whiteSpace: 'normal'}}>{title}</Text>
                </div>
                <Card.Meta description={category}/>

                <Row
                    justify="space-between"
                    align="middle"
                    style={{ marginTop: '16px' }}
                >

                    <Col>
                        <Space size="small">
                            <BookOutlined style={{ color: 'var(--ant-color-text-secondary)', fontSize: '16px' }} />
                            <Text type="secondary">{lessonQty} Modulos</Text>
                        </Space>
                    </Col>
                    <Col>
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
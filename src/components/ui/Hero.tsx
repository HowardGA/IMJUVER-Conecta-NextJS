'use client';

import { Typography, Col, Row, Space } from "antd";
import Image,{ StaticImageData } from 'next/image';
import '@/styles/Hero.css';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const { Title } = Typography;

interface HeroProps {
  title: string,
  subTitle?: string,
  imageSrc: StaticImageData,
  children?: React.ReactNode
}

const Hero: React.FC<HeroProps> = ({title, subTitle, imageSrc, children}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 10 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 100, damping: 10, delay: 0.6 } },
  };

  return (
    <Row
      style={{
        background: 'var(--ant-color-primary)',
        alignItems: 'center', 
        maxHeight: 'auto', 
        overflow: 'hidden',
        position: 'relative',
        minHeight: '20rem', 
      }}
      ref={ref}
    >
      <Col
        xs={24} 
        sm={24} 
        md={12} 
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2rem 1rem',
          textAlign: 'center', 
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants}>
            <Title
              level={1}
              style={{
                color: "var(--ant-color-bg-layout)",
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                lineHeight: 1.2,
              }}
            >
              {title}
            </Title>
          </motion.div>
          {subTitle && ( 
            <motion.div variants={itemVariants}>
              <Typography.Text
                style={{
                  color: "var(--ant-color-bg-layout)",
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', 
                  display: 'block', 
                  marginBottom: '1rem', 
                }}
              >
                {subTitle}
              </Typography.Text>
            </motion.div>
          )}
          <motion.div variants={itemVariants}>
            <Space
              size="middle" 
              wrap 
              style={{ marginTop: '1rem', justifyContent: 'center', width: '100%' }}
            >
              {children}
            </Space>
          </motion.div>
        </motion.div>
      </Col>

      {/* Image Column */}
      <Col
        xs={24} 
        sm={24} 
        md={12} 
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: '1rem', 
        }}
      >
       <motion.div
          variants={imageVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{
            position: 'relative', 
            width: '100%',
            maxWidth: '580px',
            margin: '0 auto',
            aspectRatio: '17/11', 
            height: 'auto', 
          }}
        >
          <Image
            src={imageSrc}
            alt="Hero image"
            fill 
            style={{
              objectFit: 'cover', 
              objectPosition: 'center',
            }}
            priority
          />
        </motion.div>
      </Col>
    </Row>
  );
}

export default Hero;
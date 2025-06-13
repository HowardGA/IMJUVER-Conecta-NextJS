'use client';

import { Typography, Col, Row, Button, Space } from "antd";
import StudenImg from '../../../public/hero-student.png';
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
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10 } }, 
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50 }, 
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 10, delay: 0.6 } }, 
  };
  return (
    <Row style={{ background: 'var(--ant-color-primary)', alignItems: 'stretch', maxHeight: '30rem', overflow: 'hidden', position: 'relative' }} ref={ref}>

      <Col span={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '4rem' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants}>
            <Title style={{ color: "var(--ant-color-bg-layout)" }}>
              {title}
            </Title>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Typography.Text style={{ color: "var(--ant-color-bg-layout)", fontSize: '1.2rem' }}>
              {subTitle}
            </Typography.Text>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Space size="large" style={{marginTop:'1rem'}}>
              {children}
            </Space>
          </motion.div>
        </motion.div>
      </Col>
      <Col span={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Image
            src={imageSrc}
            alt="Studen hero image"
            height={400}
            width={580}
            style={{ display: 'block',  objectFit: 'cover',width: '100%', }}
          />
        </motion.div>
      </Col>
    </Row>
  );
}

export default Hero;

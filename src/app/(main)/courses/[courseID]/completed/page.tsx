'use client';

import React, { useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button, Typography, Spin, Alert, Card } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useUser } from '@/components/providers/UserProvider';
import { useGetSingleCourse } from '@/hooks/useCourses';
import { useCoursePercentage } from '@/hooks/useCourseProgress';
import Image from 'next/image';

const { Title, Text, Paragraph } = Typography;
const COMPLETION_THRESHOLD = 100; 

const CertificatePage: React.FC = () => {
  const params = useParams();
  const courseId = params.courseID; 
  const parsedCourseId = courseId ? parseInt(courseId as string) : null;
  const { user } = useUser();
  const { data: course, isLoading: isCourseLoading, isError: isCourseError, error: courseError } = useGetSingleCourse(parsedCourseId as number);
  const { data: courseProgress, isLoading: isProgressLoading, isError: isProgressError, error: progressError } = useCoursePercentage(parsedCourseId as number);

  const certificateRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const userName = `${user?.nombre || ''} ${user?.apellido || ''}`.trim() || 'Participante';
  const courseTitle = course?.titulo || 'Curso Completado';
  const isCourseCompleted = courseProgress?.percentage === COMPLETION_THRESHOLD;

  const handleDownload = async (format: 'png' | 'pdf') => {
    if (!certificateRef.current) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
      });

      if (format === 'png') {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `Certificado-${userName}-${courseTitle}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape', 'px', [canvas.width, canvas.height]);
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`Certificado-${userName}-${courseTitle}.pdf`);
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Hubo un error al generar el certificado. Por favor, inténtelo de nuevo.');
    } finally {
      setDownloading(false);
    }
  };

  // --- Loading States ---
  if (isCourseLoading || isProgressLoading) {
    return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}> 
        <Spin size="large" />
        <Title level={4} style={{ marginTop: '20px' }}>Cargando datos del certificado...</Title>
      </div>
    );
  }

  // --- Error States ---
  if (!user) {
    return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}> 
        <Alert
          message="Usuario no autenticado"
          description="Necesitas iniciar sesión para ver tu certificado."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  if (isCourseError || !course) {
    return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}> 
        <Alert
          message="Error al cargar los detalles del curso"
          description={courseError?.message || 'No se pudo obtener la información del curso para el certificado.'}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (isProgressError || !courseProgress) {
    return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}> 
        <Alert
          message="Error al verificar el progreso del curso"
          description={progressError?.message || 'No se pudo verificar si el curso está completado.'}
          type="error"
          showIcon
        />
      </div>
    );
  }

  // --- Course Not Completed State ---
  if (!isCourseCompleted) {
    return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}> 
        <Alert
          message="Curso aún no completado"
          description={`Necesitas completar el ${COMPLETION_THRESHOLD}% del curso para obtener el certificado. Tu progreso actual es ${courseProgress.percentage.toFixed(0)}%.`}
          type="info"
          showIcon
        />
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

 return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}> 
      <Title level={2} style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2em' }}>Tu Certificado</Title>

      <Card style={{ marginBottom: '30px', overflowX: 'auto' }}> {/* Allow horizontal scroll for certificate if too wide */}
        <div ref={certificateRef} style={{
            fontFamily: '"Times New Roman", Times, serif',
            border: '10px solid #961d48',
            padding: '5%', 
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 0 20px rgba(0,0,0,0.1)',
            position: 'relative',
            width: '100%', 
            paddingBottom: '66.66%', 
            height: 0, 
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center', 
            boxSizing: 'border-box', 
        }}>
           <div style={{ position: 'relative', width: '25%', maxWidth: '205px', height: '100px', marginBottom: '2vw' }}>
              <Image
                  src="/logo.png"
                  alt="Company Logo"
                  fill
                  sizes="25vw"
                  style={{
                      objectFit: 'contain',
                  }}
              />
          </div>
          <div style={{
              marginBottom: '4vw', 
              marginTop: '2vw',
              fontSize: 'min(18px, 2.5vw)',
          }}>
            <Text strong style={{ color: '#666' }}>CERTIFICADO DE FINALIZACIÓN</Text>
          </div>

          <Paragraph style={{
              fontSize: 'min(20px, 2.8vw)', 
              color: '#333',
              lineHeight: '1.5',
              marginBottom: '1.5vw', 
          }}>
            Se otorga este certificado a
          </Paragraph>

          <Title level={1} style={{
              fontFamily: '" ब्रश स्क्रिप्ट एमटी", "Brush Script MT", cursive',
              fontSize: 'min(60px, 8vw)', 
              color: '#961d48',
              margin: '2vw 0', 
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              wordBreak: 'break-word', 
          }}>
            {userName.toUpperCase()}
          </Title>

          <Paragraph style={{
              fontSize: 'min(20px, 2.8vw)',
              color: '#333',
              lineHeight: '1.5',
              marginBottom: '1.5vw', 
          }}>
            por haber completado exitosamente el curso
          </Paragraph>

          <Title level={2} style={{
              fontSize: 'min(32px, 4.5vw)', 
              color: '#E0B987',
              fontStyle: 'italic',
              marginBottom: '3vw', 
              wordBreak: 'break-word',
          }}>
            &quot;{courseTitle}&quot;
          </Title>

          <Paragraph style={{
              fontSize: 'min(20px, 2.8vw)', 
              color: '#333',
              lineHeight: '1.5',
              marginBottom: '2vw',
          }}>
            con dedicación y excelencia.
          </Paragraph>

          <div style={{
              display: 'flex',
              flexDirection: window.innerWidth < 768 ? 'column' : 'row',
              justifyContent: 'space-around',
              alignItems: window.innerWidth < 768 ? 'center' : 'flex-end', 
              width: '100%',
              marginTop: '4vw',
              gap: '3vw',
          }}>
            <Paragraph style={{ margin: '0', fontSize: 'min(16px, 2.2vw)', color: '#555' }}>
              Fecha de Emisión: {currentDate}
            </Paragraph>
            <div style={{
                textAlign: 'center',
                marginTop: window.innerWidth < 768 ? '2vw' : '0',
            }}>
               
             <div style={{ 
                  position: 'relative', 
                  width: '50%', 
                  maxWidth: '200px', 
                  height: '100px',
                  marginBottom: '1vw',
                  }}>
                  <Image
                      src="/firma.png"
                      alt="Signature"
                      fill
                      sizes="50vw"
                      style={{
                          objectFit: 'contain',
                      }}
                  />
              </div>
              <div style={{
                  borderBottom: '1px solid #777',
                  width: 'min(250px, 70%)', 
                  margin: '0 auto min(10px, 1.5vw) auto', 
              }}></div>
              <Text type="secondary" style={{ fontSize: 'min(14px, 2vw)' }}>Director del IMJUVER</Text>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => handleDownload('pdf')}
          loading={downloading}
          size="large"
          style={{ marginRight: '10px', marginBottom: window.innerWidth < 576 ? '10px' : '0' }} // Add bottom margin on small screens
        >
          Descargar PDF
        </Button>
        <Button
          icon={<DownloadOutlined />}
          onClick={() => handleDownload('png')}
          loading={downloading}
          size="large"
        >
          Descargar PNG
        </Button>
      </div>
    </div>
  );
};

export default CertificatePage;


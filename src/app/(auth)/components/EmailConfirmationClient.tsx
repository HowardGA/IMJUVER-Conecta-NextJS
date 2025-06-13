'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Card, Typography, Spin, Button, Result, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'; 
import { message } from 'antd'; 
import Link from 'next/link';

import { useEmailVerification } from '@/hooks/useAuthentication';
import { resendVerificationEmail } from '@/services/authServices';

const { Text } = Typography;

interface EmailConfirmationClientProps {
  token: string; 
}

const EmailConfirmationClient: React.FC<EmailConfirmationClientProps> = ({ token }) => {
  const router = useRouter();

  const { isLoading, isSuccess, isError, isExpired, message: verificationMessage } = useEmailVerification(token);

  const [countdown, setCountdown] = useState<number>(5);
  const [userEmailForResend, setUserEmailForResend] = useState<string | null>(null);

  useEffect(() => {
    if (isSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            router.push('/login');
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSuccess, router]);

  const handleResendEmail = async () => {
    let emailToResend = userEmailForResend;

    if (!emailToResend) {
      const emailInput = prompt('Por favor, ingrese su correo electrónico para reenviar el enlace de verificación:');
      if (!emailInput) {
        message.warning('Correo electrónico no proporcionado.');
        return;
      }
      emailToResend = emailInput;
      setUserEmailForResend(emailInput);
    }

    if (!emailToResend || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToResend)) {
        message.error('Por favor, ingrese un correo electrónico válido.');
        return;
    }

    try {
      message.loading({ content: 'Enviando nuevo enlace...', key: 'resend' });
      const response = await resendVerificationEmail(emailToResend);
      if (response.status === 'success') {
        message.success({ content: response.message, key: 'resend', duration: 5 });
      } else {
        message.error({ content: response.message, key: 'resend', duration: 5 });
      }
    } catch (error) {
      console.error('Resend failed:', error);
      message.error({ content: 'Error al reenviar el enlace.', key: 'resend', duration: 5 });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Space direction="vertical" align="center">
          <Spin size="large" />
          <Text>{verificationMessage}</Text>
        </Space>
      );
    }

    if (isSuccess) {
      return (
        <Result
          status="success"
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title="¡Verificación Exitosa!"
          subTitle={`${verificationMessage} Será redirigido a la página de inicio de sesión en ${countdown} segundos.`}
          extra={
            <Link href="/login">
              <Button type="primary">Ir a Iniciar Sesión</Button>
            </Link>
          }
        />
      );
    }

    if (isExpired) {
      return (
        <Result
          status="warning"
          icon={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
          title="Enlace Expirado"
          subTitle={verificationMessage}
          extra={
            <Button type="primary" onClick={handleResendEmail}>
              Reenviar Enlace
            </Button>
          }
        />
      );
    }

    if (isError) {
      return (
        <Result
          status="error"
          icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
          title="Error de Verificación"
          subTitle={verificationMessage}
          extra={
            <Space direction="vertical" align="center">
              <Button type="primary" onClick={handleResendEmail}>
                Reenviar Enlace
              </Button>
              <Link href="/login">
                <Button>Ir a Iniciar Sesión</Button>
              </Link>
            </Space>
          }
        />
      );
    }

    return null;
  };

  return (
    <Layout
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url('/background/login.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Card
        variant='borderless'
        style={{
          width: '35rem',
          padding: '2rem',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        {renderContent()}
      </Card>
    </Layout>
  );
};

export default EmailConfirmationClient;
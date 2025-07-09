'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Card, Typography, Spin, Button, Result, Space, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEmailVerification } from '@/hooks/useAuthentication'; 
import { resendVerificationEmail } from '@/services/authServices';

const { Text } = Typography;

interface EmailConfirmationClientProps {
  token: string;
}

const EmailConfirmationClient: React.FC<EmailConfirmationClientProps> = ({ token }) => {
  const router = useRouter();
  const [api, contextHolder] = message.useMessage();
  console.log('EmailConfirmationClient: Component mounted with token:', token);

  const { isLoading, isSuccess, isError, isExpired, message: verificationMessage } = useEmailVerification(token);

  const [countdown, setCountdown] = useState<number>(5);
  const [userEmailForResend, setUserEmailForResend] = useState<string | null>(null);

  const [startCountdown, setStartCountdown] = useState<boolean>(false);

  useEffect(() => {
    console.log('Client Effect 1 (Success/Messages) triggered. State:', { isLoading, isSuccess, isError, isExpired, startCountdown, verificationMessage });

    if (isSuccess && !startCountdown) {
      console.log('Client Effect 1: isSuccess is TRUE and countdown NOT started. Setting UI render delay...');
      const uiRenderDelay = setTimeout(() => {
        console.log('Client Effect 1: UI render delay finished. Setting startCountdown to true and showing success message.');
        setStartCountdown(true);
        api.success(verificationMessage || '¡Tu cuenta ha sido verificada exitosamente!', 3); // Use hook's message
      }, 100);

      return () => {
        console.log('Client Effect 1 Cleanup: Clearing UI render delay timeout.');
        clearTimeout(uiRenderDelay);
      };
    }
    if (isError && verificationMessage) {
        console.log('Client Effect 1: isError is TRUE. Showing error message.');
        api.error(verificationMessage, 5);
    }
    if (isExpired && verificationMessage) {
        console.log('Client Effect 1: isExpired is TRUE. Showing warning message.');
        api.warning(verificationMessage, 5);
    }

  }, [isLoading, isSuccess, isError, isExpired, verificationMessage, startCountdown, api]);

  useEffect(() => {
    console.log('Client Effect 2 (Countdown/Redirect) triggered. startCountdown state:', startCountdown);
    if (startCountdown) {
      console.log('Client Effect 2: startCountdown is TRUE. Starting countdown...');
      const timer = setInterval(() => {
        setCountdown((prev) => {
          const newPrev = prev - 1;
          console.log(`Client Effect 2: Countdown tick. ${newPrev} seconds left.`);
          if (newPrev === 0) {
            clearInterval(timer);
            console.log('Client Effect 2: Countdown finished. Redirecting to /login.');
            router.push('/login');
          }
          return newPrev;
        });
      }, 1000);
      return () => {
        console.log('Client Effect 2 Cleanup: Clearing countdown interval.');
        clearInterval(timer);
      };
    }
  }, [startCountdown, router]);

  const handleResendEmail = async () => {
    console.log('handleResendEmail called.');
    let emailToResend = userEmailForResend;

    if (!emailToResend) {
      const emailInput = prompt('Por favor, ingrese su correo electrónico para reenviar el enlace de verificación:');
      if (!emailInput) {
        api.warning('Correo electrónico no proporcionado.');
        return;
      }
      emailToResend = emailInput;
      setUserEmailForResend(emailInput);
    }

    if (!emailToResend || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToResend)) {
        api.error('Por favor, ingrese un correo electrónico válido.');
        return;
    }

    try {
      api.loading({ content: 'Enviando nuevo enlace...', key: 'resend' });
      console.log('Attempting to resend email for:', emailToResend);
      const response = await resendVerificationEmail(emailToResend);
      console.log('Resend email response:', response);
      if (response.status === 'success') {
        api.success({ content: response.message, key: 'resend', duration: 5 });
      } else {
        api.error({ content: response.message, key: 'resend', duration: 5 });
      }
    } catch (error) {
      console.error('Resend failed:', error);
      api.error({ content: 'Error al reenviar el enlace.', key: 'resend', duration: 5 });
    }
  };

  const renderContent = () => {
    console.log('renderContent called. Current states:', { isLoading, isSuccess, isError, isExpired, startCountdown });

    if (isLoading) {
      console.log('renderContent: Returning Loading state.');
      return (
        <Space direction="vertical" align="center">
          <Spin size="large" />
          <Text>{verificationMessage || "Verificando su correo electrónico..."}</Text>
        </Space>
      );
    }

    if (isSuccess) {
      console.log('renderContent: Returning SUCCESS state.');
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
      console.log('renderContent: Returning EXPIRED state.');
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
      console.log('renderContent: Returning ERROR state.');
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

    console.log('renderContent: Returning NULL (no specific state met yet).');
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
      {contextHolder}
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
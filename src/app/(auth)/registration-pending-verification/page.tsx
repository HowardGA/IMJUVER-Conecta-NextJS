'use client';

import React, { useState,} from 'react';
import { Layout, Card, Button, Result, Space, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { resendVerificationEmail } from '@/services/authServices';

const RegistrationPending: React.FC= () => {

  const [userEmailForResend, setUserEmailForResend] = useState<string | null>(null); 
const [messageApi, contextHolder] = message.useMessage();


  const handleResendEmail = async () => {
    let emailToResend = userEmailForResend;

    if (!emailToResend) {
      const emailInput = prompt('Por favor, ingrese su correo electrónico para reenviar el enlace de verificación:');
      if (!emailInput) {
        messageApi.warning('Correo electrónico no proporcionado.');
        return;
      }
      emailToResend = emailInput;
      setUserEmailForResend(emailInput); 
    }

    if (!emailToResend || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToResend)) {
        messageApi.error('Por favor, ingrese un correo electrónico válido.');
        return;
    }

    try {
      messageApi.loading({ content: 'Enviando nuevo enlace...', key: 'resend' });
      const response = await resendVerificationEmail(emailToResend);
      if (response.status === 'success') {
        messageApi.success({ content: response.message, key: 'resend', duration: 5 });
      } else {
        messageApi.error({ content: response.message, key: 'resend', duration: 5 });
      }
    } catch (err: any) {
      console.error('Resend failed:', err);
      messageApi.error({ content: err.response?.data?.message || 'Error al reenviar el enlace.', key: 'resend', duration: 5 });
    }
  };

  return (
    <>
    {contextHolder}
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
            <Space direction="vertical" align="center">
                <Result
                    status="warning"
                    icon={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
                    title="Se envió el correo de verificación"
                    subTitle="Si no te llego el correo, da click al boton de abajo"
                    extra={
                        <Button type="primary" onClick={handleResendEmail}>
                        Reenviar Enlace
                        </Button>
                    }
                    />
            </Space>
        </Card>
        </Layout>
    </>
  );
};

export default RegistrationPending;
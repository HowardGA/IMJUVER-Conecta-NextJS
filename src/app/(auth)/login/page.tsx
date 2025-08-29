'use client';
import { Layout, Card, Row, Typography, Form, Input, Button } from 'antd';
import React from 'react';
import Logo from '../../../../public/logo.png'
import Image from 'next/image';
import { LoginForm } from '@/interfaces/authInterface';
import Link from 'next/link';
import { useLogin } from '@/hooks/useAuthentication';
const {Title, Text} = Typography;

const Login: React.FC = () => {
    const [form] = Form.useForm<LoginForm>();
    const { mutate: loginUser, isPending } = useLogin(); 


    const onFinish = (values: LoginForm) => {
            loginUser(values);
    }

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
            backgroundAttachment: 'fixed',
            padding: '20px' 
        }}
    >
        <Card
            variant='borderless'
            style={{
                width: '100%', 
                maxWidth: '400px', 
                padding: '1.5rem',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                margin: '20px auto',
            }}
        >
            <Row align='middle' justify='center' style={{ flexDirection: 'column' }}>
                <div style={{
                    width: 'min(100%, 18rem)',
                    height: '8rem',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                }}>
                    <Image src={Logo} alt='Logo image' style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <Title level={2} style={{ color: 'var(--ant-color-primary)', textAlign: 'center' }}>
                    Iniciar Sesión
                </Title>
                <Form
                    form={form}
                    name="login"
                    style={{ width: '100%' }}
                    layout='vertical' 
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Correo Electronico"
                        name="email"
                        rules={[{ required: true, message: 'Por favor ingrese su correo!' }]}
                    >
                        <Input size='large' placeholder="tu@ejemplo.com" />
                    </Form.Item>

                    <Form.Item
                        label="Contraseña"
                        name="password"
                        rules={[{ required: true, message: 'Por favor ingrese su contraseña!' }]}
                    >
                        <Input.Password size='large' placeholder="••••••••" /> 
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block 
                            size='large'
                            loading={isPending}
                        >
                            Iniciar Sesión
                        </Button>
                    </Form.Item>
                </Form>
                <Text style={{ textAlign: 'center', marginTop: '1rem' }}>
                    ¿No tienes una cuenta? <Link href='/register'>Registrate</Link>
                </Text>
            </Row>
        </Card>
    </Layout>
);
}

export default Login;
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
    const { mutate: loginUser, isPending, isError, error } = useLogin(); 


    const onFinish = (values: LoginForm) => {
            loginUser(values);
    }

    return(
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
            <Card variant='borderless' style={{width:'25rem', padding:'1.5rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',}}>
                <Row align='middle' justify='center' style={{ flexDirection: 'column' }}>
                    <div style={{ width: '18rem', height: '8rem', overflow: 'hidden' }}>
                    <Image src={Logo} alt='Logo image' style={{width:'100%', height:'100%', objectFit: 'contain'}}/>
                    </div>
                    <Title level={2} style={{color: 'var(--ant-color-primary)'}}>Iniciar Sesión</Title>
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
                        <Input size='large'/>
                        </Form.Item>

                        <Form.Item
                        label="Contraseña"
                        name="password"
                        rules={[{ required: true, message: 'Por favor ingrese su contraseña!' }]}
                        >
                        <Input.Password size='large'/>
                        </Form.Item>

                        <Form.Item>
                        <Button type="primary" htmlType="submit" block size='large' loading={isPending}>
                            Submit
                        </Button>
                        </Form.Item>
                    </Form>
                    <Text>¿No tienes una cuenta? <Link href='/register'>Registrate</Link></Text>
                </Row>
            </Card>
        </Layout>
    );
}

export default Login;
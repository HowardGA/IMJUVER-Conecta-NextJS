'use client';
import { Layout, Card, Row, Col, Typography, Form, Input, Button, DatePicker, Select } from 'antd';
import React from 'react';
import Logo from '../../../../public/logo.png'
import Image from 'next/image';
import { RegisterForm } from '@/interfaces/authInterface';
import Link from 'next/link';
import { useRegister } from '@/hooks/useAuthentication';
import styles from './register.module.css';

const {Title, Text} = Typography;

const Register: React.FC = () => {
    const [form] = Form.useForm<RegisterForm>();
    const { mutate: registerUser, isPending } = useRegister(); 


    const onFinish = (values: RegisterForm) => {
        registerUser({...values, rol_id: 2});
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
            padding: '20px', 
            boxSizing: 'border-box',
        }}
    >
        <Card
            variant='borderless'
            style={{
                width: '100%',
                maxWidth: '720px',
                padding: '1.5rem',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                margin: '20px auto',
                boxSizing: 'border-box',
            }}
        >
             <Row
                justify='center'
                align='top'
                gutter={[32, 24]} 
             >
                <Col
                    xs={24}   
        md={12}   
        className={`${styles.leftCol} ${styles.leftColResponsive}`} 
    >
                    <div style={{
                        width: 'min(100%, 18rem)', 
                        height: '8rem',
                        overflow: 'hidden',
                        marginBottom: '1rem',
                    }}>
                        <Image src={Logo} alt='Logo image' style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <Title level={2} style={{ color: 'var(--ant-color-primary)', textAlign: 'center', fontSize: '2em' }}>
                        Registro
                    </Title>
                    <Text style={{ fontSize: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
                        Registra tus datos para crear una cuenta y gozar de las nuevas ventajas que ofrece la plataforma del IMJUVER
                    </Text>

                    <div style={{ marginTop: 'auto', marginBottom: '1rem', textAlign: 'center' }}>
                        <Text>¿Ya tienes una cuenta?</Text>
                        <Link href='/login' style={{ marginLeft: '0.5rem' }}>Inicia Sesión</Link>
                    </div>
                </Col>

                <Col
                    xs={24}  
                    md={12}  
                    className={styles.rightCol}
                >
                   <Form
                        form={form}
                        name="register"
                        style={{ width: '100%' }}
                        layout='vertical' 
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="Nombre"
                            name="nombre"
                            rules={[{ required: true, message: 'Por favor ingrese su nombre!' }]}
                        >
                            <Input size='large' placeholder="Tu Nombre" />
                        </Form.Item>

                        <Form.Item
                            label="Apellido"
                            name="apellido"
                            rules={[{ required: true, message: 'Por favor ingrese su apellido!' }]}
                        >
                            <Input size='large' placeholder="Tu Apellido" />
                        </Form.Item>

                        <Form.Item
                            label="Telefono"
                            name="telefono"
                            rules={[
                                { required: true, message: 'Por favor ingrese su teléfono!' },
                                {
                                    pattern: /^\d{10}$/,
                                    message: 'El teléfono debe tener exactamente 10 dígitos numéricos.',
                                },
                            ]}
                        >
                            <Input
                                size='large'
                                maxLength={10}
                                placeholder="Ej: 6641234567"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Fecha de Nacimiento"
                            name="fecha_nacimiento"
                            rules={[{ required: true, message: 'Por favor ingrese su fecha de nacimiento!' }]}
                        >
                            <DatePicker style={{ width: '100%' }} size='large' placeholder="Selecciona tu fecha" />
                        </Form.Item>

                        <Form.Item
                            label="Nivel educativo"
                            name="nivel_educativo"
                        >
                            <Select
                                placeholder='Opcional'
                                style={{ width: '100%' }}
                                options={[
                                    { value: 'Primaria', label: 'Primaria' },
                                    { value: 'Secundaria', label: 'Secundaria' },
                                    { value: 'Preparatoria', label: 'Preparatoria' },
                                    { value: 'Universidad', label: 'Universidad' },
                                ]}
                                size='large'
                            />
                        </Form.Item>

                        <Form.Item
                            label="Correo Electronico"
                            name="email"
                            rules={[{ required: true, message: 'Por favor ingrese su correo!' }, { type: 'email', message: 'Por favor ingrese un correo válido!' }]}
                        >
                            <Input size='large' placeholder="tu@ejemplo.com" />
                        </Form.Item>

                        <Form.Item
                            label="Contraseña"
                            name="password"
                            rules={[{ required: true, message: 'Por favor ingrese su contraseña!' }, { min: 6, message: 'La contraseña debe tener al menos 6 caracteres.' }]}
                        >
                            <Input.Password size='large' placeholder="••••••••" />
                        </Form.Item>

                        <Form.Item
                            label="Confirmar contraseña"
                            name="confirm_password" 
                            dependencies={['password']}
                            hasFeedback 
                            rules={[
                                { required: true, message: 'Por favor confirme su contraseña!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Las dos contraseñas no coinciden!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password size='large' placeholder="••••••••" />
                        </Form.Item>

                        <Form.Item style={{ marginTop: '20px' }}>
                            <Button type="primary" htmlType="submit" block size='large' loading={isPending}>
                                Registrarse
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Card>
    </Layout>
);
}

export default Register;
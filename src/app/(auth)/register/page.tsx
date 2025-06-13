'use client';
import { Layout, Card, Row, Col, Typography, Form, Input, Button, InputNumber, DatePicker, Select } from 'antd';
import React from 'react';
import Logo from '../../../../public/logo.png'
import Image from 'next/image';
import { RegisterForm } from '@/interfaces/authInterface';
import Link from 'next/link';
import { useRegister } from '@/hooks/useAuthentication';
const {Title, Text} = Typography;

const Register: React.FC = () => {
    const [form] = Form.useForm<RegisterForm>();
    const { mutate: registerUser, isPending, isError } = useRegister(); 


    const onFinish = (values: RegisterForm) => {
        registerUser({...values, rol_id: 1});
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
            <Card variant='borderless' style={{width:'45rem', padding:'1.5rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',}}>
                 <Row justify='center' align='top' gutter={[32, 24]}>
                    <Col span={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',justifyItems:'center'}}>
                        <div style={{ width: '18rem', height: '8rem', overflow: 'hidden' }}>
                        <Image src={Logo} alt='Logo image' style={{width:'100%', height:'100%', objectFit: 'contain'}}/>
                        </div>
                        <Title level={2} style={{color: 'var(--ant-color-primary)'}}>Registro</Title>
                        <Text style={{ fontSize: '1rem', marginBottom: '2rem', textAlign:'center' }}>Registra tus datos para crear una cuenta y gozar de las nuevas ventajas que ofrece la plataforma del IMJUVER</Text>

                        <div style={{ marginTop: 'auto', marginBottom: '1rem' }}>
                            <Text>¿Ya tienes una cuenta?</Text>
                            <Link href='/login' style={{ marginLeft: '0.5rem' }}>Inicia Sesión</Link>
                        </div>
                    </Col>
                    <Col span={12} style={{ overflowY: 'auto', maxHeight: '25rem', paddingRight: '1rem' }}>
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
                            <Input size='large'/>
                            </Form.Item>

                            <Form.Item
                            label="Apellido"
                            name="apellido"
                            rules={[{ required: true, message: 'Por favor ingrese su apellido!' }]}
                            >
                            <Input size='large'/>
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
                                    placeholder="Ingrese 10 dígitos" 
                                />
                            </Form.Item>

                            <Form.Item
                            label="Fecha de Nacimiento"
                            name="fecha_nacimiento"
                            rules={[{ required: true, message: 'Por favor ingrese su fecha de nacimiento!' }]}
                            >
                            <DatePicker style={{ width: '100%' }} size='large'/>
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

                            <Form.Item
                            label="Confirmar contraseña"
                            rules={[{ required: true, message: 'Por favor confirme su contraseña!' }]}
                            >
                            <Input.Password size='large'/>
                            </Form.Item>

                            <Form.Item>
                            <Button type="primary" htmlType="submit" block size='large' loading={isPending}>
                                Submit
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
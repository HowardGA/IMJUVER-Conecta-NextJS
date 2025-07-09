'use client'; 

import {useEffect, useState} from 'react';
import { Card, Col, Row, Table, Spin, Alert, Typography, Layout, message, Button, Space, Popconfirm, Modal, Form, Select } from 'antd';
import { UserOutlined, BookOutlined, FileTextOutlined, QuestionCircleOutlined, ReadOutlined, TagOutlined, AppstoreOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useGetAdminStats, useGetAllUsers, useDeleteUser, useUpdateUserRole, useGetAllRoles } from '@/hooks/adminHooks'; 
import { ColumnsType } from 'antd/es/table'; 
import { UserData, UpdateUserRolePayload } from '@/interfaces/adminInterface';
import { useUser } from '@/components/providers/UserProvider';
import { useRouter } from 'next/navigation';
import { motion, Variants, Transition } from 'framer-motion';
const { Title } = Typography;
const { Content } = Layout;

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};
const cardItemVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring", 
            stiffness: 100,
            damping: 10
        } as Transition,
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
    },
};
const userTableColumns: ColumnsType<UserData>  = [
    {
        title: 'ID',
        dataIndex: 'usu_id',
        key: 'usu_id',
        sorter: (a: UserData, b: UserData) => a.usu_id - b.usu_id,
    },
    {
        title: 'Nombre',
        dataIndex: 'nombre',
        key: 'nombre',
        sorter: (a: UserData, b: UserData) => a.nombre.localeCompare(b.nombre),
    },
    {
        title: 'Apellido',
        dataIndex: 'apellido',
        key: 'apellido',
        sorter: (a: UserData, b: UserData) => a.apellido.localeCompare(b.apellido),
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Rol',
        dataIndex: ['rol', 'nombre'], 
        key: 'rolNombre',
        filters: [
            { text: 'Administrador', value: 'Administrador' },
            { text: 'Estudiante', value: 'Estudiante' }, 
           
        ],
        onFilter: (value, record) => record.rol.nombre.indexOf(value as string) === 0,
    },
    {
        title: 'Teléfono',
        dataIndex: 'telefono',
        key: 'telefono',
    },
    {
        title: 'Estado',
        dataIndex: 'estado',
        key: 'estado',
        render: (estado: boolean) => (estado ? 'Activo' : 'Inactivo'),
        filters: [
            { text: 'Activo', value: true },
            { text: 'Inactivo', value: false },
        ],
        onFilter: (value, record) => record.estado === (value as boolean),
    },
    {
        title: 'Verificado',
        dataIndex: 'isVerified',
        key: 'isVerified',
        render: (isVerified: boolean) => (isVerified ? 'Sí' : 'No'),
        filters: [
            { text: 'Sí', value: true },
            { text: 'No', value: false },
        ],
        onFilter: (value, record) => record.isVerified === (value as boolean),
    },
    {
        title: 'Creación',
        dataIndex: 'fecha_creacion',
        key: 'fecha_creacion',
        render: (dateString: string) => new Date(dateString).toLocaleDateString(), // Format date
        sorter: (a: UserData, b: UserData) => new Date(a.fecha_creacion).getTime() - new Date(b.fecha_creacion).getTime(),
    },
];

const AdminDashboardPage: React.FC = () => {
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
    const [currentRoleUser, setCurrentRoleUser] = useState<UserData | null>(null); 
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const { data: stats, isLoading: isLoadingStats, isError: isErrorStats, error: statsError } = useGetAdminStats();
    const { data: users, isLoading: isLoadingUsers, isError: isErrorUsers, error: usersError } = useGetAllUsers();
    const { data: roles, isLoading: isLoadingRoles, isError: isErrorRoles, error: rolesError } = useGetAllRoles();
    const {user} = useUser();
    const router = useRouter();
    const deleteUserMutation = useDeleteUser({ messageApi });
    const updateUserRoleMutation = useUpdateUserRole({ messageApi });

    useEffect(() => {
        if (user?.rol_nombre === 'admin') {
            router.push('/login');
        }
    }, [user,router])

     const rowSelection = {
        selectedRowKeys: selectedUserIds,
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedUserIds(selectedRowKeys as number[]);
        },
    };
    // Delete User(s)
    const handleDeleteUsers = () => {
        if (selectedUserIds.length === 0) {
            messageApi.warning('Por favor, selecciona al menos un usuario para eliminar.');
            return;
        }
        // Iterate and delete each selected user
        selectedUserIds.forEach(userId => {
            deleteUserMutation.mutate(userId);
        });
        setSelectedUserIds([]); // Clear selection after initiating deletion
    };

    // Change Role Modal Handlers
    const showRoleModal = () => {
        if (selectedUserIds.length !== 1) {
            messageApi.warning('Por favor, selecciona EXACTAMENTE un usuario para cambiar el rol.');
            return;
        }
        const userToEdit = users?.find(u => u.usu_id === selectedUserIds[0]);
        if (userToEdit) {
            setCurrentRoleUser(userToEdit);
            form.setFieldsValue({ rol_id: userToEdit.rol.rol_id }); 
            setIsRoleModalVisible(true);
        } else {
            messageApi.error('Usuario seleccionado no encontrado.');
        }
    };

    const handleRoleModalOk = () => {
        form.validateFields()
            .then(values => {
                if (currentRoleUser) {
                    const payload: UpdateUserRolePayload = {
                        userId: currentRoleUser.usu_id,
                        newRoleId: values.rol_id,
                    };
                    updateUserRoleMutation.mutate(payload);
                    setIsRoleModalVisible(false);
                    setSelectedUserIds([]); 
                }
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleRoleModalCancel = () => {
        setIsRoleModalVisible(false);
        setCurrentRoleUser(null);
        form.resetFields(); 
    };
    return (
        <Layout style={{ minHeight: '100vh', padding: '24px' }}>
            {contextHolder}
            <Content>
                <Title level={2} style={{ marginBottom: '24px' }}>Panel de Administración</Title>

                {/* Statistics Cards */}
                {isLoadingStats ? (
                    <Spin size="large" tip="Cargando estadísticas..." />
                ) : isErrorStats ? (
                    <Alert message="Error al cargar estadísticas" description={statsError?.message || 'Algo salió mal.'} type="error" showIcon />
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="ant-row"
                        style={{ marginBottom: '24px' }}
                    >
                    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                        <Col xs={24} sm={12} md={8} lg={6}>
                        <motion.div variants={cardItemVariants}>
                            <Card bordered={false}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <UserOutlined style={{ fontSize: '30px', color: '#1890ff' }} />
                                    <div>
                                        <Title level={4} style={{ margin: 0 }}>{stats?.totalUsers}</Title>
                                        <p style={{ margin: 0 }}>Total Usuarios</p>
                                    </div>
                                </div>
                            </Card>
                            </motion.div>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <motion.div variants={cardItemVariants}>
                            <Card bordered={false}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <BookOutlined style={{ fontSize: '30px', color: '#52c41a' }} />
                                    <div>
                                        <Title level={4} style={{ margin: 0 }}>{stats?.totalCourses}</Title>
                                        <p style={{ margin: 0 }}>Total Cursos</p>
                                    </div>
                                </div>
                            </Card>
                            </motion.div>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <motion.div variants={cardItemVariants}>
                            <Card bordered={false}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <ReadOutlined style={{ fontSize: '30px', color: '#faad14' }} />
                                    <div>
                                        <Title level={4} style={{ margin: 0 }}>{stats?.totalLessons}</Title>
                                        <p style={{ margin: 0 }}>Total Lecciones</p>
                                    </div>
                                </div>
                            </Card>
                            </motion.div>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <motion.div variants={cardItemVariants}>
                            <Card bordered={false}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <QuestionCircleOutlined style={{ fontSize: '30px', color: '#f5222d' }} />
                                    <div>
                                        <Title level={4} style={{ margin: 0 }}>{stats?.totalQuizzes}</Title>
                                        <p style={{ margin: 0 }}>Total Cuestionarios</p>
                                    </div>
                                </div>
                            </Card>
                            </motion.div>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <motion.div variants={cardItemVariants}>
                            <Card bordered={false}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <FileTextOutlined style={{ fontSize: '30px', color: '#eb2f96' }} />
                                    <div>
                                        <Title level={4} style={{ margin: 0 }}>{stats?.totalPosts}</Title>
                                        <p style={{ margin: 0 }}>Total Publicaciones</p>
                                    </div>
                                </div>
                            </Card>
                            </motion.div>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <motion.div variants={cardItemVariants}>
                            <Card bordered={false}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <TagOutlined style={{ fontSize: '30px', color: '#13c2c2' }} />
                                    <div>
                                        <Title level={4} style={{ margin: 0 }}>{stats?.totalCourseCategories}</Title>
                                        <p style={{ margin: 0 }}>Categorías de Cursos</p>
                                    </div>
                                </div>
                            </Card>
                            </motion.div>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <motion.div variants={cardItemVariants}>
                            <Card bordered={false}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <AppstoreOutlined style={{ fontSize: '30px', color: '#722ed1' }} />
                                    <div>
                                        <Title level={4} style={{ margin: 0 }}>{stats?.totalModules}</Title>
                                        <p style={{ margin: 0 }}>Total Módulos</p>
                                    </div>
                                </div>
                            </Card>
                            </motion.div>
                        </Col>
                    </Row>
                    </motion.div>
                )}

                <Title level={3} style={{ marginTop: '30px', marginBottom: '20px' }}>Gestión de Usuarios</Title>
                <Space style={{ marginBottom: 16 }}>
                    <Popconfirm
                        title={`¿Estás seguro de eliminar ${selectedUserIds.length} usuario(s)?`}
                        onConfirm={handleDeleteUsers}
                        okText="Sí"
                        cancelText="No"
                        disabled={selectedUserIds.length === 0 || deleteUserMutation.isPending}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            disabled={selectedUserIds.length === 0 || deleteUserMutation.isPending}
                            loading={deleteUserMutation.isPending}
                        >
                            Eliminar ({selectedUserIds.length})
                        </Button>
                    </Popconfirm>

                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={showRoleModal}
                        disabled={selectedUserIds.length !== 1 || updateUserRoleMutation.isPending || isLoadingRoles}
                        loading={updateUserRoleMutation.isPending || isLoadingRoles}
                    >
                        Cambiar Rol
                    </Button>
                </Space>
                {isLoadingUsers ? (
                    <Spin size="large" tip="Cargando usuarios..." />
                ) : isErrorUsers ? (
                    <Alert message="Error al cargar usuarios" description={usersError?.message || 'Algo salió mal.'} type="error" showIcon />
                ) : (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={itemVariants} // Use a simple fade-in variant
                    >
                        <Table
                            columns={userTableColumns}
                            dataSource={users}
                            rowKey="usu_id" 
                            pagination={{ pageSize: 10 }} 
                            scroll={{ x: 'max-content' }}
                            rowSelection={rowSelection} 
                        />
                    </motion.div>
                )}
                 <Modal
                    title={`Cambiar Rol para: ${currentRoleUser?.nombre} ${currentRoleUser?.apellido || ''}`}
                    open={isRoleModalVisible}
                    onOk={handleRoleModalOk}
                    onCancel={handleRoleModalCancel}
                    confirmLoading={updateUserRoleMutation.isPending}
                >
                    {isLoadingRoles ? (
                        <Spin tip="Cargando roles..." />
                    ) : isErrorRoles ? (
                        <Alert message="Error al cargar roles" description={rolesError?.message || 'No se pudieron cargar los roles.'} type="error" />
                    ) : (
                        <Form form={form} layout="vertical" name="role_form">
                            <Form.Item
                                name="rol_id"
                                label="Nuevo Rol"
                                rules={[{ required: true, message: 'Por favor, selecciona un nuevo rol.' }]}
                            >
                                <Select placeholder="Selecciona un rol">
                                    {roles?.map(role => (
                                        <Select.Option key={role.rol_id} value={role.rol_id}>
                                            {role.nombre}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>
                    )}
                </Modal>
            </Content>
        </Layout>
    );
};

export default AdminDashboardPage;
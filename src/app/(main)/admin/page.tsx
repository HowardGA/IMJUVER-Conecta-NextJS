'use client';

import { useEffect, useState } from 'react';
import { Card, Col, Row, Table, Spin, Alert, Typography, Layout, message, Button, Space, Popconfirm, Modal, Form, Select } from 'antd';
import { UserOutlined, BookOutlined, FileTextOutlined, QuestionCircleOutlined, ReadOutlined, TagOutlined, AppstoreOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'; // Added PlusOutlined
import { useGetAdminStats, useGetAllUsers, useDeleteUser, useUpdateUserRole, useGetAllRoles } from '@/hooks/adminHooks';
import { ColumnsType } from 'antd/es/table';
import { UserData, UpdateUserRolePayload } from '@/interfaces/adminInterface';
import { useUser } from '@/components/providers/UserProvider';
import { useRouter } from 'next/navigation';
import { motion, Variants, Transition } from 'framer-motion';
import PrivateIdeasTable from './components/privateIdeas'; 
import CreateManagerUserModal from './components/CreateManagerUserModal'; 

const { Title } = Typography;
const { Content } = Layout;

// Framer Motion Variants (kept as is, they are good)
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

// User Table Columns (kept as is, they are good for data display)
const userTableColumns: ColumnsType<UserData> = [
    {
        title: 'ID',
        dataIndex: 'usu_id',
        key: 'usu_id',
        sorter: (a: UserData, b: UserData) => a.usu_id - b.usu_id,
        responsive: ['md'], // Hide on small screens to save space
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
        responsive: ['md'], // Hide on small screens
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
            // Add other roles dynamically if possible or as needed
        ],
        onFilter: (value, record) => record.rol.nombre.indexOf(value as string) === 0,
    },
    {
        title: 'Teléfono',
        dataIndex: 'telefono',
        key: 'telefono',
        responsive: ['lg'], // Only show on large screens
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
        responsive: ['md'], // Hide on small screens
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
        responsive: ['lg'], // Only show on large screens
    },
    {
        title: 'Creación',
        dataIndex: 'fecha_creacion',
        key: 'fecha_creacion',
        render: (dateString: string) => new Date(dateString).toLocaleDateString(),
        sorter: (a: UserData, b: UserData) => new Date(a.fecha_creacion).getTime() - new Date(b.fecha_creacion).getTime(),
        responsive: ['lg'], // Only show on large screens
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
    const { user } = useUser();
    const router = useRouter();
    const deleteUserMutation = useDeleteUser({ messageApi });
    const updateUserRoleMutation = useUpdateUserRole({ messageApi });
    const [isCreateManagerModalOpen, setIsCreateManagerModalOpen] = useState(false); // Renamed to avoid conflict

    const handleOpenCreateManagerModal = () => setIsCreateManagerModalOpen(true);
    const handleCloseCreateManagerModal = () => setIsCreateManagerModalOpen(false);


    useEffect(() => {
        if (user && user.rol_nombre !== 'Admin') { 
            router.push('/'); 
            messageApi.error('Acceso denegado. No tienes permisos de administrador.');
        }
    }, [user, router, messageApi]);


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
        selectedUserIds.forEach(userId => {
            deleteUserMutation.mutate(userId);
        });
        setSelectedUserIds([]);
    };

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
                    updateUserRoleMutation.mutate(payload, {
                        onSuccess: () => {
                            // Automatically refetch users after successful update
                            // This depends on how useUpdateUserRole is set up.
                            // If it doesn't invalidate 'users' query automatically, add queryClient.invalidateQueries(['users'])
                            messageApi.success('Rol de usuario actualizado con éxito.');
                        },
                        onError: (error) => {
                            messageApi.error(`Error al actualizar el rol: ${error.message || 'Error desconocido'}`);
                        }
                    });
                    setIsRoleModalVisible(false);
                    setSelectedUserIds([]);
                }
            })
            .catch(info => {
                console.log('Validate Failed:', info);
                messageApi.error('Por favor, selecciona un rol válido.');
            });
    };

    const handleRoleModalCancel = () => {
        setIsRoleModalVisible(false);
        setCurrentRoleUser(null);
        form.resetFields();
    };

    return (
        <Layout style={{ minHeight: '100vh', padding: '16px' }}> {/* Reduced padding for mobile */}
            {contextHolder}
            <Content>
                <Title level={2} style={{ marginBottom: '20px', fontSize: '1.8em' }}>Panel de Administración</Title>

                {isLoadingStats ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Spin size="large" tip="Cargando estadísticas..." />
                    </div>
                ) : isErrorStats ? (
                    <Alert
                        message="Error al cargar estadísticas"
                        description={statsError?.message || 'Algo salió mal.'}
                        type="error"
                        showIcon
                        style={{ marginBottom: '24px' }}
                    />
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ marginBottom: '24px' }}
                    >
                        <Row gutter={[16, 16]} justify="center"> {/* Added justify="center" for card alignment */}
                            {/* Each Col defines how many cards per row on different screen sizes */}
                            <Col xs={24} sm={12} md={8} lg={6} xl={4}> {/* 1 card per row on XS, 2 on SM, 3 on MD, 4 on LG, 6 on XL */}
                                <motion.div variants={cardItemVariants}>
                                    <Card bordered={false}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} /> {/* Smaller icon size */}
                                            <div>
                                                <Title level={4} style={{ margin: 0, fontSize: '1.4em' }}>{stats?.totalUsers}</Title> {/* Smaller title */}
                                                <p style={{ margin: 0, fontSize: '0.9em' }}>Total Usuarios</p> {/* Smaller text */}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                                <motion.div variants={cardItemVariants}>
                                    <Card bordered={false}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <BookOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                                            <div>
                                                <Title level={4} style={{ margin: 0, fontSize: '1.4em' }}>{stats?.totalCourses}</Title>
                                                <p style={{ margin: 0, fontSize: '0.9em' }}>Total Cursos</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                                <motion.div variants={cardItemVariants}>
                                    <Card bordered={false}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <ReadOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                                            <div>
                                                <Title level={4} style={{ margin: 0, fontSize: '1.4em' }}>{stats?.totalLessons}</Title>
                                                <p style={{ margin: 0, fontSize: '0.9em' }}>Total Lecciones</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                                <motion.div variants={cardItemVariants}>
                                    <Card bordered={false}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <QuestionCircleOutlined style={{ fontSize: '24px', color: '#f5222d' }} />
                                            <div>
                                                <Title level={4} style={{ margin: 0, fontSize: '1.4em' }}>{stats?.totalQuizzes}</Title>
                                                <p style={{ margin: 0, fontSize: '0.9em' }}>Total Cuestionarios</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                                <motion.div variants={cardItemVariants}>
                                    <Card bordered={false}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <FileTextOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />
                                            <div>
                                                <Title level={4} style={{ margin: 0, fontSize: '1.4em' }}>{stats?.totalPosts}</Title>
                                                <p style={{ margin: 0, fontSize: '0.9em' }}>Total Publicaciones</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                                <motion.div variants={cardItemVariants}>
                                    <Card bordered={false}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <TagOutlined style={{ fontSize: '24px', color: '#13c2c2' }} />
                                            <div>
                                                <Title level={4} style={{ margin: 0, fontSize: '1.4em' }}>{stats?.totalCourseCategories}</Title>
                                                <p style={{ margin: 0, fontSize: '0.9em' }}>Categorías de Cursos</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                                <motion.div variants={cardItemVariants}>
                                    <Card bordered={false}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <AppstoreOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
                                            <div>
                                                <Title level={4} style={{ margin: 0, fontSize: '1.4em' }}>{stats?.totalModules}</Title>
                                                <p style={{ margin: 0, fontSize: '0.9em' }}>Total Módulos</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            </Col>
                        </Row>
                    </motion.div>
                )}

                <Title level={3} style={{ marginTop: '24px', marginBottom: '16px', fontSize: '1.5em' }}>Propuestas Privadas</Title>
                <PrivateIdeasTable />

                <Title level={3} style={{ marginTop: '24px', marginBottom: '16px', fontSize: '1.5em' }}>Gestión de Usuarios</Title>
                <Space
                    style={{ marginBottom: 16, width: '100%' }}
                    wrap // Allow buttons to wrap to the next line
                    size={[8, 8]} // Horizontal and vertical spacing between buttons
                >
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
                            block // Make button full width on mobile if it's the only one
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
                        block // Make button full width on mobile
                    >
                        Cambiar Rol
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleOpenCreateManagerModal}
                        icon={<PlusOutlined />}
                        block // Make button full width on mobile
                    >
                        Crear Nuevo Usuario Gestor
                    </Button>
                </Space>
                {isLoadingUsers ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Spin size="large" tip="Cargando usuarios..." />
                    </div>
                ) : isErrorUsers ? (
                    <Alert
                        message="Error al cargar usuarios"
                        description={usersError?.message || 'Algo salió mal.'}
                        type="error"
                        showIcon
                        style={{ marginBottom: '24px' }}
                    />
                ) : (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={itemVariants}
                    >
                        <Table
                            columns={userTableColumns}
                            dataSource={users}
                            rowKey="usu_id"
                            pagination={{ pageSize: 10, showSizeChanger: false }} // Disable showSizeChanger for mobile
                            scroll={{ x: 'max-content' }} // Crucial for horizontal scrolling on small screens
                            rowSelection={rowSelection}
                            bordered // Add borders for better readability on tables
                        />
                    </motion.div>
                )}
                {/* Modal for changing user role */}
                <Modal
                    title={`Cambiar Rol para: ${currentRoleUser?.nombre} ${currentRoleUser?.apellido || ''}`}
                    open={isRoleModalVisible}
                    onOk={handleRoleModalOk}
                    onCancel={handleRoleModalCancel}
                    confirmLoading={updateUserRoleMutation.isPending}
                    width={500} // Max width, will adapt on mobile
                    style={{ top: 20 }} // Adjust modal position for mobile
                >
                    {isLoadingRoles ? (
                        <Spin tip="Cargando roles..." />
                    ) : isErrorRoles ? (
                        <Alert message="Error al cargar roles" description={rolesError?.message || 'No se pudieron cargar los roles.'} type="error" />
                    ) : (
                        <Form form={form} layout="vertical" name="role_form"> {/* Use vertical layout for form */}
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
                <CreateManagerUserModal
                    open={isCreateManagerModalOpen}
                    onClose={handleCloseCreateManagerModal}
                />
            </Content>
        </Layout>
    );
};

export default AdminDashboardPage;
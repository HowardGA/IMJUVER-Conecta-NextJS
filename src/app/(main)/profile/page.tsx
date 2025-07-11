'use client';

import { Card, Col, Row, Descriptions, Progress, Typography } from 'antd';
import { UserOutlined, MailOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser } from '@/components/providers/UserProvider';
import { useAllCourseProgress } from '@/hooks/useCourseProgress';
import { useUserInfo } from '@/hooks/useUserInfo';


const { Title } = Typography;

const UserProfilePage: React.FC = () => {
    const {user} = useUser();
    const userID = user?.usu_id;
    const {data: progressData} = useAllCourseProgress();
    const {data: userData} = useUserInfo(userID ?? 0);

  return (
    <div style={{ padding: '2rem' }}>
      <Title level={2}>
        <UserOutlined /> Perfil de Usuario
      </Title>

      <Card style={{ marginBottom: '2rem' }}>
        <Descriptions title="Información del Usuario" bordered column={2}>
          <Descriptions.Item label="Nombre">{userData?.user.nombre} {userData?.user.apellido}</Descriptions.Item>
          <Descriptions.Item label="Email">
            <MailOutlined /> {userData?.user.email}
          </Descriptions.Item>
          <Descriptions.Item label="Rol">{user?.rol_nombre}</Descriptions.Item>
          <Descriptions.Item label="Teléfono">{userData?.user.telefono}</Descriptions.Item>
          <Descriptions.Item label="Nivel Educativo">{userData?.user.nivel_educativo || 'No especificado'}</Descriptions.Item>
          <Descriptions.Item label="Fecha de Nacimiento">
  {userData?.user.fecha_nacimiento
    ? new Date(userData.user.fecha_nacimiento).toLocaleDateString()
    : 'No especificado'}
</Descriptions.Item>

<Descriptions.Item label="Fecha de Registro">
  {userData?.user.fecha_creacion
    ? new Date(userData.user.fecha_creacion).toLocaleDateString()
    : 'No especificado'}
</Descriptions.Item>
          <Descriptions.Item label="Verificado">
            {userData?.user.isVerified ? <CheckCircleOutlined style={{ color: 'green' }} /> : 'No'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Title level={3}>Progreso en Cursos</Title>

      <Row gutter={[16, 16]}>
        {progressData?.map((course) => (
          <Col key={course.courseId} xs={24} sm={12} md={8}>
            <Card title={course.courseTitle}>
              <Progress type="dashboard" percent={Math.round(course.percentage)} />
            </Card>
          </Col>
        ))}
      </Row>

      <Title level={4} style={{ marginTop: '2rem' }}>Resumen de Progreso</Title>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={progressData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="curso_titulo" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="percentage" fill="#1890ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 

export default UserProfilePage;
import { Card, Row, Col } from 'antd';
import { Directorio } from '@/interfaces/directorioInterface';

interface DirectoryCardProps {
    directorio: Directorio;
    onClick: () => void;
}

export default function DirectoryCard({ directorio, onClick }: DirectoryCardProps) {
    return (
        <Card
            hoverable
            onClick={onClick}
            title={directorio.nombre}
            style={{
                height: '12rem',
                display: 'flex',
                flexDirection: 'column',
            }}
            styles={{
                body: {
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px',
                }
            }}

        >

            <div style={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                marginBottom: '8px',
            }}>
                {directorio.descripcion}
            </div>
            <Row justify='center' align='bottom'>
                <Col span={12}>
                    <strong>Categoría:</strong> {directorio.categoria.nombre|| 'N/A'}
                </Col>
                 <Col span={12}>
                    <strong>Telefono:</strong> {directorio.telefono|| 'N/A'}
                </Col>
            </Row>
        </Card>
    );
}
import { Card, Row, Col, Typography } from 'antd';
import { Directorio } from '@/interfaces/directorioInterface';
const {Text} = Typography
interface DirectoryCardProps {
    directorio: Directorio;
    onClick: () => void;
}

export default function DirectoryCard({ directorio, onClick }: DirectoryCardProps) {
    return (
        <Card
            hoverable
            onClick={onClick}
            title={<Text strong style={{ fontSize: '1.1em' }}>{directorio.nombre}</Text>}
             style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '16px', 
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
            <div 
             style={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3, 
                    WebkitBoxOrient: 'vertical',
                    marginBottom: '8px',
                    fontSize: '0.9em', 
                }}
           >
                {directorio.descripcion}
            </div>
            <Row justify='start' gutter={[8, 8]} style={{ marginTop: 'auto' }} wrap>
                <Col  xs={24} sm={12}>
                    <strong>Categoría:</strong> {directorio.categoria.nombre|| 'N/A'}
                </Col>
                 <Col xs={24} sm={12}>
                    <strong>Telefono:</strong> {directorio.telefono|| 'N/A'}
                </Col>
            </Row>
        </Card>
    );
}
import { Card, Tag, Row, Col } from 'antd';
import { Oferta } from '@/interfaces/ofertaInterface';
import dayjs from 'dayjs';

interface JobCardProps {
    offer: Oferta;
    onClick: () => void;
}

export default function JobCard({ offer, onClick }: JobCardProps) {
    const cardColor = offer.mujer ? '#CC66DA' : '#f2c6ab';
    return (
        <Card
            hoverable
            onClick={onClick}
            title={offer.titulo}
            extra={
                <Tag color={offer.activo ? 'green' : 'red'}>
                    {offer.activo ? 'Activo' : 'No mas solicitudes'}
                </Tag>
            }
            style={{
                height: '12rem',
                display: 'flex',
                flexDirection: 'column',
            }}
            styles={{
                header:{
                    backgroundColor: `${cardColor}`
                },
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
                {offer.descripcion}
            </div>
            <Row justify='center' align='bottom' gutter={[8, 8]}> 
                <Col xs={24} sm={12}>
                    <strong>Categoría:</strong> {offer.categoria?.nombre || 'N/A'}
                </Col>
                <Col xs={24} sm={12}>
                    <strong>Vence en:</strong> {dayjs(offer.fecha_vigencia).format('MMM D, YYYY')}
                </Col>
            </Row>
        </Card>
    );
}
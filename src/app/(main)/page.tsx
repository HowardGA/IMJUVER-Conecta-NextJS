'use client';
import Hero from "@/components/ui/Hero";
import { Typography, Space, Divider } from 'antd';
import HeroImg from '../../../public/hero-student.png';
const {Title, Paragraph} = Typography

export default function Home() {
  return (
    <>
      <Hero
        title='Expande tu conocimiento y conoce todos los beneficios que ofrece el IMJUVER'
        subTitle='Conecta con oportunidades, recursos y la comunidad juvenil de Rosarito.'
        imageSrc={HeroImg}
      />
      <div style={{display:'flex', flexDirection: 'column',alignContent: 'center', alignItems:'center', margin:'1rem 0 1rem 0 '}}>
       <Space direction="vertical" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '24px', backgroundColor:'#b0b0b0ba', borderRadius:'1rem'}}>
      <Title level={2}>La Misión de IMJUVER Conecta</Title>
      
      <Paragraph>
        IMJUVER Conecta es una plataforma creada por y para los jóvenes de Playas de Rosarito.
        Más que un simple proyecto, es un espacio de crecimiento y colaboración que nació en 2025.
        Su propósito es ser el puente que conecta a la juventud de Rosarito con las oportunidades, recursos y la vibrante comunidad juvenil de la región.
      </Paragraph>

      <Divider />

      <Paragraph>
        Este proyecto no es una obra terminada, sino un lienzo en constante evolución. Se inició con una serie de funcionalidades clave, pero su verdadero potencial reside en el futuro que construimos juntos. No es la labor de un equipo fijo de desarrolladores, sino el resultado del esfuerzo colectivo. Cada estudiante universitario que realiza sus prácticas profesionales o libera sus horas de servicio social tiene la oportunidad de dejar su huella, añadiendo nuevas funcionalidades, mejorando las existentes o continuando el legado del proyecto.
      </Paragraph>

      <Paragraph>
        En IMJUVER Conecta, creemos firmemente que este proyecto es &quot;de los jóvenes, para los jóvenes.&quot; Es un ciclo de aprendizaje y contribución donde cada nueva generación se convierte en la siguiente ola de innovadores. Así, la plataforma no solo crece con el tiempo, sino que se enriquece con las ideas, la energía y el talento de cada uno de ustedes, asegurando que siempre esté alineada con las necesidades reales de nuestra comunidad.
      </Paragraph>
    </Space>
    </div>
    </>
  );
}

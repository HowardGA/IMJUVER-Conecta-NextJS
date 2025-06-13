'use client';
import Hero from "@/components/ui/Hero";
import { Button } from "antd";
import HeroImg from '../../../public/hero-student.png';

export default function Home() {
  return (
    <Hero
      title='Expande tu conocimiento y conoce todos los beneficios que ofrece el IMJUVER'
      subTitle='Conecta con oportunidades, recursos y la comunidad juvenil de Rosarito.'
      imageSrc={HeroImg}
    >
      <Button type="default" size="large" style={{ backgroundColor: 'var(--ant-color-info)', borderColor: 'var(--ant-color-info)', color: 'white' }}>
        Explorar Cursos
      </Button>
      <Button type="default" size="large" ghost style={{ borderColor: 'var(--ant-color-bg-layout)', color: 'var(--ant-color-bg-layout)' }}>
        Conoce Más
      </Button>
    </Hero>
  );
}

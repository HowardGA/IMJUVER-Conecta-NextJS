'use client';

import React from 'react';
import { Layout, Menu, Button, Space } from 'antd';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/components/providers/ThemeProvider'; 
import LightLogo from '../../../public/logo.png';
import Image from 'next/image';
import { useUser } from '../providers/UserProvider';

const { Header: AntdHeader } = Layout;

const AppHeader: React.FC = () => { 
  const { currentTheme } = useTheme(); 
  const {user, logout, isLoadingUser} = useUser();

  const menuItems = [
    { key: 'home', label: <Link href="/">Inicio</Link> },
    { key: 'courses', label: <Link href="/courses">Cursos</Link> },
    { key: 'news', label: <Link href="/cursos">Anuncios</Link> },
    { key: 'directory', label: <Link href="/cursos">Directorio</Link> },
    { key: 'work', label: <Link href="/cursos">Bolsa de Trabajo</Link> },
    { key: 'opinions', label: <Link href="/cursos">Propuestas</Link> },
    { key: 'disscusion', label: <Link href="/cursos">Foro</Link> },
    { key: 'profile', label: <Link href="/profile">Perfil</Link> },
  ];

  return (
    <AntdHeader
      style={{
        top: 0,
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin:'1rem'
      }}
    >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', }}>
            <Image
                src={LightLogo}
                alt='logo'
                height={65}
                width={155}
                priority 
            />
        </Link>
        <Menu
          theme={currentTheme === 'dark' ? 'dark' : 'light'}
          mode="horizontal"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          style={{ flex: 1, minWidth: 0,justifyContent: 'center'}}
        />
        <Space>
            <ThemeToggle />
            {user &&
            <Link href="/login">
                <Button 
                type="primary"
                loading={isLoadingUser}
                onClick={logout}
                >
                Cerrar Sesión</Button>
            </Link>
            }
           {!user &&
            <Link href="/login">
                <Button type="primary">Acceder</Button>
            </Link>
            }
        </Space>
    </AntdHeader>
  );
};

export default AppHeader;
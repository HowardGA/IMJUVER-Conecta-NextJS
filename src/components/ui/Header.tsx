'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button, Space, Drawer } from 'antd'; 
import Link from 'next/link';
import { useTheme } from '@/components/providers/ThemeProvider';
import LightLogo from '../../../public/logo.png';
import Image from 'next/image';
import { useUser } from '../providers/UserProvider';
import { MenuOutlined } from '@ant-design/icons'; 

const { Header: AntdHeader } = Layout;

const AppHeader: React.FC = () => {
  const { currentTheme } = useTheme();
  const { user, logout, isLoadingUser } = useUser();
  const [menuVisible, setMenuVisible] = useState(false);

  const allMenuItems = [
    { key: 'home', label: <Link href="/">Inicio</Link> },
    { key: 'courses', label: <Link href="/courses">Cursos</Link> },
    { key: 'news', label: <Link href="/announcements">Anuncios</Link> },
    { key: 'directory', label: <Link href="/directory">Directorio</Link> },
    { key: 'work', label: <Link href="/jobs">Bolsa de Trabajo</Link> },
    { key: 'opinions', label: <Link href="/ideas">Propuestas</Link> },
    { key: 'profile', label: <Link href="/profile">Perfil</Link>, requiresAuth: true }
  ];

  const menuItems = allMenuItems.filter(item => {
    if (item.requiresAuth && !user) {
      return false;
    }
    return true;
  });

  // Function to determine active key based on current path
  const getActiveKey = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const foundItem = allMenuItems.find(item => item.label.props.href === path);
      return foundItem ? foundItem.key : 'home'; // Default to 'home' if no match
    }
    return 'home';
  };

  return (
    <AntdHeader
      style={{
        position: 'sticky', // Make header sticky so it's always visible
        top: 0,
        zIndex: 1000, // Ensure it's above other content
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem', // Reduced horizontal padding for mobile
        height: '64px', // Standard Ant Design header height
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
        <Image
          src={LightLogo}
          alt='logo'
          height={40} // Reduced logo size for mobile
          width={100} // Reduced logo size for mobile
          priority
        />
      </Link>

      {/* Main Menu for Desktop */}
      <Menu
        theme={currentTheme === 'dark' ? 'dark' : 'light'}
        mode="horizontal"
        selectedKeys={[getActiveKey()]} // Set active key dynamically
        items={menuItems}
        style={{
          flex: 1,
          minWidth: 0,
          justifyContent: 'center',
          display: 'none', // Hide by default
        }}
        // Ant Design's default breakpoints for responsive display
        className="hide-on-mobile" // Custom class to hide on mobile breakpoints
      />

      {/* Right-aligned actions (Theme Toggle, Auth Buttons, Admin Button) */}
      <Space size="middle" style={{ marginLeft: 'auto' }}> {/* Push space to the left */}
        {/* <ThemeToggle /> */}
        {user ? (
          <Button
            type="primary"
            loading={isLoadingUser}
            onClick={logout}
            className="hide-on-mobile" // Hide on mobile, move to drawer
          >
            Cerrar Sesión
          </Button>
        ) : (
          <Link href="/login" className="hide-on-mobile"> {/* Hide on mobile, move to drawer */}
            <Button type="primary">Acceder</Button>
          </Link>
        )}
        {user?.rol_id === 1 && (
          <Link href="/admin" className="hide-on-mobile"> {/* Hide on mobile, move to drawer */}
            <Button type="primary">Admin</Button>
          </Link>
        )}

        {/* Hamburger Icon for Mobile */}
        <Button
          type="text"
          icon={<MenuOutlined style={{ fontSize: '1.2rem', color: currentTheme === 'dark' ? 'white' : 'black' }} />}
          onClick={() => setMenuVisible(true)}
          className="show-on-mobile" // Custom class to show on mobile breakpoints
          style={{marginLeft:'auto'}}
        />
      </Space>

      {/* Mobile Drawer Menu */}
      <Drawer
        title="Navegación"
        placement="right"
        onClose={() => setMenuVisible(false)}
        open={menuVisible}
        style={{ zIndex: 1001 }} // Ensure drawer is above header
      >
        <Menu
          theme={currentTheme === 'dark' ? 'dark' : 'light'}
          mode="vertical" // Vertical mode for drawer
          selectedKeys={[getActiveKey()]}
          items={menuItems.map(item => ({
            ...item,
            // Close drawer when a menu item is clicked
            onClick: () => setMenuVisible(false)
          }))}
          style={{ borderRight: 0 }} // Remove default right border
        />
        <div style={{ marginTop: '1rem', padding: '0 1rem' }}>
          {user ? (
            <Button
              type="primary"
              loading={isLoadingUser}
              onClick={() => {
                logout();
                setMenuVisible(false); // Close drawer after logout
              }}
              block // Full width button
            >
              Cerrar Sesión
            </Button>
          ) : (
            <Link href="/login">
              <Button type="primary" block onClick={() => setMenuVisible(false)}>Acceder</Button>
            </Link>
          )}
          {user?.rol_id === 1 && (
            <Link href="/admin" style={{ marginTop: '1rem', display: 'block' }}>
              <Button type="primary" block onClick={() => setMenuVisible(false)}>Admin</Button>
            </Link>
          )}
        </div>
      </Drawer>
    </AntdHeader>
  );
};

export default AppHeader;
'use client';

import React, { ReactNode } from 'react';
import { Layout } from 'antd'; 

const { Content, Footer } = Layout;

interface AntdLayoutClientProps {
  children: ReactNode;
  header: ReactNode; 
}

const AntdLayoutClient: React.FC<AntdLayoutClientProps> = ({ children, header }) => {
  return (
    <Layout style={{ minHeight: '100vh', flexDirection: 'column' }}>
      {header} 
      <Content
        style={{
          flex: 1, 
          background: 'var(--ant-color-bg-layout)', 
          
        }}
      >
        <div
          style={{
            minHeight: '100%',
            background: 'var(--ant-color-bg-container)',
          }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', color: 'var(--ant-color-bg-container)' }}>
        IMJUVER Conecta ©{new Date().getFullYear()} Howard Garcia
      </Footer>
    </Layout>
  );
};

export default AntdLayoutClient;
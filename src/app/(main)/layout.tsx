import React, { ReactNode } from 'react';
import type { Metadata } from 'next';
import AppHeader from '@/components/ui/Header';
import AntdLayoutClient from '@/components/common/AntdLayoutClient';

export const metadata: Metadata = {
  title: 'IMJUVER Conecta',
  description: 'Plataforma web de IMJUVER para conectar a los jovenes',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <AntdLayoutClient header={<AppHeader/>}>
        {children}
    </AntdLayoutClient>
  );
}
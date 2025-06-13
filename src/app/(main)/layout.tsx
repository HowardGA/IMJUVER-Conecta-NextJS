import type { Metadata } from 'next';
import MainLayoutWrapper from './MainLayoutWrapper';
import React, { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'IMJUVER Conecta',
  description: 'Plataforma web de IMJUVER para conectar a los jovenes',
};

interface MainRootLayoutProps { 
  children: ReactNode;
}

export default function MainRootLayout({ children }: Readonly<MainRootLayoutProps>) {
  return (
    <MainLayoutWrapper>
      {children}
    </MainLayoutWrapper>
  );
}
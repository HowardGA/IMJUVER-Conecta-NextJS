'use client';

import React, { ReactNode } from 'react';
import AppHeader from '@/components/ui/Header';
import AntdLayoutClient from '@/components/common/AntdLayoutClient';

interface MainLayoutWrapperProps {
  children: ReactNode;
}

const MainLayoutWrapper: React.FC<MainLayoutWrapperProps> = ({ children }) => {
  return (
    
    <AntdLayoutClient header={<AppHeader/>}>
        {children}
    </AntdLayoutClient>
  );
};

export default MainLayoutWrapper;
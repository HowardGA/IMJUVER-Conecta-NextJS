'use client'
import React, { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '@/components/providers/AntdRegistry';
import QueryProvider from '@/components/providers/QueryProvider';
import ThemeProvider from '@/components/providers/ThemeProvider';
import './globals.css';
import { UserProvider } from '@/components/providers/UserProvider';
import { App, ConfigProvider } from 'antd'; 
import { MessageProvider } from '@/components/providers/MessageProvider';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ConfigProvider>
            <App>
              <MessageProvider>
                <ThemeProvider>
                  <QueryProvider>
                      <UserProvider>
                        {children}
                      </UserProvider>
                  </QueryProvider>
                </ThemeProvider>
              </MessageProvider>
            </App>
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
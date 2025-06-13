import React, { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '@/components/providers/AntdRegistry';
import QueryProvider from '@/components/providers/QueryProvider';
import ThemeProvider from '@/components/providers/ThemeProvider';
import './globals.css';
import { UserProvider } from '@/components/providers/UserProvider';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <QueryProvider>
                <UserProvider>
                  {children}
                </UserProvider>
            </QueryProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import { lightThemeTokens, darkThemeTokens, commonThemeConfig } from '@/styles/theme';

interface ThemeContextType {
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('app-theme', newTheme);
      return newTheme;
    });
  };

  const customTokens = currentTheme === 'dark' ? darkThemeTokens : lightThemeTokens;

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
      <ConfigProvider
      
        key={currentTheme}
        theme={{
          ...commonThemeConfig,
          cssVar: true, 
          token: {
            ...customTokens,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
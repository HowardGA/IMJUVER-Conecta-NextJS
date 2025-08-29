'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { message as antdMessage } from 'antd'; 
import { MessageInstance } from 'antd/es/message/interface';
const MessageContext = createContext<MessageInstance | null>(null);
interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [messageApi, contextHolder] = antdMessage.useMessage();

  return (
    <MessageContext.Provider value={messageApi}>
      {contextHolder} 
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (context === null) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};
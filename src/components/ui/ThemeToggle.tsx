'use client';

import React from 'react';
import { Switch, Tooltip } from 'antd'; 
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '@/components/providers/ThemeProvider';

const ThemeToggle: React.FC = () => { 
  const { currentTheme, toggleTheme } = useTheme();

  return (
    <Tooltip title={`Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Mode`}>
      <Switch
        checkedChildren={<BulbFilled style={{ color: 'gold' }} />}
        unCheckedChildren={<BulbOutlined style={{ color: 'grey' }} />}
        checked={currentTheme === 'dark'}
        onChange={toggleTheme} 
        style={{ marginRight: 16 }}
      />
    </Tooltip>
  );
};

export default ThemeToggle;
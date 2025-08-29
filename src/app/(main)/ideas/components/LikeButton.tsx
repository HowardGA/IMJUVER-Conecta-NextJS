'use client';

import React from 'react';
import { Button, Tooltip } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';

interface LikeButtonProps {
  ideaId: number;
  likedByMe: boolean; 
  likeCount: number;
  loading: boolean;
  onToggleLike: (ideaId: number, isLiked: boolean) => void; 
  disabled?: boolean; 
}

const LikeButton: React.FC<LikeButtonProps> = ({
  ideaId,
  likedByMe,
  likeCount,
  loading,
  onToggleLike,
  disabled = false,
}) => {
  return (
    <Tooltip title={likedByMe ? 'Quitar Me gusta' : 'Me gusta'}>
      <Button
        type="text"
        icon={likedByMe ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
        onClick={() => onToggleLike(ideaId, likedByMe)}
        loading={loading}
        disabled={disabled || loading}
        aria-label={likedByMe ? 'Quitar Me gusta' : 'Me gusta'} 
      >
        {likeCount}
      </Button>
    </Tooltip>
  );
};

export default LikeButton;
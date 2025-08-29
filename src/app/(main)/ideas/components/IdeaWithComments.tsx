'use client';
import React, { useState } from 'react';
import IdeaCard from './IdeaCard';
import {
    useGetComments,
    useCreateComment,
    useDeleteComment,
} from '@/hooks/ideasHooks';
import { Idea, CreateCommentPayload, EstadoPropuesta } from '@/interfaces/ideaInterfaces';
import { message } from 'antd';

interface IdeaWithCommentsProps {
    idea: Idea;
    currentUserId: number | null;
    onToggleLike: (ideaId: number, isLiked: boolean) => Promise<void>;
    onDeleteIdea: (ideaId: number) => Promise<void>;
    onEditIdea: (idea: Idea) => void;
    deletingIdea: boolean;
    togglingLike: boolean;
    isAdmin: boolean;
    onUpdateStatus: (ideaId: number, newStatus: EstadoPropuesta) => Promise<void>; 
}

const IdeaWithComments: React.FC<IdeaWithCommentsProps> = ({
    idea,
    currentUserId,
    onToggleLike,
    onDeleteIdea,
    onEditIdea,
    deletingIdea,
    togglingLike,
    isAdmin,
    onUpdateStatus
}) => {
    const [commentsAreExpanded, setCommentsAreExpanded] = useState(false);
    const createCommentMutation = useCreateComment();
    const deleteCommentMutation = useDeleteComment();

    const { data: comments = [], isLoading: isLoadingCommentsForIdea } = useGetComments(
        idea.idea_id,
        commentsAreExpanded
    );

    const handleToggleCommentsVisibility = () => {
        setCommentsAreExpanded(prev => !prev);
    };

    const handleAddComment = async (ideaId: number, payload: CreateCommentPayload) => {
        if (!currentUserId) {
            message.warning('Please log in to add a comment.');
            return;
        }
        await createCommentMutation.mutateAsync({ ideaId, commentData: payload });
    };

    const handleDeleteComment = async (commentId: number) => { 
        await deleteCommentMutation.mutateAsync({ commentId, ideaId: idea.idea_id });
    };


    return (
        <IdeaCard
            idea={idea}
            currentUserId={currentUserId}
            likedByMe={idea.isLikedByMe || false}
            comments={comments}
            loadingComments={isLoadingCommentsForIdea}
            addingComment={createCommentMutation.isPending && createCommentMutation.variables?.ideaId === idea.idea_id}
            deletingCommentId={deleteCommentMutation.isPending ? (deleteCommentMutation.variables as { commentId: number, ideaId: number })?.commentId : null}
            onLoadComments={handleToggleCommentsVisibility} 
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onToggleLike={onToggleLike}
            onDeleteIdea={onDeleteIdea}
            onEditIdea={onEditIdea}
            deletingIdea={deletingIdea}
            togglingLike={togglingLike}
            isAdmin={isAdmin} 
            onUpdateStatus={onUpdateStatus}
        />
    );
};

export default IdeaWithComments;
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/components/providers/QueryProvider';
import { createCommentOnIdea, createIdea, deleteIdea, getAllIdeas,
    getCommentsForIdea, giveLikeToIdea, removeLikeFromIdea, deleteComment, 
    changeIdeaState, updateIdea, getPrivateIdeas} from '@/services/ideaServices';
import { AxiosError } from 'axios';
import { message as antdMessage } from 'antd';
import { Idea, Comment, CreateIdeaPayload, CreateCommentPayload, UpdateIdeaPayload } from '@/interfaces/ideaInterfaces';

export const useGetAllIdeas = () => {
  return useQuery<Idea[], AxiosError>({ 
    queryKey: ['ideas'],
    queryFn: getAllIdeas,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetPrivateIdeas = () => {
  return useQuery<Idea[], AxiosError>({ 
    queryKey: ['privateIdeas'],
    queryFn: getPrivateIdeas,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetComments = (ideaId: number, enabled: boolean = false) => {
  return useQuery<Comment[], AxiosError>({
    queryKey: ['comments', ideaId],
    queryFn: () => getCommentsForIdea(ideaId),
    staleTime: 1000 * 60 * 5, 
    enabled: enabled, 
  });
};

interface CustomMutationOptions {
  onSuccessMessage?: string;
  onErrorMessage?: string;
}

export const useCreateIdea = (options?: CustomMutationOptions) => {
    return useMutation<Idea, AxiosError, CreateIdeaPayload>({ 
        mutationFn: createIdea, 
        onSuccess: () => {
            antdMessage.success(options?.onSuccessMessage || `Propuesta creada con éxito.`);
            queryClient.invalidateQueries({ queryKey: ['ideas'] });
        },
        onError: (error) => {
            console.error(`Error creating idea:`, error);
            antdMessage.error(options?.onErrorMessage || `Error al crear propuesta: ${error.message}`);
        },
    });
};

export const useDeleteIdea = (options?: CustomMutationOptions) => {
    return useMutation<void, AxiosError, number>({ 
        mutationFn: deleteIdea,
        onSuccess: (data, ideaId) => { 
            antdMessage.success(options?.onSuccessMessage || `Propuesta #${ideaId} eliminada con éxito.`);
            queryClient.invalidateQueries({ queryKey: ['ideas'] });
        },
        onError: (error) => {
            console.error(`Error deleting idea:`, error);
            antdMessage.error(options?.onErrorMessage || `Error al eliminar propuesta: ${error.message}`);
        },
    });
};

export const useUpdateIdea = (options?: CustomMutationOptions) => {
    return useMutation<Idea, AxiosError, { ideaId: number; payload: UpdateIdeaPayload }>({
        mutationFn: ({ ideaId, payload }) => updateIdea(ideaId, payload),
        onSuccess: (data, variables) => {
            antdMessage.success(options?.onSuccessMessage || `Propuesta #${variables.ideaId} actualizada con éxito.`);
            queryClient.invalidateQueries({ queryKey: ['ideas'] });
        },
        onError: (error) => {
            console.error(`Error updating idea:`, error);
            antdMessage.error(options?.onErrorMessage || `Error al actualizar propuesta: ${error.message}`);
        },
    });
};


export const useToggleLike = (options?: CustomMutationOptions) => {
    return useMutation<Idea, AxiosError, { ideaId: number; isLiked: boolean }>({ 
        mutationFn: async ({ ideaId, isLiked }) => {
            if (isLiked) {
                return removeLikeFromIdea(ideaId);
            } else {
                return giveLikeToIdea(ideaId);
            }
        },
        onMutate: async ({ ideaId, isLiked }) => {
            console.log(`Toggling like for idea #${ideaId}, isLiked: ${isLiked}`);
            await queryClient.invalidateQueries({ queryKey: ['ideas'] });
        },
        onError: (error, variables, context) => {
            antdMessage.error(options?.onErrorMessage || `Error al ${variables.isLiked ? 'retirar' : 'dar'} me gusta: ${error.message}`);
            queryClient.setQueryData(['ideas'],context); 
        },
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: ['ideas'] });
            antdMessage.success(options?.onSuccessMessage || `Me gusta ${variables.isLiked ? 'retirado' : 'registrado'}.`);
        },
    });
};

export const useCreateComment = (options?: CustomMutationOptions) => {
  return useMutation<Comment, AxiosError, { ideaId: number, commentData: CreateCommentPayload }>({
    mutationFn: ({ ideaId, commentData }) => createCommentOnIdea(ideaId, commentData),
    onSuccess: (newComment) => {
      antdMessage.success(options?.onSuccessMessage || 'Comentario añadido con éxito.');
      queryClient.invalidateQueries({ queryKey: ['comments', newComment.comentario_id] });
      queryClient.invalidateQueries({ queryKey: ['ideas'] }); 
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      antdMessage.error(options?.onErrorMessage || `Error al añadir comentario: ${error.message}`);
    },
  });
};

export const useDeleteComment = (options?: CustomMutationOptions) => {
  return useMutation<void, AxiosError, { commentId: number, ideaId: number }>({ 
    mutationFn: ({ commentId }) => deleteComment(commentId),
    onSuccess: (_, variables) => { 
      antdMessage.success(options?.onSuccessMessage || 'Comentario eliminado con éxito.');
      queryClient.invalidateQueries({ queryKey: ['comments', variables.ideaId] }); 
      queryClient.invalidateQueries({ queryKey: ['ideas'] }); 
    },
    onError: (error) => {
      console.error('Error deleting comment:', error);
      antdMessage.error(options?.onErrorMessage || `Error al eliminar comentario: ${error.message}`);
    },
  });
};

export const useChangeStatus = (options?: CustomMutationOptions) => {
    return useMutation<Idea, AxiosError, { ideaId: number; newState: Idea['estado'] }>({ 
        mutationFn: ({ ideaId, newState }) => changeIdeaState(ideaId, newState),
        onSuccess: (data, variables) => {
            antdMessage.success(options?.onSuccessMessage || `Estado de propuesta #${variables.ideaId} actualizado a ${variables.newState}.`);
            queryClient.invalidateQueries({ queryKey: ['ideas'] }); 
        },
        onError: (error) => {
            console.error(`Error changing idea state:`, error);
            antdMessage.error(options?.onErrorMessage || `Error al cambiar estado de propuesta: ${error.message}`);
        },
    });
};
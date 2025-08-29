import { Idea, Comment, CreateIdeaPayload, CreateCommentPayload, UpdateIdeaPayload } from "@/interfaces/ideaInterfaces";
import apiClient from "@/lib/apiClient";

export const createIdea = async(ideaData: CreateIdeaPayload): Promise<Idea> => {
    const response = await apiClient.post<Idea>('/propuestas/', ideaData);
    return response.data;
}

export const getAllIdeas = async (): Promise<Idea[]> => {
    const response = await apiClient.get<Idea[]>('/propuestas/');
    return response.data;
}

export const getPrivateIdeas = async (): Promise<Idea[]> => {
    const response = await apiClient.get<Idea[]>('/propuestas/private');
    console.log(response.data)
    return response.data;
}

export const deleteIdea = async (ideaId: number): Promise<void> => {
    await apiClient.delete(`/propuestas/${ideaId}`);
}

export const giveLikeToIdea = async (ideaId: number): Promise<Idea> => { 
    const response = await apiClient.post(`/propuestas/${ideaId}/likes`);
    return response.data;
}

export const removeLikeFromIdea = async (ideaId: number): Promise<Idea> => { 
    const response = await apiClient.delete(`/propuestas/${ideaId}/likes`);
    return response.data;
}

export const createCommentOnIdea = async (ideaId: number, commentData: CreateCommentPayload): Promise<Comment> => {
    const response = await apiClient.post<Comment>(`/propuestas/${ideaId}/comments`, commentData);
    return response.data;
}

export const getCommentsForIdea = async (ideaId: number): Promise<Comment[]> => {
    const response = await apiClient.get<Comment[]>(`/propuestas/${ideaId}/comments`);
    return response.data;
}

export const deleteComment = async (commentId: number): Promise<void> => {
    await apiClient.delete(`/propuestas/comments/${commentId}`);
}

export const changeIdeaState = async (ideaId: number, newState: Idea['estado']): Promise<Idea> => {
    const response = await apiClient.patch<Idea>(`/propuestas/${ideaId}/status`, { newStatus: newState });
    return response.data;
}

export const updateIdea = async (ideaId: number, payload: UpdateIdeaPayload): Promise<Idea> => {
    const response = await apiClient.patch<Idea>(`/propuestas/${ideaId}`, payload); 
    return response.data;
}
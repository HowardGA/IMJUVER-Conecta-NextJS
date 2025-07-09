import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminStats, UserData, UpdateUserRolePayload, RoleData } from '@/interfaces/adminInterface';
import { getAllUsers, getAdminStats, deleteUser, updateUserRole, getAllRoles } from '@/services/adminServices';
import { AxiosError } from 'axios';
import { MessageInstance } from 'antd/es/message/interface';
import { queryClient } from '@/components/providers/QueryProvider';

interface UseMutationOptions<TVariables, TData = void> {
    onSuccessCallback?: (data: TData, variables: TVariables, context: unknown) => void;
    onErrorCallback?: (error: AxiosError, variables: TVariables, context: unknown) => void;
    messageApi?: MessageInstance;
}

export const useGetAdminStats = () => {
    return useQuery<AdminStats, Error>({
        queryKey: ['adminStats'],
        queryFn: getAdminStats,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetAllUsers = () => {
    return useQuery<UserData[], Error>({
        queryKey: ['allUsers'],
        queryFn: getAllUsers,
        staleTime: 1000 * 60 * 5,
    });
};

export const useDeleteUser = (options?: UseMutationOptions<number, void>) => {
    return useMutation<void, AxiosError, number>({
        mutationFn: async (userId: number) => {
            await deleteUser(userId);
        },
        onSuccess: (data, userId) => { 
            options?.messageApi?.success(`Usuario ${userId} eliminado con éxito.`);
            queryClient.invalidateQueries({ queryKey: ['allUsers'] }); 
            options?.onSuccessCallback?.(data, userId, null); 
        },
        onError: (error, userId) => {
            console.error(`Error deleting user ${userId}:`, error);
            options?.messageApi?.error(`Error al eliminar usuario ${userId}: ${error.message}`);
            options?.onErrorCallback?.(error, userId, null);
        },
    });
};

export const useUpdateUserRole = (options?: UseMutationOptions<UpdateUserRolePayload, UserData>) => {
    return useMutation<UserData, AxiosError, UpdateUserRolePayload>({
        mutationFn: async (payload: UpdateUserRolePayload) => {
            return updateUserRole(payload);
        },
        onSuccess: (updatedUser, payload) => { 
            options?.messageApi?.success(`Rol de ${updatedUser.nombre} ${updatedUser.apellido} actualizado a ${updatedUser.rol.nombre}.`);
            queryClient.invalidateQueries({ queryKey: ['allUsers'] });
            queryClient.invalidateQueries({ queryKey: ['user', payload.userId] });
            options?.onSuccessCallback?.(updatedUser, payload, null);
        },
        onError: (error, payload) => {
            console.error(`Error updating role for user ${payload.userId}:`, error);
            options?.messageApi?.error(`Error al actualizar rol de usuario ${payload.userId}: ${error.message}`);
            options?.onErrorCallback?.(error, payload, null);
        },
    });
};

export const useGetAllRoles = () => {
    return useQuery<RoleData[], Error>({
        queryKey: ['allRoles'],
        queryFn: getAllRoles,
        staleTime: Infinity,
    });
};

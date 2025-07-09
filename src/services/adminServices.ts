import apiClient from "@/lib/apiClient";
import { AdminStats, UserData, UpdateUserRolePayload, RoleData } from "@/interfaces/adminInterface";

export const getAdminStats = async (): Promise<AdminStats> => {
    const response = await apiClient.get('/user/admin/stats');
    return response.data;
};

export const getAllUsers = async (): Promise<UserData[]> => {
    const response = await apiClient.get('/user/users/complete');
    return response.data;
};

export const deleteUser = async (userId: number): Promise<void> => {
    await apiClient.delete(`/user/users/${userId}`);
};

export const updateUserRole = async ({ userId, newRoleId }: UpdateUserRolePayload): Promise<UserData> => {
    const response = await apiClient.put(`/user/users/${userId}/role`, { rol_id: newRoleId });
    return response.data;
};

export const getAllRoles = async (): Promise<RoleData[]> => {
    const response = await apiClient.get('/roles/'); 
    return response.data;
};
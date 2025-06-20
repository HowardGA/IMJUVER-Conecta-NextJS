import { UserResponse } from "@/interfaces/userInterface";
import apiClient from "@/lib/apiClient";

export const getUserInfo = async (userId: number): Promise<UserResponse> => {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
}
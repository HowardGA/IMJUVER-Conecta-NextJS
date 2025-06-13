import apiClient from "@/lib/apiClient";
import { LoginForm, RegisterForm, UserData, RegistrationSuccessResponse, VerificationResponse } from "@/interfaces/authInterface";

export const login = async (credentials: LoginForm): Promise<UserData> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data.user;
}

export const register = async (formData: RegisterForm): Promise<RegistrationSuccessResponse> => {
    const response = await apiClient.post<RegistrationSuccessResponse>('/auth/register', formData)
    return response.data;
}

export const fetchCurrentUser = async(): Promise<UserData> => {
        const response = await apiClient.get('/auth/me');
        return response.data.user;
}

export const logoutUser = async (): Promise<void> => {
    await apiClient.post('/auth/logout')
}

export const resendVerificationEmail = async (email: string): Promise<{ message: string; status: string }> => {
  const response = await apiClient.post('/auth/resend-verification-email', { email });
  return response.data;
};



export const verifyEmail = async (token: string): Promise<VerificationResponse> => {
  const response = await apiClient.get(`/auth/verify-email/${token}`);
  return response.data;
};